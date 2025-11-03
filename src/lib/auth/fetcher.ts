// src/lib/auth/fetcher.ts
import type { LoginPayload, RawLoginResponse, LoginResponse } from "./types";

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let raw: RawLoginResponse = {};
  try { raw = text ? JSON.parse(text) as RawLoginResponse : {}; } catch {}

  if (!res.ok) {
    throw new Error(raw?.meta?.message || "Login gagal");
  }

  const token = raw.data?.token;
  if (!token) throw new Error("Token tidak ditemukan");

  return { token };
}
