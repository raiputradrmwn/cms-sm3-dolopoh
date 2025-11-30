"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImagePlus, Maximize2, Save } from "lucide-react";
import NewsEditor from "../components/Editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
type CreateNewsResponse = {
  data?: { id?: string };
  meta?: { message?: string };
};

export default function NewsCreatePage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [fit, setFit] = React.useState<"cover" | "contain">("cover");
  const [openPreview, setOpenPreview] = React.useState(false);
  const onPickCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);

    setPhotoPreview(f ? URL.createObjectURL(f) : null);
    e.target.value = "";
  };

  const onSubmit = async () => {
    if (!title.trim()) return toast.error("Judul wajib diisi");
    const emptyHtml =
      !content || content.replace(/<[^>]*>/g, "").trim().length === 0;
    if (emptyHtml) return toast.error("Konten belum diisi");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      fd.append("status", published ? "PUBLISHED" : "DRAFT");
      if (photo) fd.append("photo", photo);

      const res = await fetch("/api/news", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as CreateNewsResponse;

      if (!res.ok) {
        throw new Error(data?.meta?.message || "Gagal menyimpan berita");
      }

      toast.success("Berita berhasil disimpan");
      router.push("/dashboard/berita");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Gagal menyimpan berita");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Tulis Berita</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/berita">Kembali</Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Berita</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Judul */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              placeholder="Masukkan judul berita…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Sampul */}
          <div className="space-y-2">
            <Label>Sampul (opsional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={onPickCover} />
              <Button type="button" variant="outline" disabled>
                <ImagePlus className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>
            {photoPreview && (
              <div className="mt-3 rounded-lg border bg-muted/20 w-full max-w-md">
                {/* Canvas gambar proporsional */}
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={photoPreview}
                    alt="Preview sampul"
                    className={cn(
                      "h-full w-full rounded-lg",
                      fit === "cover"
                        ? "object-cover"
                        : "object-contain bg-black/5"
                    )}
                  />
                </AspectRatio>
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
                            src={photoPreview}
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
                      onClick={() => setPhoto(null)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Konten (Tiptap) */}
          <div className="space-y-2">
            <Label>Konten</Label>
            <NewsEditor value={content} onChange={setContent} />
          </div>

          {/* Status + Simpan */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">Terbitkan sekarang</Label>
            </div>
            <Button onClick={onSubmit} disabled={submitting}>
              <Save className="h-4 w-4 mr-2" />
              {submitting ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
