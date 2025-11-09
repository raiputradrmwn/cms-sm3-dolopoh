import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const base = process.env.API_BASE_URL;
  if (!base) {
    return NextResponse.json({ message: "API_BASE_URL belum di-set" }, { status: 500 });
  }

  const src = new URL(req.url);
  const target = new URL(base + "/students");
  target.search = src.search;

  const token = (await cookies()).get("token")?.value;
  const auth = 'Bearer ' + token;

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message || data?.meta?.message || "Gagal memuat students" },
      { status: upstream.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
