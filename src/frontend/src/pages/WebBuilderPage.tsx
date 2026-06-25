import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Code2,
  Eye,
  FileText,
  Globe,
  LayoutTemplate,
  Pencil,
  Plus,
  Upload,
  Zap,
} from "lucide-react";
import { useState } from "react";

const TEMPLATES = [
  {
    id: 1,
    name: "Property Listing",
    category: "Real Estate",
    thumbnail: "🏠",
    uses: 34,
  },
  { id: 2, name: "About Us", category: "Corporate", thumbnail: "🏢", uses: 28 },
  {
    id: 3,
    name: "Contact Page",
    category: "General",
    thumbnail: "📞",
    uses: 45,
  },
  {
    id: 4,
    name: "Services Overview",
    category: "Corporate",
    thumbnail: "⚡",
    uses: 22,
  },
  {
    id: 5,
    name: "Blog & News",
    category: "Content",
    thumbnail: "📰",
    uses: 19,
  },
  {
    id: 6,
    name: "Landing Page",
    category: "Marketing",
    thumbnail: "🎯",
    uses: 67,
  },
  {
    id: 7,
    name: "Event Registration",
    category: "Events",
    thumbnail: "🎪",
    uses: 15,
  },
  {
    id: 8,
    name: "Property Gallery",
    category: "Real Estate",
    thumbnail: "🖼️",
    uses: 31,
  },
  {
    id: 9,
    name: "Investor Relations",
    category: "Finance",
    thumbnail: "📈",
    uses: 12,
  },
  {
    id: 10,
    name: "Team Directory",
    category: "Corporate",
    thumbnail: "👥",
    uses: 18,
  },
  {
    id: 11,
    name: "Testimonials",
    category: "Marketing",
    thumbnail: "⭐",
    uses: 25,
  },
  {
    id: 12,
    name: "FAQ & Support",
    category: "General",
    thumbnail: "❓",
    uses: 21,
  },
];

const PAGES = [
  {
    id: 1,
    name: "Home",
    url: "/",
    template: "Landing Page",
    edited: "2026-05-28",
    status: "Live",
    views: 4823,
  },
  {
    id: 2,
    name: "Property Portal",
    url: "/property-portal",
    template: "Property Listing",
    edited: "2026-05-27",
    status: "Live",
    views: 2341,
  },
  {
    id: 3,
    name: "About MSTC",
    url: "/about",
    template: "About Us",
    edited: "2026-05-25",
    status: "Live",
    views: 1892,
  },
  {
    id: 4,
    name: "Contact Us",
    url: "/contact",
    template: "Contact Page",
    edited: "2026-05-24",
    status: "Live",
    views: 1234,
  },
  {
    id: 5,
    name: "Services Overview",
    url: "/services",
    template: "Services Overview",
    edited: "2026-05-23",
    status: "Live",
    views: 2156,
  },
  {
    id: 6,
    name: "Blog",
    url: "/blog",
    template: "Blog & News",
    edited: "2026-05-22",
    status: "Live",
    views: 987,
  },
  {
    id: 7,
    name: "NRI Corner",
    url: "/nri-corner",
    template: "Landing Page",
    edited: "2026-05-20",
    status: "Live",
    views: 678,
  },
  {
    id: 8,
    name: "Event Booking",
    url: "/event-booking",
    template: "Event Registration",
    edited: "2026-05-18",
    status: "Live",
    views: 543,
  },
  {
    id: 9,
    name: "Neighborhood Explorer",
    url: "/neighborhood-explorer",
    template: "Property Gallery",
    edited: "2026-05-17",
    status: "Live",
    views: 456,
  },
  {
    id: 10,
    name: "Finance Tools",
    url: "/finance-tools",
    template: "Services Overview",
    edited: "2026-05-15",
    status: "Live",
    views: 1123,
  },
  {
    id: 11,
    name: "Partners",
    url: "/partners",
    template: "Team Directory",
    edited: "2026-05-14",
    status: "Live",
    views: 334,
  },
  {
    id: 12,
    name: "FAQ",
    url: "/faq",
    template: "FAQ & Support",
    edited: "2026-05-12",
    status: "Live",
    views: 789,
  },
  {
    id: 13,
    name: "Investor Landing",
    url: "/investors",
    template: "Investor Relations",
    edited: "2026-05-10",
    status: "Draft",
    views: 0,
  },
  {
    id: 14,
    name: "Luxury Collection",
    url: "/luxury",
    template: "Property Gallery",
    edited: "2026-05-08",
    status: "Draft",
    views: 0,
  },
  {
    id: 15,
    name: "Art Gallery",
    url: "/art",
    template: "Property Gallery",
    edited: "2026-05-05",
    status: "Draft",
    views: 0,
  },
  {
    id: 16,
    name: "Media & Press",
    url: "/press",
    template: "Blog & News",
    edited: "2026-05-03",
    status: "Draft",
    views: 0,
  },
  {
    id: 17,
    name: "Sustainability",
    url: "/sustainability",
    template: "About Us",
    edited: "2026-05-01",
    status: "Draft",
    views: 0,
  },
  {
    id: 18,
    name: "Awards & Recognition",
    url: "/awards",
    template: "Testimonials",
    edited: "2026-04-28",
    status: "Draft",
    views: 0,
  },
  {
    id: 19,
    name: "Infrastructure Projects",
    url: "/projects",
    template: "Property Listing",
    edited: "2026-04-25",
    status: "Live",
    views: 445,
  },
  {
    id: 20,
    name: "CSR Initiatives",
    url: "/csr",
    template: "About Us",
    edited: "2026-04-22",
    status: "Live",
    views: 267,
  },
  {
    id: 21,
    name: "Music & Arts",
    url: "/music",
    template: "Event Registration",
    edited: "2026-04-20",
    status: "Live",
    views: 334,
  },
  {
    id: 22,
    name: "Tourism Packages",
    url: "/tourism",
    template: "Landing Page",
    edited: "2026-04-18",
    status: "Live",
    views: 456,
  },
  {
    id: 23,
    name: "Sports Zone",
    url: "/sports",
    template: "Event Registration",
    edited: "2026-04-15",
    status: "Draft",
    views: 0,
  },
];

export default function WebBuilderPage() {
  const [tab, setTab] = useState<"pages" | "templates">("pages");
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState<
    (typeof PAGES)[0] | null
  >(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const livePages = PAGES.filter((p) => p.status === "Live").length;
  const totalViews = PAGES.reduce((s, p) => s + p.views, 0);

  const filteredPages = PAGES.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.url.includes(search.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="builder.page"
    >
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-card border-r border-gold-700/30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gold-700/20">
              <span className="font-serif text-gold-300 font-semibold text-sm">
                Navigation
              </span>
              <CloseButton onClick={() => setSidebarOpen(false)} size="sm" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {["Pages", "Templates", "Components", "Media", "Settings"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gold-300 hover:bg-gold-700/10 transition-colors"
                  >
                    {item}
                  </button>
                ),
              )}
            </nav>
          </aside>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">
                Website Builder
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Visual page builder for mstcglobal-kh8.caffeine.xyz
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gold-700/30 text-gold-400 gap-2"
              onClick={() => setPreviewMode(!previewMode)}
              data-ocid="builder.preview_button"
            >
              <Eye size={16} /> {previewMode ? "Edit Mode" : "Preview"}
            </Button>
            <Button
              className="gold-button gap-2"
              onClick={() => setShowNewPageModal(true)}
              data-ocid="builder.new_page_button"
            >
              <Plus size={16} /> New Page
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Pages Built",
              value: PAGES.length,
              icon: FileText,
              color: "text-blue-400",
            },
            {
              label: "Live Pages",
              value: livePages,
              icon: Globe,
              color: "text-green-400",
            },
            {
              label: "Templates",
              value: TEMPLATES.length,
              icon: LayoutTemplate,
              color: "text-gold-400",
            },
            {
              label: "Total Views",
              value: totalViews.toLocaleString(),
              icon: Eye,
              color: "text-purple-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`builder.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground font-sans">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Last Published */}
        <div className="bg-card border border-gold-700/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <Zap size={16} className="text-green-400" />
          <span className="text-sm text-muted-foreground">
            Last published:{" "}
            <strong className="text-foreground">2 hours ago</strong> · Version
            v55 · All changes live
          </span>
          <Button
            className="ml-auto gold-button gap-2 h-8 text-xs"
            data-ocid="builder.publish_button"
          >
            <Upload size={14} /> Publish All
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["pages", "templates"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${tab === t ? "bg-gold-700/30 text-gold-300 border border-gold-700/40" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid={`builder.${t}_tab`}
            >
              {t === "pages" ? "Pages" : "Templates"}
            </button>
          ))}
        </div>

        {tab === "pages" && (
          <>
            <div className="relative mb-4">
              <Code2
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-card border-gold-700/30 h-9 text-sm"
                data-ocid="builder.search_input"
              />
            </div>
            <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="builder.pages_table"
                >
                  <thead>
                    <tr className="border-b border-gold-700/20 bg-obsidian-800/40">
                      {[
                        "Page Name",
                        "URL",
                        "Template",
                        "Last Edited",
                        "Status",
                        "Views",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gold-400 font-sans whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map((p, i) => (
                      <tr
                        key={p.id}
                        className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                        data-ocid={`builder.page_item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {p.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gold-400">
                          {p.url}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 text-xs"
                          >
                            {p.template}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {p.edited}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              p.status === "Live"
                                ? "bg-green-900/30 text-green-400 border-green-700/30 text-xs"
                                : "bg-yellow-900/30 text-yellow-400 border-yellow-700/30 text-xs"
                            }
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          {p.views.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold-700/30 text-gold-400 h-7 text-xs gap-1"
                            onClick={() => setShowEditorModal(p)}
                            data-ocid={`builder.edit_button.${i + 1}`}
                          >
                            <Pencil size={12} /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "templates" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((tpl, i) => (
              <div
                key={tpl.id}
                className="bg-card border border-gold-700/20 rounded-xl p-4 hover:border-gold-500/40 transition-colors group"
                data-ocid={`builder.template.${i + 1}`}
              >
                <div className="text-4xl mb-3">{tpl.thumbnail}</div>
                <p className="font-semibold text-sm text-foreground">
                  {tpl.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tpl.category}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {tpl.uses} uses
                  </span>
                  <Button
                    size="sm"
                    className="gold-button h-7 text-xs"
                    data-ocid={`builder.use_template_button.${i + 1}`}
                  >
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Page Modal */}
      <Modal
        isOpen={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        title="Create New Page"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-gold-300 text-xs mb-1 block">
              Page Name
            </label>
            <Input
              placeholder="e.g. Investor Relations"
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div>
            <label className="text-gold-300 text-xs mb-1 block">URL Path</label>
            <Input
              placeholder="/investors"
              className="bg-obsidian-800/60 border-gold-700/30"
            />
          </div>
          <div>
            <label className="text-gold-300 text-xs mb-2 block">
              Choose Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.slice(0, 6).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  className="p-3 rounded-lg border border-gold-700/20 hover:border-gold-500/40 transition-colors text-center"
                >
                  <div className="text-2xl mb-1">{tpl.thumbnail}</div>
                  <p className="text-xs text-muted-foreground">{tpl.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowNewPageModal(false)}
              data-ocid="builder.new_page_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="builder.new_page_modal.submit_button"
            >
              Create Page
            </Button>
          </div>
        </div>
      </Modal>

      {/* Editor Info Modal */}
      <Modal
        isOpen={!!showEditorModal}
        onClose={() => setShowEditorModal(null)}
        title={`Edit: ${showEditorModal?.name}`}
        size="md"
      >
        {showEditorModal && (
          <div className="space-y-4">
            <div className="bg-obsidian-800/40 rounded-lg p-4 border border-gold-700/20">
              <p className="text-sm text-muted-foreground mb-1">
                URL:{" "}
                <span className="text-gold-300 font-mono">
                  {showEditorModal.url}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Template:{" "}
                <span className="text-foreground">
                  {showEditorModal.template}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Status:{" "}
                <Badge
                  className={
                    showEditorModal.status === "Live"
                      ? "bg-green-900/30 text-green-400 border-green-700/30 text-xs ml-1"
                      : "bg-yellow-900/30 text-yellow-400 border-yellow-700/30 text-xs ml-1"
                  }
                >
                  {showEditorModal.status}
                </Badge>
              </p>
            </div>
            <div className="bg-gold-900/10 border border-gold-700/20 rounded-lg p-4">
              <p className="text-sm text-gold-300 font-semibold mb-2">
                Visual Editor
              </p>
              <p className="text-sm text-muted-foreground">
                The visual drag-and-drop editor launches in a full-screen
                overlay. You can edit text, images, layouts, and components. All
                changes are saved automatically and published on demand.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                className="border-gold-700/30"
                onClick={() => setShowEditorModal(null)}
                data-ocid="builder.editor_modal.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="gold-button gap-2"
                data-ocid="builder.editor_modal.open_button"
              >
                <Pencil size={14} /> Open Editor
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
