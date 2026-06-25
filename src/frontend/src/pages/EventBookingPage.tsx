import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const EVENT_TYPES = [
  "Wedding Ceremony",
  "Corporate Conference",
  "Birthday Celebration",
  "Concert / Live Show",
  "Cultural Program",
  "NGO / CSR Event",
  "Award Night",
  "Private Party",
  "Product Launch",
  "Other",
];

const VENUES = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    capacity: "50–500",
    features: ["Stage & AV", "Catering", "Valet Parking", "Décor Setup"],
    price: "₹1.5L–5L",
    icon: "🏛️",
  },
  {
    id: "outdoor-lawn",
    name: "Outdoor Lawn",
    capacity: "20–300",
    features: ["Open Air", "Catering", "Sound System", "Lighting"],
    price: "₹60K–2.5L",
    icon: "🌿",
  },
  {
    id: "conference-room",
    name: "Conference Room",
    capacity: "10–80",
    features: ["Projector & AV", "Refreshments", "WiFi", "Whiteboard"],
    price: "₹25K–80K",
    icon: "💼",
  },
  {
    id: "heritage-venue",
    name: "Heritage Venue",
    capacity: "30–200",
    features: [
      "Historical Décor",
      "Photography Zone",
      "Catering",
      "Special Ambience",
    ],
    price: "₹1L–4L",
    icon: "🏰",
  },
  {
    id: "custom",
    name: "Custom Venue",
    capacity: "As needed",
    features: ["Fully Customizable", "Anywhere in Ahmedabad", "Full Support"],
    price: "On Request",
    icon: "✨",
  },
];

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// Generate available slots — mark some as booked randomly but deterministically
const BOOKED_OFFSETS = new Set([1, 4, 7, 10]);
const AVAILABLE_SLOTS = TIME_SLOTS.map((t, i) => ({
  time: t,
  available: !BOOKED_OFFSETS.has(i),
}));

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  guestCount: string;
  venue: string;
  notes: string;
  indemnity: boolean;
}

export default function EventBookingPage() {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    guestCount: "",
    venue: "",
    notes: "",
    indemnity: false,
  });

  const logSubmission = useLogServiceSubmission();
  const cells = useMemo(
    () => buildCalendar(calYear, calMonth),
    [calYear, calMonth],
  );

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else {
      setCalMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const isPast = (d: number) => {
    const dt = new Date(calYear, calMonth, d);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return dt < now;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.indemnity || !selectedDate || !selectedSlot || !form.venue)
      return;
    const ref = `MSTC-EVT-${Date.now().toString().slice(-6)}`;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
    logSubmission.mutate({
      serviceCategory: "Hospitality & Events",
      innerPage: "Event Booking",
      formType: "EventBooking",
      fields: [
        ["Event Type", form.eventType],
        ["Event Date", dateStr],
        ["Time Slot", selectedSlot],
        ["Guest Count", form.guestCount],
        ["Venue", form.venue],
        ["Notes", form.notes],
      ],
      submitterName: form.name,
      submitterPhone: form.phone,
      submitterEmail: form.email,
      indemnityAccepted: true,
    });
    setBookingRef(ref);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PrivacyGate>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="max-w-lg mx-auto px-4 py-32 text-center">
            <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-5" />
            <h2 className="font-serif font-bold text-3xl gold-text mb-3">
              Booking Request Received!
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              Reference Number:
            </p>
            <div
              className="font-mono text-lg font-bold mb-4"
              style={{ color: "oklch(0.72 0.18 76)" }}
            >
              {bookingRef}
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Our events team will confirm availability and contact you within
              24 hours. Please save your reference number.
            </p>
            <a
              href="https://wa.me/919512609016"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
              style={{ background: "#25D366", color: "#fff" }}
              data-ocid="event_booking.whatsapp_button"
            >
              WhatsApp for Quick Confirmation
            </a>
          </main>
          <Footer />
        </div>
      </PrivacyGate>
    );
  }

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/services/hospitality-events"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="event_booking.back_button"
            >
              <ArrowLeft size={14} /> Back to Hospitality &amp; Events
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <CalendarDays size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                Event Booking Calendar
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Select a date, choose your preferred time slot, pick a venue and
              fill your details — we&apos;ll confirm within 24 hours.
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* LEFT: Calendar + Slots + Venues */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} className="text-foreground" />
                  </button>
                  <span className="font-semibold text-sm text-foreground">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} className="text-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs text-muted-foreground font-medium py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    let nullCount = 0;
                    return cells.map((day) => {
                      if (day === null) {
                        nullCount += 1;
                        return (
                          <div
                            key={`null-${calYear}-${calMonth}-${nullCount}`}
                          />
                        );
                      }
                      const past = isPast(day);
                      const isSelected = selectedDate === day;
                      return (
                        <button
                          key={`d-${day}`}
                          type="button"
                          disabled={past}
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedSlot(null);
                          }}
                          className={`aspect-square rounded-lg text-xs font-medium transition-all flex items-center justify-center ${
                            past
                              ? "opacity-30 cursor-not-allowed text-muted-foreground"
                              : isSelected
                                ? "text-primary-foreground"
                                : "hover:border-primary/40 border border-transparent text-foreground"
                          }`}
                          style={{
                            background: isSelected
                              ? "oklch(0.72 0.18 76)"
                              : undefined,
                          }}
                          data-ocid={`event_booking.cal_day.${day}`}
                        >
                          {day}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={14} className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {MONTH_NAMES[calMonth]} {selectedDate} — Select Time Slot
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_SLOTS.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() =>
                          slot.available && setSelectedSlot(slot.time)
                        }
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          !slot.available
                            ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
                            : selectedSlot === slot.time
                              ? "border-primary text-primary-foreground"
                              : "border-border text-foreground hover:border-primary/50"
                        }`}
                        style={
                          selectedSlot === slot.time
                            ? { background: "oklch(0.72 0.18 76)" }
                            : undefined
                        }
                        data-ocid={`event_booking.slot.${slot.time.replace(/[: ]/g, "-").toLowerCase()}`}
                      >
                        {slot.available ? slot.time : "Booked"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue Cards */}
              <div>
                <h3 className="font-serif font-semibold text-base text-foreground mb-3">
                  Choose Venue
                </h3>
                <div className="space-y-3">
                  {VENUES.map((v, i) => (
                    <div
                      key={v.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        form.venue === v.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                      onClick={() => setForm((f) => ({ ...f, venue: v.id }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setForm((f) => ({ ...f, venue: v.id }));
                      }}
                      role="button"
                      tabIndex={0}
                      data-ocid={`event_booking.venue.${i + 1}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{v.icon}</span>
                          <h4 className="font-semibold text-sm text-foreground">
                            {v.name}
                          </h4>
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "oklch(0.72 0.18 76)" }}
                        >
                          {v.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Users size={10} /> {v.capacity} guests
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {v.features.map((feat) => (
                          <span
                            key={feat}
                            className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Booking Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-2xl p-6 space-y-4 sticky top-24"
              >
                <h2 className="font-serif font-semibold text-xl text-foreground">
                  Your Booking Details
                </h2>

                {/* Selection Summary */}
                {(selectedDate || selectedSlot || form.venue) && (
                  <div
                    className="rounded-xl p-3 text-xs space-y-1"
                    style={{
                      background: "oklch(0.72 0.18 76 / 0.08)",
                      border: "1px solid oklch(0.72 0.18 76 / 0.3)",
                    }}
                  >
                    {selectedDate && (
                      <div className="text-muted-foreground">
                        📅 Date:{" "}
                        <strong className="text-foreground">
                          {MONTH_NAMES[calMonth]} {selectedDate}, {calYear}
                        </strong>
                      </div>
                    )}
                    {selectedSlot && (
                      <div className="text-muted-foreground">
                        🕐 Time:{" "}
                        <strong className="text-foreground">
                          {selectedSlot}
                        </strong>
                      </div>
                    )}
                    {form.venue && (
                      <div className="text-muted-foreground">
                        🏛️ Venue:{" "}
                        <strong className="text-foreground">
                          {VENUES.find((v) => v.id === form.venue)?.name}
                        </strong>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="event_booking.name_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Phone *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="event_booking.phone_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="event_booking.email_input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Event Type *
                    </label>
                    <select
                      required
                      value={form.eventType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, eventType: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="event_booking.event_type_select"
                    >
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Expected Guests *
                    </label>
                    <input
                      required
                      value={form.guestCount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, guestCount: e.target.value }))
                      }
                      placeholder="e.g. 150"
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                      data-ocid="event_booking.guest_count_input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    rows={3}
                    placeholder="Decoration theme, dietary requirements, AV needs..."
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                    data-ocid="event_booking.notes_textarea"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-muted/20 border border-border">
                  <input
                    type="checkbox"
                    checked={form.indemnity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, indemnity: e.target.checked }))
                    }
                    className="mt-0.5 accent-primary"
                    data-ocid="event_booking.indemnity_checkbox"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I understand MSTC GLOBAL is a facilitator for event
                    bookings. Availability is subject to confirmation. All
                    bookings are governed by MSTC&apos;s Terms &amp; Conditions.
                    <span className="text-red-400 ml-1">*Required</span>
                  </span>
                </label>
                {(!selectedDate || !selectedSlot || !form.venue) && (
                  <p className="text-xs text-amber-500/80">
                    Please select a date, time slot, and venue from the left
                    panel to proceed.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={
                    !form.indemnity ||
                    !selectedDate ||
                    !selectedSlot ||
                    !form.venue ||
                    logSubmission.isPending
                  }
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.72 0.18 76)",
                    color: "oklch(0.1 0.01 60)",
                  }}
                  data-ocid="event_booking.submit_button"
                >
                  {logSubmission.isPending
                    ? "Submitting…"
                    : "Submit Booking Request"}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
