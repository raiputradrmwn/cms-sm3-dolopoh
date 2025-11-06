// src/app/dashboard/berita/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentPublishedNews } from "@/lib/news/queries";
import type { NewsRow } from "@/lib/news/types";

export default function NewsListPage() {
  // ambil berita terbit (published) page=1 limit=10
  const { data: items = [], isFetching } = useRecentPublishedNews({ page: 1, limit: 10 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Berita Terbit</h1>
        <Button asChild>
          <Link href="/dashboard/berita/tulis">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tulis Berita
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Semua Berita (Published)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table className="text-sm">
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="min-w-[280px]">Judul</TableHead>
                  <TableHead className="w-[360px]">Headline</TableHead>
                  <TableHead className="w-[200px] text-center">Terakhir Diubah</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Skeleton saat loading awal */}
                {isFetching && items.length === 0 &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Skeleton className="h-4 w-4/5" />
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <Skeleton className="h-4 w-28 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Data published */}
                {items.map((n: NewsRow) => (
                  <TableRow key={n.id} className="hover:bg-secondary/50">
                    <TableCell className="p-4">
                      <div className="flex items-start gap-2">
                        <Newspaper className="h-4 w-4 text-green-600 mt-0.5" />
                        <Link
                          href={`/dashboard/berita/${n.id}/edit`}
                          className="font-medium hover:underline block truncate"
                          title={n.title}
                        >
                          {n.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="block truncate text-muted-foreground" title={n.headline}>
                        {n.headline}
                      </span>
                    </TableCell>
                    <TableCell className="text-center p-4 text-muted-foreground">
                      {new Date(n.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty state */}
                {!isFetching && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="p-8 text-center text-muted-foreground">
                      Belum ada berita yang terbit.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
