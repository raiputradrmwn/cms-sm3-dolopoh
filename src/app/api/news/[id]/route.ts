// src/app/api/news/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";

const API_BASE = process.env.API_BASE_URL!;

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  if (!id) {
    return NextResponse.json({ message: "Missing news id" }, { status: 400 });
  }

  const token = req.cookies.get("token")?.value;
  const backendUrl = `${API_BASE}/news/${encodeURIComponent(id)}`;

  const r = await fetch(backendUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  if (r.status === 401 || r.status === 403) {
    const resp = NextResponse.json(data, { status: r.status });
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
    return resp;
  }

  return NextResponse.json(data, { status: r.status });
}
function getAuthHeader(req: NextRequest) {
  const fromHeader = req.headers.get("authorization");
  if (fromHeader) return fromHeader;
  const token = req.cookies.get("token")?.value;
  return token ? `Bearer ${token}` : undefined;
}

/** Helper balas dan (jika perlu) hapus cookie saat unauthorized */
async function relay(res: Response) {
  const data = await res.json().catch(() => ({}));
  const next = NextResponse.json(data, { status: res.status });
  if (res.status === 401 || res.status === 403) {
    next.cookies.set("token", "", { path: "/", maxAge: 0 });
  }
  return next;
}


export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  const auth = getAuthHeader(req);
  const ct = req.headers.get("content-type") || "";

  // Mode multipart: rebuild FormData agar boundary benar saat diteruskan
  if (ct.toLowerCase().includes("multipart/form-data")) {
    const inFd = await req.formData();
    const fd = new FormData();
    for (const [k, v] of inFd.entries()) {
      // Jika value kosong, lewati saja
      if (v === null || v === undefined || v === "") continue;
      fd.append(k, v as any);
    }

    const r = await fetch(`${API_BASE}/news/${id}`, {
      method: "PATCH",
      // JANGAN set Content-Type secara manual (biar boundary otomatis)
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
      body: fd,
      cache: "no-store",
    });

    return relay(r);
  }

  // Mode JSON (default)
  const body = await req.json().catch(() => ({}));

  const r = await fetch(`${API_BASE}/news/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return relay(r);
}
