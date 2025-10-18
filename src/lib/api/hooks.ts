import { useQuery, UseQueryOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "./axios";

export function useApiQuery<TData>(
  key: (string | number)[],
  url: string,
  opts?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      // Jika URL mulai dengan "/mock/", ambil langsung dari public/ (tanpa baseURL)
      if (url.startsWith("/mock/")) {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return (await res.json()) as TData;
      }
      // Selain itu, pakai axios instance (baseURL: "/api")
      const res = await api.get<TData>(url);
      return res.data;
    },
    staleTime: 30_000,
    ...opts,
  });
}

// (opsional) mutation tetap sama
export function useApiMutation<TVars = unknown, TRes = unknown>(
  method: "post" | "patch" | "put" | "delete",
  url: string
) {
  return useMutation<TRes, unknown, TVars>({
    mutationFn: async (vars) => {
      const res = await api.request<TRes>({
        url,
        method,
        data: method === "delete" ? undefined : vars,
      });
      return res.data;
    },
  });
}
