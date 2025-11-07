// src/lib/news/mutations.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { CreateNewsInput, CreateNewsResponse, RawNewsItem } from "./types";

export type CreateNewsPayload = {
  title: string;
  headline: string;
  content: string;
  photo?: string | null;
  status?: "PUBLISHED" | "DRAFT";
};

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNewsPayload) => {
      const r = await api.post<{ data: RawNewsItem }>("/news", payload);
      return r.data;
    },
    onSuccess: () => {
      // refresh daftar published
      qc.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export async function postNews(input: CreateNewsInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("content", input.content);
  fd.append("status", input.status);
  if (input.photo) fd.append("photo", input.photo);

  const res = await fetch("/api/news", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Gagal menyimpan berita");
  return data as { data?: { id?: string } };
}

export function useCreateNewsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postNews,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news", "published"] });
    },
  });
}
export type NewsStatus = "PUBLISHED" | "DRAFT";
export type UpdateNewsInput =
  | { id: string; form: FormData; json?: never } // ganti foto → kirim FormData
  | {
      id: string;
      form?: never;
      json: { title?: string; status?: NewsStatus; content?: string }; // tidak ganti foto → JSON
    };
export function useUpdateNews() {
  return useMutation({
    mutationFn: async ({ id, form, json }: UpdateNewsInput) => {
      // 1) Jika ada file baru → kirim FormData (JANGAN set Content-Type manual)
      if (form) {
        const r = await api.patch(`/news/${id}`, form, {
          // pastikan interceptor kamu tidak memaksa 'application/json'
          headers: { /* 'Content-Type' biarkan undefined */ },
        });
        return r.data;
      }

      // 2) Kalau tidak ganti gambar → kirim JSON biasa (lebih ringan)
      if (json) {
        const r = await api.patch(`/news/${id}`, json, {
          headers: { "Content-Type": "application/json" },
        });
        return r.data;
      }

      throw new Error("Payload update tidak valid");
    },
  });
}