import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL!; 

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const token = (await cookies()).get("token")?.value;

    const upstream = await fetch(`${API_BASE}/news`, {
      method: "POST",
      headers:  { Authorization: `Bearer ${token}` },
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
    return NextResponse.json({ message: "Gagal mengirim berita" }, { status: 500 });
  }
}
