import { NextRequest, NextResponse } from "next/server";
import {
  BASE_MAINNET_CHAIN_ID,
  BASE_EAS_CONTRACT_ADDRESS,
  COINBASE_ATTESTATION_INDEXER_ADDRESS,
  COINBASE_ATTESTER_ADDRESS,
  COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
  hasCoinbaseEasRpcUrl,
  lookupCoinbaseVerifiedAccount,
  normalizeWalletAddress,
} from "@/lib/coinbaseEas";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

function isWalletAddress(value: string | null) {
  return Boolean(value && normalizeWalletAddress(value));
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  const walletAddress = address ? normalizeWalletAddress(address) : null;
  const rateLimit = checkRateLimit({
    key: `attestation:${getClientIp(request)}:${walletAddress ?? "missing"}`,
    limit: 60,
    windowMs: 60_000,
  });

  if (!rateLimit.ok) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  if (!walletAddress || !isWalletAddress(address)) {
    return NextResponse.json(
      {
        eligible: false,
        mode: "mock",
        schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
        message: "A valid wallet address is required for attestation lookup.",
      },
      { status: 400 },
    );
  }

  const mode = process.env.PORTAL_ATTESTATION_MODE === "live" ? "live" : "mock";

  if (mode === "live") {
    if (!hasCoinbaseEasRpcUrl()) {
      return NextResponse.json(
        {
          eligible: false,
          mode,
          chainId: BASE_MAINNET_CHAIN_ID,
          schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
          indexerAddress: COINBASE_ATTESTATION_INDEXER_ADDRESS,
          easAddress: BASE_EAS_CONTRACT_ADDRESS,
          attesterAddress: COINBASE_ATTESTER_ADDRESS,
          message:
            "Live Coinbase EAS lookup requires BASE_RPC_URL or COINBASE_EAS_RPC_URL.",
        },
        { status: 500 },
      );
    }

    try {
      const result = await lookupCoinbaseVerifiedAccount(walletAddress);

      return NextResponse.json(result, { status: result.eligible ? 200 : 404 });
    } catch (error) {
      console.error("Coinbase EAS lookup failed", error);

      return NextResponse.json(
        {
          eligible: false,
          mode,
          chainId: BASE_MAINNET_CHAIN_ID,
          schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
          indexerAddress: COINBASE_ATTESTATION_INDEXER_ADDRESS,
          easAddress: BASE_EAS_CONTRACT_ADDRESS,
          attesterAddress: COINBASE_ATTESTER_ADDRESS,
          message:
            "Coinbase EAS lookup failed. Check Base RPC configuration and try again.",
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    eligible: true,
    mode,
    chainId: BASE_MAINNET_CHAIN_ID,
    schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
    indexerAddress: COINBASE_ATTESTATION_INDEXER_ADDRESS,
    easAddress: BASE_EAS_CONTRACT_ADDRESS,
    attesterAddress: COINBASE_ATTESTER_ADDRESS,
    message:
      "Mock pass: wallet is treated as eligible while the Coinbase EAS lookup is wired.",
  });
}
