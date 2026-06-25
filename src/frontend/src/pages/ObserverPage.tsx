import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Layout,
  Lock,
  Scale,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────

const VALID_CODES = new Set(["MSTC-2024", "OBSERVER-1", "VIEW-MSTC"]);
const GOLD = "#c9a84c";
const BG_DEEP = "#06090f";
const BG_PANEL = "rgba(255,255,255,0.04)";
const BORDER_GLASS = "rgba(201,168,76,0.18)";

// ── Live counter hook ──────────────────────────────────────────────────────

function useLiveCounter(base: number, maxDelta = 3, interval = 4200) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setVal((v) => v + Math.floor(Math.random() * maxDelta) + 1);
    }, interval);
    return () => clearInterval(id);
  }, [maxDelta, interval]);
  return val;
}

function useActivityFeed() {
  const pool = [
    "Lead qualification AI processed 14 new enquiries",
    "Property Intelligence AI added 6 listings from Gujarat RERA",
    "GateKeeper AI blocked 11 suspicious requests",
    "RERA Compliance check completed — all filings current",
    "Content AI published 2 area guides for Satellite and SG Highway",
    "Finance AI updated RBI repo rate index",
    "Legal AI reviewed 3 rental agreement drafts — zero risk flags",
    "CRM AI scored 8 leads as high-priority",
    "Anomaly Detection AI — no anomalies detected",
    "Analytics AI compiled daily performance summary",
    "Market Intelligence AI flagged new infrastructure project in Bopal",
    "Security score updated: 98/100 — FORTRESS",
  ];
  const [items, setItems] = useState(pool.slice(0, 4));
  const idx = useRef(4);
  useEffect(() => {
    const id = setInterval(() => {
      const next = pool[idx.current % pool.length];
      idx.current++;
      setItems((prev) => [next, ...prev.slice(0, 4)]);
    }, 3800);
    return () => clearInterval(id);
  }, []);
  return items;
}

// ── Frosted glass card ─────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: BG_PANEL,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: BORDER_GLASS,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Pulse dot ──────────────────────────────────────────────────────────────

function PulseDot({ color = GOLD }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// ── Metric chip ────────────────────────────────────────────────────────────

function MetricChip({
  label,
  value,
  sub,
  color = GOLD,
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: "rgba(201,168,76,0.06)",
        border: `1px solid ${BORDER_GLASS}`,
      }}
    >
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: "#8a8fa0" }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold leading-none"
        style={{ color, fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ── Locked button (read-only affordance) ───────────────────────────────────

function LockedBtn({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs cursor-not-allowed select-none"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#4a4f60",
        opacity: 0.55,
      }}
    >
      <Lock size={10} />
      {label}
    </span>
  );
}

// ── Persistent overlays ────────────────────────────────────────────────────

function Watermark() {
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Centre diagonal — large and visible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-5xl sm:text-7xl font-bold tracking-widest uppercase select-none"
          style={{
            color: "rgba(201,168,76,0.10)",
            fontFamily: "'Playfair Display', serif",
            transform: "rotate(-35deg)",
            whiteSpace: "nowrap",
            letterSpacing: "0.25em",
          }}
        >
          MSTC GLOBAL CONFIDENTIAL
        </span>
      </div>
      {/* Top-left corner label */}
      <div className="absolute top-16 left-4 opacity-40">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}
        >
          ● MSTC GLOBAL CONFIDENTIAL
        </span>
      </div>
      {/* Bottom-right corner label */}
      <div className="absolute bottom-8 right-4 opacity-40">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}
        >
          OBSERVER SESSION ACTIVE ●
        </span>
      </div>
      {/* Repeating diagonal stripe pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(201,168,76,0.5) 100px, rgba(201,168,76,0.5) 101px)",
        }}
      />
    </div>
  );
}

function ObserverBadge() {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-widest uppercase select-none"
      style={{
        background: "rgba(201,168,76,0.15)",
        border: `1px solid ${GOLD}`,
        color: GOLD,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      data-ocid="observer.mode_badge"
    >
      <Eye size={12} />
      OBSERVER MODE
    </div>
  );
}

// ── STATE 1 — Entry Screen ─────────────────────────────────────────────────

function EntryScreen({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (VALID_CODES.has(trimmed)) {
        onSuccess();
      } else {
        setError("Invalid or expired observer code.");
      }
    }, 700);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: BG_DEEP }}
      data-ocid="observer.entry_screen"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md z-10">
        <GlassCard
          className="p-8 sm:p-10"
          style={{
            boxShadow:
              "0 0 80px rgba(201,168,76,0.08), 0 4px 40px rgba(0,0,0,0.7)",
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: GOLD }}
            >
              MSTC GLOBAL
            </h1>
            <p
              className="text-xs tracking-[0.35em] uppercase font-semibold"
              style={{ color: "rgba(201,168,76,0.6)" }}
            >
              LETUS MANAGE
            </p>
            <p
              className="mt-5 text-xl font-semibold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#e8d9a0",
              }}
            >
              OBSERVER ACCESS
            </p>
          </div>

          <p
            className="text-sm text-center mb-8 leading-relaxed"
            style={{ color: "#8a8fa0" }}
          >
            You have been granted observer access to the MSTC GLOBAL universe.
            Enter your access code below to view live operations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="MSTC-OBS-XXXX"
                data-ocid="observer.code_input"
                maxLength={13}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-mono tracking-wider"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: error
                    ? "1.5px solid #ef4444"
                    : "1.5px solid rgba(201,168,76,0.4)",
                  color: "#e8d9a0",
                  outline: "none",
                  caretColor: GOLD,
                }}
                autoComplete="off"
              />
              {error && (
                <p
                  className="mt-2 text-xs flex items-center gap-1.5"
                  style={{ color: "#f87171" }}
                  data-ocid="observer.error_state"
                >
                  <AlertTriangle size={12} />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              data-ocid="observer.enter_button"
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #c9a84c 0%, #a8872e 100%)",
                color: BG_DEEP,
                letterSpacing: "0.05em",
              }}
            >
              {loading ? "Verifying…" : "Enter Observer View"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#3a3f50" }}>
            Read-only view · No data can be modified or downloaded
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

// ── Mode Selector ──────────────────────────────────────────────────────────

type ViewMode = "tour" | "side";

function ModeSelector({ onSelect }: { onSelect: (m: ViewMode) => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: BG_DEEP }}
      data-ocid="observer.mode_selector"
    >
      <ObserverBadge />
      <Watermark />

      <div className="relative z-20 w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: GOLD }}
          >
            Welcome, Observer
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#8a8fa0" }}>
            You are viewing the MSTC GLOBAL universe in real time. This is a
            read-only view. How would you like to explore?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            type="button"
            onClick={() => onSelect("tour")}
            data-ocid="observer.start_tour_button"
            className="rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: BG_PANEL,
              border: `1.5px solid ${BORDER_GLASS}`,
              backdropFilter: "blur(12px)",
            }}
          >
            <Globe size={28} className="mb-4" style={{ color: GOLD }} />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#e8d9a0" }}
            >
              Guided Tour
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#6a6f80" }}>
              Step-by-step walkthrough of all 6 key areas. Includes live data,
              progress indicator, and skip option.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect("side")}
            data-ocid="observer.side_panel_button"
            className="rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: BG_PANEL,
              border: `1.5px solid ${BORDER_GLASS}`,
              backdropFilter: "blur(12px)",
            }}
          >
            <Layout size={28} className="mb-4" style={{ color: GOLD }} />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#e8d9a0" }}
            >
              Side Panel View
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#6a6f80" }}>
              Navigate all panels freely with a persistent left sidebar. Jump
              between any section at will.
            </p>
          </button>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "#3a3f50" }}>
          Read-only · No data can be modified · Watermarked session
        </p>
      </div>
    </div>
  );
}

// ── Panel definitions ──────────────────────────────────────────────────────

const PANEL_DEFS = [
  { id: "universe", icon: Globe, label: "Universe Overview", color: GOLD },
  { id: "ai", icon: Zap, label: "AI Operations", color: "#7c9fff" },
  { id: "security", icon: Shield, label: "Security Status", color: "#4ade80" },
  {
    id: "property",
    icon: Building2,
    label: "Property Intelligence",
    color: GOLD,
  },
  {
    id: "finance",
    icon: BarChart3,
    label: "Business Metrics",
    color: "#a78bfa",
  },
  { id: "legal", icon: Scale, label: "Legal Status", color: "#38bdf8" },
] as const;

type PanelId = (typeof PANEL_DEFS)[number]["id"];

// ── Panel content components ───────────────────────────────────────────────

function UniversePanel() {
  const feed = useActivityFeed();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip label="Total Apps" value="50+" sub="All operational" />
        <MetricChip label="AI Agents" value="2,000+" sub="Active 24/7" />
        <MetricChip label="Active Sessions" value="12" sub="Right now" />
        <MetricChip label="Uptime" value="99.97%" sub="30-day avg" />
      </div>
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <PulseDot />
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: GOLD }}
          >
            Live Activity Feed
          </span>
        </div>
        <ul className="space-y-2.5">
          {feed.map((msg, i) => (
            <li
              key={`feed-${i}-${msg.slice(0, 20)}`}
              className="flex items-start gap-2.5 text-xs"
              style={{ color: i === 0 ? "#e8d9a0" : "#6a6f80" }}
            >
              <Activity
                size={12}
                className="mt-0.5 flex-shrink-0"
                style={{ color: i === 0 ? GOLD : "#4a4f60" }}
              />
              {msg}
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard className="p-4">
        <p className="text-xs mb-3" style={{ color: "#6a6f80" }}>
          All internal apps are access-controlled:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "/master",
            "/command",
            "/crm",
            "/properties",
            "/security",
            "/legal-command",
            "/analytics",
            "/apps",
          ].map((path) => (
            <span
              key={path}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs"
              style={{
                background: "rgba(201,168,76,0.06)",
                color: "#8a8fa0",
                border: `1px solid ${BORDER_GLASS}`,
              }}
            >
              <Lock size={9} style={{ color: "#4a4f60" }} /> {path}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function AIPanel({ agentCount }: { agentCount: number }) {
  const tiers = [
    { tier: "Tier 1 — Command", agents: 12, status: "All active", color: GOLD },
    {
      tier: "Tier 2 — Department",
      agents: 86,
      status: "All active",
      color: "#a78bfa",
    },
    {
      tier: "Tier 3 — Specialist",
      agents: 340,
      status: "All active",
      color: "#38bdf8",
    },
    {
      tier: "Tier 4 — Worker",
      agents: agentCount,
      status: "Running 24/7",
      color: "#4ade80",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricChip
          label="Total Agents"
          value={`${agentCount.toLocaleString()}+`}
          color="#7c9fff"
        />
        <MetricChip label="Active Clusters" value="50" sub="Running" />
        <MetricChip label="Tasks/Hour" value="8,420" sub="Processed" />
      </div>
      <div className="space-y-2">
        {tiers.map((t) => (
          <GlassCard key={t.tier} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PulseDot color={t.color} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "#e8d9a0" }}
                >
                  {t.tier}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold" style={{ color: t.color }}>
                  {t.agents.toLocaleString()}
                </span>
                <p className="text-xs" style={{ color: "#6a6f80" }}>
                  {t.status}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <LockedBtn label="Pause Agent" />
        <LockedBtn label="Retrain" />
        <LockedBtn label="View Logs" />
      </div>
    </div>
  );
}

function SecurityPanel({ threatsBlocked }: { threatsBlocked: number }) {
  const ais = [
    { name: "GateKeeper AI", stat: `${threatsBlocked} blocks today` },
    { name: "Bot Hunter AI", stat: "203 bots blocked" },
    { name: "Anomaly Detection AI", stat: "0 anomalies" },
    { name: "Dark Web Monitor AI", stat: "0 mentions found" },
    { name: "Session Guardian AI", stat: "12 sessions secured" },
    { name: "Vulnerability Scanner AI", stat: "Last scan: clean" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip
          label="Security Score"
          value="98/100"
          sub="FORTRESS"
          color="#4ade80"
        />
        <MetricChip
          label="Threats Blocked"
          value={threatsBlocked.toLocaleString()}
          sub="Today"
        />
        <MetricChip
          label="Active Monitors"
          value="52"
          sub="All green"
          color="#4ade80"
        />
        <MetricChip
          label="Open Incidents"
          value="0"
          sub="All clear"
          color="#4ade80"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ais.map((ai) => (
          <GlassCard key={ai.name} className="p-3.5 flex items-center gap-3">
            <PulseDot color="#4ade80" />
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#e8d9a0" }}
              >
                {ai.name}
              </p>
              <p className="text-xs truncate" style={{ color: "#6a6f80" }}>
                {ai.stat}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function PropertyPanel() {
  const listings = [
    {
      name: "3BHK Premium Apartment — Satellite",
      price: "₹1.85 Cr",
      status: "Active",
    },
    {
      name: "2BHK Flat — SG Highway",
      price: "₹82 L",
      status: "Under Negotiation",
    },
    {
      name: "Commercial Office — Prahladnagar",
      price: "₹4.2 Cr",
      status: "Active",
    },
    { name: "Row House — Bopal", price: "₹2.1 Cr", status: "Active" },
    { name: "Plot — Shela", price: "₹95 L", status: "New" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip label="Total Listings" value="247" sub="Ahmedabad" />
        <MetricChip label="Active Enquiries" value="84" sub="This week" />
        <MetricChip label="Site Visits" value="31" sub="Scheduled" />
        <MetricChip label="Deals Closing" value="9" sub="This month" />
      </div>
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: BORDER_GLASS }}>
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: GOLD }}
          >
            Recent Listings
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER_GLASS }}>
          {listings.map((l) => (
            <div
              key={l.name}
              className="flex items-center justify-between px-4 py-3 gap-3"
            >
              <span
                className="text-sm truncate min-w-0"
                style={{ color: "#c8cdd8" }}
              >
                {l.name}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-semibold" style={{ color: GOLD }}>
                  {l.price}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full hidden sm:inline"
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    color: GOLD,
                  }}
                >
                  {l.status}
                </span>
                <LockedBtn label="View" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function FinancePanel() {
  const rates = [
    { label: "RBI Repo Rate", val: "6.50%" },
    { label: "Home Loan Rate", val: "8.45–9.2%" },
    { label: "Stamp Duty (Gujarat)", val: "4.9%" },
    { label: "GST (Under-Constr.)", val: "5%" },
    { label: "TDS on Sale", val: "1% (>₹50L)" },
    { label: "Jantri Rate", val: "₹42,500/sqm" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricChip label="Pipeline Value" value="₹42.8 Cr" color="#a78bfa" />
        <MetricChip label="Deals Closed MTD" value="₹8.3 Cr" sub="May 2026" />
        <MetricChip label="Active Leads" value="184" sub="Qualified" />
        <MetricChip label="Conversion Rate" value="24.7%" color="#4ade80" />
        <MetricChip label="Avg Deal Size" value="₹1.4 Cr" />
        <MetricChip label="Commissions MTD" value="₹41.5 L" color="#a78bfa" />
      </div>
      <GlassCard className="p-5">
        <p
          className="text-xs uppercase tracking-widest mb-3 font-semibold"
          style={{ color: GOLD }}
        >
          Market Rates (Live)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {rates.map((r) => (
            <div key={r.label}>
              <p className="text-xs" style={{ color: "#6a6f80" }}>
                {r.label}
              </p>
              <p className="font-semibold" style={{ color: "#e8d9a0" }}>
                {r.val}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function LegalPanel() {
  const legalAIs = [
    {
      ai: "Justice AI",
      role: "Chief Legal Officer",
      task: "Overseeing 14 tasks",
    },
    { ai: "Lex AI", role: "Contracts", task: "3 contracts in review" },
    { ai: "Veda AI", role: "Compliance", task: "RERA filing in 8 days" },
    { ai: "Raksha AI", role: "Privacy Law", task: "Privacy policy updated" },
    { ai: "Niti AI", role: "Property Law", task: "0 title disputes" },
    { ai: "Sutra AI", role: "Litigation", task: "0 active disputes" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip
          label="Legal Score"
          value="96/100"
          sub="STRONG"
          color="#38bdf8"
        />
        <MetricChip label="Active Docs" value="847" />
        <MetricChip label="Pending Signatures" value="12" sub="In queue" />
        <MetricChip label="Compliance" value="100%" color="#4ade80" />
      </div>
      <GlassCard className="p-5">
        <p
          className="text-xs uppercase tracking-widest mb-3 font-semibold"
          style={{ color: GOLD }}
        >
          Legal AI Status
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {legalAIs.map((a) => (
            <div
              key={a.ai}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(56,189,248,0.05)",
                border: "1px solid rgba(56,189,248,0.12)",
              }}
            >
              <PulseDot color="#38bdf8" />
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: "#e8d9a0" }}>
                  {a.ai}{" "}
                  <span
                    className="text-xs font-normal"
                    style={{ color: "#6a6f80" }}
                  >
                    — {a.role}
                  </span>
                </p>
                <p className="text-xs" style={{ color: "#6a6f80" }}>
                  {a.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function PanelContent({
  id,
  threatsBlocked,
  agentCount,
}: { id: PanelId; threatsBlocked: number; agentCount: number }) {
  switch (id) {
    case "universe":
      return <UniversePanel />;
    case "ai":
      return <AIPanel agentCount={agentCount} />;
    case "security":
      return <SecurityPanel threatsBlocked={threatsBlocked} />;
    case "property":
      return <PropertyPanel />;
    case "finance":
      return <FinancePanel />;
    case "legal":
      return <LegalPanel />;
    default:
      return null;
  }
}

// ── STATE 2a — Guided Tour ─────────────────────────────────────────────────

function GuidedTour({
  onSwitch,
  onExit,
}: { onSwitch: () => void; onExit: () => void }) {
  const [step, setStep] = useState(0);
  const threatsBlocked = useLiveCounter(1247, 2, 5000);
  const agentCount = useLiveCounter(1562, 3, 4200);
  const total = PANEL_DEFS.length;
  const current = PANEL_DEFS[step];
  const Icon = current.icon;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: BG_DEEP }}
      data-ocid="observer.guided_tour"
    >
      <ObserverBadge />
      <Watermark />

      {/* Top bar */}
      <div
        className="sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between gap-4"
        style={{
          background: "rgba(6,9,15,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER_GLASS}`,
        }}
      >
        <h1
          className="text-base sm:text-lg font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: GOLD }}
        >
          MSTC GLOBAL — Guided Tour
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: "#6a6f80" }}>
            {step + 1} of {total}
          </span>
          <button
            type="button"
            onClick={onSwitch}
            data-ocid="observer.switch_to_side_button"
            className="text-xs underline"
            style={{ color: "#6a6f80" }}
          >
            Side Panel
          </button>
          <button
            type="button"
            onClick={onExit}
            data-ocid="observer.exit_button"
            className="text-xs"
            style={{ color: "#4a4f60" }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Welcome banner */}
      <div
        className="mx-4 sm:mx-8 mt-6 rounded-xl px-5 py-3.5 flex items-center gap-3"
        style={{
          background: "rgba(201,168,76,0.06)",
          border: `1px solid ${BORDER_GLASS}`,
        }}
      >
        <PulseDot />
        <p className="text-xs sm:text-sm" style={{ color: "#c8cdd8" }}>
          <span className="font-semibold" style={{ color: GOLD }}>
            Welcome, Observer.
          </span>{" "}
          You are viewing the MSTC GLOBAL universe in real time. This is a
          read-only view.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mx-4 sm:mx-8 mt-5 flex items-center gap-1.5 overflow-x-auto pb-1">
        {PANEL_DEFS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setStep(i)}
            data-ocid={`observer.step_${i + 1}`}
            className="flex-shrink-0 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? "2.5rem" : "1.5rem",
              background: i <= step ? GOLD : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        <span
          className="ml-2 text-xs flex-shrink-0"
          style={{ color: "#6a6f80" }}
        >
          {step + 1} of {total}
        </span>
      </div>

      {/* Step card */}
      <div className="flex-1 px-4 sm:px-8 py-5">
        <GlassCard
          className="p-5 sm:p-7"
          style={{ borderColor: `${current.color}30` }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-xl p-2.5"
              style={{ background: `${current.color}18` }}
            >
              <Icon size={20} style={{ color: current.color }} />
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: current.color }}
              >
                Step {step + 1} of {total}
              </p>
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#e8d9a0",
                }}
              >
                {current.label}
              </h2>
            </div>
          </div>

          <PanelContent
            id={current.id}
            threatsBlocked={threatsBlocked}
            agentCount={agentCount}
          />
        </GlassCard>
      </div>

      {/* Navigation */}
      <div
        className="sticky bottom-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between gap-4"
        style={{
          background: "rgba(6,9,15,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: `1px solid ${BORDER_GLASS}`,
        }}
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          data-ocid="observer.tour_prev_button"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-30 transition-opacity"
          style={{
            background: BG_PANEL,
            border: `1px solid ${BORDER_GLASS}`,
            color: "#c8cdd8",
          }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          type="button"
          onClick={onExit}
          data-ocid="observer.skip_all_button"
          className="text-xs underline"
          style={{ color: "#4a4f60" }}
        >
          skip all
        </button>

        {step < total - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            data-ocid="observer.tour_next_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #a8872e 100%)",
              color: BG_DEEP,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSwitch}
            data-ocid="observer.tour_finish_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #a8872e 100%)",
              color: BG_DEEP,
            }}
          >
            Side Panel View <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── STATE 2b — Side Panel View ─────────────────────────────────────────────

function SidePanelView({
  onSwitch,
  onExit,
}: { onSwitch: () => void; onExit: () => void }) {
  const [active, setActive] = useState<PanelId>("universe");
  const [sideOpen, setSideOpen] = useState(true);
  const threatsBlocked = useLiveCounter(1247, 2, 5000);
  const agentCount = useLiveCounter(1562, 3, 4200);
  const currentDef = PANEL_DEFS.find((p) => p.id === active)!;
  const CurIcon = currentDef.icon;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: BG_DEEP }}
      data-ocid="observer.side_panel_view"
    >
      <ObserverBadge />
      <Watermark />

      {/* Top bar */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-4"
        style={{
          background: "rgba(6,9,15,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER_GLASS}`,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSideOpen((o) => !o)}
            data-ocid="observer.toggle_sidebar_button"
            className="rounded-lg p-2 transition-colors"
            style={{
              background: BG_PANEL,
              border: `1px solid ${BORDER_GLASS}`,
            }}
            aria-label="Toggle sidebar"
          >
            <Users size={16} style={{ color: GOLD }} />
          </button>
          <h1
            className="text-base sm:text-lg font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: GOLD }}
          >
            MSTC GLOBAL — Observer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onSwitch}
            data-ocid="observer.switch_to_tour_button"
            className="text-xs underline"
            style={{ color: "#6a6f80" }}
          >
            Guided Tour
          </button>
          <button
            type="button"
            onClick={onExit}
            data-ocid="observer.side_exit_button"
            className="text-xs"
            style={{ color: "#4a4f60" }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Welcome banner */}
      <div
        className="mx-4 mt-4 rounded-xl px-5 py-3 flex items-center gap-3"
        style={{
          background: "rgba(201,168,76,0.06)",
          border: `1px solid ${BORDER_GLASS}`,
        }}
      >
        <PulseDot />
        <p className="text-xs sm:text-sm" style={{ color: "#c8cdd8" }}>
          <span className="font-semibold" style={{ color: GOLD }}>
            Welcome, Observer.
          </span>{" "}
          You are viewing the MSTC GLOBAL universe in real time. This is a
          read-only view.
        </p>
      </div>

      {/* Layout */}
      <div className="flex flex-1 gap-0 mt-4 pb-6 px-4 overflow-hidden min-h-0">
        {/* Sidebar */}
        {sideOpen && (
          <div
            className="flex-shrink-0 w-44 sm:w-52 mr-4 rounded-2xl overflow-hidden self-start"
            style={{
              background: BG_PANEL,
              border: `1px solid ${BORDER_GLASS}`,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="p-3 border-b" style={{ borderColor: BORDER_GLASS }}>
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "rgba(201,168,76,0.6)" }}
              >
                Panels
              </span>
            </div>
            <nav className="p-2 space-y-1">
              {PANEL_DEFS.map((p) => {
                const PIcon = p.icon;
                const isActive = p.id === active;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p.id)}
                    data-ocid={`observer.panel_${p.id}`}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-left transition-all duration-200"
                    style={{
                      background: isActive ? `${p.color}18` : "transparent",
                      color: isActive ? p.color : "#6a6f80",
                      border: isActive
                        ? `1px solid ${p.color}30`
                        : "1px solid transparent",
                    }}
                  >
                    <PIcon size={14} />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 sm:p-7"
            style={{
              background: BG_PANEL,
              border: `1px solid ${currentDef.color}25`,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="rounded-xl p-2.5"
                style={{ background: `${currentDef.color}18` }}
              >
                <CurIcon size={20} style={{ color: currentDef.color }} />
              </div>
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#e8d9a0",
                }}
              >
                {currentDef.label}
              </h2>
              <span
                className="ml-auto text-xs flex-shrink-0 flex items-center gap-1"
                style={{ color: "#4a4f60" }}
              >
                <Lock size={10} /> Read-only
              </span>
            </div>

            <PanelContent
              id={active}
              threatsBlocked={threatsBlocked}
              agentCount={agentCount}
            />
          </div>

          <div className="text-center pb-2">
            <button
              type="button"
              onClick={onExit}
              data-ocid="observer.side_skip_all_button"
              className="text-xs underline"
              style={{ color: "#3a3f50" }}
            >
              skip all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function ObserverPage() {
  const [phase, setPhase] = useState<"entry" | "select" | "tour" | "side">(
    "entry",
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {phase === "entry" && (
        <EntryScreen onSuccess={() => setPhase("select")} />
      )}
      {phase === "select" && (
        <ModeSelector
          onSelect={(m) => setPhase(m === "tour" ? "tour" : "side")}
        />
      )}
      {phase === "tour" && (
        <GuidedTour
          onSwitch={() => setPhase("side")}
          onExit={() => setPhase("entry")}
        />
      )}
      {phase === "side" && (
        <SidePanelView
          onSwitch={() => setPhase("tour")}
          onExit={() => setPhase("entry")}
        />
      )}
      <TutorialFloatingButton />
    </div>
  );
}
