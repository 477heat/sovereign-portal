import { NextRequest, NextResponse } from "next/server";
import {
  getPortalMintSettings,
  parsePaymentUnits,
  updatePortalMintSettings,
} from "@/lib/portalMintSettings";

function getAdminUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return undefined;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    return decoded.split(":").at(0);
  } catch {
    return undefined;
  }
}

export async function GET() {
  const settings = await getPortalMintSettings();

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as { paymentAmount?: string };
  const paymentAmount = payload.paymentAmount?.trim();
  const decimals = Number.parseInt(
    process.env.PORTAL_PAYMENT_TOKEN_DECIMALS ?? "6",
    10,
  );

  if (!paymentAmount) {
    return NextResponse.json(
      { message: "Mint price is required." },
      { status: 400 },
    );
  }

  try {
    parsePaymentUnits(paymentAmount, decimals);
    const settings = await updatePortalMintSettings({
      paymentAmount,
      updatedBy: getAdminUser(request),
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Mint price could not be updated.",
      },
      { status: 400 },
    );
  }
}
