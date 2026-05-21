import { NextRequest, NextResponse } from "next/server";

const BASE_MAINNET_CHAIN_ID = 8453;
const GENESIS_CONTRACT_ADDRESS = "0x8453b77c845c913d8ca3d1a265ba17fc6aa5ea65";

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

type MintMetadata = {
  name?: string;
  description?: string;
  image?: string;
  attributes?: unknown[];
  [key: string]: unknown;
};

type MintWorkerResult = {
  success?: boolean;
  transactionId?: string;
  transactionHash?: string;
  tokenURI?: string;
  ipfsHash?: string;
  error?: string;
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function looksLikeMetadata(value: unknown): value is MintMetadata {
  return (
    isObject(value) &&
    typeof value.name === "string" &&
    typeof value.image === "string" &&
    Array.isArray(value.attributes)
  );
}

function parseBody(value: unknown) {
  if (!isObject(value) || value.body === undefined) {
    return value;
  }

  if (typeof value.body === "string") {
    try {
      return JSON.parse(value.body) as unknown;
    } catch {
      return value.body;
    }
  }

  return value.body;
}

function getEngineMetadata(value: unknown): MintMetadata | null {
  const body = parseBody(value);

  if (looksLikeMetadata(body)) {
    return body;
  }

  if (isObject(body) && looksLikeMetadata(body.metadata)) {
    return body.metadata;
  }

  if (
    isObject(body) &&
    isObject(body.profile) &&
    looksLikeMetadata(body.profile.metadata)
  ) {
    return body.profile.metadata;
  }

  return null;
}

function hasMintableImage(metadata: MintMetadata) {
  return Boolean(
    metadata.image?.startsWith("ipfs://") &&
      !metadata.image.includes("PLACEHOLDER") &&
      !metadata.image.includes("LOCAL_TEST"),
  );
}

function mintWorkerEndpoint(url: string) {
  return `${url.replace(/\/$/, "")}/mint`;
}

async function requestMetadata(payload: MintRequest, engineUrl: string) {
  const response = await fetch(engineUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: payload.firstName,
      lastName: payload.lastName,
      dob: payload.dob,
      walletAddress: payload.wallet,
      output: "mint_metadata",
      attributeProfile: "genesis",
      statTable: "genesis_engine",
    }),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error("The Genesis Engine metadata request failed.");
  }

  const metadata = getEngineMetadata(data);

  if (!metadata) {
    throw new Error("The Genesis Engine did not return ERC-721 metadata.");
  }

  return metadata;
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
    const engineUrl = process.env.PORTAL_ENGINE_URL;
    const mintWorkerUrl = process.env.PORTAL_MINT_WORKER_URL;

    if (!engineUrl || !mintWorkerUrl) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "Live minting needs PORTAL_ENGINE_URL and PORTAL_MINT_WORKER_URL on the server.",
        },
        { status: 500 },
      );
    }

    let metadata: MintMetadata;

    try {
      metadata = await requestMetadata(payload, engineUrl);
    } catch (error) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            error instanceof Error
              ? error.message
              : "The Genesis Engine metadata request failed.",
        },
        { status: 502 },
      );
    }

    if (!hasMintableImage(metadata)) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "The Genesis Engine returned metadata without a final IPFS deed image.",
        },
        { status: 409 },
      );
    }

    const response = await fetch(mintWorkerEndpoint(mintWorkerUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: payload.wallet,
        metadata,
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | MintWorkerResult
      | null;

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "rejected",
          message: data?.error ?? "The mint worker rejected the mint request.",
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
      transactionId: data?.transactionId,
      transactionHash: data?.transactionHash,
      tokenURI: data?.tokenURI,
      ipfsHash: data?.ipfsHash,
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
