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
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";
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
const portalGlossaryTerms: GlossaryTermKey[] = [
  "Attestation",
  "Base",
  "Base Mainnet",
  "Checkout",
  "Coinbase EAS",
  "Covenant Mark",
  "ERC-721",
  "Genesis",
  "Genesis Mint",
  "Metadata",
  "Mint",
  "Mint Order",
  "Progeny",
  "Public Mark",
  "Recipient",
  "Soul",
  "Soul Deed",
  "Token",
  "Token URI",
  "Vanguard",
  "Verified Account",
  "Wallet",
  "Wallet Address",
  "wallet-linked",
];
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
          <GlossaryText
            terms={portalGlossaryTerms}
            text="The Portal uses your connected Base wallet for Coinbase EAS eligibility, checkout order ownership, and the final mint recipient. Typed wallet addresses are not accepted for the live mint path."
          />
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
  const [certificateOpened, setCertificateOpened] = useState(false);
  const [minting, setMinting] = useState(false);
  const [receipt, setReceipt] = useState<MintReceipt | null>(null);
  const [mintOrder, setMintOrder] = useState<MintOrderState | null>(null);
  const [orderBusy, setOrderBusy] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState("");
  const [error, setError] = useState("");
  const [previewShellRequested, setPreviewShellRequested] = useState(false);
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
  const termsAwaitingIdentity = !hasIdentity && !deedAccepted;
  const paymentAwaitingTerms = !deedAccepted;
  const checkoutPrerequisitesComplete = checkoutReady;
  const checkoutPanelState = checkoutPrerequisitesComplete
    ? "console-status-tile--entered"
    : "console-status-tile--waiting";
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
    const previewShellTimer = window.setTimeout(
      () =>
        setPreviewShellRequested(
          new URLSearchParams(window.location.search).get("previewShell") ===
            "1",
        ),
      0,
    );

    return () => window.clearTimeout(previewShellTimer);
  }, []);

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

      <div className="relative z-10 mx-0 flex min-h-[calc(100vh-4rem)] w-full max-w-[358px] flex-col gap-5 sm:mx-auto sm:max-w-6xl">
        <nav className="engine-top-nav control-surface flex min-w-0 flex-wrap items-center justify-between gap-4 overflow-hidden border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <div className="engine-nav-links flex min-w-0 flex-wrap gap-4">
            <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite chamfer-nav-link--return">
              Return Home
            </Link>
            <Link href="/engine" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite">
              Artifacts
            </Link>
          </div>
          <span className="engine-nav-title min-w-0 max-w-full truncate text-[11px] tracking-[0.28em] text-cyan-100/72">
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

          <section className="min-w-0">
            <div className="control-surface control-surface-large relative min-w-0 overflow-hidden border border-white/10 bg-black/65 p-4 shadow-[0_0_70px_rgba(72,220,255,0.08)] backdrop-blur-[2px] md:p-5">
              <div className="engine-screen-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
              <div className="engine-sweep pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden="true" />
              <div className="relative z-10">
                <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,0.56fr)_minmax(0,1fr)]">
                  <aside className="control-surface-soft min-w-0 overflow-hidden border border-cyan-100/18 bg-white/[0.025] p-4">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300/70">
                        Genesis Soul Registry | ONE PERSON, ONE MINT
                      </p>
                      <h1 className="mt-3 max-w-full overflow-wrap-anywhere text-base font-light uppercase tracking-[0.08em] sm:text-lg md:text-2xl md:tracking-[0.1em]">
                        {deedName}
                      </h1>
                    </div>

                    <div className="mt-4 grid min-w-0 w-3/4 max-w-full grid-cols-6 gap-0.5 overflow-hidden sm:gap-1">
                      {progress.map((step) => (
                        <div
                          key={step.label}
                          className={`control-surface-soft flex min-h-8 min-w-0 items-center justify-center border px-0.5 py-1 text-[7px] uppercase tracking-0 sm:px-1 sm:text-[8px] sm:tracking-[0.08em] ${
                            step.complete
                              ? "console-status-tile--entered text-green-100"
                              : "border-white/10 bg-white/[0.025] text-white/38"
                          }`}
                        >
                          <span className="mr-1 inline-block h-1 w-1 shrink-0 bg-current shadow-[0_0_10px_currentColor]" />
                          <span className="truncate">{step.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs leading-5 text-white/62">
                      <div className="control-surface-soft portal-surface-red-soft min-w-0 border border-red-300/20 bg-red-500/[0.05] px-3 py-2">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                          Next Gate
                        </div>
                        <div className="mt-1 truncate text-xs uppercase tracking-[0.16em] text-cyan-50">
                          {nextStep}
                        </div>
                      </div>
                      <div
                        className={`control-surface-soft min-w-0 border px-3 py-2 ${
                          account?.address
                            ? "console-status-tile--entered"
                            : "border-white/10 bg-white/[0.025]"
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                          Recipient
                        </div>
                        <div className="mt-1 truncate font-mono text-xs text-cyan-50">
                          {shortAddress(account?.address)}
                        </div>
                      </div>
                      <p className="col-span-2">
                        Pass All Gates to Mint Your Token
                      </p>
                    </div>
                  </aside>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                          Live Mint Console
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href="#one-person-one-mint"
                        className="console-key-button console-key-button--gold"
                      >
                        Rule Logic
                      </a>
                      <a
                        href="#portal-disclosures"
                        className="console-key-button"
                      >
                        Disclosures
                      </a>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-6">
                      {[
                        {
                          label: "Wallet",
                          value: shortAddress(account?.address),
                          complete: Boolean(account?.address),
                          stateClass: Boolean(account?.address)
                            ? "console-status-tile--entered"
                            : "border-white/10 bg-white/[0.025]",
                        },
                        {
                          label: "EAS",
                          value: checkingAttestation
                            ? "Checking"
                            : verification?.eligible
                              ? "Human"
                              : "Blocked",
                          complete: Boolean(verification?.eligible),
                          stateClass: verification?.eligible
                            ? "console-status-tile--entered"
                            : "border-white/10 bg-white/[0.025]",
                        },
                        {
                          label: "Identity",
                          value: hasIdentity ? publicMark : "Open",
                          complete: hasIdentity,
                          stateClass: hasIdentity
                            ? "console-status-tile--entered"
                            : "border-white/10 bg-white/[0.025]",
                        },
                        {
                          label: "Terms",
                          value: deedAccepted
                            ? "Agreed"
                            : termsAwaitingIdentity
                              ? "Awaiting Identity"
                              : "Open",
                          complete: deedAccepted,
                          stateClass: deedAccepted
                            ? "console-status-tile--entered"
                            : termsAwaitingIdentity
                              ? "console-status-tile--waiting"
                              : "border-white/10 bg-white/[0.025]",
                        },
                        {
                          label: "Payment",
                          value: paymentAwaitingTerms
                            ? "Awaiting Terms"
                            : checkoutEnabled
                              ? orderPaid
                                ? "Paid"
                                : "Required"
                              : "Bypassed",
                          complete: orderPaid,
                          stateClass: orderPaid
                            ? "console-status-tile--entered"
                            : paymentAwaitingTerms
                              ? "console-status-tile--waiting"
                              : "border-white/10 bg-white/[0.025]",
                        },
                        {
                          label: "Mint",
                          value: canMint ? "Mint ACTIVE" : "Locked",
                          complete: canMint,
                          stateClass: canMint
                            ? "console-status-tile--mint-active"
                            : "portal-surface-red-soft",
                        },
                      ].map((readout) => (
                        <div
                          key={readout.label}
                          className={`control-surface-soft min-h-[4.25rem] border px-3 py-2 ${readout.stateClass}`}
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

                    <div className="mt-4 grid gap-3">
                      <div className="grid gap-3 md:grid-cols-[minmax(150px,0.38fr)_minmax(0,0.42fr)_minmax(160px,0.32fr)]">
                        <div
                          className={`control-surface-soft flex min-w-0 flex-col items-start justify-between gap-2 border px-3 py-2 ${
                            account?.address
                              ? "console-status-tile--entered"
                              : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">
                              Wallet
                            </div>
                            <div className="mt-1 truncate font-mono text-xs text-white/75">
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

                        <div
                          className={`control-surface-soft min-w-0 border px-3 py-2 ${
                            verification?.eligible
                              ? "console-status-tile--entered"
                              : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
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
                            {verification?.message ? (
                              verification.message
                            ) : (
                              <GlossaryText
                                terms={portalGlossaryTerms}
                                text="The connected Base wallet is checked for Coinbase Verified Account attestation. Name and DOB fields must match your identity records, but the wallet attestation is the live eligibility gate."
                              />
                            )}
                          </p>
                          {verification?.mode === "mock" && (
                            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-200/70">
                              Mock attestation mode
                            </p>
                          )}
                        </div>

                        <div className="control-surface-soft portal-surface-gold min-w-0 border border-yellow-300/30 bg-yellow-300/10 px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-200/80">
                            Public Covenant Mark
                          </div>
                          <div className="mt-1 truncate text-lg tracking-[0.14em] text-yellow-100">
                            {publicMark}
                          </div>
                          <p className="mt-2 text-[10px] leading-4 text-yellow-100/66">
                            Shortened public deed mark.
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3 md:col-span-3">
                          <label className="console-input-field relative block">
                            <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                              First Name
                            </span>
                            <input
                              value={firstName}
                              onChange={(event) => setFirstName(event.target.value)}
                              className="control-input-surface w-full border border-white/10 bg-black px-2.5 py-3 text-xs text-white outline-none transition focus:border-yellow-300/60"
                              placeholder="As it Appears on Coinbase Acct."
                            />
                          </label>

                          <label className="console-input-field relative block">
                            <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                              Last Name
                            </span>
                            <input
                              value={lastName}
                              onChange={(event) => setLastName(event.target.value)}
                              className="control-input-surface w-full border border-white/10 bg-black px-2.5 py-3 text-xs text-white outline-none transition focus:border-yellow-300/60"
                              placeholder="As it Appears on Coinbase Acct."
                            />
                          </label>

                          <label className="console-input-field relative block">
                            <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                              DOB
                            </span>
                            <input
                              value={dob}
                              onChange={(event) => setDob(event.target.value)}
                              type="date"
                              className="control-input-surface w-full border border-white/10 bg-black px-2.5 py-3 text-xs text-white outline-none transition focus:border-yellow-300/60"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/38 md:col-span-3">
                          Name and DOB should match your Coinbase identity records.
                        </p>
                      </div>

                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
                        <div className="grid content-start gap-3">
                          <div className="grid gap-2 text-xs leading-5 text-white/65 sm:grid-cols-3">
                            <label
                              className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
                                contractAccepted
                                  ? "console-status-tile--entered"
                                  : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
                              } ${certificateOpened ? "" : "cursor-not-allowed opacity-70"}`}
                            >
                              <input
                                checked={contractAccepted}
                                onChange={(event) =>
                                  setContractAccepted(event.target.checked)
                                }
                                disabled={!certificateOpened}
                                type="checkbox"
                                className="mt-1 h-4 w-4 shrink-0 accent-yellow-300 disabled:cursor-not-allowed"
                              />
                              <span className="text-[10px] leading-4">
                                Read and agree to the Certificate.
                              </span>
                            </label>
                            <label
                              className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
                                accuracyAccepted
                                  ? "console-status-tile--entered"
                                  : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
                              }`}
                            >
                              <input
                                checked={accuracyAccepted}
                                onChange={(event) =>
                                  setAccuracyAccepted(event.target.checked)
                                }
                                type="checkbox"
                                className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
                              />
                              <span className="text-[10px] leading-4">
                                Name and DOB match Coinbase/EAS.
                              </span>
                            </label>
                            <label
                              className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
                                publicMarkAccepted
                                  ? "console-status-tile--entered"
                                  : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
                              }`}
                            >
                              <input
                                checked={publicMarkAccepted}
                                onChange={(event) =>
                                  setPublicMarkAccepted(event.target.checked)
                                }
                                type="checkbox"
                                className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
                              />
                              <span className="text-[10px] leading-4">
                                Public deed uses shortened mark.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div
                          className={`control-surface-soft min-h-full border p-4 ${checkoutPanelState}`}
                        >
                          <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                            Checkout
                          </div>

                          {orderPaid ? (
                            <div className="portal-pay-button portal-pay-button--confirmed mt-4">
                              <span>Payment Confirmed</span>
                              <small>Mint control armed.</small>
                            </div>
                          ) : checkoutPrerequisitesComplete ? (
                            <button
                              className="portal-pay-button portal-pay-button--ready mt-4"
                              disabled={
                                !checkoutEnabled ||
                                Boolean(activeOrder) ||
                                orderBusy
                              }
                              onClick={createOrder}
                              type="button"
                            >
                              <span>
                                {orderBusy
                                  ? "Preparing Checkout"
                                  : `Pay $${paymentAmount}`}
                              </span>
                              <small>confirm payment then Mint</small>
                            </button>
                          ) : (
                            <div className="portal-pay-button portal-pay-button--waiting mt-4">
                              <span>
                                Confirm Previous Completion of previous steps
                              </span>
                              <small>
                                Wallet, EAS, identity, and terms must be green first.
                              </small>
                            </div>
                          )}

                        {checkoutPrerequisitesComplete && !checkoutEnabled && (
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                            Checkout is not enabled in this environment.
                          </p>
                        )}

                        {activeOrder && checkoutEnabled && (
                          <div className="mt-4 grid gap-3">
                            {thirdwebClient &&
                              paymentSeller &&
                              paymentTokenAddress &&
                              !orderPaid && (
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
                              )}
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

                        <button
                          className={`portal-mint-pill mt-4 ${
                            canMint ? "portal-mint-pill--ready" : "portal-mint-pill--locked"
                          }`}
                          disabled={!canMint}
                          onClick={handleMint}
                          type="button"
                        >
                          {minting ? "MINTING" : canMint ? "MINT" : "Mint Locked"}
                        </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="control-surface-soft portal-surface-red mt-4 border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
                        {error}
                      </div>
                    )}

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
              </div>
            </div>
          </section>

          <section
            id="portal-disclosures"
            className="control-surface control-surface-strong border border-white/10 bg-black/55 p-4 backdrop-blur-[2px]"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
              <div className="grid gap-3">
                <details
                  id="one-person-one-mint"
                  className="control-surface-soft portal-surface-gold border border-yellow-300/45 bg-yellow-300/[0.08]"
                >
                  <summary className="cursor-pointer list-none px-4 py-3 text-[11px] uppercase tracking-[0.26em] text-yellow-100 transition hover:bg-yellow-300/[0.12]">
                    Why one per person
                  </summary>
                  <div className="space-y-3 border-t border-white/10 bg-black/45 p-4 text-sm leading-6 text-white/68">
                    <p>
                      <GlossaryText
                        terms={portalGlossaryTerms}
                        text="The Genesis mint treats a soul as unique to life, not automation. Each Soul carries deterministic stats, not random rolls, and the wallet-linked Coinbase EAS gate helps protect against bots, duplicate wallets, and empty-wallet farming."
                      />
                    </p>
                    <p>
                      The goal is a future where Engine spaces are populated by
                      real people, not hidden competitors or automated accounts
                      pretending to be community.
                    </p>
                    <p>
                      <GlossaryText
                        terms={portalGlossaryTerms}
                        text="Raw name and DOB details are used only to generate the mint request, then purged after mint completion. The Certificate also functions as a Soul Deed Access token for future Progeny access."
                      />
                    </p>
                  </div>
                </details>

                <details
                  className="control-surface-soft portal-surface-gold border border-yellow-300/45 bg-yellow-300/[0.08]"
                  onToggle={(event) => {
                    if (event.currentTarget.open) {
                      setCertificateOpened(true);
                    }
                  }}
                >
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.26em] text-yellow-100 transition hover:bg-yellow-300/[0.12]">
                    <span>Certificate Text</span>
                    <span className="text-[9px] tracking-[0.22em] text-yellow-100/70">
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
              </div>

              <div className="grid gap-3 text-sm leading-6 text-white/68 md:grid-cols-3">
                <Link
                  href="/whitepaper#genesis-access"
                  className="control-surface-soft portal-clickable-surface block border border-white/10 bg-white/[0.03] p-3 transition hover:text-cyan-50"
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                    Product
                  </div>
                  <p className="mt-2">
                    Genesis ERC-721 access artifact for the Engine profile layer.
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
                    Minted metadata and deed artwork become public records.
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
                    Routing depends on contract terms and marketplace support.
                  </p>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100/62">
                    Open Routing
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <p className="control-surface-soft portal-surface-gold border border-yellow-300/20 bg-yellow-300/[0.06] p-3 text-xs leading-5 text-yellow-50/78">
            <GlossaryText
              terms={portalGlossaryTerms}
              text="Creative product, not legal, religious, medical, or financial advice. Royalties depend on marketplace support, and public NFT metadata is effectively permanent."
            />
          </p>

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
