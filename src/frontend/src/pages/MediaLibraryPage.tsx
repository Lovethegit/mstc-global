import SecureAppGate from "@/components/shared/SecureAppGate";
import {
  FileText,
  Film,
  Filter,
  Grid,
  Image as ImageIcon,
  List,
  Music,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";

type MediaType = "All" | "Images" | "Videos" | "Documents" | "Audio";

interface MediaItem {
  id: number;
  name: string;
  type: "image" | "video" | "document" | "audio";
  size: string;
  date: string;
  url?: string;
  thumb?: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 1,
    name: "mstc-logo-gold.png",
    type: "image",
    size: "245 KB",
    date: "28 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 2,
    name: "prahlad-nagar-3bhk.jpg",
    type: "image",
    size: "1.2 MB",
    date: "27 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 3,
    name: "mstc-company-profile.pdf",
    type: "document",
    size: "4.8 MB",
    date: "25 May 2026",
  },
  {
    id: 4,
    name: "corporate-event-recap.mp4",
    type: "video",
    size: "128 MB",
    date: "22 May 2026",
  },
  {
    id: 5,
    name: "satellite-city-plot.jpg",
    type: "image",
    size: "980 KB",
    date: "20 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 6,
    name: "rera-compliance-guide.pdf",
    type: "document",
    size: "2.1 MB",
    date: "18 May 2026",
  },
  {
    id: 7,
    name: "navrangpura-office.jpg",
    type: "image",
    size: "750 KB",
    date: "15 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 8,
    name: "property-tour-vastrapur.mp4",
    type: "video",
    size: "85 MB",
    date: "12 May 2026",
  },
  {
    id: 9,
    name: "mstc-brochure-2026.pdf",
    type: "document",
    size: "6.2 MB",
    date: "10 May 2026",
  },
  {
    id: 10,
    name: "artist-showcase-event.jpg",
    type: "image",
    size: "1.8 MB",
    date: "08 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 11,
    name: "bg-music-brand.mp3",
    type: "audio",
    size: "8.5 MB",
    date: "05 May 2026",
  },
  {
    id: 12,
    name: "sg-highway-commercial.jpg",
    type: "image",
    size: "2.1 MB",
    date: "02 May 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 13,
    name: "client-testimonials.mp4",
    type: "video",
    size: "42 MB",
    date: "28 Apr 2026",
  },
  {
    id: 14,
    name: "csr-impact-report-2025.pdf",
    type: "document",
    size: "3.3 MB",
    date: "25 Apr 2026",
  },
  {
    id: 15,
    name: "bodakdev-4bhk.jpg",
    type: "image",
    size: "1.5 MB",
    date: "22 Apr 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 16,
    name: "ambli-villa.jpg",
    type: "image",
    size: "1.9 MB",
    date: "18 Apr 2026",
    thumb: "/assets/images/placeholder.svg",
  },
  {
    id: 17,
    name: "service-presentation.pdf",
    type: "document",
    size: "8.7 MB",
    date: "15 Apr 2026",
  },
  {
    id: 18,
    name: "event-highlight-reel.mp4",
    type: "video",
    size: "210 MB",
    date: "12 Apr 2026",
  },
  {
    id: 19,
    name: "jingle-promo.mp3",
    type: "audio",
    size: "4.2 MB",
    date: "08 Apr 2026",
  },
  {
    id: 20,
    name: "team-photo-2026.jpg",
    type: "image",
    size: "3.4 MB",
    date: "01 Apr 2026",
    thumb: "/assets/images/placeholder.svg",
  },
];

const TYPE_ICON: Record<MediaItem["type"], React.ElementType> = {
  image: ImageIcon,
  video: Film,
  document: FileText,
  audio: Music,
};

const TYPE_COLOR: Record<MediaItem["type"], string> = {
  image: "text-blue-400",
  video: "text-purple-400",
  document: "text-gold-400",
  audio: "text-green-400",
};

function MediaLibraryInner() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MediaType>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = MEDIA_ITEMS.filter((m) => {
    const matchSearch =
      !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filter === "All" ||
      (filter === "Images" && m.type === "image") ||
      (filter === "Videos" && m.type === "video") ||
      (filter === "Documents" && m.type === "document") ||
      (filter === "Audio" && m.type === "audio");
    return matchSearch && matchType;
  });

  const total = {
    images: MEDIA_ITEMS.filter((m) => m.type === "image").length,
    videos: MEDIA_ITEMS.filter((m) => m.type === "video").length,
    docs: MEDIA_ITEMS.filter((m) => m.type === "document").length,
    audio: MEDIA_ITEMS.filter((m) => m.type === "audio").length,
  };

  return (
    <div className="min-h-screen bg-background" data-ocid="media.page">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Media Library
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="media.upload_button"
            >
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Images",
              count: total.images,
              icon: ImageIcon,
              color: "text-blue-400",
            },
            {
              label: "Videos",
              count: total.videos,
              icon: Film,
              color: "text-purple-400",
            },
            {
              label: "Documents",
              count: total.docs,
              icon: FileText,
              color: "text-gold-400",
            },
            {
              label: "Audio",
              count: total.audio,
              icon: Music,
              color: "text-green-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gold-800/30 bg-card p-3 flex items-center gap-3"
            >
              <s.icon className={`w-6 h-6 ${s.color} shrink-0`} />
              <div>
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.count}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-background border border-gold-800/30 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold-700/50"
              data-ocid="media.search_input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {(
                ["All", "Images", "Videos", "Documents", "Audio"] as MediaType[]
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-gold-700/30 text-gold-400 border border-gold-700/40" : "text-muted-foreground hover:text-foreground"}`}
                  data-ocid={`media.filter.${f.toLowerCase()}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex border border-gold-800/30 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`p-1.5 ${view === "grid" ? "bg-gold-700/30 text-gold-400" : "text-muted-foreground"}`}
                data-ocid="media.view_grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`p-1.5 ${view === "list" ? "bg-gold-700/30 text-gold-400" : "text-muted-foreground"}`}
                data-ocid="media.view_list"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mb-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-gold-700/10 border border-gold-700/30">
            <span className="text-xs text-gold-400 font-medium">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Deselect all
            </button>
            <button
              type="button"
              className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              data-ocid="media.delete_button"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}

        {view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((item) => {
              const Icon = TYPE_ICON[item.type];
              const colorClass = TYPE_COLOR[item.type];
              const isSelected = selected.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border ${isSelected ? "border-gold-500/60 bg-gold-900/20" : "border-gold-800/20 bg-card"} overflow-hidden hover:border-gold-700/40 transition-all cursor-pointer`}
                  data-ocid={`media.item.${item.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setSelected((prev) =>
                      isSelected
                        ? prev.filter((x) => x !== item.id)
                        : [...prev, item.id],
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelected((prev) =>
                        isSelected
                          ? prev.filter((x) => x !== item.id)
                          : [...prev, item.id],
                      );
                    }
                  }}
                >
                  <div className="h-28 bg-muted/20 flex items-center justify-center relative">
                    {item.thumb ? (
                      <img
                        src={item.thumb}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className={`w-10 h-10 ${colorClass} opacity-50`} />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gold-500/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-background text-xs">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p
                      className="text-xs text-foreground font-medium truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.size}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gold-800/30">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {["File", "Type", "Size", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const Icon = TYPE_ICON[item.type];
                  const colorClass = TYPE_COLOR[item.type];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                      data-ocid={`media.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${colorClass} shrink-0`} />
                          <span
                            className="text-foreground truncate max-w-[200px]"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs capitalize ${colorClass}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                        {item.size}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          className="text-xs text-red-400 hover:text-red-300"
                          data-ocid={`media.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16" data-ocid="media.empty_state">
            <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-serif text-lg text-muted-foreground">
              No files found
            </p>
          </div>
        )}

        {/* Upload zone */}
        <div
          className="mt-6 rounded-xl border-2 border-dashed border-gold-800/30 p-8 text-center"
          data-ocid="media.dropzone"
        >
          <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-sans text-sm text-muted-foreground">
            Drag & drop files here or click to upload
          </p>
          <p className="font-sans text-xs text-muted-foreground/60 mt-1">
            Supports JPG, PNG, PDF, MP4, MP3 — max 500 MB per file
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MediaLibraryPage() {
  return (
    <SecureAppGate appName="Media Library">
      <MediaLibraryInner />
    </SecureAppGate>
  );
}
