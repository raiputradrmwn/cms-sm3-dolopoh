"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  PublishedNewsCountResponse,
  TotalNewsCountResponse,
  RegisteredStudentsCountResponse,
  LastWeekRegisteredStudentsCountResponse,
} from "./types";
import api from "../api/axios";

/** Ambil seluruh angka dashboard dari 4 endpoint terpisah */
export function useStatsOverview() {
  const qTotal = useQuery({
    queryKey: ["stats", "news", "total-count"],
    queryFn: async () => {
      const r = await api.get<TotalNewsCountResponse>("/stats/news/total-count");
      return r.data.data.totalCount;
    },
  });

  const qPublished = useQuery({
    queryKey: ["stats", "news", "published-count"],
    queryFn: async () => {
      const r = await api.get<PublishedNewsCountResponse>("/stats/news/published-count");
      return r.data.data.publishedCount;
    },
  });

  const qRegistered = useQuery({
    queryKey: ["stats", "students", "registered-count"],
    queryFn: async () => {
      const r = await api.get<RegisteredStudentsCountResponse>("/stats/students/registered-count");
      return r.data.data.count;
    },
  });

  const qLastWeek = useQuery({
    queryKey: ["stats", "students", "last-week-registered-count"],
    queryFn: async () => {
      const r = await api.get<LastWeekRegisteredStudentsCountResponse>(
        "/stats/students/last-week-registered-count"
      );
      return r.data.data.count;
    },
  });

  const isFetching =
    qTotal.isFetching || qPublished.isFetching || qRegistered.isFetching || qLastWeek.isFetching;

  return {
    isFetching,
    totalNews: qTotal.data ?? 0,
    publishedNews: qPublished.data ?? 0,
    newRegistrations7d: qLastWeek.data ?? 0,
    verifiedRegistrations7d: qRegistered.data ?? 0, // jika “verified” beda endpoint, ganti di sini
  };
}
