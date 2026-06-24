import { preLaunchOffer } from "@/lib/preLaunchOffer";

import type { MintReceipt, PortalGate, PortalPaymentFlow } from "./portal-types";

export const plainEnglishCertificateSummary = [
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

export const defaultPaymentAmount =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ?? preLaunchOffer.amount;
export const defaultPaymentSeller = process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
export const defaultPaymentTokenAddress =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
export const defaultPaymentTokenDecimals = Number.parseInt(
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
  10,
);
export const defaultBuilderCodeDataSuffix =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE_DATA_SUFFIX;
export const defaultDirectPaymentAllowedWallets =
  process.env.NEXT_PUBLIC_PORTAL_DIRECT_PAYMENT_ALLOWED_WALLETS;
export const defaultPaymentFlow: PortalPaymentFlow =
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_FLOW === "base_usdc_direct_attributed"
    ? "base_usdc_direct_attributed"
    : process.env.NEXT_PUBLIC_PORTAL_PAYMENT_MODE === "checkout"
      ? "thirdweb_checkout"
      : "disabled";
export const defaultCheckoutEnabled =
  defaultPaymentFlow === "thirdweb_checkout" &&
  Boolean(defaultPaymentSeller && defaultPaymentTokenAddress);
export const defaultDirectPaymentEnabled =
  defaultPaymentFlow === "base_usdc_direct_attributed" &&
  Boolean(
    defaultPaymentSeller &&
      defaultPaymentTokenAddress &&
      defaultBuilderCodeDataSuffix,
  );
export const previewShellEnabled =
  process.env.NEXT_PUBLIC_PORTAL_PREVIEW_SHELL === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";

export const coinbaseEasUrl =
  "https://help.coinbase.com/en/coinbase/getting-started/verify-my-account/onchain-verification";

export const PORTAL_CONSOLE_SOUNDS = {
  appDrawerButtons: "/sounds/app-drawer-buttons.mp3",
  bottomCellButtons: "/sounds/bottom-cell-buttons.mp3",
  commandTabMenu: "/sounds/command-tab-menu.mp3",
  notSelectable: "/sounds/not-selectable.mp3",
  stow: "/sounds/command-tab-stow.mp3",
  walletConnectButton: "/sounds/wallet-connect-button.mp3",
} as const;

export const ARTIFACT_NAME_MAX_LENGTH = 12;
export const EAS_DATABASE_SEARCH_DELAY_MS = 4000;
export const GATE_DELAY_MS = {
  artifact: 650,
  location: 680,
  time: 680,
  terms: 780,
  payment: 620,
  autoMint: 1180,
};
export const GATE_FEEDBACK_DELAY_MS = {
  wallet: 1800,
  eas: EAS_DATABASE_SEARCH_DELAY_MS,
  identity: 2600,
  artifact: 2400,
  location: 1800,
  time: 1800,
  terms: 1800,
  payment: 2600,
  mint: 2200,
} satisfies Record<PortalGate, number>;

export const PORTAL_GAS_READOUTS_GWEI = [0.002, 0.004, 0.006, 0.008] as const;
export const PORTAL_GAS_READOUT_ETH_USD = 3500;
export const PORTAL_GAS_READOUT_UNITS = 21000;

export const PORTAL_SEQUENCE_VIDEO_SRC = "/media/portal-screen.mp4";
export const PORTAL_SEQUENCE_INTRO_END_SECONDS = 6.4;
export const PORTAL_SEQUENCE_LOOP_START_SECONDS = 1.2;
export const PORTAL_SEQUENCE_LOOP_END_SECONDS = 6.4;
export const PORTAL_SEQUENCE_FINAL_START_SECONDS = 6.4;

export const previewReceipt: MintReceipt = {
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
