import {
  AbiCoder,
  Contract,
  JsonRpcProvider,
  ZeroHash,
  getAddress,
  isAddress,
} from "ethers";

export const BASE_MAINNET_CHAIN_ID = 8453;

export const COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID =
  "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

export const BASE_EAS_CONTRACT_ADDRESS =
  "0x4200000000000000000000000000000000000021";

export const COINBASE_ATTESTATION_INDEXER_ADDRESS =
  "0x2c7eE1E5f416dfF40054c27A62f7B357C4E8619C";

export const COINBASE_ATTESTER_ADDRESS =
  "0x357458739F90461b99789350868CD7CF330Dd7EE";

const INDEXER_ABI = [
  "function getAttestationUid(address recipient, bytes32 schemaUid) view returns (bytes32)",
] as const;

const EAS_ABI = [
  "function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))",
] as const;

const abiCoder = AbiCoder.defaultAbiCoder();

type EasAttestation = {
  uid: string;
  schema: string;
  time: bigint;
  expirationTime: bigint;
  revocationTime: bigint;
  refUID: string;
  recipient: string;
  attester: string;
  revocable: boolean;
  data: string;
};

export type CoinbaseEasLookupResult = {
  eligible: boolean;
  mode: "live";
  chainId: typeof BASE_MAINNET_CHAIN_ID;
  schemaId: string;
  indexerAddress: string;
  easAddress: string;
  attesterAddress: string;
  attestationUid?: string;
  issuedAt?: number;
  expirationTime?: number;
  revocationTime?: number;
  verifiedAccount?: boolean;
  message: string;
};

function sameAddress(left: string, right: string) {
  return left.toLowerCase() === right.toLowerCase();
}

function sameBytes32(left: string, right: string) {
  return left.toLowerCase() === right.toLowerCase();
}

function getBaseRpcUrl() {
  return process.env.BASE_RPC_URL || process.env.COINBASE_EAS_RPC_URL;
}

export function hasCoinbaseEasRpcUrl() {
  return Boolean(getBaseRpcUrl());
}

function toNumber(value: bigint) {
  return Number(value);
}

function decodeVerifiedAccount(data: string) {
  try {
    const [verifiedAccount] = abiCoder.decode(["bool"], data);
    return Boolean(verifiedAccount);
  } catch {
    return false;
  }
}

function buildBaseResult(
  overrides: Partial<CoinbaseEasLookupResult>,
): CoinbaseEasLookupResult {
  return {
    eligible: false,
    mode: "live",
    chainId: BASE_MAINNET_CHAIN_ID,
    schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
    indexerAddress: COINBASE_ATTESTATION_INDEXER_ADDRESS,
    easAddress: BASE_EAS_CONTRACT_ADDRESS,
    attesterAddress: COINBASE_ATTESTER_ADDRESS,
    message: "Coinbase Verified Account attestation was not found.",
    ...overrides,
  };
}

export function normalizeWalletAddress(address: string) {
  if (!isAddress(address)) {
    return null;
  }

  return getAddress(address);
}

export async function lookupCoinbaseVerifiedAccount(
  address: string,
): Promise<CoinbaseEasLookupResult> {
  const wallet = normalizeWalletAddress(address);

  if (!wallet) {
    return buildBaseResult({
      message: "A valid wallet address is required for attestation lookup.",
    });
  }

  const rpcUrl = getBaseRpcUrl();

  if (!rpcUrl) {
    return buildBaseResult({
      message:
        "Live Coinbase EAS lookup requires BASE_RPC_URL or COINBASE_EAS_RPC_URL.",
    });
  }

  const provider = new JsonRpcProvider(rpcUrl, BASE_MAINNET_CHAIN_ID);
  const indexer = new Contract(
    COINBASE_ATTESTATION_INDEXER_ADDRESS,
    INDEXER_ABI,
    provider,
  );
  const eas = new Contract(BASE_EAS_CONTRACT_ADDRESS, EAS_ABI, provider);

  const attestationUid = (await indexer.getAttestationUid(
    wallet,
    COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
  )) as string;

  if (sameBytes32(attestationUid, ZeroHash)) {
    return buildBaseResult({
      attestationUid,
      message:
        "No Coinbase Verified Account attestation was found for this wallet.",
    });
  }

  const attestation = (await eas.getAttestation(
    attestationUid,
  )) as EasAttestation;

  if (sameBytes32(attestation.uid, ZeroHash)) {
    return buildBaseResult({
      attestationUid,
      message:
        "Coinbase indexer returned an attestation UID, but EAS did not return an attestation.",
    });
  }

  if (!sameBytes32(attestation.schema, COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID)) {
    return buildBaseResult({
      attestationUid,
      message: "Coinbase attestation schema did not match Verified Account.",
    });
  }

  if (!sameAddress(attestation.recipient, wallet)) {
    return buildBaseResult({
      attestationUid,
      message: "Coinbase attestation recipient does not match this wallet.",
    });
  }

  if (!sameAddress(attestation.attester, COINBASE_ATTESTER_ADDRESS)) {
    return buildBaseResult({
      attestationUid,
      message: "Coinbase attestation was not issued by the expected attester.",
    });
  }

  const now = BigInt(Math.floor(Date.now() / 1000));

  if (
    attestation.expirationTime !== BigInt(0) &&
    attestation.expirationTime <= now
  ) {
    return buildBaseResult({
      attestationUid,
      issuedAt: toNumber(attestation.time),
      expirationTime: toNumber(attestation.expirationTime),
      message: "Coinbase Verified Account attestation has expired.",
    });
  }

  if (attestation.revocationTime !== BigInt(0)) {
    return buildBaseResult({
      attestationUid,
      issuedAt: toNumber(attestation.time),
      revocationTime: toNumber(attestation.revocationTime),
      message: "Coinbase Verified Account attestation has been revoked.",
    });
  }

  const verifiedAccount = decodeVerifiedAccount(attestation.data);

  if (!verifiedAccount) {
    return buildBaseResult({
      attestationUid,
      issuedAt: toNumber(attestation.time),
      expirationTime: toNumber(attestation.expirationTime),
      revocationTime: toNumber(attestation.revocationTime),
      verifiedAccount,
      message: "Coinbase attestation data does not confirm Verified Account.",
    });
  }

  return buildBaseResult({
    eligible: true,
    attestationUid,
    issuedAt: toNumber(attestation.time),
    expirationTime: toNumber(attestation.expirationTime),
    revocationTime: toNumber(attestation.revocationTime),
    verifiedAccount,
    message: "Coinbase Verified Account attestation confirmed on Base mainnet.",
  });
}
