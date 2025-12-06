"use client";

import * as React from "react";
import { useRegistrationsPerMajor } from "@/lib/students/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationsSummary } from "./RegistrationsSummary";

export default function RegistrationsSummaryContainer() {
  const { data, isFetching } = useRegistrationsPerMajor({ page: 1, limit: 10 });

  if (isFetching) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Ringkasan Pendaftar per Jurusan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return <RegistrationsSummary data={data ?? []} />;
}
