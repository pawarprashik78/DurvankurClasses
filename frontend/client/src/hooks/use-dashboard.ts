import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => api.get<any>("/dashboard/stats"),
  });
}
