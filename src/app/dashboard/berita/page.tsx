// src/app/admin/news/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useApiQuery } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Newspaper } from "lucide-react";

export default function NewsListPage() {
  const { data, isFetching } = useApiQuery<any>(["news","all"], "/mock/news.json");
  const all = data?.data ?? [];
  const items = all.filter((n: any) => n.published);

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
                  <TableHead className="w-[140px] text-center">Kategori</TableHead>
                  <TableHead className="w-[200px] text-center">Terakhir Diubah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((n: any) => (
                  <TableRow key={n.id} className="hover:bg-secondary/50">
                    <TableCell className="p-4">
                      <div className="flex items-start gap-2">
                        <Newspaper className="h-4 w-4 text-green-600 mt-0.5" />
                        <Link
                          href={`/dashboard/berita/${n.id}`}
                          className="font-medium hover:underline block truncate"
                          title={n.title}
                        >
                          {n.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <Badge variant="secondary">{n.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center p-4 text-muted-foreground">
                      {new Date(n.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
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
