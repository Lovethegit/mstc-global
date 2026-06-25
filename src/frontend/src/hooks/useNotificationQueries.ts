import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Notification } from "../backend";
import { useActor } from "./useActor";

// ── Read hooks ────────────────────────────────────────────────────────────────

export function useNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["unreadNotificationCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUnreadNotificationCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

// ── Write (mutation) hooks ────────────────────────────────────────────────────

export function useMarkAllRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markAllNotificationsRead();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}

export function useMarkRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markNotificationRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}
