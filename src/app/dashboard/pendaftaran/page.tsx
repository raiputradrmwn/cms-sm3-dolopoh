"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import type { StudentsListResponse, Student } from "@/lib/students/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import StudentsFilters from "./components/StudentsFilters";
import StudentsTable from "./components/StudentsTable";

export default function PendaftaranPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [major, setMajor] = React.useState<string | undefined>(undefined);

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search.trim()) params.set("search", search.trim());
  if (major && major !== "ALL") params.set("major", major);

  const { data, isFetching } = useApiQuery<StudentsListResponse>(
    ["students", "list", page, limit, search],
    `/students?${params.toString()}`
  );

  const rows: Student[] = data?.data?.data ?? [];
  const pg = data?.data?.pagination;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight inline-flex items-center gap-2">
          <Users className="h-5 w-5" /> Pendaftaran Siswa
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
      <StudentsFilters
        value={{ search, major: major ?? "ALL" }}
        onChange={(v) => {
          setSearch(v.search);
          setMajor(v.major === "ALL" ? undefined : v.major);
          setPage(1);
        }}
      />

      {/* Tabel */}
      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Pendaftar</CardTitle>
          <div className="text-sm text-muted-foreground">
            {isFetching ? "Memuat…" : `${pg?.itemCount ?? rows.length} data`}
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable items={rows} loading={isFetching} />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={isFetching || !pg?.hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
        </Button>
        <div className="text-sm text-muted-foreground">
          Halaman <span className="font-medium">{pg?.page ?? page}</span> dari{" "}
          <span className="font-medium">{pg?.pageCount ?? 1}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={isFetching || !pg?.hasNextPage}
        >
          Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
