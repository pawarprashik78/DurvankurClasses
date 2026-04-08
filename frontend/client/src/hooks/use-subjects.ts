import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSubjects(standard?: string) {
  const query = standard ? `?standard=${standard}` : "";
  return useQuery({
    queryKey: ["/api/subjects", standard],
    queryFn: () => api.get<any[]>(`/subjects${query}`),
  });
}
