"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { NewsDetail, NewsDetailResponse, NewsListResponse, NewsRow, RawNewsItem } from "./types";

function mapToRow(n: RawNewsItem): NewsRow {
  return {
    id: n.id,
    title: n.title,
    headline: n.headline,
    photo: n.photo ?? null,
    isPublished: n.status === "PUBLISHED",
    createdAt: n.created_at,
    updatedAt: n.updated_at,
  };
}

/** GET /api/news/published?page=&limit= (proxy ke backend /news/published) */
export function useRecentPublishedNews(params = { page: 1, limit: 5 }) {
  const { page, limit } = params;

  return useQuery({
    queryKey: ["news", "published", page, limit],
    queryFn: async () => {
      const r = await api.get<NewsListResponse>("/news/published", {
        params: { page, limit },
      });
      return r.data;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    select: (resp) => (resp?.data?.data ?? []).map(mapToRow),
  });
}
export function useNewsDetail(id?: string) {
  return useQuery({
    queryKey: ["news", "detail", id],
    enabled: !!id,
    queryFn: async (): Promise<NewsDetail> => {
      const r = await api.get<NewsDetailResponse>(`/news/${id}`);
      return r.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}