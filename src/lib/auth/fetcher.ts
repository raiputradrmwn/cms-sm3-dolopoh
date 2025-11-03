import type { LoginPayload, LoginResponse, RawLoginResponse } from "./types";

/** FE → Next API → NestJS, kembalikan { token } */
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let raw: RawLoginResponse = {};
  try { raw = text ? (JSON.parse(text) as RawLoginResponse) : {}; } catch {}

  if (!res.ok) {
    const msg = (raw as any)?.message || raw?.meta?.message || "Login gagal";
    throw new Error(msg);
  }

  const token = raw.data?.token || raw.access_token || raw.token;
  if (!token) throw new Error("Token tidak ditemukan pada respons login");

  return { token, user: raw.user ?? null };
}
