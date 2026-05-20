import { NextRequest, NextResponse } from "next/server";

type MintRequest = {
  wallet?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  publicMark?: string;
};

function isWalletAddress(value: string | undefined) {
  return Boolean(value?.match(/^0x[a-fA-F0-9]{40}$/));
}

function hasRequiredIdentity(payload: MintRequest) {
  return Boolean(
    payload.firstName?.trim() &&
      payload.lastName?.trim() &&
      payload.dob &&
      payload.publicMark &&
      payload.publicMark !== "_. ___",
  );
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as MintRequest;

  if (!isWalletAddress(payload.wallet) || !hasRequiredIdentity(payload)) {
    return NextResponse.json(
      {
        status: "rejected",
        message: "Wallet, name, DOB, and public mark are required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    status: "simulated",
    tokenId: "LOCAL-PREVIEW-001",
    deedName: `Deed for Soul Ownership of ${payload.publicMark}`,
  });
}
