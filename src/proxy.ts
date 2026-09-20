import { NextRequest, NextResponse } from "next/server";

const applicationsUsername = process.env.APPLICATIONS_USERNAME || "allen";
const applicationsPassword = process.env.APPLICATIONS_PASSWORD || "Remote123$";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Basic realm="Wonderhow Applications", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    const username = separator >= 0 ? decoded.slice(0, separator) : decoded;
    const password = separator >= 0 ? decoded.slice(separator + 1) : "";

    if (username === applicationsUsername && password === applicationsPassword) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/applications/:path*"],
};
