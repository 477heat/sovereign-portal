import { NextRequest, NextResponse } from "next/server";

const COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID =
  "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

function isWalletAddress(value: string | null) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!isWalletAddress(address)) {
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
    return NextResponse.json({
      eligible: false,
      mode,
      schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
      message:
        "Live Coinbase EAS lookup is reserved for the next wiring pass. Schema is configured.",
    });
  }

  return NextResponse.json({
    eligible: true,
    mode,
    schemaId: COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
    message:
      "Mock pass: wallet is treated as eligible while the Coinbase EAS lookup is wired.",
  });
}
