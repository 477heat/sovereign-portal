"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createThirdwebClient,
  prepareTransaction,
  sendAndConfirmTransaction,
} from "thirdweb";
import { base } from "thirdweb/chains";
import {
  CheckoutWidget,
  ConnectButton,
  ThirdwebProvider,
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import {
  contractLanguage,
  contractLanguageVersion,
} from "./contractLanguage";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import { GlossaryTerm, GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { encodeErc20TransferCalldata } from "@/lib/directBuilderPayment";
import type { GlossaryTermKey } from "@/lib/glossary";
import {
  buildMintOrderStatusMessage,
  buildMintRecoveryMessage,
} from "@/lib/portalMessages";

const portalEasGlossaryTerms: GlossaryTermKey[] = [
  "Attestation",
  "Coinbase EAS",
  "Wallet",
];

const plainEnglishCertificateSummary = [
  "This certificate was built around the human story behind the Genesis Soul Registry mint. It is meant for real people with real lives, not bots, machines, or automated processes trying to participate without a human behind them.",
  "The token can show a public marker and basic contract information, but the private identity details used by the Portal are not meant to be blasted out as ordinary public metadata. The point is to prove the mint came from a real person without turning that person's private details into decoration.",
  "Before the mint, the Portal gathers the required name, date, wallet, and agreement steps so the mint can be tied to the correct person and wallet. That process is what helps make sure the user is recorded as the Original Minter and that the user's wallet is used as the royalty receiver where the contract and marketplace routing support it.",
  "If you transfer the token, the new holder gets the token and the access tied to it. That does not mean anyone owns your actual life, body, choices, or soul in the real world. I know the formal language gets wild, but the practical point is that the token itself can move.",
  "The formal contract makes a huge theatrical joke about afterlife ownership and eternal servitude. It is supposed to feel comically intense. Part of the joke is also a warning: do not casually sell this like a random collectible, because it is also an access token for the project.",
  "The real smart contract does normal blockchain things. It can mint an ERC-721 token, remember the original minter wallet, manage metadata, show royalty information, and use project controls like pause, reveal, freeze, blacklist, and burn settings if those features are turned on.",
  "Vanguard status simply means the original wallet was here early in the Genesis phase. I want early supporters to matter, but future benefits need to be written down in published project terms, not promised through vague hype.",
  "When a user creates Artifacts, the intended setup gives that user's originating wallet a 3.5% royalty share when supported marketplaces route royalties correctly. After an Artifact is minted, the first sale price or listing price is up to the user who controls it.",
  "Royalties are not magic. The contract can point to them, but marketplaces still have to honor the routing. In some cases there may also be claim, withdrawal, or splitter steps before money actually reaches a wallet.",
  "This Plain English Summary is here so people can understand the idea without needing to decode every joke and legal-sounding phrase. The Formal Terms are still the version used for the agreement.",
];

type VerificationState = {
  eligible: boolean;
  mode: "mock" | "live";
  schemaId: string;
  message: string;
};

type MintReceipt = {
  tokenId?: string;
  status: string;
  orderId?: string;
  deedName: string;
  mode?: "mock" | "live";
  chainId?: number;
  contractAddress?: string;
  transactionId?: string;
  transactionHash?: string;
  tokenURI?: string;
  metadataUrl?: string;
  ipfsHash?: string;
  imageURI?: string;
  imageUrl?: string;
};

type MintOrderState = {
  orderId: string;
  status: "pending_payment" | "paid" | "minting" | "mint_submitted";
  wallet: string;
  paymentAmount?: string;
  paymentKind?: "checkout" | "complimentary";
  mintTransactionId?: string;
  mintTransactionHash?: string;
};

type PortalPaymentSettings = {
  checkoutEnabled: boolean;
  directPaymentEnabled?: boolean;
  paymentAmount: string;
  paymentFlow?: PortalPaymentFlow;
  paymentSeller?: string;
  paymentTokenAddress?: string;
  paymentTokenDecimals?: number;
};

type PortalPaymentFlow =
  | "base_usdc_direct_attributed"
  | "disabled"
  | "thirdweb_checkout";
type PortalGate = "wallet" | "eas" | "identity" | "terms" | "payment" | "mint";
type IdentityField = "firstName" | "lastName" | "dob";

function PortalGateIcon({ gate }: { gate: PortalGate }) {
  const sharedProps = {
    "aria-hidden": true,
    className: "portal-step-icon-svg",
    fill: "none",
    viewBox: "0 0 24 24",
  };

  if (gate === "wallet") {
    return (
      <svg {...sharedProps}>
        <path d="M4 7.5h14.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2H17" />
        <path d="M15.5 13h5" />
        <path d="M16.75 13h.01" />
      </svg>
    );
  }

  if (gate === "eas") {
    return (
      <svg {...sharedProps}>
        <path d="M12 3.5 19 6v5.4c0 4.2-2.8 7.2-7 9.1-4.2-1.9-7-4.9-7-9.1V6l7-2.5Z" />
        <path d="m8.8 12 2.1 2.1 4.5-4.7" />
      </svg>
    );
  }

  if (gate === "identity") {
    return (
      <svg {...sharedProps}>
        <path d="M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5.5 20c.8-3.4 3.1-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
      </svg>
    );
  }

  if (gate === "terms") {
    return (
      <svg {...sharedProps}>
        <path d="M7 3.5h7l3 3V20H7V3.5Z" />
        <path d="M14 3.5V7h3" />
        <path d="M9.5 11h5" />
        <path d="M9.5 14h5" />
      </svg>
    );
  }

  if (gate === "payment") {
    return (
      <svg {...sharedProps}>
        <path d="M4 7h16v10H4V7Z" />
        <path d="M4 10h16" />
        <path d="M7 14h4" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <path d="M12 3.5 14.4 9l5.6.5-4.2 3.8 1.3 5.5L12 15.9l-5.1 2.9 1.3-5.5L4 9.5 9.6 9 12 3.5Z" />
    </svg>
  );
}

const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
  : null;
const defaultPaymentAmount =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ?? "5.00";
const defaultPaymentSeller = process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
const defaultPaymentTokenAddress =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
const defaultPaymentTokenDecimals = Number.parseInt(
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
  10,
);
const defaultBuilderCodeDataSuffix =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE_DATA_SUFFIX;
const defaultPaymentFlow: PortalPaymentFlow =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_FLOW === "base_usdc_direct_attributed"
    ? "base_usdc_direct_attributed"
    : process.env.NEXT_PUBLIC_PORTAL_PAYMENT_MODE === "checkout"
      ? "thirdweb_checkout"
      : "disabled";
const defaultCheckoutEnabled =
  defaultPaymentFlow === "thirdweb_checkout" &&
  Boolean(defaultPaymentSeller && defaultPaymentTokenAddress);
const defaultDirectPaymentEnabled =
  defaultPaymentFlow === "base_usdc_direct_attributed" &&
  Boolean(
    defaultPaymentSeller &&
      defaultPaymentTokenAddress &&
      defaultBuilderCodeDataSuffix,
  );
const previewShellEnabled =
  process.env.NEXT_PUBLIC_PORTAL_PREVIEW_SHELL === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";
const coinbaseEasUrl =
  "https://help.coinbase.com/en/coinbase/getting-started/verify-my-account/onchain-verification";

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
  className: "portal-connect-wallet-button",
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
const previewReceipt: MintReceipt = {
  status: "submitted",
  deedName: "Certificate of Title for Spiritual Ownership of K. Mil",
  mode: "live",
  chainId: 8453,
  contractAddress: "0x2df9151c4e32082a05c686bd3092180134d17deb",
  transactionId: "a74ce28e-b3da-43d2-a821-640dea0ae3a1",
  transactionHash:
    "0xaa68adcf2dc5f2b2741b8f3c1df8a9ede6a52f48f2364c25424784d0ff5e1861",
  tokenURI: "ipfs://QmcYVhohGRg1ERD5upTPQ2C54vgm4taRouDxWcFtxpL5zj",
  metadataUrl: "https://ipfs.io/ipfs/QmcYVhohGRg1ERD5upTPQ2C54vgm4taRouDxWcFtxpL5zj",
  ipfsHash: "QmcYVhohGRg1ERD5upTPQ2C54vgm4taRouDxWcFtxpL5zj",
  imageURI: "ipfs://QmTM1UygFAAVQYarsQh2L5dEhqoKcaSm4adX8oGUSYW3Ap",
  imageUrl: "https://ipfs.io/ipfs/QmTM1UygFAAVQYarsQh2L5dEhqoKcaSm4adX8oGUSYW3Ap",
};

function parseTokenUnits(amount: string, decimals: number) {
  const trimmed = amount.trim().startsWith(".")
    ? `0${amount.trim()}`
    : amount.trim();

  if (!trimmed.match(/^\d+(\.\d+)?$/)) {
    throw new Error("Payment amount must be a positive decimal.");
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("Payment token decimals are not configured.");
  }

  const [whole = "0", rawFraction = ""] = trimmed.split(".");

  if (rawFraction.length > decimals) {
    throw new Error(`Payment amount supports at most ${decimals} decimal places.`);
  }

  const units = BigInt(`${whole}${rawFraction.padEnd(decimals, "0")}`);

  if (units <= BigInt(0)) {
    throw new Error("Payment amount must be greater than zero.");
  }

  return units;
}

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

function ipfsToGatewayUrl(uri?: string) {
  if (!uri) {
    return undefined;
  }

  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }

  if (uri.startsWith("https://")) {
    return uri;
  }

  return undefined;
}

function PortalContent() {
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { connect: openConnectModal, isConnecting } = useConnectModal();
  const { disconnect } = useDisconnect();
  const firstNameInputRef = useRef<HTMLInputElement | null>(null);
  const lastNameInputRef = useRef<HTMLInputElement | null>(null);
  const dobInputRef = useRef<HTMLInputElement | null>(null);
  const mobileGateTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [identityFocus, setIdentityFocus] = useState<IdentityField>("firstName");
  const [selectedGate, setSelectedGate] = useState<PortalGate>("wallet");
  const [verification, setVerification] = useState<VerificationState | null>(
    null,
  );
  const [checkingAttestation, setCheckingAttestation] = useState(false);
  const [accuracyAccepted, setAccuracyAccepted] = useState(false);
  const [publicMarkAccepted, setPublicMarkAccepted] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [certificateOpened, setCertificateOpened] = useState(false);
  const [termsReviewOpen, setTermsReviewOpen] = useState(false);
  const [plainEnglishTermsOpen, setPlainEnglishTermsOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [receipt, setReceipt] = useState<MintReceipt | null>(null);
  const [receiptMetadataImageURI, setReceiptMetadataImageURI] = useState<
    string | undefined
  >();
  const [mintOrder, setMintOrder] = useState<MintOrderState | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PortalPaymentSettings>({
    checkoutEnabled: defaultCheckoutEnabled,
    directPaymentEnabled: defaultDirectPaymentEnabled,
    paymentAmount: defaultPaymentAmount,
    paymentFlow: defaultPaymentFlow,
    paymentSeller: defaultPaymentSeller,
    paymentTokenAddress: defaultPaymentTokenAddress,
    paymentTokenDecimals: defaultPaymentTokenDecimals,
  });
  const [orderBusy, setOrderBusy] = useState(false);
  const [directPaymentBusy, setDirectPaymentBusy] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState("");
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [receiptCopied, setReceiptCopied] = useState(false);
  const [error, setError] = useState("");
  const [previewShellRequested, setPreviewShellRequested] = useState(false);
  const [mobileGateDrawerOpen, setMobileGateDrawerOpen] = useState(false);
  const previewShellActive = previewShellEnabled && previewShellRequested;

  const publicMark = useMemo(
    () => buildPublicMark(firstName, lastName),
    [firstName, lastName],
  );
  const identityInputReady =
    Boolean(firstName.trim()) &&
    Boolean(lastName.trim()) &&
    Boolean(dob) &&
    publicMark !== "_. ___";
  const hasIdentity = identityInputReady && identityConfirmed;
  const deedAccepted =
    accuracyAccepted && publicMarkAccepted && contractAccepted;
  const activeOrder =
    mintOrder?.wallet === account?.address?.toLowerCase() ? mintOrder : null;
  const checkoutEnabled = paymentSettings.checkoutEnabled;
  const directPaymentEnabled = Boolean(paymentSettings.directPaymentEnabled);
  const paymentAmount = activeOrder?.paymentAmount ?? paymentSettings.paymentAmount;
  const paymentSeller = paymentSettings.paymentSeller;
  const paymentTokenAddress = paymentSettings.paymentTokenAddress;
  const paymentTokenDecimals =
    paymentSettings.paymentTokenDecimals ?? defaultPaymentTokenDecimals;
  const paymentRequired = checkoutEnabled || directPaymentEnabled;
  const checkoutReady =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted;
  const orderPaid =
    !paymentRequired ||
    activeOrder?.status === "paid" ||
    activeOrder?.status === "minting" ||
    activeOrder?.status === "mint_submitted";
  const canMint =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    deedAccepted &&
    orderPaid &&
    !receipt &&
    !minting;
  const termsAwaitingIdentity = !hasIdentity && !deedAccepted;
  const paymentAwaitingTerms = !deedAccepted;
  const checkoutPrerequisitesComplete = checkoutReady;
  const checkoutPanelState = checkoutPrerequisitesComplete
    ? "console-status-tile--entered"
    : "console-status-tile--waiting";
  const receiptImageURI = receipt?.imageURI ?? receiptMetadataImageURI;
  const receiptImageUrl =
    receipt?.imageUrl ?? ipfsToGatewayUrl(receiptImageURI);
  const receiptMetadataUrl =
    receipt?.metadataUrl ?? ipfsToGatewayUrl(receipt?.tokenURI);
  const receiptTxUrl = receipt?.transactionHash
    ? `https://basescan.org/tx/${receipt.transactionHash}`
    : undefined;
  const receiptText = receipt
    ? [
        receipt.mode === "live"
          ? "Mainnet Mint Submitted"
          : "Mainnet Route Ready",
        receipt.deedName,
        `Base chain ${receipt.chainId ?? 8453}`,
        receipt.contractAddress ? `Contract: ${receipt.contractAddress}` : "",
        receipt.transactionHash ? `Mint Tx: ${receipt.transactionHash}` : "",
        !receipt.transactionHash && receipt.transactionId
          ? `Engine Tx: ${receipt.transactionId}`
          : "",
        receipt.tokenURI ? `Metadata URI: ${receipt.tokenURI}` : "",
        receiptMetadataUrl ? `Metadata URL: ${receiptMetadataUrl}` : "",
        receiptImageURI ? `Image URI: ${receiptImageURI}` : "",
        receiptImageUrl ? `Image URL: ${receiptImageUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  useEffect(() => {
    const previewShellTimer = window.setTimeout(
      () => {
        const searchParams = new URLSearchParams(window.location.search);
        const requestedPreviewShell = searchParams.get("previewShell") === "1";
        const requestedReceiptPreview =
          searchParams.get("receiptPreview") === "1";

        setPreviewShellRequested(
          requestedPreviewShell,
        );

        if (requestedPreviewShell && requestedReceiptPreview) {
          setReceipt(previewReceipt);
          setSelectedGate("mint");
        }
      },
      0,
    );

    return () => window.clearTimeout(previewShellTimer);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadPaymentSettings() {
      try {
        const response = await fetch("/api/portal-settings", {
          cache: "no-store",
        });
        const result = (await response.json()) as PortalPaymentSettings;

        if (!ignore && response.ok) {
          setPaymentSettings({
            checkoutEnabled: Boolean(result.checkoutEnabled),
            directPaymentEnabled: Boolean(result.directPaymentEnabled),
            paymentAmount: result.paymentAmount || defaultPaymentAmount,
            paymentFlow: result.paymentFlow ?? defaultPaymentFlow,
            paymentSeller: result.paymentSeller || defaultPaymentSeller,
            paymentTokenAddress:
              result.paymentTokenAddress || defaultPaymentTokenAddress,
            paymentTokenDecimals:
              result.paymentTokenDecimals ?? defaultPaymentTokenDecimals,
          });
        }
      } catch {
        // Keep build-time defaults if runtime settings are unavailable.
      }
    }

    loadPaymentSettings();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (selectedGate !== "identity") {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      const target =
        identityFocus === "firstName"
          ? firstNameInputRef.current
          : identityFocus === "lastName"
            ? lastNameInputRef.current
            : dobInputRef.current;

      target?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [identityFocus, selectedGate]);

  useEffect(() => {
    if (!mobileGateDrawerOpen) {
      return;
    }

    function handleDrawerKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileGateDrawerOpen(false);
        mobileGateTriggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleDrawerKeyDown);

    return () => window.removeEventListener("keydown", handleDrawerKeyDown);
  }, [mobileGateDrawerOpen]);

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

  useEffect(() => {
    let ignore = false;

    async function loadReceiptImageFromMetadata() {
      setReceiptMetadataImageURI(undefined);

      if (!receipt?.tokenURI || receipt.imageURI) {
        return;
      }

      const metadataUrl = ipfsToGatewayUrl(receipt.tokenURI);

      if (!metadataUrl) {
        return;
      }

      try {
        const response = await fetch(metadataUrl, { cache: "force-cache" });
        const metadata = (await response.json()) as { image?: unknown };

        if (!ignore && typeof metadata.image === "string") {
          setReceiptMetadataImageURI(metadata.image);
        }
      } catch {
        if (!ignore) {
          setReceiptMetadataImageURI(undefined);
        }
      }
    }

    loadReceiptImageFromMetadata();

    return () => {
      ignore = true;
    };
  }, [receipt?.imageURI, receipt?.tokenURI]);

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
      if (activeOrder) {
        setMintOrder({
          ...activeOrder,
          status: "mint_submitted",
          mintTransactionId: result.transactionId,
          mintTransactionHash: result.transactionHash,
        });
      }
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

  async function handleDirectBuilderPayment() {
    if (
      !activeOrder ||
      !account?.address ||
      !thirdwebClient ||
      !paymentSeller ||
      !paymentTokenAddress ||
      !defaultBuilderCodeDataSuffix
    ) {
      setError("Direct Base payment is not fully configured.");
      return;
    }

    setDirectPaymentBusy(true);
    setError("");
    setPaymentNotice("Confirm the Base USDC payment in your wallet.");

    try {
      const amountUnits = parseTokenUnits(paymentAmount, paymentTokenDecimals);
      const data = encodeErc20TransferCalldata({
        amount: amountUnits,
        dataSuffix: defaultBuilderCodeDataSuffix,
        recipient: paymentSeller,
      }) as `0x${string}`;
      const transaction = prepareTransaction({
        chain: base,
        client: thirdwebClient,
        data,
        to: paymentTokenAddress as `0x${string}`,
        value: BigInt(0),
      });
      const receipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });

      setPaymentNotice("Base payment confirmed. Verifying mint order...");

      const response = await fetch(
        `/api/mint-order/${activeOrder.orderId}/verify-direct-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicMark,
            transactionHash: receipt.transactionHash,
            wallet: account.address,
          }),
        },
      );
      const result = (await response.json()) as {
        message?: string;
        order?: MintOrderState | null;
        status?: MintOrderState["status"];
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Direct payment could not be verified.");
      }

      setMintOrder(
        result.order ?? {
          ...activeOrder,
          status: result.status ?? "paid",
        },
      );
      setPaymentNotice("Direct Base payment verified. Mint control armed.");
      setSelectedGate("mint");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Direct payment was not confirmed.",
      );
    } finally {
      setDirectPaymentBusy(false);
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

  async function recoverMintReceipt() {
    if (!account?.address) {
      await handleWalletChipConnect();
      return;
    }

    setRecoveryBusy(true);
    setRecoveryNotice("");
    setError("");

    try {
      const signature = await account.signMessage({
        message: buildMintRecoveryMessage({
          wallet: account.address,
        }),
      });
      const params = new URLSearchParams({
        wallet: account.address,
        signature,
      });
      const response = await fetch(`/api/mint-order/recover?${params}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        message?: string;
        order?: MintOrderState;
        receipt?: MintReceipt | null;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not recover a mint receipt.");
      }

      if (result.order) {
        setMintOrder(result.order);
      }

      if (result.receipt) {
        setReceipt(result.receipt);
        setSelectedGate("mint");
        setRecoveryNotice("Receipt restored. Save or copy it before leaving.");
        return;
      }

      setRecoveryNotice(
        result.message ??
          "Latest order found, but no submitted mint receipt is available yet.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not recover a mint receipt.",
      );
    } finally {
      setRecoveryBusy(false);
    }
  }

  function discardPendingOrder() {
    if (activeOrder?.status !== "pending_payment") {
      return;
    }

    setMintOrder(null);
    setError("");
    setPaymentNotice(
      "Pending order cleared. Create a fresh order to use the current checkout price.",
    );
  }

  async function handleWalletChipConnect() {
    if (!thirdwebClient) {
      setError("Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live wallet connector.");
      return;
    }

    setError("");

    try {
      await openConnectModal({
        appMetadata: portalAppMetadata,
        chain: base,
        client: thirdwebClient,
        recommendedWallets: portalWallets,
        showAllWallets: false,
        title: portalConnectModal.title,
        wallets: portalWallets,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Wallet connection was cancelled or could not be completed.",
      );
    }
  }

  async function refreshWalletAttestation() {
    if (!account?.address) {
      setSelectedGate("wallet");
      return;
    }

    setCheckingAttestation(true);
    setError("");

    try {
      const response = await fetch(`/api/attestation?address=${account.address}`);
      const result = (await response.json()) as VerificationState;
      setVerification(result);

      if (result.eligible) {
        setSelectedGate("identity");
      }
    } catch {
      setError("Attestation service is not responding yet.");
      setVerification(null);
    } finally {
      setCheckingAttestation(false);
    }
  }

  function confirmIdentityEntry() {
    if (!identityInputReady) {
      return;
    }

    setIdentityConfirmed(true);
    setSelectedGate("terms");
  }

  function handleIdentityKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    field: IdentityField,
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (field === "firstName" && firstName.trim()) {
      setIdentityFocus("lastName");
      return;
    }

    if (field === "lastName" && lastName.trim()) {
      setIdentityFocus("dob");
      return;
    }

    if (field === "dob" && identityInputReady) {
      confirmIdentityEntry();
    }
  }

  async function handleGateEnter() {
    if (selectedGate === "wallet") {
      if (!account?.address) {
        await handleWalletChipConnect();
      }
      return;
    }

    if (selectedGate === "eas") {
      if (account?.address && !verification?.eligible) {
        window.open(coinbaseEasUrl, "_blank", "noopener,noreferrer");
        return;
      }

      await refreshWalletAttestation();
      return;
    }

    if (selectedGate === "identity") {
      confirmIdentityEntry();
      return;
    }

    if (selectedGate === "terms") {
      if (deedAccepted) {
        setSelectedGate("payment");
      }
      return;
    }

    if (selectedGate === "payment") {
      if (orderPaid) {
        setSelectedGate("mint");
      } else if (checkoutPrerequisitesComplete && !activeOrder) {
        await createOrder();
      } else if (activeOrder) {
        await refreshOrder();
      }
      return;
    }

    if (selectedGate === "mint") {
      await handleMint();
    }
  }

  function selectGate(gate: PortalGate) {
    setSelectedGate(gate);

    if (gate === "identity") {
      setIdentityFocus(
        firstName.trim() ? (lastName.trim() ? "dob" : "lastName") : "firstName",
      );
    }
  }

  const gateReadouts = [
    {
      key: "wallet",
      label: "Wallet",
      value: account?.address
        ? shortAddress(account.address)
        : isConnecting
          ? "Connecting"
          : "Connect",
      complete: Boolean(account?.address),
      enabled: true,
      stateClass: Boolean(account?.address)
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "eas",
      label: "EAS",
      value: checkingAttestation
        ? "Checking"
        : verification?.eligible
          ? "Human"
          : "Verify",
      complete: Boolean(verification?.eligible),
      enabled: Boolean(account?.address),
      stateClass: verification?.eligible
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "identity",
      label: "Identity",
      value: hasIdentity ? publicMark : identityInputReady ? "Enter" : "Verify",
      complete: hasIdentity,
      enabled: true,
      stateClass: hasIdentity
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "terms",
      label: "Terms",
      value: deedAccepted
        ? "Agreed"
        : termsAwaitingIdentity
          ? "Waiting"
          : "Verify",
      complete: deedAccepted,
      enabled: hasIdentity || deedAccepted,
      stateClass: deedAccepted
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "payment",
      label: "Order",
      value: paymentAwaitingTerms
        ? "Waiting"
        : paymentRequired
          ? orderPaid
            ? "Paid"
            : "Required"
          : "Bypassed",
      complete: orderPaid,
      enabled: deedAccepted,
      stateClass: orderPaid
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "mint",
      label: "Mint",
      value: receipt ? "Submitted" : canMint ? "Active" : "Locked",
      complete: Boolean(receipt),
      enabled: canMint || Boolean(receipt),
      stateClass: canMint
        ? "console-key-button--active"
        : receipt
          ? "console-key-button--entered"
          : "console-key-button--complete",
    },
  ] satisfies Array<{
    key: PortalGate;
    label: string;
    value: string;
    complete: boolean;
    enabled: boolean;
    stateClass: string;
  }>;

  const walletStatusClass = account?.address
    ? "portal-wallet-status--ready"
    : isConnecting
      ? "portal-wallet-status--pending"
      : "portal-wallet-status--empty";
  const selectedGateReadout =
    gateReadouts.find((gate) => gate.key === selectedGate) ?? gateReadouts[0];
  const gateIconState = (gate: (typeof gateReadouts)[number]) => {
    if (gate.key === selectedGate) {
      return "portal-step-icon--current";
    }

    if (gate.complete) {
      return "portal-step-icon--complete";
    }

    return gate.enabled
      ? "portal-step-icon--available"
      : "portal-step-icon--locked";
  };
  const selectedGateTitle = {
    wallet: account?.address ? "Wallet Connected" : "Wallet Entry",
    eas: verification?.eligible ? "Human Verified" : "EAS Verification",
    identity: hasIdentity ? "Identity Confirmed" : "Identity Entry",
    terms: deedAccepted ? "Terms Agreed" : "Terms Agreement",
    payment: orderPaid ? "Payment Confirmed" : "Payment Gate",
    mint: receipt ? "Mint Submitted" : canMint ? "Mint Authorization" : "Mint Locked",
  }[selectedGate];
  const selectedGateStatus = {
    wallet: account?.address
      ? "Connected wallet is the live mint recipient."
      : "Connect a Base wallet to begin the live path.",
    eas: checkingAttestation
      ? "Checking Coinbase EAS attestation."
      : verification?.eligible
        ? "Wallet has Coinbase Verified Account attestation."
        : account?.address
          ? "Open Coinbase EAS to connect verification to this wallet."
          : "Wallet must be connected before EAS can verify.",
    identity: hasIdentity
      ? "Identity input has been confirmed for this session."
      : "Enter name and DOB, then press ENTER to confirm.",
    terms: deedAccepted
      ? "Agreement gates are complete."
      : hasIdentity
        ? "Open the certificate and accept each required term."
        : "Identity must be confirmed before terms can arm.",
    payment: orderPaid
      ? "Payment gate is clear for this environment."
      : deedAccepted
        ? directPaymentEnabled
          ? "Prepare a Base USDC payment or refresh an existing order."
          : "Prepare checkout or refresh an existing order."
        : "Terms must be agreed before payment can arm.",
    mint: receipt
      ? "Mint submitted. Receipt details are shown below."
      : canMint
        ? "All gates are green. Mint is ready."
        : "Pass all gates to mint your token.",
  }[selectedGate];
  const selectedGateCompleteNotice = selectedGateReadout.complete
    ? selectedGate === "mint"
      ? "Mint submitted. Save the receipt details below for tracking."
      : selectedGate === "payment"
        ? "Payment recorded. Continue to mint authorization."
        : "Gate confirmed. If you edit earlier entries, review the later steps again."
    : null;
  const gateEnterEnabled = {
    wallet: !account?.address && Boolean(thirdwebClient) && !isConnecting,
    eas: Boolean(account?.address) && !checkingAttestation,
    identity: identityInputReady && !hasIdentity,
    terms: deedAccepted,
    payment:
      orderPaid ||
      (checkoutPrerequisitesComplete && !orderBusy) ||
      Boolean(activeOrder && !orderBusy),
    mint: canMint,
  }[selectedGate];
  const gateEnterLabel = {
    wallet: isConnecting ? "Connecting" : "Enter Wallet",
    eas: checkingAttestation
      ? "Checking"
      : verification?.eligible
        ? "Refresh EAS"
        : "Open Coinbase EAS",
    identity: hasIdentity ? "Confirmed" : "Enter Identity",
    terms: deedAccepted ? "Continue" : "Enter Terms",
    payment: orderPaid ? "Continue" : activeOrder ? "Refresh Order" : "Enter Payment",
    mint: minting
      ? "Minting"
      : receipt
        ? "Mint Submitted"
        : canMint
          ? "Mint"
          : "Mint Locked",
  }[selectedGate];
  function downloadFormalTerms() {
    const termsText = [
      `Sovereign Engine Certificate Terms`,
      `Version: ${contractLanguageVersion}`,
      "",
      ...contractLanguage,
    ].join("\n\n");
    const file = new Blob([termsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `sovereign-engine-certificate-terms-${contractLanguageVersion}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function saveMintReceipt() {
    if (!receiptText) {
      return;
    }

    const file = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    const safeName = (receipt?.deedName ?? "soul-deed-receipt")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    link.href = url;
    link.download = `${safeName || "soul-deed-receipt"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyMintReceipt() {
    if (!receiptText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(receiptText);
      setReceiptCopied(true);
      window.setTimeout(() => setReceiptCopied(false), 2400);
    } catch {
      setError("Receipt copy failed. Use Save Receipt before leaving.");
    }
  }

  function returnHomeAfterReceipt() {
    const confirmed = window.confirm(
      "Save or copy your receipt first. Once you leave this screen, the Portal will not bring you back to this exact receipt panel.",
    );

    if (confirmed) {
      window.location.href = "/";
    }
  }

  const receiptPanel = receipt ? (
    <div className="control-surface-soft portal-surface-gold mt-4 border border-yellow-300/40 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
      <div className="text-[11px] uppercase tracking-[0.25em] text-yellow-200/70">
        {receipt.mode === "live"
          ? "Mainnet Mint Submitted"
          : "Mainnet Route Ready"}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(10rem,16rem)_1fr] md:items-start">
        {receiptImageUrl && (
          <a
            className="group block overflow-hidden border border-yellow-200/25 bg-black/35 p-2"
            href={receiptImageUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt={`Burned Soul Deed image for ${receipt.deedName}`}
              className="aspect-square w-full object-cover shadow-[0_0_28px_rgba(250,204,21,0.18)] transition duration-200 group-hover:scale-[1.015]"
              decoding="async"
              height={512}
              loading="lazy"
              sizes="(min-width: 768px) 16rem, 100vw"
              src={receiptImageUrl}
              width={512}
            />
          </a>
        )}
        <div className="min-w-0 space-y-2">
          <div className="font-semibold text-yellow-50">
            {receipt.deedName}
          </div>
          <div className="text-yellow-100/70">
            Base chain {receipt.chainId ?? 8453}
          </div>
          {receipt.contractAddress && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                Contract
              </div>
              <div className="break-all text-yellow-100/70">
                {receipt.contractAddress}
              </div>
            </div>
          )}
          {receipt.transactionHash && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                Mint Tx
              </div>
              <a
                className="break-all text-yellow-100/80 underline decoration-yellow-200/30 underline-offset-4 hover:text-yellow-50"
                href={receiptTxUrl}
                rel="noreferrer"
                target="_blank"
              >
                {receipt.transactionHash}
              </a>
            </div>
          )}
          {!receipt.transactionHash && receipt.transactionId && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                Engine Tx
              </div>
              <div className="break-all text-yellow-100/70">
                {receipt.transactionId}
              </div>
            </div>
          )}
          {receipt.tokenURI && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                Metadata URI
              </div>
              {receiptMetadataUrl ? (
                <a
                  className="break-all text-yellow-100/80 underline decoration-yellow-200/30 underline-offset-4 hover:text-yellow-50"
                  href={receiptMetadataUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {receipt.tokenURI}
                </a>
              ) : (
                <div className="break-all text-yellow-100/70">
                  {receipt.tokenURI}
                </div>
              )}
            </div>
          )}
          {receiptImageURI && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                Image URI
              </div>
              <div className="break-all text-yellow-100/70">
                {receiptImageURI}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  const termsContent = (
    <div className="grid gap-4">
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
            onChange={(event) => setContractAccepted(event.target.checked)}
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
            onChange={(event) => setAccuracyAccepted(event.target.checked)}
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
            onChange={(event) => setPublicMarkAccepted(event.target.checked)}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span className="text-[10px] leading-4">
            Public deed uses shortened mark.
          </span>
        </label>
      </div>
      <button
        className="console-key-button console-key-button--gold w-fit"
        onClick={() => {
          setCertificateOpened(true);
          setTermsReviewOpen(true);
        }}
        type="button"
      >
        Read Terms
      </button>
    </div>
  );

  return (
    <main className="info-control-page portal-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 text-white md:px-8 md:py-8">
      <TunnelBackdrop layer="page" variant="diffused" />
      <BackgroundHashStream
        className="z-0 opacity-20 md:opacity-25"
        variant="right"
      />

      <div className="relative z-10 mx-0 flex min-h-[calc(100vh-4rem)] w-full max-w-[358px] flex-col gap-5 pt-28 sm:mx-auto sm:max-w-6xl md:pt-32">
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

          {receipt ? (
            <section className="control-surface-large portal-surface-gold border border-yellow-300/40 bg-yellow-300/10 p-4 text-yellow-100 md:p-6">
              <div className="grid gap-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-200/70">
                    Mint Complete
                  </div>
                  <h1 className="mt-3 text-3xl font-black uppercase leading-none tracking-[0.12em] text-yellow-50 md:text-5xl">
                    Artifact Returned
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-yellow-50/72">
                    Save or copy these details now. This receipt is displayed
                    for this session first; if you close or leave this screen,
                    connect the same wallet later and use Receipt Recovery to
                    restore the latest recorded mint receipt.
                  </p>
                </div>

                {receiptPanel}

                <div className="control-surface-soft portal-surface-red-soft border border-red-300/25 bg-red-500/[0.05] p-4 text-sm leading-6 text-red-50/82">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-100/80">
                    Save Before Exit
                  </div>
                  <p className="mt-2">
                    Your token, metadata, image, and transaction stay public on
                    chain/IPFS. The Portal can recover the latest receipt for
                    this wallet, but saving a copy now is still the cleanest
                    record.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="console-key-button console-key-button--gold"
                    onClick={saveMintReceipt}
                    type="button"
                  >
                    Save Receipt
                  </button>
                  <button
                    className="console-key-button"
                    onClick={() => void copyMintReceipt()}
                    type="button"
                  >
                    {receiptCopied ? "Copied" : "Copy Details"}
                  </button>
                  {receiptMetadataUrl && (
                    <a
                      className="console-key-button"
                      href={receiptMetadataUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open Metadata
                    </a>
                  )}
                  {receiptImageUrl && (
                    <a
                      className="console-key-button"
                      href={receiptImageUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open Image
                    </a>
                  )}
                  <button
                    className="console-key-button console-key-button--active"
                    onClick={returnHomeAfterReceipt}
                    type="button"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
          <div className="control-surface portal-surface-red-soft portal-active-mint-notice border border-red-200/35 bg-red-200/[0.045] px-4 py-3 text-sm leading-6 text-red-50/82">
            <div className="text-[11px] uppercase tracking-[0.2em] text-red-200/90">
              Warning Active <GlossaryTerm term="Mint Path">Mint Path</GlossaryTerm>
            </div>
          </div>

          <div className="control-surface portal-surface-cyan border border-cyan-100/20 bg-cyan-100/[0.04] px-4 py-3 text-sm leading-6 text-cyan-50/72">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-2xl">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/75">
                  Receipt Recovery
                </div>
                <p className="mt-1">
                  Already minted or lost the final screen? Connect the same
                  wallet and recover the latest receipt recorded for it.
                </p>
              </div>
              <button
                className="console-key-button"
                disabled={recoveryBusy}
                onClick={() => void recoverMintReceipt()}
                type="button"
              >
                {recoveryBusy ? "Recovering" : "Recover Receipt"}
              </button>
            </div>
            {recoveryNotice && (
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-yellow-100/78">
                {recoveryNotice}
              </p>
            )}
          </div>

          <section className="min-w-0">
            <div className="relative min-w-0">
              <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                          Live Mint Console
                        </div>
                      </div>
                    </div>

                    {hasIdentity && (
                      <div className="control-surface-soft console-status-tile--entered mt-4 min-w-0 border p-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                          Artifact Marker
                        </div>
                        <div className="portal-artifact-marker-value mt-1 truncate text-green-50">
                          {publicMark}
                        </div>
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
                          Do not mint duplicates or incorrect info. Failed eligibility or identity checks may block minting after checkout begins.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid gap-4">
                      <div
                        className={`control-surface-soft portal-gate-view portal-gate-view--soft portal-gate-view--matrix relative min-h-[26rem] overflow-hidden border p-4 shadow-[0_0_90px_rgba(80,190,255,0.14)] ${
                          selectedGateReadout.complete
                            ? "console-status-tile--entered"
                            : selectedGate === "mint"
                              ? "portal-surface-red-soft"
                              : "portal-surface-cyan"
                        }`}
                      >
                        <div className="engine-screen-grid absolute inset-0 opacity-60" aria-hidden="true" />
                        <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
                        <div className="absolute inset-x-5 top-1/2 h-px bg-cyan-100/20 shadow-[0_0_24px_rgba(165,243,252,0.38)]" aria-hidden="true" />
                        <div className="absolute left-1/2 top-5 h-[calc(100%-2.5rem)] w-px bg-cyan-100/10" aria-hidden="true" />
                        <div className="relative z-10 flex min-h-full flex-col gap-4">
                          <div className="portal-gate-header">
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                Active Entry
                              </div>
                              <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-[0.12em] text-cyan-50 md:text-4xl">
                                {selectedGateTitle}
                              </h2>
                              <p className="mt-3 text-sm leading-6 text-white/66">
                                {selectedGateStatus}
                              </p>
                              {selectedGateCompleteNotice && (
                                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/72">
                                  {selectedGateCompleteNotice}
                                </p>
                              )}
                            </div>
                            <div
                              aria-label="Mint sequence status"
                              className="portal-step-strip"
                              role="list"
                            >
                              {gateReadouts.map((gate) => (
                                <div
                                  key={gate.key}
                                  role="listitem"
                                >
                                  <button
                                    aria-label={`Open ${gate.label} control. Current status: ${gate.value}.`}
                                    className={`portal-step-icon ${gateIconState(gate)}`}
                                    disabled={!gate.enabled && !gate.complete}
                                    onClick={() => selectGate(gate.key)}
                                    title={`${gate.label}: ${gate.value}`}
                                    type="button"
                                  >
                                    <PortalGateIcon gate={gate.key} />
                                    <span>{gate.label}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid flex-1 content-start gap-3">
                            {selectedGate === "wallet" && (
                              <div className={`grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] ${walletStatusClass}`}>
                                <div className="control-surface-soft portal-wallet-recipient border p-3">
                                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                    Recipient
                                  </div>
                                  <div className="mt-2 break-all font-mono text-sm text-cyan-50/78">
                                    {account?.address ?? "No wallet connected"}
                                  </div>
                                </div>
                                <div className="portal-wallet-action flex items-center">
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
                              </div>
                            )}

                            {selectedGate === "eas" && (
                              <div className="grid gap-3">
                                <div className="control-surface-soft border border-white/10 p-4">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                      Coinbase EAS
                                    </span>
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                      {checkingAttestation
                                        ? "Checking"
                                        : verification?.eligible
                                          ? "Human"
                                          : "Verify"}
                                    </span>
                                  </div>
                                  <p className="mt-4 text-lg leading-8 text-white/76">
                                    <GlossaryText
                                      terms={portalEasGlossaryTerms}
                                      text="Coinbase EAS checks whether your connected wallet belongs to a verified human account. If this wallet was already verified, this gate would be green."
                                    />
                                  </p>
                                  <p className="mt-3 text-base leading-7 text-white/66">
                                    If you are verified on Coinbase but this
                                    wallet is not green, open Coinbase EAS and
                                    connect this wallet to your account.
                                  </p>
                                  <p className="mt-3 text-base leading-7 text-white/66">
                                    Every chip in the Select Panel must turn
                                    green before minting can open.
                                  </p>
                                  {verification?.message && (
                                    <p className="mt-4 text-sm leading-6 text-cyan-50/72">
                                      {verification.message}
                                    </p>
                                  )}
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <a
                                      className="console-key-button"
                                      href={coinbaseEasUrl}
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      Coinbase EAS
                                    </a>
                                    <a
                                      className="console-key-button"
                                      href="https://www.coinbase.com/wallet/getting-started-mobile"
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      Get Wallet
                                    </a>
                                  </div>
                                </div>
                                {verification?.mode === "mock" && (
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                    Mock attestation mode
                                  </p>
                                )}
                              </div>
                            )}

                            {selectedGate === "identity" && (
                              <div className="grid gap-3">
                                <div className="grid gap-2 sm:grid-cols-3">
                                  <label className="console-input-field relative block">
                                    <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                                      First Name
                                    </span>
                                    <input
                                      ref={firstNameInputRef}
                                      value={firstName}
                                      onChange={(event) => {
                                        setIdentityConfirmed(false);
                                        setFirstName(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("firstName")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "firstName")
                                      }
                                      className="control-input-surface w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                      placeholder="As it Appears on Coinbase Acct."
                                    />
                                  </label>

                                  <label className="console-input-field relative block">
                                    <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                                      Last Name
                                    </span>
                                    <input
                                      ref={lastNameInputRef}
                                      value={lastName}
                                      onChange={(event) => {
                                        setIdentityConfirmed(false);
                                        setLastName(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("lastName")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "lastName")
                                      }
                                      className="control-input-surface w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                      placeholder="As it Appears on Coinbase Acct."
                                    />
                                  </label>

                                  <label className="console-input-field relative block">
                                    <span className="console-input-label mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em]">
                                      DOB
                                    </span>
                                    <input
                                      ref={dobInputRef}
                                      value={dob}
                                      onChange={(event) => {
                                        setIdentityConfirmed(false);
                                        setDob(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("dob")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "dob")
                                      }
                                      type="date"
                                      className="control-input-surface w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                    />
                                  </label>
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Name and DOB should match your Coinbase identity records.
                                </p>
                              </div>
                            )}

                            {selectedGate === "terms" && (
                              <div className="grid gap-3">
                                <div className="control-surface-soft border border-yellow-300/25 bg-black/45 p-4">
                                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-100">
                                    Terms Agreement
                                  </div>
                                  <p className="mt-3 text-sm leading-6 text-white/68">
                                    Read the terms first, then confirm each
                                    agreement item. The full contract opens only
                                    when you choose Read Terms.
                                  </p>
                                </div>
                                {termsContent}
                              </div>
                            )}

                            {selectedGate === "payment" && (
                              <div
                                className={`control-surface-soft min-h-full border p-4 ${checkoutPanelState}`}
                              >
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Checkout
                                </div>

                                {orderPaid ? (
                                  <div className="portal-pay-button portal-pay-button--confirmed mt-4">
                                    <span>
                                      {activeOrder?.paymentKind === "complimentary"
                                        ? "Comped"
                                        : "Completed"}
                                    </span>
                                    <small>
                                      {activeOrder?.paymentKind === "complimentary"
                                        ? "Admin-issued mint order armed."
                                        : "Mint control armed."}
                                    </small>
                                  </div>
                                ) : checkoutPrerequisitesComplete ? (
                                  <button
                                    className="portal-pay-button portal-pay-button--ready mt-4"
                                    disabled={
                                      !paymentRequired ||
                                      Boolean(activeOrder) ||
                                      orderBusy
                                    }
                                    onClick={createOrder}
                                    type="button"
                                  >
                                    <span>Pay ${paymentAmount}</span>
                                    <small>
                                      {directPaymentEnabled
                                        ? "Base USDC direct payment"
                                        : "We cover the gas fees"}
                                    </small>
                                  </button>
                                ) : (
                                  <div className="portal-pay-button portal-pay-button--waiting mt-4">
                                    <span>Sequence Not Completed</span>
                                    <small>
                                      Wallet, EAS, identity, and terms must be green first.
                                    </small>
                                  </div>
                                )}

                                {checkoutPrerequisitesComplete && !paymentRequired && (
                                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                                    Payment is not enabled in this environment.
                                  </p>
                                )}

                                {activeOrder && paymentRequired && (
                                  <div className="mt-4 grid gap-3">
                                    {thirdwebClient &&
                                      checkoutEnabled &&
                                      paymentSeller &&
                                      paymentTokenAddress &&
                                      !orderPaid && (
                                        <CheckoutWidget
                                          amount={paymentAmount}
                                          chain={base}
                                          client={thirdwebClient}
                                          description="Verified mint order for the Sovereign Portal deed."
                                          feePayer="seller"
                                          name="Certificate of Title for Spiritual Ownership"
                                          onSuccess={() => {
                                            setPaymentNotice(
                                              "Checkout completed. Refresh until the verified webhook marks this mint order paid.",
                                            );
                                          }}
                                          purchaseData={{
                                            orderId: activeOrder.orderId,
                                            paymentAmount,
                                            publicMark,
                                            wallet: account?.address,
                                          }}
                                          seller={paymentSeller as `0x${string}`}
                                          showThirdwebBranding={false}
                                          tokenAddress={paymentTokenAddress as `0x${string}`}
                                        />
                                      )}
                                    {directPaymentEnabled && !orderPaid && (
                                      <button
                                        className="portal-pay-button portal-pay-button--ready"
                                        disabled={directPaymentBusy || orderBusy}
                                        onClick={handleDirectBuilderPayment}
                                        type="button"
                                      >
                                        <span>
                                          {directPaymentBusy
                                            ? "Verifying"
                                            : "Send Base USDC"}
                                        </span>
                                        <small>
                                          Wallet pays gas. Builder Code suffix attached.
                                        </small>
                                      </button>
                                    )}
                                    <div className="control-surface-soft flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/55 px-3 py-3 text-xs text-white/58">
                                      <span className="break-all">
                                        Order {activeOrder.orderId} / {activeOrder.status}
                                        {activeOrder.paymentKind === "complimentary"
                                          ? " / complimentary"
                                          : ""}
                                      </span>
                                      <button
                                        className="console-key-button"
                                        disabled={orderBusy}
                                        onClick={refreshOrder}
                                        type="button"
                                      >
                                        Refresh Status
                                      </button>
                                      {activeOrder.status === "pending_payment" && (
                                        <button
                                          className="console-key-button"
                                          disabled={orderBusy}
                                          onClick={discardPendingOrder}
                                          type="button"
                                        >
                                          Start New Order
                                        </button>
                                      )}
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

                            {selectedGate === "mint" && (
                              <div className="control-surface-soft border border-white/10 p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Final Authorization
                                </div>
                                <p className="mt-3 text-sm leading-6 text-white/62">
                                  {receipt
                                    ? "Mint submitted. Use the receipt below to track the transaction and token metadata."
                                    : canMint
                                      ? "All checks are complete. Press Mint once to submit the deed."
                                      : "Mint unlocks after wallet, EAS, identity, terms, and payment gates are green."}
                                </p>
                              </div>
                            )}
                          </div>

                          <button
                            className={`portal-console-enter mt-auto ${
                              gateEnterEnabled
                                ? "portal-console-enter--ready"
                                : "portal-console-enter--locked"
                            }`}
                            disabled={!gateEnterEnabled}
                            onClick={() => void handleGateEnter()}
                            type="button"
                          >
                            {gateEnterLabel}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="control-surface-soft portal-surface-red mt-4 border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
                        {error}
                      </div>
                    )}

                  </div>
                </div>
          </section>
            </>
          )}

        </section>
      </div>

      {!receipt && (
      <button
        aria-controls="portal-mobile-select-drawer"
        aria-expanded={mobileGateDrawerOpen}
        className="console-key-button portal-mobile-select-trigger portal-mobile-select-trigger--attention"
        onClick={() => setMobileGateDrawerOpen(true)}
        ref={mobileGateTriggerRef}
        type="button"
      >
        <span>Console</span>
        <span>Controls</span>
      </button>
      )}

      {termsReviewOpen && (
        <div className="portal-terms-layer">
          <section
            aria-label="Certificate terms"
            aria-modal="true"
            className="control-surface-soft portal-terms-panel border border-yellow-300/25 p-4 md:p-6"
            role="dialog"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-yellow-200/72">
                  Full Page Review
                </div>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-yellow-50 md:text-4xl">
                  Certificate Terms
                </h2>
              </div>
              <button
                className="console-key-button portal-terms-action-button portal-terms-close-button"
                onClick={() => {
                  setTermsReviewOpen(false);
                  setPlainEnglishTermsOpen(false);
                }}
                type="button"
              >
                Close Review
              </button>
            </div>
            <div className="control-surface-soft portal-terms-certificate space-y-3 overflow-y-auto border border-yellow-300/25 bg-black/55 p-4 text-xs leading-6 text-white/65">
              {plainEnglishTermsOpen ? (
                <>
                  <p className="portal-terms-priority text-yellow-100 uppercase tracking-[0.18em]">
                    Plain English Summary
                  </p>
                  {plainEnglishCertificateSummary.map((paragraph) => (
                    <p
                      className="portal-terms-priority"
                      key={paragraph.slice(0, 32)}
                    >
                      {paragraph}
                    </p>
                  ))}
                </>
              ) : (
                contractLanguage.map((paragraph, index) => {
                  const isHeading =
                    index === 0 || paragraph.startsWith("SECTION ");
                  const isPriorityTerms =
                    index <
                    contractLanguage.findIndex((entry) =>
                      entry.startsWith("SECTION IV"),
                    );

                  return (
                    <p
                      key={`${paragraph.slice(0, 24)}-${index}`}
                      className={`${isPriorityTerms ? "portal-terms-priority" : ""} ${
                        isHeading
                          ? "text-yellow-100 uppercase tracking-[0.18em]"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  );
                })
              )}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                className="console-key-button portal-terms-action-button"
                onClick={() => setPlainEnglishTermsOpen((current) => !current)}
                type="button"
              >
                {plainEnglishTermsOpen ? "Formal Terms" : "Plain English Summary"}
              </button>
              <button
                className="console-key-button portal-terms-action-button"
                onClick={downloadFormalTerms}
                type="button"
              >
                Download Formal Terms
              </button>
            </div>
          </section>
        </div>
      )}

      {mobileGateDrawerOpen && (
        <div className="portal-mobile-select-layer">
          <button
            aria-label="Close Select Panel"
            className="portal-mobile-select-backdrop"
            onClick={() => {
              setMobileGateDrawerOpen(false);
              mobileGateTriggerRef.current?.focus();
            }}
            type="button"
          />
          <aside
            aria-label="Select Panel"
            aria-modal="true"
            className="control-surface-soft portal-mobile-select-drawer border border-cyan-100/18 p-4"
            id="portal-mobile-select-drawer"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-50">
                Select Panel
              </div>
              <button
                className="console-key-button portal-mobile-select-close"
                onClick={() => {
                  setMobileGateDrawerOpen(false);
                  mobileGateTriggerRef.current?.focus();
                }}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="portal-mobile-select-grid">
              {gateReadouts.map((gate) => (
                <button
                  aria-pressed={selectedGate === gate.key}
                  className={`console-key-button portal-gate-button portal-mobile-select-chip ${
                    selectedGate === gate.key
                      ? "portal-gate-button--selected"
                      : ""
                  } ${
                    gate.key === "wallet" ||
                    gate.key === "identity" ||
                    gate.key === "payment"
                      ? "portal-gate-button--right-chamfer"
                      : "portal-gate-button--left-chamfer"
                  } ${gate.enabled ? gate.stateClass : "console-key-button--disabled"}`}
                  key={gate.key}
                  onClick={() => {
                    selectGate(gate.key);
                    setMobileGateDrawerOpen(false);
                  }}
                  type="button"
                >
                  <span>{gate.label}</span>
                  <small>{gate.value}</small>
                </button>
              ))}
            </div>
            <div className="portal-mobile-drawer-actions">
              <Link
                className="console-key-button portal-mobile-drawer-action"
                href="/"
                onClick={() => setMobileGateDrawerOpen(false)}
              >
                Home
              </Link>
              <Link
                className="console-key-button portal-mobile-drawer-action"
                href="/engine"
                onClick={() => setMobileGateDrawerOpen(false)}
              >
                Engine Room
              </Link>
            </div>
          </aside>
        </div>
      )}
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
