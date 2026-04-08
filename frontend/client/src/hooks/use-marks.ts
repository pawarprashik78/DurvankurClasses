import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMarks() {
  return useQuery({
    queryKey: ["/api/marks"],
    queryFn: () => api.get<any[]>("/marks"),
  });
}

export function useStudentMarks(studentId: string) {
  return useQuery({
    queryKey: ["/api/marks/student", studentId],
    queryFn: () => api.get<any[]>(`/marks/student/${studentId}`),
    enabled: !!studentId,
  });
}

/** Student/Parent: test results via /api/test-results */
export function useTestResults(testType?: string) {
  const params = testType ? `?testType=${testType}` : "";
  return useQuery({
    queryKey: ["/api/test-results", testType],
    queryFn: () => api.get<any[]>(`/test-results${params}`),
  });
}

export function useCreateMark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/marks", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/marks"] }),
  });
}

export function useUpdateMark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<any>(`/marks/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/marks"] }),
  });
}

export function useDeleteMark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/marks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/marks"] }),
  });
}
