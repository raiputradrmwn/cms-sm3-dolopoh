// src/app/dashboard/page.tsx
"use client";

import * as React from "react";
import { NewsRecentTable } from "./components/NewsRecentTable";
import { RegistrationsRecentTable } from "./components/RegistrationsRecentTable";
import { StatsCardsContainer } from "./components/StatsCardContainer";
import RegistrationsSummaryContainer from "./components/RegistrationsSummaryContainer";

export default function Page() {
  return (
    <main className="p-4">
      <div className="mx-auto w-full h-full space-y-8">
        {/* Hero teal */}
        <section
          className="
            relative overflow-hidden rounded-2xl border
            border-teal-200/60 dark:border-teal-800/50
            bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-transparent
            p-5 sm:p-6
          "
        >
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="
                  text-xl sm:text-2xl font-semibold tracking-tight
                  text-teal-700 dark:text-teal-300
                "
              >
                Dashboard SMK 3 Dolopo
              </h1>
              <p className="text-sm text-muted-foreground">
                Ikhtisar singkat berita & pendaftaran siswa. Kelola konten dan
                verifikasi pendaftar di satu tempat.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">{/* ruang aksi cepat */}</div>
          </div>

          {/* dekor blob teal */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
        </section>

        {/* Kartu statistik (biarkan logicnya, nuansa warna ikut komponen dalam) */}
        <StatsCardsContainer />

        {/* Grid konten */}
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
