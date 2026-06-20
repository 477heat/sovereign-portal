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
  | "terms"
  | "payment"
  | "mint";
export type IdentityField = "firstName" | "lastName" | "dob";

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
