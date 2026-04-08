import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getUserId } from "@/lib/api";

/** Get all messages for the logged-in user */
export function useMessages() {
  return useQuery({
    queryKey: ["/api/messages"],
    queryFn: () => api.get<any[]>("/messages"),
  });
}

/** Unread message count */
export function useUnreadMessageCount() {
  return useQuery({
    queryKey: ["/api/messages/unread-count"],
    queryFn: () => api.get<{ count: number }>("/messages/unread-count"),
    refetchInterval: 30_000, // Poll every 30s for new messages
  });
}

/** Send a new message */
export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      subject: string;
      content: string;
      senderType?: string;
      receiverType?: string;
      receiverId?: string;
    }) => api.post<any>("/messages", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] }),
  });
}

/** Mark a message as read */
export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => api.patch<any>(`/messages/${messageId}/read`),

    // Optimistic update for instant UI response
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/messages"] });
      const previousMessages = queryClient.getQueryData<any[]>(["/api/messages"]);
      queryClient.setQueryData(["/api/messages"], (old: any[] = []) =>
        old.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
      );
      return { previousMessages };
    },

    onError: (_err, _id, context) => {
      if (context?.previousMessages)
        queryClient.setQueryData(["/api/messages"], context.previousMessages);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread-count"] });
    },
  });
}

/** Delete a message */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] }),
  });
}