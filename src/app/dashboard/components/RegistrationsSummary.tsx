// src/components/dashboard/RegistrationsSummary.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bike, Palette, Shirt, GraduationCap } from "lucide-react";

type Item = { major: string; count: number };

const M_TKRO = "Teknik Kendaraan Ringan Otomotif";
const M_DKVK = "Desain Komunikasi Visual/Komputer";
const M_TBSM = "Teknik Bisnis Sepeda Motor";
const M_TB   = "Tata Busana";

const iconByMajor: Record<string, React.ElementType> = {
  [M_TKRO]: Car,
  [M_DKVK]: Palette,
  [M_TBSM]: Bike,
  [M_TB]: Shirt,
};

const colorByMajor: Record<string, { bar: string; chip: string; icon: string }> = {
  [M_TKRO]: { bar: "bg-sky-600",     chip: "bg-sky-100 text-sky-800",     icon: "text-sky-600" },
  [M_DKVK]: { bar: "bg-violet-600",  chip: "bg-violet-100 text-violet-800", icon: "text-violet-600" },
  [M_TBSM]: { bar: "bg-emerald-600", chip: "bg-emerald-100 text-emerald-800", icon: "text-emerald-600" },
  [M_TB]:   { bar: "bg-rose-600",    chip: "bg-rose-100 text-rose-800",   icon: "text-rose-600" },
};

export function RegistrationsSummary({ data }: { data: Item[] }) {
  const total = React.useMemo(
    () => data.reduce((acc, d) => acc + (Number(d.count) || 0), 0),
    [data]
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Ringkasan Pendaftar per Jurusan</CardTitle>
        <Badge variant="secondary" className="text-xs">Total {total}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.length === 0 && (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            Belum ada data pendaftar per jurusan.
          </div>
        )}

        {data.map((m) => {
          const pct = total > 0 ? Math.round(((Number(m.count) || 0) / total) * 100) : 0;
          const Icon = iconByMajor[m.major] ?? GraduationCap;
          const color = colorByMajor[m.major] ?? {
            bar: "bg-primary",
            chip: "bg-primary/10 text-primary",
            icon: "text-primary",
          };

          return (
            <div
              key={m.major}
              className="rounded-xl border p-3 hover:bg-secondary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-lg bg-secondary p-2 ${color.icon}`}>
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate font-medium" title={m.major}>
                      {m.major}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={color.chip}>{pct}%</Badge>
                      <Badge variant="secondary">{m.count}</Badge>
                    </div>
                  </div>

                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div className={`h-2 rounded-full ${color.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
