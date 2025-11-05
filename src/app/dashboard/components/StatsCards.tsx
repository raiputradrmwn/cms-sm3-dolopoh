"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function StatsCards({
  loading,
  totalNews,
  publishedNews,
  newRegistrations,
  verifiedRegistrations,
}: {
  loading?: boolean;
  totalNews: number;
  publishedNews: number;
  newRegistrations: number;
  verifiedRegistrations: number;
}) {
  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );

  const ratio =
    totalNews > 0 ? Math.round((publishedNews / totalNews) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Total Berita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{totalNews}</div>
          <div className="text-xs text-muted-foreground mt-1">Semua status</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Berita Terbit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{publishedNews}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <Badge variant="secondary">Published</Badge>
            proporsi {ratio}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Pendaftar Baru (7 hari)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{newRegistrations}</div>
          <div className="text-xs text-muted-foreground mt-1">Status BARU</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Total Pendaftar Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{verifiedRegistrations}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total terverifikasi
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
