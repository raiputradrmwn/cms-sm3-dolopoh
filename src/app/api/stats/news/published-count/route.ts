import { proxyGetJson } from "@/app/api/_lib/proxy";

export async function GET(req: Request) {
  return proxyGetJson("/news/stats/published-count", req);
}
