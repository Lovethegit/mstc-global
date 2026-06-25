import SecureAppGate from "@/components/shared/SecureAppGate";
import { Building2, Calendar, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VENUES = [
  {
    id: 1,
    name: "MSTC Grand Ballroom",
    capacity: 500,
    amenities: ["A/C", "Stage", "Parking", "Catering", "AV Setup"],
    status: "Available",
    nextBooking: "Ahmedabad Property Expo — Jun 2025",
  },
  {
    id: 2,
    name: "Executive Conference Hall",
    capacity: 100,
    amenities: ["A/C", "Projector", "Video Conf", "Refreshments"],
    status: "Booked",
    nextBooking: "RERA Workshop — Jun 2025",
  },
  {
    id: 3,
    name: "Rooftop Terrace",
    capacity: 200,
    amenities: ["Open Air", "Bar Setup", "Decor", "Music"],
    status: "Available",
    nextBooking: "",
  },
  {
    id: 4,
    name: "Business Lounge",
    capacity: 30,
    amenities: ["A/C", "Wi-Fi", "Refreshments"],
    status: "Available",
    nextBooking: "",
  },
];

const PACKAGES = [
  {
    id: 1,
    name: "Executive Meeting",
    services: ["Venue", "AV", "Refreshments"],
    price: 25000,
    duration: "4 hours",
  },
  {
    id: 2,
    name: "Full Day Conference",
    services: ["Venue", "AV", "Lunch", "Refreshments", "Reception"],
    price: 85000,
    duration: "Full Day",
  },
  {
    id: 3,
    name: "Corporate Gala",
    services: ["Ballroom", "Catering", "Stage", "Photography", "Décor"],
    price: 250000,
    duration: "Evening",
  },
  {
    id: 4,
    name: "NRI Welcome Event",
    services: ["Venue", "Welcome Kit", "Presentation", "Dinner"],
    price: 150000,
    duration: "5 hours",
  },
];

const BOOKINGS = [
  {
    id: 1,
    client: "Tata Consultancy Services",
    venue: "Grand Ballroom",
    date: "2026-07-12",
    package: "Corporate Gala",
    status: "Confirmed",
    amount: 250000,
  },
  {
    id: 2,
    client: "Adani Properties",
    venue: "Conference Hall",
    date: "2026-06-28",
    package: "Full Day Conference",
    status: "Pending",
    amount: 85000,
  },
  {
    id: 3,
    client: "NRI Association Ahmedabad",
    venue: "Rooftop Terrace",
    date: "2026-07-20",
    package: "NRI Welcome Event",
    status: "Confirmed",
    amount: 150000,
  },
  {
    id: 4,
    client: "RERA Gujarat",
    venue: "Conference Hall",
    date: "2026-06-15",
    package: "Full Day Conference",
    status: "Completed",
    amount: 85000,
  },
  {
    id: 5,
    client: "Rajesh Mehta & Associates",
    venue: "Business Lounge",
    date: "2026-06-10",
    package: "Executive Meeting",
    status: "Confirmed",
    amount: 25000,
  },
];

const BOOKING_STATUS_COLORS: Record<string, string> = {
  Confirmed: "bg-green-900/20 text-green-300 border-green-800/30",
  Pending: "bg-amber-900/20 text-amber-300 border-amber-800/30",
  Completed: "bg-blue-900/20 text-blue-300 border-blue-800/30",
  Cancelled: "bg-red-900/20 text-red-300 border-red-800/30",
};

export default function HospitalityAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "venues" | "bookings" | "packages" | "matching"
  >("venues");
  const [bookings, setBookings] = useState(BOOKINGS);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [venueFilter, setVenueFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bookingForm, setBookingForm] = useState({
    client: "",
    venue: "MSTC Grand Ballroom",
    date: "",
    package: "Executive Meeting",
  });

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchStatus;
  });

  function handleAddBooking(e: React.FormEvent) {
    e.preventDefault();
    const pkg = PACKAGES.find((p) => p.name === bookingForm.package);
    const newBooking = {
      id: Date.now(),
      client: bookingForm.client,
      venue: bookingForm.venue,
      date: bookingForm.date,
      package: bookingForm.package,
      status: "Pending",
      amount: pkg?.price ?? 25000,
    };
    setBookings((prev) => [newBooking, ...prev]);
    setShowAddBooking(false);
    setBookingForm({
      client: "",
      venue: "MSTC Grand Ballroom",
      date: "",
      package: "Executive Meeting",
    });
    toast.success("Booking created — pending confirmation");
  }

  function confirmBooking(id: number) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b)),
    );
    toast.success("Booking confirmed");
  }

  function cancelBooking(id: number) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    );
    toast.success("Booking cancelled");
  }

  const TABS = ["venues", "bookings", "packages", "matching"] as const;

  return (
    <SecureAppGate appName="Hospitality Hub">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="hospitality_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Hospitality Hub
              </h1>
            </div>
            {activeTab === "bookings" && (
              <button
                type="button"
                onClick={() => setShowAddBooking(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                data-ocid="hospitality_admin.add_booking_button"
              >
                <Plus className="w-3.5 h-3.5" /> New Booking
              </button>
            )}
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                    : "border-gold-800/30 text-gold-600"
                }`}
                data-ocid={`hospitality_admin.tab.${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Venues", value: VENUES.length, color: "text-gold-400" },
              {
                label: "Available",
                value: VENUES.filter((v) => v.status === "Available").length,
                color: "text-green-400",
              },
              {
                label: "Active",
                value: bookings.filter(
                  (b) => b.status !== "Cancelled" && b.status !== "Completed",
                ).length,
                color: "text-blue-400",
              },
              {
                label: "Revenue",
                value: `₹${(bookings.filter((b) => b.status === "Completed").reduce((s, b) => s + b.amount, 0) / 1000).toFixed(0)}K`,
                color: "text-gold-300",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-lg font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {activeTab === "venues" && (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                {["All", "Available", "Booked"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setVenueFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      venueFilter === f
                        ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                        : "border-gold-800/30 text-gold-600"
                    }`}
                    data-ocid={`hospitality_admin.venue_filter.${f.toLowerCase()}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VENUES.filter(
                  (v) => venueFilter === "All" || v.status === venueFilter,
                ).map((venue, i) => (
                  <div
                    key={venue.id}
                    className="rounded-xl border border-gold-800/30 bg-card p-4"
                    data-ocid={`hospitality_admin.venue.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground text-sm">
                        {venue.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${venue.status === "Available" ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-red-900/20 text-red-300 border-red-800/30"}`}
                      >
                        {venue.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Capacity: {venue.capacity} guests
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {venue.amenities.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-gold-700/10 border border-gold-800/30 text-gold-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    {venue.nextBooking && (
                      <p className="text-[10px] text-muted-foreground">
                        📅 {venue.nextBooking}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("bookings");
                        setShowAddBooking(true);
                        setBookingForm((f) => ({ ...f, venue: venue.name }));
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg border border-gold-800/30 text-gold-500 text-xs hover:bg-gold-800/10 transition-colors"
                      data-ocid={`hospitality_admin.book_venue.${i + 1}`}
                    >
                      Book this Venue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
                        statusFilter === f
                          ? "bg-gold-700/30 text-gold-300 border-gold-600/50"
                          : "border-gold-800/30 text-gold-600"
                      }`}
                      data-ocid={`hospitality_admin.booking_filter.${f.toLowerCase()}`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
              {filteredBookings.map((booking, i) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`hospitality_admin.booking.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">
                        {booking.client}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {booking.venue} • {booking.package}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {booking.date}
                        </span>
                        <span className="text-gold-400 font-medium">
                          ₹{booking.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${BOOKING_STATUS_COLORS[booking.status] ?? ""}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === "Pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => confirmBooking(booking.id)}
                        className="flex-1 py-1.5 rounded-lg bg-green-900/20 border border-green-800/30 text-green-300 text-xs hover:bg-green-900/30 transition-colors"
                        data-ocid={`hospitality_admin.confirm_booking.${i + 1}`}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className="flex-1 py-1.5 rounded-lg bg-red-900/20 border border-red-800/30 text-red-300 text-xs hover:bg-red-900/30 transition-colors"
                        data-ocid={`hospitality_admin.cancel_booking.${i + 1}`}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <div
                  className="text-center py-12"
                  data-ocid="hospitality_admin.empty_state"
                >
                  <Building2 className="w-12 h-12 text-gold-800/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No bookings</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "packages" && (
            <div className="space-y-3">
              {PACKAGES.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`hospitality_admin.package.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pkg.duration}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pkg.services.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gold-700/10 border border-gold-800/30 text-gold-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gold-400">
                        ₹{(pkg.price / 1000).toFixed(0)}K
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("bookings");
                          setShowAddBooking(true);
                          setBookingForm((f) => ({ ...f, package: pkg.name }));
                        }}
                        className="mt-1 text-xs text-gold-600 hover:text-gold-400"
                        data-ocid={`hospitality_admin.select_package.${i + 1}`}
                      >
                        Book Package
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "matching" && (
            <div className="rounded-xl border border-gold-800/30 bg-card p-4">
              <h3 className="font-serif font-semibold text-foreground mb-3">
                Client-Event Matching
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                AI matches upcoming events with suitable clients based on
                preferences and history.
              </p>
              <div className="space-y-2">
                {[
                  {
                    event: "Property Expo 2026",
                    clients: ["Rajesh Mehta", "Vikram Patel", "Mohan Agrawal"],
                    match: "High",
                  },
                  {
                    event: "NRI Summit",
                    clients: ["Vikram Patel", "Deepa Nair"],
                    match: "Perfect",
                  },
                  {
                    event: "RERA Workshop",
                    clients: ["Anita Joshi", "Suresh Kumar"],
                    match: "Good",
                  },
                ].map((m) => (
                  <div
                    key={m.event}
                    className="p-3 rounded-lg bg-background/50 border border-gold-800/20"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-foreground">
                        {m.event}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${m.match === "Perfect" ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-blue-900/20 text-blue-300 border-blue-800/30"}`}
                      >
                        {m.match}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Suggested: {m.clients.join(", ")}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(
                          `Invitations queued for ${m.clients.length} clients`,
                        )
                      }
                      className="mt-2 text-xs text-gold-500 hover:text-gold-400"
                      data-ocid={`hospitality_admin.send_invites.${m.event.replace(/ /g, "_").toLowerCase()}`}
                    >
                      Send Invites
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showAddBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            data-ocid="hospitality_admin.dialog"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onKeyDown={() => {}}
              onClick={() => setShowAddBooking(false)}
            />
            <div className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md">
              <button
                type="button"
                onClick={() => setShowAddBooking(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                data-ocid="hospitality_admin.close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-serif text-lg font-bold text-gold-400 mb-4">
                New Booking
              </h2>
              <form onSubmit={handleAddBooking} className="space-y-3">
                <div>
                  <label className="text-xs text-gold-600">
                    Client / Company Name *
                  </label>
                  <input
                    required
                    value={bookingForm.client}
                    onChange={(e) =>
                      setBookingForm((f) => ({ ...f, client: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    placeholder="Client or company name"
                    data-ocid="hospitality_admin.client_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Venue</label>
                  <select
                    value={bookingForm.venue}
                    onChange={(e) =>
                      setBookingForm((f) => ({ ...f, venue: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="hospitality_admin.venue_select"
                  >
                    {VENUES.map((v) => (
                      <option key={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gold-600">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="hospitality_admin.date_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gold-600">Package</label>
                  <select
                    value={bookingForm.package}
                    onChange={(e) =>
                      setBookingForm((f) => ({ ...f, package: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="hospitality_admin.package_select"
                  >
                    {PACKAGES.map((p) => (
                      <option key={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBooking(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                    data-ocid="hospitality_admin.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium"
                    data-ocid="hospitality_admin.submit_button"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
