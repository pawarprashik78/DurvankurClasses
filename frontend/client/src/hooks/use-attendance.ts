import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getRole, getLinkedId } from "@/lib/api";

/** Admin/Teacher: all attendance */
export function useAttendance() {
  return useQuery({
    queryKey: ["/api/attendance"],
    queryFn: () => api.get<any[]>("/attendance"),
  });
}

/** Student/Parent: current week */
export function useAttendanceWeekly() {
  return useQuery({
    queryKey: ["/api/attendance/weekly"],
    queryFn: () => api.get<any[]>("/attendance/weekly"),
  });
}

/** Student/Parent: monthly summary */
export function useAttendanceMonthly() {
  return useQuery({
    queryKey: ["/api/attendance/monthly"],
    queryFn: () => api.get<any[]>("/attendance/monthly"),
  });
}

export function useAttendanceStats(studentId: string) {
  return useQuery({
    queryKey: ["/api/attendance/stats", studentId],
    queryFn: () => api.get<any>(`/attendance/stats/${studentId}`),
    enabled: !!studentId,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<any>("/attendance", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/weekly"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/monthly"] });
    },
  });
}

export function useAbsenceNotifications() {
  return useQuery({
    queryKey: ["/api/notifications/absence"],
    queryFn: () => api.get<any[]>("/notifications/absence"),
  });
}
