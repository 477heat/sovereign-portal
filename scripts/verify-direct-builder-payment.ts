import {
  decodeErc20TransferCalldata,
  encodeErc20TransferCalldata,
  isDirectPaymentWalletAllowed,
  verifyDirectBuilderPayment,
  type DirectPaymentConfig,
  type DirectPaymentTransaction,
} from "../lib/directBuilderPayment";

const checks: Array<{ detail?: string; name: string; passed: boolean }> = [];

function record(name: string, passed: boolean, detail = "") {
  checks.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} ${name}${detail ? ` - ${detail}` : ""}`);
}

function assert(name: string, condition: unknown, detail = "") {
  record(name, Boolean(condition), detail);
}

function expectError(name: string, action: () => unknown, expectedMessage: string) {
  try {
    action();
    record(name, false, "No error was thrown.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record(name, message.includes(expectedMessage), message);
  }
}

function assertInvalid(
  name: string,
  transaction: DirectPaymentTransaction,
  expectedError: string,
) {
  const result = verifyDirectBuilderPayment({
    config,
    expectedWallet,
    transaction,
  });

  assert(name, !result.valid && result.errors.includes(expectedError), result.errors.join(" | "));
}

const expectedWallet = "0x1111111111111111111111111111111111111111";
const seller = "0xd89A17cab674979A531657Cd426fC65aF29F8214";
const tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const builderSuffix = "0x62635f366a6866726771670b0080218021802180218021802180218021";

const config: DirectPaymentConfig = {
  chainId: 8453,
  expectedDataSuffix: builderSuffix,
  minAmount: BigInt(20000),
  seller,
  tokenAddress,
};

const validData = encodeErc20TransferCalldata({
  amount: BigInt(20000),
  dataSuffix: builderSuffix,
  recipient: seller,
});

const validTransaction: DirectPaymentTransaction = {
  chainId: 8453,
  data: validData,
  from: expectedWallet,
  status: "success",
  to: tokenAddress,
  transactionHash: "0x123400000000000000000000000000000000000000000000000000000000abcd",
  value: BigInt(0),
};

const decoded = decodeErc20TransferCalldata(validData);
assert("decode extracts seller recipient", decoded.recipient === seller.toLowerCase());
assert("decode extracts amount", decoded.amount === BigInt(20000));
assert("decode preserves builder suffix", decoded.dataSuffix === builderSuffix);
assert("empty wallet allowlist allows direct payment", isDirectPaymentWalletAllowed(expectedWallet));
assert(
  "wallet allowlist accepts matching wallet",
  isDirectPaymentWalletAllowed(expectedWallet, `${seller}, ${expectedWallet}`),
);
assert(
  "wallet allowlist rejects nonmatching wallet",
  !isDirectPaymentWalletAllowed(expectedWallet, seller),
);
assert(
  "wallet allowlist rejects invalid wallet",
  !isDirectPaymentWalletAllowed("not-a-wallet", expectedWallet),
);

const validResult = verifyDirectBuilderPayment({
  config,
  expectedWallet,
  transaction: validTransaction,
});

assert("valid direct payment passes", validResult.valid, validResult.errors.join(" | "));
assert("valid direct payment returns received amount", validResult.receivedAmount === BigInt(20000));
assert(
  "valid direct payment creates stable payment id",
  validResult.paymentId === `base-direct:${validTransaction.transactionHash}`,
);

assertInvalid(
  "wrong chain is rejected",
  { ...validTransaction, chainId: 84532 },
  "Payment transaction is on the wrong chain.",
);

assertInvalid(
  "failed transaction is rejected",
  { ...validTransaction, status: "failed" },
  "Payment transaction did not succeed.",
);

assertInvalid(
  "native value is rejected",
  { ...validTransaction, value: BigInt(1) },
  "Payment transaction should not send native ETH value.",
);

assertInvalid(
  "wrong wallet is rejected",
  {
    ...validTransaction,
    from: "0x2222222222222222222222222222222222222222",
  },
  "Payment transaction sender does not match the mint wallet.",
);

assertInvalid(
  "wrong token contract is rejected",
  {
    ...validTransaction,
    to: "0x3333333333333333333333333333333333333333",
  },
  "Payment transaction recipient contract is not the configured token.",
);

assertInvalid(
  "wrong seller is rejected",
  {
    ...validTransaction,
    data: encodeErc20TransferCalldata({
      amount: BigInt(20000),
      dataSuffix: builderSuffix,
      recipient: "0x4444444444444444444444444444444444444444",
    }),
  },
  "Payment transfer recipient is not the configured seller.",
);

assertInvalid(
  "underpayment is rejected",
  {
    ...validTransaction,
    data: encodeErc20TransferCalldata({
      amount: BigInt(19999),
      dataSuffix: builderSuffix,
      recipient: seller,
    }),
  },
  "Payment transfer amount is below this order's minimum.",
);

assertInvalid(
  "missing builder suffix is rejected",
  {
    ...validTransaction,
    data: encodeErc20TransferCalldata({
      amount: BigInt(20000),
      recipient: seller,
    }),
  },
  "Payment transaction does not include the expected Builder Code suffix.",
);

expectError(
  "non-transfer calldata is rejected at decode",
  () => decodeErc20TransferCalldata("0xdeadbeef"),
  "Transaction is not an ERC-20 transfer call.",
);

const failed = checks.filter((check) => !check.passed);

if (failed.length > 0) {
  console.error(`\n${failed.length} direct payment check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} direct payment checks passed.`);
