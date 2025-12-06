"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Newspaper, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentPublishedNews } from "@/lib/news/queries";
import type { NewsRow } from "@/lib/news/types";
import { toast } from "sonner";
import api from "@/lib/api/axios";

export default function NewsListPage() {
  // ambil berita terbit (published) page=1 limit=10
  const { data: items = [], isFetching, refetch } = useRecentPublishedNews({ page: 1, limit: 10 });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = (id: string) => {
    toast("Apakah Anda yakin ingin menghapus berita ini?", {
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            await api.delete(`/news/${id}`);
            toast.success("Berita berhasil dihapus");
            refetch();
          } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus berita");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => { },
      },
    });
  };

  return (
    <div className="space-y-4 w-full">
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
            <Table className="text-sm table-fixed">
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="w-auto">Judul</TableHead>
                  <TableHead className="w-1/3">Headline</TableHead>
                  <TableHead className="w-[200px] text-center">Terakhir Diubah</TableHead>
                  <TableHead className="w-[120px] text-center">Aksi</TableHead>
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
                        <div dangerouslySetInnerHTML={{ __html: n.headline }} />
                      </span>
                    </TableCell>
                    <TableCell className="text-center p-4 text-muted-foreground">
                      {new Date(n.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Link href={`/dashboard/berita/${n.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(n.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
