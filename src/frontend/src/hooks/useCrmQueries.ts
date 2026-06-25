import { createActor } from "@/backend";
import type {
  Campaign,
  Client,
  CommissionInvoice,
  CrmAppointment,
  DashboardStat,
  Event_,
  FinancialMetric,
  Lead,
  Proposal,
  ReviewRecord,
} from "@/backend";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ── Leads ─────────────────────────────────────────────────────────────────────

export function useLeads() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["crm", "leads"],
    queryFn: async () => {
      if (!actor) return [] as Lead[];
      return actor.getLeads() as any as Lead[];
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useLeadsByStage(stage: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<any>({
    queryKey: ["crm", "leads", "stage", stage],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrmLeadsByStage(stage);
    },
    enabled: !!actor && !isFetching && stage.length > 0,
    staleTime: 15_000,
  });
}

// ── Clients ───────────────────────────────────────────────────────────────────

export function useClients() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["crm", "clients"],
    queryFn: async (): Promise<Client[]> => {
      if (!actor) return [];
      return actor.getClients() as any;
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Appointments ──────────────────────────────────────────────────────────────

export function useCrmAppointments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CrmAppointment[]>({
    queryKey: ["crm", "appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrmAppointments();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

// ── Proposals ─────────────────────────────────────────────────────────────────

export function useProposals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Proposal[]>({
    queryKey: ["crm", "proposals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProposals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Events ────────────────────────────────────────────────────────────────────

export function useEvents() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Event_[]>({
    queryKey: ["crm", "events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Invoices ──────────────────────────────────────────────────────────────────

export function useInvoices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommissionInvoice[]>({
    queryKey: ["crm", "invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommissionInvoices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Financial Metrics ─────────────────────────────────────────────────────────

export function useFinancialMetrics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FinancialMetric[]>({
    queryKey: ["crm", "financialMetrics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFinancialMetrics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useCrmNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["crm", "notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrmNotifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export function useCrmDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DashboardStat[]>({
    queryKey: ["crm", "dashboardStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrmDashboardStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export function useCampaigns() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Campaign[]>({
    queryKey: ["crm", "campaigns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCampaigns();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export function useReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReviewRecord[]>({
    queryKey: ["crm", "reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
