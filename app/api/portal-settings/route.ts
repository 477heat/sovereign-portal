import { NextResponse } from "next/server";
import { getPortalMintSettings } from "@/lib/portalMintSettings";

export async function GET() {
  const settings = await getPortalMintSettings();
  const paymentSeller =
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_SELLER ??
    process.env.PORTAL_PAYMENT_SELLER;
  const paymentTokenAddress =
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_ADDRESS ??
    process.env.PORTAL_PAYMENT_TOKEN_ADDRESS;
  const paymentTokenDecimals = Number.parseInt(
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_TOKEN_DECIMALS ??
      process.env.PORTAL_PAYMENT_TOKEN_DECIMALS ??
      "6",
    10,
  );
  const paymentFlow =
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_FLOW === "base_usdc_direct_attributed"
      ? "base_usdc_direct_attributed"
      : process.env.NEXT_PUBLIC_PORTAL_PAYMENT_MODE === "checkout"
        ? "thirdweb_checkout"
        : "disabled";
  const checkoutEnabled =
    paymentFlow === "thirdweb_checkout" &&
    Boolean(paymentSeller && paymentTokenAddress);
  const directPaymentEnabled =
    paymentFlow === "base_usdc_direct_attributed" &&
    Boolean(
      paymentSeller &&
        paymentTokenAddress &&
        process.env.NEXT_PUBLIC_BASE_BUILDER_CODE_DATA_SUFFIX,
    );

  return NextResponse.json({
    checkoutEnabled,
    directPaymentEnabled,
    paymentAmount: settings.paymentAmount,
    paymentFlow,
    paymentSeller,
    paymentTokenAddress,
    paymentTokenDecimals,
  });
}
