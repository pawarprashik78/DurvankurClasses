import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTests(params?: { status?: string; standard?: string }) {
  const qs = new URLSearchParams();
  if (params?.status)   qs.set("status",   params.status);
  if (params?.standard) qs.set("standard", params.standard);
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery({
    queryKey: ["/api/tests", params],
    queryFn: () => api.get<any[]>(`/tests${query}`),
  });
}

export function useCreateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/tests", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tests"] }),
  });
}

export function useUpdateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<any>(`/tests/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tests"] }),
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/tests/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tests"] }),
  });
}
