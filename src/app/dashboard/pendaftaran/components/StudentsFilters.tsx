"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

const MAJORS = [
  { label: "Semua jurusan", value: "ALL" },
  { label: "Teknik Kendaraan Ringan Otomotif", value: "Teknik Kendaraan Ringan" },
  { label: "Teknik Bisnis Sepeda Motor", value: "Teknik Bisnis Sepeda Motor" },
  { label: "Desain & Produksi Busana", value: "Desain & Produksi Busana" },
  { label: "Desain Komunikasi Visual/Komputer", value: "Desain Komunikasi Visual" },
  { label: "Teknik Informatika", value: "Teknik Informatika" },
];

type Props = {
  value: { search: string; major: string };
  onChange: (v: { search: string; major: string }) => void;
};

export default function StudentsFilters({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="search">Cari nama</Label>
        <Input
          id="search"
          placeholder="Ketik kata kunci…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Jurusan</Label>
        <Select
          value={value.major}
          onValueChange={(m) => onChange({ ...value, major: m })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jurusan" />
          </SelectTrigger>
          <SelectContent>
            {MAJORS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
