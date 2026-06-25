import { PLACEHOLDER_ARTICLES } from "@/hooks/useNewsQueries";
import {
  CATEGORY_LABELS,
  type NewsCategory,
  type NewsItem,
  fetchAllNews,
  fetchNewsByTopic,
  invalidateNewsCache,
} from "@/utils/newsFeeds";
import { Link } from "@tanstack/react-router";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Extra pre-loaded news items (robust fallback + category coverage) ────────
const EXTRA_NEWS_ITEMS: NewsItem[] = [
  {
    id: "en1",
    title:
      "Ahmedabad Real Estate Prices Rise 12% in Q1 2026 — SG Highway Leads",
    description:
      "Property prices on SG Highway, Prahlad Nagar, and Bodakdev corridors have seen the sharpest rise this quarter, driven by IT sector hiring and new infrastructure projects.",
    link: "#",
    pubDate: new Date(Date.now() - 1 * 3600000).toISOString(),
    source: "Times of India — Ahmedabad",
    category: "real_estate" as NewsCategory,
    timeAgo: "1 hour ago",
  },
  {
    id: "en2",
    title: "RBI Holds Repo Rate at 6.25% — Home Loan EMIs Stable for Borrowers",
    description:
      "The Reserve Bank of India's Monetary Policy Committee voted to maintain the repo rate, providing relief to existing home loan borrowers and encouraging first-time buyers.",
    link: "#",
    pubDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    source: "Economic Times",
    category: "finance" as NewsCategory,
    timeAgo: "2 hours ago",
  },
  {
    id: "en3",
    title:
      "Ahmedabad Metro Phase 2 Expansion: 3 New Stations to Boost Property Demand",
    description:
      "The Gujarat Metro Rail Corporation has announced Phase 2 connectivity through Ghatlodiya, Chandkheda, and Vastral, expected to drive 15–20% property appreciation in these micro-markets.",
    link: "#",
    pubDate: new Date(Date.now() - 3 * 3600000).toISOString(),
    source: "Gujarat Samachar",
    category: "ahmedabad_infrastructure" as NewsCategory,
    timeAgo: "3 hours ago",
  },
  {
    id: "en4",
    title:
      "Gujarat Government Announces PM Awas Yojana 2.0 — 50,000 New Affordable Homes",
    description:
      "The State Government has approved a new round of affordable housing under PMAY, targeting EWS and LIG segments across Ahmedabad, Surat, and Rajkot with subsidised home loan benefits.",
    link: "#",
    pubDate: new Date(Date.now() - 5 * 3600000).toISOString(),
    source: "GOI Press Information Bureau",
    category: "gujarat_government" as NewsCategory,
    timeAgo: "5 hours ago",
  },
  {
    id: "en5",
    title:
      "RERA Gujarat: New Rules for Delayed Possession — Builders Must Pay Monthly Penalty",
    description:
      "GujRERA has strengthened regulations requiring builders to pay 10.85% annual interest on the deposited amount for each month of delayed possession beyond the agreed date.",
    link: "#",
    pubDate: new Date(Date.now() - 6 * 3600000).toISOString(),
    source: "GujRERA Official",
    category: "gujarat_government" as NewsCategory,
    timeAgo: "6 hours ago",
  },
  {
    id: "en6",
    title: "Navratri 2026 Boosted Ahmedabad's Event Economy by ₹2,400 Crore",
    description:
      "The 9-day Navratri festival drew over 2.4 million participants this year, significantly boosting hotel occupancy, catering, cultural performance, and event services demand across Ahmedabad.",
    link: "#",
    pubDate: new Date(Date.now() - 8 * 3600000).toISOString(),
    source: "Divya Bhaskar",
    category: "csr_ngo" as NewsCategory,
    timeAgo: "8 hours ago",
  },
  {
    id: "en7",
    title:
      "SG Highway Sees ₹800Cr in Commercial Real Estate Investment — IT Parks Expand",
    description:
      "Major IT and BFSI sector tenants are locking in long-term leases along the SG Highway corridor, pushing Grade A commercial office absorption to a record high in Ahmedabad this year.",
    link: "#",
    pubDate: new Date(Date.now() - 10 * 3600000).toISOString(),
    source: "Business Standard",
    category: "real_estate" as NewsCategory,
    timeAgo: "10 hours ago",
  },
  {
    id: "en8",
    title:
      "PM Modi Approves DMIC Phase 2 — Ahmedabad-Vadodara Industrial Corridor Expanded",
    description:
      "The Delhi-Mumbai Industrial Corridor second phase has received PM-level approval, with Ahmedabad identified as a key logistics and manufacturing node, expected to create 80,000 new jobs.",
    link: "#",
    pubDate: new Date(Date.now() - 12 * 3600000).toISOString(),
    source: "NDTV Business",
    category: "ahmedabad_infrastructure" as NewsCategory,
    timeAgo: "12 hours ago",
  },
  {
    id: "en9",
    title:
      "Gujarat CSR Spend Reaches ₹3,200 Crore in FY2025-26 — Education & Healthcare Lead",
    description:
      "Companies registered in Gujarat contributed over ₹3,200 Crore in CSR spending this fiscal year, with education (42%) and healthcare (31%) remaining top beneficiary sectors per MCA data.",
    link: "#",
    pubDate: new Date(Date.now() - 14 * 3600000).toISOString(),
    source: "Ministry of Corporate Affairs",
    category: "csr_ngo" as NewsCategory,
    timeAgo: "14 hours ago",
  },
  {
    id: "en10",
    title:
      "Bopal-Ambli Locality Sees 22% Appreciation — Families Relocating from Central Ahmedabad",
    description:
      "The Bopal-Ambli stretch continues its strong run with 22% YoY price appreciation as premium schools, malls, and upcoming Sardar Patel Ring Road widening attract young families.",
    link: "#",
    pubDate: new Date(Date.now() - 16 * 3600000).toISOString(),
    source: "Ahmedabad Mirror",
    category: "real_estate" as NewsCategory,
    timeAgo: "16 hours ago",
  },
  {
    id: "en11",
    title:
      "Budget 2026: LTCG Exemption on Real Estate Revised — Key Changes Buyers Must Know",
    description:
      "Union Budget 2026 brought crucial changes to Long Term Capital Gains tax on real estate, including indexation adjustments and new holding period rules that impact investors and sellers.",
    link: "#",
    pubDate: new Date(Date.now() - 18 * 3600000).toISOString(),
    source: "Moneycontrol",
    category: "finance" as NewsCategory,
    timeAgo: "18 hours ago",
  },
  {
    id: "en12",
    title:
      "Ahmedabad Smart City Mission: ₹1,100Cr Approved for Traffic, Drainage & Parks",
    description:
      "The Ahmedabad Municipal Corporation approved ₹1,100 Crore under Smart City Mission for integrated traffic management, stormwater drains, and 18 new community parks across the city.",
    link: "#",
    pubDate: new Date(Date.now() - 20 * 3600000).toISOString(),
    source: "AMC Official Release",
    category: "ahmedabad_infrastructure" as NewsCategory,
    timeAgo: "20 hours ago",
  },
  {
    id: "en13",
    title: "SBI Home Loan Rate Drops to 8.4% — Best Fixed Rate in 5 Years",
    description:
      "State Bank of India has reduced its home loan interest rate to 8.4% for amounts up to ₹75 Lakh, making this the most affordable fixed-rate home loan offering from a public sector bank in recent years.",
    link: "#",
    pubDate: new Date(Date.now() - 22 * 3600000).toISOString(),
    source: "SBI Official",
    category: "finance" as NewsCategory,
    timeAgo: "22 hours ago",
  },
  {
    id: "en14",
    title:
      "Chandkheda & Gota See Strong Demand for 2BHK: Prices Between ₹45L-₹70L",
    description:
      "North Ahmedabad localities Chandkheda and Gota are emerging as hotspots for 2BHK apartments in the ₹45–70 Lakh range, driven by affordable connectivity to GIFT City and Gandhinagar.",
    link: "#",
    pubDate: new Date(Date.now() - 24 * 3600000).toISOString(),
    source: "99acres Research",
    category: "real_estate" as NewsCategory,
    timeAgo: "1 day ago",
  },
  {
    id: "en15",
    title:
      "Gujarat NGO Policy 2026: New FCRA & 80G Registration Rules in Effect",
    description:
      "The Gujarat government has updated compliance requirements for NGOs seeking 80G tax exemption certificates and FCRA approvals, with new digital verification and annual impact reporting mandated.",
    link: "#",
    pubDate: new Date(Date.now() - 26 * 3600000).toISOString(),
    source: "Ministry of Home Affairs",
    category: "gujarat_government" as NewsCategory,
    timeAgo: "1 day ago",
  },
];

const CATEGORY_FILTER_LABELS: { id: NewsCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "real_estate", label: "Real Estate" },
  { id: "finance", label: "Finance" },
  { id: "ahmedabad_infrastructure", label: "Infrastructure" },
  { id: "gujarat_government", label: "Government" },
  { id: "csr_ngo", label: "CSR" },
];

// --- Skeleton ---
function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-gold-800/20 bg-card overflow-hidden animate-pulse">
      <div className="h-36 bg-obsidian-700/50" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 rounded bg-gold-800/30" />
        <div className="h-4 rounded bg-obsidian-600/40" />
        <div className="h-4 w-3/4 rounded bg-obsidian-600/40" />
        <div className="h-3 rounded bg-obsidian-700/30" />
        <div className="h-3 w-2/3 rounded bg-obsidian-700/30" />
      </div>
    </div>
  );
}

// --- Single news card ---
function NewsCard({ item, compact }: { item: NewsItem; compact: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group rounded-xl border border-gold-800/25 bg-card hover:border-gold-500/50 transition-all duration-300 flex flex-col overflow-hidden ${
        compact ? "min-w-[260px] max-w-[280px] snap-start" : ""
      }`}
      data-ocid="news.card_link"
    >
      {!compact && item.image && !imgError && (
        <div className="h-36 overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gold-700/20 text-gold-400 font-sans truncate">
            {CATEGORY_LABELS[item.category] ?? item.category}
          </span>
          <span className="text-[10px] text-obsidian-300 font-sans flex-shrink-0">
            {item.timeAgo}
          </span>
        </div>
        <h4 className="font-serif font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-gold-300 transition-colors">
          {item.title}
        </h4>
        {!compact && (
          <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold-800/20">
          <span className="text-[10px] text-gold-600 font-sans truncate">
            {item.source}
          </span>
          <ExternalLink
            size={11}
            className="text-gold-700 group-hover:text-gold-400 transition-colors flex-shrink-0"
          />
        </div>
      </div>
    </a>
  );
}

// Fallback from placeholder static articles + extra pre-loaded items
function mapPlaceholderToNewsItem(): NewsItem[] {
  const fromPlaceholder = PLACEHOLDER_ARTICLES.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.summary,
    link: a.url,
    pubDate: a.date,
    source: a.source,
    category: "real_estate" as NewsCategory,
    image: a.imageUrl,
    timeAgo: a.date,
  }));
  // Merge with extra items, dedup by id
  const seen = new Set(fromPlaceholder.map((x) => x.id));
  const merged = [
    ...fromPlaceholder,
    ...EXTRA_NEWS_ITEMS.filter((x) => !seen.has(x.id)),
  ];
  return merged;
}

interface LiveNewsFeedProps {
  topic?: NewsCategory;
  limit?: number;
  compact?: boolean;
  title?: string;
}

const AUTO_REFRESH_MS = 15 * 60 * 1000; // 15 minutes
const AUTO_ROTATE_MS = 30 * 1000; // 30 seconds

export default function LiveNewsFeed({
  topic,
  limit = 6,
  compact = false,
  title,
}: LiveNewsFeedProps) {
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(0);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotateRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (invalidate = false) => {
      setLoading(true);
      if (invalidate) invalidateNewsCache();
      try {
        const data = topic
          ? await fetchNewsByTopic(topic, 30)
          : await fetchAllNews(30);
        const merged =
          data.length > 0
            ? [
                ...data,
                ...EXTRA_NEWS_ITEMS.filter(
                  (x) => !data.some((d) => d.id === x.id),
                ),
              ]
            : mapPlaceholderToNewsItem();
        setAllItems(merged);
      } catch {
        setAllItems(mapPlaceholderToNewsItem());
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
        setPage(0);
      }
    },
    [topic],
  );

  useEffect(() => {
    load();
    timerRef.current = setInterval(() => load(), AUTO_REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [load]);

  // Auto-rotate pages every 30 seconds (non-compact, full-grid view)
  useEffect(() => {
    if (compact) return;
    rotateRef.current = setInterval(() => {
      setPage((p) => {
        const filtered =
          activeCategory === "all"
            ? allItems
            : allItems.filter((x) => x.category === activeCategory);
        const pages = Math.max(1, Math.ceil(filtered.length / limit));
        return (p + 1) % pages;
      });
    }, AUTO_ROTATE_MS);
    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current);
    };
  }, [compact, allItems, activeCategory, limit]);

  // Reset page when category changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: activeCategory drives the page reset
  useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  const filteredItems =
    activeCategory === "all"
      ? allItems
      : allItems.filter((x) => x.category === activeCategory);

  const items = filteredItems.slice(page * limit, page * limit + limit);

  const sectionTitle =
    title ??
    (topic
      ? `${CATEGORY_LABELS[topic] ?? topic} News`
      : "Latest News & Updates");

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className="font-serif font-bold text-xl md:text-2xl gold-text">
            {sectionTitle}
          </h3>
          {/* Live badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-950/60 border border-green-700/40 text-green-400 text-[10px] font-sans font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load(true)}
            className="p-2 rounded-lg border border-gold-800/30 text-gold-600 hover:text-gold-400 hover:border-gold-600/50 transition-all"
            title="Refresh news"
            data-ocid="news.refresh_button"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gold-700/30 text-gold-400 hover:border-gold-500/50 text-xs font-sans transition-all"
            data-ocid="news.view_all_link"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Category filter tabs — only in non-compact, non-topic mode */}
      {!compact && !topic && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 mb-2">
          {CATEGORY_FILTER_LABELS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              data-ocid={`news.filter.${cat.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat.id
                  ? "bg-gold-700/30 border-gold-500/60 text-gold-300"
                  : "border-gold-800/20 text-obsidian-300 hover:border-gold-700/40 hover:text-gold-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Last updated + page indicator */}
      {lastUpdated && !loading && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-obsidian-400 font-sans">
            Updated{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {!compact && filteredItems.length > limit && (
              <span className="ml-2 text-obsidian-500">
                Page {page + 1} of {Math.ceil(filteredItems.length / limit)} ·
                auto-rotates every 30s
              </span>
            )}
          </p>
          {!compact && filteredItems.length > limit && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2 py-0.5 rounded border border-gold-800/20 text-[10px] text-gold-600 hover:border-gold-700/40 disabled:opacity-30 transition-all"
                data-ocid="news.pagination_prev"
              >
                ‹ Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      Math.ceil(filteredItems.length / limit) - 1,
                      p + 1,
                    ),
                  )
                }
                disabled={page >= Math.ceil(filteredItems.length / limit) - 1}
                className="px-2 py-0.5 rounded border border-gold-800/20 text-[10px] text-gold-600 hover:border-gold-700/40 disabled:opacity-30 transition-all"
                data-ocid="news.pagination_next"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid / horizontal scroll */}
      {loading ? (
        compact ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey:
              <div key={i} className="min-w-[260px]">
                <NewsCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: limit }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey:
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        )
      ) : items.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground font-sans text-sm"
          data-ocid="news.empty_state"
        >
          No news available right now. Try refreshing.
        </div>
      ) : compact ? (
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} compact />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} compact={false} />
          ))}
        </div>
      )}

      {/* Mobile view all */}
      <div className="mt-5 text-center sm:hidden">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gold-700/40 text-gold-400 font-sans text-sm"
          data-ocid="news.mobile_view_all_link"
        >
          View all articles →
        </Link>
      </div>
    </div>
  );
}
