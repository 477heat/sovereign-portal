"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createThirdwebClient,
  prepareTransaction,
  sendAndConfirmTransaction,
} from "thirdweb";
import { base } from "thirdweb/chains";
import {
  CheckoutWidget,
  ThirdwebProvider,
  useActiveAccount,
  useConnectModal,
} from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import {
  contractLanguage,
  contractLanguageVersion,
} from "./contractLanguage";
import {
  birthCountryOptions,
  birthRegionOptionsByCountry,
} from "./birth-location-options";
import {
  encodeErc20TransferCalldata,
  isDirectPaymentWalletAllowed,
} from "@/lib/directBuilderPayment";
import {
  buildMintOrderStatusMessage,
  buildMintRecoveryMessage,
} from "@/lib/portalMessages";
import { preLaunchOffer } from "@/lib/preLaunchOffer";
import { ipfsGatewayUrl, ipfsGatewayUrls } from "@/lib/ipfs";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import type {
  BirthLocationSuggestion,
  FullSoulStatPreview,
  IdentityField,
  MintOrderState,
  MintReceipt,
  PortalGate,
  PortalGateReadout,
  PortalPaymentFlow,
  PortalPaymentSettings,
  ReceiptDetailRow,
  VerificationState,
  VerifiedBirthLocation,
} from "./portal-types";
import {
  PortalGateIcon,
  PortalMobileSelectDrawer,
  PortalReceiptCompletePanel,
  PortalTermsChecklist,
  PortalTermsReviewModal,
} from "./portal-components";

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

const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
  : null;
const defaultPaymentAmount =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ?? preLaunchOffer.amount;
const defaultPaymentSeller = process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
const defaultPaymentTokenAddress =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
const defaultPaymentTokenDecimals = Number.parseInt(
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
  10,
);
const defaultBuilderCodeDataSuffix =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE_DATA_SUFFIX;
const defaultDirectPaymentAllowedWallets =
  process.env.NEXT_PUBLIC_PORTAL_DIRECT_PAYMENT_ALLOWED_WALLETS;
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
const ARTIFACT_NAME_MAX_LENGTH = 12;
const EAS_DATABASE_SEARCH_DELAY_MS = 4000;
const GATE_DELAY_MS = {
  artifact: 650,
  terms: 780,
  payment: 620,
  autoMint: 1180,
};
const GATE_FEEDBACK_DELAY_MS = {
  wallet: 1800,
  eas: EAS_DATABASE_SEARCH_DELAY_MS,
  identity: 2600,
  artifact: 2400,
  terms: 1800,
  payment: 2600,
  mint: 2200,
} satisfies Record<PortalGate, number>;

type GateFeedbackPhase = "blocked" | "confirmed" | "processing";
type PortalSequenceVideoPhase = "complete" | "final" | "idle" | "intro" | "loop";

type GateFeedbackState = {
  detail: string;
  gate: PortalGate;
  message: string;
  phase: GateFeedbackPhase;
};

const PORTAL_SEQUENCE_VIDEO_SRC = "/media/portal-screen.mp4";
const PORTAL_SEQUENCE_INTRO_END_SECONDS = 6.4;
const PORTAL_SEQUENCE_LOOP_START_SECONDS = 1.2;
const PORTAL_SEQUENCE_LOOP_END_SECONDS = 6.4;
const PORTAL_SEQUENCE_FINAL_START_SECONDS = 6.4;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const portalAppMetadata = {
  name: "Sovereign Portal",
  url: siteUrl,
  description: "Sovereign Engine Genesis Access mint path on Base.",
  logoUrl: absoluteUrl("/brand/sovereign-engine-site-logo-512.png"),
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
const portalConnectModal = {
  title: "Connect Base Wallet",
  titleIcon: "",
  size: "compact",
  showThirdwebBranding: false,
} as const;
const previewReceipt: MintReceipt = {
  status: "submitted",
  deedName: "Certificate of Title for Spiritual Ownership of K. Mil",
  mode: "live",
  chainId: 8453,
  contractAddress: "0x2df9151c4e32082a05c686bd3092180134d17deb",
  orderId: "preview-order-a74ce28e",
  transactionId: "a74ce28e-b3da-43d2-a821-640dea0ae3a1",
  transactionHash:
    "0xaa68adcf2dc5f2b2741b8f3c1df8a9ede6a52f48f2364c25424784d0ff5e1861",
  tokenURI: "ipfs://QmeAcwMSCHMngHo11qWWiwdgn8cPBiumBbH9yCpAv4Sis2",
  metadataUrl: "https://ipfs.io/ipfs/QmeAcwMSCHMngHo11qWWiwdgn8cPBiumBbH9yCpAv4Sis2",
  ipfsHash: "QmeAcwMSCHMngHo11qWWiwdgn8cPBiumBbH9yCpAv4Sis2",
  imageURI: "ipfs://Qmf2cpm1J2iBa87qgbSY1NmsYTkWS2DF9gS6Nr3Qpjh1tE",
  imageUrl: "https://ipfs.io/ipfs/Qmf2cpm1J2iBa87qgbSY1NmsYTkWS2DF9gS6Nr3Qpjh1tE",
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

function isValidArtifactName(value: string) {
  const normalized = value.trim();
  return (
    !normalized ||
    (normalized.length <= ARTIFACT_NAME_MAX_LENGTH &&
      /^[A-Z0-9][A-Z0-9 ]*$/.test(normalized))
  );
}

function normalizeArtifactNameInput(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, ARTIFACT_NAME_MAX_LENGTH);
}

function shortAddress(address?: string) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function PortalContent() {
  const account = useActiveAccount();
  const { connect: openConnectModal, isConnecting } = useConnectModal();
  const firstNameInputRef = useRef<HTMLInputElement | null>(null);
  const lastNameInputRef = useRef<HTMLInputElement | null>(null);
  const dobInputRef = useRef<HTMLInputElement | null>(null);
  const birthTimeInputRef = useRef<HTMLInputElement | null>(null);
  const birthCityInputRef = useRef<HTMLInputElement | null>(null);
  const characterNameInputRef = useRef<HTMLInputElement | null>(null);
  const mobileGateTriggerRef = useRef<HTMLButtonElement | null>(null);
  const portalSequenceVideoRef = useRef<HTMLVideoElement | null>(null);
  const portalSequenceStartedRef = useRef(false);
  const autoMintOrderRef = useRef<string | null>(null);
  const handleMintRef = useRef<(() => Promise<void>) | null>(null);
  const gateFeedbackTimersRef = useRef<number[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCountryCode, setBirthCountryCode] = useState("US");
  const [birthRegionCode, setBirthRegionCode] = useState("");
  const [birthCityQuery, setBirthCityQuery] = useState("");
  const [birthLocation, setBirthLocation] =
    useState<VerifiedBirthLocation | null>(null);
  const [birthLocationSuggestions, setBirthLocationSuggestions] = useState<
    BirthLocationSuggestion[]
  >([]);
  const [birthLocationStatus, setBirthLocationStatus] = useState<
    "error" | "idle" | "loading" | "ready"
  >("idle");
  const [birthLocationMessage, setBirthLocationMessage] = useState("");
  const [fullSoulStatPreview, setFullSoulStatPreview] =
    useState<FullSoulStatPreview | null>(null);
  const [fullSoulStatStatus, setFullSoulStatStatus] = useState<
    "error" | "idle" | "loading" | "ready"
  >("idle");
  const [fullSoulStatMessage, setFullSoulStatMessage] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [artifactConfirmed, setArtifactConfirmed] = useState(false);
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
  const [receiptRevealReady, setReceiptRevealReady] = useState(false);
  const [portalSequenceVideoPhase, setPortalSequenceVideoPhase] =
    useState<PortalSequenceVideoPhase>("idle");
  const [receiptMetadataImageURI, setReceiptMetadataImageURI] = useState<
    string | undefined
  >();
  const [receiptImageFallback, setReceiptImageFallback] = useState({
    index: 0,
    key: "",
  });
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
  const [receiptCopied, setReceiptCopied] = useState(false);
  const [error, setError] = useState("");
  const [gateFeedback, setGateFeedback] = useState<GateFeedbackState | null>(
    null,
  );
  const [previewShellRequested, setPreviewShellRequested] = useState(false);
  const [mobileGateDrawerOpen, setMobileGateDrawerOpen] = useState(false);
  const previewShellActive = previewShellEnabled && previewShellRequested;

  const publicMark = useMemo(
    () => buildPublicMark(firstName, lastName),
    [firstName, lastName],
  );
  const birthRegionOptions =
    birthRegionOptionsByCountry[birthCountryCode] ?? [];
  const selectedBirthRegion = birthRegionOptions.find(
    (region) => region.code === birthRegionCode,
  );
  const birthLocationReady = Boolean(birthTime && birthLocation?.verified);
  const artifactNameValid = isValidArtifactName(characterName);
  const burnedArtifactName = characterName.trim() || publicMark;
  const identityInputReady =
    Boolean(firstName.trim()) &&
    Boolean(lastName.trim()) &&
    Boolean(dob) &&
    birthLocationReady &&
    publicMark !== "_. ___";
  const hasIdentity = identityInputReady && identityConfirmed;
  const artifactInputReady =
    hasIdentity && artifactNameValid && burnedArtifactName !== "_. ___";
  const hasArtifact = artifactInputReady && artifactConfirmed;
  const deedAccepted =
    accuracyAccepted && publicMarkAccepted && contractAccepted;
  const activeOrder =
    mintOrder?.wallet === account?.address?.toLowerCase() ? mintOrder : null;
  const checkoutEnabled = paymentSettings.checkoutEnabled;
  const directPaymentConfigured = Boolean(paymentSettings.directPaymentEnabled);
  const directPaymentAllowedForWallet = isDirectPaymentWalletAllowed(
    account?.address,
    defaultDirectPaymentAllowedWallets,
  );
  const directPaymentEnabled =
    directPaymentConfigured && directPaymentAllowedForWallet;
  const paymentAmount = activeOrder?.paymentAmount ?? paymentSettings.paymentAmount;
  const paymentDisplayAmount = `$${paymentAmount.replace(/\.00$/, "")}`;
  const paymentSeller = paymentSettings.paymentSeller;
  const paymentTokenAddress = paymentSettings.paymentTokenAddress;
  const paymentTokenDecimals =
    paymentSettings.paymentTokenDecimals ?? defaultPaymentTokenDecimals;
  const paymentRequired = checkoutEnabled || directPaymentConfigured;
  const paymentOrderStartAllowed =
    paymentRequired &&
    (!directPaymentConfigured || directPaymentAllowedForWallet || checkoutEnabled);
  const checkoutReady =
    Boolean(account?.address) &&
    Boolean(verification?.eligible) &&
    hasIdentity &&
    hasArtifact &&
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
    hasArtifact &&
    deedAccepted &&
    orderPaid &&
    !receipt &&
    !minting;
  const termsAwaitingArtifact = !hasArtifact && !deedAccepted;
  const paymentAwaitingTerms = !deedAccepted;
  const checkoutPrerequisitesComplete = checkoutReady;
  const checkoutPanelState = checkoutPrerequisitesComplete
    ? "console-status-tile--entered"
    : "console-status-tile--waiting";
  const receiptImageURI = receipt?.imageURI ?? receiptMetadataImageURI;
  const receiptImageUrls = useMemo(
    () => ipfsGatewayUrls(receiptImageURI, receipt?.imageUrl),
    [receipt?.imageUrl, receiptImageURI],
  );
  const receiptImageKey = `${receiptImageURI ?? ""}|${receipt?.imageUrl ?? ""}`;
  const receiptImageUrlIndex =
    receiptImageFallback.key === receiptImageKey
      ? receiptImageFallback.index
      : 0;
  const receiptImageUrl =
    receiptImageUrls[receiptImageUrlIndex] ?? receiptImageUrls[0];
  const receiptMetadataUrl =
    ipfsGatewayUrl(receipt?.tokenURI) ?? receipt?.metadataUrl;
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
        receipt.tokenId ? `Token ID: ${receipt.tokenId}` : "",
        receipt.orderId ? `Order ID: ${receipt.orderId}` : "",
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
  const showReceiptPanel = Boolean(receipt && receiptRevealReady);

  const clearGateFeedbackTimers = useCallback(() => {
    gateFeedbackTimersRef.current.forEach((timerId) =>
      window.clearTimeout(timerId),
    );
    gateFeedbackTimersRef.current = [];
  }, []);

  const showGateFeedback = useCallback((
    gate: PortalGate,
    phase: GateFeedbackPhase,
    message: string,
    detail: string,
    autoClearMs = phase === "processing" ? 0 : 2200,
  ) => {
    clearGateFeedbackTimers();
    setGateFeedback({
      detail,
      gate,
      message,
      phase,
    });

    if (autoClearMs > 0) {
      const clearTimer = window.setTimeout(() => {
        setGateFeedback(null);
      }, autoClearMs);
      gateFeedbackTimersRef.current.push(clearTimer);
    }
  }, [clearGateFeedbackTimers]);

  const playPortalSequenceVideoFrom = useCallback((startSeconds: number) => {
    const video = portalSequenceVideoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = startSeconds;
    void video.play().catch(() => {
      // Muted video playback should be allowed, but the flow should keep moving
      // if a browser still refuses to start media in this moment.
    });
  }, []);

  const startPortalSequenceVideo = useCallback(() => {
    if (portalSequenceStartedRef.current) {
      return;
    }

    portalSequenceStartedRef.current = true;
    setPortalSequenceVideoPhase("intro");
    playPortalSequenceVideoFrom(0);
  }, [playPortalSequenceVideoFrom]);

  function resetPortalSequenceVideo() {
    const video = portalSequenceVideoRef.current;

    portalSequenceStartedRef.current = false;
    setPortalSequenceVideoPhase("idle");
    setReceiptRevealReady(false);

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  function startPortalReceiptReveal() {
    const video = portalSequenceVideoRef.current;

    setReceiptRevealReady(false);
    setPortalSequenceVideoPhase("final");

    if (!video) {
      setPortalSequenceVideoPhase("complete");
      setReceiptRevealReady(true);
      return;
    }

    video.currentTime = PORTAL_SEQUENCE_FINAL_START_SECONDS;
    void video.play().catch(() => {
      setPortalSequenceVideoPhase("complete");
      setReceiptRevealReady(true);
    });
  }

  function handlePortalSequenceTimeUpdate() {
    const video = portalSequenceVideoRef.current;

    if (!video) {
      return;
    }

    if (
      portalSequenceVideoPhase === "intro" &&
      video.currentTime >= PORTAL_SEQUENCE_INTRO_END_SECONDS
    ) {
      setPortalSequenceVideoPhase("loop");
      playPortalSequenceVideoFrom(PORTAL_SEQUENCE_LOOP_START_SECONDS);
      return;
    }

    if (
      portalSequenceVideoPhase === "loop" &&
      video.currentTime >= PORTAL_SEQUENCE_LOOP_END_SECONDS
    ) {
      playPortalSequenceVideoFrom(PORTAL_SEQUENCE_LOOP_START_SECONDS);
    }
  }

  function handlePortalSequenceEnded() {
    if (portalSequenceVideoPhase !== "final") {
      return;
    }

    setPortalSequenceVideoPhase("complete");
    setReceiptRevealReady(true);
  }

  useEffect(() => {
    return () => {
      clearGateFeedbackTimers();
    };
  }, [clearGateFeedbackTimers]);

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
          setReceiptRevealReady(true);
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
    const query = birthCityQuery.trim();

    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const lookupTimer = window.setTimeout(async () => {
      setBirthLocationStatus("loading");
      setBirthLocationMessage("");

      try {
        const response = await fetch("/api/location/suggest", {
          body: JSON.stringify({
            countryCode: birthCountryCode,
            limit: 6,
            region: selectedBirthRegion?.label ?? birthRegionCode,
            text: query,
          }),
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          message?: string;
          results?: BirthLocationSuggestion[];
        };

        if (!response.ok) {
          throw new Error(result.message ?? "Birthplace lookup failed.");
        }

        setBirthLocationSuggestions(result.results ?? []);
        setBirthLocationStatus("ready");
        setBirthLocationMessage(
          result.results?.length ? "" : "No verified city matches found.",
        );
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setBirthLocationSuggestions([]);
        setBirthLocationStatus("error");
        setBirthLocationMessage(
          caughtError instanceof Error
            ? caughtError.message
            : "Birthplace lookup failed.",
        );
      }
    }, 320);

    return () => {
      controller.abort();
      window.clearTimeout(lookupTimer);
    };
  }, [
    birthCityQuery,
    birthCountryCode,
    birthRegionCode,
    selectedBirthRegion?.label,
  ]);

  useEffect(() => {
    if (selectedGate !== "identity" && selectedGate !== "artifact") {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      if (selectedGate === "artifact") {
        characterNameInputRef.current?.focus();
        return;
      }

      const target =
        identityFocus === "firstName"
          ? firstNameInputRef.current
          : identityFocus === "lastName"
            ? lastNameInputRef.current
            : identityFocus === "dob"
              ? dobInputRef.current
              : identityFocus === "birthTime"
                ? birthTimeInputRef.current
                : birthCityInputRef.current;

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
        setGateFeedback(null);
        return;
      }

      startPortalSequenceVideo();
      setSelectedGate((currentGate) =>
        currentGate === "wallet" ? "eas" : currentGate,
      );
      setVerification(null);
      setCheckingAttestation(true);
      setError("");
      showGateFeedback(
        "eas",
        "processing",
        "EAS sweep running",
        "Searching Coinbase attestations for this wallet.",
      );

      try {
        await wait(EAS_DATABASE_SEARCH_DELAY_MS);

        if (ignore) {
          return;
        }

        const response = await fetch(`/api/attestation?address=${account.address}`);
        const result = (await response.json()) as VerificationState;

        if (!ignore) {
          setVerification(result);
          if (result.eligible) {
            showGateFeedback(
              "eas",
              "confirmed",
              "Human verification confirmed",
              "Coinbase EAS attestation is attached to this wallet.",
            );
            window.setTimeout(() => {
              if (!ignore) {
                setSelectedGate("identity");
                setGateFeedback(null);
              }
            }, 1700);
          } else {
            showGateFeedback(
              "eas",
              "blocked",
              "EAS check complete",
              "No verified human attestation was found for this wallet.",
              3200,
            );
          }
        }
      } catch {
        if (!ignore) {
          setError("Attestation service is not responding yet.");
          setVerification(null);
          showGateFeedback(
            "eas",
            "blocked",
            "EAS check interrupted",
            "The attestation service did not answer. Try again in a moment.",
            3200,
          );
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
  }, [account?.address, showGateFeedback, startPortalSequenceVideo]);

  useEffect(() => {
    let ignore = false;

    async function loadReceiptImageFromMetadata() {
      setReceiptMetadataImageURI(undefined);

      if (!receipt?.tokenURI || receipt.imageURI) {
        return;
      }

      const metadataUrl = ipfsGatewayUrl(receipt.tokenURI);

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
    setReceiptRevealReady(false);
    startPortalSequenceVideo();
    showGateFeedback(
      "mint",
      "processing",
      "Mint sequence transmitting",
      "Submitting the protected mint request to the backend.",
    );

    try {
      await wait(GATE_FEEDBACK_DELAY_MS.mint);
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: account.address,
          firstName,
          lastName,
          characterName,
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
      startPortalReceiptReveal();
      showGateFeedback(
        "mint",
        "confirmed",
        "Mint request confirmed",
        "Receipt data returned from the mint route.",
      );
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
      showGateFeedback(
        "mint",
        "blocked",
        "Mint sequence stopped",
        "The backend did not accept the mint request.",
        3200,
      );
    } finally {
      setMinting(false);
    }
  }

  useEffect(() => {
    handleMintRef.current = handleMint;
  });

  useEffect(() => {
    if (!canMint || !account?.address || !orderPaid) {
      return;
    }

    const autoMintKey = activeOrder?.orderId ?? account.address.toLowerCase();

    if (autoMintOrderRef.current === autoMintKey) {
      return;
    }

    autoMintOrderRef.current = autoMintKey;
    setSelectedGate("mint");

    const autoMintTimer = window.setTimeout(() => {
      void handleMintRef.current?.();
    }, GATE_DELAY_MS.autoMint);

    return () => window.clearTimeout(autoMintTimer);
  }, [account?.address, activeOrder?.orderId, canMint, orderPaid]);

  async function createOrder() {
    if (!checkoutReady || !account?.address) {
      return;
    }

    setOrderBusy(true);
    setError("");
    setPaymentNotice("");
    showGateFeedback(
      "payment",
      "processing",
      "Order gate processing",
      "Preparing the verified mint order.",
    );

    try {
      await wait(GATE_FEEDBACK_DELAY_MS.payment);
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
      showGateFeedback(
        "payment",
        "confirmed",
        "Order gate confirmed",
        "Mint order is prepared for checkout.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not prepare checkout.",
      );
      showGateFeedback(
        "payment",
        "blocked",
        "Order gate stopped",
        "Checkout could not be prepared.",
        3200,
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
      !defaultBuilderCodeDataSuffix ||
      !directPaymentAllowedForWallet
    ) {
      setError("Direct Base payment is not fully configured.");
      return;
    }

    setDirectPaymentBusy(true);
    setError("");
    setPaymentNotice("Confirm the Base USDC payment in your wallet.");
    showGateFeedback(
      "payment",
      "processing",
      "Payment verification running",
      "Waiting for wallet confirmation and order verification.",
    );

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
      showGateFeedback(
        "payment",
        "confirmed",
        "Payment gate confirmed",
        "Base payment was verified and mint control is armed.",
      );
      setSelectedGate("mint");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Direct payment was not confirmed.",
      );
      showGateFeedback(
        "payment",
        "blocked",
        "Payment gate stopped",
        "Direct payment was not confirmed.",
        3200,
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
    showGateFeedback(
      "payment",
      "processing",
      "Order status scanning",
      "Checking the latest payment and mint order status.",
    );

    try {
      await wait(GATE_FEEDBACK_DELAY_MS.payment);
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
        order?: MintOrderState;
        receipt?: MintReceipt | null;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not refresh payment status.");
      }

      setMintOrder(result.order ?? result);
      showGateFeedback(
        "payment",
        "confirmed",
        "Order status confirmed",
        "Latest order status has been received.",
      );

      if (result.receipt) {
        setReceipt(result.receipt);
        setReceiptRevealReady(true);
        setSelectedGate("mint");
        setPaymentNotice("Mint receipt restored. Save or copy it before leaving.");
      } else if ((result.order ?? result).status === "mint_submitted") {
        setPaymentNotice(
          "Mint is submitted, but receipt details are still syncing. Try Recover Receipt with the same wallet.",
        );
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not refresh payment status.",
      );
      showGateFeedback(
        "payment",
        "blocked",
        "Order scan stopped",
        "Payment status could not be refreshed.",
        3200,
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
    setPaymentNotice("");
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
        setReceiptRevealReady(true);
        setSelectedGate("mint");
        setPaymentNotice("Receipt restored. Save or copy it before leaving.");
        return;
      }

      setPaymentNotice(
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

  function clearPortalFormData() {
    setFirstName("");
    setLastName("");
    setDob("");
    setBirthTime("");
    setBirthCountryCode("US");
    setBirthRegionCode("");
    setBirthCityQuery("");
    setBirthLocation(null);
    setBirthLocationSuggestions([]);
    setBirthLocationStatus("idle");
    setBirthLocationMessage("");
    setCharacterName("");
    setIdentityConfirmed(false);
    setArtifactConfirmed(false);
    setAccuracyAccepted(false);
    setContractAccepted(false);
    setPublicMarkAccepted(false);
    setCertificateOpened(false);
    setPaymentNotice("");
    setError("");
    setGateFeedback(null);
    setReceipt(null);
    resetPortalSequenceVideo();
    setSelectedGate("identity");
  }

  function resetFullSoulStatPreview() {
    setFullSoulStatPreview(null);
    setFullSoulStatStatus("idle");
    setFullSoulStatMessage("");
  }

  async function requestFullSoulStatPreview() {
    if (!identityInputReady || !birthLocation) {
      return;
    }

    setFullSoulStatStatus("loading");
    setFullSoulStatMessage("Calculating Full Soul Stat.");

    try {
      const response = await fetch("/api/full-soul-stat", {
        body: JSON.stringify({
          birthLocation,
          birthTime,
          dob,
          firstName,
          lastName,
        }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as {
        fullSoulStat?: FullSoulStatPreview;
        message?: string;
      };

      if (!response.ok || !result.fullSoulStat) {
        throw new Error(result.message ?? "Full Soul Stat calculation failed.");
      }

      setFullSoulStatPreview(result.fullSoulStat);
      setFullSoulStatStatus("ready");
      setFullSoulStatMessage("Full Soul Stat ready.");
    } catch (error) {
      setFullSoulStatPreview(null);
      setFullSoulStatStatus("error");
      setFullSoulStatMessage(
        error instanceof Error
          ? error.message
          : "Full Soul Stat calculation failed.",
      );
    }
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

    setVerification(null);
    setCheckingAttestation(true);
    setError("");
    showGateFeedback(
      "eas",
      "processing",
      "EAS sweep running",
      "Searching Coinbase attestations for this wallet.",
    );

    try {
      await wait(EAS_DATABASE_SEARCH_DELAY_MS);
      const response = await fetch(`/api/attestation?address=${account.address}`);
      const result = (await response.json()) as VerificationState;
      setVerification(result);

      if (result.eligible) {
        showGateFeedback(
          "eas",
          "confirmed",
          "Human verification confirmed",
          "Coinbase EAS attestation is attached to this wallet.",
        );
        await wait(1700);
        setSelectedGate("identity");
      } else {
        showGateFeedback(
          "eas",
          "blocked",
          "EAS check complete",
          "No verified human attestation was found for this wallet.",
          3200,
        );
      }
    } catch {
      setError("Attestation service is not responding yet.");
      setVerification(null);
      showGateFeedback(
        "eas",
        "blocked",
        "EAS check interrupted",
        "The attestation service did not answer. Try again in a moment.",
        3200,
      );
    } finally {
      setCheckingAttestation(false);
    }
  }

  async function confirmIdentityEntry() {
    if (!identityInputReady) {
      return;
    }

    showGateFeedback(
      "identity",
      "processing",
      "Identity scan running",
      "Matching name, date, birthplace, and public marker for this session.",
    );
    await wait(GATE_FEEDBACK_DELAY_MS.identity);
    setIdentityConfirmed(true);
    showGateFeedback(
      "identity",
      "confirmed",
      "Identity entry confirmed",
      "Name, date, birth coordinates, and public marker are locked for the next gate.",
    );
    void requestFullSoulStatPreview();
    await wait(GATE_DELAY_MS.artifact + 900);
    setSelectedGate("artifact");
  }

  function selectBirthLocation(suggestion: BirthLocationSuggestion) {
    resetFullSoulStatPreview();
    setBirthLocation({
      ...suggestion,
      source: "amazon_location",
      verified: true,
    });
    setBirthCityQuery(suggestion.label);
    setBirthLocationSuggestions([]);
    setBirthLocationStatus("ready");
    setBirthLocationMessage("Birthplace verified.");
    setIdentityConfirmed(false);
    setArtifactConfirmed(false);
  }

  async function confirmArtifactEntry() {
    if (!artifactInputReady) {
      return;
    }

    showGateFeedback(
      "artifact",
      "processing",
      "Artifact engraving scan",
      "Checking the public mark and display name before lock-in.",
    );
    await wait(GATE_FEEDBACK_DELAY_MS.artifact);
    setArtifactConfirmed(true);
    showGateFeedback(
      "artifact",
      "confirmed",
      "Artifact name locked",
      `${burnedArtifactName} is ready for certificate review.`,
    );
    await wait(GATE_DELAY_MS.terms + 900);
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

    if (field === "dob" && dob) {
      setIdentityFocus("birthTime");
      return;
    }

    if (field === "birthTime" && birthTime) {
      setIdentityFocus("birthCity");
      return;
    }

    if (
      (field === "birthCity" || field === "birthTime" || field === "dob") &&
      identityInputReady
    ) {
      void confirmIdentityEntry();
    }
  }

  async function handleGateEnter() {
    if (selectedGate === "wallet") {
      if (!account?.address) {
        await handleWalletChipConnect();
        return;
      }

      showGateFeedback(
        "wallet",
        "processing",
        "Wallet link processing",
        "Confirming this address as the live mint recipient.",
      );
      await wait(GATE_FEEDBACK_DELAY_MS.wallet);
      showGateFeedback(
        "wallet",
        "confirmed",
        "Wallet recipient confirmed",
        "This address is now staged for EAS verification.",
      );
      await wait(900);
      setSelectedGate("eas");
      return;
    }

    if (selectedGate === "eas") {
      if (account?.address && verification && !verification.eligible) {
        window.open(coinbaseEasUrl, "_blank", "noopener,noreferrer");
        return;
      }

      await refreshWalletAttestation();
      return;
    }

    if (selectedGate === "identity") {
      await confirmIdentityEntry();
      return;
    }

    if (selectedGate === "artifact") {
      await confirmArtifactEntry();
      return;
    }

    if (selectedGate === "terms") {
      if (deedAccepted) {
        showGateFeedback(
          "terms",
          "processing",
          "Terms gate processing",
          "Confirming certificate review and agreement checks.",
        );
        await wait(GATE_FEEDBACK_DELAY_MS.terms);
        showGateFeedback(
          "terms",
          "confirmed",
          "Terms gate confirmed",
          "Agreement checks are complete.",
        );
        await wait(GATE_DELAY_MS.payment + 800);
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
  }

  function selectGate(gate: PortalGate) {
    setSelectedGate(gate);

    if (gate === "identity") {
      setIdentityFocus(
        firstName.trim()
          ? lastName.trim()
            ? "dob"
            : "lastName"
          : "firstName",
      );
    }
  }

  const gateReadouts: PortalGateReadout[] = [
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
      enabled: Boolean(verification?.eligible) || hasIdentity,
      stateClass: hasIdentity
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "artifact",
      label: "Artifact",
      value: hasArtifact ? burnedArtifactName : artifactNameValid ? "Name" : "Fix",
      complete: hasArtifact,
      enabled: hasIdentity,
      stateClass: hasArtifact
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "terms",
      label: "Terms",
      value: deedAccepted
        ? "Agreed"
        : termsAwaitingArtifact
          ? "Waiting"
          : "Verify",
      complete: deedAccepted,
      enabled: hasArtifact || deedAccepted,
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
            : paymentDisplayAmount
          : "Bypassed",
      complete: orderPaid,
      enabled: deedAccepted,
      stateClass: orderPaid
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    ...(canMint || minting || receipt || activeOrder?.status === "mint_submitted"
      ? [
          {
            key: "mint" as const,
            label: "Mint",
            value: receipt ? "Submitted" : minting ? "Running" : "Auto",
            complete: Boolean(receipt),
            enabled: canMint || minting || Boolean(receipt),
            stateClass: minting
              ? "console-key-button--active"
              : receipt
                ? "console-key-button--entered"
                : "console-key-button--complete",
          },
        ]
      : []),
  ];

  const walletStatusClass = account?.address
    ? "portal-wallet-status--ready"
    : isConnecting
      ? "portal-wallet-status--pending"
      : "portal-wallet-status--empty";
  const selectedGateReadout =
    gateReadouts.find((gate) => gate.key === selectedGate) ?? gateReadouts[0];
  const selectedGateIndex = gateReadouts.findIndex(
    (gate) => gate.key === selectedGate,
  );

  function cyclePortalGate(direction: "next" | "previous") {
    if (gateReadouts.length < 2) {
      return;
    }

    const currentIndex = Math.max(selectedGateIndex, 0);
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % gateReadouts.length
        : (currentIndex - 1 + gateReadouts.length) % gateReadouts.length;

    selectGate(gateReadouts[nextIndex].key);
  }

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
    wallet: account?.address ? "Wallet Connected" : "User Wallet",
    eas: verification?.eligible ? "Human Verified" : "EAS Verification",
    identity: hasIdentity ? "Identity Confirmed" : "Identity Entry",
    artifact: hasArtifact ? "Artifact Name Locked" : "Artifact Name",
    terms: deedAccepted ? "Terms Agreed" : "Terms Agreement",
    payment: orderPaid ? "Payment Confirmed" : "Payment Gate",
    mint: receipt
      ? "Mint Submitted"
      : minting
        ? "Mint In Progress"
        : canMint
          ? "Mint Starting"
          : "Mint Locked",
  }[selectedGate];
  const selectedGateTitleWords = selectedGateTitle.split(/\s+/).filter(Boolean);
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
      : "Enter name, DOB, exact birth time, and verified birthplace.",
    artifact: hasArtifact
      ? `Artifact name locked as ${burnedArtifactName}.`
      : "Choose the name burned into the NFT image. Leave it blank to use the public mark.",
    terms: deedAccepted
      ? "Agreement gates are complete."
      : hasArtifact
        ? "Open the certificate and accept each required term."
        : "Artifact name must be locked before terms can arm.",
    payment: orderPaid
      ? "Payment gate is clear for this environment."
      : deedAccepted
        ? directPaymentEnabled
          ? "Prepare a Base USDC payment or refresh an existing order."
          : directPaymentConfigured
            ? "Direct Base payment is limited to approved test wallets."
          : "Prepare checkout or refresh an existing order."
        : "Terms must be agreed before payment can arm.",
    mint: receipt
      ? "Mint submitted. Receipt details are shown below."
      : minting
        ? "Mint is being submitted automatically."
        : canMint
          ? "Payment is clear. Mint submission is starting automatically."
          : "Pass all gates to mint your token.",
  }[selectedGate];
  const selectedGateCompleteNotice = selectedGateReadout.complete
    ? selectedGate === "mint"
      ? "Mint submitted. Save the receipt details below for tracking."
      : selectedGate === "payment"
        ? "Payment recorded. Mint submission will start automatically."
        : "Gate confirmed. If you edit earlier entries, review the later steps again."
    : null;
  const activeGateFeedback =
    gateFeedback?.gate === selectedGate ? gateFeedback : null;
  const gateProcessing = activeGateFeedback?.phase === "processing";
  const gateEnterEnabled = !gateProcessing && {
    wallet: Boolean(account?.address) || (Boolean(thirdwebClient) && !isConnecting),
    eas: Boolean(account?.address) && !checkingAttestation,
    identity: identityInputReady && !hasIdentity,
    artifact: artifactInputReady && !hasArtifact,
    terms: deedAccepted,
    payment:
      orderPaid ||
      (checkoutPrerequisitesComplete && !orderBusy) ||
      Boolean(activeOrder && !orderBusy),
    mint: canMint,
  }[selectedGate];
  const gateEnterLabel = {
    wallet: account?.address ? "Submit" : isConnecting ? "Connecting" : "Connect Wallet",
    eas: checkingAttestation
      ? "Checking"
      : verification?.eligible
        ? "Refresh EAS"
        : verification
          ? "Open EAS"
          : "Check EAS",
    identity: hasIdentity ? "Confirmed" : "Enter Identity",
    artifact: hasArtifact ? "Locked" : "Lock Artifact",
    terms: deedAccepted ? "Submit" : "Read Terms",
    payment: orderPaid ? "Continue" : activeOrder ? "Refresh Order" : "Enter Payment",
    mint: minting
      ? "Minting"
      : receipt
        ? "Mint Submitted"
        : canMint
          ? "Auto Mint"
          : "Mint Locked",
  }[selectedGate];
  const actionClusterGates = (["identity", "artifact", "wallet", "eas"] as const)
    .map((key) => gateReadouts.find((gate) => gate.key === key))
    .filter((gate): gate is PortalGateReadout => Boolean(gate));
  const accessPairComplete = Boolean(account?.address) && Boolean(verification?.eligible);
  const recordPairComplete = hasIdentity && hasArtifact;
  const finalMintClusterReady = accessPairComplete && recordPairComplete && deedAccepted;
  const primaryActionEnabled =
    selectedGate === "terms"
      ? hasArtifact || deedAccepted
      : selectedGate === "mint"
        ? canMint
        : gateEnterEnabled;
  const primaryActionLabel =
    selectedGate === "wallet" || selectedGate === "terms"
      ? gateEnterLabel
      : selectedGate === "mint"
        ? "Mint"
        : "Submit";
  const primaryActionWords = primaryActionLabel.split(/\s+/).filter(Boolean);

  function handlePrimaryGateAction() {
    if (selectedGate === "terms" && !deedAccepted) {
      setCertificateOpened(true);
      setTermsReviewOpen(true);
      return;
    }

    if (selectedGate !== "wallet" || account?.address) {
      startPortalSequenceVideo();
    }

    if (selectedGate === "mint") {
      if (canMint) {
        void handleMintRef.current?.();
      }
      return;
    }

    void handleGateEnter();
  }

  function handleTermsClusterAction() {
    if (!recordPairComplete) {
      return;
    }

    setSelectedGate("terms");

    if (!deedAccepted) {
      setCertificateOpened(true);
      setTermsReviewOpen(true);
    }
  }

  function handleMintClusterAction() {
    if (!finalMintClusterReady) {
      return;
    }

    if (canMint) {
      setSelectedGate("mint");
      void handleMintRef.current?.();
      return;
    }

    setSelectedGate(orderPaid ? "mint" : "payment");
  }

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

  async function saveReceiptScreenshot() {
    if (!receiptImageUrl || !receipt) {
      return;
    }

    const safeName = (receipt.deedName ?? "soul-deed-screenshot")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const response = await fetch(receiptImageUrl);

      if (!response.ok) {
        throw new Error("Image request failed.");
      }

      const file = await response.blob();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${safeName || "soul-deed-screenshot"}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Screenshot save failed. Use Open Image and save it from the browser.");
    }
  }

  function returnHomeAfterReceipt() {
    const confirmed = window.confirm(
      "Save or copy your receipt first. After you leave, you can recover the latest recorded receipt with the same wallet, but this exact completion screen will close.",
    );

    if (confirmed) {
      window.location.href = "/";
    }
  }

  const receiptDetailRows: ReceiptDetailRow[] = receipt
    ? [
        receipt.tokenId
          ? { label: "Token ID", value: receipt.tokenId }
          : null,
        receipt.orderId
          ? { label: "Order ID", value: receipt.orderId }
          : null,
        receipt.contractAddress
          ? { label: "Contract", value: receipt.contractAddress }
          : null,
        receipt.transactionHash
          ? {
              href: receiptTxUrl,
              label: "Mint Tx",
              value: receipt.transactionHash,
            }
          : receipt.transactionId
            ? { label: "Engine Tx", value: receipt.transactionId }
            : null,
        receipt.tokenURI
          ? {
              href: receiptMetadataUrl,
              label: "Metadata URI",
              value: receipt.tokenURI,
            }
          : null,
        receiptImageURI
          ? { label: "Image URI", value: receiptImageURI }
          : null,
      ].filter(
        (row): row is ReceiptDetailRow => Boolean(row?.value),
      )
    : [];

  function handleReceiptImageError() {
    setReceiptImageFallback((current) => {
      if (receiptImageUrls.length <= 1) {
        return current;
      }

      if (current.key !== receiptImageKey) {
        return { index: 1, key: receiptImageKey };
      }

      return {
        index: Math.min(current.index + 1, receiptImageUrls.length - 1),
        key: receiptImageKey,
      };
    });
  }

  return (
    <main className="info-control-page portal-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-0 py-5 text-white sm:px-4 md:px-8 md:py-8">
      <div className="relative z-10 mx-0 flex min-h-[calc(100vh-4rem)] w-full max-w-full flex-col gap-5 pt-1 sm:mx-auto sm:max-w-6xl md:pt-2">
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

          {showReceiptPanel && receipt ? (
            <PortalReceiptCompletePanel
              imageUrl={receiptImageUrl}
              onCopyReceipt={() => void copyMintReceipt()}
              onImageError={handleReceiptImageError}
              onReturnHome={returnHomeAfterReceipt}
              onSaveReceipt={saveMintReceipt}
              onSaveScreenshot={() => void saveReceiptScreenshot()}
              receipt={receipt}
              receiptCopied={receiptCopied}
              receiptMetadataUrl={receiptMetadataUrl}
              detailRows={receiptDetailRows}
            />
          ) : (
            <>
          <section className="min-w-0">
            <div className="relative min-w-0">
              <div className="min-w-0">
                    <div className="portal-live-console-label flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/70">
                          Live Mint Console
                        </div>
                        <div className="mt-2 inline-flex border border-yellow-200/35 bg-yellow-100/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-100">
                          {paymentDisplayAmount} pre-launch / Vanguard Honor included
                        </div>
                      </div>
                    </div>

                      <div className="portal-console-shell mt-4 grid gap-4 relative">
                        <div
                          className={`control-surface-soft portal-gate-view portal-gate-view--soft portal-gate-view--matrix portal-console-border-shell relative min-h-[30rem] md:min-h-[26rem] overflow-hidden border p-4 shadow-[0_0_90px_rgba(80,190,255,0.14)] ${
                            selectedGateReadout.complete
                              ? "console-status-tile--entered"
                              : selectedGate === "mint"
                                ? "portal-surface-red-soft"
                                : "portal-surface-cyan"
                          }`}
                        >
                          <div
                            aria-hidden="true"
                            className={`portal-sequence-video-shell portal-sequence-video-shell--${portalSequenceVideoPhase}`}
                          >
                            <video
                              className="portal-sequence-video"
                              muted
                              onEnded={handlePortalSequenceEnded}
                              onTimeUpdate={handlePortalSequenceTimeUpdate}
                              playsInline
                              preload="auto"
                              ref={portalSequenceVideoRef}
                              src={PORTAL_SEQUENCE_VIDEO_SRC}
                            />
                          </div>
                          <svg
                            aria-hidden="true"
                            className="portal-console-frame-rails portal-console-frame-rails--top"
                            focusable="false"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                          >
                            <defs>
                              <clipPath id="portal-console-top-frame-clip">
                                <rect x="0" y="0" width="100" height="52" />
                              </clipPath>
                            </defs>
                            <g clipPath="url(#portal-console-top-frame-clip)">
                              <path
                                className="portal-console-frame-rail portal-console-frame-rail--outer"
                                d="M8 1 H92 L99 8 V92 L92 99 H8 L1 92 V8 Z"
                              />
                              <path
                                className="portal-console-frame-rail portal-console-frame-rail--inner"
                                d="M14 7 H86 L93 14 V86 L86 93 H14 L7 86 V14 Z"
                              />
                              <path
                                className="portal-console-frame-corner"
                                d="M8 1 H28 M1 8 V28 M72 1 H92 L99 8 V28 M99 72 V92 L92 99 H72 M28 99 H8 L1 92 V72"
                              />
                            </g>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="portal-console-frame-rails portal-console-frame-rails--bottom"
                            focusable="false"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                          >
                            <defs>
                              <clipPath id="portal-console-bottom-frame-clip">
                                <rect x="0" y="48" width="100" height="52" />
                              </clipPath>
                            </defs>
                            <g clipPath="url(#portal-console-bottom-frame-clip)">
                              <path
                                className="portal-console-frame-rail portal-console-frame-rail--outer"
                                d="M8 1 H92 L99 8 V92 L92 99 H8 L1 92 V8 Z"
                              />
                              <path
                                className="portal-console-frame-rail portal-console-frame-rail--inner"
                                d="M14 7 H86 L93 14 V86 L86 93 H14 L7 86 V14 Z"
                              />
                              <path
                                className="portal-console-frame-corner"
                                d="M8 1 H28 M1 8 V28 M72 1 H92 L99 8 V28 M99 72 V92 L92 99 H72 M28 99 H8 L1 92 V72"
                              />
                            </g>
                          </svg>
                          <div className="portal-gate-top-row">
                            <button
                              aria-controls="portal-mobile-select-drawer"
                              aria-expanded={mobileGateDrawerOpen}
                              aria-label={`Open mint controls for ${selectedGateTitle}`}
                              className="portal-command-title-tab portal-command-title-tab--attention"
                              onClick={() => setMobileGateDrawerOpen(true)}
                              ref={mobileGateTriggerRef}
                              type="button"
                            >
                              <span
                                className="portal-command-title-tab__label"
                                data-word-count={selectedGateTitleWords.length}
                              >
                                {selectedGateTitleWords.map((word) => (
                                  <span
                                    className="portal-command-title-tab__word"
                                    key={word}
                                  >
                                    {word}
                                  </span>
                                ))}
                              </span>
                              <span
                                aria-hidden="true"
                                className="portal-command-title-tab__chevrons"
                              >
                                <span />
                                <span />
                                <span />
                              </span>
                            </button>
                          </div>
                          <div
                            className={`relative z-10 flex min-h-full flex-col ${
                              selectedGate === "terms" ? "gap-0" : "gap-4"
                            }`}
                          >

                          <div
                            className={`grid content-start ${
                              selectedGate === "terms" ? "gap-0" : "gap-3"
                            }`}
                          >
                            {selectedGate === "wallet" && (
                              <div className={`grid gap-3 ${walletStatusClass}`}>
                                <div className="control-surface-soft portal-wallet-recipient border p-3">
                                  <div className="portal-wallet-recipient__header">
                                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                      Recipient
                                    </div>
                                  </div>
                                  <div className="mt-2 break-all font-mono text-sm text-cyan-50/78">
                                    {account?.address ?? "No wallet connected"}
                                  </div>
                                </div>
                                {!thirdwebClient && (
                                  <div className="text-sm leading-6 text-white/65">
                                    Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID to enable the live
                                    wallet connector.
                                  </div>
                                )}
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
                                  <p className="mt-2 text-xl leading-8 text-white/76">
                                    EAS is our way of proving you&apos;re not a robot.
                                  </p>
                                  <p className="mt-1.5 text-lg leading-7 text-white/66">
                                    Reverify with Coinbase if your attestation is
                                    not approved.
                                  </p>
                                  {verification?.message && (
                                    <p className="mt-2 text-sm leading-6 text-cyan-50/72">
                                      {verification.message}
                                    </p>
                                  )}
                                  <div className="mt-2 portal-panel-button-row portal-panel-button-row--two">
                                    <a
                                      className="console-key-button portal-eas-open-button"
                                      href={coinbaseEasUrl}
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      Open EAS
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
                                <div className="grid gap-2 lg:grid-cols-4 sm:grid-cols-2">
                                  <label className="console-input-field portal-input-shell relative block">
                                    <input
                                      ref={firstNameInputRef}
                                      value={firstName}
                                      onChange={(event) => {
                                        resetFullSoulStatPreview();
                                        setIdentityConfirmed(false);
                                        setArtifactConfirmed(false);
                                        setFirstName(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("firstName")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "firstName")
                                      }
                                      className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                      placeholder="First Name"
                                    />
                                    <span className="portal-input-helper mt-1 block text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-50/62">
                                      Must Match Coinbase Records
                                    </span>
                                  </label>

                                  <label className="console-input-field portal-input-shell relative block">
                                    <input
                                      ref={lastNameInputRef}
                                      value={lastName}
                                      onChange={(event) => {
                                        resetFullSoulStatPreview();
                                        setIdentityConfirmed(false);
                                        setArtifactConfirmed(false);
                                        setLastName(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("lastName")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "lastName")
                                      }
                                      className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                      placeholder="Last Name"
                                    />
                                    <span className="portal-input-helper mt-1 block text-[8px] font-semibold uppercase tracking-[0.16em] text-cyan-50/62">
                                      Must Match Coinbase Records
                                    </span>
                                  </label>

                                  <label className="console-input-field portal-input-shell relative block">
                                    <input
                                      ref={dobInputRef}
                                      value={dob}
                                      onChange={(event) => {
                                        resetFullSoulStatPreview();
                                        setIdentityConfirmed(false);
                                        setArtifactConfirmed(false);
                                        setDob(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("dob")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "dob")
                                      }
                                      type="date"
                                      className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                    />
                                    <span className="portal-identity-field-caption mt-2 block font-semibold uppercase tracking-[0.16em] text-cyan-50">
                                      DOB
                                    </span>
                                  </label>

                                  <label className="console-input-field portal-input-shell relative block">
                                    <input
                                      ref={birthTimeInputRef}
                                      value={birthTime}
                                      onChange={(event) => {
                                        resetFullSoulStatPreview();
                                        setIdentityConfirmed(false);
                                        setArtifactConfirmed(false);
                                        setBirthTime(event.target.value);
                                      }}
                                      onFocus={() => setIdentityFocus("birthTime")}
                                      onKeyDown={(event) =>
                                        handleIdentityKeyDown(event, "birthTime")
                                      }
                                      type="time"
                                      className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                    />
                                    <span className="portal-identity-field-caption mt-2 block font-semibold uppercase tracking-[0.16em] text-cyan-50">
                                      Birth Time
                                    </span>
                                  </label>
                                </div>
                                <div className="portal-birth-location-panel control-surface-soft border border-white/10 p-3">
                                  <div className="portal-birth-location-grid">
                                    <label className="console-input-field portal-input-shell relative block">
                                      <select
                                        value={birthCountryCode}
                                        onChange={(event) => {
                                          resetFullSoulStatPreview();
                                          setIdentityConfirmed(false);
                                          setArtifactConfirmed(false);
                                          setBirthCountryCode(event.target.value);
                                          setBirthRegionCode("");
                                          setBirthCityQuery("");
                                          setBirthLocation(null);
                                          setBirthLocationSuggestions([]);
                                        }}
                                        className="control-input-surface portal-terminal-input portal-terminal-select w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                      >
                                        {birthCountryOptions.map((country) => (
                                          <option key={country.code} value={country.code}>
                                            {country.label}
                                          </option>
                                        ))}
                                      </select>
                                      <span className="portal-identity-field-caption mt-2 block font-semibold uppercase tracking-[0.16em] text-cyan-50">
                                        Country
                                      </span>
                                    </label>

                                    <label className="console-input-field portal-input-shell relative block">
                                      <select
                                        value={birthRegionCode}
                                        onChange={(event) => {
                                          resetFullSoulStatPreview();
                                          setIdentityConfirmed(false);
                                          setArtifactConfirmed(false);
                                          setBirthRegionCode(event.target.value);
                                          setBirthCityQuery("");
                                          setBirthLocation(null);
                                          setBirthLocationSuggestions([]);
                                        }}
                                        disabled={!birthRegionOptions.length}
                                        className="control-input-surface portal-terminal-input portal-terminal-select w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition disabled:opacity-45 focus:border-yellow-300/60"
                                      >
                                        <option value="">
                                          {birthRegionOptions.length
                                            ? "Select State"
                                            : "Region From City"}
                                        </option>
                                        {birthRegionOptions.map((region) => (
                                          <option key={region.code} value={region.code}>
                                            {region.label}
                                          </option>
                                        ))}
                                      </select>
                                      <span className="portal-identity-field-caption mt-2 block font-semibold uppercase tracking-[0.16em] text-cyan-50">
                                        State
                                      </span>
                                    </label>

                                    <label className="console-input-field portal-input-shell portal-birth-city-field relative block">
                                      <input
                                        ref={birthCityInputRef}
                                        value={birthCityQuery}
                                        onChange={(event) => {
                                          const nextValue = event.target.value;

                                          resetFullSoulStatPreview();
                                          setIdentityConfirmed(false);
                                          setArtifactConfirmed(false);
                                          setBirthLocation(null);
                                          setBirthCityQuery(nextValue);

                                          if (nextValue.trim().length < 2) {
                                            setBirthLocationSuggestions([]);
                                            setBirthLocationStatus("idle");
                                            setBirthLocationMessage("");
                                          }
                                        }}
                                        onFocus={() => setIdentityFocus("birthCity")}
                                        onKeyDown={(event) =>
                                          handleIdentityKeyDown(event, "birthCity")
                                        }
                                        className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                        placeholder="City"
                                      />
                                      <span className="portal-identity-field-caption mt-2 block font-semibold uppercase tracking-[0.16em] text-cyan-50">
                                        City
                                      </span>
                                    </label>
                                  </div>

                                  {(birthLocationStatus === "loading" ||
                                    birthLocationMessage ||
                                    birthLocationSuggestions.length > 0) && (
                                    <div className="portal-location-results">
                                      {birthLocationStatus === "loading" && (
                                        <div className="portal-location-status">
                                          Searching verified places
                                        </div>
                                      )}
                                      {birthLocationMessage && (
                                        <div
                                          className={`portal-location-status ${
                                            birthLocationStatus === "error"
                                              ? "portal-location-status--error"
                                              : ""
                                          }`}
                                        >
                                          {birthLocationMessage}
                                        </div>
                                      )}
                                      {birthLocationSuggestions.map((suggestion) => (
                                        <button
                                          className="portal-location-result"
                                          key={suggestion.placeId}
                                          onClick={() => selectBirthLocation(suggestion)}
                                          type="button"
                                        >
                                          <span>{suggestion.label}</span>
                                          <small>
                                            {[suggestion.city, suggestion.region, suggestion.country]
                                              .filter(Boolean)
                                              .join(" / ")}
                                          </small>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {birthLocation?.verified && (
                                    <div className="portal-location-verified">
                                      Verified birthplace: {birthLocation.label}
                                    </div>
                                  )}
                                  {fullSoulStatStatus !== "idle" && (
                                    <div
                                      className={`portal-full-soul-stat-readout portal-full-soul-stat-readout--${fullSoulStatStatus}`}
                                    >
                                      <span>{fullSoulStatMessage}</span>
                                      {fullSoulStatPreview?.full_soul_stat && (
                                        <div className="portal-full-soul-stat-readout__totals">
                                          <small>
                                            Base{" "}
                                            {fullSoulStatPreview.base_engine?.stat_total ??
                                              "--"}
                                          </small>
                                          <small>
                                            Natal{" "}
                                            {fullSoulStatPreview.natal_imprint?.natal_imprint
                                              ?.stat_total ?? "--"}
                                          </small>
                                          <small>
                                            Pillar{" "}
                                            {fullSoulStatPreview.pillar_accord?.pillar_accord
                                              ?.stat_total ?? "--"}
                                          </small>
                                          <small>
                                            Full{" "}
                                            {fullSoulStatPreview.full_soul_stat.stat_total ??
                                              "--"}
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <p className="portal-identity-confirmation-copy font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Name and DOB should match your Coinbase identity records.
                                  Birth time and verified birthplace prepare the Full Soul
                                  Stat before the artifact name is engraved.
                                </p>
                              </div>
                            )}

                            {selectedGate === "artifact" && (
                              <div className="grid gap-3">
                                <label className="console-input-field portal-input-shell relative block">
                                  <input
                                    ref={characterNameInputRef}
                                    value={characterName}
                                    maxLength={ARTIFACT_NAME_MAX_LENGTH}
                                    onChange={(event) => {
                                      setArtifactConfirmed(false);
                                      setCharacterName(
                                        normalizeArtifactNameInput(event.target.value),
                                      );
                                    }}
                                    onKeyDown={(event) => {
                                      if (event.key !== "Enter") {
                                        return;
                                      }

                                      event.preventDefault();
                                      void confirmArtifactEntry();
                                    }}
                                    className="control-input-surface portal-terminal-input w-full border border-white/10 bg-black px-3 py-4 text-white outline-none transition focus:border-yellow-300/60"
                                    placeholder={publicMark}
                                  />
                                </label>
                                <div className="control-surface-soft portal-artifact-engraving-box border border-white/10 bg-black/80 p-4">
                                  <p className="portal-artifact-engraving-prompt text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50">
                                    Choose an Engraved Name
                                  </p>
                                  <p className="portal-artifact-engraving-current text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50/75">
                                    Current engraving:{" "}
                                    <span className="text-yellow-100">
                                      {burnedArtifactName}
                                    </span>
                                  </p>
                                </div>
                                {!artifactNameValid && (
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-200">
                                    Artifact Name supports up to 12 uppercase
                                    letters, numbers, or spaces only.
                                  </p>
                                )}
                              </div>
                            )}

                            {selectedGate === "terms" && (
                              <div className="grid -mt-1 gap-0">
                                <div className="control-surface-soft border border-yellow-300/25 bg-black/45 p-4">
                                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-100">
                                    Terms Agreement
                                  </div>
                                  <p className="portal-terms-intro mt-0 text-sm leading-5 text-white/68">
                                    Read the terms first, then confirm each
                                  agreement item. The full contract opens only
                                  when you choose Read Terms.
                                  </p>
                                </div>
                                <PortalTermsChecklist
                                  accuracyAccepted={accuracyAccepted}
                                  certificateOpened={certificateOpened}
                                  contractAccepted={contractAccepted}
                                  publicMarkAccepted={publicMarkAccepted}
                                  setAccuracyAccepted={setAccuracyAccepted}
                                  setContractAccepted={setContractAccepted}
                                  setPublicMarkAccepted={setPublicMarkAccepted}
                                />
                              </div>
                            )}

                            {selectedGate === "payment" && (
                              <div
                                className={`control-surface-soft min-h-full border p-4 ${checkoutPanelState}`}
                              >
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Checkout
                                </div>
                                <div className="portal-payment-grid mt-3">
                                  <div className="control-surface-soft border border-yellow-200/35 bg-yellow-100/[0.06] px-3 py-3">
                                    <p className="portal-payment-offer-copy text-sm leading-5 text-white/72">
                                      Early pricing is {paymentDisplayAmount} for the first supporters, including Vanguard Honor, as appreciation while the Engine opens.
                                    </p>
                                  </div>

                                {orderPaid ? (
                                  <div className="portal-panel-button-row portal-panel-button-row--one">
                                    <div className="portal-pay-button portal-pay-button--confirmed">
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
                                  </div>
                                ) : checkoutPrerequisitesComplete ? (
                                  <div className="portal-panel-button-row portal-panel-button-row--one">
                                    <button
                                      className="portal-pay-button portal-pay-button--ready"
                                      disabled={
                                        !paymentOrderStartAllowed ||
                                        Boolean(activeOrder) ||
                                        orderBusy
                                      }
                                      onClick={createOrder}
                                      type="button"
                                    >
                                      <span>Pay ${paymentAmount}</span>
                                      <small>
                                        {directPaymentConfigured &&
                                        !directPaymentAllowedForWallet
                                          ? "Approved test wallets only"
                                          : directPaymentEnabled
                                            ? "Base USDC direct payment"
                                            : "We cover the gas fees"}
                                      </small>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="portal-panel-button-row portal-panel-button-row--one">
                                    <div className="portal-pay-button portal-pay-button--waiting">
                                      <span>Sequence Not Completed</span>
                                      <small>
                                        Wallet, EAS, identity, artifact, and terms must
                                        be green first.
                                      </small>
                                    </div>
                                  </div>
                                )}
                                </div>

                                {checkoutPrerequisitesComplete && !paymentRequired && (
                                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                                    Payment is not enabled in this environment.
                                  </p>
                                )}

                                {checkoutPrerequisitesComplete &&
                                  directPaymentConfigured &&
                                  !directPaymentAllowedForWallet &&
                                  !activeOrder && (
                                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                                      Direct payment attribution test is limited to approved wallets.
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
                                              "Checkout completed. Verifying the order, then mint submission starts automatically.",
                                            );
                                            window.setTimeout(() => {
                                              void refreshOrder();
                                            }, GATE_DELAY_MS.payment + 950);
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
                                      <div className="portal-panel-button-row portal-panel-button-row--one">
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
                                      </div>
                                    )}
                                    {directPaymentConfigured &&
                                      !directPaymentEnabled &&
                                      !orderPaid && (
                                        <p className="text-xs uppercase tracking-[0.18em] text-yellow-100/70">
                                          Direct payment attribution test is limited to approved wallets.
                                        </p>
                                      )}
                                    <div className="control-surface-soft border border-white/10 bg-black/55 px-3 py-3 text-xs text-white/58">
                                      <span className="block break-all">
                                        Order {activeOrder.orderId} / {activeOrder.status}
                                        {activeOrder.paymentKind === "complimentary"
                                          ? " / complimentary"
                                          : ""}
                                      </span>
                                      <div
                                        className={`portal-panel-button-row mt-3 ${
                                          activeOrder.status === "pending_payment"
                                            ? "portal-panel-button-row--two"
                                            : "portal-panel-button-row--one"
                                        }`}
                                      >
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
                                    : minting
                                      ? "Mint submission is running automatically. Keep this screen open."
                                      : canMint
                                        ? "All checks are complete. Mint submission starts automatically."
                                        : "Mint unlocks after wallet, EAS, identity, artifact, terms, and payment gates are green."}
                                </p>
                              </div>
                            )}

                            {activeGateFeedback && (
                              <div
                                aria-live="polite"
                                className={`portal-gate-feedback portal-gate-feedback--${activeGateFeedback.phase}`}
                                role="status"
                              >
                                <span
                                  aria-hidden="true"
                                  className="portal-gate-feedback__signal"
                                />
                                <span className="portal-gate-feedback__copy">
                                  <strong>{activeGateFeedback.message}</strong>
                                  <small>{activeGateFeedback.detail}</small>
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className={`portal-gate-bottom-row ${
                              selectedGate === "terms"
                                ? "portal-gate-bottom-row--terms"
                                : ""
                            }`}
                          >
                            <div className="portal-gate-action-cell portal-gate-action-cell--submit">
                              {selectedGate !== "mint" || canMint ? (
                              <button
                                aria-label={gateEnterLabel}
                                className={`portal-console-enter ${
                                  primaryActionEnabled
                                    ? "portal-console-enter--ready"
                                    : "portal-console-enter--locked"
                                }`}
                                disabled={!primaryActionEnabled}
                                onClick={handlePrimaryGateAction}
                                type="button"
                              >
                                <span
                                  className={`portal-console-enter__label ${
                                    primaryActionWords.length > 1
                                      ? "portal-console-enter__label--stacked"
                                      : ""
                                  }`}
                                >
                                  {primaryActionWords.map((word, index) => (
                                    <span key={`${word}-${index}`}>{word}</span>
                                  ))}
                                </span>
                              </button>
                              ) : (
                                <span aria-hidden="true" className="portal-action-placeholder" />
                              )}
                            </div>

                            <div className="portal-gate-action-cell portal-gate-action-cell--cluster">
                              <div
                                aria-label="Mint sequence status"
                                className={`portal-action-cluster ${
                                  finalMintClusterReady
                                    ? "portal-action-cluster--final"
                                    : ""
                                }`}
                                role="list"
                              >
                                {finalMintClusterReady ? (
                                  <div className="portal-action-merged-slot portal-action-merged-slot--final" role="listitem">
                                    <button
                                      aria-label={
                                        canMint
                                          ? "Mint token"
                                          : "Open the protected mint path"
                                      }
                                      className={`portal-merged-action portal-merged-action--final ${
                                        canMint ? "" : "portal-merged-action--guarded"
                                      }`}
                                      onClick={handleMintClusterAction}
                                      type="button"
                                    >
                                      MINT
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {recordPairComplete ? (
                                      <div className="portal-action-merged-slot portal-action-merged-slot--terms" role="listitem">
                                        <button
                                          aria-label={
                                            "Open Terms control"
                                          }
                                          className="portal-merged-action portal-merged-action--terms"
                                          onClick={handleTermsClusterAction}
                                          type="button"
                                        >
                                          Terms
                                        </button>
                                      </div>
                                    ) : (
                                      actionClusterGates.slice(0, 2).map((gate) => (
                                        <div key={gate.key} role="listitem">
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
                                      ))
                                    )}

                                    {accessPairComplete ? (
                                      <div className="portal-action-merged-slot portal-action-merged-slot--mint" role="listitem">
                                        <button
                                          aria-label={
                                            deedAccepted
                                              ? "Mint control armed"
                                              : "Mint unlocks after Terms are complete"
                                          }
                                          className={`portal-merged-action portal-merged-action--mint-waiting ${
                                            deedAccepted ? "portal-merged-action--mint-armed" : ""
                                          }`}
                                          disabled={!deedAccepted}
                                          onClick={handleMintClusterAction}
                                          type="button"
                                        >
                                          Mint
                                        </button>
                                      </div>
                                    ) : (
                                      actionClusterGates.slice(2, 4).map((gate) => (
                                        <div key={gate.key} role="listitem">
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
                                      ))
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {(selectedGateStatus || selectedGateCompleteNotice) && (
                            <div className="portal-gate-bottom-status">
                              {selectedGateStatus && (
                                <p className="portal-gate-bottom-status__text">{selectedGateStatus}</p>
                              )}
                              {selectedGateCompleteNotice && (
                                <p className="portal-gate-bottom-status__notice">{selectedGateCompleteNotice}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        aria-label="Portal console dock"
                        className="portal-console-dock"
                      >
                        <button
                          className="portal-console-dock-cell portal-console-dock-cell--action"
                          disabled={recoveryBusy}
                          onClick={() => void recoverMintReceipt()}
                          type="button"
                        >
                          <span>Receipt</span>
                          <strong>Recovery</strong>
                        </button>
                        <button
                          className="portal-console-dock-cell portal-console-dock-cell--action"
                          disabled={minting || orderBusy}
                          onClick={clearPortalFormData}
                          type="button"
                        >
                          <span>Clear</span>
                          <strong>Form</strong>
                        </button>
                        <button
                          aria-label="Previous portal gate"
                          className="portal-console-dock-cell portal-console-dock-cell--cycle"
                          disabled={gateReadouts.length < 2}
                          onClick={() => cyclePortalGate("previous")}
                          type="button"
                        >
                          <svg
                            aria-hidden="true"
                            className="portal-console-dock-icon"
                            focusable="false"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.5 5.5 8 12l6.5 6.5" />
                          </svg>
                        </button>
                        <button
                          aria-label="Next portal gate"
                          className="portal-console-dock-cell portal-console-dock-cell--cycle portal-console-dock-cell--cycle-next"
                          disabled={gateReadouts.length < 2}
                          onClick={() => cyclePortalGate("next")}
                          type="button"
                        >
                          <svg
                            aria-hidden="true"
                            className="portal-console-dock-icon"
                            focusable="false"
                            viewBox="0 0 24 24"
                          >
                            <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
                          </svg>
                        </button>
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

      {termsReviewOpen && (
          <PortalTermsReviewModal
            onClose={() => {
              setTermsReviewOpen(false);
              setPlainEnglishTermsOpen(false);
            }}
            onDownloadFormalTerms={downloadFormalTerms}
            onToggleView={() =>
              setPlainEnglishTermsOpen((current) => !current)
            }
            plainEnglishCertificateSummary={plainEnglishCertificateSummary}
            plainEnglishTermsOpen={plainEnglishTermsOpen}
            contractLanguage={contractLanguage}
          />
      )}

      <PortalMobileSelectDrawer
        gateReadouts={gateReadouts}
        isOpen={mobileGateDrawerOpen}
        onClose={() => {
          setMobileGateDrawerOpen(false);
          mobileGateTriggerRef.current?.focus();
        }}
        onSelectGate={selectGate}
        selectedGate={selectedGate}
      />
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
