import "server-only";

import { randomUUID } from "node:crypto";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type MintOrderStatus =
  | "pending_payment"
  | "paid"
  | "minting"
  | "mint_submitted";

export type MintOrder = {
  orderId: string;
  wallet: string;
  publicMark: string;
  status: MintOrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentId?: string;
  paymentTransactionHash?: string;
  mintTransactionId?: string;
  mintTransactionHash?: string;
};

type MintClaim = {
  orderId: string;
  wallet: string;
  createdAt: string;
};

type LocalLedger = {
  orders: Map<string, MintOrder>;
  mintClaims: Map<string, MintClaim>;
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
  return `MINTED_WALLET#${wallet.toLowerCase()}`;
}

function orderFromItem(value: Record<string, unknown> | undefined) {
  if (!value || value.entity !== "mint-order") {
    return null;
  }

  return value as MintOrder;
}

export async function createMintOrder({
  wallet,
  publicMark,
}: {
  wallet: string;
  publicMark: string;
}) {
  requireLedger();

  const now = new Date().toISOString();
  const order: MintOrder = {
    orderId: randomUUID(),
    wallet: wallet.toLowerCase(),
    publicMark,
    status: "pending_payment",
    createdAt: now,
    updatedAt: now,
  };

  if (!tableName) {
    if (localLedger.mintClaims.has(order.wallet)) {
      throw new Error("This wallet already has a submitted mint.");
    }

    localLedger.orders.set(order.orderId, order);
    return order;
  }

  const existingClaim = await getMintClaim(order.wallet);
  if (existingClaim) {
    throw new Error("This wallet already has a submitted mint.");
  }

  await getDocumentClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: orderKey(order.orderId),
        entity: "mint-order",
        ...order,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    }),
  );

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
}: {
  orderId: string;
  paymentId: string;
  paymentTransactionHash?: string;
}) {
  requireLedger();

  const current = await getMintOrder(orderId);
  if (!current) {
    return null;
  }

  if (current.status === "minting" || current.status === "mint_submitted") {
    return current;
  }

  const updatedAt = new Date().toISOString();

  if (!tableName) {
    const nextOrder: MintOrder = {
      ...current,
      status: "paid",
      updatedAt,
      paymentId,
      paymentTransactionHash,
    };
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression:
        "SET #status = :status, updatedAt = :updatedAt, paymentId = :paymentId, paymentTransactionHash = :paymentTransactionHash",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "paid",
        ":updatedAt": updatedAt,
        ":paymentId": paymentId,
        ":paymentTransactionHash": paymentTransactionHash ?? "",
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

  if (order.publicMark !== publicMark) {
    throw new Error("Mint order does not match this public covenant mark.");
  }

  if (order.status !== "paid") {
    throw new Error("Mint order is not paid yet.");
  }

  const now = new Date().toISOString();
  const claim: MintClaim = {
    orderId,
    wallet: normalizedWallet,
    createdAt: now,
  };

  if (!tableName) {
    if (localLedger.mintClaims.has(normalizedWallet)) {
      throw new Error("This wallet already has a submitted mint.");
    }

    localLedger.mintClaims.set(normalizedWallet, claim);
    const nextOrder: MintOrder = { ...order, status: "minting", updatedAt: now };
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
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "minting",
        ":updatedAt": now,
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

  if (!tableName) {
    localLedger.mintClaims.delete(normalizedWallet);
    const nextOrder: MintOrder = { ...order, status: "paid", updatedAt: now };
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
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "paid",
        ":updatedAt": now,
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
}: {
  orderId: string;
  mintTransactionId?: string;
  mintTransactionHash?: string;
}) {
  requireLedger();

  const order = await getMintOrder(orderId);
  if (!order) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  if (!tableName) {
    const nextOrder: MintOrder = {
      ...order,
      status: "mint_submitted",
      updatedAt,
      mintTransactionId,
      mintTransactionHash,
    };
    localLedger.orders.set(orderId, nextOrder);
    return nextOrder;
  }

  const result = await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: orderKey(orderId) },
      UpdateExpression:
        "SET #status = :status, updatedAt = :updatedAt, mintTransactionId = :mintTransactionId, mintTransactionHash = :mintTransactionHash",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "mint_submitted",
        ":updatedAt": updatedAt,
        ":mintTransactionId": mintTransactionId ?? "",
        ":mintTransactionHash": mintTransactionHash ?? "",
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return orderFromItem(result.Attributes);
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
