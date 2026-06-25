import SecureAppGate from "@/components/shared/SecureAppGate";
import BackButton from "@/components/ui/BackButton";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Calendar,
  Edit,
  Eye,
  FileText,
  PenTool,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

type PostStatus = "Published" | "Draft" | "Scheduled";
type PostCategory =
  | "Property"
  | "Finance"
  | "Market"
  | "NGO"
  | "RERA"
  | "Hospitality";

interface BlogPost {
  id: number;
  title: string;
  category: PostCategory;
  status: PostStatus;
  views: number;
  seoScore: number;
  date: string;
  author: string;
}

const POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Top 5 Localities in Ahmedabad for 2025 Investment",
    category: "Property",
    status: "Published",
    views: 8200,
    seoScore: 91,
    date: "15 May 2025",
    author: "Aria AI",
  },
  {
    id: 2,
    title: "Complete Guide to RERA Registration in Gujarat",
    category: "RERA",
    status: "Published",
    views: 5600,
    seoScore: 88,
    date: "10 May 2025",
    author: "Legal AI",
  },
  {
    id: 3,
    title: "SG Highway: The New Commercial Hub of Ahmedabad",
    category: "Market",
    status: "Published",
    views: 4100,
    seoScore: 85,
    date: "05 May 2025",
    author: "Content AI",
  },
  {
    id: 4,
    title: "Understanding Stamp Duty in Gujarat 2025",
    category: "Finance",
    status: "Published",
    views: 12300,
    seoScore: 93,
    date: "28 Apr 2025",
    author: "Finance AI",
  },
  {
    id: 5,
    title: "Best Budget Flats in Bopal Under ₹50 Lakhs",
    category: "Property",
    status: "Draft",
    views: 0,
    seoScore: 72,
    date: "—",
    author: "Writer AI",
  },
  {
    id: 6,
    title: "MSTC NGO Initiative: Clean Sabarmati Drive 2025",
    category: "NGO",
    status: "Published",
    views: 3400,
    seoScore: 78,
    date: "20 Apr 2025",
    author: "CSR AI",
  },
  {
    id: 7,
    title: "Home Loan vs Builder Finance: Pros & Cons",
    category: "Finance",
    status: "Published",
    views: 6700,
    seoScore: 89,
    date: "15 Apr 2025",
    author: "Finance AI",
  },
  {
    id: 8,
    title: "Prahlad Nagar Commercial Properties Guide 2025",
    category: "Market",
    status: "Scheduled",
    views: 0,
    seoScore: 81,
    date: "01 Jun 2025",
    author: "Aria AI",
  },
  {
    id: 9,
    title: "Event Venue Guide: Top Banquet Halls in Ahmedabad",
    category: "Hospitality",
    status: "Published",
    views: 2900,
    seoScore: 76,
    date: "12 Apr 2025",
    author: "Events AI",
  },
  {
    id: 10,
    title: "NRI Investment Guide: Buying Property in Ahmedabad",
    category: "Property",
    status: "Draft",
    views: 0,
    seoScore: 68,
    date: "—",
    author: "Writer AI",
  },
];

const CALENDAR_EVENTS = [
  {
    day: "Mon, 26 May",
    title: "SG Highway Market Update",
    time: "10:00 AM",
    type: "Blog",
  },
  {
    day: "Tue, 27 May",
    title: "RERA Circular Review",
    time: "12:00 PM",
    type: "RERA",
  },
  {
    day: "Wed, 28 May",
    title: "Monthly Finance Summary",
    time: "09:00 AM",
    type: "Finance",
  },
  {
    day: "Thu, 29 May",
    title: "Bopal Project Launch Post",
    time: "11:00 AM",
    type: "Property",
  },
  {
    day: "Fri, 30 May",
    title: "Social Digest — Week 21",
    time: "02:00 PM",
    type: "Social",
  },
  {
    day: "Sat, 31 May",
    title: "NGO Impact Story",
    time: "03:00 PM",
    type: "NGO",
  },
  {
    day: "Sun, 01 Jun",
    title: "Weekly News Roundup",
    time: "08:00 AM",
    type: "Market",
  },
];

const TOP_KEYWORDS = [
  { kw: "ahmedabad real estate", rank: 3, volume: "8,400/mo" },
  { kw: "rera gujarat 2025", rank: 5, volume: "5,200/mo" },
  { kw: "sg highway property", rank: 2, volume: "3,800/mo" },
  { kw: "stamp duty gujarat", rank: 1, volume: "12,100/mo" },
  { kw: "bopal flats budget", rank: 7, volume: "2,600/mo" },
];

const TABS = [
  "Blog Posts",
  "Area Guides",
  "Market Updates",
  "Social Media",
  "Press Releases",
] as const;
type Tab = (typeof TABS)[number];

const STATUS_COLORS: Record<PostStatus, string> = {
  Published: "bg-emerald-900/20 text-emerald-300 border-emerald-700/30",
  Draft: "bg-amber-900/20 text-amber-300 border-amber-700/30",
  Scheduled: "bg-blue-900/20 text-blue-300 border-blue-800/30",
};

const CAT_COLORS: Record<PostCategory, string> = {
  Property: "bg-gold-700/20 text-gold-400",
  Finance: "bg-blue-900/20 text-blue-300",
  Market: "bg-amber-900/20 text-amber-300",
  NGO: "bg-emerald-900/20 text-emerald-300",
  RERA: "bg-orange-900/20 text-orange-300",
  Hospitality: "bg-purple-900/20 text-purple-300",
};

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Blog Posts");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "All">("All");
  const [genTopic, setGenTopic] = useState("");
  const [genPreview, setGenPreview] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<PostCategory>("Property");
  const [posts, setPosts] = useState<BlogPost[]>(POSTS);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = posts.filter(
    (p) =>
      (statusFilter === "All" || p.status === statusFilter) &&
      (search === "" || p.title.toLowerCase().includes(search.toLowerCase())),
  );

  const _published = posts.filter((p) => p.status === "Published").length;
  const _drafts = posts.filter((p) => p.status === "Draft").length;
  const _monthViews = posts.reduce((sum, p) => sum + p.views, 0);
  const _avgSeo = Math.round(
    posts.reduce((s, p) => s + p.seoScore, 0) / posts.length,
  );

  function handleGenerate() {
    if (!genTopic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenPreview(
        `# ${genTopic}\n\nThe Ahmedabad real estate market continues to evolve with significant developments. This guide provides actionable insights for investors and homebuyers.\n\n## Key Highlights\n- Current market trends and price movements\n- Top localities and investment potential\n- RERA compliance and builder credibility\n- Finance options and stamp duty implications\n\n*Generated by MSTC Content AI — Review before publishing*`,
      );
      setGenerating(false);
    }, 1800);
  }

  function handleAddPost() {
    if (!newTitle.trim()) return;
    const np: BlogPost = {
      id: Date.now(),
      title: newTitle,
      category: newCat,
      status: "Draft",
      views: 0,
      seoScore: Math.floor(Math.random() * 20) + 70,
      date: "—",
      author: "You",
    };
    setPosts([np, ...posts]);
    setNewTitle("");
    setShowNewModal(false);
  }

  function handleDelete(id: number) {
    setPosts(posts.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <SecureAppGate appName="Content Studio">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="bg-card border-b border-gold-800/30 px-4 py-4 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <BackButton />
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-gold-400" />
                <h1 className="font-serif font-bold text-lg md:text-xl text-gold-300">
                  Content Studio
                </h1>
                <span className="hidden sm:inline text-muted-foreground text-sm">
                  |
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground font-sans">
                  AI-Powered
                </span>
              </div>
              <span className="ml-auto text-xs text-gold-400 bg-gold-700/20 border border-gold-700/30 px-2 py-1 rounded-full font-sans">
                247 Published
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-card border border-gold-800/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gold-700/15 shrink-0">
                <FileText className="w-4 h-4 text-gold-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold font-serif text-gold-400">
                  247
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  Published Articles
                </div>
              </div>
            </div>
            <div className="bg-card border border-gold-800/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gold-700/15 shrink-0">
                <Edit className="w-4 h-4 text-gold-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold font-serif text-gold-400">
                  18
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  Drafts
                </div>
              </div>
            </div>
            <div className="bg-card border border-gold-800/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gold-700/15 shrink-0">
                <Eye className="w-4 h-4 text-gold-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold font-serif text-gold-400">
                  48K
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  This Month Views
                </div>
                <div className="text-xs text-gold-500/70 font-sans mt-0.5">
                  +18% vs last month
                </div>
              </div>
            </div>
            <div className="bg-card border border-gold-800/30 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gold-700/15 shrink-0">
                <TrendingUp className="w-4 h-4 text-gold-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold font-serif text-gold-400">
                  87/100
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-0.5">
                  SEO Score
                </div>
                <div className="text-xs text-gold-500/70 font-sans mt-0.5">
                  Target: 90+
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-sans transition-all min-h-[44px] ${
                  activeTab === tab
                    ? "bg-gold-600/20 text-gold-300 border border-gold-600/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                data-ocid={`content.tab.${tab.toLowerCase().replace(/ /g, "_")}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9 bg-card border-gold-800/30 text-sm h-10"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-ocid="content.search_input"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as PostStatus | "All")
                  }
                  className="h-10 rounded-lg bg-card border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                  data-ocid="content.status_select"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
                <Button
                  onClick={() => setShowNewModal(true)}
                  className="h-10 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans gap-1 shrink-0"
                  data-ocid="content.new_article_button"
                >
                  <Plus className="w-4 h-4" /> New
                </Button>
              </div>

              {/* Post List */}
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground font-sans"
                    data-ocid="content.empty_state"
                  >
                    No articles found.
                  </div>
                ) : (
                  filtered.map((post, i) => (
                    <div
                      key={post.id}
                      className="bg-card border border-gold-800/25 rounded-xl p-4 hover:border-gold-600/40 transition-all"
                      data-ocid={`content.item.${i + 1}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-sans ${CAT_COLORS[post.category]}`}
                            >
                              {post.category}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border font-sans ${STATUS_COLORS[post.status]}`}
                            >
                              {post.status}
                            </span>
                          </div>
                          <p className="font-sans text-sm font-medium text-foreground leading-snug line-clamp-2">
                            {post.title}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground font-sans">
                            {post.views > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views.toLocaleString()}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              SEO {post.seoScore}
                            </span>
                            <span>{post.date}</span>
                            <span className="text-gold-500">{post.author}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-gold-700/20 text-muted-foreground hover:text-gold-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            data-ocid={`content.edit_button.${i + 1}`}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-gold-700/20 text-muted-foreground hover:text-gold-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            data-ocid={`content.view_button.${i + 1}`}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(post.id)}
                            className="p-2 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            data-ocid={`content.delete_button.${i + 1}`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* AI Generator */}
              <div className="bg-card border border-gold-700/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    AI Content Generator
                  </h3>
                </div>
                <Textarea
                  placeholder="Topic or brief... e.g. 'Investment guide for SG Highway 2025'"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="bg-background border-gold-800/30 text-sm resize-none min-h-[80px] font-sans"
                  data-ocid="content.ai_generator_textarea"
                />
                {genPreview && (
                  <div className="mt-3 p-3 rounded-lg bg-background border border-gold-800/20 text-xs text-muted-foreground font-sans whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {genPreview}
                  </div>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={generating || !genTopic.trim()}
                  className="mt-3 w-full bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans text-sm h-10"
                  data-ocid="content.generate_button"
                >
                  {generating ? "Generating…" : "Generate Article"}
                </Button>
              </div>

              {/* Content Calendar */}
              <div className="bg-card border border-gold-800/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    This Week's Schedule
                  </h3>
                </div>
                <div className="space-y-2">
                  {CALENDAR_EVENTS.map((ev) => (
                    <div
                      key={ev.title}
                      className="flex items-start gap-2 py-1.5 border-b border-gold-800/15 last:border-0"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-sans text-foreground leading-tight line-clamp-1">
                          {ev.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-sans">
                          {ev.day} · {ev.time}
                        </p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-700/15 text-gold-500 font-sans shrink-0">
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Stats */}
              <div className="bg-card border border-gold-800/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif font-semibold text-sm text-gold-300">
                    SEO Intelligence
                  </h3>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-muted-foreground">Avg SEO Score</span>
                    <span className="text-gold-400">87/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500"
                      style={{ width: "87%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-sans text-muted-foreground mt-1">
                    <span>Meta Coverage: 94%</span>
                    <span>Alt Tags: 78%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-2">
                    Top Keywords
                  </p>
                  {TOP_KEYWORDS.map((kw) => (
                    <div key={kw.rank} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-700/20 text-gold-400 text-[10px] flex items-center justify-center font-bold shrink-0">
                        #{kw.rank}
                      </span>
                      <span className="flex-1 text-xs text-foreground font-sans truncate">
                        {kw.kw}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-sans shrink-0">
                        {kw.volume}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Article Modal */}
        <Modal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          title="New Article"
        >
          <div className="space-y-4 p-1" data-ocid="content.new_article_dialog">
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Title
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Article title..."
                className="bg-background border-gold-800/30 text-sm"
                data-ocid="content.new_article_title_input"
              />
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground block mb-1">
                Category
              </label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as PostCategory)}
                className="w-full h-10 rounded-lg bg-background border border-gold-800/30 text-sm px-3 text-foreground font-sans"
                data-ocid="content.new_article_category_select"
              >
                {(
                  [
                    "Property",
                    "Finance",
                    "Market",
                    "NGO",
                    "RERA",
                    "Hospitality",
                  ] as PostCategory[]
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowNewModal(false)}
                className="flex-1 border-gold-800/30 font-sans"
                data-ocid="content.new_article_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPost}
                className="flex-1 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold font-sans"
                data-ocid="content.new_article_submit_button"
              >
                Create Draft
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          title="Delete Article?"
        >
          <div className="space-y-4 p-1" data-ocid="content.delete_dialog">
            <p className="text-sm font-sans text-muted-foreground">
              This action cannot be undone. The article will be permanently
              removed.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="flex-1 border-gold-800/30 font-sans"
                data-ocid="content.delete_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteId && handleDelete(deleteId)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-sans"
                data-ocid="content.delete_confirm_button"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </SecureAppGate>
  );
}
