export type Career = {
  id: string;
  title: string;
  requirements: string;
  job_description: string;
  location: string;
  benefits: string;
  deadline: string;
  photo?: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerPagination = {
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

export type CareerListEnvelope = {
  data: Career[];
  pagination: CareerPagination;
};

export type CareerListResponse = {
  meta?: { code?: number; success?: boolean; message?: string };
  data: CareerListEnvelope;
};

export type CareerDetailResponse = {
  meta?: { code?: number; success?: boolean; message?: string };
  data: Career;
};

export type CreateCareerInput = {
  title: string;
  requirements: string;
  job_description: string;
  location: string;
  benefits: string;
  deadline: string;
  photo?: File | null;
};

export type UpdateCareerInput =
  | { id: string; form: FormData; json?: never }
  | {
      id: string;
      form?: never;
      json: {
        title?: string;
        requirements?: string;
        job_description?: string;
        location?: string;
        benefits?: string;
        deadline?: string;
      };
    };
