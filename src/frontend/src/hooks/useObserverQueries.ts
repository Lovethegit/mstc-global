import { useMutation } from "@tanstack/react-query";
import { createActor } from "../backend";
import { useActor } from "./useActor";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ObserverCode = {
  id: string;
  code: string;
  labelText: string;
  permissions: string[];
  expiryType: string;
  expiresAt: bigint | null;
  isActive: boolean;
  useCount: bigint;
  lastUsedAt: bigint | null;
  createdAt: bigint;
  createdBy: string;
};

type ActorWithObserver = {
  validateObserverCode: (code: string) => Promise<[] | [ObserverCode]>;
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useValidateObserverCode() {
  const { actor } = useActor(createActor);
  return useMutation<ObserverCode | null, Error, string>({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (
        actor as unknown as ActorWithObserver
      ).validateObserverCode(code);
      // Motoko optional: [] = null, [value] = some
      if (Array.isArray(result) && result.length === 0) return null;
      if (Array.isArray(result) && result.length > 0)
        return result[0] as ObserverCode;
      return null;
    },
  });
}
