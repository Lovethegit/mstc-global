import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { type BlogPost, usePublishedBlogPosts } from "@/hooks/useBlogQueries";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Search, User, X } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Real Estate",
  "RERA",
  "Home Loans",
  "Investment",
  "Gujarat",
  "General",
  "Finance",
  "Events",
  "Music",
  "CSR",
];

function formatDate(ts: bigint | undefined): string {
  if (!ts) return "";
  const d = new Date(Number(ts) / 1_000_000);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ArticleSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gold-800/30 bg-card animate-pulse">
      <div className="h-48 bg-obsidian-700/60" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-obsidian-700/60 rounded w-1/4" />
        <div className="h-5 bg-obsidian-700/60 rounded w-3/4" />
        <div className="h-3 bg-obsidian-700/60 rounded w-full" />
        <div className="h-3 bg-obsidian-700/60 rounded w-5/6" />
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  onReadMore,
}: {
  article: BlogPost;
  onReadMore: (post: BlogPost) => void;
}) {
  return (
    <div
      className="group rounded-xl overflow-hidden border border-gold-800/30 bg-card hover:border-gold-500/50 transition-all duration-300 flex flex-col"
      data-ocid="blog.article_card"
    >
      <div className="relative overflow-hidden h-48 bg-obsidian-800 shrink-0">
        <div className="w-full h-full flex items-center justify-center">
          <BookOpen size={40} className="text-gold-700/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/60 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-gold-600/90 text-obsidian-900 font-sans">
          {article.category || "General"}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 text-xs text-gold-500 font-sans">
          <Calendar size={12} />
          <span>{formatDate(article.createdAt)}</span>
          <span className="text-gold-700">·</span>
          <span className="text-gold-400 flex items-center gap-1">
            <User size={11} />
            {article.author || "MSTC GLOBAL"}
          </span>
        </div>

        <h3 className="font-serif font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-gold-300 transition-colors">
          {article.title}
        </h3>

        <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {article.excerpt || `${article.content.slice(0, 180)}…`}
        </p>

        <button
          type="button"
          onClick={() => onReadMore(article)}
          className="mt-auto pt-3 border-t border-gold-800/20 text-sm text-gold-400 hover:text-gold-300 font-sans transition-colors text-left"
          data-ocid="blog.read_more_button"
        >
          Read More →
        </button>
      </div>
    </div>
  );
}

function ArticleModal({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      data-ocid="blog.modal"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-obsidian-900 border border-gold-700/40 rounded-2xl p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-600 hover:text-gold-300 transition-colors p-1"
          data-ocid="blog.modal.close_button"
          aria-label="Close article"
        >
          <X size={22} />
        </button>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold-600/20 text-gold-400 font-sans mb-4">
          {post.category || "General"}
        </span>

        <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground leading-snug mb-3">
          {post.title}
        </h2>

        <div className="flex items-center gap-3 text-xs text-gold-500 font-sans mb-6">
          <span className="flex items-center gap-1">
            <User size={12} />
            {post.author || "MSTC GLOBAL"}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(post.createdAt)}
          </span>
        </div>

        <div className="prose prose-invert prose-sm max-w-none font-sans text-gold-100/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.metaDescription && (
          <div className="mt-6 pt-4 border-t border-gold-800/20">
            <p className="text-xs text-gold-600 font-sans italic">
              {post.metaDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { data: posts = [], isLoading } = usePublishedBlogPosts();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filtered = useMemo(() => {
    let arr =
      category === "All" ? posts : posts.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt || "").toLowerCase().includes(q) ||
          (a.category || "").toLowerCase().includes(q),
      );
    }
    return arr;
  }, [posts, category, search]);

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 px-4 text-center bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="blog.back_link"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="font-serif font-bold text-3xl md:text-5xl gold-text mb-4">
              News &amp; Insights
            </h1>
            <p className="font-sans text-base text-obsidian-100 max-w-xl mx-auto">
              Stay informed with the latest developments in Ahmedabad real
              estate, RERA regulations, home loan trends, and investment
              opportunities.
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="sticky top-16 z-20 bg-obsidian-800/95 backdrop-blur-md border-b border-gold-800/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-200 border ${
                    category === cat
                      ? "bg-gold-600 text-obsidian-900 border-gold-500"
                      : "border-gold-700/30 text-gold-400 hover:border-gold-500/50 hover:text-gold-300"
                  }`}
                  data-ocid={`blog.category.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500"
              />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-obsidian-900/80 border border-gold-700/30 text-gold-100 placeholder:text-gold-600 focus:outline-none focus:border-gold-500 font-sans"
                data-ocid="blog.search_input"
              />
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
                  <ArticleSkeleton key={k} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20" data-ocid="blog.empty_state">
                <BookOpen size={48} className="text-gold-700/40 mx-auto mb-4" />
                <p className="text-gold-400 font-sans">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-ocid="blog.articles.list"
              >
                {filtered.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={setSelectedPost}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      <Footer />
    </div>
  );
}
