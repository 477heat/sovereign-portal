import { NextRequest, NextResponse } from "next/server";
import {
  buildMintReceiptFromOrder,
  getLatestMintOrderForWallet,
  getMintOrder,
  toPublicMintOrder,
} from "@/lib/portalOrders";
import { isWalletAddress } from "@/lib/portalWalletAuth";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId")?.trim();
  const wallet = request.nextUrl.searchParams.get("wallet")?.trim();

  if (!orderId && !wallet) {
    return NextResponse.json(
      { message: "Search by order ID or wallet address." },
      { status: 400 },
    );
  }

  if (wallet && !isWalletAddress(wallet)) {
    return NextResponse.json(
      { message: "Wallet address is not valid." },
      { status: 400 },
    );
  }

  try {
    const order = orderId
      ? await getMintOrder(orderId)
      : await getLatestMintOrderForWallet(wallet!);

    if (!order) {
      return NextResponse.json(
        { message: "Mint order was not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      order: toPublicMintOrder(order),
      receipt: buildMintReceiptFromOrder(order),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Mint order could not be loaded.",
      },
      { status: 500 },
    );
  }
}
