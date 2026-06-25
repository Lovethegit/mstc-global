import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { ChatInteraction, InteractionStats } from "../types/chat";
import { useActor } from "./useActor";

// ── Helpers ──────────────────────────────────────────────────────────────────

type ActorWithChat = {
  getInteractions: (
    offset: bigint,
    limit: bigint,
  ) => Promise<ChatInteraction[]>;
  getInteractionCount: () => Promise<bigint>;
  getInteractionStats: () => Promise<InteractionStats>;
  searchInteractions: (
    q: string,
    offset: bigint,
    limit: bigint,
  ) => Promise<ChatInteraction[]>;
  deleteInteraction: (id: bigint) => Promise<boolean>;
  clearAllInteractions: () => Promise<void>;
  logChatInteraction: (
    sid: string,
    userMsg: string,
    botMsg: string,
  ) => Promise<bigint>;
  getBotResponse: (msg: string) => Promise<string>;
};

// ── Read hooks ────────────────────────────────────────────────────────────────

export function useInteractions(offset: number, limit: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChatInteraction[]>({
    queryKey: ["interactions", offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as ActorWithChat).getInteractions(
        BigInt(offset),
        BigInt(limit),
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useInteractionCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["interactionCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (actor as unknown as ActorWithChat).getInteractionCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInteractionStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<InteractionStats>({
    queryKey: ["interactionStats"],
    queryFn: async () => {
      if (!actor) {
        return {
          total: BigInt(0),
          todayCount: BigInt(0),
          needsAttentionCount: BigInt(0),
          avgMessageLength: BigInt(0),
        };
      }
      return (actor as unknown as ActorWithChat).getInteractionStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useSearchInteractions(
  query: string,
  offset: number,
  limit: number,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChatInteraction[]>({
    queryKey: ["searchInteractions", query, offset, limit],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return (actor as unknown as ActorWithChat).searchInteractions(
        query,
        BigInt(offset),
        BigInt(limit),
      );
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
    staleTime: 5_000,
  });
}

export function useAllInteractions(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChatInteraction[]>({
    queryKey: ["interactions", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as ActorWithChat).getInteractions(
        BigInt(0),
        BigInt(100_000),
      );
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 30_000,
  });
}

export function useDeleteInteraction() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as ActorWithChat).deleteInteraction(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
      qc.invalidateQueries({ queryKey: ["interactionStats"] });
      qc.invalidateQueries({ queryKey: ["interactionCount"] });
    },
  });
}

export function useClearAllInteractions() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as ActorWithChat).clearAllInteractions();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
      qc.invalidateQueries({ queryKey: ["interactionStats"] });
      qc.invalidateQueries({ queryKey: ["interactionCount"] });
      qc.invalidateQueries({ queryKey: ["searchInteractions"] });
    },
  });
}

export function useChatInteraction() {}

// ── Service Submission hook ───────────────────────────────────────────────────

export function useLogServiceSubmission() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      serviceCategory: string;
      innerPage: string;
      formType: string;
      fields: Array<[string, string]>;
      submitterName: string;
      submitterPhone: string;
      submitterEmail: string;
      indemnityAccepted: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logServiceSubmission(
        vars.serviceCategory,
        vars.innerPage,
        vars.formType,
        vars.fields,
        vars.submitterName,
        vars.submitterPhone,
        vars.submitterEmail,
        vars.indemnityAccepted,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["serviceSubmissions"] });
    },
  });
}
