"use client";

import * as React from "react";
import { useStatsOverview } from "@/lib/stats/queries";
import { StatsCards } from "./StatsCards";

export function StatsCardsContainer() {
  const {
    isFetching,
    totalNews,
    publishedNews,
    newRegistrations7d,
    verifiedRegistrations7d,
  } = useStatsOverview();

  return (
    <StatsCards
      loading={isFetching}
      totalNews={totalNews}
      publishedNews={publishedNews}
      newRegistrations={newRegistrations7d}
      verifiedRegistrations={verifiedRegistrations7d}
    />
  );
}
