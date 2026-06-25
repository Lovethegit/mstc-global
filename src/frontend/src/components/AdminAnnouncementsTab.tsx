import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Calendar,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { createActor } from "../backend";
import type { Announcement } from "../backend";
import { useActor } from "../hooks/useActor";

const BG_OPTIONS = [
  { value: "#c9a84c", label: "Gold" },
  { value: "#1a1a2e", label: "Dark Blue" },
  { value: "#7f1d1d", label: "Deep Red" },
  { value: "#064e3b", label: "Forest Green" },
  { value: "#06090f", label: "Obsidian" },
];

export default function AdminAnnouncementsTab() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    ctaText: "Learn More",
    ctaUrl: "/",
    bgColor: "#c9a84c",
    scheduledAt: "",
    expiresAt: "",
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllAnnouncements();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("no actor");
      const scheduledAt: bigint | null = form.scheduledAt
        ? BigInt(Math.floor(new Date(form.scheduledAt).getTime() * 1_000_000))
        : null;
      const expiresAt: bigint | null = form.expiresAt
        ? BigInt(Math.floor(new Date(form.expiresAt).getTime() * 1_000_000))
        : null;
      return await actor.addAnnouncement(
        form.title,
        form.message,
        form.ctaText,
        form.ctaUrl,
        form.bgColor,
        scheduledAt,
        expiresAt,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      setShowForm(false);
      setForm({
        title: "",
        message: "",
        ctaText: "Learn More",
        ctaUrl: "/",
        bgColor: "#c9a84c",
        scheduledAt: "",
        expiresAt: "",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!actor) throw new Error("no actor");
      return await actor.toggleAnnouncement(id, isActive);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("no actor");
      return await actor.deleteAnnouncement(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const getStatus = (ann: Announcement) => {
    if (!ann.isActive) return { label: "Inactive", color: "text-gray-400" };
    const now = Date.now() * 1_000_000;
    if (ann.scheduledAt && Number(ann.scheduledAt) > now)
      return { label: "Scheduled", color: "text-blue-400" };
    if (ann.expiresAt && Number(ann.expiresAt) < now)
      return { label: "Expired", color: "text-red-400" };
    return { label: "Active", color: "text-green-400" };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-yellow-400">
            Site Announcements
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage banners and announcements shown to site visitors
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
          data-ocid="announcements.open_modal_button"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div
          className="bg-black/40 border border-yellow-600/20 rounded-2xl p-6 space-y-4"
          data-ocid="announcements.dialog"
        >
          <h3 className="font-semibold text-white">Create New Announcement</h3>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title *"
            className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            data-ocid="announcements.input"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message *"
            rows={3}
            className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
            data-ocid="announcements.textarea"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              placeholder="Button Text"
              className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
            <input
              value={form.ctaUrl}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              placeholder="Button URL (e.g. /property-portal)"
              className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, bgColor: opt.value })}
                style={{ backgroundColor: opt.value }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all text-white ${form.bgColor === opt.value ? "border-white" : "border-transparent"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Schedule (optional)
              </label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Expires (optional)
              </label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                className="w-full bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 border border-yellow-600/30 text-gray-400 rounded-xl hover:border-yellow-400 text-sm"
              data-ocid="announcements.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={!form.title || !form.message || addMutation.isPending}
              className="flex-1 py-2.5 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 disabled:opacity-50 text-sm"
              data-ocid="announcements.submit_button"
            >
              {addMutation.isPending ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(announcements as Announcement[]).length === 0 && (
          <div
            className="text-center py-12 text-gray-500"
            data-ocid="announcements.empty_state"
          >
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>
              No announcements yet. Create one to show banners to site visitors.
            </p>
          </div>
        )}
        {(announcements as Announcement[]).map((ann, i) => {
          const status = getStatus(ann);
          return (
            <div
              key={String(ann.id)}
              className="bg-black/40 border border-yellow-600/20 rounded-xl p-4"
              data-ocid={`announcements.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-white truncate">
                      {String(ann.title)}
                    </h4>
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {String(ann.message)}
                  </p>
                  {ann.ctaText && (
                    <p className="text-xs text-yellow-400/60 mt-1">
                      CTA: &quot;{String(ann.ctaText)}&quot; →{" "}
                      {String(ann.ctaUrl)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: String(ann.id),
                        isActive: !ann.isActive,
                      })
                    }
                    title={ann.isActive ? "Deactivate" : "Activate"}
                    data-ocid={`announcements.toggle.${i + 1}`}
                  >
                    {ann.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-400 hover:text-green-300" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500 hover:text-gray-300" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(String(ann.id))}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                    data-ocid={`announcements.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
