import { proxyGetJson } from "@/app/api/_lib/proxy";

export async function GET(req: Request) {
  return proxyGetJson("/students/stats/registered-count", req);
}
