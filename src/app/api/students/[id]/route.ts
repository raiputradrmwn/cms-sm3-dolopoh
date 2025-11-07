// src/app/api/students/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL!; // contoh: https://api.smk3dolopo.id

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("token")?.value;
  const url = `${API_BASE}/students/${params.id}`;

  const r = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  // Jika token invalid/expired → hapus cookie & teruskan pesan backend
  if (r.status === 401 || r.status === 403) {
    const resp = NextResponse.json(data, { status: r.status });
    resp.cookies.set("token", "", { path: "/", maxAge: 0 });
    return resp;
  }

  return NextResponse.json(data, { status: r.status });
}
