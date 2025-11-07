// src/app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";

function getAuthHeader(req: NextRequest) {
  // pakai Authorization dari client bila ada; fallback ke cookie "token"
  const auth = req.headers.get("authorization");
  if (auth) return auth;
  const token = req.cookies.get("token")?.value;
  return token ? `Bearer ${token}` : "";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ⬅️ perbedaan penting
  const r = await fetch(`${API_BASE}/news/${id}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(req),
      "Content-Type": "application/json",
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = getAuthHeader(req);

  const contentType = req.headers.get("content-type") || "";

  // Jika datang sebagai multipart/form-data (untuk upload foto)
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const r = await fetch(`${API_BASE}/news/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: auth,
        // NOTE: JANGAN set Content-Type manual untuk multipart
      },
      body: form,
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  }


  const body = await req.json().catch(() => ({}));
  const r = await fetch(`${API_BASE}/news/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));

  if (r.status === 401 || r.status === 403) {
    const resp = NextResponse.json(data, { status: r.status });
    // opsional: bersihkan cookie token kalau unauthorized
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
    return resp;
  }

  return NextResponse.json(data, { status: r.status });
}
