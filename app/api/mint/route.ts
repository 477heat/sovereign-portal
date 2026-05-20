import { NextRequest, NextResponse } from "next/server";

const BASE_MAINNET_CHAIN_ID = 8453;
const GENESIS_CONTRACT_ADDRESS = "0xa418A054e9940f12a67B9b29eDA6A5db3BC2E378";
const BACKEND_MINT_SIGNATURE =
  "function backendMint(address to, string tokenURI_) payable returns (uint256)";

type MintRequest = {
  wallet?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  publicMark?: string;
  contractAccepted?: boolean;
  contractLanguageVersion?: string;
  tokenURI?: string;
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
      payload.publicMark !== "_. ___" &&
      payload.contractAccepted,
  );
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as MintRequest;
  const mintMode = process.env.PORTAL_MINT_MODE === "live" ? "live" : "mock";

  if (!isWalletAddress(payload.wallet) || !hasRequiredIdentity(payload)) {
    return NextResponse.json(
      {
        status: "rejected",
        message:
          "Wallet, name, DOB, public mark, and contract acceptance are required.",
      },
      { status: 400 },
    );
  }

  if (mintMode === "live") {
    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    const from = process.env.THIRDWEB_BACKEND_WALLET;

    if (!secretKey || !from) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "Mainnet minting needs THIRDWEB_SECRET_KEY and THIRDWEB_BACKEND_WALLET on the server.",
        },
        { status: 500 },
      );
    }

    if (!payload.tokenURI) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "A real tokenURI is required before submitting a Base mainnet mint.",
        },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.thirdweb.com/v1/contracts/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify({
        calls: [
          {
            contractAddress: GENESIS_CONTRACT_ADDRESS,
            method: BACKEND_MINT_SIGNATURE,
            params: [payload.wallet, payload.tokenURI],
          },
        ],
        chainId: BASE_MAINNET_CHAIN_ID,
        from,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "rejected",
          message: "Thirdweb mainnet mint request failed.",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      status: "submitted",
      mode: mintMode,
      chainId: BASE_MAINNET_CHAIN_ID,
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      deedName: `Deed for Soul Ownership of ${payload.publicMark}`,
      contractLanguageVersion: payload.contractLanguageVersion,
      transactionId: data.result?.id ?? data.id,
      transactionHash: data.result?.transactionHash ?? data.transactionHash,
    });
  }

  return NextResponse.json({
    status: "mainnet-ready",
    mode: mintMode,
    chainId: BASE_MAINNET_CHAIN_ID,
    contractAddress: GENESIS_CONTRACT_ADDRESS,
    tokenId: "LOCAL-PREVIEW-001",
    deedName: `Deed for Soul Ownership of ${payload.publicMark}`,
    contractLanguageVersion: payload.contractLanguageVersion,
  });
}
