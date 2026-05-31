import { NextRequest, NextResponse } from "next/server";
import { createComplimentaryMintOrder } from "@/lib/portalOrders";

type CompMintRequest = {
  wallet?: string;
  publicMark?: string;
  reason?: string;
};

function isWalletAddress(value: string | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CompMintRequest;
  const publicMark = payload.publicMark?.trim();

  if (!isWalletAddress(payload.wallet) || !publicMark || publicMark === "_. ___") {
    return NextResponse.json(
      {
        message:
          "Wallet and public covenant mark are required for a complimentary mint order.",
      },
      { status: 400 },
    );
  }

  try {
    const order = await createComplimentaryMintOrder({
      wallet: payload.wallet!,
      publicMark,
      reason: payload.reason,
    });

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      wallet: order.wallet,
      publicMark: order.publicMark,
      paymentKind: order.paymentKind,
      paymentId: order.paymentId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Complimentary mint order could not be created.",
      },
      { status: 409 },
    );
  }
}
