"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild><Link href="/dashboard/berita/tulis">Tulis Berita</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard/berita">Kelola Berita</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard/pendaftaran">Kelola Pendaftaran</Link></Button>
      </CardContent>
    </Card>
  );
}
