import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Home, Plus, Wrench } from "lucide-react";
import { useState } from "react";

const TENANTS = [
  {
    id: 1,
    name: "Nilesh Shah",
    property: "Satellite 2BHK - A304",
    rent: 22000,
    leaseStart: "2024-03-01",
    leaseEnd: "2025-02-28",
    status: "Active",
    dueDate: 5,
    paid: false,
  },
  {
    id: 2,
    name: "Priti Patel",
    property: "Navrangpura Office - G01",
    rent: 45000,
    leaseStart: "2023-10-01",
    leaseEnd: "2025-09-30",
    status: "Active",
    dueDate: 1,
    paid: true,
  },
  {
    id: 3,
    name: "Kiran Verma",
    property: "Vastrapur 3BHK - B201",
    rent: 32000,
    leaseStart: "2024-07-01",
    leaseEnd: "2026-06-30",
    status: "Active",
    dueDate: 10,
    paid: false,
  },
  {
    id: 4,
    name: "Ravi Kumar",
    property: "Maninagar Shop - S05",
    rent: 18000,
    leaseStart: "2023-06-01",
    leaseEnd: "2025-05-31",
    status: "Expiring",
    dueDate: 1,
    paid: true,
  },
  {
    id: 5,
    name: "Sonal Mehta",
    property: "Bodakdev Row House",
    rent: 55000,
    leaseStart: "2024-01-01",
    leaseEnd: "2026-12-31",
    status: "Active",
    dueDate: 3,
    paid: false,
  },
];

const MAINTENANCE_REQUESTS = [
  {
    id: 1,
    tenant: "Nilesh Shah",
    property: "Satellite A304",
    issue: "Water leakage in bathroom ceiling",
    priority: "High",
    status: "In Progress",
    date: "2025-05-20",
  },
  {
    id: 2,
    tenant: "Kiran Verma",
    property: "Vastrapur B201",
    issue: "AC unit not cooling properly",
    priority: "Medium",
    status: "Scheduled",
    date: "2025-05-23",
  },
  {
    id: 3,
    tenant: "Sonal Mehta",
    property: "Bodakdev Row House",
    issue: "Painting needed in living room",
    priority: "Low",
    status: "Pending",
    date: "2025-05-25",
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-900/20 text-red-300 border-red-800/30",
  Medium: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Low: "bg-blue-900/20 text-blue-300 border-blue-800/30",
};
const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-900/20 text-green-300 border-green-800/30",
  Expiring: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
};

export default function RentalsPage() {
  const [activeTab, setActiveTab] = useState<"tenants" | "maintenance">(
    "tenants",
  );

  const overdue = TENANTS.filter(
    (t) => !t.paid && t.dueDate < new Date().getDate(),
  );

  return (
    <SecureAppGate appName="Rental Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="rentals.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Rental Manager
              </h1>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="rentals.add_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tenant
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Total Tenants",
                value: TENANTS.length,
                color: "text-gold-400",
              },
              {
                label: "Overdue Rent",
                value: overdue.length,
                color: "text-red-400",
              },
              {
                label: "Monthly Income",
                value: `₹${TENANTS.reduce((s, t) => s + t.rent, 0).toLocaleString()}`,
                color: "text-green-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p
                  className={`font-serif text-lg sm:text-xl font-bold ${s.color} truncate`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {overdue.length > 0 && (
            <div className="rounded-xl border border-red-800/30 bg-red-900/10 p-3 mb-4">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4" />
                Overdue Rent ({overdue.length})
              </div>
              {overdue.map((t) => (
                <p key={t.id} className="text-xs text-muted-foreground">
                  • {t.name} — {t.property} — ₹{t.rent.toLocaleString()}
                </p>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["tenants", "maintenance"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs border capitalize transition-colors ${activeTab === tab ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`rentals.tab.${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "tenants" && (
            <div className="overflow-x-auto rounded-xl border border-gold-800/30">
              <table className="w-full text-sm">
                <thead className="bg-card border-b border-gold-800/30">
                  <tr>
                    {[
                      "Tenant",
                      "Property",
                      "Rent/mo",
                      "Lease End",
                      "Status",
                      "Rent",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TENANTS.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                      data-ocid={`rentals.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                        {t.name}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">
                        {t.property}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-gold-400">
                        ₹{t.rent.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                        {t.leaseEnd}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${STATUS_COLORS[t.status] ?? ""}`}
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${t.paid ? "bg-green-900/20 text-green-300 border-green-800/30" : "bg-red-900/20 text-red-300 border-red-800/30"}`}
                        >
                          {t.paid ? "Paid" : "Due"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-3">
              {MAINTENANCE_REQUESTS.map((req, i) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                  data-ocid={`rentals.maintenance.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gold-600" />
                        <p className="text-sm font-medium text-foreground">
                          {req.issue}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.tenant} — {req.property} — {req.date}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${PRIORITY_COLORS[req.priority] ?? ""}`}
                      >
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
