export type Admin = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  status: "ACTIVE" | "INACTIVE"; // Assuming status field exists based on screenshot
  created_at?: string;
  updated_at?: string;
};

export type AdminListResponse = {
  meta: {
    code: number;
    success: boolean;
    message: string;
  };
  data: Admin[];
};

export type CreateAdminInput = {
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export type UpdateAdminInput = Partial<CreateAdminInput>;
