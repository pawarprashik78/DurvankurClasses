import { QueryClient } from "@tanstack/react-query";
import { getToken, logout } from "./api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30_000,   // 30 s — real data can go stale
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
