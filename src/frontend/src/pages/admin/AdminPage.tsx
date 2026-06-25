import SecureAppGate from "@/components/shared/SecureAppGate";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ExternalLink,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_TOOLS = [
  {
    label: "Master Control",
    icon: Shield,
    href: "/master",
    desc: "Full platform oversight, session viewer, emergency lockdown",
    color: "text-red-400",
    bg: "bg-red-900/20 border-red-800/30",
  },
  {
    label: "Staff Directory",
    icon: Users,
    href: "/staff",
    desc: "Manage staff accounts, roles, permissions",
    color: "text-blue-400",
    bg: "bg-blue-900/20 border-blue-800/30",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    desc: "Platform analytics, conversion tracking, reports",
    color: "text-green-400",
    bg: "bg-green-900/20 border-green-800/30",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    desc: "Platform configuration, integrations, preferences",
    color: "text-gold-400",
    bg: "bg-gold-900/20 border-gold-800/30",
  },
];

export default function AdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="admin.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div>
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                Role-based admin tools &amp; management shortcuts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADMIN_TOOLS.map((tool, i) => (
              <Link
                key={tool.href}
                to={tool.href}
                className={`${tool.bg} border rounded-2xl p-5 hover:opacity-90 transition-all group block`}
                data-ocid={`admin.tool.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.bg} flex-shrink-0`}
                  >
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold ${tool.color} flex items-center gap-1`}
                    >
                      {tool.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {tool.desc}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-card/60 border border-gold-800/30 rounded-2xl p-5">
            <h2 className="font-serif font-bold text-gold-400 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Add Staff Member",
                  action: () => toast.info("Opening staff creation form"),
                },
                {
                  label: "View Audit Log",
                  action: () => toast.info("Opening audit trail"),
                },
                {
                  label: "Emergency Lockdown",
                  action: () =>
                    toast.error(
                      "Lockdown requires Master Control authentication",
                    ),
                },
                {
                  label: "Export All Data",
                  action: () => toast.info("Generating data export"),
                },
                {
                  label: "Manage Roles",
                  action: () => toast.info("Opening role manager"),
                },
              ].map((a, i) => (
                <Button
                  key={a.label}
                  variant="outline"
                  size="sm"
                  className="border-gold-800/30 text-gold-400 text-xs"
                  onClick={a.action}
                  data-ocid={`admin.quick_action.${i + 1}`}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
