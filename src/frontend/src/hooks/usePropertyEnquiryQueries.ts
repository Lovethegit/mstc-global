import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PropertyEnquiry } from "../backend";
import { createActor } from "../backend";
import { useActor } from "./useActor";

// ── Read hooks ────────────────────────────────────────────────────────────────

export function usePropertyEnquiries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyEnquiry[]>({
    queryKey: ["propertyEnquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyEnquiries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function usePropertyEnquiriesByStatus(status: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyEnquiry[]>({
    queryKey: ["propertyEnquiries", "byStatus", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertyEnquiriesByStatus(status);
    },
    enabled: !!actor && !isFetching && status !== "All",
    staleTime: 15_000,
  });
}

export function usePropertyEnquiryCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["propertyEnquiryCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPropertyEnquiryCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

export function useNewEnquiryCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["newEnquiryCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getNewEnquiryCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Mutation hooks ────────────────────────────────────────────────────────────

export function useUpdateEnquiryStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; status: string; notes: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateEnquiryStatus(vars.id, vars.status, vars.notes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["propertyEnquiries"] });
      qc.invalidateQueries({ queryKey: ["propertyEnquiryCount"] });
      qc.invalidateQueries({ queryKey: ["newEnquiryCount"] });
    },
  });
}

export function useMarkContacted() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markEnquiryContacted(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["propertyEnquiries"] });
      qc.invalidateQueries({ queryKey: ["newEnquiryCount"] });
    },
  });
}

// ── Lead pipeline hooks (client-side computed from enquiries) ─────────────────

export type LeadStage =
  | "New"
  | "Contacted"
  | "Site Visit"
  | "Closed Won"
  | "Closed Lost";
export const LEAD_STAGES: LeadStage[] = [
  "New",
  "Contacted",
  "Site Visit",
  "Closed Won",
  "Closed Lost",
];

export function useGetLeadsByStage(stage: LeadStage) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyEnquiry[]>({
    queryKey: ["propertyEnquiries", "byLeadStage", stage],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getPropertyEnquiries();
      return all.filter((e) => e.status === stage);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useGetLeadPipelineStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Record<LeadStage, number>>({
    queryKey: ["leadPipelineStats"],
    queryFn: async () => {
      if (!actor)
        return {
          New: 0,
          Contacted: 0,
          "Site Visit": 0,
          "Closed Won": 0,
          "Closed Lost": 0,
        };
      const all = await actor.getPropertyEnquiries();
      const counts: Record<LeadStage, number> = {
        New: 0,
        Contacted: 0,
        "Site Visit": 0,
        "Closed Won": 0,
        "Closed Lost": 0,
      };
      for (const e of all) {
        if (e.status in counts) counts[e.status as LeadStage]++;
      }
      return counts;
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useUpdateLeadStage() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: string;
      stage: LeadStage;
      notes?: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateEnquiryStatus(vars.id, vars.stage, vars.notes ?? "");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["propertyEnquiries"] });
      qc.invalidateQueries({ queryKey: ["leadPipelineStats"] });
      qc.invalidateQueries({ queryKey: ["newEnquiryCount"] });
    },
  });
}
