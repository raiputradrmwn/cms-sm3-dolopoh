
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useApiMutation } from "@/lib/api/hooks";
import { toast } from "sonner";
import { ImagePlus, Save } from "lucide-react";
import NewsEditor from "../components/Editor";

export default function NewsCreatePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Pengumuman");
  const [cover, setCover] = React.useState<string | null>(null);
  const [content, setContent] = React.useState("");
  const [published, setPublished] = React.useState(true);

  // Nanti ganti ke endpoint Nest, contoh: "/news"
  const createNews = useApiMutation<any, any>("post", "/news");

  const onPickCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await toBase64(f);
    setCover(String(b64)); // mock: tampilkan preview
    e.target.value = "";
  };

  const onSubmit = async () => {
    if (!title.trim()) return toast.error("Judul wajib diisi");
    if (!content || content === "<p></p>") return toast.error("Konten belum diisi");

    try {
      // kirim ke NestJS (nanti). Sekarang hanya simulasi dan redirect.
      await createNews.mutateAsync({
        title,
        category,
        coverUrl: cover,
        content,
        published,
      });
      toast.success("Berita berhasil disimpan");
      router.push("/dashboard/berita");
    } catch (e) {
      // Saat mock (tanpa backend), ini kemungkinan error—tetap kasih feedback.
      console.error(e);
      toast.success("Simulasi sukses (mock). Nanti akan tersimpan ke NestJS.");
      router.push("/dashboard/berita");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Tulis Berita</h1>
        <Button variant="outline" asChild><Link href="/dashboard/berita">Kembali</Link></Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Berita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" placeholder="Masukkan judul berita…" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                  <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                  <SelectItem value="Prestasi">Prestasi</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sampul (opsional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={onPickCover} />
              <Button type="button" variant="outline" disabled>
                <ImagePlus className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>
            {cover && (
              <img src={cover} alt="Cover preview" className="mt-2 h-40 w-full rounded-lg object-cover border" />
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Konten</Label>
            <NewsEditor value={content} onChange={setContent} />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published">Terbitkan</Label>
            </div>
            <Button onClick={onSubmit}>
              <Save className="h-4 w-4 mr-2" /> Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
