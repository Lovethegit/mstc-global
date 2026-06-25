import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  Grid,
  IndianRupee,
  List,
  MapPin,
  Menu,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const EVENTS = [
  {
    id: 1,
    title: "Property Expo Ahmedabad",
    date: "15 Jun 2026",
    venue: "GMDC Ground, Ahmedabad",
    registrations: 45,
    capacity: 500,
    revenue: 90000,
    status: "Upcoming",
    category: "Expo",
    description:
      "Annual mega property expo with 50+ developers and 300+ projects on display.",
  },
  {
    id: 2,
    title: "Investment Seminar: Ahmedabad 2026",
    date: "28 Jun 2026",
    venue: "Hotel Courtyard, S.G. Highway",
    registrations: 23,
    capacity: 80,
    revenue: 46000,
    status: "Upcoming",
    category: "Seminar",
    description:
      "Expert panel on investment strategies for residential and commercial real estate.",
  },
  {
    id: 3,
    title: "NGO Fundraiser Gala",
    date: "05 Jul 2026",
    venue: "Hotel Radisson Blu, Ahmedabad",
    registrations: 89,
    capacity: 120,
    revenue: 534000,
    status: "Upcoming",
    category: "Fundraiser",
    description:
      "Annual gala dinner to raise funds for slum rehabilitation and girl child education.",
  },
  {
    id: 4,
    title: "RERA Compliance Workshop",
    date: "12 Jul 2026",
    venue: "MSTC Office, Shantivan Ahmedabad",
    registrations: 34,
    capacity: 60,
    revenue: 68000,
    status: "Upcoming",
    category: "Workshop",
    description:
      "Deep-dive workshop on RERA regulations for promoters, agents, and investors.",
  },
  {
    id: 5,
    title: "Ahmedabad Real Estate Summit",
    date: "02 Aug 2026",
    venue: "Sheraton Grand, Ahmedabad",
    registrations: 78,
    capacity: 200,
    revenue: 312000,
    status: "Upcoming",
    category: "Summit",
    description:
      "Premier industry summit on the future of Ahmedabad real estate through 2030.",
  },
  {
    id: 6,
    title: "NRI Investment Forum",
    date: "20 Aug 2026",
    venue: "Hotel Hyatt, Ashram Road",
    registrations: 41,
    capacity: 100,
    revenue: 205000,
    status: "Upcoming",
    category: "Forum",
    description:
      "Dedicated session for NRI clients exploring property investment in Gujarat.",
  },
  {
    id: 7,
    title: "MSTC Cultural Evening & Music Nite",
    date: "10 Sep 2026",
    venue: "GMDC Amphitheatre, Ahmedabad",
    registrations: 22,
    capacity: 300,
    revenue: 44000,
    status: "Upcoming",
    category: "Cultural",
    description:
      "Annual cultural evening featuring classical and contemporary music performances.",
  },
  {
    id: 8,
    title: "Corporate Sustainability Conference",
    date: "18 Oct 2026",
    venue: "Hotel Novotel, Ahmedabad",
    registrations: 15,
    capacity: 150,
    revenue: 75000,
    status: "Upcoming",
    category: "Conference",
    description:
      "CSR and ESG best practices for real estate and business conglomerates.",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Upcoming: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Active: "bg-emerald-900/20 text-emerald-300 border-emerald-800/30",
  Completed: "bg-gold-800/20 text-gold-300 border-gold-700/30",
  Cancelled: "bg-red-900/20 text-red-300 border-red-800/30",
};

const ATTENDEES = [
  {
    name: "Rajesh Patel",
    email: "rajesh.p@gmail.com",
    phone: "+91 98250 11234",
    type: "VIP",
  },
  {
    name: "Sunita Mehta",
    email: "sunita.m@yahoo.com",
    phone: "+91 97250 22345",
    type: "Regular",
  },
  {
    name: "Anand Shah",
    email: "anand.s@hotmail.com",
    phone: "+91 99250 33456",
    type: "Regular",
  },
  {
    name: "Priya Joshi",
    email: "priya.j@gmail.com",
    phone: "+91 96250 44567",
    type: "VIP",
  },
  {
    name: "Vikram Desai",
    email: "vikram.d@gmail.com",
    phone: "+91 95250 55678",
    type: "Regular",
  },
];

export default function EventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<(typeof EVENTS)[0] | null>(
    null,
  );
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    capacity: "",
    category: "Expo",
    description: "",
  });

  const totalRSVPs = EVENTS.reduce((a, e) => a + e.registrations, 0);
  const totalRevenue = EVENTS.reduce((a, e) => a + e.revenue, 0);

  return (
    <SecureAppGate appName="Events Manager">
      <div className="min-h-screen bg-background flex" data-ocid="events.page">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 z-40 bg-card border-r border-gold-800/30 flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gold-800/20">
            <span className="font-serif font-bold text-gold-400">
              Events Manager
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              data-ocid="events.sidebar_close_button"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-700/40 text-gold-400 hover:bg-gold-700/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { icon: List, label: "All Events", active: true },
              { icon: Calendar, label: "Calendar View" },
              { icon: Users, label: "RSVP Management" },
              { icon: IndianRupee, label: "Revenue" },
              { icon: MapPin, label: "Venues" },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-gold-700/20 text-gold-400 font-medium"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gold-800/20">
            <a
              href="/master"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gold-400 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Master Control
            </a>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-800/30 text-gold-400 hover:bg-gold-700/20 transition-colors shrink-0"
                  data-ocid="events.menu_button"
                  aria-label="Open sidebar"
                >
                  <Menu size={16} />
                </button>
                <h1 className="font-serif font-bold text-base sm:text-lg text-foreground truncate">
                  Events Manager
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <BackButton to="/master" />
                <div className="flex border border-gold-800/30 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`p-1.5 transition-colors ${view === "list" ? "bg-gold-700/30 text-gold-400" : "text-muted-foreground hover:text-foreground"}`}
                    data-ocid="events.list_view_button"
                    aria-label="List view"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("calendar")}
                    className={`p-1.5 transition-colors ${view === "calendar" ? "bg-gold-700/30 text-gold-400" : "text-muted-foreground hover:text-foreground"}`}
                    data-ocid="events.calendar_view_button"
                    aria-label="Calendar view"
                  >
                    <Grid size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors shrink-0"
                  data-ocid="events.add_button"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: "Upcoming Events",
                  value: EVENTS.length,
                  color: "text-gold-400",
                },
                {
                  label: "Total RSVPs",
                  value: totalRSVPs,
                  color: "text-blue-400",
                },
                {
                  label: "This Month Revenue",
                  value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
                  color: "text-emerald-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
                >
                  <p className={`font-serif text-xl font-bold ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Event Cards */}
            <div className="space-y-3">
              {EVENTS.map((event, i) => {
                const fillPct = Math.min(
                  100,
                  (event.registrations / event.capacity) * 100,
                );
                return (
                  <div
                    key={event.id}
                    className="rounded-xl border border-gold-800/30 bg-card p-4"
                    data-ocid={`events.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif font-semibold text-foreground text-sm">
                            {event.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] border shrink-0 ${STATUS_COLORS[event.status]}`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.venue}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee size={12} />₹
                            {(event.revenue / 1000).toFixed(0)}K revenue
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-gold-600 border-gold-800/40 shrink-0"
                      >
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-1.5 rounded-full bg-obsidian-700/50">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        <span className="text-foreground font-medium">
                          {event.registrations}
                        </span>{" "}
                        / {event.capacity} seats
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-xs font-medium transition-colors"
                        data-ocid={`events.view_attendees_button.${i + 1}`}
                      >
                        <Users size={12} /> View Attendees
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Attendees Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Attendees — ${selectedEvent.title}` : ""}
        size="lg"
      >
        <div className="space-y-3">
          {ATTENDEES.map((a, i) => (
            <div
              key={a.email}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gold-800/20 bg-background"
              data-ocid={`events.attendee.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.email} • {a.phone}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] border shrink-0 ${
                  a.type === "VIP"
                    ? "bg-gold-700/20 text-gold-400 border-gold-700/40"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {a.type}
              </Badge>
            </div>
          ))}
        </div>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add New Event"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter event title"
                className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
                data-ocid="events.form.title_input"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold-600/50"
                data-ocid="events.form.date_input"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
              Venue
            </label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Venue name and location"
              className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
              data-ocid="events.form.venue_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                Capacity
              </label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                placeholder="Max attendees"
                className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
                data-ocid="events.form.capacity_input"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold-600/50"
                data-ocid="events.form.category_select"
              >
                {[
                  "Expo",
                  "Seminar",
                  "Workshop",
                  "Summit",
                  "Forum",
                  "Cultural",
                  "Conference",
                  "Fundraiser",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description of the event..."
              className="w-full bg-background border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50 resize-none"
              data-ocid="events.form.description_textarea"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl border border-gold-800/30 text-muted-foreground text-sm hover:text-foreground transition-colors"
              data-ocid="events.form.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-gold-700/30 text-gold-400 text-sm font-medium hover:bg-gold-700/40 transition-colors"
              data-ocid="events.form.submit_button"
            >
              Create Event
            </button>
          </div>
        </div>
      </Modal>
    </SecureAppGate>
  );
}
