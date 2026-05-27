import { verifyMessage } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { buildMintOrderStatusMessage } from "@/lib/portalMessages";
import { getMintOrder } from "@/lib/portalOrders";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

function isWalletAddress(value: string | null) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const wallet = request.nextUrl.searchParams.get("wallet");
  const signature = request.nextUrl.searchParams.get("signature");
  const ipLimit = checkRateLimit({
    key: `mint-order-status:ip:${getClientIp(request)}`,
    limit: 60,
    windowMs: 10 * 60_000,
  });

  if (!ipLimit.ok) {
    return rateLimitResponse(ipLimit.retryAfter);
  }

  if (!isWalletAddress(wallet) || !signature) {
    return NextResponse.json(
      { message: "Wallet signature is required to view this mint order." },
      { status: 401 },
    );
  }

  try {
    const order = await getMintOrder(orderId);

    if (!order) {
      return NextResponse.json({ message: "Mint order not found." }, { status: 404 });
    }

    if (order.wallet !== wallet!.toLowerCase()) {
      return NextResponse.json(
        { message: "Mint order does not belong to this wallet." },
        { status: 403 },
      );
    }

    const recoveredAddress = verifyMessage(
      buildMintOrderStatusMessage({
        wallet: order.wallet,
        orderId: order.orderId,
      }),
      signature,
    );

    if (recoveredAddress.toLowerCase() !== order.wallet) {
      return NextResponse.json(
        { message: "Wallet signature could not be verified." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      wallet: order.wallet,
      paymentId: order.paymentId,
      mintTransactionId: order.mintTransactionId,
      mintTransactionHash: order.mintTransactionHash,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not load mint order.",
      },
      { status: 500 },
    );
  }
}
