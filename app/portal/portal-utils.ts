import {
  ARTIFACT_NAME_MAX_LENGTH,
  PORTAL_GAS_READOUT_ETH_USD,
  PORTAL_GAS_READOUT_UNITS,
} from "./portal-constants";

export function formatPortalGasReadoutUsd(gwei: number) {
  return (
    gwei *
    PORTAL_GAS_READOUT_UNITS *
    1e-9 *
    PORTAL_GAS_READOUT_ETH_USD
  ).toFixed(4);
}

export function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function parseTokenUnits(amount: string, decimals: number) {
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

export function buildPublicMark(firstName: string, lastName: string) {
  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const surnameRoot = lastName.replace(/[^a-z]/gi, "").slice(0, 3);

  if (!firstInitial || !surnameRoot) {
    return "_. ___";
  }

  return `${firstInitial}. ${
    surnameRoot.charAt(0).toUpperCase() + surnameRoot.slice(1).toLowerCase()
  }`;
}

export function isValidArtifactName(value: string) {
  const normalized = value.trim();
  return (
    !normalized ||
    (normalized.length <= ARTIFACT_NAME_MAX_LENGTH &&
      /^[A-Z0-9][A-Z0-9 ]*$/.test(normalized))
  );
}

export function normalizeArtifactNameInput(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, ARTIFACT_NAME_MAX_LENGTH);
}

export function shortAddress(address?: string) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
