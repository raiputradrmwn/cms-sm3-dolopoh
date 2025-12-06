import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Admin, AdminListResponse, CreateAdminInput, UpdateAdminInput } from "./types";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

// Fetch list
async function fetchAdmins() {
  const { data } = await axios.get("/api/auth/admin");
  // Structure is { meta: ..., data: { data: [...] } }
  // or sometimes just { data: [...] } depending on standardisation.
  // Based on user input: root -> data -> data -> array
  if (data?.data?.data && Array.isArray(data.data.data)) {
    return data.data.data;
  }
  // Fallback for other structures
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  
  return [];
}

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });
}

// Create
export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAdminInput) => {
      const { data } = await axios.post("/api/auth/admin", input);
      return data;
    },
    onSuccess: () => {
      toast.success("Admin berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal membuat admin");
    },
  });
}

// Update
export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAdminInput }) => {
      const res = await axios.patch(`/api/auth/admin/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui admin");
    },
  });
}

// Delete
export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/auth/admin/${id}`);
    },
    onSuccess: () => {
      toast.success("Admin berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus admin");
    },
  });
}
