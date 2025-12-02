
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, ImagePlus, Maximize2 } from "lucide-react";

import EditorClient from "../../components/EditorClient";
import { useNewsDetail } from "@/lib/news/queries";
import { useUpdateNews } from "@/lib/news/mutations";
import type { NewsStatus } from "@/lib/news/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

function stripHtml(html: string) {
  if (typeof window === "undefined") return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}

export default function NewsEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: detail, isFetching } = useNewsDetail(id);
  const updateNews = useUpdateNews();

  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState<NewsStatus>("DRAFT");
  const [content, setContent] = React.useState<string>("");
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [fit, setFit] = React.useState<"cover" | "contain">("cover");
  const [openPreview, setOpenPreview] = React.useState(false);

  React.useEffect(() => {
    if (!detail) return;
    setTitle(detail.title || "");
    setStatus(detail.status || "DRAFT");
    setContent(detail.content || "");

    setCoverPreview(detail.photo || null);

  }, [detail]);


  React.useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const onPickCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      e.target.value = "";
      return;
    }
    setCoverFile(f);

    const url = URL.createObjectURL(f);
    setCoverPreview(url);
    e.target.value = "";
  };

  const onRemoveCover = () => {


    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const onSubmit = async () => {
    if (!id) return;
    if (!title.trim()) return toast.error("Judul wajib diisi");
    if (!content || stripHtml(content).length === 0)
      return toast.error("Konten belum diisi");
    try {
      if (coverFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("status", status);
        formData.append("content", content);
        formData.append("photo", coverFile);
        await updateNews.mutateAsync({ id, form: formData });
      } else {
        await updateNews.mutateAsync({
          id,
          json: { title, status, content },
        });
      }
      toast.success("Berita berhasil diperbarui");
      router.push("/dashboard/berita");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui berita");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Edit Berita</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/berita">Kembali</Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Perbarui Informasi</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isFetching && (
            <p className="text-sm text-muted-foreground">Memuat data…</p>
          )}

          {/* Form atas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as NewsStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sampul */}
          <div className="space-y-2">
            <Label>Sampul (opsional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={onPickCover} />
              <Button type="button" variant="outline" disabled>
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>

            {coverPreview && (
              <div className="mt-3 rounded-lg border bg-muted/20 w-full max-w-md">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={coverPreview}
                    alt="Pratinjau sampul"
                    className={cn(
                      "h-full w-full rounded-lg",
                      fit === "cover" ? "object-cover" : "object-contain bg-black/5"
                    )}
                  />
                </AspectRatio>

                {/* Toolbar preview */}
                <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
                  <span>Pratinjau Sampul (16:9)</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={fit === "cover" ? "default" : "outline"}
                      className="h-7 px-2"
                      onClick={() => setFit("cover")}
                    >
                      Isi
                    </Button>
                    <Button
                      size="sm"
                      variant={fit === "contain" ? "default" : "outline"}
                      className="h-7 px-2"
                      onClick={() => setFit("contain")}
                    >
                      Muat
                    </Button>

                    <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Maximize2 className="h-4 w-4" />
                          <span className="sr-only">Perbesar</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Pratinjau Penuh</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[80vh]">
                          <img
                            src={coverPreview}
                            alt="Preview penuh"
                            className="mx-auto max-h-[75vh] w-auto object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={onRemoveCover}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Separator />

          <div className="space-y-2">
            <Label>Konten</Label>
            <EditorClient value={content} onChange={setContent} />
          </div>
          <div className="flex items-center justify-end pt-2">
            <Button onClick={onSubmit} disabled={updateNews.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateNews.isPending ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
