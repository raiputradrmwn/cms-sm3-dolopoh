import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";

export type CreateCareerInput = {
  title: string;
  job_description: string;
  requirements: string;
  location: string;
  benefits: string;
  deadline: string;
  photo?: File | null;
};

export async function createCareer(input: CreateCareerInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("job_description", input.job_description);
  fd.append("requirements", input.requirements);
  fd.append("location", input.location);
  fd.append("benefits", input.benefits);
  fd.append("deadline", input.deadline);
  if (input.photo) fd.append("photo", input.photo);

  const { data } = await api.post("/careers", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export function useCreateCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCareer,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["careers"] });
    },
  });
}
