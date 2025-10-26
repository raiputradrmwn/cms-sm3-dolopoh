// src/components/dashboard/RegistrationsRecentTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, XCircle, IdCard, User } from "lucide-react";

// ===== Types =====
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

type RegistrationResponse = {
  data: RegistrationItem[];
  total: number;
  page: number;
  limit: number;
  new7d?: number;
  verified7d?: number;
};

function StatusBadge({ status }: { status: RegistrationStatus }) {
  if (status === "DIVERIFIKASI") {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <Badge className="bg-green-600 text-white hover:bg-green-600">
          DIVERIFIKASI
        </Badge>
      </span>
    );
  }
  if (status === "BARU") {
    return (
      <span className="inline-flex items-center gap-1.5 text-primary">
        <Clock className="h-4 w-4" />
        <Badge variant="secondary">BARU</Badge>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-destructive">
      <XCircle className="h-4 w-4" />
      <Badge variant="destructive">DITOLAK</Badge>
    </span>
  );
}

export function RegistrationsRecentTable() {
  const { data, isFetching } = useApiQuery<RegistrationResponse>(
    ["registrations", "recent"],
    "/mock/registrations.json"
  );

  const all: RegistrationItem[] = data?.data ?? [];
  const items: RegistrationItem[] = React.useMemo(() => {
    const sorted = [...all].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    return sorted.slice(0, 5);
  }, [all]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Pendaftar Terbaru</CardTitle>
          <p className="text-sm text-muted-foreground">
            5 pendaftar terakhir • klik No Daftar untuk kelola
          </p>
        </div>
        <Link
          href="/dashboard/pendaftaran"
          className="text-sm underline-offset-4 hover:underline"
        >
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
              {/* Skeleton saat loading */}
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

              {/* Data rows */}
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
                    <StatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty state */}
              {!isFetching && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Belum ada pendaftar.
                    <br />
                    <span className="text-xs">
                      Data akan muncul otomatis saat ada pendaftar baru.
                    </span>
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
