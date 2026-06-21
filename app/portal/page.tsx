"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import TunnelBackdrop from "@/components/TunnelBackdrop";
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
import type {
  IdentityField,
  MintOrderState,
  MintReceipt,
  PortalGate,
  PortalGateReadout,
  PortalPaymentFlow,
  PortalPaymentSettings,
  ReceiptDetailRow,
  VerificationState,
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

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const portalAppMetadata = {
  name: "Sovereign Portal",
  url: "https://www.sovengine.xyz",
  description: "Genesis Soul Deed minting portal on Base.",
  logoUrl: "https://www.sovengine.xyz/coinbase-assets/app-icon-512.png",
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
  const characterNameInputRef = useRef<HTMLInputElement | null>(null);
  const mobileGateTriggerRef = useRef<HTMLButtonElement | null>(null);
  const autoMintOrderRef = useRef<string | null>(null);
  const handleMintRef = useRef<(() => Promise<void>) | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [dob, setDob] = useState("");
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
  const [previewShellRequested, setPreviewShellRequested] = useState(false);
  const [mobileGateDrawerOpen, setMobileGateDrawerOpen] = useState(false);
  const previewShellActive = previewShellEnabled && previewShellRequested;

  const publicMark = useMemo(
    () => buildPublicMark(firstName, lastName),
    [firstName, lastName],
  );
  const artifactNameValid = isValidArtifactName(characterName);
  const burnedArtifactName = characterName.trim() || publicMark;
  const identityInputReady =
    Boolean(firstName.trim()) &&
    Boolean(lastName.trim()) &&
    Boolean(dob) &&
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

      setSelectedGate((currentGate) =>
        currentGate === "wallet" ? "eas" : currentGate,
      );
      setVerification(null);
      setCheckingAttestation(true);
      setError("");

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
            window.setTimeout(() => {
              if (!ignore) {
                setSelectedGate("identity");
              }
            }, 850);
          }
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
      !defaultBuilderCodeDataSuffix ||
      !directPaymentAllowedForWallet
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
        order?: MintOrderState;
        receipt?: MintReceipt | null;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not refresh payment status.");
      }

      setMintOrder(result.order ?? result);

      if (result.receipt) {
        setReceipt(result.receipt);
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
    setCharacterName("");
    setIdentityConfirmed(false);
    setArtifactConfirmed(false);
    setAccuracyAccepted(false);
    setContractAccepted(false);
    setPublicMarkAccepted(false);
    setCertificateOpened(false);
    setPaymentNotice("");
    setError("");
    setSelectedGate("identity");
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

    try {
      await wait(EAS_DATABASE_SEARCH_DELAY_MS);
      const response = await fetch(`/api/attestation?address=${account.address}`);
      const result = (await response.json()) as VerificationState;
      setVerification(result);

      if (result.eligible) {
        await wait(850);
        setSelectedGate("identity");
      }
    } catch {
      setError("Attestation service is not responding yet.");
      setVerification(null);
    } finally {
      setCheckingAttestation(false);
    }
  }

  async function confirmIdentityEntry() {
    if (!identityInputReady) {
      return;
    }

    setIdentityConfirmed(true);
    await wait(GATE_DELAY_MS.artifact);
    setSelectedGate("artifact");
  }

  async function confirmArtifactEntry() {
    if (!artifactInputReady) {
      return;
    }

    setArtifactConfirmed(true);
    await wait(GATE_DELAY_MS.terms);
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
      void confirmIdentityEntry();
    }
  }

  async function handleGateEnter() {
    if (selectedGate === "wallet") {
      if (!account?.address) {
        await handleWalletChipConnect();
        return;
      }

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
        await wait(GATE_DELAY_MS.payment);
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
      : "Enter name and DOB, then press ENTER to confirm.",
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
  const gateEnterEnabled = {
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
      <TunnelBackdrop layer="page" variant="diffused" />
      <BackgroundHashStream
        className="z-0 opacity-20 md:opacity-25"
        variant="right"
      />

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

          {receipt ? (
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
                          <div className="engine-screen-grid absolute inset-0 opacity-60" aria-hidden="true" />
                          <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
                          <div className="absolute inset-x-5 top-1/2 h-px bg-cyan-100/20 shadow-[0_0_24px_rgba(165,243,252,0.38)]" aria-hidden="true" />
                          <div className="absolute left-1/2 top-5 h-[calc(100%-2.5rem)] w-px bg-cyan-100/10" aria-hidden="true" />
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
                                <div className="grid gap-2 sm:grid-cols-3">
                                  <label className="console-input-field portal-input-shell relative block">
                                    <input
                                      ref={firstNameInputRef}
                                      value={firstName}
                                      onChange={(event) => {
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
                                </div>
                                <p className="portal-identity-confirmation-copy font-semibold uppercase tracking-[0.2em] text-cyan-50">
                                  Name and DOB should match your Coinbase identity records.
                                  This confirms the human record before the artifact name
                                  is engraved.
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
                        <div className="portal-console-edge-lines" aria-hidden="true">
                          <span className="portal-console-edge-lines__stroke portal-console-edge-lines__stroke--top-cyan" />
                          <span className="portal-console-edge-lines__stroke portal-console-edge-lines__stroke--right-gold" />
                          <span className="portal-console-edge-lines__stroke portal-console-edge-lines__stroke--bottom-cyan" />
                          <span className="portal-console-edge-lines__stroke portal-console-edge-lines__stroke--left-gold" />
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
