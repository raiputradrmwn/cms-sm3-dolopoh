"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApiQuery } from "@/lib/api/hooks";
import type { StudentDetailResponse } from "@/lib/students/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentDetailCard from "../components/StudentDetailCard";


export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isFetching } = useApiQuery<StudentDetailResponse>(
    ["students", "detail", id],
    `/students/${id}`
  );

  const student = data?.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Detail Pendaftar</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/pendaftaran">Kembali</Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentDetailCard student={student} loading={isFetching} />
        </CardContent>
      </Card>
    </div>
  );
}
