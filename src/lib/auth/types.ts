// src/lib/auth/types.ts
export type LoginPayload = { email: string; password: string };

export type RawLoginResponse = {
  meta?: { code?: number; success?: boolean; message?: string };
  data?: { token?: string; role?: string; name?: string; email?: string };
};

export type LoginResponse = { token: string; role?: string; name?: string; email?: string };
