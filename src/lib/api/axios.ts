import axios from "axios";

// NOTE:
// - Untuk hit ke Route Handlers Nest-proxy → pakai path "auth/me", "news", dst (baseURL "/api").
// - Untuk file JSON dummy di /public/mock → pakai path ABSOLUTE "/mock/xxx.json" (tetap jalan).
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// (opsional) interceptor refresh token bisa kamu tambahkan nanti di sini.
