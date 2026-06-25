import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  Download,
  Droplets,
  HandHeart,
  Heart,
  Leaf,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const PROJECTS = [
  {
    id: 1,
    name: "Scholarship Program 2025",
    cause: "Education",
    causeColor: "bg-blue-500/20 text-blue-300",
    icon: BookOpen,
    iconColor: "text-blue-400",
    beneficiaries: 240,
    beneficiaryUnit: "students",
    budget: 480000,
    spent: 362000,
    location: "Ahmedabad, Gandhinagar",
    status: "Active",
    description:
      "Merit-cum-means scholarships for underprivileged students from Classes 8–12 across Ahmedabad district.",
  },
  {
    id: 2,
    name: "Medical Camp – Naroda",
    cause: "Health",
    causeColor: "bg-red-500/20 text-red-300",
    icon: Heart,
    iconColor: "text-red-400",
    beneficiaries: 1200,
    beneficiaryUnit: "beneficiaries",
    budget: 320000,
    spent: 295000,
    location: "Naroda, Ahmedabad",
    status: "Completed",
    description:
      "Free general health checkup, medicines, and specialist consultation for residents of Naroda slum clusters.",
  },
  {
    id: 3,
    name: "Tree Plantation Drive 2025",
    cause: "Environment",
    causeColor: "bg-green-500/20 text-green-300",
    icon: Leaf,
    iconColor: "text-green-400",
    beneficiaries: 5000,
    beneficiaryUnit: "trees planted",
    budget: 150000,
    spent: 98000,
    location: "SG Highway, Thaltej, Sanand",
    status: "Active",
    description:
      "Native species plantation along SG Highway and Sanand Industrial Area, targeting 5,000 trees by July 2025.",
  },
  {
    id: 4,
    name: "Women Skill Training Centre",
    cause: "Women Empowerment",
    causeColor: "bg-pink-500/20 text-pink-300",
    icon: Users,
    iconColor: "text-pink-400",
    beneficiaries: 180,
    beneficiaryUnit: "women",
    budget: 240000,
    spent: 185000,
    location: "Paldi, Ahmedabad",
    status: "Active",
    description:
      "Tailoring, handicrafts, and digital literacy training for women from low-income households in Central Ahmedabad.",
  },
  {
    id: 5,
    name: "Mid-Day Meal Programme",
    cause: "Education",
    causeColor: "bg-blue-500/20 text-blue-300",
    icon: BookOpen,
    iconColor: "text-blue-400",
    beneficiaries: 620,
    beneficiaryUnit: "children daily",
    budget: 360000,
    spent: 310000,
    location: "Odhav, Nikol, Vatva",
    status: "Active",
    description:
      "Nutritious mid-day meals for children in 3 municipal schools, ensuring attendance and nourishment.",
  },
  {
    id: 6,
    name: "Water Conservation Camp",
    cause: "Environment",
    causeColor: "bg-green-500/20 text-green-300",
    icon: Droplets,
    iconColor: "text-cyan-400",
    beneficiaries: 980,
    beneficiaryUnit: "families",
    budget: 280000,
    spent: 195000,
    location: "Sanand Taluka, Gujarat",
    status: "Active",
    description:
      "Rainwater harvesting and drip irrigation awareness camps for farming communities around Sanand.",
  },
];

const DONATIONS = [
  {
    id: 1,
    donor: "Ambalal Charitable Trust",
    amount: 500000,
    date: "15 Apr 2025",
    method: "NEFT",
    receipt: "Issued",
  },
  {
    id: 2,
    donor: "Smt. Savita Patel",
    amount: 51000,
    date: "18 Apr 2025",
    method: "UPI",
    receipt: "Issued",
  },
  {
    id: 3,
    donor: "Rajesh Enterprises",
    amount: 200000,
    date: "02 May 2025",
    method: "Cheque",
    receipt: "Pending",
  },
  {
    id: 4,
    donor: "Shah Family Foundation",
    amount: 750000,
    date: "10 May 2025",
    method: "NEFT",
    receipt: "Issued",
  },
  {
    id: 5,
    donor: "Girish Patel Foundation",
    amount: 300000,
    date: "20 May 2025",
    method: "NEFT",
    receipt: "Issued",
  },
  {
    id: 6,
    donor: "Manak Chand & Sons",
    amount: 125000,
    date: "22 May 2025",
    method: "UPI",
    receipt: "Issued",
  },
  {
    id: 7,
    donor: "Dr. Hema Joshi",
    amount: 25000,
    date: "25 May 2025",
    method: "Online",
    receipt: "Issued",
  },
];

const VOLUNTEERS = [
  {
    id: 1,
    name: "Ritu Sharma",
    role: "Education Coordinator",
    event: "Scholarship Program",
    hours: 48,
    status: "Active",
  },
  {
    id: 2,
    name: "Manav Patel",
    role: "Field Volunteer",
    event: "Tree Plantation Drive",
    hours: 36,
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Desai",
    role: "Trainer",
    event: "Women Skill Training",
    hours: 64,
    status: "Active",
  },
  {
    id: 4,
    name: "Arjun Shah",
    role: "Medical Volunteer",
    event: "Medical Camp Naroda",
    hours: 24,
    status: "Completed",
  },
  {
    id: 5,
    name: "Sonali Mehta",
    role: "Nutrition Coordinator",
    event: "Mid-Day Meal Programme",
    hours: 52,
    status: "Active",
  },
  {
    id: 6,
    name: "Keyur Joshi",
    role: "Environment Lead",
    event: "Water Conservation Camp",
    hours: 40,
    status: "Active",
  },
];

const IMPACT = [
  { label: "Education", pct: 38, color: "bg-blue-400" },
  { label: "Healthcare", pct: 22, color: "bg-red-400" },
  { label: "Environment", pct: 20, color: "bg-green-400" },
  { label: "Women Empowerment", pct: 12, color: "bg-pink-400" },
  { label: "Nutrition", pct: 8, color: "bg-amber-400" },
];

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function NGOHubPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const causes = [
    "All",
    "Education",
    "Health",
    "Environment",
    "Women Empowerment",
  ];
  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.cause === activeFilter);

  return (
    <div className="min-h-screen bg-[#06090f] text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-gold-800/30 px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HandHeart className="w-5 h-5 text-gold-400" />
                <span className="text-xs text-gold-500 font-sans uppercase tracking-widest">
                  MSTC GLOBAL
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold text-gold-300"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                NGO Hub
              </h1>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                Social Impact &amp; Community Initiatives ·{" "}
                <span className="text-gold-500">12 Active Projects</span>
              </p>
            </div>
            <Button
              className="flex items-center gap-2 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20 h-11 px-5"
              data-ocid="ngo.download_report_button"
            >
              <Download className="w-4 h-4" />
              Impact Report PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-ocid="ngo.stats"
        >
          {[
            {
              label: "Active Projects",
              value: "12",
              icon: Award,
              color: "text-gold-400",
            },
            {
              label: "Beneficiaries",
              value: "8,400+",
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Donations This Year",
              value: "₹24.8L",
              icon: TrendingUp,
              color: "text-green-400",
            },
            {
              label: "Volunteer Hours",
              value: "2,840",
              icon: Heart,
              color: "text-pink-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-gold-800/30 rounded-xl p-4 flex flex-col gap-1"
              data-ocid={`ngo.stat.item.${i + 1}`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div className="text-xl md:text-2xl font-bold text-gold-300">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground font-sans">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Impact Distribution */}
        <div className="bg-card border border-gold-800/30 rounded-xl p-5">
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Impact Distribution
          </h2>
          <div className="space-y-3">
            {IMPACT.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-sans">
                    {item.label}
                  </span>
                  <span className="text-gold-400 font-sans font-medium">
                    {item.pct}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2
              className="font-bold text-gold-300 text-lg"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Active Initiatives
            </h2>
            <div className="flex gap-2 flex-wrap" data-ocid="ngo.cause_filter">
              {causes.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all min-h-[36px] ${
                    activeFilter === c
                      ? "bg-gold-500/20 border border-gold-500/60 text-gold-300"
                      : "border border-gold-800/30 text-muted-foreground hover:border-gold-700/50"
                  }`}
                  data-ocid={`ngo.filter.${c.toLowerCase().replace(/ /g, "_")}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => {
              const pct = Math.round((p.spent / p.budget) * 100);
              return (
                <div
                  key={p.id}
                  className="bg-card border border-gold-800/30 rounded-xl p-5 flex flex-col gap-3 hover:border-gold-600/40 transition-colors"
                  data-ocid={`ngo.project.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p.icon
                        className={`w-5 h-5 ${p.iconColor} flex-shrink-0`}
                      />
                      <span
                        className="font-semibold text-foreground text-sm leading-tight"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {p.name}
                      </span>
                    </div>
                    <Badge
                      className={`text-[10px] ${p.causeColor} border-0 flex-shrink-0`}
                    >
                      {p.cause}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {p.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <div className="text-muted-foreground">Beneficiaries</div>
                      <div className="text-gold-300 font-medium">
                        {p.beneficiaries.toLocaleString("en-IN")}{" "}
                        {p.beneficiaryUnit}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Budget</div>
                      <div className="text-gold-300 font-medium">
                        {fmt(p.budget)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">
                        Location: {p.location}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-sans mb-1">
                      <span className="text-muted-foreground">
                        Budget Utilization
                      </span>
                      <span className="text-gold-400">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-sans ${
                        p.status === "Active"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans">
                      {fmt(p.spent)} / {fmt(p.budget)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donation Tracker */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="ngo.donations_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Recent Donations
          </h2>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm font-sans min-w-[600px]">
              <thead>
                <tr className="border-b border-gold-800/20">
                  {["Donor", "Amount", "Date", "Method", "Receipt"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-2 text-muted-foreground text-xs font-medium"
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
                    className="border-b border-gold-800/10 hover:bg-muted/20 transition-colors"
                    data-ocid={`ngo.donation.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-2 text-foreground">{d.donor}</td>
                    <td className="py-2.5 px-2 text-gold-300 font-medium text-right">
                      {fmt(d.amount)}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {d.date}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {d.method}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          d.receipt === "Issued"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {d.receipt}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Volunteer Management */}
        <div
          className="bg-card border border-gold-800/30 rounded-xl p-5"
          data-ocid="ngo.volunteers_section"
        >
          <h2
            className="font-bold text-gold-300 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Volunteer Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VOLUNTEERS.map((v, i) => (
              <div
                key={v.id}
                className="bg-background border border-gold-800/20 rounded-lg p-4 flex flex-col gap-1"
                data-ocid={`ngo.volunteer.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">
                    {v.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      v.status === "Active"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
                <div className="text-xs text-gold-500 font-sans">{v.role}</div>
                <div className="text-xs text-muted-foreground font-sans">
                  {v.event}
                </div>
                <div className="text-xs text-gold-300 font-medium font-sans mt-1">
                  {v.hours} hrs contributed
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-4">
          <Button
            className="h-11 px-6 bg-gold-500/10 border border-gold-600/40 text-gold-300 hover:bg-gold-500/20"
            data-ocid="ngo.generate_report_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Impact Report PDF
          </Button>
          <Button
            className="h-11 px-6 bg-green-500/10 border border-green-600/40 text-green-300 hover:bg-green-500/20"
            data-ocid="ngo.donate_button"
          >
            <HandHeart className="w-4 h-4 mr-2" />
            Donate / Register Volunteer
          </Button>
        </div>
      </div>
    </div>
  );
}
