import "server-only";

import { NextRequest, NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

declare global {
  var portalRateLimitBuckets: Map<string, RateLimitBucket> | undefined;
}

const buckets =
  globalThis.portalRateLimitBuckets ??
  (globalThis.portalRateLimitBuckets = new Map<string, RateLimitBucket>());

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;

  return {
    ok: true,
    remaining: Math.max(limit - current.count, 0),
    retryAfter: 0,
  };
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    {
      message: "Too many requests. Please wait a moment and try again.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    },
  );
}
