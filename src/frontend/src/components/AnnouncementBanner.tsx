import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useState } from "react";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";
export default function AnnouncementBanner() {
  const { actor } = useActor(createActor);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("mstc_ann_dismissed") ?? "[]");
    } catch {
      return [];
    }
  });
  const { data: announcements = [] } = useQuery({
    queryKey: ["activeAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActiveAnnouncements();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
    staleTime: 300000,
  });
  const visible = (announcements as any[]).find(
    (a: any) => !dismissed.includes(a.id),
  );
  if (!visible) return null;
  const dismiss = () => {
    const next = [...dismissed, visible.id];
    setDismissed(next);
    try {
      sessionStorage.setItem("mstc_ann_dismissed", JSON.stringify(next));
    } catch {}
  };
  const isDark = !["#c9a84c", "#f0f0f0"].includes(visible.bgColor);
  return (
    <div
      className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium"
      style={{
        backgroundColor: visible.bgColor || "#c9a84c",
        color: isDark ? "#fff" : "#000",
      }}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
        <span className="font-semibold truncate">{visible.title}</span>
        <span className="truncate opacity-80 hidden sm:block">
          — {visible.message}
        </span>
        {visible.ctaText && visible.ctaUrl && (
          <a
            href={visible.ctaUrl}
            className="underline font-bold ml-1 hover:opacity-80 flex-shrink-0"
          >
            {visible.ctaText} →
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="ml-3 flex-shrink-0 hover:opacity-70"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
