"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ImagePlus } from "lucide-react";
import EditorClient from "../../components/Editor";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNewsById } from "@/lib/news/queries";
import { useUpdateNews } from "@/lib/news/mutations";
import { NewsStatus } from "@/lib/news/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stripHtml } from "@/lib/news/text";
export default function NewsEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isFetching } = useNewsById(id);
  const updateNews = useUpdateNews();

  // state form
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState<NewsStatus>("PUBLISHED");
  const [content, setContent] = React.useState(""); // EditorClient (HTML), kita strip saat submit
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setStatus(data.status ?? "PUBLISHED");
    setContent(data.content ?? data.headline ?? "");
    setPreview(data.photo ?? null);
  }, [data]);

  const onPickCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    e.target.value = "";
  };

  const onSubmit = async () => {
    if (!title.trim()) return toast.error("Judul wajib diisi");

    const form = new FormData();
    form.append("title", title);
    // kirim PLAIN TEXT (tanpa tag):
    form.append("content", stripHtml(content));
    form.append("status", status);
    if (file) form.append("photo", file);

    try {
      await updateNews.mutateAsync({ id, form });
      toast.success("Berita berhasil diperbarui");
      router.push("/dashboard/berita");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Gagal memperbarui berita");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {isFetching ? "Memuat…" : `Edit: ${data?.title ?? ""}`}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/berita">Kembali</Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Perbarui Berita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as NewsStatus)}>
                <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sampul (opsional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={onPickCover} />
              <Button type="button" variant="outline" disabled>
                <ImagePlus className="h-4 w-4 mr-2" /> Ubah
              </Button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview sampul"
                className="mt-2 h-40 w-full rounded-lg object-cover border"
              />
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Konten</Label>
            {/* Editor menyimpan HTML di state; saat submit kita strip ke plain text */}
            <EditorClient value={content} onChange={setContent} />
            <p className="text-xs text-muted-foreground">
              *Saat disimpan, konten akan dikirim sebagai <b>teks tanpa tag HTML</b>.
            </p>
          </div>

          <div className="flex justify-end pt-2">
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
