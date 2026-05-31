import { getPortalMintSettings, parsePaymentUnits } from "./portalMintSettings";

const BASE_MAINNET_CHAIN_ID = 8453;

export function paymentRequired() {
  return process.env.PORTAL_PAYMENT_MODE === "required";
}

export async function getServerPaymentConfig() {
  const seller =
    process.env.PORTAL_PAYMENT_SELLER ??
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER;
  const tokenAddress =
    process.env.PORTAL_PAYMENT_TOKEN_ADDRESS ??
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS;
  const settings = await getPortalMintSettings();
  const amount = settings.paymentAmount;
  const decimals = Number.parseInt(
    process.env.PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
    10,
  );

  if (!seller || !tokenAddress || !Number.isInteger(decimals)) {
    throw new Error(
      "Payment verification requires seller, token address, and token decimals.",
    );
  }

  return {
    amount,
    chainId: BASE_MAINNET_CHAIN_ID,
    decimals,
    minAmount: parsePaymentUnits(amount, decimals),
    seller,
    tokenAddress,
  };
}
