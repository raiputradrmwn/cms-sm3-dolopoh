export type RawNewsItem = {
  id: string;
  title: string;
  content: string;
  headline: string;
  photo?: string | null;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  created_at: string;
  updated_at: string;
};

export type NewsPagination = {
  itemCount: number;
  limit: number;
  pageCount: number;
  page: number;
  slNo: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type NewsListEnvelope = {
  data: RawNewsItem[];
  pagination: NewsPagination;
};

export type NewsListResponse = {
  meta?: { code?: number; success?: boolean; message?: string };
  data: NewsListEnvelope;
};

export type NewsRow = {
  id: string;
  title: string;
  headline: string;
  photo?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
export type CreateNewsInput = {
  title: string;
  content: string; // HTML dari Tiptap
  status: "PUBLISHED" | "DRAFT";
  photo?: File | null; // file sampul
};

export type CreateNewsResponse = {
  meta?: { code?: number; success?: boolean; message?: string };
  data?: { id?: string };
};
export type NewsStatus = "PUBLISHED" | "DRAFT";

export type NewsDetail = {
  id: string;
  title: string;
  headline?: string | null;
  content: string; // bisa plain text atau html (tergantung backend)
  photo?: string | null; // URL gambar sampul
  status: NewsStatus;
  created_at: string;
  updated_at: string;
};

export type NewsDetailResponse = {
  meta?: { code: number; success: boolean; message?: string };
  data: NewsDetail;
};
export type UpdateNewsInput =
  | { id: string; form: FormData; json?: never } // ganti foto → kirim FormData
  | {
      id: string;
      form?: never;
      json: { title?: string; status?: NewsStatus; content?: string }; // tidak ganti foto → JSON
    };
