import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  Building2,
  Droplets,
  Heart,
  Leaf,
  TrendingUp,
  Users,
} from "lucide-react";

const DONATIONS = [
  {
    id: 1,
    donor: "Ambalal Charitable Trust",
    amount: 500000,
    date: "2026-04-15",
    method: "NEFT",
    receipt: "Issued",
    pan: "AAAAT1234A",
  },
  {
    id: 2,
    donor: "Smt. Savita Patel",
    amount: 51000,
    date: "2026-04-18",
    method: "UPI",
    receipt: "Issued",
    pan: "ABCPS5678B",
  },
  {
    id: 3,
    donor: "Rajesh Enterprises",
    amount: 200000,
    date: "2026-05-02",
    method: "Cheque",
    receipt: "Pending",
    pan: "AABCR9012C",
  },
  {
    id: 4,
    donor: "Shah Family Foundation",
    amount: 750000,
    date: "2026-05-10",
    method: "NEFT",
    receipt: "Issued",
    pan: "AAASF3456D",
  },
  {
    id: 5,
    donor: "Anon. Donor",
    amount: 11000,
    date: "2026-05-14",
    method: "Cash",
    receipt: "N/A",
    pan: "—",
  },
  {
    id: 6,
    donor: "Girish Patel Foundation",
    amount: 300000,
    date: "2026-05-20",
    method: "NEFT",
    receipt: "Issued",
    pan: "AABCG7890E",
  },
  {
    id: 7,
    donor: "Manak Chand & Sons",
    amount: 125000,
    date: "2026-05-22",
    method: "UPI",
    receipt: "Issued",
    pan: "AABCM1234F",
  },
  {
    id: 8,
    donor: "Dr. Hema Joshi",
    amount: 25000,
    date: "2026-05-25",
    method: "Online",
    receipt: "Issued",
    pan: "AAAHJ5678G",
  },
];

const VOLUNTEERS = [
  {
    id: 1,
    name: "Ritu Sharma",
    event: "Rural Education Drive",
    hours: 48,
    status: "Active",
  },
  {
    id: 2,
    name: "Manav Patel",
    event: "Water Conservation Camp",
    hours: 32,
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Desai",
    event: "Women Empowerment Workshop",
    hours: 20,
    status: "Active",
  },
  {
    id: 4,
    name: "Arjun Shah",
    event: "Sports for Youth",
    hours: 15,
    status: "On Leave",
  },
  {
    id: 5,
    name: "Sonali Mehta",
    event: "Health & Nutrition Camp",
    hours: 28,
    status: "Active",
  },
  {
    id: 6,
    name: "Keyur Joshi",
    event: "Tree Plantation Drive",
    hours: 10,
    status: "Active",
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "Rural Education Initiative",
    icon: BookOpen,
    color: "text-blue-400",
    location: "Bavla, Viramgam",
    beneficiaries: 840,
    budget: 450000,
    spent: 320000,
    status: "Active",
  },
  {
    id: 2,
    title: "Water Conservation Camp",
    icon: Droplets,
    color: "text-cyan-400",
    location: "Sanand Taluka",
    beneficiaries: 1200,
    budget: 380000,
    spent: 280000,
    status: "Active",
  },
  {
    id: 3,
    title: "Women Empowerment Programme",
    icon: Users,
    color: "text-pink-400",
    location: "Ahmedabad, Paldi",
    beneficiaries: 312,
    budget: 200000,
    spent: 185000,
    status: "Active",
  },
  {
    id: 4,
    title: "Green Ahmedabad – Tree Drive",
    icon: Leaf,
    color: "text-green-400",
    location: "SG Highway, Thaltej",
    beneficiaries: 200,
    budget: 120000,
    spent: 95000,
    status: "Active",
  },
  {
    id: 5,
    title: "Health & Nutrition Camp",
    icon: Heart,
    color: "text-red-400",
    location: "Naroda, Vatva",
    beneficiaries: 580,
    budget: 250000,
    spent: 210000,
    status: "Completed",
  },
  {
    id: 6,
    title: "Sports for Youth",
    icon: Award,
    color: "text-gold-400",
    location: "Maninagar, Nikol",
    beneficiaries: 420,
    budget: 180000,
    spent: 140000,
    status: "Active",
  },
  {
    id: 7,
    title: "Skill Development Centre",
    icon: Building2,
    color: "text-purple-400",
    location: "Odhav, Vatva",
    beneficiaries: 295,
    budget: 350000,
    spent: 195000,
    status: "Active",
  },
];

export default function NgoAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              NGO Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Donation management, volunteers & impact projects – Ahmedabad
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total Raised",
                value: "₹18,45,000",
                icon: TrendingUp,
                color: "text-green-400",
              },
              {
                label: "Beneficiaries",
                value: "2,847",
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "Active Projects",
                value: "12",
                icon: Building2,
                color: "text-gold-400",
              },
              {
                label: "Volunteers",
                value: "47",
                icon: Heart,
                color: "text-pink-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`ngo.stat.${s.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <div className="text-xl font-bold text-gold-300">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Donations */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">Donation Tracker</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="ngo.donations.table">
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {[
                      "Donor",
                      "Amount",
                      "Date",
                      "Method",
                      "80G Receipt",
                      "PAN",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs text-muted-foreground font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DONATIONS.map((d, i) => (
                    <tr
                      key={d.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`ngo.donations.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 text-foreground font-medium">
                        {d.donor}
                      </td>
                      <td className="py-2 px-3 text-green-400 font-semibold">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {d.date}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {d.method}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={
                            d.receipt === "Issued"
                              ? "bg-green-900/30 text-green-300 border-green-700/40"
                              : d.receipt === "Pending"
                                ? "bg-amber-900/30 text-amber-300 border-amber-700/40"
                                : "bg-muted/30 text-muted-foreground border-border"
                          }
                        >
                          {d.receipt}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground font-mono">
                        {d.pan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">Impact Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-3"
                  data-ocid={`ngo.project.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between">
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                    <Badge
                      className={
                        p.status === "Active"
                          ? "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                          : "bg-muted/30 text-muted-foreground border-border text-[10px]"
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {p.location}
                    </p>
                  </div>
                  <div className="text-xs">
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Budget used</span>
                      <span className="text-gold-400">
                        {Math.round((p.spent / p.budget) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500/70 rounded-full"
                        style={{ width: `${(p.spent / p.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-blue-400">
                    {p.beneficiaries.toLocaleString()} beneficiaries
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteers */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">
              Volunteer Management
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="ngo.volunteers.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {["Volunteer", "Assigned Event", "Hours", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-2 px-3 text-xs text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {VOLUNTEERS.map((v, i) => (
                    <tr
                      key={v.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`ngo.volunteer.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-medium text-foreground">
                        {v.name}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {v.event}
                      </td>
                      <td className="py-2 px-3 text-gold-400 font-semibold">
                        {v.hours}h
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={
                            v.status === "Active"
                              ? "bg-green-900/30 text-green-300 border-green-700/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-700/40"
                          }
                        >
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
