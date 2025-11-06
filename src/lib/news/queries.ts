"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { NewsDetailResponse, NewsItem, NewsListResponse, NewsRow, RawNewsItem } from "./types";

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
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (resp) => (resp?.data?.data ?? []).map(mapToRow),
  });
}
export function useNewsById(id: string | undefined) {
  return useQuery({
    queryKey: ["news", "detail", id],
    enabled: Boolean(id),
    queryFn: async (): Promise<NewsItem> => {
      const r = await api.get<NewsDetailResponse>(`/news/${id}`);
      return r.data.data;
    },
  });
}