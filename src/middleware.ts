// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  const exp = decodeJwtExp(token);
  if (exp && exp * 1000 < Date.now()) {
    const res = NextResponse.redirect(new URL("/", req.url));
    // hapus token di cookie
    res.cookies.set("token", "", { path: "/", maxAge: 0 });
    return res;
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
