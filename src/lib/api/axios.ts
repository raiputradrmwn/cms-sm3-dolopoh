import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api", // FE hanya call /api → Next API Route
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // nama cookie yang kita pakai
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "Terjadi kesalahan jaringan";
    return Promise.reject(new Error(msg));
  }
);

export default api;
