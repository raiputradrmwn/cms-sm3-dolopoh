import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // RBAC Protection
  if (req.nextUrl.pathname.startsWith("/dashboard/pendaftaran") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
