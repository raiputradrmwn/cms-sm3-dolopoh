import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || undefined;
  const base = process.env.API_BASE_URL!;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };

  const [total, published, registered, lastWeek] = await Promise.all([
    fetch(`${base}/news/stats/total-count`, { headers, cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/news/stats/published-count`, { headers, cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/students/stats/registered-count`, { headers, cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/students/stats/last-week-registered-count`, { headers, cache: "no-store" }).then(r => r.json()),
  ]).catch(() => [null, null, null, null]);

  return NextResponse.json({
    news: {
      total: total ?? 0,
      published: published ?? 0,
    },
    students: {
      registered: registered ?? 0,
      lastWeek: lastWeek ?? 0,
    },
  });
}
