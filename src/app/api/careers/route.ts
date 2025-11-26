import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const token = (await cookies()).get("token")?.value;

  const upstream = await fetch(`${API_BASE}/careers?page=${page}&limit=${limit}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({}));

  if (upstream.status === 401 || upstream.status === 403) {
    const resp = NextResponse.json(data, { status: upstream.status });
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
    return resp;
  }

  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const token = (await cookies()).get("token")?.value;

    const upstream = await fetch(`${API_BASE}/careers`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await upstream.json().catch(() => ({}));

    if (upstream.status === 401 || upstream.status === 403) {
      const resp = NextResponse.json(data, { status: upstream.status });
      resp.cookies.set("token", "", { path: "/", maxAge: 0 });
      return resp;
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Gagal menyimpan karir" }, { status: 500 });
  }
}
