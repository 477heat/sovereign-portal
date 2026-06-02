import "server-only";

import { randomUUID } from "node:crypto";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  SOUL_DEED_CONTRACT_ADDRESS,
  SOUL_DEED_LEDGER_SCOPE,
} from "@/lib/soulContract";

export type MintOrderStatus =
  | "pending_payment"
  | "paid"
  | "minting"
  | "mint_submitted";

export type MintOrderEventType =
  | "order_created"
  | "complimentary_order_created"
  | "payment_recorded"
  | "mint_claimed"
  | "mint_released"
  | "mint_submitted";

export type MintOrderEvent = {
  id: string;
  type: MintOrderEventType;
  at: string;
  message: string;
};

export type MintOrder = {
  orderId: string;
  contractAddress: string;
  wallet: string;
  publicMark: string;
  status: MintOrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentKind?: "checkout" | "complimentary";
  paymentAmount?: string;
  paymentMinAmount?: string;
  paymentSeller?: string;
  paymentTokenAddress?: string;
  paymentTokenDecimals?: number;
  paymentChainId?: number;
  paymentId?: string;
  paymentTransactionHash?: string;
  mintTransactionId?: string;
  mintTransactionHash?: string;
  chainId?: number;
  deedName?: string;
  contractLanguageVersion?: string;
  tokenURI?: string;
  metadataUrl?: string;
  ipfsHash?: string;
  imageURI?: string;
  imageUrl?: string;
  compReason?: string;
  events?: MintOrderEvent[];
};

type MintClaim = {
  orderId: string;
  contractAddress: string;
  wallet: string;
  createdAt: string;
};

type LocalLedger = {
  orders: Map<string, MintOrder>;
  mintClaims: Map<string, MintClaim>;
  complimentaryOrders: Map<string, string>;
  latestOrdersByWallet: Map<string, string>;
};

declare global {
  var portalMintLedger: LocalLedger | undefined;
}

const tableName = process.env.PORTAL_LEDGER_TABLE;
const localLedger =
  globalThis.portalMintLedger ??
  (globalThis.portalMintLedger = {
    orders: new Map<string, MintOrder>(),
    mintClaims: new Map<string, MintClaim>(),
    complimentaryOrders: new Map<string, string>(),
    latestOrdersByWallet: new Map<string, string>(),
  });

let documentClient: DynamoDBDocumentClient | null = null;

function getDocumentClient() {
  if (!documentClient) {
    documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  return documentClient;
}

function requireLedger() {
  if (!tableName && process.env.PORTAL_MINT_MODE === "live") {
    throw new Error("Live minting requires PORTAL_LEDGER_TABLE.");
  }
}

function orderKey(orderId: string) {
  return `ORDER#${orderId}`;
}

function walletClaimKey(wallet: string) {
  return `MINTED_WALLET#${SOUL_DEED_LEDGER_SCOPE}#${wallet.toLowerCase()}`;
}

function latestWalletOrderKey(wallet: string) {
  return `WALLET_ORDER#${SOUL_DEED_LEDGER_SCOPE}#${wallet.toLowerCase()}`;
}

function complimentaryOrderKey(wallet: string) {
  return `COMP_ORDER#${SOUL_DEED_LEDGER_SCOPE}#${wallet.toLowerCase()}`;
}

function orderFromItem(value: Record<string, unknown> | undefined) {
  if (!value || value.entity !== "mint-order") {
    return null;
  }

  return value as MintOrder;
}

function isCurrentContractOrder(order: MintOrder) {
  return order.contractAddress?.toLowerCase() === SOUL_DEED_LEDGER_SCOPE;
}

function makeOrderEvent(type: MintOrderEventType, message: string) {
  return {
    id: randomUUID(),
    type,
    at: new Date().toISOString(),
    message,
  } satisfies MintOrderEvent;
}

function withOrderEvent(order: MintOrder, event: MintOrderEvent) {
  return {
    ...order,
    events: [...(order.events ?? []), event].slice(-40),
  } satisfies MintOrder;
}

function eventUpdateExpression(extraSetters: string) {
  return [
    `SET ${extraSetters}`,
    "#events = list_append(if_not_exists(#events, :emptyEvents), :events)",
  ].join(", ");
}

export async function createMintOrder({
  wallet,
  publicMark,
  payment,
}: {
  wallet: string;
  publicMark: string;
  payment: {
    amount: string;
    minAmount: bigint;
    seller: string;
    tokenAddress: string;
    decimals: number;
    chainId: number;
  };
}) {
  requireLedger();

  const now = new Date().toISOString();
  const orderCreatedEvent = makeOrderEvent(
    "order_created",
    "Checkout order created.",
  );
  const order: MintOrder = {
    orderId: randomUUID(),
    contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
    wallet: wallet.toLowerCase(),
    publicMark,
    status: "pending_payment",
    createdAt: now,
    updatedAt: now,
    paymentKind: "checkout",
    paymentAmount: payment.amount,
    paymentMinAmount: payment.minAmount.toString(),
    paymentSeller: payment.seller,
    paymentTokenAddress: payment.tokenAddress,
    paymentTokenDecimals: payment.decimals,
    paymentChainId: payment.chainId,
    events: [orderCreatedEvent],
  };

  if (!tableName) {
    if (localLedger.mintClaims.has(order.wallet)) {
      throw new Error("This wallet already has a submitted mint.");
    }

    localLedger.orders.set(order.orderId, order);
    localLedger.latestOrdersByWallet.set(order.wallet, order.orderId);
    return order;
  }

  await getDocumentClient().send(
    new TransactWriteCommand({
      TransactItems: [
        {
          ConditionCheck: {
            TableName: tableName,
            Key: { pk: walletClaimKey(order.wallet) },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: orderKey(order.orderId),
              entity: "mint-order",
              ...order,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: latestWalletOrderKey(order.wallet),
              entity: "wallet-mint-order-pointer",
              orderId: order.orderId,
              contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
              wallet: order.wallet,
              publicMark,
              createdAt: now,
              updatedAt: now,
            },
          },
        },
      ],
    }),
  );

  return order;
}

export async function createComplimentaryMintOrder({
  wallet,
  publicMark,
  reason,
}: {
  wallet: string;
  publicMark: string;
  reason?: string;
}) {
  requireLedger();

  const normalizedWallet = wallet.toLowerCase();
  const now = new Date().toISOString();
  const complimentaryEvent = makeOrderEvent(
    "complimentary_order_created",
    "Admin complimentary order created.",
  );
  const order: MintOrder = {
    orderId: randomUUID(),
    contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
    wallet: normalizedWallet,
    publicMark,
    status: "paid",
    createdAt: now,
    updatedAt: now,
    paymentKind: "complimentary",
    paymentId: `admin-comp:${randomUUID()}`,
    compReason: reason?.trim() || undefined,
    events: [complimentaryEvent],
  };

  if (!tableName) {
    if (localLedger.mintClaims.has(normalizedWallet)) {
      throw new Error("This wallet already has a submitted mint.");
    }

    if (localLedger.complimentaryOrders.has(normalizedWallet)) {
      throw new Error("This wallet already has a complimentary mint order.");
    }

    localLedger.orders.set(order.orderId, order);
    localLedger.complimentaryOrders.set(normalizedWallet, order.orderId);
    localLedger.latestOrdersByWallet.set(normalizedWallet, order.orderId);
    return order;
  }

  await getDocumentClient().send(
    new TransactWriteCommand({
      TransactItems: [
        {
          ConditionCheck: {
            TableName: tableName,
            Key: { pk: walletClaimKey(normalizedWallet) },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: orderKey(order.orderId),
              entity: "mint-order",
              ...order,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: complimentaryOrderKey(normalizedWallet),
              entity: "complimentary-mint-order",
              orderId: order.orderId,
              contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
              wallet: normalizedWallet,
              publicMark,
              createdAt: now,
              updatedAt: now,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: {
              pk: latestWalletOrderKey(normalizedWallet),
              entity: "wallet-mint-order-pointer",
              orderId: order.orderId,
              contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
              wallet: normalizedWallet,
              publicMark,
              createdAt: now,
              updatedAt: now,
            },
          },
        },
      ],
    }),
  );

  return order;
}

export async function getComplimentaryMintOrder(
  wallet: string,
  publicMark: string,
) {
  requireLedger();

  const normalizedWallet = wallet.toLowerCase();

  if (!tableName) {
    const orderId = localLedger.complimentaryOrders.get(normalizedWallet);
    const order = orderId ? localLedger.orders.get(orderId) : null;

    if (!order || order.publicMark !== publicMark) {
      return null;
    }

    return order;
  }

  const pointerResult = await getDocumentClient().send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: complimentaryOrderKey(normalizedWallet) },
    }),
  );
  const orderId =
    typeof pointerResult.Item?.orderId === "string"
      ? pointerResult.Item.orderId
      : null;

  if (!orderId) {
    return null;
  }

  const order = await getMintOrder(orderId);

  if (!order || !isCurrentContractOrder(order) || order.publicMark !== publicMark) {
    return null;
  }

  return order;
}

export async function getMintOrder(orderId: string) {
  requireLedger();

  if (!tableName) {
    return localLedger.orders.get(orderId) ?? null;
  }

  const result = await getDocumentClient().send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
    }),
  );

  return orderFromItem(result.Item);
}

export async function markMintOrderPaid({
  orderId,
  paymentId,
  paymentTransactionHash,
  receivedAmount,
  fallbackMinimumAmount,
}: {
  orderId: string;
  paymentId: string;
  paymentTransactionHash?: string;
  receivedAmount?: bigint;
  fallbackMinimumAmount?: bigint;
}) {
  requireLedger();

  const current = await getMintOrder(orderId);
  if (!current) {
    return null;
  }

  const requiredAmount = current.paymentMinAmount
    ? BigInt(current.paymentMinAmount)
    : fallbackMinimumAmount;

  if (
    requiredAmount !== undefined &&
    receivedAmount !== undefined &&
    receivedAmount < requiredAmount
  ) {
    throw new Error("Payment amount is lower than this mint order requires.");
  }

  if (current.status === "minting" || current.status === "mint_submitted") {
    return current;
  }

  const updatedAt = new Date().toISOString();
  const paymentEvent = makeOrderEvent(
    "payment_recorded",
    "Payment webhook recorded.",
  );

  if (!tableName) {
    const nextOrder: MintOrder = withOrderEvent(
      {
        ...current,
        status: "paid",
        updatedAt,
        paymentId,
        paymentTransactionHash,
      },
      paymentEvent,
    );
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression: eventUpdateExpression(
        "#status = :status, updatedAt = :updatedAt, paymentId = :paymentId, paymentTransactionHash = :paymentTransactionHash",
      ),
      ExpressionAttributeNames: { "#status": "status", "#events": "events" },
      ExpressionAttributeValues: {
        ":status": "paid",
        ":updatedAt": updatedAt,
        ":paymentId": paymentId,
        ":paymentTransactionHash": paymentTransactionHash ?? "",
        ":emptyEvents": [],
        ":events": [paymentEvent],
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return orderFromItem(result.Attributes);
}

export async function claimMintOrder(
  orderId: string,
  wallet: string,
  publicMark: string,
) {
  requireLedger();

  const order = await getMintOrder(orderId);
  const normalizedWallet = wallet.toLowerCase();

  if (!order || order.wallet !== normalizedWallet) {
    throw new Error("Mint order does not match this wallet.");
  }

  if (!isCurrentContractOrder(order)) {
    throw new Error("Mint order belongs to a previous contract.");
  }

  if (order.publicMark !== publicMark) {
    throw new Error("Mint order does not match this public covenant mark.");
  }

  if (order.status !== "paid") {
    throw new Error("Mint order is not paid yet.");
  }

  const now = new Date().toISOString();
  const claim: MintClaim = {
    orderId,
    contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
    wallet: normalizedWallet,
    createdAt: now,
  };
  const mintClaimedEvent = makeOrderEvent(
    "mint_claimed",
    "Paid order claimed for mint submission.",
  );

  if (!tableName) {
    if (localLedger.mintClaims.has(normalizedWallet)) {
      throw new Error("This wallet already has a submitted mint.");
    }

    localLedger.mintClaims.set(normalizedWallet, claim);
    const nextOrder: MintOrder = withOrderEvent(
      { ...order, status: "minting", updatedAt: now },
      mintClaimedEvent,
    );
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  await getDocumentClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: walletClaimKey(normalizedWallet),
        entity: "mint-claim",
        ...claim,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    }),
  );

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression: eventUpdateExpression(
        "#status = :status, updatedAt = :updatedAt",
      ),
      ExpressionAttributeNames: { "#status": "status", "#events": "events" },
      ExpressionAttributeValues: {
        ":status": "minting",
        ":updatedAt": now,
        ":emptyEvents": [],
        ":events": [mintClaimedEvent],
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return orderFromItem(result.Attributes);
}

export async function releaseMintOrder(orderId: string, wallet: string) {
  requireLedger();

  const order = await getMintOrder(orderId);
  const normalizedWallet = wallet.toLowerCase();

  if (!order || order.wallet !== normalizedWallet || order.status !== "minting") {
    return order;
  }

  const now = new Date().toISOString();
  const mintReleasedEvent = makeOrderEvent(
    "mint_released",
    "Mint lock released after a failed mint attempt.",
  );

  if (!tableName) {
    localLedger.mintClaims.delete(normalizedWallet);
    const nextOrder: MintOrder = withOrderEvent(
      { ...order, status: "paid", updatedAt: now },
      mintReleasedEvent,
    );
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  await getDocumentClient().send(
    new DeleteCommand({
      TableName: tableName,
      Key: { pk: walletClaimKey(normalizedWallet) },
    }),
  );

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression: eventUpdateExpression(
        "#status = :status, updatedAt = :updatedAt",
      ),
      ExpressionAttributeNames: { "#status": "status", "#events": "events" },
      ExpressionAttributeValues: {
        ":status": "paid",
        ":updatedAt": now,
        ":emptyEvents": [],
        ":events": [mintReleasedEvent],
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return orderFromItem(result.Attributes);
}

export async function markMintOrderSubmitted({
  orderId,
  mintTransactionId,
  mintTransactionHash,
  chainId,
  deedName,
  contractLanguageVersion,
  tokenURI,
  metadataUrl,
  ipfsHash,
  imageURI,
  imageUrl,
}: {
  orderId: string;
  mintTransactionId?: string;
  mintTransactionHash?: string;
  chainId?: number;
  deedName?: string;
  contractLanguageVersion?: string;
  tokenURI?: string;
  metadataUrl?: string;
  ipfsHash?: string;
  imageURI?: string;
  imageUrl?: string;
}) {
  requireLedger();

  const order = await getMintOrder(orderId);
  if (!order) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const mintSubmittedEvent = makeOrderEvent(
    "mint_submitted",
    "Mint submitted to Base.",
  );

  if (!tableName) {
    const nextOrder: MintOrder = withOrderEvent(
      {
        ...order,
        status: "mint_submitted",
        updatedAt,
        mintTransactionId,
        mintTransactionHash,
        chainId,
        deedName,
        contractLanguageVersion,
        tokenURI,
        metadataUrl,
        ipfsHash,
        imageURI,
        imageUrl,
      },
      mintSubmittedEvent,
    );
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression: eventUpdateExpression(
        "#status = :status, updatedAt = :updatedAt, mintTransactionId = :mintTransactionId, mintTransactionHash = :mintTransactionHash, chainId = :chainId, deedName = :deedName, contractLanguageVersion = :contractLanguageVersion, tokenURI = :tokenURI, metadataUrl = :metadataUrl, ipfsHash = :ipfsHash, imageURI = :imageURI, imageUrl = :imageUrl",
      ),
      ExpressionAttributeNames: { "#status": "status", "#events": "events" },
      ExpressionAttributeValues: {
        ":status": "mint_submitted",
        ":updatedAt": updatedAt,
        ":mintTransactionId": mintTransactionId ?? "",
        ":mintTransactionHash": mintTransactionHash ?? "",
        ":chainId": chainId ?? 8453,
        ":deedName": deedName ?? "",
        ":contractLanguageVersion": contractLanguageVersion ?? "",
        ":tokenURI": tokenURI ?? "",
        ":metadataUrl": metadataUrl ?? "",
        ":ipfsHash": ipfsHash ?? "",
        ":imageURI": imageURI ?? "",
        ":imageUrl": imageUrl ?? "",
        ":emptyEvents": [],
        ":events": [mintSubmittedEvent],
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return orderFromItem(result.Attributes);
}

export async function getLatestMintOrderForWallet(wallet: string) {
  requireLedger();

  const normalizedWallet = wallet.toLowerCase();
  const claim = await getMintClaim(normalizedWallet);

  if (claim) {
    const claimedOrder = await getMintOrder(claim.orderId);

    if (claimedOrder && isCurrentContractOrder(claimedOrder)) {
      return claimedOrder;
    }
  }

  if (!tableName) {
    const pointedOrderId = localLedger.latestOrdersByWallet.get(normalizedWallet);
    const pointedOrder = pointedOrderId
      ? localLedger.orders.get(pointedOrderId)
      : null;

    if (pointedOrder && isCurrentContractOrder(pointedOrder)) {
      return pointedOrder;
    }

    return (
      [...localLedger.orders.values()]
        .filter(
          (order) =>
            order.wallet === normalizedWallet && isCurrentContractOrder(order),
        )
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .at(0) ?? null
    );
  }

  const pointerResult = await getDocumentClient().send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: latestWalletOrderKey(normalizedWallet) },
    }),
  );
  const orderId =
    typeof pointerResult.Item?.orderId === "string"
      ? pointerResult.Item.orderId
      : null;

  if (!orderId) {
    return null;
  }

  const order = await getMintOrder(orderId);

  if (!order || !isCurrentContractOrder(order)) {
    return null;
  }

  return order;
}

export function buildMintReceiptFromOrder(order: MintOrder) {
  if (order.status !== "mint_submitted") {
    return null;
  }

  return {
    status: "submitted",
    mode: "live",
    chainId: order.chainId ?? 8453,
    contractAddress: order.contractAddress,
    deedName:
      order.deedName ??
      `Certificate of Title for Spiritual Ownership of ${order.publicMark}`,
    contractLanguageVersion: order.contractLanguageVersion,
    transactionId: order.mintTransactionId,
    transactionHash: order.mintTransactionHash,
    tokenURI: order.tokenURI,
    metadataUrl: order.metadataUrl,
    ipfsHash: order.ipfsHash,
    imageURI: order.imageURI,
    imageUrl: order.imageUrl,
    orderId: order.orderId,
  };
}

export function toPublicMintOrder(order: MintOrder) {
  return {
    orderId: order.orderId,
    status: order.status,
    wallet: order.wallet,
    paymentKind: order.paymentKind,
    paymentAmount: order.paymentAmount,
    paymentId: order.paymentId,
    mintTransactionId: order.mintTransactionId,
    mintTransactionHash: order.mintTransactionHash,
    events: order.events ?? [],
  };
}

async function getMintClaim(wallet: string) {
  if (!tableName) {
    return localLedger.mintClaims.get(wallet.toLowerCase()) ?? null;
  }

  const result = await getDocumentClient().send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: walletClaimKey(wallet) },
    }),
  );

  return result.Item ? (result.Item as MintClaim) : null;
}
