import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Clock, MessageCircle, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { createActor } from "../backend";
import type { AnniversaryReminder, LeadNurtureReminder } from "../backend";
import { useActor } from "../hooks/useActor";

const REMINDER_TYPES = [
  "Possession Date",
  "Agreement Renewal",
  "Birthday",
  "Follow-up",
  "Custom",
];

export default function AdminRemindersTab() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState<"anniversary" | "nurture">(
    "anniversary",
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    reminderDate: "",
    reminderType: REMINDER_TYPES[0],
    notes: "",
  });

  const { data: anniversaryReminders = [] } = useQuery({
    queryKey: ["anniversaryReminders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAnniversaryReminders();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
  });

  const { data: overdueReminders = [] } = useQuery({
    queryKey: ["overdueReminders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getOverdueLeadReminders();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
    refetchInterval: 60_000,
  });

  const addReminderMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("no actor");
      return await actor.addAnniversaryReminder(
        form.clientName,
        form.phone,
        form.email,
        form.reminderDate,
        form.reminderType,
        form.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["anniversaryReminders"] });
      setShowForm(false);
      setForm({
        clientName: "",
        phone: "",
        email: "",
        reminderDate: "",
        reminderType: REMINDER_TYPES[0],
        notes: "",
      });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("no actor");
      return await actor.dismissLeadReminder(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["overdueReminders"] }),
  });

  const getDaysOverdue = (r: LeadNurtureReminder) => {
    const ms = Date.now() - Number(r.lastContactedAt) / 1_000_000;
    return Math.floor(ms / 86_400_000);
  };

  const overdueColor = (days: number) =>
    days >= 14
      ? "border-red-500/40 bg-red-900/10"
      : days >= 7
        ? "border-orange-500/40 bg-orange-900/10"
        : "border-yellow-500/40 bg-yellow-900/10";

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-serif font-bold text-yellow-400">
        Reminders &amp; Follow-ups
      </h2>
      <div className="flex gap-2">
        {(["anniversary", "nurture"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              activeSection === s
                ? "bg-yellow-500 text-black border-yellow-500"
                : "border-yellow-600/30 text-gray-400 hover:text-white"
            }`}
            data-ocid={`reminders.${s}.tab`}
          >
            {s === "anniversary"
              ? "\uD83D\uDCC5 Client Reminders"
              : "\u23F0 Lead Follow-ups"}
          </button>
        ))}
      </div>

      {activeSection === "anniversary" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Track important client dates and events
            </p>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400"
              data-ocid="reminders.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Reminder
            </button>
          </div>

          {showForm && (
            <div
              className="bg-black/40 border border-yellow-600/20 rounded-xl p-5 space-y-3"
              data-ocid="reminders.dialog"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  placeholder="Client Name *"
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                  data-ocid="reminders.input"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone *"
                  type="tel"
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  type="email"
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  value={form.reminderDate}
                  onChange={(e) =>
                    setForm({ ...form, reminderDate: e.target.value })
                  }
                  type="date"
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
                />
                <select
                  value={form.reminderType}
                  onChange={(e) =>
                    setForm({ ...form, reminderType: e.target.value })
                  }
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
                  data-ocid="reminders.select"
                >
                  {REMINDER_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Notes"
                  className="bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => addReminderMutation.mutate()}
                disabled={
                  !form.clientName ||
                  !form.phone ||
                  !form.reminderDate ||
                  addReminderMutation.isPending
                }
                className="w-full py-2.5 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 disabled:opacity-50 text-sm"
                data-ocid="reminders.submit_button"
              >
                {addReminderMutation.isPending ? "Saving..." : "Save Reminder"}
              </button>
            </div>
          )}

          <div className="space-y-2">
            {(anniversaryReminders as AnniversaryReminder[]).length === 0 ? (
              <p
                className="text-center py-8 text-gray-500 text-sm"
                data-ocid="reminders.empty_state"
              >
                No reminders yet. Add client anniversary and possession dates.
              </p>
            ) : (
              (anniversaryReminders as AnniversaryReminder[]).map((r, i) => (
                <div
                  key={String(r.id)}
                  className="flex items-center justify-between p-4 bg-black/30 border border-yellow-600/10 rounded-xl"
                  data-ocid={`reminders.item.${i + 1}`}
                >
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {String(r.clientName)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {String(r.reminderType)} \u2022 {String(r.reminderDate)}{" "}
                      \u2022 {String(r.phone)}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/91${String(r.phone).replace(/\D/g, "")}?text=Hi ${String(r.clientName)}, this is a reminder regarding your ${String(r.reminderType)}. Please contact us for assistance.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Message on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSection === "nurture" && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Leads that need follow-up based on last contact date
          </p>
          {(overdueReminders as LeadNurtureReminder[]).length === 0 ? (
            <div
              className="text-center py-12 text-gray-500"
              data-ocid="reminders.nurture.empty_state"
            >
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                All leads are up to date. No follow-ups needed.
              </p>
            </div>
          ) : (
            (overdueReminders as LeadNurtureReminder[]).map((r, i) => {
              const days = getDaysOverdue(r);
              return (
                <div
                  key={String(r.id)}
                  className={`flex items-center justify-between p-4 border rounded-xl ${overdueColor(days)}`}
                  data-ocid={`reminders.nurture.item.${i + 1}`}
                >
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {String(r.leadName)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {String(r.service)} \u2022 Not contacted in{" "}
                      <span
                        className={
                          days >= 14
                            ? "text-red-400"
                            : days >= 7
                              ? "text-orange-400"
                              : "text-yellow-400"
                        }
                      >
                        {days} days
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/91${String(r.phone).replace(/\D/g, "")}?text=Hi ${String(r.leadName)}, following up on your enquiry regarding ${String(r.service)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-400 hover:text-green-300"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => dismissMutation.mutate(String(r.id))}
                      className="p-2 text-gray-500 hover:text-gray-300"
                      title="Dismiss"
                      data-ocid={`reminders.nurture.delete_button.${i + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
