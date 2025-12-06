"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import type { StudentsListResponse, Student } from "@/lib/students/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight, Users, Download } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { utils, writeFile } from "xlsx";

import StudentsFilters from "./components/StudentsFilters";
import StudentsTable from "./components/StudentsTable";
import { CalendarDateRangePicker } from "@/components/layout/CalendarDateRangePicker";

export default function PendaftaranPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(1000); // Fetch all (or large chunk) for client-side filtering
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [major, setMajor] = React.useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  // Removed search and major from API params to handle on client side

  const { data, isFetching } = useApiQuery<StudentsListResponse>(
    ["students", "list", page, limit], // Removed search and major from query key
    `/students?${params.toString()}`
  );

  const rawRows: Student[] = data?.data?.data ?? [];
  const pg = data?.data?.pagination;

  // Client-side filtering
  const filteredRows = React.useMemo(() => {
    const filtered = rawRows.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesMajor = major && major !== "ALL" ? student.major === major : true;

      let matchesDate = true;
      if (dateRange?.from) {
        const studentDate = new Date(student.created_at);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          matchesDate = studentDate >= fromDate && studentDate <= toDate;
        } else {
          matchesDate = studentDate >= fromDate;
        }
      }

      return matchesSearch && matchesMajor && matchesDate;
    });

    // Sort by created_at desc (Newest First)
    return filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [rawRows, debouncedSearch, major, dateRange]);

  const downloadExcel = () => {
    if (filteredRows.length === 0) return;

    // Define columns (Removed NISN / No Pendaftaran)
    const headers = [
      "No",
      "Nama Lengkap", "Jenis Kelamin",
      "Tempat Lahir", "Tanggal Lahir", "Alamat", "No HP",
      "Asal Sekolah", "Tahun Lulus",
      "Nama Ayah", "Nama Ibu",
      "Kondisi Ayah", "Kondisi Ibu",
      "Pekerjaan Ayah", "Pekerjaan Ibu",
      "No HP Ortu/Wali",
      "Jurusan", "Rekomendasi Dari",
      "Tanggal Daftar"
    ];

    const rows = filteredRows.map((item, index) => {
      return [
        index + 1,
        item.name, item.gender,
        item.place_of_birth, item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString("id-ID") : "-",
        item.address, item.phone_number,
        item.from_school, item.graduation_year,
        item.biological_father, item.biological_mother,
        item.father_condition, item.mother_condition,
        item.father_job, item.mother_job,
        item.parent_guardian_phone_number,
        item.major, item.recommendation_from,
        new Date(item.created_at).toLocaleDateString("id-ID")
      ];
    });

    // Create workbook and worksheet
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([headers, ...rows]);

    // Auto-width columns (simple estimation)
    const wscols = headers.map(h => ({ wch: h.length + 5 }));
    ws['!cols'] = wscols;

    utils.book_append_sheet(wb, ws, "Pendaftaran");
    writeFile(wb, `data_pendaftaran_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight inline-flex items-center gap-2">
          <Users className="h-5 w-5" /> Pendaftaran Siswa
        </h1>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />

          <Button variant="outline" onClick={downloadExcel} disabled={filteredRows.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>

      <StudentsFilters
        value={{ search, major: major ?? "ALL" }}
        onChange={(v) => {
          setSearch(v.search);
          setMajor(v.major === "ALL" ? undefined : v.major);
        }}
      />

      {/* Tabel */}
      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Pendaftar</CardTitle>
          <div className="text-sm text-muted-foreground">
            {isFetching ? "Memuat…" : `${filteredRows.length} data`}
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable items={filteredRows} loading={isFetching} />
        </CardContent>
      </Card>

      {/* Pagination (Hidden or Disabled since we fetch all) */}
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

