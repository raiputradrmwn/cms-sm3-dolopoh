import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL!; // contoh: https://api.smk3dolopo.id

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.toString(); // page=1&limit=10
  const backendUrl = `${API_BASE}/news/published${search ? `?${search}` : ""}`;

  const auth = req.headers.get("authorization") || "";

  const r = await fetch(backendUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  // kalau token invalid, sekalian bersihkan cookie (opsional)
  if (r.status === 401 || r.status === 403) {
    const resp = NextResponse.json(data, { status: r.status });
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
    return resp;
  }

  return NextResponse.json(data, { status: r.status });
}
