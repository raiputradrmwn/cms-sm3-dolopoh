// src/lib/students/types.ts
export type ApiMeta = {
  code: number;
  success: boolean;
  message: string;
};

export type Student = {
  id: string;
  name: string;
  gender: string;
  place_of_birth: string;
  date_of_birth: string; // ISO
  address: string;
  phone_number: string;
  from_school: string;
  graduation_year: number;
  biological_father: string;
  biological_mother: string;
  father_condition: string;
  mother_condition: string;
  father_job: string;
  mother_job: string;
  parent_guardian_phone_number: string;
  major: string; // ← kita pakai ini untuk agregasi
  recommendation_from: string;
  created_at: string;
  updated_at: string;
};

export type StudentsPagination = {
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

export type StudentsListResponse = {
  meta: ApiMeta;
  data: {
    data: Student[];
    pagination: StudentsPagination;
  };
};

// UI types
export type RegistrationStatus = "DIVERIFIKASI" | "BARU" | "DITOLAK";

export type RegistrationItem = {
  id: string;
  regNo: string;
  name: string;
  major: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
};