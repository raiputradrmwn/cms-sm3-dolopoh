"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from "@/lib/students/types";
import { Button } from "@/components/ui/button";
import { IdCard, User, CalendarDays, GraduationCap, ArrowUpDown } from "lucide-react";

type Props = {
  items: Student[];
  loading?: boolean;
};

type SortConfig = {
  key: keyof Student | "created_at";
  direction: "asc" | "desc";
};

export default function StudentsTable({ items, loading }: Props) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: "created_at", direction: "desc" });

  const sortedItems = React.useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortConfig]);

  const handleSort = (key: keyof Student) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead className="min-w-[220px]">
              <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => handleSort("name")}>
                Nama
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[180px]">
              <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => handleSort("from_school")}>
                Asal Sekolah
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[160px] text-center">
              <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => handleSort("major")}>
                Jurusan
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[200px] text-center">
              <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => handleSort("created_at")}>
                Tanggal Daftar
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
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

          {sortedItems.map((s, index) => (
            <TableRow key={s.id} className="hover:bg-secondary/50">
              <TableCell className="p-4 font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="p-4">
                <Link
                  href={`/dashboard/pendaftaran/${s.id}`}
                  className="font-medium hover:underline inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-primary/70" />
                  {s.name}
                </Link>
              </TableCell>
              <TableCell className="p-4">
                <span className="text-muted-foreground">{s.from_school}</span>
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
              <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                Belum ada data pendaftar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
