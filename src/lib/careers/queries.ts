"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { Career, CareerDetailResponse, CareerListEnvelope, CareerListResponse } from "./types";

export function useCareers(params = { page: 1, limit: 10 }) {
  const { page, limit } = params;

  return useQuery({
    queryKey: ["careers", page, limit],
    queryFn: async (): Promise<CareerListEnvelope> => {
      const r = await api.get<CareerListResponse>("/careers", {
        params: { page, limit },
      });
      return r.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCareerDetail(id?: string) {
  return useQuery({
    queryKey: ["careers", "detail", id],
    enabled: !!id,
    queryFn: async (): Promise<Career> => {
      const r = await api.get<CareerDetailResponse>(`/careers/${id}`);
      return r.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
