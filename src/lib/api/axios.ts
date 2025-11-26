import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api", 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    // Jika 401 Unauthorized -> Token expired / tidak valid
    if (e.response?.status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "Terjadi kesalahan jaringan";
    return Promise.reject(new Error(msg));
  }
);

export default api;
