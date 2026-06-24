export type VerificationState = {
  eligible: boolean;
  mode: "mock" | "live";
  schemaId: string;
  message: string;
};

export type MintReceipt = {
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

export type MintOrderState = {
  orderId: string;
  status: "pending_payment" | "paid" | "minting" | "mint_submitted";
  wallet: string;
  paymentAmount?: string;
  paymentKind?: "checkout" | "complimentary";
  mintTransactionId?: string;
  mintTransactionHash?: string;
};

export type PortalPaymentSettings = {
  checkoutEnabled: boolean;
  directPaymentEnabled?: boolean;
  paymentAmount: string;
  paymentFlow?: PortalPaymentFlow;
  paymentSeller?: string;
  paymentTokenAddress?: string;
  paymentTokenDecimals?: number;
};

export type PortalPaymentFlow =
  | "base_usdc_direct_attributed"
  | "disabled"
  | "thirdweb_checkout";

export type PortalGate =
  | "wallet"
  | "eas"
  | "identity"
  | "artifact"
  | "location"
  | "time"
  | "terms"
  | "payment"
  | "mint";
export type IdentityField =
  | "birthCity"
  | "birthTime"
  | "dob"
  | "firstName"
  | "lastName";

export type GateFeedbackPhase = "blocked" | "confirmed" | "processing";

export type PortalSequenceVideoPhase =
  | "complete"
  | "final"
  | "idle"
  | "intro"
  | "loop";

export type GateFeedbackState = {
  detail: string;
  gate: PortalGate;
  message: string;
  phase: GateFeedbackPhase;
};

export type BirthLocationSuggestion = {
  city: string;
  country: string;
  countryCode: string;
  label: string;
  latitude: number;
  longitude: number;
  placeId: string;
  region?: string;
  regionCode?: string;
  timeZone?: string;
};

export type VerifiedBirthLocation = BirthLocationSuggestion & {
  source: "amazon_location";
  verified: true;
};

export type FullSoulStatPreview = {
  base_total?: number;
  full_total?: number;
  has_raw_birth_location_in_public_metadata?: boolean;
  output_mode?: "full_soul_stat" | string;
  schema_version?: string;
  status?: string;
  base_engine?: {
    stat_total?: number;
  };
  natal_imprint?: {
    natal_imprint?: {
      stat_total?: number;
    };
  };
  pillar_accord?: {
    pillar_accord?: {
      stat_total?: number;
    };
  };
  full_soul_stat?: {
    stat_total?: number;
    stats?: Record<string, number>;
  };
};

export type PortalGateReadout = {
  key: PortalGate;
  label: string;
  value: string;
  complete: boolean;
  enabled: boolean;
  stateClass: string;
};

export type ReceiptDetailRow = {
  href?: string;
  label: string;
  value: string;
};
