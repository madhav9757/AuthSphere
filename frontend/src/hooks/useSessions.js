import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  revokeAllSessions,
} from "@/api/SessionAPI";
import { toast } from "sonner";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
    staleTime: 1000 * 60, // 1 minute
  });

  const revokeMutation = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session revoked successfully");
    },
    onError: () => toast.error("Failed to revoke session"),
  });

  const revokeOthersMutation = useMutation({
    mutationFn: revokeAllOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("All other sessions revoked");
    },
    onError: () => toast.error("Failed to revoke sessions"),
  });

  const revokeAllMutation = useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: () => {
      // No need to invalidate as we will likely be logged out
      toast.success("All sessions revoked");
    },
    onError: () => toast.error("Failed to revoke all sessions"),
  });

  return {
    sessions: sessionsQuery.data?.data || [],
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    revokeSession: (id) => revokeMutation.mutate(id),
    revokeOthers: () => revokeOthersMutation.mutate(),
    revokeAll: () => revokeAllMutation.mutate(),
    isRevoking:
      revokeMutation.isPending ||
      revokeOthersMutation.isPending ||
      revokeAllMutation.isPending,
  };
};
