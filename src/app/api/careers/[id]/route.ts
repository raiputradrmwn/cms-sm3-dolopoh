import { NextResponse, NextRequest } from "next/server";

const API_BASE = process.env.API_BASE_URL!;

function getAuthHeader(req: NextRequest) {
  const fromHeader = req.headers.get("authorization");
  if (fromHeader) return fromHeader;
  const token = req.cookies.get("token")?.value;
  return token ? `Bearer ${token}` : undefined;
}

async function relay(res: Response) {
  const data = await res.json().catch(() => ({}));
  const next = NextResponse.json(data, { status: res.status });
  if (res.status === 401 || res.status === 403) {
    next.cookies.set("token", "", { path: "/", maxAge: 0 });
  }
  return next;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  const auth = getAuthHeader(req);
  const r = await fetch(`${API_BASE}/careers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    cache: "no-store",
  });
  return relay(r);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  const auth = getAuthHeader(req);
  const ct = req.headers.get("content-type") || "";

  if (ct.toLowerCase().includes("multipart/form-data")) {
    const inFd = await req.formData();
    const fd = new FormData();
    for (const [k, v] of inFd.entries()) {
      // Filter out empty values if necessary, or just pass through
      if (v === null || v === undefined) continue;
      fd.append(k, v);
    }
    const r = await fetch(`${API_BASE}/careers/${id}`, {
      method: "PATCH",
      headers: { ...(auth ? { Authorization: auth } : {}) },
      body: fd,
      cache: "no-store",
    });
    return relay(r);
  }

  const body = await req.json().catch(() => ({}));
  const r = await fetch(`${API_BASE}/careers/${id}`, {
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  const auth = getAuthHeader(req);
  const r = await fetch(`${API_BASE}/careers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    cache: "no-store",
  });
  return relay(r);
}
