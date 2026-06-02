import { Contract, JsonRpcProvider, hashMessage, verifyMessage } from "ethers";
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

const ERC1271_MAGIC_VALUE = "0x1626ba7e";
const ERC1271_ABI = [
  "function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4)",
];
const RAW_SIGNATURE_HEX_LENGTH = 2 + 65 * 2;
const ABI_WORD_HEX_LENGTH = 64;

function isHex(value: string) {
  return /^0x[0-9a-fA-F]*$/.test(value);
}

function isRawSignature(value: string) {
  return isHex(value) && value.length === RAW_SIGNATURE_HEX_LENGTH;
}

function signatureCandidates(signature: string) {
  const candidates = new Set<string>();

  if (!isHex(signature)) {
    return [];
  }

  if (isRawSignature(signature)) {
    candidates.add(signature);
  }

  const hex = signature.slice(2);

  for (let index = 0; index <= hex.length - ABI_WORD_HEX_LENGTH; index += ABI_WORD_HEX_LENGTH) {
    const word = hex.slice(index, index + ABI_WORD_HEX_LENGTH);

    if (BigInt(`0x${word}`) !== BigInt(65)) {
      continue;
    }

    const candidate = `0x${hex.slice(
      index + ABI_WORD_HEX_LENGTH,
      index + ABI_WORD_HEX_LENGTH + 65 * 2,
    )}`;

    if (isRawSignature(candidate)) {
      candidates.add(candidate);
    }
  }

  return [...candidates];
}

async function isValidWalletSignature({
  wallet,
  message,
  signature,
}: {
  wallet: string;
  message: string;
  signature: string;
}) {
  const normalizedWallet = wallet.toLowerCase();

  for (const candidate of signatureCandidates(signature)) {
    try {
      if (verifyMessage(message, candidate).toLowerCase() === normalizedWallet) {
        return true;
      }
    } catch {
      // Try the next signature shape, then fall back to ERC-1271 below.
    }
  }

  const rpcUrl = process.env.BASE_RPC_URL ?? process.env.COINBASE_EAS_RPC_URL;

  if (!rpcUrl || !isHex(signature)) {
    return false;
  }

  try {
    const provider = new JsonRpcProvider(rpcUrl);
    const walletContract = new Contract(wallet, ERC1271_ABI, provider);
    const result = (await walletContract.isValidSignature(
      hashMessage(message),
      signature,
    )) as string;

    return result.toLowerCase() === ERC1271_MAGIC_VALUE;
  } catch {
    return false;
  }
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
      orderId: order.orderId,
      status: order.status,
      wallet: order.wallet,
      paymentKind: order.paymentKind,
      paymentAmount: order.paymentAmount,
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
