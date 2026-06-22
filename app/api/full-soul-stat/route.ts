import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BirthLocation = {
  city?: string;
  country?: string;
  countryCode?: string;
  label?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  region?: string;
  timeZone?: string;
  verified?: boolean;
};

type FullSoulStatRequest = {
  birthLocation?: BirthLocation;
  birthTime?: string;
  dob?: string;
  firstName?: string;
  lastName?: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isBirthTime(value: string) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(value);
}

function isFiniteCoordinate(value: unknown, minimum: number, maximum: number) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function looksLikeFullSoulStat(value: unknown) {
  return (
    isObject(value) &&
    value.schema_version === "full_soul_stat.v1" &&
    isObject(value.full_soul_stat) &&
    isObject(value.natal_imprint) &&
    isObject(value.pillar_accord)
  );
}

function validatePayload(payload: FullSoulStatRequest) {
  const firstName = cleanText(payload.firstName);
  const lastName = cleanText(payload.lastName);
  const dob = cleanText(payload.dob);
  const birthTime = cleanText(payload.birthTime);
  const birthLocation = payload.birthLocation;

  if (!firstName || !lastName || !dob || !birthTime) {
    throw new Error("First name, last name, DOB, and birth time are required.");
  }

  if (!isIsoDate(dob)) {
    throw new Error("DOB must use YYYY-MM-DD format.");
  }

  if (!isBirthTime(birthTime)) {
    throw new Error("Birth time must use HH:MM format.");
  }

  if (!birthLocation || typeof birthLocation !== "object") {
    throw new Error("A verified birth location is required.");
  }

  if (!birthLocation.verified) {
    throw new Error("Birth location must be selected from verified results.");
  }

  if (!cleanText(birthLocation.label) || !cleanText(birthLocation.timeZone)) {
    throw new Error("Birth location label and timezone are required.");
  }

  if (!isFiniteCoordinate(birthLocation.latitude, -90, 90)) {
    throw new Error("Birth location latitude is invalid.");
  }

  if (!isFiniteCoordinate(birthLocation.longitude, -180, 180)) {
    throw new Error("Birth location longitude is invalid.");
  }

  return {
    birthLocation,
    birthTime,
    dob,
    firstName,
    lastName,
  };
}

async function requestFullSoulStat(payload: ReturnType<typeof validatePayload>) {
  const engineUrl = process.env.PORTAL_ENGINE_URL;

  if (!engineUrl) {
    throw new Error("PORTAL_ENGINE_URL is not configured on the server.");
  }

  const response = await fetch(engineUrl, {
    body: JSON.stringify({
      firstName: payload.firstName,
      lastName: payload.lastName,
      dob: payload.dob,
      output: "full_soul_stat",
      attributeProfile: "genesis",
      statTable: "genesis_engine",
      engineBirthInput: {
        schema_version: "engine_birth_input.v1",
        dob: payload.dob,
        birth_time: payload.birthTime,
        birth_location: {
          city: payload.birthLocation.city,
          country: payload.birthLocation.country,
          countryCode: payload.birthLocation.countryCode,
          label: payload.birthLocation.label,
          latitude: payload.birthLocation.latitude,
          longitude: payload.birthLocation.longitude,
          placeId: payload.birthLocation.placeId,
          region: payload.birthLocation.region,
          timeZone: payload.birthLocation.timeZone,
          verified: payload.birthLocation.verified,
        },
      },
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error("The Engine Full Soul Stat request failed.");
  }

  if (!looksLikeFullSoulStat(data)) {
    throw new Error(
      "The configured Engine endpoint has not deployed Full Soul Stat support yet.",
    );
  }

  return data;
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit({
    key: `full-soul-stat:${getClientIp(request)}`,
    limit: 24,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.ok) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  let payload: FullSoulStatRequest;

  try {
    payload = (await request.json()) as FullSoulStatRequest;
  } catch {
    return NextResponse.json(
      { message: "Full Soul Stat request must be valid JSON." },
      { status: 400 },
    );
  }

  try {
    const validPayload = validatePayload(payload);
    const fullSoulStat = await requestFullSoulStat(validPayload);

    return NextResponse.json({ fullSoulStat });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "The Full Soul Stat request failed.",
      },
      { status: 502 },
    );
  }
}
