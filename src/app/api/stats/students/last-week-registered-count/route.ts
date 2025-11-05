import { proxyGetJson } from "@/app/api/_lib/proxy";

export async function GET(req: Request) {
  return proxyGetJson("/students/stats/last-week-registered-count", req);
}
