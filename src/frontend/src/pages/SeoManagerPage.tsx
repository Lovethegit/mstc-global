import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  ChevronUp,
  Globe,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface PageSeoData {
  path: string;
  title: string;
  description: string;
  score: number;
  issues: string[];
  keywords: string[];
  traffic: number;
}

const SEO_PAGES: PageSeoData[] = [
  {
    path: "/",
    title: "MSTC GLOBAL — Luxury Property & Business Conglomerate",
    description:
      "MSTC GLOBAL offers premium real estate, RERA consulting, finance, events, NGO, music and tourism services in Ahmedabad, Gujarat.",
    score: 92,
    issues: [],
    keywords: ["MSTC GLOBAL", "luxury property Ahmedabad", "RERA consulting"],
    traffic: 4280,
  },
  {
    path: "/services/infrastructure",
    title: "Infrastructure & Property Services — MSTC GLOBAL",
    description:
      "Premium residential, commercial and industrial infrastructure projects across Ahmedabad and Gujarat.",
    score: 87,
    issues: ["Missing H2 tags"],
    keywords: [
      "infrastructure Ahmedabad",
      "property developer Gujarat",
      "commercial real estate",
    ],
    traffic: 1640,
  },
  {
    path: "/services/rera-consulting",
    title: "RERA Consulting Services — MSTC GLOBAL",
    description:
      "Expert RERA promoter registration, agent compliance and dispute resolution across Gujarat.",
    score: 95,
    issues: [],
    keywords: [
      "RERA Gujarat",
      "RERA consultant Ahmedabad",
      "promoter registration",
    ],
    traffic: 2110,
  },
  {
    path: "/services/finance",
    title: "Finance & Investment Services — MSTC GLOBAL",
    description:
      "Home loans, business loans, equity funding and investment advisory from MSTC GLOBAL Finance.",
    score: 81,
    issues: ["Title too long — 65 chars", "Missing alt tags"],
    keywords: [
      "home loan Ahmedabad",
      "business loan Gujarat",
      "equity funding",
    ],
    traffic: 1870,
  },
  {
    path: "/property-portal",
    title: "Property Listings Portal — MSTC GLOBAL",
    description:
      "Browse verified residential, commercial and industrial properties across Ahmedabad. No middleman, direct from MSTC.",
    score: 78,
    issues: ["Duplicate H1", "Slow LCP — 4.2s"],
    keywords: [
      "property Ahmedabad",
      "flats for sale Gujarat",
      "commercial plots",
    ],
    traffic: 3450,
  },
  {
    path: "/blog",
    title: "Real Estate & Finance Blog — MSTC GLOBAL",
    description:
      "Expert insights on Ahmedabad real estate, RERA changes, home loan trends and investment strategies.",
    score: 84,
    issues: ["Missing canonical"],
    keywords: ["real estate blog", "property news India", "RERA updates"],
    traffic: 920,
  },
  {
    path: "/services/hospitality-events",
    title: "Hospitality & Events — MSTC GLOBAL",
    description:
      "Corporate events, venue booking and luxury hospitality services in Ahmedabad.",
    score: 72,
    issues: [
      "Short meta description",
      "Missing OG image",
      "Low keyword density",
    ],
    keywords: ["events Ahmedabad", "venue booking Gujarat", "corporate events"],
    traffic: 640,
  },
  {
    path: "/services/music-cultural",
    title: "Music & Cultural Services — MSTC GLOBAL",
    description:
      "Artist management, music production and cultural event planning across India.",
    score: 68,
    issues: ["No structured data", "Missing alt tags", "Thin content"],
    keywords: [
      "music artist management",
      "cultural events Gujarat",
      "music production India",
    ],
    traffic: 380,
  },
  {
    path: "/area-guides",
    title: "Ahmedabad Area Guides — MSTC GLOBAL",
    description:
      "Explore Prahlad Nagar, Bodakdev, Satellite City, S.G. Highway, Navrangpura and more.",
    score: 89,
    issues: [],
    keywords: [
      "Prahlad Nagar property",
      "Bodakdev flats",
      "S.G. Highway commercial",
    ],
    traffic: 1120,
  },
  {
    path: "/nri-corner",
    title: "NRI Property Investment — MSTC GLOBAL",
    description:
      "Complete NRI property investment guide for Ahmedabad — FEMA, taxation, RERA, power of attorney.",
    score: 91,
    issues: [],
    keywords: [
      "NRI property India",
      "NRI investment Ahmedabad",
      "FEMA property",
    ],
    traffic: 1890,
  },
];

const scoreColor = (s: number) =>
  s >= 90 ? "text-green-400" : s >= 75 ? "text-yellow-400" : "text-red-400";
const scoreBarColor = (s: number) =>
  s >= 90 ? "bg-green-500" : s >= 75 ? "bg-yellow-500" : "bg-red-500";

function SeoManagerInner() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PageSeoData | null>(null);
  const [pages, setPages] = useState<PageSeoData[]>(SEO_PAGES);

  const filtered = pages.filter(
    (p) =>
      !search ||
      p.path.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()),
  );
  const avgScore = Math.round(
    pages.reduce((s, p) => s + p.score, 0) / pages.length,
  );
  const totalIssues = pages.reduce((s, p) => s + p.issues.length, 0);
  const totalTraffic = pages.reduce((s, p) => s + p.traffic, 0);

  return (
    <div className="min-h-screen bg-background" data-ocid="seo.page">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              SEO Manager
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Avg SEO Score",
              value: `${avgScore}/100`,
              icon: BarChart2,
              color: scoreColor(avgScore),
            },
            {
              label: "Pages Tracked",
              value: pages.length,
              icon: Globe,
              color: "text-gold-400",
            },
            {
              label: "Open Issues",
              value: totalIssues,
              icon: AlertTriangle,
              color: totalIssues > 0 ? "text-yellow-400" : "text-green-400",
            },
            {
              label: "Monthly Traffic",
              value: totalTraffic.toLocaleString(),
              icon: TrendingUp,
              color: "text-blue-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gold-800/30 bg-card p-3"
            >
              <p className={`font-serif text-xl font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full bg-background border border-gold-800/30 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold-700/50"
            data-ocid="seo.search_input"
          />
        </div>

        {/* Pages table */}
        <div className="space-y-2">
          {filtered.map((page, i) => (
            <div
              key={page.path}
              className="rounded-xl border border-gold-800/20 bg-card p-4"
              data-ocid={`seo.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gold-500 bg-gold-900/20 px-2 py-0.5 rounded">
                      {page.path}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {page.traffic.toLocaleString()} visits/mo
                    </span>
                  </div>
                  <p className="font-sans text-sm font-medium text-foreground truncate">
                    {page.title}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {page.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {page.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted/20 text-muted-foreground border border-gold-800/10"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-serif text-lg font-bold ${scoreColor(page.score)}`}
                    >
                      {page.score}
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scoreBarColor(page.score)}`}
                        style={{ width: `${page.score}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(page)}
                    className="text-xs text-gold-400 hover:text-gold-300 underline"
                    data-ocid={`seo.edit_button.${i + 1}`}
                  >
                    Edit Meta
                  </button>
                </div>
              </div>
              {page.issues.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gold-800/20 flex flex-wrap gap-2">
                  {page.issues.map((issue) => (
                    <div
                      key={issue}
                      className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-900/10 border border-yellow-800/20 px-2 py-0.5 rounded"
                    >
                      <AlertTriangle className="w-3 h-3" /> {issue}
                    </div>
                  ))}
                </div>
              )}
              {page.issues.length === 0 && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-green-400">
                  <CheckCircle className="w-3 h-3" /> No issues
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Keyword Opportunities */}
        <div className="mt-6 rounded-xl border border-gold-800/20 bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <ChevronUp className="w-4 h-4 text-gold-400" />
            <h2 className="font-serif font-semibold text-foreground text-sm">
              Top Keyword Opportunities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                keyword: "luxury flats Ahmedabad",
                volume: "4,400/mo",
                difficulty: "Medium",
                potential: "High",
              },
              {
                keyword: "RERA agent registration Gujarat",
                volume: "1,200/mo",
                difficulty: "Low",
                potential: "High",
              },
              {
                keyword: "redevelopment project Ahmedabad",
                volume: "880/mo",
                difficulty: "Low",
                potential: "High",
              },
              {
                keyword: "NRI investment property Gujarat",
                volume: "2,900/mo",
                difficulty: "Medium",
                potential: "Very High",
              },
              {
                keyword: "commercial property S.G. Highway",
                volume: "1,600/mo",
                difficulty: "Medium",
                potential: "High",
              },
              {
                keyword: "home loan EMI calculator Gujarat",
                volume: "6,200/mo",
                difficulty: "High",
                potential: "Medium",
              },
            ].map((kw) => (
              <div
                key={kw.keyword}
                className="flex items-center justify-between p-2 rounded-lg border border-gold-800/10 bg-background/40"
              >
                <div>
                  <p className="text-xs text-foreground font-medium">
                    {kw.keyword}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {kw.volume} — Difficulty: {kw.difficulty}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${kw.potential === "Very High" ? "bg-green-900/20 text-green-400 border-green-800/30" : "bg-gold-900/20 text-gold-400 border-gold-800/30"}`}
                >
                  {kw.potential}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-ocid="seo.edit.dialog"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditing(null)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
            role="presentation"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-gold-800/40 bg-card p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              data-ocid="seo.edit.close_button"
            >
              <span className="text-xl font-light">×</span>
            </button>
            <h3 className="font-serif text-lg font-bold text-gold-400 mb-4">
              Edit Meta — {editing.path}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Title{" "}
                  <span className="text-gold-600">
                    {editing.title.length}/60
                  </span>
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold-700/50"
                  data-ocid="seo.edit.title.input"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Description{" "}
                  <span className="text-gold-600">
                    {editing.description.length}/160
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full bg-background border border-gold-800/30 rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-gold-700/50"
                  data-ocid="seo.edit.description.textarea"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setPages((prev) =>
                    prev.map((p) => (p.path === editing.path ? editing : p)),
                  );
                  setEditing(null);
                }}
                className="flex-1 py-2 rounded-lg bg-gold-700 hover:bg-gold-600 text-background font-semibold text-sm"
                data-ocid="seo.edit.save_button"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg border border-gold-800/30 text-muted-foreground hover:text-foreground text-sm"
                data-ocid="seo.edit.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeoManagerPage() {
  return (
    <SecureAppGate appName="SEO Manager">
      <SeoManagerInner />
    </SecureAppGate>
  );
}
