// src/app/dashboard/page.tsx (atau sesuai pathmu)
"use client";

import * as React from "react";
import { NewsRecentTable } from "./components/NewsRecentTable";
import { RegistrationsRecentTable } from "./components/RegistrationsRecentTable";
import { StatsCardsContainer } from "./components/StatsCardContainer";
import RegistrationsSummaryContainer from "./components/RegistrationsSummaryContainer";

// ===== Types =====
type PerMajor = { major: string; count: number };


export default function Page() {


  return (
    <main className="p-4">
      <div className="mx-auto w-full h-full space-y-8 ">
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

            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </section>
        <StatsCardsContainer />
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <NewsRecentTable />
            <RegistrationsRecentTable />
          </div>
          <div className="space-y-6">
           <RegistrationsSummaryContainer />
          </div>
        </section>
      </div>
    </main>
  );
}
