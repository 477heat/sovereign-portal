import "server-only";

import { Contract, JsonRpcProvider, hashMessage, verifyMessage } from "ethers";

const ERC1271_MAGIC_VALUE = "0x1626ba7e";
const ERC1271_ABI = [
  "function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4)",
];
const RAW_SIGNATURE_HEX_LENGTH = 2 + 65 * 2;
const ABI_WORD_HEX_LENGTH = 64;

export function isWalletAddress(value: string | null | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

function isHex(value: string) {
  return /^0x[0-9a-fA-F]*$/.test(value);
}

function isRawSignature(value: string) {
  return isHex(value) && value.length === RAW_SIGNATURE_HEX_LENGTH;
}

function signatureCandidates(signature: string) {
  const candidates = new Set<string>();

  if (!isHex(signature)) {
    return [];
  }

  if (isRawSignature(signature)) {
    candidates.add(signature);
  }

  const hex = signature.slice(2);

  for (
    let index = 0;
    index <= hex.length - ABI_WORD_HEX_LENGTH;
    index += ABI_WORD_HEX_LENGTH
  ) {
    const word = hex.slice(index, index + ABI_WORD_HEX_LENGTH);

    if (BigInt(`0x${word}`) !== BigInt(65)) {
      continue;
    }

    const candidate = `0x${hex.slice(
      index + ABI_WORD_HEX_LENGTH,
      index + ABI_WORD_HEX_LENGTH + 65 * 2,
    )}`;

    if (isRawSignature(candidate)) {
      candidates.add(candidate);
    }
  }

  return [...candidates];
}

export async function isValidWalletSignature({
  wallet,
  message,
  signature,
}: {
  wallet: string;
  message: string;
  signature: string;
}) {
  const normalizedWallet = wallet.toLowerCase();

  for (const candidate of signatureCandidates(signature)) {
    try {
      if (verifyMessage(message, candidate).toLowerCase() === normalizedWallet) {
        return true;
      }
    } catch {
      // Try the next signature shape, then fall back to ERC-1271 below.
    }
  }

  const rpcUrl = process.env.BASE_RPC_URL ?? process.env.COINBASE_EAS_RPC_URL;

  if (!rpcUrl || !isHex(signature)) {
    return false;
  }

  try {
    const provider = new JsonRpcProvider(rpcUrl);
    const walletContract = new Contract(wallet, ERC1271_ABI, provider);
    const result = (await walletContract.isValidSignature(
      hashMessage(message),
      signature,
    )) as string;

    return result.toLowerCase() === ERC1271_MAGIC_VALUE;
  } catch {
    return false;
  }
}
