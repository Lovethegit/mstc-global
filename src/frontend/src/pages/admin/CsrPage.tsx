import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Download, Plus, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
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
import { toast } from "sonner";

const INITIATIVES = [
  {
    id: 1,
    name: "Vidya Shakti – Digital Schools",
    category: "Education",
    budget: 1200000,
    spent: 840000,
    impact: "3,200 students",
    beneficiaries: 3200,
    status: "Active",
    start: "2025-04-01",
  },
  {
    id: 2,
    name: "Green Ahmedabad Tree Drive",
    category: "Environment",
    budget: 500000,
    spent: 380000,
    impact: "12,000 trees planted",
    beneficiaries: 50000,
    status: "Active",
    start: "2025-06-01",
  },
  {
    id: 3,
    name: "Mobile Health Clinic – Sanand",
    category: "Health",
    budget: 800000,
    spent: 650000,
    impact: "4,800 patients",
    beneficiaries: 4800,
    status: "Active",
    start: "2025-03-15",
  },
  {
    id: 4,
    name: "Tribal Youth Sports Academy",
    category: "Sports",
    budget: 600000,
    spent: 320000,
    impact: "240 athletes",
    beneficiaries: 240,
    status: "Active",
    start: "2025-08-01",
  },
  {
    id: 5,
    name: "Gujarat Heritage Music Festival",
    category: "Arts & Culture",
    budget: 400000,
    spent: 400000,
    impact: "8,000 attendees",
    beneficiaries: 8000,
    status: "Completed",
    start: "2025-02-01",
  },
  {
    id: 6,
    name: "Solar Panels for Rural Schools",
    category: "Environment",
    budget: 700000,
    spent: 560000,
    impact: "18 schools powered",
    beneficiaries: 5400,
    status: "Active",
    start: "2025-05-01",
  },
];

const PIE_DATA = [
  { name: "Education", value: 30, color: "#3b82f6" },
  { name: "Environment", value: 25, color: "#22c55e" },
  { name: "Health", value: 20, color: "#ef4444" },
  { name: "Sports", value: 15, color: "#c9a84c" },
  { name: "Arts & Culture", value: 10, color: "#a855f7" },
];

const IMPACT_DATA = [
  { month: "Jan", beneficiaries: 1200 },
  { month: "Feb", beneficiaries: 2100 },
  { month: "Mar", beneficiaries: 3400 },
  { month: "Apr", beneficiaries: 4800 },
  { month: "May", beneficiaries: 6200 },
  { month: "Jun", beneficiaries: 7100 },
];

const ESG = [
  { label: "Environmental", score: 78, color: "#22c55e" },
  { label: "Social", score: 85, color: "#3b82f6" },
  { label: "Governance", score: 91, color: "#c9a84c" },
];

const TABS = ["Initiatives", "Budget", "Impact Report"] as const;
type Tab = (typeof TABS)[number];

export default function CsrPage() {
  const [tab, setTab] = useState<Tab>("Initiatives");
  const totalBudget = INITIATIVES.reduce((a, i) => a + i.budget, 0);
  const totalSpent = INITIATIVES.reduce((a, i) => a + i.spent, 0);
  const totalBeneficiaries = INITIATIVES.reduce(
    (a, i) => a + i.beneficiaries,
    0,
  );

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="csr.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                CSR Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Initiative tracker, budget allocation & impact measurement
              </p>
            </div>
            <Button
              onClick={() => toast.success("New initiative form opened")}
              className="bg-primary text-primary-foreground"
              data-ocid="csr.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> New Initiative
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Active Initiatives",
                value: INITIATIVES.filter(
                  (i) => i.status === "Active",
                ).length.toString(),
                color: "text-gold-400",
              },
              {
                label: "Total Budget",
                value: `₹${(totalBudget / 100000).toFixed(1)}L`,
                color: "text-blue-400",
              },
              {
                label: "Utilization",
                value: `${Math.round((totalSpent / totalBudget) * 100)}%`,
                color: "text-green-400",
              },
              {
                label: "Beneficiaries",
                value: totalBeneficiaries.toLocaleString(),
                color: "text-purple-400",
              },
            ].map((k, i) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`csr.kpi.${i + 1}`}
              >
                <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          {/* ESG Scores */}
          <div className="grid grid-cols-3 gap-3">
            {ESG.map((e) => (
              <div
                key={e.label}
                className="bg-card/60 border border-gold-800/30 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold" style={{ color: e.color }}>
                  {e.score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {e.label} Score
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${e.score}%`, backgroundColor: e.color }}
                  />
                </div>
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
                data-ocid={`csr.tab.${t.toLowerCase().replace(/ /g, "_")}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Initiatives */}
          {tab === "Initiatives" && (
            <div className="space-y-3">
              {INITIATIVES.map((init, i) => (
                <div
                  key={init.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                  data-ocid={`csr.initiative.item.${i + 1}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {init.name}
                        </span>
                        <Badge
                          className={
                            init.status === "Active"
                              ? "bg-green-900/30 text-green-300 border-green-700/40"
                              : "bg-muted/30 text-muted-foreground border-border"
                          }
                        >
                          {init.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-gold-800/30 text-gold-400 text-xs"
                        >
                          {init.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Impact: {init.impact} · Started: {init.start}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[120px]">
                      <div className="text-xs text-muted-foreground">
                        ₹{init.spent.toLocaleString()} / ₹
                        {init.budget.toLocaleString()}
                      </div>
                      <div className="w-full h-1.5 bg-muted/30 rounded-full">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, Math.round((init.spent / init.budget) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gold-400">
                        {Math.round((init.spent / init.budget) * 100)}% utilised
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-800/30 text-gold-400 text-xs"
                        onClick={() => toast.info(`Viewing ${init.name}`)}
                        data-ocid={`csr.initiative.view_button.${i + 1}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary/20 text-primary text-xs"
                        onClick={() => toast.success(`Editing ${init.name}`)}
                        data-ocid={`csr.initiative.edit_button.${i + 1}`}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Budget */}
          {tab === "Budget" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card/80 border border-gold-800/30 rounded-xl p-5">
                <h3 className="font-serif font-semibold text-gold-400 mb-4">
                  Budget by Category
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                      fontSize={10}
                    >
                      {PIE_DATA.map((entry, idx) => (
                        <Cell
                          key={`cell-${entry.color}-${idx}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `${v}%`}
                      contentStyle={{
                        background: "#1a1f2e",
                        border: "1px solid #c9a84c40",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card/80 border border-gold-800/30 rounded-xl p-5">
                <h3 className="font-serif font-semibold text-gold-400 mb-4">
                  Initiative Budget Status
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={INITIATIVES.map((i) => ({
                      name: i.category,
                      spent: i.spent / 1000,
                      budget: i.budget / 1000,
                    }))}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#c9a84c15" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fill: "#9ca3af" }}
                    />
                    <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1f2e",
                        border: "1px solid #c9a84c40",
                      }}
                      formatter={(v) => `₹${v}K`}
                    />
                    <Legend />
                    <Bar dataKey="budget" name="Budget" fill="#c9a84c40" />
                    <Bar dataKey="spent" name="Spent" fill="#c9a84c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Impact Report */}
          {tab === "Impact Report" && (
            <div className="space-y-6">
              <div className="bg-card/80 border border-gold-800/30 rounded-xl p-5">
                <h3 className="font-serif font-semibold text-gold-400 mb-4">
                  Monthly Beneficiary Growth
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={IMPACT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#c9a84c15" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1f2e",
                        border: "1px solid #c9a84c40",
                      }}
                    />
                    <Bar
                      dataKey="beneficiaries"
                      name="Beneficiaries"
                      fill="#c9a84c"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() =>
                  toast.success("CSR Impact Report PDF generated!")
                }
                data-ocid="csr.report.download_button"
              >
                <Download className="w-4 h-4 mr-2" /> Generate Annual Impact
                Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
