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
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import {
  contractLanguage,
  contractLanguageVersion,
} from "./contractLanguage";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { buildMintOrderStatusMessage } from "@/lib/portalMessages";

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
const architectOpenSeaUrl =
  "https://opensea.io/item/base/0x8453b77c845c913d8ca3d1a265ba17fc6aa5ea65/0";

const steps = ["Wallet", "EAS", "Identity", "Terms", "Payment", "Mint"];

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
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
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
      ? "Certificate of Title for Soul Ownership"
      : `Certificate of Title for Soul Ownership of ${publicMark}`;
  const hasIdentity = publicMark !== "_. ___" && Boolean(dob);
  const deedAccepted =
    accuracyAccepted && publicMarkAccepted && contractAccepted;
  const activeOrder =
    mintOrder?.wallet === account?.address?.toLowerCase() ? mintOrder : null;
  const checkoutReady =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted;
  const orderPaid =
    !checkoutEnabled ||
    activeOrder?.status === "paid" ||
    activeOrder?.status === "minting" ||
    activeOrder?.status === "mint_submitted";
  const canMint =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted &&
    orderPaid &&
    !minting;
  const progress = [
    { label: steps[0], complete: Boolean(account?.address) },
    { label: steps[1], complete: Boolean(verification?.eligible) },
    { label: steps[2], complete: hasIdentity },
    { label: steps[3], complete: deedAccepted },
    { label: steps[4], complete: orderPaid },
    { label: steps[5], complete: Boolean(receipt) },
  ];
  const nextStep =
    progress.find((step) => !step.complete)?.label ?? "Complete";

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
          orderId: activeOrder?.orderId,
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
    if (!activeOrder || !account?.address) {
      return;
    }

    setOrderBusy(true);
    setError("");

    try {
      const signature = await account.signMessage({
        message: buildMintOrderStatusMessage({
          wallet: account.address,
          orderId: activeOrder.orderId,
        }),
      });
      const params = new URLSearchParams({
        wallet: account.address,
        signature,
      });
      const response = await fetch(`/api/mint-order/${activeOrder.orderId}?${params}`, {
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
      <TunnelBackdrop />
      <BackgroundHashStream className="z-0 opacity-20 md:opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-5">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <Link
            href="/"
            className="chamfer-nav-link chamfer-nav-link--compact tracking-[0.22em]"
          >
            Return Home
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Sovereign Portal
          </div>
        </nav>

        <section className="flex flex-1 flex-col gap-5">
          <div className="border border-white/10 bg-black/55 p-4 shadow-[0_0_56px_rgba(81,197,255,0.06)] backdrop-blur-[2px] md:p-5">
            <div className="mb-5 border border-yellow-300/35 bg-yellow-300/[0.09] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xl font-semibold uppercase tracking-[0.16em] text-yellow-100 md:text-2xl">
                  One Person. One Genesis Mint.
                </div>
                <a
                  href="#one-person-one-mint"
                  className="text-[10px] uppercase tracking-[0.24em] text-yellow-200/75 underline-offset-4 transition hover:text-yellow-100 hover:underline"
                >
                  Why this rule exists
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300/70">
                  Genesis Soul Registry
                </p>
                <h1 className="mt-3 max-w-3xl text-3xl font-light uppercase tracking-[0.12em] md:text-5xl">
                  {deedName}
                </h1>
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-white/45">
                <div>Next: {nextStep}</div>
                <div className="mt-2 font-mono text-white/65">
                  {shortAddress(account?.address)}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {progress.map((step) => (
                <div
                  key={step.label}
                  className={`border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${
                    step.complete
                      ? "border-yellow-300/45 bg-yellow-300/10 text-yellow-200"
                      : "border-white/10 bg-white/[0.025] text-white/38"
                  }`}
                >
                  {step.label}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/68 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)]">
              <p>
                This portal creates an onchain Certificate of Title for Soul
                Ownership on Base after wallet eligibility, payment, and
                agreement checks are complete. The mint helps fund Engine
                evolution and future deployments. Join the ridiculousness, but
                read the terms before signing the cosmic receipt.
              </p>
              <p className="border border-yellow-300/20 bg-yellow-300/[0.06] p-3 text-yellow-50/78">
                Creative product, not legal, religious, medical, or financial
                advice. Royalties depend on marketplace support, and public NFT
                metadata is effectively permanent.
              </p>
            </div>
          </div>

          <section
            id="one-person-one-mint"
            className="border border-white/10 bg-black/55 p-4 text-sm leading-6 text-white/68 backdrop-blur-[2px]"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
              Why one per person
            </div>
            <p className="mt-2 max-w-4xl">
              Genesis deeds are meant to represent individual entry into the
              registry, not repeat-wallet farming. The portal uses Coinbase EAS
              eligibility and the mint ledger to reduce duplicate participation.
              Raw name and DOB details submitted for the deed are used only to
              generate the mint request, then purged after mint completion. They
              are not sold, shared, or stored by our servers.
            </p>
            <p className="mt-4 max-w-4xl">
              The soul is the origin point. It is brought into a body; the body
              lives, creates children, gathers material things, and tries to do
              the best it can with the traits it was born with. The Certificate
              treats that origin as the first entry in the Engine record.
            </p>
            <p className="mt-4 max-w-4xl">
              This Certificate also functions as a Soul Deed Access token.
              Holders of this access token, or any future access tokens, are
              guaranteed access to Progeny when that Engine branch opens.
            </p>
          </section>

          <section className="grid gap-5 border border-white/10 bg-black/60 p-4 backdrop-blur-[2px] lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="relative min-h-[300px] overflow-hidden border border-yellow-300/20 bg-black/45">
              <Image
                src="/architect_deed.jpg"
                alt="The Architect Soul Deed listed on OpenSea"
                fill
                sizes="(max-width: 1024px) 100vw, 220px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                The Architect&apos;s Soul
              </div>
              <h2 className="mt-3 text-2xl font-light uppercase tracking-[0.14em] text-white md:text-3xl">
                Yes, I listed mine first.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68">
                This is my minted Architect contract, token 0 in the Soul deed
                collection. It is listed on OpenSea for anyone who wants to own
                the ceremonial paperwork to my soul. So if you&apos;re looking for
                a servant in the afterlife, I can safely say I&apos;m the first to
                sell it publicly.
              </p>
              <Link
                href={architectOpenSeaUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 w-fit items-center border border-yellow-300/45 bg-yellow-300/10 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-300/20"
              >
                View The Listing
              </Link>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="border border-white/10 bg-black/60 p-4 backdrop-blur-[2px]">
                <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Access
                </div>
                <div className="grid gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-white/[0.03] p-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">
                        Wallet
                      </div>
                      <div className="mt-1 font-mono text-sm text-white/75">
                        {shortAddress(account?.address)}
                      </div>
                    </div>
                    {thirdwebClient ? (
                      account?.address ? (
                        <button
                          className="border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/60 transition hover:border-yellow-300/60 hover:text-yellow-200"
                          onClick={() => {
                            if (activeWallet) {
                              disconnect(activeWallet);
                            }
                          }}
                          type="button"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <ConnectButton
                          client={thirdwebClient}
                          chain={base}
                          connectModal={{ size: "compact" }}
                        />
                      )
                    ) : (
                      <div className="text-sm leading-6 text-white/65">
                        Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live
                        wallet connector.
                      </div>
                    )}
                  </div>

                  <div className="border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between gap-3">
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
                    <p className="mt-2 text-sm leading-6 text-white/62">
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
              </div>

              <div className="border border-white/10 bg-black/60 p-4 backdrop-blur-[2px]">
                <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Identity
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-white/45">
                      First Name as it appears on Coinbase
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
                      Last Name as it appears on Coinbase
                    </span>
                    <input
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                      placeholder="Mccormick"
                    />
                  </label>

                  <label className="block sm:col-span-2 lg:col-span-1">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-white/45">
                      DOB as it appears on your Coinbase EAS
                    </span>
                    <input
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      type="date"
                      className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                    />
                  </label>

                  <div className="border border-yellow-300/30 bg-yellow-300/10 p-4 sm:col-span-2 lg:col-span-1">
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
            </div>

            <div className="border border-white/10 bg-black/65 p-4 shadow-[0_0_56px_rgba(81,197,255,0.06)] backdrop-blur-[2px] md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                    Agreement
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                    Review the deed summary, open the full wording when needed,
                    then clear the required acknowledgements.
                  </p>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Version {contractLanguageVersion}
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/68 md:grid-cols-3">
                <div className="border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                    Product
                  </div>
                  <p className="mt-2">
                    A generated ERC-721 deed artifact minted to the connected
                    wallet after eligibility and payment.
                  </p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                    Public Data
                  </div>
                  <p className="mt-2">
                    Metadata and the deed image are public once minted. Enter
                    only information you accept using for this artifact.
                  </p>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                    Royalties
                  </div>
                  <p className="mt-2">
                    The contract signals royalties, but marketplace collection
                    depends on marketplace support and routing.
                  </p>
                </div>
              </div>

              <details className="mt-4 border border-yellow-300/55 bg-yellow-300/[0.08] shadow-[0_0_34px_rgba(253,224,71,0.14)]">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.26em] text-yellow-100 transition hover:bg-yellow-300/[0.12]">
                  <span>Review Full Certificate Text</span>
                  <span className="border border-yellow-200/45 bg-black/45 px-2 py-1 text-[9px] tracking-[0.22em] text-yellow-100/80">
                    Required Review
                  </span>
                </summary>
                <div className="max-h-72 space-y-3 overflow-y-auto border-t border-white/10 bg-black/70 p-4 text-xs leading-6 text-white/65">
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
              </details>

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
                    I have read and agree to the Certificate of Title to
                    Spiritual Ownership before minting.
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
                    I attest that the name and DOB entered match my
                    Coinbase/EAS identity and may be used to generate my deed.
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
                    {paymentAmount} USDC. The backend pays contract mint price
                    and gas after the signed payment webhook marks this order
                    paid.
                  </p>
                  <p className="mt-3 max-w-2xl border border-cyan-100/20 bg-black/35 p-3 text-sm leading-6 text-cyan-50/72">
                    Once minted, the artifact belongs to your connected wallet.
                    That wallet is recorded in the NFT metadata and original
                    minter record, so royalties can route back to you if you
                    ever choose to sell and the marketplace honors the royalty
                    path.
                  </p>
                  {!activeOrder && (
                    <button
                      className="mt-4 min-h-12 border border-cyan-100/45 bg-cyan-100/10 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-100/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/35"
                      disabled={!checkoutReady || orderBusy}
                      onClick={createOrder}
                      type="button"
                    >
                      {orderBusy ? "Preparing" : `Prepare ${paymentAmount} Checkout`}
                    </button>
                  )}
                  {activeOrder && thirdwebClient && paymentSeller && paymentTokenAddress && (
                    <div className="mt-4 grid gap-3">
                      <CheckoutWidget
                        amount={paymentAmount}
                        chain={base}
                        client={thirdwebClient}
                        description="Verified mint order for the Sovereign Portal deed."
                        feePayer="seller"
                        name="Certificate of Title for Soul Ownership"
                        onSuccess={() => {
                          setPaymentNotice(
                            "Checkout completed. Refresh until the verified webhook marks this mint order paid.",
                          );
                        }}
                        purchaseData={{
                          orderId: activeOrder.orderId,
                          publicMark,
                          wallet: account?.address,
                        }}
                        seller={paymentSeller as `0x${string}`}
                        showThirdwebBranding={false}
                        tokenAddress={paymentTokenAddress as `0x${string}`}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/55 px-3 py-3 text-xs text-white/58">
                        <span className="break-all">
                          Order {activeOrder.orderId} / {activeOrder.status}
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
                    Generate the deed after wallet, EAS, identity, terms, and
                    payment are cleared.
                  </p>
                </div>
                <button
                  onClick={handleMint}
                  disabled={!canMint}
                  className="min-h-14 w-full border border-yellow-300/50 bg-yellow-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 sm:w-auto sm:min-w-56"
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

          </section>
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
