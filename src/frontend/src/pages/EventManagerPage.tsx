import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const EVENTS = [
  {
    id: "1",
    name: "Ahmedabad Property Expo 2025",
    date: "2025-07-15",
    venue: "AMA Hall, Vastrapur",
    capacity: 500,
    registered: 342,
    type: "Property",
    status: "Upcoming",
    budget: 850000,
    revenue: 0,
    description:
      "Annual property expo showcasing residential and commercial projects across Gujarat.",
  },
  {
    id: "2",
    name: "MSTC Annual Awards 2025",
    date: "2025-08-08",
    venue: "Hotel Hyatt, SG Road",
    capacity: 200,
    registered: 198,
    type: "Corporate",
    status: "Upcoming",
    budget: 1200000,
    revenue: 0,
    description:
      "Recognition ceremony for top performers, partners, and clients of MSTC GLOBAL.",
  },
  {
    id: "3",
    name: "Real Estate Investment Seminar",
    date: "2025-09-12",
    venue: "CEPT University, Ahmedabad",
    capacity: 150,
    registered: 87,
    type: "Property",
    status: "Upcoming",
    budget: 250000,
    revenue: 175000,
    description:
      "Expert-led seminar on current investment opportunities in Ahmedabad real estate.",
  },
  {
    id: "4",
    name: "NGO Annual Fundraiser Gala",
    date: "2025-06-05",
    venue: "Town Hall, Ahmedabad",
    capacity: 300,
    registered: 287,
    type: "NGO",
    status: "Upcoming",
    budget: 180000,
    revenue: 480000,
    description:
      "Annual charity gala supporting rural education and women empowerment initiatives.",
  },
  {
    id: "5",
    name: "Luxury Property Showcase",
    date: "2025-05-20",
    venue: "Ahmedabad Club, Paldi",
    capacity: 100,
    registered: 100,
    type: "Property",
    status: "Completed",
    budget: 500000,
    revenue: 2400000,
    description:
      "Exclusive showcase of premium properties for HNI clients. All 100 slots filled.",
  },
  {
    id: "6",
    name: "Navratri Cultural Evening 2025",
    date: "2025-10-01",
    venue: "GMDC Ground, Ahmedabad",
    capacity: 2000,
    registered: 0,
    type: "Cultural",
    status: "Planning",
    budget: 800000,
    revenue: 0,
    description:
      "Grand Navratri celebration featuring traditional Garba performances and cultural programs.",
  },
  {
    id: "7",
    name: "Finance and Investment Summit",
    date: "2025-11-14",
    venue: "IIM Ahmedabad, Vastrapur",
    capacity: 400,
    registered: 0,
    type: "Corporate",
    status: "Planning",
    budget: 600000,
    revenue: 0,
    description:
      "Two-day summit on financial planning, mutual funds, and real estate investment strategies.",
  },
  {
    id: "8",
    name: "MSTC Sports Day 2025",
    date: "2025-05-10",
    venue: "Sardar Patel Stadium, Navrangpura",
    capacity: 800,
    registered: 800,
    type: "Sports",
    status: "Completed",
    budget: 320000,
    revenue: 0,
    description:
      "Annual inter-department sports event for MSTC staff and partner families.",
  },
];

type EventTab = "all" | "upcoming" | "past" | "planning";

const EVENT_TYPES = ["Property", "Corporate", "Cultural", "NGO", "Sports"];

const typeStyle: Record<string, string> = {
  Property: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Corporate: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  NGO: "bg-green-500/15 text-green-400 border-green-500/30",
  Cultural: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Sports: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

const statusStyle: Record<string, string> = {
  Upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Completed: "bg-green-500/15 text-green-400 border-green-500/30",
  Planning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

export default function EventManagerPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<(typeof EVENTS)[0] | null>(
    null,
  );
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    venue: "",
    type: "Property",
    capacity: "",
  });

  const filteredEvents = useMemo(() => {
    if (activeTab === "upcoming")
      return EVENTS.filter((e) => e.status === "Upcoming");
    if (activeTab === "past")
      return EVENTS.filter((e) => e.status === "Completed");
    if (activeTab === "planning")
      return EVENTS.filter((e) => e.status === "Planning");
    return EVENTS;
  }, [activeTab]);

  const totalRegistered = EVENTS.reduce((sum, e) => sum + e.registered, 0);
  const totalRevenue = EVENTS.reduce((sum, e) => sum + e.revenue, 0);
  const upcomingCount = EVENTS.filter((e) => e.status === "Upcoming").length;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="events.page"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">
                Event Manager
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                MSTC GLOBAL Events and Operations
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gold-button gap-2"
            data-ocid="events.create_button"
          >
            <Plus size={16} /> Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Events",
              value: EVENTS.length,
              icon: Calendar,
              color: "text-gold-400",
            },
            {
              label: "Total Registered",
              value: totalRegistered.toLocaleString(),
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Upcoming Events",
              value: upcomingCount,
              icon: Bell,
              color: "text-amber-400",
            },
            {
              label: "Total Revenue",
              value: `\u20b9${(totalRevenue / 100000).toFixed(1)}L`,
              icon: DollarSign,
              color: "text-green-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`events.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground font-sans">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "upcoming", "past", "planning"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-gold-700/30 text-gold-300 border border-gold-700/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
              data-ocid={`events.${tab}_tab`}
            >
              {tab === "all"
                ? "All Events"
                : tab === "past"
                  ? "Past"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map((event, idx) => {
            const fillPct =
              event.capacity > 0
                ? Math.round((event.registered * 100) / event.capacity)
                : 0;
            return (
              <div
                key={event.id}
                className="bg-card border border-gold-700/20 rounded-xl p-5 hover:border-gold-500/40 transition-all cursor-pointer group"
                onClick={() => setSelectedEvent(event)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  setSelectedEvent(event)
                }
                role="button"
                tabIndex={0}
                data-ocid={`events.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${typeStyle[event.type] ?? ""}`}
                  >
                    {event.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusStyle[event.status] ?? ""}`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-3 text-sm leading-snug group-hover:text-gold-300 transition-colors">
                  {event.name}
                </h3>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span>
                      {event.registered}/{event.capacity} registered
                    </span>
                    <span className="ml-auto font-medium text-gold-400">
                      {fillPct}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-obsidian-700/40 rounded-full h-1.5 mb-4">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs gold-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    data-ocid={`events.manage_button.${idx + 1}`}
                  >
                    Manage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs border-gold-700/30 text-gold-400 hover:bg-gold-700/10"
                    onClick={(e) => e.stopPropagation()}
                    data-ocid={`events.invite_button.${idx + 1}`}
                  >
                    Invite
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.name ?? ""}
        size="md"
      >
        {selectedEvent && (
          <div>
            <div className="flex gap-2 mb-4">
              <Badge
                variant="outline"
                className={`text-xs ${typeStyle[selectedEvent.type] ?? ""}`}
              >
                {selectedEvent.type}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${statusStyle[selectedEvent.status] ?? ""}`}
              >
                {selectedEvent.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedEvent.description}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                {
                  label: "Date",
                  value: new Date(selectedEvent.date).toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  ),
                },
                {
                  label: "Registered",
                  value: `${selectedEvent.registered} / ${selectedEvent.capacity}`,
                },
                {
                  label: "Budget",
                  value: `\u20b9${(selectedEvent.budget / 100000).toFixed(1)}L`,
                },
                {
                  label: "Revenue",
                  value:
                    selectedEvent.revenue > 0
                      ? `\u20b9${(selectedEvent.revenue / 100000).toFixed(1)}L`
                      : "Not yet",
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-obsidian-800/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
              <MapPin size={14} className="shrink-0" />
              {selectedEvent.venue}
            </div>
            <div className="w-full bg-obsidian-700/40 rounded-full h-2 mb-5">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                style={{
                  width:
                    selectedEvent.capacity > 0
                      ? `${Math.round((selectedEvent.registered * 100) / selectedEvent.capacity)}%`
                      : "0%",
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 gold-button"
                data-ocid="events.detail.manage_button"
              >
                Manage Event
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gold-700/30 text-gold-400"
                data-ocid="events.detail.invite_button"
              >
                Send Invites
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Event Name
            </Label>
            <Input
              placeholder="e.g., Ahmedabad Property Summit 2025"
              value={eventForm.name}
              onChange={(e) =>
                setEventForm((f) => ({ ...f, name: e.target.value }))
              }
              className="bg-obsidian-800/60 border-gold-700/30"
              data-ocid="events.create_form.name_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">Date</Label>
              <Input
                type="date"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm((f) => ({ ...f, date: e.target.value }))
                }
                className="bg-obsidian-800/60 border-gold-700/30"
                data-ocid="events.create_form.date_input"
              />
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Capacity
              </Label>
              <Input
                type="number"
                placeholder="100"
                value={eventForm.capacity}
                onChange={(e) =>
                  setEventForm((f) => ({ ...f, capacity: e.target.value }))
                }
                className="bg-obsidian-800/60 border-gold-700/30"
                data-ocid="events.create_form.capacity_input"
              />
            </div>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">Venue</Label>
            <Input
              placeholder="Venue name, Area, City"
              value={eventForm.venue}
              onChange={(e) =>
                setEventForm((f) => ({ ...f, venue: e.target.value }))
              }
              className="bg-obsidian-800/60 border-gold-700/30"
              data-ocid="events.create_form.venue_input"
            />
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Event Type
            </Label>
            <Select
              value={eventForm.type}
              onValueChange={(v) => setEventForm((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger
                className="bg-obsidian-800/60 border-gold-700/30"
                data-ocid="events.create_form.type_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-700/30">
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowCreateModal(false)}
              data-ocid="events.create_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              onClick={() => setShowCreateModal(false)}
              data-ocid="events.create_form.submit_button"
            >
              Create Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
