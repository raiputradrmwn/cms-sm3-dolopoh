"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationResult } from "@tanstack/react-query";
import type { Method } from "axios";
import  api  from "./axios";


export function useApiQuery<T>(
  key: (string | number)[],
  url: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => (await api.get<T>(url)).data,
    ...options,
  });
}

export function useApiMutation<TBody, TRes>(
  method: Method,
  url: string
): UseMutationResult<TRes, unknown, TBody> {
  return useMutation<TRes, unknown, TBody>({
    mutationFn: async (body: TBody) => (await api.request<TRes>({ url, method, data: body })).data,
  });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (keys: (string | number)[][]) =>
    Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: k })));
}
