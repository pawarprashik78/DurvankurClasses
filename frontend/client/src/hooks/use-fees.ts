import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFees() {
  return useQuery({
    queryKey: ["/api/fees"],
    queryFn: () => api.get<any[]>("/fees"),
  });
}

export function useMyFees() {
  return useQuery({
    queryKey: ["/api/fees/my"],
    queryFn: () => api.get<any[]>("/fees/my"),
  });
}

export function useStudentFees(studentId: string) {
  return useQuery({
    queryKey: ["/api/fees/student", studentId],
    queryFn: () => api.get<any[]>(`/fees/student/${studentId}`),
    enabled: !!studentId,
  });
}

export function useFeeStats(studentId: string) {
  return useQuery({
    queryKey: ["/api/fees/stats", studentId],
    queryFn: () => api.get<any>(`/fees/stats/${studentId}`),
    enabled: !!studentId,
  });
}

export function useCreateFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/fees", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/fees"] }),
  });
}

export function useUpdateFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<any>(`/fees/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/fees"] }),
  });
}

export function useDeleteFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/fees/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/fees"] }),
  });
}
