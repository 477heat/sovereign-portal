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
import { createWallet, walletConnect } from "thirdweb/wallets";
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
const previewShellEnabled =
  process.env.NEXT_PUBLIC_PORTAL_PREVIEW_SHELL === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";
const architectOpenSeaUrl =
  "https://opensea.io/item/base/0x8453b77c845c913d8ca3d1a265ba17fc6aa5ea65/0";

const steps = ["Wallet", "EAS", "Identity", "Terms", "Payment", "Mint"];
const portalAppMetadata = {
  name: "Sovereign Portal",
  url: "https://sovengine.xyz",
  description: "Genesis Soul Deed minting portal on Base.",
  logoUrl: "https://sovengine.xyz/icon.png",
};
const portalWallets = [
  createWallet("org.base.account", {
    appMetadata: portalAppMetadata,
    chains: [base],
  }),
  createWallet("com.coinbase.wallet", {
    appMetadata: portalAppMetadata,
    walletConfig: {
      options: "all",
    },
  }),
  createWallet("io.metamask"),
  walletConnect(),
];
const portalConnectButton = {
  label: "Connect Base Wallet",
};
const portalSwitchButton = {
  label: "Switch To Base",
};
const portalConnectModal = {
  title: "Connect Base Wallet",
  titleIcon: "",
  size: "compact",
  showThirdwebBranding: false,
} as const;
const portalDetailsModal = {
  hideBuyFunds: true,
  hideSendFunds: true,
  manageWallet: {
    allowLinkingProfiles: false,
  },
};

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

function PortalWalletGate() {
  return (
    <section className="flex flex-1 items-center justify-center py-12">
      <div className="control-surface control-surface-large w-full max-w-2xl border border-yellow-300/35 bg-black/65 p-6 text-center shadow-[0_0_70px_rgba(253,224,71,0.08)] backdrop-blur-[2px] md:p-8">
        <div className="text-[11px] uppercase tracking-[0.34em] text-yellow-300/70">
          Wallet Required
        </div>
        <h1 className="mt-4 text-2xl font-light uppercase tracking-[0.14em] text-white md:text-4xl">
          Connect to enter the Portal
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/62">
          The Portal uses your connected Base wallet for Coinbase EAS
          eligibility, checkout order ownership, and the final mint recipient.
          Typed wallet addresses are not accepted for the live mint path.
        </p>
        <div className="mt-6 flex justify-center">
          {thirdwebClient ? (
            <ConnectButton
              client={thirdwebClient}
              chain={base}
              appMetadata={portalAppMetadata}
              connectButton={portalConnectButton}
              connectModal={portalConnectModal}
              detailsModal={portalDetailsModal}
              recommendedWallets={portalWallets}
              showAllWallets={false}
              switchButton={portalSwitchButton}
              wallets={portalWallets}
            />
          ) : (
            <div className="control-surface-soft border border-red-300/35 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live wallet
              connector.
            </div>
          )}
        </div>
      </div>
    </section>
  );
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
  const [previewShellRequested] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      new URLSearchParams(window.location.search).get("previewShell") === "1"
    );
  });
  const previewShellActive = previewShellEnabled && previewShellRequested;
  const showWalletGate = !account?.address && !previewShellActive;

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
    <main className="info-control-page portal-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 text-white md:px-8 md:py-8">
      <TunnelBackdrop layer="page" variant="diffused" />
      <BackgroundHashStream
        className="z-0 opacity-20 md:opacity-25"
        variant="right"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-5">
        <nav className="engine-top-nav control-surface flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <div className="engine-nav-links flex flex-wrap gap-4">
            <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite chamfer-nav-link--return">
              Return Home
            </Link>
            <Link href="/engine" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite">
              Artifacts
            </Link>
          </div>
          <span className="engine-nav-title text-[11px] tracking-[0.28em] text-cyan-100/72">
            Sovereign Portal // Live Mint Path
          </span>
        </nav>

        {showWalletGate ? (
          <PortalWalletGate />
        ) : (
        <section className="flex flex-1 flex-col gap-5">
          {previewShellActive && (
            <div className="control-surface portal-surface-cyan border border-cyan-100/30 bg-cyan-100/[0.06] px-4 py-3 text-sm leading-6 text-cyan-50/78">
              <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/80">
                Preview Shell
              </div>
              <p className="mt-2">
                Wallet, EAS, checkout, and mint actions are intentionally
                disabled. This view exists only so reviewers can inspect the
                Portal layout without connecting a wallet.
              </p>
            </div>
          )}

          <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(430px,1.1fr)]">
            <div className="control-surface control-surface-large border border-cyan-100/20 bg-black/55 p-4 shadow-[0_0_70px_rgba(72,220,255,0.08)] backdrop-blur-[2px] md:p-5">
              <div className="control-surface-soft portal-surface-gold border border-yellow-300/35 bg-yellow-300/[0.09] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-base font-semibold uppercase tracking-[0.16em] text-yellow-100 md:text-xl">
                    One Person. One Genesis Mint.
                  </div>
                  <a
                    href="#one-person-one-mint"
                    className="console-key-button console-key-button--gold"
                  >
                    Rule Logic
                  </a>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300/70">
                    Genesis Soul Registry
                  </p>
                  <h1 className="mt-3 max-w-3xl text-2xl font-light uppercase tracking-[0.12em] md:text-4xl">
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

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {progress.map((step) => (
                  <div
                    key={step.label}
                    className={`control-surface-soft min-h-12 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${
                      step.complete
                        ? "console-status-tile--entered text-green-100"
                        : "border-white/10 bg-white/[0.025] text-white/38"
                    }`}
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 bg-current shadow-[0_0_10px_currentColor]" />
                    {step.label}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-6 text-white/68">
                <p>
                  This portal creates an onchain Certificate of Title for Soul
                  Ownership on Base after wallet eligibility, payment, and
                  agreement checks are complete.
                </p>
                <p className="control-surface-soft portal-surface-gold border border-yellow-300/20 bg-yellow-300/[0.06] p-3 text-yellow-50/78">
                  Creative product, not legal, religious, medical, or financial
                  advice. Royalties depend on marketplace support, and public NFT
                  metadata is effectively permanent.
                </p>
              </div>
            </div>

            <div className="control-surface control-surface-large relative overflow-hidden border border-white/10 bg-black/65 p-4 shadow-[0_0_56px_rgba(81,197,255,0.06)] backdrop-blur-[2px] md:p-5">
              <div className="engine-screen-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
              <div className="engine-sweep pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                      Live Mint Console
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                      Complete wallet, EAS, identity, agreement, and payment
                      gates from this panel.
                    </p>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Contract {contractLanguageVersion}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                  {[
                    {
                      label: "Wallet",
                      value: shortAddress(account?.address),
                      complete: Boolean(account?.address),
                    },
                    {
                      label: "EAS",
                      value: checkingAttestation
                        ? "Checking"
                        : verification?.eligible
                          ? "Human"
                          : "Blocked",
                      complete: Boolean(verification?.eligible),
                    },
                    {
                      label: "Identity",
                      value: hasIdentity ? publicMark : "Open",
                      complete: hasIdentity,
                    },
                    {
                      label: "Payment",
                      value: checkoutEnabled
                        ? orderPaid
                          ? "Paid"
                          : "Required"
                        : "Bypassed",
                      complete: orderPaid,
                    },
                    {
                      label: "Mint",
                      value: canMint ? "Armed" : "Locked",
                      complete: canMint,
                    },
                  ].map((readout) => (
                    <div
                      key={readout.label}
                      className={`control-surface-soft min-h-[4.25rem] border px-3 py-2 ${
                        readout.complete
                          ? "console-status-tile--entered"
                          : "border-white/10 bg-white/[0.025]"
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-[0.22em] text-white/42">
                        {readout.label}
                      </div>
                      <div className="mt-1 truncate text-xs uppercase tracking-[0.12em] text-cyan-50">
                        {readout.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.82fr)_minmax(240px,0.58fr)]">
                  <div className="grid gap-3">
                    <div className="control-surface-soft flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-white/[0.03] p-3">
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
                            className="console-key-button"
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
                            appMetadata={portalAppMetadata}
                            connectButton={portalConnectButton}
                            connectModal={portalConnectModal}
                            detailsModal={portalDetailsModal}
                            recommendedWallets={portalWallets}
                            showAllWallets={false}
                            switchButton={portalSwitchButton}
                            wallets={portalWallets}
                          />
                        )
                      ) : (
                        <div className="text-sm leading-6 text-white/65">
                          Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live
                          wallet connector.
                        </div>
                      )}
                    </div>

                    <div className="control-surface-soft border border-white/10 bg-white/[0.03] p-3">
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
                              ? "Human"
                              : "Awaiting Wallet"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        {verification?.message ??
                          "The connected Base wallet is checked for Coinbase Verified Account attestation. Name and DOB fields must match your identity records, but the wallet attestation is the live eligibility gate."}
                      </p>
                      {verification?.mode === "mock" && (
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-200/70">
                          Mock attestation mode
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45">
                          First Name
                        </span>
                        <input
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          className="control-input-surface w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                          placeholder="As it Appears on Coinbase Acct."
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45">
                          Last Name
                        </span>
                        <input
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          className="control-input-surface w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                          placeholder="As it Appears on Coinbase Acct."
                        />
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45">
                          DOB associated with Coinbase/EAS eligibility
                        </span>
                        <input
                          value={dob}
                          onChange={(event) => setDob(event.target.value)}
                          type="date"
                          className="control-input-surface w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition focus:border-yellow-300/60"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/38">
                      Name and DOB should match your Coinbase identity records.
                    </p>
                  </div>

                  <div className="grid content-start gap-3">
                    <div className="control-surface-soft portal-surface-gold border border-yellow-300/30 bg-yellow-300/10 p-4">
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

                    <div className="grid gap-2 text-xs leading-5 text-white/65">
                      <label className="control-surface-soft flex gap-3 border border-white/10 bg-white/[0.025] p-3">
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
                          Spiritual Ownership.
                        </span>
                      </label>
                      <label className="control-surface-soft flex gap-3 border border-white/10 bg-white/[0.025] p-3">
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
                          Coinbase/EAS identity.
                        </span>
                      </label>
                      <label className="control-surface-soft flex gap-3 border border-white/10 bg-white/[0.025] p-3">
                        <input
                          checked={publicMarkAccepted}
                          onChange={(event) =>
                            setPublicMarkAccepted(event.target.checked)
                          }
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-yellow-300"
                        />
                        <span>
                          I understand the public inscription uses the shortened
                          covenant mark.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="control-surface-soft portal-surface-red mt-4 border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                {checkoutEnabled && (
                  <div className="control-surface-soft portal-surface-cyan mt-4 border border-cyan-100/20 bg-cyan-100/[0.06] p-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/72">
                      Checkout
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
                      {paymentAmount} USDC. The backend pays contract mint price
                      and gas after the signed payment webhook marks this order
                      paid.
                    </p>
                    {!activeOrder && (
                      <button
                        className="console-key-button mt-4 min-h-12 w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
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
                        <div className="control-surface-soft flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/55 px-3 py-3 text-xs text-white/58">
                          <span className="break-all">
                            Order {activeOrder.orderId} / {activeOrder.status}
                          </span>
                          <button
                            className="console-key-button"
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

                <div className="control-surface-soft portal-surface-gold mt-4 flex flex-col gap-4 border border-yellow-200/25 bg-yellow-200/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
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
                    className={`w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-56 ${canMint ? "console-launch-button" : "console-key-button"}`}
                  >
                    {minting ? "Minting" : "Generate Deed"}
                  </button>
                </div>

                {receipt && (
                  <div className="control-surface-soft portal-surface-gold mt-4 border border-yellow-300/40 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
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
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <details className="control-surface control-surface-strong portal-surface-gold border border-yellow-300/55 bg-yellow-300/[0.08] shadow-[0_0_34px_rgba(253,224,71,0.14)]">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.26em] text-yellow-100 transition hover:bg-yellow-300/[0.12]">
                <span>Review Full Certificate Text</span>
                <span className="control-surface-soft portal-surface-gold border border-yellow-200/45 bg-black/45 px-2 py-1 text-[9px] tracking-[0.22em] text-yellow-100/80">
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

            <div className="grid gap-3 text-sm leading-6 text-white/68 md:grid-cols-3">
              <Link
                href="/whitepaper#genesis-access"
                className="control-surface-soft portal-clickable-surface block border border-white/10 bg-white/[0.03] p-3 transition hover:text-cyan-50"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                  Product
                </div>
                <p className="mt-2">
                  A Genesis ERC-721 artifact that anchors the connected wallet
                  to the Engine profile layer.
                </p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100/62">
                  Read Genesis
                </div>
              </Link>
              <Link
                href="/whitepaper#privacy-practices"
                className="control-surface-soft portal-clickable-surface block border border-white/10 bg-white/[0.03] p-3 transition hover:text-cyan-50"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                  Public Data
                </div>
                <p className="mt-2">
                  Minted metadata and deed artwork become public artifact
                  records.
                </p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100/62">
                  Read Boundaries
                </div>
              </Link>
              <Link
                href="/economics#royalty-routing"
                className="control-surface-soft portal-clickable-surface block border border-white/10 bg-white/[0.03] p-3 transition hover:text-cyan-50"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                  Royalties
                </div>
                <p className="mt-2">
                  Read the full contract details and site disclosures.
                </p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100/62">
                  Open Routing
                </div>
              </Link>
            </div>
          </section>

          <section
            id="one-person-one-mint"
            className="control-surface control-surface-strong border border-white/10 bg-black/55 p-4 text-sm leading-6 text-white/68 backdrop-blur-[2px]"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
              Why one per person
            </div>
            <p className="mt-2 max-w-4xl">
              The Genesis mint is built around the idea that a soul is tied to
              life, not automation. That is why the first artifact is a Deed
              proving your ownership of one unique origin. Each Soul carries a
              unique stat profile generated from deterministic identity data,
              not random rolls. Wallet-linked Coinbase EAS eligibility and the
              mint ledger help protect the Genesis layer from bots, duplicate
              wallets, and empty-wallet farming. No clankers.
            </p>
            <p className="mt-4 max-w-4xl">
              This mint points toward a future where the spaces built from the
              Engine are populated by real people. The goal is not to make a
              room full of hidden bots, synthetic competitors, or automated
              accounts pretending to be a community. When someone speaks,
              trades, creates, or competes beside you, the system should be
              working toward the assumption that a person is actually there.
            </p>
            <p className="mt-4 max-w-4xl">
              Raw name and DOB details submitted for the deed are used only to
              generate the mint request, then purged after mint completion. They
              are not sold, shared, or stored by our servers.
            </p>
            <p className="mt-4 max-w-4xl">
              This Certificate also functions as a Soul Deed Access token.
              Holders of this access token, or any future access tokens, are
              guaranteed access to Progeny when that Engine branch opens.
            </p>
          </section>

          <section className="control-surface grid gap-5 border border-white/10 bg-black/60 p-4 backdrop-blur-[2px] lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="control-surface-soft portal-surface-gold relative min-h-[300px] overflow-hidden border border-yellow-300/20 bg-black/45">
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
                Selling mine to continue a dream...
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68">
                I am a lifelong taxi dispatcher who recently became a solo Web3
                developer. For years, my idea of building online meant Wix and
                drag-and-drop tools; now I am learning the machinery underneath.
                After 46 years of ordinary 9-to-5 work, I was given a rare
                three-month window to study, build, and chase the strange,
                ambitious projects I kept carrying around in my head. This is
                where that work begins, alongside other ongoing projects at
                Anthologies.xyz.
              </p>
              <Link
                href={architectOpenSeaUrl}
                target="_blank"
                rel="noreferrer"
                className="console-key-button console-key-button--gold mt-5"
              >
                View The Listing
              </Link>
            </div>
          </section>
        </section>
        )}
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
