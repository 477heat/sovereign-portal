const BASE_MAINNET_CHAIN_ID = 8453;

export function paymentRequired() {
  return process.env.PORTAL_PAYMENT_MODE === "required";
}

export function getServerPaymentConfig() {
  const seller =
    process.env.PORTAL_PAYMENT_SELLER ??
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
  const tokenAddress =
    process.env.PORTAL_PAYMENT_TOKEN_ADDRESS ??
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
  const amount =
    process.env.PORTAL_PAYMENT_AMOUNT ??
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ??
    "5.00";
  const decimals = Number.parseInt(
    process.env.PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
    10,
  );

  if (!seller || !tokenAddress || !Number.isInteger(decimals)) {
    throw new Error(
      "Payment verification requires seller, token address, and token decimals.",
    );
  }

  const amountParts = amount.split(".");
  const whole = amountParts[0] || "0";
  const fraction = (amountParts[1] ?? "").padEnd(decimals, "0").slice(0, decimals);

  if (!whole.match(/^\d+$/) || !fraction.match(/^\d*$/)) {
    throw new Error("PORTAL_PAYMENT_AMOUNT must be a decimal token amount.");
  }

  return {
    amount,
    chainId: BASE_MAINNET_CHAIN_ID,
    minAmount: BigInt(`${whole}${fraction}`),
    seller,
    tokenAddress,
  };
}
