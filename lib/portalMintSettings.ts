import "server-only";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  type NativeAttributeValue,
} from "@aws-sdk/lib-dynamodb";

const tableName = process.env.PORTAL_LEDGER_TABLE;
const SETTINGS_KEY = "CONFIG#portal-mint-settings";
const DEFAULT_PAYMENT_AMOUNT = process.env.PORTAL_PAYMENT_AMOUNT ??
  process.env.NEXT_PUBLIC_PORTAL_PAYMENT_AMOUNT ??
  "5.00";

export type PortalMintSettings = {
  paymentAmount: string;
  updatedAt?: string;
  updatedBy?: string;
};

declare global {
  var portalMintSettings: PortalMintSettings | undefined;
}

let documentClient: DynamoDBDocumentClient | null = null;

function getDocumentClient() {
  if (!documentClient) {
    documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  return documentClient;
}

export function parsePaymentUnits(amount: string, decimals: number) {
  const trimmed = amount.trim();

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("Token decimals must be a non-negative integer.");
  }

  if (!trimmed.match(/^\d+(\.\d+)?$/)) {
    throw new Error("Mint price must be a positive decimal amount.");
  }

  const amountParts = trimmed.split(".");
  const whole = amountParts[0] || "0";
  const rawFraction = amountParts[1] ?? "";

  if (rawFraction.length > decimals) {
    throw new Error(`Mint price supports at most ${decimals} decimal places.`);
  }

  const fraction = rawFraction.padEnd(decimals, "0");
  const units = BigInt(`${whole}${fraction}`);

  if (units <= BigInt(0)) {
    throw new Error("Mint price must be greater than zero.");
  }

  return units;
}

function settingsFromItem(item: Record<string, NativeAttributeValue> | undefined) {
  if (!item || item.entity !== "portal-mint-settings") {
    return null;
  }

  return {
    paymentAmount:
      typeof item.paymentAmount === "string"
        ? item.paymentAmount
        : DEFAULT_PAYMENT_AMOUNT,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
    updatedBy: typeof item.updatedBy === "string" ? item.updatedBy : undefined,
  } satisfies PortalMintSettings;
}

export async function getPortalMintSettings() {
  if (!tableName) {
    return (
      globalThis.portalMintSettings ?? {
        paymentAmount: DEFAULT_PAYMENT_AMOUNT,
      }
    );
  }

  const result = await getDocumentClient().send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: SETTINGS_KEY },
    }),
  );

  return (
    settingsFromItem(result.Item) ?? {
      paymentAmount: DEFAULT_PAYMENT_AMOUNT,
    }
  );
}

export async function updatePortalMintSettings({
  paymentAmount,
  updatedBy,
}: {
  paymentAmount: string;
  updatedBy?: string;
}) {
  const updatedAt = new Date().toISOString();
  const nextSettings = {
    paymentAmount: paymentAmount.trim(),
    updatedAt,
    updatedBy,
  } satisfies PortalMintSettings;

  if (!tableName) {
    globalThis.portalMintSettings = nextSettings;
    return nextSettings;
  }

  await getDocumentClient().send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: SETTINGS_KEY,
        entity: "portal-mint-settings",
        ...nextSettings,
      },
    }),
  );

  return nextSettings;
}

export async function ensurePortalMintSettings() {
  if (!tableName) {
    return;
  }

  await getDocumentClient().send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: SETTINGS_KEY },
      UpdateExpression:
        "SET entity = if_not_exists(entity, :entity), paymentAmount = if_not_exists(paymentAmount, :paymentAmount)",
      ExpressionAttributeValues: {
        ":entity": "portal-mint-settings",
        ":paymentAmount": DEFAULT_PAYMENT_AMOUNT,
      },
    }),
  );
}
