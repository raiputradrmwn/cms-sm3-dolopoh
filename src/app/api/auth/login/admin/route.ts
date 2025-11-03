import { proxyJson } from "@/app/api/_lib/proxy";

export async function POST(req: Request) {
  return proxyJson("/auth/login/admin", req, { method: "POST" });
}
