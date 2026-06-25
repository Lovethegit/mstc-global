import { useAddAppointment } from "@/hooks/useAppointmentQueries";
import { Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICES = [
  "Property Buying/Selling",
  "Home Loan",
  "RERA Consulting",
  "Events/Hospitality",
  "Finance & Investment",
  "Music & Cultural",
  "NGO & CSR",
  "Media/Sports/Tourism",
  "Other",
];

const TIME_SLOTS = [
  "Morning (9am–12pm)",
  "Afternoon (12pm–4pm)",
  "Evening (4pm–8pm)",
];

export default function CallbackButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    time: "",
    service: "",
  });
  const addAppointment = useAddAppointment();

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }

    // Save to backend
    try {
      await addAppointment.mutateAsync({
        clientName: form.name,
        clientPhone: form.phone,
        clientEmail: "",
        type: "Callback Request",
        service: form.service || "General",
        preferredDate: "",
        preferredTime: form.time || "Anytime",
        notes: `Callback requested via website. Preferred time: ${form.time || "Anytime"}. Service: ${form.service || "General"}.`,
      });
    } catch {
      // Continue to WhatsApp even if backend fails
    }

    const msg = `Hi MSTC GLOBAL, I would like a callback.\n\nName: ${form.name}\nPhone: ${form.phone}\nPreferred Time: ${form.time || "Anytime"}\nService: ${form.service || "General"}`;
    window.open(
      `https://wa.me/919512609016?text=${encodeURIComponent(msg)}`,
      "_blank",
    );

    toast.success("Callback request sent! Opening WhatsApp…");
    setOpen(false);
    setForm({ name: "", phone: "", time: "", service: "" });
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 left-4 z-50 flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-bold px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 text-sm border border-gold-400/50"
          data-ocid="callback.open_button"
          aria-label="Request a callback"
        >
          <Phone size={16} className="shrink-0" />
          <span className="hidden sm:inline">Call Me Back</span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-24 left-4 z-50 w-80 bg-obsidian-900 border border-gold-700/40 rounded-2xl p-5 shadow-2xl"
          data-ocid="callback.panel"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gold-400 font-serif font-semibold text-base">
              Request a Callback
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gold-600 hover:text-gold-300 transition-colors p-1"
              data-ocid="callback.close_button"
              aria-label="Close callback form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your Name"
              className="w-full bg-obsidian-800 border border-gold-800/30 rounded-lg px-3.5 py-2.5 text-sm text-gold-100 placeholder:text-gold-700 focus:outline-none focus:border-gold-500 transition-colors"
              data-ocid="callback.input.name"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="Phone Number"
              className="w-full bg-obsidian-800 border border-gold-800/30 rounded-lg px-3.5 py-2.5 text-sm text-gold-100 placeholder:text-gold-700 focus:outline-none focus:border-gold-500 transition-colors"
              data-ocid="callback.input.phone"
            />
            <select
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="w-full bg-obsidian-800 border border-gold-800/30 rounded-lg px-3.5 py-2.5 text-sm text-gold-100 focus:outline-none focus:border-gold-500 transition-colors appearance-none"
              data-ocid="callback.select.time"
            >
              <option value="" className="bg-obsidian-800 text-gold-700">
                Preferred Time
              </option>
              {TIME_SLOTS.map((t) => (
                <option
                  key={t}
                  value={t}
                  className="bg-obsidian-800 text-gold-100"
                >
                  {t}
                </option>
              ))}
            </select>
            <select
              value={form.service}
              onChange={(e) =>
                setForm((f) => ({ ...f, service: e.target.value }))
              }
              className="w-full bg-obsidian-800 border border-gold-800/30 rounded-lg px-3.5 py-2.5 text-sm text-gold-100 focus:outline-none focus:border-gold-500 transition-colors appearance-none"
              data-ocid="callback.select.service"
            >
              <option value="" className="bg-obsidian-800 text-gold-700">
                Select Service
              </option>
              {SERVICES.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-obsidian-800 text-gold-100"
                >
                  {s}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={addAppointment.isPending}
              className="w-full bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-obsidian-900 font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              data-ocid="callback.submit_button"
            >
              <Phone size={14} />
              {addAppointment.isPending
                ? "Sending…"
                : "Request Callback via WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
