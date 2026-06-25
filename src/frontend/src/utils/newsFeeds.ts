// Live news fetching utility for MSTC GLOBAL
// Uses rss2json.com (free, no auth) to convert RSS feeds into JSON
// Results cached in sessionStorage for 30 minutes

export type NewsCategory =
  | "real_estate"
  | "finance"
  | "ahmedabad_infrastructure"
  | "gujarat_government"
  | "music_culture"
  | "sports"
  | "csr_ngo"
  | "tourism_travel"
  | "general";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: NewsCategory;
  image?: string;
  timeAgo?: string;
}

const RSS2JSON_BASE = "https://api.rss2json.com/v1/api.json";

// RSS feeds per category (2-3 per category, no auth required)
const FEED_SOURCES: Record<NewsCategory, { url: string; source: string }[]> = {
  real_estate: [
    {
      url: "https://economictimes.indiatimes.com/industry/services/property-/-cstruction/rssfeeds/13358091.cms",
      source: "Economic Times",
    },
    {
      url: "https://feeds.feedburner.com/ndtv/realestate",
      source: "NDTV Real Estate",
    },
  ],
  finance: [
    {
      url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
      source: "Economic Times Markets",
    },
    {
      url: "https://feeds.feedburner.com/ndtv/business",
      source: "NDTV Business",
    },
  ],
  ahmedabad_infrastructure: [
    {
      url: "https://timesofindia.indiatimes.com/city/ahmedabad/rssfeedstopstories.cms",
      source: "Times of India Ahmedabad",
    },
  ],
  gujarat_government: [
    {
      url: "https://timesofindia.indiatimes.com/city/ahmedabad/rssfeedstopstories.cms",
      source: "Times of India Gujarat",
    },
    {
      url: "https://feeds.feedburner.com/ndtv/business",
      source: "NDTV Business",
    },
  ],
  music_culture: [
    {
      url: "https://feeds.feedburner.com/ndtv/entertainment",
      source: "NDTV Entertainment",
    },
  ],
  sports: [
    { url: "https://sports.ndtv.com/rss/all", source: "NDTV Sports" },
    {
      url: "https://timesofindia.indiatimes.com/rssfeeds/-2128938764.cms",
      source: "Times of India Sports",
    },
  ],
  csr_ngo: [
    {
      url: "https://feeds.feedburner.com/ndtv/business",
      source: "NDTV CSR",
    },
  ],
  tourism_travel: [
    {
      url: "https://feeds.feedburner.com/ndtv/lifestyle",
      source: "NDTV Lifestyle",
    },
  ],
  general: [
    {
      url: "https://feeds.feedburner.com/ndtv/business",
      source: "NDTV Business",
    },
    {
      url: "https://timesofindia.indiatimes.com/city/ahmedabad/rssfeedstopstories.cms",
      source: "Times of India",
    },
  ],
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCacheKey(category: string) {
  return `mstc_news_${category}`;
}

function readCache(key: string): NewsItem[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: NewsItem[]; ts: number };
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: NewsItem[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage might be full — ignore
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function formatTimeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

interface RssItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { link?: string };
  thumbnail?: string;
  "media:content"?: { url?: string };
}

interface Rss2JsonResponse {
  status: string;
  items?: RssItem[];
}

async function fetchFeed(
  feedUrl: string,
  source: string,
  category: NewsCategory,
  count = 8,
): Promise<NewsItem[]> {
  try {
    const url = `${RSS2JSON_BASE}?rss_url=${encodeURIComponent(feedUrl)}&count=${count}&api_key=`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const json = (await res.json()) as Rss2JsonResponse;
    if (json.status !== "ok" || !Array.isArray(json.items)) return [];

    return json.items
      .filter((item) => item.title && item.link)
      .map((item, i) => ({
        id: `${category}_${source}_${i}_${Date.now()}`,
        title: stripHtml(item.title ?? ""),
        description: stripHtml((item.description ?? "").substring(0, 300)),
        link: item.link ?? "#",
        pubDate: item.pubDate ?? new Date().toISOString(),
        source,
        category,
        image:
          item.enclosure?.link || item.thumbnail || item["media:content"]?.url,
        timeAgo: formatTimeAgo(item.pubDate ?? ""),
      }));
  } catch {
    return [];
  }
}

/** Fetch news for a single category. Caches results for 30 minutes. */
export async function fetchNewsByTopic(
  topic: NewsCategory,
  limit = 6,
): Promise<NewsItem[]> {
  const cacheKey = getCacheKey(topic);
  const cached = readCache(cacheKey);
  if (cached) return cached.slice(0, limit);

  const sources = FEED_SOURCES[topic] ?? FEED_SOURCES.general;
  const perFeed = Math.ceil(limit / sources.length) + 2;

  const results = await Promise.allSettled(
    sources.map((s) => fetchFeed(s.url, s.source, topic, perFeed)),
  );

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  // Sort by pubDate descending
  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  const deduped = items.filter(
    (item, idx) => items.findIndex((x) => x.title === item.title) === idx,
  );

  writeCache(cacheKey, deduped);
  return deduped.slice(0, limit);
}

/** Fetch and merge news from all categories. */
export async function fetchAllNews(limit = 12): Promise<NewsItem[]> {
  const cacheKey = getCacheKey("all");
  const cached = readCache(cacheKey);
  if (cached) return cached.slice(0, limit);

  const categories: NewsCategory[] = [
    "real_estate",
    "finance",
    "ahmedabad_infrastructure",
    "sports",
    "music_culture",
    "csr_ngo",
    "tourism_travel",
  ];

  const results = await Promise.allSettled(
    categories.map((cat) => fetchNewsByTopic(cat, 4)),
  );

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  const deduped = items.filter(
    (item, idx) => items.findIndex((x) => x.title === item.title) === idx,
  );

  writeCache(cacheKey, deduped);
  return deduped.slice(0, limit);
}

/** Invalidate all cached news (used by refresh button). */
export function invalidateNewsCache() {
  try {
    const keys = Object.keys(sessionStorage);
    for (const key of keys) {
      if (key.startsWith("mstc_news_")) sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  real_estate: "Real Estate",
  finance: "Finance",
  ahmedabad_infrastructure: "Ahmedabad",
  gujarat_government: "Gujarat",
  music_culture: "Culture",
  sports: "Sports",
  csr_ngo: "CSR",
  tourism_travel: "Tourism",
  general: "General",
};

export const CATEGORY_DESCRIPTIONS: Record<NewsCategory, string> = {
  real_estate:
    "Latest property market updates, RERA news, and investment trends from across India.",
  finance:
    "Stock market, banking, home loan rates, and financial policy updates.",
  ahmedabad_infrastructure:
    "Metro expansion, AMC projects, and city infrastructure developments in Ahmedabad.",
  gujarat_government:
    "Gujarat government schemes, policy announcements, and state development news.",
  music_culture:
    "Cultural events, music industry, Gujarati arts, and entertainment news.",
  sports:
    "Cricket, football, kabaddi, local sports events, and athlete achievements.",
  csr_ngo:
    "Corporate social responsibility, NGO initiatives, and community impact stories.",
  tourism_travel:
    "Travel destinations, Gujarat tourism, and hospitality industry news.",
  general: "Top headlines and business news from India.",
};
