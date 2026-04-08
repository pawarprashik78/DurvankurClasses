import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useStudents() {
  return useQuery({
    queryKey: ["/api/students"],
    queryFn: () => api.get<any[]>("/students"),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["/api/students", id],
    queryFn: () => api.get<any>(`/students/${id}`),
    enabled: !!id,
  });
}

export function useStudentStats(id: string) {
  return useQuery({
    queryKey: ["/api/students/stats", id],
    queryFn: () => api.get<any>(`/students/${id}/stats`),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/students", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students"] }),
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<any>(`/students/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students"] }),
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/students/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students"] }),
  });
}
