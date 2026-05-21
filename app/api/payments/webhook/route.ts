import { NextRequest, NextResponse } from "next/server";
import { Bridge } from "thirdweb";
import { markMintOrderPaid } from "@/lib/portalOrders";
import { getServerPaymentConfig } from "@/lib/portalPayments";

function asHeaders(request: NextRequest) {
  return Object.fromEntries(request.headers.entries());
}

function getOrderId(purchaseData: unknown) {
  if (typeof purchaseData === "object" && purchaseData !== null && !Array.isArray(purchaseData)) {
    const orderId = (purchaseData as Record<string, unknown>).orderId;

    if (typeof orderId === "string") {
      return orderId;
    }
  }

  return null;
}

function getTransactionHash(
  payload: Awaited<ReturnType<typeof Bridge.Webhook.parse>>,
) {
  if (payload.type === "pay.onchain-transaction") {
    return payload.data.transactions.at(-1)?.transactionHash;
  }

  return payload.data.transactionHash;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.THIRDWEB_PAYMENTS_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { message: "Payment webhook secret is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = await request.text();
    const config = getServerPaymentConfig();
    const payload = await Bridge.Webhook.parse(
      body,
      asHeaders(request),
      webhookSecret,
      undefined,
      {
        destinationChainId: config.chainId,
        destinationTokenAddress: config.tokenAddress,
        minDestinationAmount: config.minAmount,
        receiverAddress: config.seller,
      },
    );
    const orderId = getOrderId(payload.data.purchaseData);

    if (payload.data.status !== "COMPLETED" || !orderId) {
      return NextResponse.json({ accepted: true, recorded: false });
    }

    const order = await markMintOrderPaid({
      orderId,
      paymentId:
        payload.type === "pay.onchain-transaction"
          ? payload.data.paymentId
          : payload.data.id,
      paymentTransactionHash: getTransactionHash(payload),
    });

    return NextResponse.json({
      accepted: true,
      recorded: Boolean(order),
      orderId,
      status: order?.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Payment webhook rejected.",
      },
      { status: 400 },
    );
  }
}
