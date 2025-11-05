// src/components/dashboard/RegistrationsRecentTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, XCircle, IdCard, User } from "lucide-react";

/* ============ Types dari backend & UI ============ */
type Student = {
  id: string;
  name: string;
  major: string;
  created_at: string;
  updated_at: string;
};

type StudentsListResponse = {
  meta: { code: number; success: boolean; message: string };
  data: {
    data: Student[];
    pagination: {
      itemCount: number;
      limit: number;
      pageCount: number;
      page: number;
      slNo: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      prevPage: number | null;
      nextPage: number | null;
    };
  };
};

type RegistrationStatus = "DIVERIFIKASI" | "BARU" | "DITOLAK";

type RegistrationItem = {
  id: string;
  regNo: string;
  name: string;
  nisn: string;
  major: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
};

/* ================== Utils ================== */
function toRegNo(id: string) {
  const tail = id.slice(-6).toUpperCase();
  return `STU-${tail}`;
}

function mapStudentsToRows(list: Student[]): RegistrationItem[] {
  return list.map((s) => ({
    id: s.id,
    regNo: toRegNo(s.id),
    name: s.name,
    nisn: "—",              // backend belum punya NISN → ganti jika sudah ada
    major: s.major,
    status: "BARU",         // fallback sampai backend kirim status
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));
}

function sortLatest<T extends { createdAt?: string; created_at?: string }>(arr: T[]) {
  return [...arr].sort(
    (a, b) =>
      +new Date((b.createdAt ?? b.created_at) || 0) -
      +new Date((a.createdAt ?? a.created_at) || 0)
  );
}

/* ============ Komponen utama (panggil API yang tadi) ============ */
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

  const renderStatusBadge = (status: RegistrationStatus) => {
    if (status === "DIVERIFIKASI") {
      return (
        <span className="inline-flex items-center gap-1.5 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <Badge className="bg-green-600 text-white hover:bg-green-600">DIVERIFIKASI</Badge>
        </span>
      );
    }
    if (status === "DITOLAK") {
      return (
        <span className="inline-flex items-center gap-1.5 text-destructive">
          <XCircle className="h-4 w-4" />
          <Badge variant="destructive">DITOLAK</Badge>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-primary">
        <Clock className="h-4 w-4" />
        <Badge variant="secondary">BARU</Badge>
      </span>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Pendaftar Terbaru</CardTitle>
          <p className="text-sm text-muted-foreground">
            5 pendaftar terakhir • klik No Daftar untuk kelola
          </p>
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
                <TableHead className="w-[170px]">No Daftar</TableHead>
                <TableHead className="min-w-[220px]">Nama</TableHead>
                <TableHead className="w-[120px] text-center">NISN</TableHead>
                <TableHead className="w-[160px] text-center">Jurusan</TableHead>
                <TableHead className="w-[200px] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetching && items.length === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-[60%]" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-5 w-28 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {items.map((r) => (
                <TableRow
                  key={r.id}
                  className="odd:bg-background even:bg-muted/30 hover:bg-secondary/50 transition-colors"
                >
                  <TableCell className="p-4">
                    <Link
                      href="/dashboard/pendaftaran"
                      className="font-medium hover:underline inline-flex items-center gap-2"
                      title={`Kelola ${r.regNo}`}
                    >
                      <IdCard className="h-4 w-4 text-primary" />
                      {r.regNo}
                    </Link>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="inline-flex items-center gap-2 truncate">
                      <User className="h-4 w-4 text-primary/70" />
                      <span className="truncate">{r.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center p-4">{r.nisn}</TableCell>

                  <TableCell className="text-center p-4">
                    <Badge variant="secondary">{r.major}</Badge>
                  </TableCell>

                  <TableCell className="text-center p-4">
                    {renderStatusBadge(r.status)}
                  </TableCell>
                </TableRow>
              ))}

              {!isFetching && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
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
