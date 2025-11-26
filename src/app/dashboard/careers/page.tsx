"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase, Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareers } from "@/lib/careers/queries";
import type { Career } from "@/lib/careers/types";
import { toast } from "sonner";
import api from "@/lib/api/axios";

export default function CareersListPage() {
  const { data: envelope, isFetching, refetch } = useCareers({ page: 1, limit: 10 });
  const items = envelope?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus karir ini?")) return;
    try {
      await api.delete(`/careers/${id}`);
      toast.success("Karir berhasil dihapus");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus karir");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Karir</h1>
        <Button asChild>
          <Link href="/dashboard/careers/tulis">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Karir
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Semua Lowongan Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table className="text-sm table-fixed">
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="w-auto">Judul</TableHead>
                  <TableHead className="w-1/4">Lokasi</TableHead>
                  <TableHead className="w-[150px] text-center">Deadline</TableHead>
                  <TableHead className="w-[120px] text-center">Aksi</TableHead>
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
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Skeleton className="h-4 w-4/5" />
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <Skeleton className="h-8 w-16 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Data careers */}
                {items.map((c: Career) => (
                  <TableRow key={c.id} className="hover:bg-secondary/50">
                    <TableCell className="p-4">
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600 mt-0.5" />
                        <Link
                          href={`/dashboard/careers/${c.id}/edit`}
                          className="font-medium hover:underline block truncate"
                          title={c.title}
                        >
                          {c.title}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="block truncate text-muted-foreground" title={c.location}>
                        {c.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-center p-4 text-muted-foreground">
                      {new Date(c.deadline).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Link href={`/dashboard/careers/${c.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id)}
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
                    <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                      Belum ada lowongan pekerjaan.
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
