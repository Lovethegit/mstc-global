import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  FileText,
  MapPin,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FRANCHISEES = [
  {
    id: 1,
    name: "Mehta Realty",
    owner: "Rohan Mehta",
    city: "Surat",
    territory: "Surat South",
    revenue: 2400000,
    status: "Active",
    joined: "2024-01",
    deals: 18,
  },
  {
    id: 2,
    name: "Sheth Properties",
    owner: "Darshan Sheth",
    city: "Vadodara",
    territory: "Vadodara Central",
    revenue: 1800000,
    status: "Active",
    joined: "2024-06",
    deals: 12,
  },
  {
    id: 3,
    name: "Trivedi Consultants",
    owner: "Priya Trivedi",
    city: "Rajkot",
    territory: "Rajkot Metro",
    revenue: 1200000,
    status: "Active",
    joined: "2025-01",
    deals: 8,
  },
  {
    id: 4,
    name: "Patel Associates",
    owner: "Bhavesh Patel",
    city: "Gandhinagar",
    territory: "Gandhinagar",
    revenue: 900000,
    status: "Probation",
    joined: "2025-09",
    deals: 4,
  },
];

const APPLICATIONS = [
  {
    id: 1,
    name: "Kamlesh Shah",
    city: "Anand",
    experience: "8 years",
    territory: "Anand District",
    applied: "2026-05-12",
    status: "Under Review",
  },
  {
    id: 2,
    name: "Nisha Desai",
    city: "Bhavnagar",
    experience: "5 years",
    territory: "Bhavnagar",
    applied: "2026-05-28",
    status: "Interview Scheduled",
  },
  {
    id: 3,
    name: "Ajay Rana",
    city: "Junagadh",
    experience: "12 years",
    territory: "Junagadh",
    applied: "2026-06-01",
    status: "New",
  },
];

const TERRITORIES = [
  {
    id: 1,
    city: "Ahmedabad",
    zones: ["North", "South", "East", "West", "Central"],
    status: "Reserved (HQ)",
  },
  { id: 2, city: "Surat", zones: ["South"], status: "Taken" },
  { id: 3, city: "Vadodara", zones: ["Central"], status: "Taken" },
  { id: 4, city: "Anand", zones: ["Full District"], status: "Available" },
  { id: 5, city: "Bhavnagar", zones: ["City"], status: "Pending" },
];

const TABS = ["Franchisees", "Applications", "Territories"] as const;
type Tab = (typeof TABS)[number];

export default function FranchisePage() {
  const [tab, setTab] = useState<Tab>("Franchisees");
  const totalRevenue = FRANCHISEES.reduce((a, f) => a + f.revenue, 0);

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50"
              data-ocid="franchise.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Franchise Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Territory map, franchisee directory & application review
              </p>
            </div>
            <Button
              onClick={() =>
                toast.success("New franchise application form opened")
              }
              className="bg-primary text-primary-foreground"
              data-ocid="franchise.add_button"
            >
              + New Application
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Active Franchisees",
                value: FRANCHISEES.filter(
                  (f) => f.status === "Active",
                ).length.toString(),
                icon: Users,
                color: "text-gold-400",
              },
              {
                label: "Network Revenue",
                value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
                icon: TrendingUp,
                color: "text-green-400",
              },
              {
                label: "Territories Covered",
                value: TERRITORIES.filter(
                  (t) => t.status === "Taken" || t.status === "Reserved (HQ)",
                ).length.toString(),
                icon: MapPin,
                color: "text-blue-400",
              },
              {
                label: "Pending Applications",
                value: APPLICATIONS.length.toString(),
                icon: FileText,
                color: "text-amber-400",
              },
            ].map((k, i) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`franchise.kpi.${i + 1}`}
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
                data-ocid={`franchise.tab.${t.toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Franchisees */}
          {tab === "Franchisees" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRANCHISEES.map((f, i) => (
                <div
                  key={f.id}
                  className="bg-card/80 border border-gold-800/30 rounded-2xl p-5"
                  data-ocid={`franchise.franchisee.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-foreground">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.owner} · {f.city} · Since {f.joined}
                      </div>
                    </div>
                    <Badge
                      className={
                        f.status === "Active"
                          ? "bg-green-900/30 text-green-300 border-green-700/40"
                          : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                      }
                    >
                      {f.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gold-400">
                        ₹{(f.revenue / 100000).toFixed(1)}L
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Revenue
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {f.deals}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Deals
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {f.territory.split(" ")[0]}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Territory
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold-800/30 text-gold-400 text-xs"
                      onClick={() => toast.info(`Viewing ${f.name} details`)}
                      data-ocid={`franchise.franchisee.view_button.${i + 1}`}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary/20 text-primary text-xs"
                      onClick={() => toast.success(`Contacting ${f.owner}`)}
                      data-ocid={`franchise.franchisee.contact_button.${i + 1}`}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications */}
          {tab === "Applications" && (
            <div className="space-y-3">
              {APPLICATIONS.map((a, i) => (
                <div
                  key={a.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
                  data-ocid={`franchise.application.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {a.name}
                      </span>
                      <Badge
                        className={
                          a.status === "Interview Scheduled"
                            ? "bg-green-900/30 text-green-300 border-green-700/40"
                            : a.status === "Under Review"
                              ? "bg-blue-900/30 text-blue-300 border-blue-700/40"
                              : "bg-muted/30 text-muted-foreground border-border"
                        }
                      >
                        {a.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {a.city} · Territory: {a.territory} · {a.experience}{" "}
                      experience · Applied: {a.applied}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold-800/30 text-gold-400 text-xs"
                      onClick={() =>
                        toast.info(`Reviewing ${a.name}'s application`)
                      }
                      data-ocid={`franchise.application.review_button.${i + 1}`}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-900/30 text-green-300 text-xs"
                      onClick={() => toast.success(`${a.name} approved!`)}
                      data-ocid={`franchise.application.approve_button.${i + 1}`}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-900/30 text-red-300 text-xs"
                      onClick={() => toast.error(`${a.name} rejected`)}
                      data-ocid={`franchise.application.reject_button.${i + 1}`}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Territories */}
          {tab === "Territories" && (
            <div className="space-y-3">
              {TERRITORIES.map((t, i) => (
                <div
                  key={t.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 flex items-center gap-4"
                  data-ocid={`franchise.territory.item.${i + 1}`}
                >
                  <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {t.city}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Zones: {t.zones.join(", ")}
                    </div>
                  </div>
                  <Badge
                    className={
                      t.status === "Available"
                        ? "bg-green-900/30 text-green-300 border-green-700/40"
                        : t.status === "Taken"
                          ? "bg-red-900/30 text-red-300 border-red-700/40"
                          : t.status === "Pending"
                            ? "bg-amber-900/30 text-amber-300 border-amber-700/40"
                            : "bg-blue-900/30 text-blue-300 border-blue-700/40"
                    }
                  >
                    {t.status}
                  </Badge>
                  {t.status === "Available" && (
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary text-xs"
                      onClick={() =>
                        toast.success(`Territory enquiry sent for ${t.city}`)
                      }
                      data-ocid={`franchise.territory.enquire_button.${i + 1}`}
                    >
                      Enquire
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
