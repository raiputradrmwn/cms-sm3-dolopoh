
"use client";

import * as React from "react";
import { StatsCards } from "./components/StatsCards";
import { NewsRecentTable } from "./components/NewsRecentTable";
import { RegistrationsRecentTable } from "./components/RegistrationsRecentTable";
import { RegistrationsSummary } from "./components/RegistrationsSummary";
import { QuickActions } from "./components/QuickAction";
import { useApiQuery } from "@/lib/api/hooks";

export default function Page() {
  // Ambil data dummy gabungan untuk kartu statistik & ringkasan jurusan
  const stats = useApiQuery<any>(["stats"], "/mock/stats.json");
  const loading = stats.isFetching;

  const totalNews = stats.data?.totalNews ?? 0;
  const publishedNews = stats.data?.publishedCount ?? 0;
  const newRegistrations7d = stats.data?.new7d ?? 0;
  const verifiedRegistrations7d = stats.data?.verified7d ?? 0;
  const perMajor: { major: string; count: number }[] =
    stats.data?.perMajor ?? [];

  return (
    <main className="p-4">
      {/* Container lebar nyaman */}
      <div className="mx-auto w-full space-y-8">
        {/* Hero: judul + subjudul + aksi cepat */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-transparent to-secondary/50 p-5 sm:p-6">
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Dashboard SMK 3 Dolopo
              </h1>
              <p className="text-sm text-muted-foreground">
                Ikhtisar singkat berita & pendaftaran siswa. Kelola konten dan
                verifikasi pendaftar di satu tempat.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickActions />
            </div>
          </div>
          {/* dekor tipis */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </section>

        {/* Kartu statistik */}
        <StatsCards
          loading={loading}
          totalNews={totalNews}
          publishedNews={publishedNews}
          newRegistrations={newRegistrations7d}
          verifiedRegistrations={verifiedRegistrations7d}
        />

        {/* Dua kolom: konten utama & samping */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Kolom utama */}
          <div className="lg:col-span-2 space-y-6">
            <NewsRecentTable />
            <RegistrationsRecentTable />
          </div>

          {/* Kolom samping */}
          <div className="space-y-6">
            <RegistrationsSummary data={perMajor} />
            {/* (opsional) tempat widget lain, mis. pengumuman internal */}
          </div>
        </section>
      </div>
    </main>
  );
}
