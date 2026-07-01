import type {
  MintOrderState,
  PortalGate,
  PortalGateReadout,
  VerificationState,
} from "./portal-types";
import { shortAddress } from "./portal-utils";

type BuildPortalGateReadoutsInput = {
  accountAddress?: string;
  activeOrderStatus?: MintOrderState["status"];
  artifactNameValid: boolean;
  burnedArtifactName: string;
  canMint: boolean;
  checkingAttestation: boolean;
  deedAccepted: boolean;
  hasArtifact: boolean;
  hasIdentity: boolean;
  hasLocation: boolean;
  hasReceipt: boolean;
  hasTime: boolean;
  identityInputReady: boolean;
  isConnecting: boolean;
  locationInputReady: boolean;
  minting: boolean;
  orderPaid: boolean;
  paymentAwaitingTerms: boolean;
  paymentDisplayAmount: string;
  paymentRequired: boolean;
  publicMark: string;
  termsAwaitingArtifact: boolean;
  timeInputReady: boolean;
  verification?: VerificationState | null;
};

type SelectedGateTitleInput = {
  accountAddress?: string;
  canMint: boolean;
  deedAccepted: boolean;
  hasArtifact: boolean;
  hasIdentity: boolean;
  hasLocation: boolean;
  hasReceipt: boolean;
  hasTime: boolean;
  minting: boolean;
  orderPaid: boolean;
  selectedGate: PortalGate;
  verification?: VerificationState | null;
};

type SelectedGateStatusInput = {
  accountAddress?: string;
  burnedArtifactName: string;
  canMint: boolean;
  checkingAttestation: boolean;
  deedAccepted: boolean;
  directPaymentConfigured: boolean;
  directPaymentEnabled: boolean;
  hasArtifact: boolean;
  hasIdentity: boolean;
  hasLocation: boolean;
  hasReceipt: boolean;
  hasTime: boolean;
  minting: boolean;
  orderPaid: boolean;
  selectedGate: PortalGate;
  verification?: VerificationState | null;
};

type GateEnterEnabledInput = {
  accountAddress?: string;
  activeOrder?: MintOrderState | null;
  artifactInputReady: boolean;
  canMint: boolean;
  checkingAttestation: boolean;
  checkoutPrerequisitesComplete: boolean;
  deedAccepted: boolean;
  gateProcessing: boolean;
  hasArtifact: boolean;
  hasIdentity: boolean;
  hasLocation: boolean;
  hasTime: boolean;
  identityInputReady: boolean;
  isConnecting: boolean;
  locationInputReady: boolean;
  orderBusy: boolean;
  orderPaid: boolean;
  selectedGate: PortalGate;
  thirdwebClientReady: boolean;
  timeInputReady: boolean;
};

type GateEnterLabelInput = {
  accountAddress?: string;
  activeOrder?: MintOrderState | null;
  canMint: boolean;
  checkingAttestation: boolean;
  deedAccepted: boolean;
  hasArtifact: boolean;
  hasIdentity: boolean;
  hasLocation: boolean;
  hasReceipt: boolean;
  hasTime: boolean;
  isConnecting: boolean;
  minting: boolean;
  orderPaid: boolean;
  selectedGate: PortalGate;
  verification?: VerificationState | null;
};

export const PRIMARY_ACTION_GATE_KEYS = [
  "identity",
  "artifact",
  "wallet",
  "eas",
] as const;

export const SECONDARY_ACTION_GATE_KEYS = [
  "location",
  "time",
  "terms",
  "payment",
] as const;

export function buildPortalGateReadouts({
  accountAddress,
  activeOrderStatus,
  artifactNameValid,
  burnedArtifactName,
  canMint,
  checkingAttestation,
  deedAccepted,
  hasArtifact,
  hasIdentity,
  hasLocation,
  hasReceipt,
  hasTime,
  identityInputReady,
  isConnecting,
  locationInputReady,
  minting,
  orderPaid,
  paymentAwaitingTerms,
  paymentDisplayAmount,
  paymentRequired,
  publicMark,
  termsAwaitingArtifact,
  timeInputReady,
  verification,
}: BuildPortalGateReadoutsInput): PortalGateReadout[] {
  return [
    {
      key: "wallet",
      label: "Wallet",
      value: accountAddress
        ? shortAddress(accountAddress)
        : isConnecting
          ? "Connecting"
          : "Connect",
      complete: Boolean(accountAddress),
      enabled: true,
      stateClass: accountAddress
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
      enabled: Boolean(accountAddress),
      stateClass: verification?.eligible
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "identity",
      label: "Identity",
      value: hasIdentity ? publicMark : identityInputReady ? "Submit" : "Name",
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
      key: "location",
      label: "Location",
      value: hasLocation
        ? "Set"
        : locationInputReady
          ? "Submit"
          : "Select",
      complete: hasLocation,
      enabled: true,
      stateClass: hasLocation
        ? "console-key-button--entered"
        : "console-key-button--complete",
    },
    {
      key: "time",
      label: "Date/Time",
      value: hasTime ? "Set" : timeInputReady ? "Submit" : "Enter",
      complete: hasTime,
      enabled: true,
      stateClass: hasTime
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
      enabled: (hasArtifact && hasLocation && hasTime) || deedAccepted,
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
    ...(canMint || minting || hasReceipt || activeOrderStatus === "mint_submitted"
      ? [
          {
            key: "mint" as const,
            label: "Mint",
            value: hasReceipt ? "Submitted" : minting ? "Running" : "Auto",
            complete: hasReceipt,
            enabled: canMint || minting || hasReceipt,
            stateClass: minting
              ? "console-key-button--active"
              : hasReceipt
                ? "console-key-button--entered"
                : "console-key-button--complete",
          },
        ]
      : []),
  ];
}

export function getGateIconState(
  gate: PortalGateReadout,
  selectedGate: PortalGate,
) {
  if (gate.key === selectedGate) {
    return "portal-step-icon--current";
  }

  if (gate.complete) {
    return "portal-step-icon--complete";
  }

  return gate.enabled
    ? "portal-step-icon--available"
    : "portal-step-icon--locked";
}

export function getSelectedGateTitle({
  accountAddress,
  canMint,
  deedAccepted,
  hasArtifact,
  hasIdentity,
  hasLocation,
  hasReceipt,
  hasTime,
  minting,
  orderPaid,
  selectedGate,
  verification,
}: SelectedGateTitleInput) {
  return {
    wallet: accountAddress ? "Wallet Connected" : "User Wallet",
    eas: verification?.eligible ? "Human Verified" : "EAS Verification",
    identity: hasIdentity ? "Identity Confirmed" : "Identity Entry",
    artifact: hasArtifact ? "Artifact Name Locked" : "Artifact Name",
    location: hasLocation ? "Location Confirmed" : "Birth Location",
    time: hasTime ? "Birth Time Confirmed" : "Birth Time",
    terms: deedAccepted ? "Terms Agreed" : "Terms Agreement",
    payment: orderPaid ? "Payment Confirmed" : "Payment Gate",
    mint: hasReceipt
      ? "Mint Submitted"
      : minting
        ? "Mint In Progress"
        : canMint
          ? "Mint Starting"
          : "Mint Locked",
  }[selectedGate];
}

export function getSelectedGateStatus({
  accountAddress,
  burnedArtifactName,
  canMint,
  checkingAttestation,
  deedAccepted,
  directPaymentConfigured,
  directPaymentEnabled,
  hasArtifact,
  hasIdentity,
  hasLocation,
  hasReceipt,
  hasTime,
  minting,
  orderPaid,
  selectedGate,
  verification,
}: SelectedGateStatusInput) {
  return {
    wallet: accountAddress
      ? "Connected wallet is the live mint recipient."
      : "Connect a Base wallet to begin the live path.",
    eas: checkingAttestation
      ? "Checking Coinbase EAS attestation."
      : verification?.eligible
        ? "Wallet has Coinbase Verified Account attestation."
        : accountAddress
          ? "Open Coinbase EAS to connect verification to this wallet."
          : "Wallet must be connected before EAS can verify.",
    identity: hasIdentity
      ? "Identity input has been confirmed for this session."
      : "Enter the name that should match the human identity record.",
    artifact: hasArtifact
      ? `Artifact name locked as ${burnedArtifactName}.`
      : "Choose the name burned into the UTAC artifact image. Leave it blank to use the public mark.",
    location: hasLocation
      ? "Verified birthplace is confirmed for the Engine."
      : hasArtifact
        ? "Choose a verified birthplace result so the Engine receives coordinates and timezone."
        : "Artifact name must be locked before birth location can arm.",
    time: hasTime
      ? "DOB and birth time are confirmed for the Engine."
      : "Enter DOB and exact birth time for whole-sign house calculation.",
    terms: deedAccepted
      ? "Agreement gates are complete."
      : hasArtifact && hasLocation && hasTime
        ? "Open the certificate and accept each required term."
        : "Artifact, location, and birth time must be locked before terms can arm.",
    payment: orderPaid
      ? "Payment gate is clear for this environment."
      : deedAccepted
        ? directPaymentEnabled
          ? "Prepare a Base USDC payment or refresh an existing order."
          : directPaymentConfigured
            ? "Direct Base payment is limited to approved test wallets."
            : "Prepare checkout or refresh an existing order."
        : "Terms must be agreed before payment can arm.",
    mint: hasReceipt
      ? "Mint submitted. Receipt details are shown below."
      : minting
        ? "Mint is being submitted automatically."
        : canMint
          ? "Payment is clear. Mint submission is starting automatically."
          : "Pass all gates to mint your token.",
  }[selectedGate];
}

export function getSelectedGateCompleteNotice(
  selectedGate: PortalGate,
  selectedGateReadout: PortalGateReadout,
) {
  if (!selectedGateReadout.complete) {
    return null;
  }

  if (selectedGate === "mint") {
    return "Mint submitted. Save the receipt details below for tracking.";
  }

  if (selectedGate === "payment") {
    return "Payment recorded. Mint submission will start automatically.";
  }

  return "Gate confirmed. If you edit earlier entries, review the later steps again.";
}

export function getGateEnterEnabled({
  accountAddress,
  activeOrder,
  artifactInputReady,
  canMint,
  checkingAttestation,
  checkoutPrerequisitesComplete,
  deedAccepted,
  gateProcessing,
  hasArtifact,
  hasIdentity,
  hasLocation,
  hasTime,
  identityInputReady,
  isConnecting,
  locationInputReady,
  orderBusy,
  orderPaid,
  selectedGate,
  thirdwebClientReady,
  timeInputReady,
}: GateEnterEnabledInput) {
  return (
    !gateProcessing &&
    {
      wallet: Boolean(accountAddress) || (thirdwebClientReady && !isConnecting),
      eas: Boolean(accountAddress) && !checkingAttestation,
      identity: identityInputReady && !hasIdentity,
      artifact: artifactInputReady && !hasArtifact,
      location: locationInputReady && !hasLocation,
      time: timeInputReady && !hasTime,
      terms: deedAccepted,
      payment:
        orderPaid ||
        (checkoutPrerequisitesComplete && !orderBusy) ||
        Boolean(activeOrder && !orderBusy),
      mint: canMint,
    }[selectedGate]
  );
}

export function getGateEnterLabel({
  accountAddress,
  activeOrder,
  canMint,
  checkingAttestation,
  deedAccepted,
  hasArtifact,
  hasIdentity,
  hasLocation,
  hasReceipt,
  hasTime,
  isConnecting,
  minting,
  orderPaid,
  selectedGate,
  verification,
}: GateEnterLabelInput) {
  return {
    wallet: accountAddress
      ? "Submit"
      : isConnecting
        ? "Connecting"
        : "Connect Wallet",
    eas: checkingAttestation
      ? "Checking"
      : verification?.eligible
        ? "Refresh EAS"
        : verification
          ? "Open EAS"
          : "Check EAS",
    identity: hasIdentity ? "Confirmed" : "Enter Identity",
    artifact: hasArtifact ? "Locked" : "Lock Artifact",
    location: hasLocation ? "Confirmed" : "Submit Location",
    time: hasTime ? "Confirmed" : "Submit Time",
    terms: deedAccepted ? "Submit" : "Read Terms",
    payment: orderPaid ? "Continue" : activeOrder ? "Refresh Order" : "Enter Payment",
    mint: minting
      ? "Minting"
      : hasReceipt
        ? "Mint Submitted"
        : canMint
          ? "Auto Mint"
          : "Mint Locked",
  }[selectedGate];
}

export function pickPortalGates(
  gateReadouts: PortalGateReadout[],
  keys: readonly PortalGate[],
) {
  return keys
    .map((key) => gateReadouts.find((gate) => gate.key === key))
    .filter((gate): gate is PortalGateReadout => Boolean(gate));
}

export function getPrimaryActionEnabled(
  selectedGate: PortalGate,
  gateEnterEnabled: boolean,
  {
    canMint,
    deedAccepted,
    hasArtifact,
    hasLocation,
    hasTime,
  }: {
    canMint: boolean;
    deedAccepted: boolean;
    hasArtifact: boolean;
    hasLocation: boolean;
    hasTime: boolean;
  },
) {
  if (selectedGate === "terms") {
    return (hasArtifact && hasLocation && hasTime) || deedAccepted;
  }

  if (selectedGate === "mint") {
    return canMint;
  }

  return gateEnterEnabled;
}

export function getPrimaryActionState(selectedGateReadout: PortalGateReadout) {
  if (!selectedGateReadout.enabled) {
    return "locked";
  }

  if (selectedGateReadout.stateClass.includes("console-key-button--entered")) {
    return "ready";
  }

  return "pending";
}

export function getPrimaryActionLabel(
  selectedGate: PortalGate,
  gateEnterLabel: string,
) {
  if (selectedGate === "wallet" || selectedGate === "terms") {
    return gateEnterLabel;
  }

  if (selectedGate === "mint") {
    return "Mint";
  }

  return "Submit";
}
