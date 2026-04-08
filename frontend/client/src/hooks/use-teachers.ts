import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTeachers() {
  return useQuery({
    queryKey: ["/api/teachers"],
    queryFn: () => api.get<any[]>("/teachers"),
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["/api/teachers", id],
    queryFn: () => api.get<any>(`/teachers/${id}`),
    enabled: !!id,
  });
}
