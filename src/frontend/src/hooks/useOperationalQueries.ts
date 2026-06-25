import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Appointment, Invoice, SiteVisit } from "../backend";
import { useActor } from "./useActor";

// ── Invoice hooks ─────────────────────────────────────────────────────────────

export function useInvoices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInvoices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useAddInvoice() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      invoiceNumber: string;
      clientName: string;
      clientPhone: string;
      clientEmail: string;
      service: string;
      totalAmount: number;
      taxAmount: number;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addInvoice(
        vars.invoiceNumber,
        vars.clientName,
        vars.clientPhone,
        vars.clientEmail,
        vars.service,
        vars.totalAmount,
        vars.taxAmount,
        vars.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

// ── Appointment hooks ─────────────────────────────────────────────────────────

export function useAppointments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAppointments();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useAddAppointment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      clientName: string;
      clientPhone: string;
      clientEmail: string;
      type_: string;
      service: string;
      preferredDate: string;
      preferredTime: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addAppointment(
        vars.clientName,
        vars.clientPhone,
        vars.clientEmail,
        vars.type_,
        vars.service,
        vars.preferredDate,
        vars.preferredTime,
        vars.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

// ── Site Visit hooks ────────────────────────────────────────────────────────────

export function useSiteVisits() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SiteVisit[]>({
    queryKey: ["siteVisits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSiteVisits();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useAddSiteVisit() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      clientName: string;
      clientPhone: string;
      propertyAddress: string;
      scheduledDate: bigint;
      scheduledTime: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addSiteVisit(
        vars.clientName,
        vars.clientPhone,
        vars.propertyAddress,
        vars.scheduledDate,
        vars.scheduledTime,
        vars.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteVisits"] });
    },
  });
}
