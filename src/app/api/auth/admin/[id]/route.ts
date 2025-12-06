import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.API_BASE_URL;
  const target = new URL(`${base}/auth/admin/${id}`);
  
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

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.API_BASE_URL;
  const target = new URL(`${base}/auth/admin/${id}`);
  
  const token = (await cookies()).get("token")?.value;
  const auth = 'Bearer ' + token;
  const body = await req.json();

  const upstream = await fetch(target.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.API_BASE_URL;
  const target = new URL(`${base}/auth/admin/${id}`);
  
  const token = (await cookies()).get("token")?.value;
  const auth = 'Bearer ' + token;

  const upstream = await fetch(target.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    cache: "no-store",
  });

  // DELETE usually returns 204 or empty body
  let data = null;
  const text = await upstream.text();
  if (text) data = JSON.parse(text);

  return NextResponse.json(data, { status: upstream.status });
}
