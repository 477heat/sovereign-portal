import { NextRequest, NextResponse } from "next/server";
import {
  claimMintOrder,
  markMintOrderSubmitted,
  releaseMintOrder,
} from "@/lib/portalOrders";
import { paymentRequired } from "@/lib/portalPayments";
import {
  hasCoinbaseEasRpcUrl,
  lookupCoinbaseVerifiedAccount,
} from "@/lib/coinbaseEas";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";
import { SOUL_DEED_CONTRACT_ADDRESS } from "@/lib/soulContract";

const BASE_MAINNET_CHAIN_ID = 8453;
const GENESIS_CONTRACT_ADDRESS = SOUL_DEED_CONTRACT_ADDRESS;

type MintRequest = {
  wallet?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  publicMark?: string;
  contractAccepted?: boolean;
  contractLanguageVersion?: string;
  tokenURI?: string;
  orderId?: string;
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

function ipfsGatewayUrl(uri: string | undefined) {
  if (!uri) {
    return undefined;
  }

  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }

  if (uri.startsWith("https://")) {
    return uri;
  }

  return undefined;
}

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

function forgetRawIdentity(payload: MintRequest) {
  payload.firstName = undefined;
  payload.lastName = undefined;
  payload.dob = undefined;
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
  const walletKey = payload.wallet?.toLowerCase() ?? "missing";
  const ipLimit = checkRateLimit({
    key: `mint:ip:${getClientIp(request)}`,
    limit: 20,
    windowMs: 10 * 60_000,
  });
  const walletLimit = checkRateLimit({
    key: `mint:wallet:${walletKey}`,
    limit: 5,
    windowMs: 10 * 60_000,
  });

  if (!ipLimit.ok) {
    return rateLimitResponse(ipLimit.retryAfter);
  }

  if (!walletLimit.ok) {
    return rateLimitResponse(walletLimit.retryAfter);
  }

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
    const attestationMode =
      process.env.PORTAL_ATTESTATION_MODE === "live" ? "live" : "mock";

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

    if (attestationMode !== "live") {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "Live minting requires PORTAL_ATTESTATION_MODE=live so Coinbase EAS eligibility is enforced server-side.",
        },
        { status: 500 },
      );
    }

    if (!hasCoinbaseEasRpcUrl()) {
      return NextResponse.json(
        {
          status: "rejected",
          message:
            "Live minting requires BASE_RPC_URL or COINBASE_EAS_RPC_URL for Coinbase EAS eligibility.",
        },
        { status: 500 },
      );
    }

    let attestation: Awaited<ReturnType<typeof lookupCoinbaseVerifiedAccount>>;

    try {
      attestation = await lookupCoinbaseVerifiedAccount(payload.wallet!);
    } catch (error) {
      console.error("Coinbase EAS mint gate failed", error);

      return NextResponse.json(
        {
          status: "rejected",
          message:
            "Coinbase EAS eligibility could not be checked. Check Base RPC configuration and try again.",
        },
        { status: 502 },
      );
    }

    if (!attestation.eligible) {
      return NextResponse.json(
        {
          status: "rejected",
          message: attestation.message,
          attestation,
        },
        { status: 403 },
      );
    }

    let claimedOrder = false;

    if (paymentRequired()) {
      if (!payload.orderId) {
        return NextResponse.json(
          {
            status: "rejected",
            message: "A verified paid mint order is required.",
          },
          { status: 402 },
        );
      }

      try {
        await claimMintOrder(payload.orderId, payload.wallet!, payload.publicMark!);
        claimedOrder = true;
      } catch (error) {
        return NextResponse.json(
          {
            status: "rejected",
            message:
              error instanceof Error
                ? error.message
                : "The paid mint order could not be claimed.",
          },
          { status: 409 },
        );
      }
    }

    let metadata: MintMetadata;

    try {
      metadata = await requestMetadata(payload, engineUrl);
      forgetRawIdentity(payload);
    } catch (error) {
      forgetRawIdentity(payload);

      if (claimedOrder && payload.orderId) {
        await releaseMintOrder(payload.orderId, payload.wallet!);
      }

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
      if (claimedOrder && payload.orderId) {
        await releaseMintOrder(payload.orderId, payload.wallet!);
      }

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
      if (claimedOrder && payload.orderId) {
        await releaseMintOrder(payload.orderId, payload.wallet!);
      }

      return NextResponse.json(
        {
          status: "rejected",
          message: data?.error ?? "The mint worker rejected the mint request.",
          details: data,
        },
        { status: response.status },
      );
    }

    const deedName = `Certificate of Title for Spiritual Ownership of ${payload.publicMark}`;
    const tokenURI = data?.tokenURI;
    const metadataUrl = ipfsGatewayUrl(tokenURI);
    const imageURI = metadata.image;
    const imageUrl = ipfsGatewayUrl(imageURI);

    if (claimedOrder && payload.orderId) {
      await markMintOrderSubmitted({
        orderId: payload.orderId,
        mintTransactionId: data?.transactionId,
        mintTransactionHash: data?.transactionHash,
        chainId: BASE_MAINNET_CHAIN_ID,
        deedName,
        contractLanguageVersion: payload.contractLanguageVersion,
        tokenURI,
        metadataUrl,
        ipfsHash: data?.ipfsHash,
        imageURI,
        imageUrl,
      });
    }

    return NextResponse.json({
      status: "submitted",
      mode: mintMode,
      chainId: BASE_MAINNET_CHAIN_ID,
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      deedName,
      contractLanguageVersion: payload.contractLanguageVersion,
      transactionId: data?.transactionId,
      transactionHash: data?.transactionHash,
      tokenURI,
      metadataUrl,
      ipfsHash: data?.ipfsHash,
      imageURI,
      imageUrl,
      orderId: payload.orderId,
    });
  }

  return NextResponse.json({
    status: "mainnet-ready",
    mode: mintMode,
    chainId: BASE_MAINNET_CHAIN_ID,
    contractAddress: GENESIS_CONTRACT_ADDRESS,
    tokenId: "LOCAL-PREVIEW-001",
    deedName: `Certificate of Title for Spiritual Ownership of ${payload.publicMark}`,
    contractLanguageVersion: payload.contractLanguageVersion,
  });
}
