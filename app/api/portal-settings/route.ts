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
  const checkoutEnabled =
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_MODE === "checkout" &&
    Boolean(paymentSeller && paymentTokenAddress);

  return NextResponse.json({
    checkoutEnabled,
    paymentAmount: settings.paymentAmount,
    paymentSeller,
    paymentTokenAddress,
  });
}
