// src/components/dashboard/RegistrationsRecentTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IdCard, User, Clock } from "lucide-react";
import { RegistrationItem, StudentsListResponse } from "@/lib/students/types";
import { mapStudentsToRows, sortLatest } from "@/lib/students/utils";

export function RegistrationsRecentTable() {
  // pakai proxy /api/students (anti-CORS, dengan Bearer dari axios interceptor)
  const { data, isFetching } = useApiQuery<StudentsListResponse>(
    ["students", "recent", 1, 10],
    "/students?page=1&limit=10"
  );

  const items: RegistrationItem[] = React.useMemo(() => {
    const raw = data?.data?.data ?? [];
    const rows = mapStudentsToRows(raw);
    return sortLatest(rows).slice(0, 5);
  }, [data]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Pendaftar Terbaru</CardTitle>
          <div className="text-sm text-muted-foreground">
            5 pendaftar terakhir • klik No Daftar untuk kelola
          </div>
        </div>
        <Link href="/dashboard/pendaftaran" className="text-sm underline-offset-4 hover:underline">
          Kelola
        </Link>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table className="text-sm">
            <TableHeader className="sticky top-0 bg-background">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead className="min-w-[220px]">Nama</TableHead>
                <TableHead className="w-[180px]">Asal Sekolah</TableHead>
                <TableHead className="w-[160px] text-center">Jurusan</TableHead>
                <TableHead className="w-[220px] text-center">Didaftarkan</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetching && items.length === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-4 w-36 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {items.map((r, index) => (
                <TableRow
                  key={r.id}
                  className="odd:bg-background even:bg-muted/30 hover:bg-secondary/50 transition-colors"
                >
                  <TableCell className="p-4 font-medium">
                    {index + 1}
                  </TableCell>

                  <TableCell className="p-4">
                    <Link
                      href="/dashboard/pendaftaran"
                      className="inline-flex items-center gap-2 truncate font-medium hover:underline"
                      title={`Kelola ${r.name}`}
                    >
                      <User className="h-4 w-4 text-primary/70" />
                      <span className="truncate">{r.name}</span>
                    </Link>
                  </TableCell>

                  <TableCell className="p-4">
                    <span className="truncate text-muted-foreground">{r.fromSchool}</span>
                  </TableCell>

                  <TableCell className="text-center p-4">
                    <Badge variant="secondary">{r.major}</Badge>
                  </TableCell>

                  <TableCell className="text-center p-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}

              {!isFetching && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                    Belum ada pendaftar.
                    <br />
                    <span className="text-xs">Data akan muncul otomatis saat ada pendaftar baru.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
