import { NextRequest, NextResponse } from "next/server";
import { buildMintRecoveryMessage } from "@/lib/portalMessages";
import {
  buildMintReceiptFromOrder,
  getLatestMintOrderForWallet,
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

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");
  const signature = request.nextUrl.searchParams.get("signature");
  const ipLimit = checkRateLimit({
    key: `mint-order-recovery:ip:${getClientIp(request)}`,
    limit: 30,
    windowMs: 10 * 60_000,
  });

  if (!ipLimit.ok) {
    return rateLimitResponse(ipLimit.retryAfter);
  }

  if (!isWalletAddress(wallet) || !signature) {
    return NextResponse.json(
      { message: "Wallet signature is required to recover a mint receipt." },
      { status: 401 },
    );
  }

  const message = buildMintRecoveryMessage({ wallet: wallet! });

  if (
    !(await isValidWalletSignature({
      wallet: wallet!,
      message,
      signature,
    }))
  ) {
    return NextResponse.json(
      { message: "Wallet signature could not be verified." },
      { status: 403 },
    );
  }

  try {
    const order = await getLatestMintOrderForWallet(wallet!);

    if (!order) {
      return NextResponse.json(
        { message: "No mint order was found for this wallet." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      order: toPublicMintOrder(order),
      receipt: buildMintReceiptFromOrder(order),
      message:
        order.status === "mint_submitted"
          ? "Mint receipt restored."
          : "Latest mint order found, but it is not submitted yet.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Mint receipt could not be recovered.",
      },
      { status: 500 },
    );
  }
}
