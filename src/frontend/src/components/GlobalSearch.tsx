import { useNavigate } from "@tanstack/react-router";
import { Command, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  label: string;
  path: string;
  category: string;
}

const ALL_APPS: SearchResult[] = [
  { label: "Master Control", path: "/master", category: "Command" },
  { label: "App Launcher", path: "/apps", category: "Command" },
  { label: "Command Center", path: "/command", category: "Command" },
  { label: "Executive Briefing", path: "/briefing", category: "Command" },
  { label: "AI Universe", path: "/ai", category: "AI" },
  { label: "Properties", path: "/properties", category: "Property" },
  {
    label: "Property Intelligence",
    path: "/intelligence",
    category: "Property",
  },
  { label: "RERA Admin", path: "/rera", category: "Property" },
  { label: "Rentals", path: "/rentals", category: "Property" },
  { label: "Commercial", path: "/commercial", category: "Property" },
  { label: "CRM", path: "/crm", category: "Sales" },
  { label: "Leads", path: "/leads", category: "Sales" },
  { label: "Clients", path: "/clients", category: "Sales" },
  { label: "Proposals", path: "/proposals", category: "Sales" },
  { label: "Appointments", path: "/appointments", category: "Sales" },
  { label: "Finance Desk", path: "/finance-desk", category: "Finance" },
  { label: "Legal Command", path: "/legal", category: "Legal" },
  { label: "Documents", path: "/documents", category: "Legal" },
  { label: "Tax", path: "/tax", category: "Finance" },
  { label: "Campaigns", path: "/campaigns", category: "Marketing" },
  { label: "WhatsApp", path: "/whatsapp", category: "Communication" },
  { label: "Events", path: "/events", category: "Events" },
  { label: "Hospitality", path: "/hospitality", category: "Events" },
  { label: "Calendar", path: "/calendar", category: "Planning" },
  { label: "NGO Hub", path: "/ngo", category: "NGO" },
  { label: "CSR Dashboard", path: "/csr", category: "NGO" },
  { label: "Sports Management", path: "/sports", category: "Media" },
  { label: "Music & Cultural", path: "/music", category: "Media" },
  { label: "Tourism", path: "/tourism", category: "Media" },
  { label: "Analytics", path: "/analytics", category: "Analytics" },
  { label: "Market Intelligence", path: "/market", category: "Analytics" },
  { label: "Security", path: "/security", category: "Security" },
  { label: "Platform Health", path: "/health", category: "Platform" },
  { label: "Deployments", path: "/deployments", category: "Platform" },
  { label: "API Manager", path: "/api", category: "Platform" },
  { label: "Observer Portal", path: "/observe", category: "Special" },
  { label: "Exchange", path: "/exchange", category: "Marketplace" },
  { label: "Franchise", path: "/franchise", category: "Growth" },
  { label: "Academy", path: "/academy", category: "Growth" },
  { label: "Staff Directory", path: "/staff", category: "Admin" },
  { label: "Settings", path: "/settings", category: "Admin" },
  { label: "Admin Panel", path: "/admin", category: "Admin" },
];

interface GlobalSearchProps {
  onClose: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results =
    query.trim().length < 1
      ? ALL_APPS.slice(0, 12)
      : ALL_APPS.filter(
          (a) =>
            a.label.toLowerCase().includes(query.toLowerCase()) ||
            a.category.toLowerCase().includes(query.toLowerCase()),
        );

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  function go(path: string) {
    navigate({ to: path });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-center pt-20 z-[200] px-4"
      data-ocid="global_search.modal"
    >
      <div className="bg-[#0d1117] border border-gold-800/40 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gold-800/30">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
            placeholder="Search apps, pages, features..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-ocid="global_search.input"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted/30 transition-colors"
            data-ocid="global_search.close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.keys(grouped).length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="global_search.empty_state"
            >
              No results for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-3">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  {category}
                </div>
                {items.map((item, i) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => go(item.path)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gold-900/20 transition-colors group"
                    data-ocid={`global_search.result.${i + 1}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gold-400">
                        {item.label.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-foreground group-hover:text-gold-300 transition-colors">
                      {item.label}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {item.path}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-gold-800/20">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-muted/40 text-[9px]">
              Esc
            </kbd>{" "}
            to close
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-muted/40 text-[9px]">
              Enter
            </kbd>{" "}
            to navigate
          </span>
          <span className="ml-auto text-[10px] text-gold-600 flex items-center gap-1">
            <Command className="w-3 h-3" /> K
          </span>
        </div>
      </div>
    </div>
  );
}
