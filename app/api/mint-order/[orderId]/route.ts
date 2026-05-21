import { NextResponse } from "next/server";
import { getMintOrder } from "@/lib/portalOrders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  try {
    const order = await getMintOrder(orderId);

    if (!order) {
      return NextResponse.json({ message: "Mint order not found." }, { status: 404 });
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
