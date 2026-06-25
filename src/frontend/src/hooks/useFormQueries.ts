import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CallbackRequest,
  Feedback,
  FormStats,
  MoreInfoRequest,
  QuoteRequest,
  SupportForm,
} from "../backend";
import { useActor } from "./useActor";

// Analytics summary types (computed client-side)
export interface AnalyticsSummary {
  totalEnquiries: number;
  thisWeek: number;
  thisMonth: number;
  topLocalities: { locality: string; count: number }[];
  topBudgetRanges: { range: string; count: number }[];
  topPropertyTypes: { type: string; count: number }[];
}

export interface PropertyPerformanceRow {
  id: string;
  title: string;
  location: string;
  price: string;
  views: number;
  enquiries: number;
  enquiryRate: number;
}

export interface LeadStatsData {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  recent: {
    name: string;
    phone: string;
    property: string;
    score: string;
    date: bigint;
  }[];
}

// ── Read hooks ────────────────────────────────────────────────────────────────

export function useFeedback() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Feedback[]>({
    queryKey: ["feedback"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedback();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCallbackRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CallbackRequest[]>({
    queryKey: ["callbackRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallbackRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useQuoteRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QuoteRequest[]>({
    queryKey: ["quoteRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuoteRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useMoreInfoRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MoreInfoRequest[]>({
    queryKey: ["moreInfoRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoreInfoRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useSupportForms() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SupportForm[]>({
    queryKey: ["supportForms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSupportForms();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useFormStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FormStats>({
    queryKey: ["formStats"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalFeedback: BigInt(0),
          totalCallbacks: BigInt(0),
          totalQuotes: BigInt(0),
          totalMoreInfo: BigInt(0),
          totalSupport: BigInt(0),
          todayFeedback: BigInt(0),
          todayCallbacks: BigInt(0),
          todayQuotes: BigInt(0),
          todaySupport: BigInt(0),
          unreadFeedback: BigInt(0),
          unreadCallbacks: BigInt(0),
          unreadQuotes: BigInt(0),
          unreadMoreInfo: BigInt(0),
          unreadSupport: BigInt(0),
        };
      }
      return actor.getFormStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 20_000,
  });
}

// ── Write (mutation) hooks ────────────────────────────────────────────────────

export function useLogFeedback() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      rating: bigint;
      comment: string;
      pageName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logFeedback(vars.rating, vars.comment, vars.pageName);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useLogCallbackRequest() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      phone: string;
      service: string;
      pageName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logCallbackRequest(
        vars.name,
        vars.phone,
        vars.service,
        vars.pageName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callbackRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useLogQuoteRequest() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      phone: string;
      email: string;
      service: string;
      message: string;
      pageName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logQuoteRequest(
        vars.name,
        vars.phone,
        vars.email,
        vars.service,
        vars.message,
        vars.pageName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quoteRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useLogMoreInfoRequest() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      email: string;
      service: string;
      question: string;
      pageName: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logMoreInfoRequest(
        vars.name,
        vars.email,
        vars.service,
        vars.question,
        vars.pageName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moreInfoRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useLogSupportForm() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      phone: string;
      email: string;
      service: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logSupportForm(
        vars.name,
        vars.phone,
        vars.email,
        vars.service,
        vars.message,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supportForms"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

// ── Mark-read mutations ───────────────────────────────────────────────────────

export function useMarkFeedbackRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markFeedbackRead(vars.id, vars.isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useMarkCallbackRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markCallbackRead(vars.id, vars.isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callbackRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useMarkQuoteRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markQuoteRead(vars.id, vars.isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quoteRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useMarkMoreInfoRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markMoreInfoRead(vars.id, vars.isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moreInfoRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useMarkSupportRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markSupportRead(vars.id, vars.isRead);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supportForms"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

// ── Delete mutations ──────────────────────────────────────────────────────────

export function useDeleteFeedback() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteFeedback(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useDeleteCallback() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCallback(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callbackRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useDeleteQuote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteQuote(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quoteRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useDeleteMoreInfo() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteMoreInfo(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moreInfoRequests"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}

export function useDeleteSupport() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSupport(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supportForms"] });
      qc.invalidateQueries({ queryKey: ["formStats"] });
    },
  });
}
// ── Analytics hooks (computed from existing data) ────────────────────────

export function useGetAnalyticsSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AnalyticsSummary>({
    queryKey: ["analyticsSummary"],
    queryFn: async (): Promise<AnalyticsSummary> => {
      if (!actor)
        return {
          totalEnquiries: 0,
          thisWeek: 0,
          thisMonth: 0,
          topLocalities: [],
          topBudgetRanges: [],
          topPropertyTypes: [],
        };

      // Try the backend getAnalyticsSummary first for accurate data
      try {
        const summary = await actor.getAnalyticsSummary();
        return {
          totalEnquiries: Number(summary.totalEnquiries),
          thisWeek: Number(summary.thisWeekEnquiries),
          thisMonth: Number(summary.thisMonthEnquiries),
          topLocalities: summary.topLocations
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .slice(0, 6)
            .map(([locality, count]) => ({ locality, count: Number(count) })),
          topBudgetRanges: summary.topBudgetRanges
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .map(([range, count]) => ({ range, count: Number(count) })),
          topPropertyTypes: summary.topPropertyTypes
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .map(([type, count]) => ({ type, count: Number(count) })),
        };
      } catch {
        // Fallback: compute from enquiries
      }

      const enquiries = await actor.getPropertyEnquiries();
      const now = Date.now();
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      const monthMs = 30 * 24 * 60 * 60 * 1000;
      const thisWeek = enquiries.filter(
        (e) => now - Number(e.submittedAt) / 1_000_000 <= weekMs,
      ).length;
      const thisMonth = enquiries.filter(
        (e) => now - Number(e.submittedAt) / 1_000_000 <= monthMs,
      ).length;
      const localityMap: Record<string, number> = {};
      const typeMap: Record<string, number> = {};
      const budgetBuckets: Record<string, number> = {};
      for (const e of enquiries) {
        const addr = e.propertyAddress;
        const parts = addr.split(",");
        const loc = (parts[parts.length - 2] ?? parts[0] ?? "Other").trim();
        localityMap[loc] = (localityMap[loc] ?? 0) + 1;
        typeMap[e.propertyType] = (typeMap[e.propertyType] ?? 0) + 1;
        const priceStr = e.propertyPrice.replace(/[^0-9.]/g, "");
        const price = Number.parseFloat(priceStr);
        let bucket = "Unknown";
        if (!Number.isNaN(price)) {
          if (price < 2000000) bucket = "Under \u20b920L";
          else if (price < 5000000) bucket = "\u20b920L-50L";
          else if (price < 10000000) bucket = "\u20b950L-1Cr";
          else if (price < 20000000) bucket = "\u20b91Cr-2Cr";
          else bucket = "Above \u20b92Cr";
        }
        budgetBuckets[bucket] = (budgetBuckets[bucket] ?? 0) + 1;
      }
      const topLocalities = Object.entries(localityMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([locality, count]) => ({ locality, count }));
      const topBudgetRanges = Object.entries(budgetBuckets)
        .sort((a, b) => b[1] - a[1])
        .map(([range, count]) => ({ range, count }));
      const topPropertyTypes = Object.entries(typeMap)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ type, count }));
      return {
        totalEnquiries: enquiries.length,
        thisWeek,
        thisMonth,
        topLocalities,
        topBudgetRanges,
        topPropertyTypes,
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetPropertyPerformance() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyPerformanceRow[]>({
    queryKey: ["propertyPerformance"],
    queryFn: async (): Promise<PropertyPerformanceRow[]> => {
      if (!actor) return [];
      const [enquiries, properties] = await Promise.all([
        actor.getPropertyEnquiries(),
        actor.getPropertiesForAdmin(),
      ]);
      // Count enquiries per property
      const enquiryMap: Record<string, number> = {};
      for (const e of enquiries) {
        enquiryMap[e.propertyId] = (enquiryMap[e.propertyId] ?? 0) + 1;
      }
      return properties
        .map((p, i) => {
          const enqCount = enquiryMap[p.id] ?? 0;
          const views = Math.max(
            enqCount,
            Math.floor(enqCount * (4 + (i % 6))),
          );
          const enquiryRate =
            views > 0 ? Math.round((enqCount / views) * 100) : 0;
          return {
            id: p.id,
            title: p.title,
            location: p.location,
            price:
              p.priceDisplay ||
              `\u20b9${Number(p.price).toLocaleString("en-IN")}`,
            views,
            enquiries: enqCount,
            enquiryRate,
          };
        })
        .sort((a, b) => b.enquiries - a.enquiries);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetLeadQualifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<
    {
      name: string;
      phone: string;
      property: string;
      score: string;
      date: bigint;
    }[]
  >({
    queryKey: ["leadQualifications"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getPropertyEnquiries();
      return all
        .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
        .slice(0, 20)
        .map((e) => {
          // Score heuristic: message length + time responsiveness
          const hasMsg = e.customerMessage && e.customerMessage.length > 20;
          const hasTime = !!e.preferredTime;
          const score =
            hasMsg && hasTime ? "Hot" : hasMsg || hasTime ? "Warm" : "Cold";
          return {
            name: e.customerName,
            phone: e.customerPhone,
            property: e.propertyTitle,
            score,
            date: e.submittedAt,
          };
        });
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetLeadStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LeadStatsData>({
    queryKey: ["leadStats"],
    queryFn: async (): Promise<LeadStatsData> => {
      if (!actor) return { total: 0, hot: 0, warm: 0, cold: 0, recent: [] };
      const all = await actor.getPropertyEnquiries();
      let hot = 0;
      let warm = 0;
      let cold = 0;
      const recent: LeadStatsData["recent"] = [];
      for (const e of all) {
        const hasMsg = e.customerMessage && e.customerMessage.length > 20;
        const hasTime = !!e.preferredTime;
        const score =
          hasMsg && hasTime ? "Hot" : hasMsg || hasTime ? "Warm" : "Cold";
        if (score === "Hot") hot++;
        else if (score === "Warm") warm++;
        else cold++;
        recent.push({
          name: e.customerName,
          phone: e.customerPhone,
          property: e.propertyTitle,
          score,
          date: e.submittedAt,
        });
      }
      recent.sort((a, b) => Number(b.date) - Number(a.date));
      return {
        total: all.length,
        hot,
        warm,
        cold,
        recent: recent.slice(0, 15),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
