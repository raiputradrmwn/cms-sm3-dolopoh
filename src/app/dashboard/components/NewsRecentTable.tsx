"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Newspaper, FileEdit } from "lucide-react";
import { useRecentPublishedNews } from "@/lib/news/queries";
import type { NewsRow } from "@/lib/news/types";

export function NewsRecentTable() {
  const { data: items = [], isFetching } = useRecentPublishedNews({ page: 1, limit: 5 });
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Berita Terbaru</CardTitle>
          <p className="text-sm text-muted-foreground">
            5 berita terbit terakhir • klik judul untuk mengedit
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/berita">Lihat Semua</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border shadow-sm overflow-x-auto">
          <Table className="text-sm min-w-[800px]">
            <TableHeader className="sticky top-0 bg-background">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[260px]">Judul</TableHead>
                <TableHead className="w-[320px]">Headline</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[200px] text-center">Diubah</TableHead>
                <TableHead className="w-[90px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton saat loading awal */}
              {isFetching && items.length === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-[60%]" />
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-4 w-[80%]" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-5 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Skeleton className="h-4 w-28 mx-auto" />
                    </TableCell>
                    <TableCell className="p-4">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Data rows */}
              {items.map((n: NewsRow) => (
                <TableRow
                  key={n.id}
                  className={[
                    "hover:bg-secondary/50 transition-colors",
                    "odd:bg-background even:bg-muted/30",
                    n.isPublished ? "border-l-2 border-l-green-600" : "border-l-2 border-l-amber-500",
                  ].join(" ")}
                >
                  <TableCell className="p-4">
                    <div className="flex items-start gap-2">
                      <Newspaper className={["mt-0.5 h-5 w-5 shrink-0", n.isPublished ? "text-green-600" : "text-amber-600"].join(" ")} />
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
                    <div className="truncate text-muted-foreground" title={n.headline}>
                      <div dangerouslySetInnerHTML={{ __html: n.headline }} />
                    </div>
                  </TableCell>

                  <TableCell className="text-center p-4">
                    {n.isPublished ? (
                      <Badge className="bg-green-600 text-white hover:bg-green-600">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center p-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {new Date(n.updatedAt).toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="p-4">
                    <Button asChild size="sm" variant="ghost" className="ml-auto gap-2">
                      <Link href={`/dashboard/berita/${n.id}/edit`}>
                        <FileEdit className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty state */}
              {!isFetching && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                    Belum ada berita terbit.{" "}
                    <Link href="/dashboard/berita/tulis" className="underline">
                      Tulis berita pertama
                    </Link>
                    .
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
