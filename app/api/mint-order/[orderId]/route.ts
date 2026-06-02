import { NextRequest, NextResponse } from "next/server";
import { buildMintOrderStatusMessage } from "@/lib/portalMessages";
import {
  buildMintReceiptFromOrder,
  getMintOrder,
  toPublicMintOrder,
} from "@/lib/portalOrders";
import {
  isValidWalletSignature,
  isWalletAddress,
} from "@/lib/portalWalletAuth";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

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

    const message = buildMintOrderStatusMessage({
      wallet: order.wallet,
      orderId: order.orderId,
    });

    if (
      !(await isValidWalletSignature({
        wallet: order.wallet,
        message,
        signature,
      }))
    ) {
      return NextResponse.json(
        { message: "Wallet signature could not be verified." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      order: toPublicMintOrder(order),
      receipt: buildMintReceiptFromOrder(order),
      ...toPublicMintOrder(order),
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
