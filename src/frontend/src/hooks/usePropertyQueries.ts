import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { PropertyListing } from "../backend";
import { useActor } from "./useActor";

// Admin token constant
const ADMIN_TOKEN = "Lovemstc@2019";

// ── Queries ────────────────────────────────────────────────────────────────────

export function useProperties(
  filters: {
    propertyType: string;
    action: string;
    location: string;
    bhk: string;
    furnishing: string;
    minPrice: bigint;
    maxPrice: bigint;
  },
  enabled = true,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyListing[]>({
    queryKey: [
      "properties",
      filters.propertyType,
      filters.action,
      filters.location,
      filters.bhk,
      filters.furnishing,
      filters.minPrice.toString(),
      filters.maxPrice.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getProperties(
        filters.propertyType,
        filters.action,
        filters.location,
        filters.bhk,
        filters.furnishing,
        filters.minPrice,
        filters.maxPrice,
      ) as any;
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 30_000,
  });
}

export function usePropertiesForAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyListing[]>({
    queryKey: ["propertiesAdmin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPropertiesForAdmin() as any;
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useGetPropertyCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["propertyCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPropertyCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function usePropertyById(id: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PropertyListing | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPropertyById(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 30_000,
  });
}

// ── Admin CRUD Mutations ───────────────────────────────────────────────────────

export function useAddProperty() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listing: PropertyListing) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addProperty(
        (listing as any).title || "",
        (listing as any).propertyType || (listing as any).type || "Residential",
        (listing as any).location || (listing as any).city || "",
        BigInt((listing as any).price || 0),
        BigInt((listing as any).area || 0),
        (listing as any).description || "",
      ) as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["propertiesAdmin"] });
      qc.invalidateQueries({ queryKey: ["propertyCount"] });
    },
  });
}

export function useUpdateProperty() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; listing: PropertyListing }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProperty(
        vars.id,
        (vars.listing as any).title || "",
        ((vars.listing as any).status || "Active") as any,
        (vars.listing as any).description || "",
      ) as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["propertiesAdmin"] });
      qc.invalidateQueries({ queryKey: ["propertyCount"] });
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProperty(id) as any;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["propertiesAdmin"] });
      qc.invalidateQueries({ queryKey: ["propertyCount"] });
    },
  });
}

// ── Bulk Import Mutation ───────────────────────────────────────────────────────

export interface BulkImportProgress {
  batchIndex: number;
  totalBatches: number;
  totalAdded: number;
  totalRows: number;
}

export interface BulkImportError {
  rowIndex: number;
  id: string;
  reason: string;
}

export interface BulkImportResult {
  added: number;
  updated: number;
  skipped: number;
  errors: BulkImportError[];
}

/**
 * Imports properties in 500-row batches.
 * Within each batch, rows are processed concurrently (Promise.allSettled).
 * Accepts an optional onProgress callback for per-batch UI updates.
 *
 * Usage:
 *   const bulkAdd = useBulkAddProperties();
 *   await bulkAdd.mutateAsync({ listings, onProgress });
 */
export function useBulkAddProperties() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listings,
      onProgress,
    }: {
      listings: PropertyListing[];
      onProgress?: (progress: BulkImportProgress) => void;
    }): Promise<BulkImportResult> => {
      if (!actor) throw new Error("Actor not ready");

      const BATCH_SIZE = 500;
      const batches: PropertyListing[][] = [];
      for (let i = 0; i < listings.length; i += BATCH_SIZE) {
        batches.push(listings.slice(i, i + BATCH_SIZE));
      }

      let totalAdded = 0;
      let totalUpdated = 0;
      let totalSkipped = 0;
      const allErrors: BulkImportError[] = [];

      for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        const batch = batches[batchIdx];
        const globalOffset = batchIdx * BATCH_SIZE;

        // Use bulkAddProperties — backend handles deduplication by ID
        // and returns structured per-row results
        const batchResult = await actor.bulkAddProperties(ADMIN_TOKEN, batch);

        totalAdded += Number(batchResult.added);
        totalUpdated += Number(batchResult.updated);
        totalSkipped += Number(batchResult.skipped);

        // Collect errors (offset row index by batch position)
        for (const e of batchResult.errors) {
          if (allErrors.length < 200) {
            allErrors.push({
              rowIndex: globalOffset + Number(e.rowIndex) + 1,
              id: e.id,
              reason: e.reason,
            });
          }
        }

        // Report progress after each batch
        onProgress?.({
          batchIndex: batchIdx + 1,
          totalBatches: batches.length,
          totalAdded: totalAdded + totalUpdated,
          totalRows: listings.length,
        });

        // Yield to the event loop so the UI can repaint
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }

      return {
        added: totalAdded,
        updated: totalUpdated,
        skipped: totalSkipped,
        errors: allErrors,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["propertiesAdmin"] });
      qc.invalidateQueries({ queryKey: ["propertyCount"] });
    },
  });
}

// ── Enquiry Mutations ──────────────────────────────────────────────────────────

export function useSubmitPropertyEnquiry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      propertyId: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      customerMessage: string;
      preferredTime: string;
      visitDate: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitPropertyEnquiry(
        vars.propertyId,
        vars.customerName,
        vars.customerPhone,
        vars.customerEmail,
        vars.customerMessage,
        vars.preferredTime,
        vars.visitDate,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["propertyEnquiries"] });
      qc.invalidateQueries({ queryKey: ["propertyEnquiryCount"] });
      qc.invalidateQueries({ queryKey: ["newEnquiryCount"] });
    },
  });
}

// ── Property Alert Subscription ───────────────────────────────────────────────

export function useSubmitPropertyAlert() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      phone: string;
      email: string;
      propertyType: string;
      actionType: string;
      locationPreference: string;
      maxBudget: string;
      bhk: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logServiceSubmission(
        "property-portal",
        "Property Alert",
        "AlertSubscription",
        [
          ["propertyType", vars.propertyType],
          ["actionType", vars.actionType],
          ["locationPreference", vars.locationPreference],
          ["maxBudget", vars.maxBudget],
          ["bhk", vars.bhk],
        ],
        vars.name,
        vars.phone,
        vars.email,
        true,
      );
    },
  });
}

// ── Visit Request ─────────────────────────────────────────────────────────────

export function useSubmitVisitRequest() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (vars: {
      propertyId: string;
      propertyTitle: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      preferredDate: string;
      preferredSlot: string;
      visitType: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logServiceSubmission(
        "property-portal",
        "Site Visit Request",
        "VisitRequest",
        [
          ["propertyId", vars.propertyId],
          ["propertyTitle", vars.propertyTitle],
          ["preferredDate", vars.preferredDate],
          ["preferredSlot", vars.preferredSlot],
          ["visitType", vars.visitType],
        ],
        vars.customerName,
        vars.customerPhone,
        vars.customerEmail,
        true,
      );
    },
  });
}

// ── View Tracking (fire-and-forget) ───────────────────────────────────────────

export function useIncrementPropertyView() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!actor) return;
      // Best-effort: log as service submission
      return actor.logServiceSubmission(
        "property-portal",
        "Property View",
        "ViewTracking",
        [["propertyId", propertyId]],
        "anonymous",
        "",
        "",
        true,
      );
    },
  });
}

// ── Price History (static simulation) ────────────────────────────────────────

export interface PriceHistoryPoint {
  month: string;
  price: number;
}

/**
 * Returns simulated 12-month price history for a property.
 * When backend supports getPriceHistory, replace this.
 */
export function useGetPriceHistory(propertyId: string, basePrice: number) {
  return useQuery<PriceHistoryPoint[]>({
    queryKey: ["priceHistory", propertyId],
    queryFn: async () => {
      const now = new Date();
      return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const label = d.toLocaleString("en-IN", {
          month: "short",
          year: "2-digit",
        });
        // Simulate gentle upward trend with small variance
        const factor = 0.92 + (i / 11) * 0.1 + Math.sin(i * 1.3) * 0.015;
        return { month: label, price: Math.round(basePrice * factor) };
      });
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!propertyId && basePrice > 0,
  });
}
