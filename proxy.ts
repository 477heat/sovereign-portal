import { NextRequest, NextResponse } from "next/server";

function adminAuthChallenge() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Basic realm="Sovereign Portal Admin", charset="UTF-8"',
    },
  });
}

function parseBasicAuth(header: string | null) {
  if (!header) {
    return null;
  }

  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return null;
  }

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const adminUser = process.env.ADMIN_BASIC_USER;
  const adminPassword = process.env.ADMIN_BASIC_PASSWORD;

  if (!adminUser || !adminPassword) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { message: "Admin access is not configured." },
        { status: 404 },
      );
    }

    return NextResponse.next();
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    credentials?.username === adminUser &&
    credentials.password === adminPassword
  ) {
    return NextResponse.next();
  }

  return adminAuthChallenge();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
