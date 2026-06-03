import { JsonRpcProvider } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import {
  isDirectPaymentWalletAllowed,
  verifyDirectBuilderPayment,
  type DirectPaymentConfig,
} from "@/lib/directBuilderPayment";
import {
  getMintOrder,
  markMintOrderPaidByVerifiedTransaction,
  toPublicMintOrder,
} from "@/lib/portalOrders";
import { getServerPaymentConfig } from "@/lib/portalPayments";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";
import { SOUL_DEED_LEDGER_SCOPE } from "@/lib/soulContract";

type VerifyDirectPaymentRequest = {
  publicMark?: string;
  transactionHash?: string;
  wallet?: string;
};

function directPaymentEnabled() {
  return (
    process.env.PORTAL_PAYMENT_FLOW === "base_usdc_direct_attributed" ||
    process.env.NEXT_PUBLIC_PORTAL_PAYMENT_FLOW === "base_usdc_direct_attributed"
  );
}

function getBuilderCodeDataSuffix() {
  return (
    process.env.BASE_BUILDER_CODE_DATA_SUFFIX ??
    process.env.NEXT_PUBLIC_BASE_BUILDER_CODE_DATA_SUFFIX
  );
}

function getRpcUrl() {
  return process.env.BASE_RPC_URL ?? process.env.COINBASE_EAS_RPC_URL;
}

function getAllowedDirectPaymentWallets() {
  return (
    process.env.PORTAL_DIRECT_PAYMENT_ALLOWED_WALLETS ??
    process.env.NEXT_PUBLIC_PORTAL_DIRECT_PAYMENT_ALLOWED_WALLETS
  );
}

function isWalletAddress(value: string | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

function isTransactionHash(value: string | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{64}$/));
}

async function getPaymentConfigForOrder(orderId: string): Promise<DirectPaymentConfig | null> {
  const order = await getMintOrder(orderId);

  if (!order) {
    return null;
  }

  const fallback = await getServerPaymentConfig();

  return {
    chainId: order.paymentChainId ?? fallback.chainId,
    expectedDataSuffix: getBuilderCodeDataSuffix(),
    minAmount: order.paymentMinAmount
      ? BigInt(order.paymentMinAmount)
      : fallback.minAmount,
    seller: order.paymentSeller ?? fallback.seller,
    tokenAddress: order.paymentTokenAddress ?? fallback.tokenAddress,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const ipLimit = checkRateLimit({
    key: `direct-payment:ip:${getClientIp(request)}`,
    limit: 20,
    windowMs: 10 * 60_000,
  });

  if (!ipLimit.ok) {
    return rateLimitResponse(ipLimit.retryAfter);
  }

  if (!directPaymentEnabled()) {
    return NextResponse.json(
      { message: "Direct Builder Code payment verification is not enabled." },
      { status: 404 },
    );
  }

  const rpcUrl = getRpcUrl();
  const expectedDataSuffix = getBuilderCodeDataSuffix();

  if (!rpcUrl || !expectedDataSuffix) {
    return NextResponse.json(
      {
        message:
          "Direct Builder Code payment verification requires Base RPC and Builder Code suffix configuration.",
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as VerifyDirectPaymentRequest;
  const publicMark = payload.publicMark?.trim();
  const transactionHash = payload.transactionHash?.trim();
  const wallet = payload.wallet?.trim();
  const walletLimit = checkRateLimit({
    key: `direct-payment:wallet:${wallet?.toLowerCase() ?? "missing"}`,
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!walletLimit.ok) {
    return rateLimitResponse(walletLimit.retryAfter);
  }

  if (
    !isWalletAddress(wallet) ||
    !isTransactionHash(transactionHash) ||
    !publicMark
  ) {
    return NextResponse.json(
      {
        message:
          "Wallet, public covenant mark, and Base transaction hash are required.",
      },
      { status: 400 },
    );
  }

  if (!isDirectPaymentWalletAllowed(wallet, getAllowedDirectPaymentWallets())) {
    return NextResponse.json(
      {
        message:
          "Direct Builder Code payment test is not enabled for this wallet.",
      },
      { status: 403 },
    );
  }

  try {
    const order = await getMintOrder(orderId);

    if (!order) {
      return NextResponse.json({ message: "Mint order not found." }, { status: 404 });
    }

    if (order.contractAddress?.toLowerCase() !== SOUL_DEED_LEDGER_SCOPE) {
      return NextResponse.json(
        { message: "Mint order belongs to a previous contract." },
        { status: 409 },
      );
    }

    if (order.wallet !== wallet!.toLowerCase()) {
      return NextResponse.json(
        { message: "Mint order does not belong to this wallet." },
        { status: 403 },
      );
    }

    if (order.publicMark !== publicMark) {
      return NextResponse.json(
        { message: "Mint order does not match this public covenant mark." },
        { status: 403 },
      );
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { message: "Mint order is not pending payment." },
        { status: 409 },
      );
    }

    const paymentConfig = await getPaymentConfigForOrder(orderId);

    if (!paymentConfig) {
      return NextResponse.json({ message: "Mint order not found." }, { status: 404 });
    }

    const provider = new JsonRpcProvider(rpcUrl, paymentConfig.chainId);
    const [transaction, receipt] = await Promise.all([
      provider.getTransaction(transactionHash!),
      provider.getTransactionReceipt(transactionHash!),
    ]);

    if (!transaction || !receipt) {
      return NextResponse.json(
        { message: "Payment transaction is not confirmed on Base yet." },
        { status: 404 },
      );
    }

    const verification = verifyDirectBuilderPayment({
      config: paymentConfig,
      expectedWallet: order.wallet,
      transaction: {
        chainId: Number(transaction.chainId),
        data: transaction.data,
        from: transaction.from,
        status: receipt.status === 1 ? "success" : "failed",
        to: transaction.to ?? "",
        transactionHash: transaction.hash,
        value: transaction.value,
      },
    });

    if (!verification.valid) {
      return NextResponse.json(
        {
          errors: verification.errors,
          message: "Payment transaction did not satisfy this mint order.",
        },
        { status: 400 },
      );
    }

    const paidOrder = await markMintOrderPaidByVerifiedTransaction({
      orderId,
      paymentId:
        verification.paymentId ?? `base-direct:${transactionHash!.toLowerCase()}`,
      paymentTransactionHash: transaction.hash,
      receivedAmount: verification.receivedAmount,
      fallbackMinimumAmount: paymentConfig.minAmount,
    });

    return NextResponse.json({
      accepted: true,
      order: paidOrder ? toPublicMintOrder(paidOrder) : null,
      orderId,
      status: paidOrder?.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Direct payment could not be verified.",
      },
      { status: 500 },
    );
  }
}
