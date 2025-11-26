"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImagePlus, Save } from "lucide-react";
import NewsEditor from "@/app/dashboard/berita/components/Editor"; // Reusing Editor
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type CreateCareerResponse = {
  data?: { id?: string };
  meta?: { message?: string };
};

export default function CareerCreatePage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [benefits, setBenefits] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onPickCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
    e.target.value = "";
  };

  const onSubmit = async () => {
    if (!title.trim()) return toast.error("Judul wajib diisi");
    if (!location.trim()) return toast.error("Lokasi wajib diisi");
    if (!deadline) return toast.error("Deadline wajib diisi");
    
    // Simple validation for rich text fields (check if empty)
    const isHtmlEmpty = (html: string) => !html || html.replace(/<[^>]*>/g, "").trim().length === 0;
    
    if (isHtmlEmpty(jobDescription)) return toast.error("Deskripsi Pekerjaan wajib diisi");
    if (isHtmlEmpty(requirements)) return toast.error("Persyaratan wajib diisi");
    if (isHtmlEmpty(benefits)) return toast.error("Benefit wajib diisi");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("job_description", jobDescription);
      fd.append("requirements", requirements);
      fd.append("location", location);
      fd.append("benefits", benefits);
      fd.append("deadline", deadline);
      if (photo) fd.append("photo", photo);

      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as CreateCareerResponse;

      if (!res.ok) {
        throw new Error(data?.meta?.message || "Gagal menyimpan karir");
      }

      toast.success("Karir berhasil disimpan");
      router.push("/dashboard/careers");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Gagal menyimpan karir");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Tambah Karir</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/careers">Kembali</Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Lowongan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Judul */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Pekerjaan</Label>
            <Input
              id="title"
              placeholder="Contoh: Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              placeholder="Contoh: Jakarta, Indonesia (Remote)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Sampul */}
          <div className="space-y-2">
            <Label>Poster (opsional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" onChange={onPickCover} />
              <Button type="button" variant="outline" disabled>
                <ImagePlus className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>
            {photoPreview && (
              <div className="mt-3 rounded-lg border bg-muted/20 w-full max-w-md">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={photoPreview}
                    alt="Preview poster"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </AspectRatio>
                <div className="p-2 text-right">
                   <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                      }}
                    >
                      Hapus
                    </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Deskripsi Pekerjaan */}
          <div className="space-y-2">
            <Label>Deskripsi Pekerjaan</Label>
            <NewsEditor value={jobDescription} onChange={setJobDescription} placeholder="Tulis deskripsi pekerjaan..." />
          </div>

          {/* Persyaratan */}
          <div className="space-y-2">
            <Label>Persyaratan</Label>
            <NewsEditor value={requirements} onChange={setRequirements} placeholder="Tulis persyaratan..." />
          </div>

          {/* Benefit */}
          <div className="space-y-2">
            <Label>Benefit</Label>
            <NewsEditor value={benefits} onChange={setBenefits} placeholder="Tulis benefit..." />
          </div>

          {/* Simpan */}
          <div className="flex items-center justify-end pt-4">
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
