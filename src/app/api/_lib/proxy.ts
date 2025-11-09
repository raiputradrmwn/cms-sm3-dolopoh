import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL;

type Opts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  forwardQuery?: boolean;
};
type GetOpts = { forwardQuery?: boolean };

async function relay(upstream: Response) {
  const text = await upstream.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  const resp = NextResponse.json(
    upstream.ok ? data : { message: data?.message || data?.error || "Request gagal" },
    { status: upstream.ok ? 200 : upstream.status }
  );

  if (upstream.status === 401 || upstream.status === 403) {
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
  }
  return resp;
}

export async function proxyJson(path: string, req: Request, opts: Opts = {}) {
  if (!API_BASE) return NextResponse.json({ message: "API_BASE_URL belum di-set" }, { status: 500 });

  const method = opts.method ?? "POST";
  const hasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const body = hasBody ? await req.clone().text() : undefined;

  const src = new URL(req.url);
  const target = new URL(API_BASE + path);
  if (opts.forwardQuery) target.search = src.search;

  const upstream = await fetch(target.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  return relay(upstream);
}

export async function proxyGetJson(path: string, req: Request, opts: GetOpts = {}) {
  if (!API_BASE) return NextResponse.json({ message: "API_BASE_URL belum di-set" }, { status: 500 });

  const src = new URL(req.url);
  const target = new URL(API_BASE + path);
  if (opts.forwardQuery) target.search = src.search;

  const auth = req.headers.get("authorization") || (await cookies()).get("token")?.value
    ? `Bearer ${(await cookies()).get("token")?.value}`
    : undefined;

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    cache: "no-store",
  });

  return relay(upstream);
}