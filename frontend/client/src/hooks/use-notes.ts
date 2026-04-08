import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useNotes(params?: { subjectId?: string; standard?: string; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.subjectId) qs.set("subjectId", params.subjectId);
  if (params?.standard)  qs.set("standard",  params.standard);
  if (params?.type)      qs.set("type",       params.type);
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery({
    queryKey: ["/api/notes", params],
    queryFn: () => api.get<any[]>(`/notes${query}`),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/notes", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notes"] }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<any>(`/notes/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notes"] }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notes"] }),
  });
}
