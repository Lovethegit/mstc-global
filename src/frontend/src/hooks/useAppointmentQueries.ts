import { createActor } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddAppointment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      clientName: string;
      clientPhone: string;
      clientEmail: string;
      type: string;
      service: string;
      preferredDate: string;
      preferredTime: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.addAppointment(
        payload.clientName,
        payload.clientPhone,
        payload.clientEmail,
        payload.type,
        payload.service,
        payload.preferredDate,
        payload.preferredTime,
        payload.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
