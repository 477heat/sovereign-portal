import { NextRequest, NextResponse } from "next/server";
import { createMintOrder } from "@/lib/portalOrders";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

type CreateMintOrderRequest = {
  wallet?: string;
  publicMark?: string;
};

function isWalletAddress(value: string | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CreateMintOrderRequest;
  const publicMark = payload.publicMark?.trim();
  const walletKey = payload.wallet?.toLowerCase() ?? "missing";
  const ipLimit = checkRateLimit({
    key: `mint-order:ip:${getClientIp(request)}`,
    limit: 20,
    windowMs: 10 * 60_000,
  });
  const walletLimit = checkRateLimit({
    key: `mint-order:wallet:${walletKey}`,
    limit: 5,
    windowMs: 10 * 60_000,
  });

  if (!ipLimit.ok) {
    return rateLimitResponse(ipLimit.retryAfter);
  }

  if (!walletLimit.ok) {
    return rateLimitResponse(walletLimit.retryAfter);
  }

  if (!isWalletAddress(payload.wallet) || !publicMark || publicMark === "_. ___") {
    return NextResponse.json(
      {
        message: "Wallet and public covenant mark are required for checkout.",
      },
      { status: 400 },
    );
  }

  try {
    const order = await createMintOrder({
      wallet: payload.wallet!,
      publicMark,
    });

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      wallet: order.wallet,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not create mint order.",
      },
      { status: 409 },
    );
  }
}
