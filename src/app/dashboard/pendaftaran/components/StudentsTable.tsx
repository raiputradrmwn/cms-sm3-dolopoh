"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from "@/lib/students/types";
import { IdCard, User, CalendarDays, GraduationCap } from "lucide-react";

type Props = {
  items: Student[];
  loading?: boolean;
};

export default function StudentsTable({ items, loading }: Props) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-[170px]">No Daftar</TableHead>
            <TableHead className="min-w-[220px]">Nama</TableHead>
            <TableHead className="w-[160px] text-center">Jurusan</TableHead>
            <TableHead className="w-[200px] text-center">Tanggal Daftar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && items.length === 0 && Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={`sk-${i}`}>
              <TableCell className="p-4"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="p-4"><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell className="text-center p-4"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
              <TableCell className="text-center p-4"><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
            </TableRow>
          ))}

          {items.map((s) => (
            <TableRow key={s.id} className="hover:bg-secondary/50">
              <TableCell className="p-4">
                <Link
                  href={`/dashboard/pendaftaran/${s.id}`}
                  className="font-medium hover:underline inline-flex items-center gap-2"
                >
                  <IdCard className="h-4 w-4 text-primary" />
                  {s.regNo}
                </Link>
              </TableCell>
              <TableCell className="p-4">
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/70" />
                  {s.name}
                </span>
              </TableCell>
              <TableCell className="text-center p-4">
                <Badge variant="secondary">{s.major}</Badge>
              </TableCell>
              <TableCell className="text-center p-4 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(s.created_at).toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          ))}

          {!loading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                Belum ada data pendaftar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
