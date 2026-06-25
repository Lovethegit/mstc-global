import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_DATA = [
  { name: "Education", value: 30, color: "#3b82f6" },
  { name: "Environment", value: 25, color: "#22c55e" },
  { name: "Health", value: 20, color: "#ef4444" },
  { name: "Sports", value: 15, color: "#c9a84c" },
  { name: "Arts & Culture", value: 10, color: "#a855f7" },
];

const PROJECTS = [
  {
    id: 1,
    name: "Vidya Shakti – Digital Schools",
    category: "Education",
    budget: 1200000,
    spent: 840000,
    impact: "3,200 students",
    status: "Active",
  },
  {
    id: 2,
    name: "Green Ahmedabad Tree Drive",
    category: "Environment",
    budget: 500000,
    spent: 380000,
    impact: "12,000 trees planted",
    status: "Active",
  },
  {
    id: 3,
    name: "Mobile Health Clinic – Sanand",
    category: "Health",
    budget: 800000,
    spent: 650000,
    impact: "4,800 patients",
    status: "Active",
  },
  {
    id: 4,
    name: "Tribal Youth Sports Academy",
    category: "Sports",
    budget: 600000,
    spent: 320000,
    impact: "240 athletes",
    status: "Active",
  },
  {
    id: 5,
    name: "Gujarat Heritage Music Festival",
    category: "Arts & Culture",
    budget: 400000,
    spent: 280000,
    impact: "8,000 attendees",
    status: "Completed",
  },
  {
    id: 6,
    name: "Solar Panel for Rural Schools",
    category: "Environment",
    budget: 700000,
    spent: 560000,
    impact: "18 schools",
    status: "Active",
  },
];

const GRANTS = [
  {
    id: 1,
    name: "NABARD CSR Matching Grant",
    amount: 2500000,
    deadline: "2026-07-31",
    eligibility: "Education + Agriculture",
    status: "Open",
  },
  {
    id: 2,
    name: "GPCB Environmental Fund",
    amount: 1800000,
    deadline: "2026-08-15",
    eligibility: "Environmental projects",
    status: "Open",
  },
  {
    id: 3,
    name: "Sports Authority of India",
    amount: 1200000,
    deadline: "2026-06-30",
    eligibility: "Tribal & rural sports",
    status: "Closing Soon",
  },
  {
    id: 4,
    name: "National Health Mission CSR",
    amount: 3000000,
    deadline: "2026-09-30",
    eligibility: "Health & nutrition",
    status: "Open",
  },
];

const ESG = [
  {
    label: "Environmental",
    score: 78,
    color: "#22c55e",
    desc: "Green projects, energy, waste",
  },
  {
    label: "Social",
    score: 85,
    color: "#3b82f6",
    desc: "Community impact, education, health",
  },
  {
    label: "Governance",
    score: 91,
    color: "#c9a84c",
    desc: "Transparency, compliance, reporting",
  },
];

export default function CsrAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              CSR Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Corporate Social Responsibility – Budget, Impact & Grants
            </p>
          </div>

          {/* ESG Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ESG.map((e) => (
              <div
                key={e.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-5"
                data-ocid={`csr.esg.${e.label.toLowerCase()}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {e.label} Score
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: e.color }}
                  >
                    {e.score}/100
                  </span>
                </div>
                <div className="h-2 bg-muted/40 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${e.score}%`, background: e.color }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Budget Pie Chart */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-4">
                CSR Budget Allocation
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      background: "#0d1117",
                      border: "1px solid #c9a84c40",
                      borderRadius: 8,
                      color: "#f5d78e",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#a08050" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Grant Opportunities */}
            <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
              <h2 className="font-bold text-gold-300 mb-3">
                Grant Opportunities
              </h2>
              <div className="space-y-3">
                {GRANTS.map((g, i) => (
                  <div
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gold-800/20 rounded-lg p-3"
                    data-ocid={`csr.grant.item.${i + 1}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {g.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {g.eligibility} · Deadline: {g.deadline}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-green-400 font-semibold text-sm whitespace-nowrap">
                        ₹{(g.amount / 100000).toFixed(1)}L
                      </span>
                      <Badge
                        className={
                          g.status === "Closing Soon"
                            ? "bg-red-900/30 text-red-300 border-red-700/40 text-[10px]"
                            : "bg-green-900/30 text-green-300 border-green-700/40 text-[10px]"
                        }
                      >
                        {g.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-4">Project Tracker</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className="border border-gold-800/20 rounded-lg p-3 space-y-2"
                  data-ocid={`csr.project.item.${i + 1}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gold-400">
                      {p.category}
                    </span>
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
                  <p className="text-sm font-medium text-foreground">
                    {p.name}
                  </p>
                  <p className="text-xs text-blue-400">📊 {p.impact}</p>
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Budget utilisation</span>
                      <span className="text-gold-400">
                        {Math.round((p.spent / p.budget) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500/60 rounded-full"
                        style={{ width: `${(p.spent / p.budget) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Spent: ₹{(p.spent / 100000).toFixed(1)}L</span>
                      <span>Budget: ₹{(p.budget / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
