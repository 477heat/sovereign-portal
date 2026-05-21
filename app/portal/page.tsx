"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import {
  CheckoutWidget,
  ConnectButton,
  ThirdwebProvider,
  useActiveAccount,
} from "thirdweb/react";
import {
  contractLanguage,
  contractLanguageVersion,
} from "./contractLanguage";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import TunnelBackdrop from "@/components/TunnelBackdrop";

type VerificationState = {
  eligible: boolean;
  mode: "mock" | "live";
  schemaId: string;
  message: string;
};

type MintReceipt = {
  tokenId?: string;
  status: string;
  deedName: string;
  mode?: "mock" | "live";
  chainId?: number;
  contractAddress?: string;
  transactionId?: string;
  transactionHash?: string;
  tokenURI?: string;
};

type MintOrderState = {
  orderId: string;
  status: "pending_payment" | "paid" | "minting" | "mint_submitted";
  wallet: string;
};

const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
  : null;
const paymentAmount = process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ?? "2.50";
const paymentSeller = process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
const paymentTokenAddress =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
const checkoutEnabled =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_MODE === "checkout" &&
  Boolean(paymentSeller && paymentTokenAddress);

const steps = [
  "Wallet",
  "Attestation",
  "Identity",
  "Deed Review",
  "Payment",
  "Mint",
];

const statPreview = [
  "Presence",
  "Wealth",
  "Fortitude",
  "Cunning",
  "Flair",
  "Vigor",
  "Kinship",
  "Potency",
  "Wisdom",
  "Prestige",
  "Influence",
  "Arcana",
];

function buildPublicMark(firstName: string, lastName: string) {
  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const surnameRoot = lastName.replace(/[^a-z]/gi, "").slice(0, 3);

  if (!firstInitial || !surnameRoot) {
    return "_. ___";
  }

  return `${firstInitial}. ${
    surnameRoot.charAt(0).toUpperCase() + surnameRoot.slice(1).toLowerCase()
  }`;
}

function shortAddress(address?: string) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function PortalContent() {
  const account = useActiveAccount();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [verification, setVerification] = useState<VerificationState | null>(
    null,
  );
  const [checkingAttestation, setCheckingAttestation] = useState(false);
  const [accuracyAccepted, setAccuracyAccepted] = useState(false);
  const [publicMarkAccepted, setPublicMarkAccepted] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [minting, setMinting] = useState(false);
  const [receipt, setReceipt] = useState<MintReceipt | null>(null);
  const [mintOrder, setMintOrder] = useState<MintOrderState | null>(null);
  const [orderBusy, setOrderBusy] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState("");
  const [error, setError] = useState("");

  const publicMark = useMemo(
    () => buildPublicMark(firstName, lastName),
    [firstName, lastName],
  );
  const deedName =
    publicMark === "_. ___"
      ? "Deed for Soul Ownership"
      : `Deed for Soul Ownership of ${publicMark}`;
  const hasIdentity = publicMark !== "_. ___" && Boolean(dob);
  const deedAccepted =
    accuracyAccepted && publicMarkAccepted && contractAccepted;
  const checkoutReady =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted;
  const orderPaid =
    !checkoutEnabled ||
    mintOrder?.status === "paid" ||
    mintOrder?.status === "minting" ||
    mintOrder?.status === "mint_submitted";
  const canMint =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted &&
    orderPaid &&
    !minting;

  useEffect(() => {
    let ignore = false;

    async function checkAttestation() {
      if (!account?.address) {
        setVerification(null);
        setCheckingAttestation(false);
        return;
      }

      setCheckingAttestation(true);
      setError("");

      try {
        const response = await fetch(`/api/attestation?address=${account.address}`);
        const result = (await response.json()) as VerificationState;

        if (!ignore) {
          setVerification(result);
        }
      } catch {
        if (!ignore) {
          setError("Attestation service is not responding yet.");
          setVerification(null);
        }
      } finally {
        if (!ignore) {
          setCheckingAttestation(false);
        }
      }
    }

    checkAttestation();

    return () => {
      ignore = true;
    };
  }, [account?.address]);

  async function handleMint() {
    if (!canMint || !account?.address) {
      return;
    }

    setMinting(true);
    setError("");
    setReceipt(null);

    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: account.address,
          firstName,
          lastName,
          dob,
          publicMark,
          contractAccepted,
          contractLanguageVersion,
          orderId: mintOrder?.orderId,
        }),
      });

      if (!response.ok) {
        const failure = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(failure?.message ?? "Mint request failed.");
      }

      const result = (await response.json()) as MintReceipt;
      setReceipt(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Mint request failed. The backend route is ready for wiring.",
      );
    } finally {
      setMinting(false);
    }
  }

  async function createOrder() {
    if (!checkoutReady || !account?.address) {
      return;
    }

    setOrderBusy(true);
    setError("");
    setPaymentNotice("");

    try {
      const response = await fetch("/api/mint-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: account.address,
          publicMark,
        }),
      });
      const result = (await response.json()) as MintOrderState & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not prepare checkout.");
      }

      setMintOrder(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not prepare checkout.",
      );
    } finally {
      setOrderBusy(false);
    }
  }

  async function refreshOrder() {
    if (!mintOrder) {
      return;
    }

    setOrderBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/mint-order/${mintOrder.orderId}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as MintOrderState & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not refresh payment status.");
      }

      setMintOrder(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not refresh payment status.",
      );
    } finally {
      setOrderBusy(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 py-5 text-white md:px-8 md:py-8">
      <TunnelBackdrop className="opacity-70" />
      <BackgroundHashStream className="z-0 opacity-45 md:opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col gap-5">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
          >
            Return Home
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Sovereign Portal
          </div>
        </nav>

        <section className="grid flex-1 gap-5 xl:grid-cols-[220px_minmax(0,1fr)_340px]">
          <aside className="border border-white/10 bg-black/55 p-4 backdrop-blur-[2px]">
            <div className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/45">
              Gate Status
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const complete =
                  (index === 0 && Boolean(account?.address)) ||
                  (index === 1 && Boolean(verification?.eligible)) ||
                  (index === 2 && hasIdentity) ||
                  (index === 3 && deedAccepted) ||
                  (index === 4 && orderPaid) ||
                  (index === 5 && Boolean(receipt));

                return (
                  <div
                    key={step}
                    className={`flex items-center justify-between border px-3 py-3 text-xs ${
                      complete
                        ? "border-yellow-300/50 bg-yellow-300/10 text-yellow-200"
                        : "border-white/10 bg-white/[0.03] text-white/45"
                    }`}
                  >
                    <span>{step}</span>
                    <span>{complete ? "CLEARED" : "WAITING"}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-white/55">
              Wallet attestation confirms eligibility on Base mainnet. The deed
              inscription is generated from the name and birth date entered
              here.
            </div>
          </aside>

          <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="border border-white/10 bg-black/70 p-5 shadow-[0_0_56px_rgba(81,197,255,0.07)] backdrop-blur-[2px] md:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300/70">
                    Genesis Mint Intake
                  </p>
                  <h1 className="mt-3 max-w-2xl text-3xl font-light uppercase tracking-[0.12em] md:text-4xl">
                    {deedName}
                  </h1>
                </div>
                <div className="min-w-44 text-right text-xs uppercase tracking-[0.2em] text-white/50">
                  {shortAddress(account?.address)}
                </div>
              </div>

              <div className="mb-5 border border-yellow-300/20 bg-yellow-300/[0.06] p-4 text-sm leading-6 text-white/75">
                <p className="text-white/90">Welcome in.</p>
                <p className="mt-2">
                  This contract creates your onchain deed and generated soul
                  artifact on Base after the portal checks the mint requirements
                  below. I built it to help fund the Engine&apos;s evolution and
                  future deployments, because apparently every big idea I have
                  arrives with a hosting bill and a dramatic entrance. Mint one
                  and join the ridiculousness.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="space-y-4">
                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/45">
                      Wallet
                    </div>
                    {thirdwebClient ? (
                      <ConnectButton
                        client={thirdwebClient}
                        chains={[base]}
                        connectModal={{ size: "compact" }}
                      />
                    ) : (
                      <div className="text-sm leading-6 text-white/65">
                        Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live
                        wallet connector.
                      </div>
                    )}
                  </div>

                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                        Coinbase EAS
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] ${
                          verification?.eligible
                            ? "text-yellow-300"
                            : "text-white/40"
                        }`}
                      >
                        {checkingAttestation
                          ? "Checking"
                          : verification?.eligible
                            ? "Eligible"
                            : "Awaiting Wallet"}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-white/65">
                      {verification?.message ??
                        "Connect a Base mainnet wallet to check for a valid Coinbase Verified Account attestation."}
                    </p>
                    {verification?.mode === "mock" && (
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-200/70">
                        Mock attestation mode
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-white/45">
                      Legal First Name
                    </span>
                    <input
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                      placeholder="Jeffrey"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-white/45">
                      Legal Surname
                    </span>
                    <input
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                      placeholder="Mccormick"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-white/45">
                      Date of Birth
                    </span>
                    <input
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      type="date"
                      className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                    />
                  </label>

                  <div className="border border-yellow-300/30 bg-yellow-300/10 p-4">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-yellow-200/80">
                      Public Covenant Mark
                    </div>
                    <div className="mt-2 text-2xl tracking-[0.18em] text-yellow-100">
                      {publicMark}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-yellow-100/70">
                      Only this shortened mark is shown on the public deed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                      Contract Agreement
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Version {contractLanguageVersion}
                    </div>
                  </div>
                  <div className="mt-4 max-h-72 space-y-3 overflow-y-auto border border-white/10 bg-black/70 p-4 text-xs leading-6 text-white/65">
                    {contractLanguage.map((paragraph, index) => {
                      const isHeading =
                        index === 0 || paragraph.startsWith("SECTION ");

                      return (
                        <p
                          key={`${paragraph.slice(0, 24)}-${index}`}
                          className={
                            isHeading
                              ? "text-yellow-100 uppercase tracking-[0.18em]"
                              : ""
                          }
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-white/65">
                <label className="flex gap-3">
                  <input
                    checked={contractAccepted}
                    onChange={(event) =>
                      setContractAccepted(event.target.checked)
                    }
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-yellow-300"
                  />
                  <span>
                    I have read and agree to the Deed of Spiritual Conveyance
                    before minting.
                  </span>
                </label>
                <label className="flex gap-3">
                  <input
                    checked={accuracyAccepted}
                    onChange={(event) =>
                      setAccuracyAccepted(event.target.checked)
                    }
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-yellow-300"
                  />
                  <span>
                    I attest that the information entered is accurate and may
                    be used to generate my deed.
                  </span>
                </label>
                <label className="flex gap-3">
                  <input
                    checked={publicMarkAccepted}
                    onChange={(event) =>
                      setPublicMarkAccepted(event.target.checked)
                    }
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-yellow-300"
                  />
                  <span>
                    I understand the public inscription will display the
                    shortened covenant mark, not the full name.
                  </span>
                </label>
              </div>

              {error && (
                <div className="mt-5 border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              {checkoutEnabled && (
                <div className="mt-5 border border-cyan-100/20 bg-cyan-100/[0.06] p-4">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/72">
                    Checkout
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
                    The deed mint is priced at {paymentAmount} USDC. The portal
                    prepares a payment order first, then the backend funds the
                    onchain mint and its gas after the verified payment webhook
                    marks that order paid.
                  </p>
                  {!mintOrder && (
                    <button
                      className="mt-4 min-h-12 border border-cyan-100/45 bg-cyan-100/10 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-100/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35"
                      disabled={!checkoutReady || orderBusy}
                      onClick={createOrder}
                      type="button"
                    >
                      {orderBusy ? "Preparing" : `Prepare ${paymentAmount} Checkout`}
                    </button>
                  )}
                  {mintOrder && thirdwebClient && paymentSeller && paymentTokenAddress && (
                    <div className="mt-4 grid gap-3">
                      <CheckoutWidget
                        amount={paymentAmount}
                        chain={base}
                        client={thirdwebClient}
                        description="Verified mint order for the Sovereign Portal deed."
                        feePayer="seller"
                        name="Deed for Soul Ownership"
                        onSuccess={() => {
                          setPaymentNotice(
                            "Checkout completed. Refresh until the verified webhook marks this mint order paid.",
                          );
                        }}
                        purchaseData={{
                          orderId: mintOrder.orderId,
                          publicMark,
                          wallet: account?.address,
                        }}
                        seller={paymentSeller as `0x${string}`}
                        showThirdwebBranding={false}
                        tokenAddress={paymentTokenAddress as `0x${string}`}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/55 px-3 py-3 text-xs text-white/58">
                        <span className="break-all">
                          Order {mintOrder.orderId} / {mintOrder.status}
                        </span>
                        <button
                          className="border border-white/15 px-3 py-2 uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-100/45"
                          disabled={orderBusy}
                          onClick={refreshOrder}
                          type="button"
                        >
                          Refresh Status
                        </button>
                      </div>
                      {paymentNotice && (
                        <p className="text-sm leading-6 text-cyan-50/72">
                          {paymentNotice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-4 border border-yellow-200/25 bg-yellow-200/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.28em] text-yellow-100/72">
                    Mint Action
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">
                    Generate the deed after wallet eligibility, identity, and
                    agreement review are cleared.
                  </p>
                </div>
                <button
                  onClick={handleMint}
                  disabled={!canMint}
                  className="min-h-16 w-full border border-yellow-300/50 bg-yellow-300 px-5 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 sm:w-auto sm:min-w-60"
                >
                  {minting ? "Minting" : "Generate Deed"}
                </button>
              </div>

              {receipt && (
                <div className="mt-4 border border-yellow-300/40 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-yellow-200/70">
                    {receipt.mode === "live"
                      ? "Mainnet Mint Submitted"
                      : "Mainnet Route Ready"}
                  </div>
                  <div className="mt-2">{receipt.deedName}</div>
                  <div className="text-yellow-100/70">
                    Base chain {receipt.chainId ?? 8453}
                  </div>
                  {receipt.contractAddress && (
                    <div className="break-all text-yellow-100/70">
                      {receipt.contractAddress}
                    </div>
                  )}
                  {receipt.transactionHash && (
                    <div className="break-all text-yellow-100/70">
                      {receipt.transactionHash}
                    </div>
                  )}
                  {!receipt.transactionHash && receipt.transactionId && (
                    <div className="break-all text-yellow-100/70">
                      {receipt.transactionId}
                    </div>
                  )}
                  {receipt.tokenURI && (
                    <div className="break-all text-yellow-100/70">
                      {receipt.tokenURI}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-white/10 bg-black/55 p-4 backdrop-blur-[2px]">
              <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/45">
                Stat Frame
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statPreview.map((stat) => (
                  <div
                    key={stat}
                    className="border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70"
                  >
                    {stat}
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-white/10 bg-white/[0.03] p-3">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                  Karmic Debt
                </div>
                <div className="mt-2 text-3xl text-yellow-200">Pending</div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col self-start border border-white/10 bg-black/70 p-4 shadow-[0_0_56px_rgba(81,197,255,0.07)] backdrop-blur-[2px] xl:sticky xl:top-8">
            <div className="relative min-h-[420px] overflow-hidden border border-white/10 bg-white/[0.03]">
              <Image
                src="/Satoshi_Nakamoto.png"
                alt="Mock Genesis deed preview"
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-contain object-top opacity-70"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                  Preview Inscription
                </div>
                <div className="mt-2 text-lg uppercase tracking-[0.12em] text-yellow-100">
                  {publicMark}
                </div>
              </div>
            </div>

          </aside>
        </section>
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <ThirdwebProvider>
      <PortalContent />
    </ThirdwebProvider>
  );
}
