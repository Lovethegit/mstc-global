import { createActor } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ReferralRecord {
  code: string;
  creatorName: string;
  creatorPhone: string;
  creatorEmail: string;
  clicks: number;
  enquiries: number;
  createdAt: string;
}

/** Generate a random referral code, stored in-memory/session only (frontend) */
function genCode(name: string): string {
  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${initials}${rand}`;
}

// Session-scoped in-memory store for referrals (persisted in localStorage for demo)
function loadReferrals(): ReferralRecord[] {
  try {
    const raw = localStorage.getItem("mstc_referrals");
    return raw ? (JSON.parse(raw) as ReferralRecord[]) : [];
  } catch {
    return [];
  }
}

function saveReferrals(refs: ReferralRecord[]): void {
  try {
    localStorage.setItem("mstc_referrals", JSON.stringify(refs));
  } catch {
    // ignore
  }
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
    }): Promise<string> => {
      const code = genCode(data.name || "USR");
      const refs = loadReferrals();
      const record: ReferralRecord = {
        code,
        creatorName: data.name,
        creatorPhone: data.phone,
        creatorEmail: data.email,
        clicks: 0,
        enquiries: 0,
        createdAt: new Date().toISOString(),
      };
      refs.push(record);
      saveReferrals(refs);
      return code;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}

export function useGetReferralByCode(code: string) {
  return useQuery<ReferralRecord | null>({
    queryKey: ["referral", code],
    queryFn: async () => {
      const refs = loadReferrals();
      return refs.find((r) => r.code === code) ?? null;
    },
    enabled: !!code,
  });
}

export function useLogReferralClick() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const refs = loadReferrals();
      const idx = refs.findIndex((r) => r.code === code);
      if (idx !== -1) {
        refs[idx] = { ...refs[idx], clicks: refs[idx].clicks + 1 };
        saveReferrals(refs);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}

export function useGetAllReferrals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReferralRecord[]>({
    queryKey: ["referrals"],
    queryFn: async () => {
      // Try backend first, fall back to localStorage
      if (actor) {
        try {
          const res = await (
            actor as unknown as {
              getAllReferrals?: () => Promise<ReferralRecord[]>;
            }
          ).getAllReferrals?.();
          if (res && Array.isArray(res)) return res;
        } catch {
          // ignore
        }
      }
      return loadReferrals();
    },
    enabled: !isFetching,
    staleTime: 10_000,
  });
}

export function useDeleteReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const refs = loadReferrals().filter((r) => r.code !== code);
      saveReferrals(refs);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}
