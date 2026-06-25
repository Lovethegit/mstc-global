import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { PLACEHOLDER_ARTICLES } from "@/hooks/useNewsQueries";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  type NewsCategory,
  type NewsItem,
  fetchAllNews,
  fetchNewsByTopic,
  invalidateNewsCache,
} from "@/utils/newsFeeds";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 12;

const TABS: { id: "all" | NewsCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "real_estate", label: "Real Estate" },
  { id: "finance", label: "Finance" },
  { id: "ahmedabad_infrastructure", label: "Ahmedabad" },
  { id: "sports", label: "Sports" },
  { id: "music_culture", label: "Culture" },
  { id: "csr_ngo", label: "CSR" },
  { id: "tourism_travel", label: "Tourism" },
];

function stripHtmlLocal(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function mapPlaceholderToNewsItem(): NewsItem[] {
  return PLACEHOLDER_ARTICLES.map((a) => ({
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
}

function NewsCard({ item }: { item: NewsItem }) {
  const [imgError, setImgError] = useState(false);
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-gold-800/25 bg-card hover:border-gold-500/45 transition-all duration-300 overflow-hidden h-full"
      data-ocid="news.article_card"
    >
      {item.image && !imgError && (
        <div className="h-40 overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-gold-700/20 text-gold-400 font-sans truncate max-w-[100px]">
            {CATEGORY_LABELS[item.category] ?? item.category}
          </span>
          <span className="text-[10px] text-obsidian-300 font-sans flex-shrink-0">
            {item.timeAgo ?? item.pubDate}
          </span>
        </div>
        <h3 className="font-serif font-semibold text-sm md:text-base text-foreground leading-snug line-clamp-2 group-hover:text-gold-300 transition-colors">
          {item.title}
        </h3>
        <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {stripHtmlLocal(item.description)}
        </p>
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gold-800/20">
          <span className="text-[10px] text-gold-600 font-sans truncate">
            {item.source}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gold-500 font-sans group-hover:text-gold-300 transition-colors">
            Read <ExternalLink size={10} />
          </span>
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gold-800/20 bg-card overflow-hidden animate-pulse">
      <div className="h-40 bg-obsidian-700/50" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded bg-gold-800/30" />
        <div className="h-4 rounded bg-obsidian-600/40" />
        <div className="h-4 w-4/5 rounded bg-obsidian-600/40" />
        <div className="h-3 rounded bg-obsidian-700/30" />
        <div className="h-3 w-3/4 rounded bg-obsidian-700/30" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<"all" | NewsCategory>("all");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadNews = useCallback(
    async (tab: "all" | NewsCategory, invalidate = false) => {
      setLoading(true);
      if (invalidate) invalidateNewsCache();
      try {
        const data =
          tab === "all"
            ? await fetchAllNews(PAGE_SIZE * 3)
            : await fetchNewsByTopic(tab, PAGE_SIZE * 3);
        if (data.length > 0) {
          setItems(data);
        } else {
          setItems(mapPlaceholderToNewsItem());
        }
      } catch {
        setItems(mapPlaceholderToNewsItem());
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    loadNews(activeTab);
  }, [activeTab, loadNews]);

  const tabDescription =
    activeTab === "all"
      ? "The latest headlines across all our tracked topics — real estate, finance, Ahmedabad, sports, culture, CSR, and tourism."
      : CATEGORY_DESCRIPTIONS[activeTab];

  const visible = items.slice(0, PAGE_SIZE * page);
  const hasMore = visible.length < items.length;

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main className="pt-20">
        {/* Hero header */}
        <section className="py-12 px-4 bg-obsidian-800/40 border-b border-gold-800/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Newspaper className="text-gold-400" size={24} />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-950/60 border border-green-700/40 text-green-400 text-[10px] font-sans font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    LIVE
                  </span>
                </div>
                <h1 className="font-serif font-bold text-3xl md:text-4xl gold-text mb-2">
                  Latest News &amp; Updates
                </h1>
                <p className="font-sans text-sm text-obsidian-200 max-w-xl">
                  Real-time news from real estate, finance, Ahmedabad, sports,
                  culture, CSR &amp; tourism — always fresh, always relevant.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-obsidian-400 font-sans">
                    Updated{" "}
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => loadNews(activeTab, true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-700/40 text-gold-400 hover:border-gold-500/60 font-sans text-sm transition-all disabled:opacity-50"
                  data-ocid="news.refresh_button"
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab bar */}
        <section className="sticky top-[60px] z-30 bg-obsidian-900/95 backdrop-blur-sm border-b border-gold-800/20 px-4">
          <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none">
            <div className="flex gap-0 min-w-max" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3.5 text-xs font-sans font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-gold-500 text-gold-300"
                      : "border-transparent text-obsidian-300 hover:text-gold-400"
                  }`}
                  data-ocid={`news.tab_${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab description */}
        <section className="py-6 px-4 bg-obsidian-800/20">
          <div className="max-w-7xl mx-auto">
            <p className="font-sans text-sm text-obsidian-200 max-w-2xl">
              {tabDescription}
            </p>
          </div>
        </section>

        {/* News grid */}
        <section className="py-8 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey:
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground font-sans"
                data-ocid="news.empty_state"
              >
                <Newspaper size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-base mb-2">No articles found</p>
                <p className="text-sm opacity-60">
                  Try refreshing or selecting another category.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visible.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gold-700/40 text-gold-400 hover:border-gold-500/60 font-sans text-sm transition-all"
                      data-ocid="news.load_more_button"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
