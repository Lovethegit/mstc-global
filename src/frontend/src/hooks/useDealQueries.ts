import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Deal__1 } from "../backend";
import { useActor } from "./useActor";

// Use the actual type returned by getDeals()
type DealItem = Deal__1;

// ── Read hooks ────────────────────────────────────────────────────────────────

export function useDeals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DealItem[]>({
    queryKey: ["deals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDeals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

// ── Write (mutation) hooks ────────────────────────────────────────────────────

export function useAddDeal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      clientName: string;
      clientPhone: string;
      clientEmail: string;
      service: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addDeal(
        vars.clientName,
        vars.clientPhone,
        vars.clientEmail,
        vars.service,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useUpdateDealStage() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      stage: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateDealStage(vars.id, vars.stage);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}
