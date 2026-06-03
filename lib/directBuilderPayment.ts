import { getAddress, isHexString } from "ethers";

const ERC20_TRANSFER_SELECTOR = "a9059cbb";
const WORD_HEX_LENGTH = 64;
const TRANSFER_ARGUMENT_HEX_LENGTH = WORD_HEX_LENGTH * 2;

export type DirectPaymentConfig = {
  chainId: number;
  tokenAddress: string;
  seller: string;
  minAmount: bigint;
  expectedDataSuffix?: string;
};

export type DirectPaymentTransaction = {
  chainId: number;
  from: string;
  to: string;
  data: string;
  status?: "success" | "failed";
  value?: bigint;
  transactionHash?: string;
};

export type DecodedErc20Transfer = {
  amount: bigint;
  dataSuffix: string;
  recipient: string;
};

export type DirectPaymentVerification = {
  decoded?: DecodedErc20Transfer;
  errors: string[];
  paymentId?: string;
  receivedAmount?: bigint;
  transactionHash?: string;
  valid: boolean;
};

function strip0x(value: string) {
  return value.startsWith("0x") || value.startsWith("0X")
    ? value.slice(2)
    : value;
}

function normalizeHex(value: string) {
  return `0x${strip0x(value).toLowerCase()}`;
}

export function normalizeAddress(address: string) {
  return getAddress(address).toLowerCase();
}

export function getDirectPaymentAllowedWalletList(allowedWallets?: string) {
  return allowedWallets
    ?.split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function hasDirectPaymentWalletAllowlist(allowedWallets?: string) {
  return Boolean(getDirectPaymentAllowedWalletList(allowedWallets)?.length);
}

export function isDirectPaymentWalletAllowed(
  wallet: string | undefined,
  allowedWallets?: string,
) {
  const allowedList = getDirectPaymentAllowedWalletList(allowedWallets);

  if (!allowedList || allowedList.length === 0) {
    return false;
  }

  try {
    const normalizedWallet = normalizeAddress(wallet ?? "");
    return allowedList.some((entry) => {
      try {
        return normalizeAddress(entry) === normalizedWallet;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

export function encodeErc20TransferCalldata({
  amount,
  dataSuffix = "0x",
  recipient,
}: {
  amount: bigint;
  dataSuffix?: string;
  recipient: string;
}) {
  if (amount < BigInt(0)) {
    throw new Error("Transfer amount cannot be negative.");
  }

  const normalizedRecipient = strip0x(getAddress(recipient)).toLowerCase();
  const recipientWord = normalizedRecipient.padStart(WORD_HEX_LENGTH, "0");
  const amountWord = amount.toString(16).padStart(WORD_HEX_LENGTH, "0");
  const suffix = strip0x(dataSuffix);

  if (suffix && !isHexString(`0x${suffix}`)) {
    throw new Error("Data suffix must be hex.");
  }

  return `0x${ERC20_TRANSFER_SELECTOR}${recipientWord}${amountWord}${suffix}`;
}

export function decodeErc20TransferCalldata(
  data: string,
): DecodedErc20Transfer {
  const raw = strip0x(data).toLowerCase();

  if (!raw.startsWith(ERC20_TRANSFER_SELECTOR)) {
    throw new Error("Transaction is not an ERC-20 transfer call.");
  }

  const argumentData = raw.slice(ERC20_TRANSFER_SELECTOR.length);

  if (argumentData.length < TRANSFER_ARGUMENT_HEX_LENGTH) {
    throw new Error("ERC-20 transfer calldata is incomplete.");
  }

  const recipientWord = argumentData.slice(0, WORD_HEX_LENGTH);
  const amountWord = argumentData.slice(WORD_HEX_LENGTH, TRANSFER_ARGUMENT_HEX_LENGTH);
  const dataSuffix = argumentData.slice(TRANSFER_ARGUMENT_HEX_LENGTH);
  const recipient = normalizeAddress(`0x${recipientWord.slice(-40)}`);
  const amount = BigInt(`0x${amountWord}`);

  return {
    amount,
    dataSuffix: `0x${dataSuffix}`,
    recipient,
  };
}

export function verifyDirectBuilderPayment({
  config,
  expectedWallet,
  transaction,
}: {
  config: DirectPaymentConfig;
  expectedWallet: string;
  transaction: DirectPaymentTransaction;
}): DirectPaymentVerification {
  const errors: string[] = [];
  let decoded: DecodedErc20Transfer | undefined;

  if (transaction.chainId !== config.chainId) {
    errors.push("Payment transaction is on the wrong chain.");
  }

  if (transaction.status && transaction.status !== "success") {
    errors.push("Payment transaction did not succeed.");
  }

  if (transaction.value !== undefined && transaction.value !== BigInt(0)) {
    errors.push("Payment transaction should not send native ETH value.");
  }

  try {
    if (normalizeAddress(transaction.from) !== normalizeAddress(expectedWallet)) {
      errors.push("Payment transaction sender does not match the mint wallet.");
    }
  } catch {
    errors.push("Payment transaction sender is invalid.");
  }

  try {
    if (normalizeAddress(transaction.to) !== normalizeAddress(config.tokenAddress)) {
      errors.push("Payment transaction recipient contract is not the configured token.");
    }
  } catch {
    errors.push("Payment transaction token contract is invalid.");
  }

  try {
    decoded = decodeErc20TransferCalldata(transaction.data);

    if (decoded.recipient !== normalizeAddress(config.seller)) {
      errors.push("Payment transfer recipient is not the configured seller.");
    }

    if (decoded.amount < config.minAmount) {
      errors.push("Payment transfer amount is below this order's minimum.");
    }

    if (
      config.expectedDataSuffix &&
      normalizeHex(decoded.dataSuffix) !== normalizeHex(config.expectedDataSuffix)
    ) {
      errors.push("Payment transaction does not include the expected Builder Code suffix.");
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Payment calldata is invalid.");
  }

  return {
    decoded,
    errors,
    paymentId: transaction.transactionHash
      ? `base-direct:${transaction.transactionHash.toLowerCase()}`
      : undefined,
    receivedAmount: decoded?.amount,
    transactionHash: transaction.transactionHash,
    valid: errors.length === 0,
  };
}
