"use client";

import * as React from "react";
import type { Student } from "@/lib/students/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Phone, MapPin, Calendar, School, Baby, LocateFixed } from "lucide-react";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm">{value || "-"}</div>
    </div>
  );
}

export default function StudentDetailCard({
  student,
  loading,
}: {
  student?: Student;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  if (!student) {
    return <div className="text-sm text-muted-foreground">Data tidak ditemukan.</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Kolom utama */}
      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            <div className="font-medium">{student.name}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{student.gender}</Badge>
            <Badge variant="secondary">{student.from_school}</Badge>
            <Badge variant="secondary">{student.graduation_year}</Badge>
          </div>

          <div className="mt-4">
            <Row label="Tempat, Tgl Lahir" value={`${student.place_of_birth}, ${new Date(student.date_of_birth).toLocaleDateString()}`} />
            <Row label="Alamat" value={student.address} />
            <Row label="No. HP" value={student.phone_number} />
            <Row label="Orang Tua (Ayah/Ibu)" value={`${student.biological_father} / ${student.biological_mother}`} />
            <Row label="Kondisi Ortu" value={`${student.father_condition} / ${student.mother_condition}`} />
            <Row label="Pekerjaan Ortu" value={`${student.father_job} / ${student.mother_job}`} />
            <Row label="Kontak Wali" value={student.parent_guardian_phone_number} />
          </div>
        </div>
      </div>

      {/* Samping */}
      <div className="space-y-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <School className="h-4 w-4" />
            <div className="font-medium">Pilihan</div>
          </div>
          <div className="text-sm">
            <div className="flex items-center justify-between py-2">
              <span>Jurusan</span>
              <Badge>{student.major}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Rekomendasi</span>
              <Badge variant="secondary">{student.recommendation_from}</Badge>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            <div className="font-medium">Waktu</div>
          </div>
          <div className="text-xs text-muted-foreground">Dibuat</div>
          <div className="text-sm">{new Date(student.created_at).toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">Diperbarui</div>
          <div className="text-sm">{new Date(student.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
