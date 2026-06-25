import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  MapPin,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PACKAGES = [
  {
    id: 1,
    name: "Gujarat Heritage Circuit",
    days: 7,
    rate: 18500,
    category: "Heritage",
    minGroup: 2,
    maxGroup: 30,
    rating: 4.8,
    bookings: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Rann of Kutch White Desert Safari",
    days: 4,
    rate: 14000,
    category: "Adventure",
    minGroup: 2,
    maxGroup: 20,
    rating: 4.9,
    bookings: 31,
    status: "Active",
  },
  {
    id: 3,
    name: "Gir Lion Safari & Somnath",
    days: 3,
    rate: 9500,
    category: "Wildlife",
    minGroup: 2,
    maxGroup: 15,
    rating: 4.7,
    bookings: 18,
    status: "Active",
  },
  {
    id: 4,
    name: "Ahmedabad Heritage Walk",
    days: 1,
    rate: 2500,
    category: "City Tour",
    minGroup: 1,
    maxGroup: 25,
    rating: 4.6,
    bookings: 52,
    status: "Active",
  },
  {
    id: 5,
    name: "Saurashtra Pilgrimage Tour",
    days: 5,
    rate: 12000,
    category: "Pilgrimage",
    minGroup: 4,
    maxGroup: 40,
    rating: 4.8,
    bookings: 15,
    status: "Active",
  },
  {
    id: 6,
    name: "Saputara Eco-Trek",
    days: 3,
    rate: 7500,
    category: "Adventure",
    minGroup: 4,
    maxGroup: 20,
    rating: 4.5,
    bookings: 9,
    status: "New",
  },
];

const BOOKINGS = [
  {
    id: 1,
    client: "Mehta Family",
    package: "Gujarat Heritage Circuit",
    dates: "Nov 15–21, 2026",
    size: 6,
    status: "Confirmed",
    paid: 111000,
    balance: 0,
  },
  {
    id: 2,
    client: "TCS Team Outing",
    package: "Rann of Kutch Safari",
    dates: "Dec 1–4, 2026",
    size: 18,
    status: "Deposit Paid",
    paid: 126000,
    balance: 126000,
  },
  {
    id: 3,
    client: "Patel NRI Family",
    package: "Gir Safari & Somnath",
    dates: "Oct 20–22, 2026",
    size: 4,
    status: "Confirmed",
    paid: 38000,
    balance: 0,
  },
  {
    id: 4,
    client: "ISRO Retirees Club",
    package: "Saurashtra Pilgrimage",
    dates: "Nov 5–9, 2026",
    size: 14,
    status: "Enquiry",
    paid: 0,
    balance: 168000,
  },
  {
    id: 5,
    client: "Joshi Corporate",
    package: "Ahmedabad Heritage Walk",
    dates: "Sep 14, 2026",
    size: 22,
    status: "Paid",
    paid: 55000,
    balance: 0,
  },
];

const ITINERARY_TEMPLATES = [
  {
    id: 1,
    name: "Heritage Trail Day 1–3",
    stops: [
      "Sabarmati Ashram",
      "Calico Museum",
      "Adalaj Stepwell",
      "Modhera Sun Temple",
    ],
    duration: "3 days",
  },
  {
    id: 2,
    name: "Wildlife & Nature Day 1–3",
    stops: [
      "Gir Forest Entry",
      "Sasan Lion Lodge",
      "Somnath Temple",
      "Diu Beach",
    ],
    duration: "3 days",
  },
  {
    id: 3,
    name: "Rann Safari Day 1–4",
    stops: ["Bhuj City", "Kalo Dungar", "Great Rann Camp", "Craftsmen Village"],
    duration: "4 days",
  },
];

const CAT_COLORS: Record<string, string> = {
  Heritage: "bg-gold-800/30 text-gold-300 border-gold-700/40",
  Adventure: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Wildlife: "bg-green-900/30 text-green-300 border-green-700/40",
  "City Tour": "bg-purple-900/30 text-purple-300 border-purple-700/40",
  Pilgrimage: "bg-orange-900/30 text-orange-300 border-orange-700/40",
  New: "bg-teal-900/30 text-teal-300 border-teal-700/40",
};

const TABS = ["Packages", "Bookings", "Itinerary Builder"] as const;
type Tab = (typeof TABS)[number];

export default function TourismPage() {
  const [tab, setTab] = useState<Tab>("Packages");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customStops, setCustomStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState("");

  const totalRevenue = BOOKINGS.filter((b) => b.status !== "Enquiry").reduce(
    (a, b) => a + b.paid,
    0,
  );
  const confirmedBookings = BOOKINGS.filter(
    (b) => b.status === "Confirmed" || b.status === "Paid",
  ).length;

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="tourism.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Tourism Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Tour packages, booking management & itinerary builder
              </p>
            </div>
            <Button
              onClick={() => toast.success("New package form opened")}
              className="bg-primary text-primary-foreground"
              data-ocid="tourism.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> New Package
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Tour Packages",
                value: PACKAGES.length.toString(),
                icon: MapPin,
                color: "text-gold-400",
              },
              {
                label: "Confirmed Bookings",
                value: confirmedBookings.toString(),
                icon: Calendar,
                color: "text-green-400",
              },
              {
                label: "Total Revenue",
                value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
                icon: TrendingUp,
                color: "text-blue-400",
              },
              {
                label: "Pending Enquiries",
                value: BOOKINGS.filter(
                  (b) => b.status === "Enquiry",
                ).length.toString(),
                icon: Users,
                color: "text-amber-400",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`tourism.kpi.${k.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <k.icon className={`w-5 h-5 mb-2 ${k.color}`} />
                <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gold-800/30">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  tab === t
                    ? "bg-card text-gold-400 border border-b-0 border-gold-800/30"
                    : "text-muted-foreground hover:text-gold-300"
                }`}
                data-ocid={`tourism.tab.${t.toLowerCase().replace(/ /g, "_")}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          {tab !== "Itinerary Builder" && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full bg-card/60 border border-gold-800/30 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="tourism.search_input"
              />
            </div>
          )}

          {/* Packages */}
          {tab === "Packages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PACKAGES.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
              ).map((p, i) => (
                <div
                  key={p.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-5 hover:border-gold-600/40 transition-all"
                  data-ocid={`tourism.package.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground leading-snug">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.days} days · Group {p.minGroup}–{p.maxGroup}
                      </div>
                    </div>
                    <Badge
                      className={
                        CAT_COLORS[p.category] ??
                        "bg-muted/30 text-muted-foreground"
                      }
                    >
                      {p.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="text-xl font-bold text-gold-400">
                      ₹{p.rate.toLocaleString()}
                      <span className="text-xs text-muted-foreground">
                        /person
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.bookings} bookings · ⭐ {p.rating}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold-800/30 text-gold-400 text-xs"
                      onClick={() => toast.info(`Viewing ${p.name}`)}
                      data-ocid={`tourism.package.view_button.${i + 1}`}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary/20 text-primary text-xs"
                      onClick={() => toast.success(`Booking ${p.name}`)}
                      data-ocid={`tourism.package.book_button.${i + 1}`}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bookings */}
          {tab === "Bookings" && (
            <div className="space-y-3">
              {BOOKINGS.filter(
                (b) =>
                  b.client.toLowerCase().includes(search.toLowerCase()) ||
                  b.package.toLowerCase().includes(search.toLowerCase()),
              ).map((b, i) => (
                <div
                  key={b.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
                  data-ocid={`tourism.booking.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {b.client}
                      </span>
                      <Badge
                        className={
                          b.status === "Confirmed" || b.status === "Paid"
                            ? "bg-green-900/30 text-green-300 border-green-700/40"
                            : b.status === "Deposit Paid"
                              ? "bg-blue-900/30 text-blue-300 border-blue-700/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {b.package} · {b.dates} · {b.size} pax
                    </div>
                    <div className="text-xs mt-1">
                      <span className="text-green-400">
                        Paid: ₹{b.paid.toLocaleString()}
                      </span>
                      {b.balance > 0 && (
                        <span className="text-amber-400 ml-2">
                          Balance: ₹{b.balance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-800/30 text-gold-400 text-xs"
                      onClick={() => toast.info(`Viewing booking: ${b.client}`)}
                      data-ocid={`tourism.booking.view_button.${i + 1}`}
                    >
                      View
                    </Button>
                    {b.balance > 0 && (
                      <Button
                        size="sm"
                        className="bg-green-900/30 text-green-300 text-xs"
                        onClick={() =>
                          toast.success(`Payment link sent to ${b.client}`)
                        }
                        data-ocid={`tourism.booking.payment_button.${i + 1}`}
                      >
                        Request Payment
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Itinerary Builder */}
          {tab === "Itinerary Builder" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-serif font-semibold text-gold-400">
                  Select a Template
                </h3>
                {ITINERARY_TEMPLATES.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      setCustomStops([...t.stops]);
                      toast.info(`Template loaded: ${t.name}`);
                    }}
                    className={`w-full text-left bg-card/60 border rounded-xl p-4 transition-all hover:border-gold-600/50 ${
                      selectedTemplate === t.id
                        ? "border-gold-500/60"
                        : "border-gold-800/30"
                    }`}
                    data-ocid={`tourism.itinerary.template.${i + 1}`}
                  >
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.duration} · {t.stops.length} stops
                    </div>
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-serif font-semibold text-gold-400">
                  Build Itinerary
                </h3>
                <div className="bg-card/60 border border-gold-800/30 rounded-xl p-4 min-h-[200px]">
                  {customStops.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Select a template or add stops below
                    </p>
                  ) : (
                    <ol className="space-y-2">
                      {customStops.map((stop, idx) => (
                        <li
                          key={`stop-${idx}-${stop}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-foreground">{stop}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCustomStops((stops) =>
                                stops.filter((_, j) => j !== idx),
                              )
                            }
                            className="text-red-400 hover:text-red-300 text-xs"
                            data-ocid={`tourism.itinerary.remove_stop.${idx + 1}`}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-card/60 border border-gold-800/30 rounded-lg px-3 py-2 text-sm"
                    placeholder="Add a stop..."
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    data-ocid="tourism.itinerary.new_stop_input"
                  />
                  <Button
                    onClick={() => {
                      if (newStop.trim()) {
                        setCustomStops((s) => [...s, newStop.trim()]);
                        setNewStop("");
                      }
                    }}
                    className="bg-primary/20 text-primary"
                    data-ocid="tourism.itinerary.add_stop_button"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => toast.success("Itinerary saved as PDF!")}
                  data-ocid="tourism.itinerary.save_button"
                >
                  Save & Download Itinerary PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
