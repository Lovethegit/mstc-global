import SecureAppGate from "@/components/shared/SecureAppGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  Code,
  Globe,
  Laptop,
  Redo2,
  Save,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
  Upload,
  Wand2,
} from "lucide-react";
import { useState } from "react";

type DeviceMode = "mobile" | "tablet" | "desktop";

const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};
const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Laptop };

interface SectionCategory {
  label: string;
  icon: string;
  sections: { name: string; color: string }[];
}

const SECTION_CATEGORIES: SectionCategory[] = [
  {
    label: "Hero",
    icon: "🦸",
    sections: [
      { name: "Full-Width Hero", color: "bg-gold-700/20" },
      { name: "Split Hero", color: "bg-blue-900/20" },
      { name: "Minimal Hero", color: "bg-purple-900/20" },
    ],
  },
  {
    label: "Services Grid",
    icon: "⚡",
    sections: [
      { name: "3-Column Grid", color: "bg-green-900/20" },
      { name: "Icon Cards", color: "bg-teal-900/20" },
      { name: "Feature Tiles", color: "bg-indigo-900/20" },
    ],
  },
  {
    label: "Properties List",
    icon: "🏢",
    sections: [
      { name: "Card Grid", color: "bg-orange-900/20" },
      { name: "Table View", color: "bg-yellow-900/20" },
      { name: "Map + Cards", color: "bg-red-900/20" },
    ],
  },
  {
    label: "About / Team",
    icon: "👥",
    sections: [
      { name: "Founder Bio", color: "bg-pink-900/20" },
      { name: "Team Grid", color: "bg-rose-900/20" },
      { name: "Timeline", color: "bg-amber-900/20" },
    ],
  },
  {
    label: "Contact / Map",
    icon: "📍",
    sections: [
      { name: "Contact Form", color: "bg-cyan-900/20" },
      { name: "Map Embed", color: "bg-sky-900/20" },
      { name: "Contact Cards", color: "bg-violet-900/20" },
    ],
  },
  {
    label: "Gallery",
    icon: "🖼️",
    sections: [
      { name: "Masonry Grid", color: "bg-gold-800/20" },
      { name: "Lightbox", color: "bg-blue-900/30" },
      { name: "Carousel", color: "bg-green-900/30" },
    ],
  },
  {
    label: "Forms",
    icon: "📝",
    sections: [
      { name: "Lead Capture", color: "bg-red-900/30" },
      { name: "Multi-Step", color: "bg-purple-900/30" },
      { name: "Calculator", color: "bg-teal-900/30" },
    ],
  },
  {
    label: "Statistics",
    icon: "📊",
    sections: [
      { name: "Counter Blocks", color: "bg-indigo-900/30" },
      { name: "Progress Bars", color: "bg-orange-900/30" },
      { name: "Bar Charts", color: "bg-yellow-900/30" },
    ],
  },
  {
    label: "CTA Banners",
    icon: "📣",
    sections: [
      { name: "Gold CTA", color: "bg-gold-700/30" },
      { name: "Dark Strip", color: "bg-card/80" },
      { name: "Split CTA", color: "bg-muted/40" },
    ],
  },
];

const FONT_OPTIONS = [
  "Playfair Display",
  "Inter",
  "Cormorant Garamond",
  "Roboto",
  "Lato",
  "Montserrat",
  "Georgia",
];

export default function BuilderPage() {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    { Hero: true },
  );
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Style state
  const [bgColor, setBgColor] = useState("#06090f");
  const [accentColor, setAccentColor] = useState("#c9a84c");
  const [textColor, setTextColor] = useState("#f3f0e8");
  const [secondaryColor, setSecondaryColor] = useState("#1a1e2a");
  const [headingFont, setHeadingFont] = useState("Playfair Display");
  const [bodyFont, setBodyFont] = useState("Inter");
  const [padding, setPadding] = useState(48);
  const [borderRadius, setBorderRadius] = useState(8);

  function toggleCategory(label: string) {
    setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function handleGenerate() {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  }

  const canvasWidth = DEVICE_WIDTHS[device];

  return (
    <SecureAppGate appName="Visual Website Builder">
      <div
        className="min-h-screen bg-background flex flex-col"
        data-ocid="builder.page"
      >
        {/* Top Toolbar */}
        <div className="sticky top-0 z-20 border-b border-gold-800/30 bg-card/95 backdrop-blur-md px-3 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 mr-2">
              <Code className="w-4 h-4 text-gold-400" />
              <span className="font-serif font-bold text-sm text-foreground hidden sm:inline">
                Website Builder
              </span>
            </div>
            <Separator
              orientation="vertical"
              className="h-5 bg-gold-800/20 hidden sm:block"
            />
            <button
              type="button"
              className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground transition-colors"
              aria-label="Undo"
              data-ocid="builder.undo_button"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground transition-colors"
              aria-label="Redo"
              data-ocid="builder.redo_button"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <Separator orientation="vertical" className="h-5 bg-gold-800/20" />
            <Button
              size="sm"
              variant="outline"
              className="border-gold-700/30 text-muted-foreground hover:text-foreground h-7 text-xs gap-1"
              data-ocid="builder.import_button"
            >
              <Upload className="w-3 h-3" /> Import URL
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gold-700/30 text-muted-foreground hover:text-foreground h-7 text-xs gap-1"
              data-ocid="builder.preview_button"
            >
              <Globe className="w-3 h-3" /> Preview
            </Button>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="outline"
              className="border-gold-700/40 text-gold-500 hover:bg-gold-700/10 h-7 text-xs gap-1"
              data-ocid="builder.save_button"
            >
              <Save className="w-3 h-3" /> Save Draft
            </Button>
            <Button
              size="sm"
              className="bg-gold-700 hover:bg-gold-600 text-background h-7 text-xs gap-1"
              data-ocid="builder.publish_button"
            >
              <Send className="w-3 h-3" /> Publish
            </Button>
            {/* Mobile sidebar trigger */}
            <button
              type="button"
              className="lg:hidden p-1.5 rounded border border-gold-800/30 text-gold-400 text-xs"
              onClick={() => setShowMobileSidebar(true)}
              data-ocid="builder.sections_drawer_button"
            >
              Sections
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDEBAR — desktop */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-gold-800/30 bg-card/60 overflow-y-auto">
            <div className="p-3 border-b border-gold-800/20">
              <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                Sections Library
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {SECTION_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="border-b border-gold-800/10 last:border-0"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/20 transition-colors text-left"
                    onClick={() => toggleCategory(cat.label)}
                    data-ocid={`builder.section_cat.${cat.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.toggle`}
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <span>{cat.icon}</span>
                      <span className="font-medium">{cat.label}</span>
                    </span>
                    {openCategories[cat.label] ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  {openCategories[cat.label] && (
                    <div className="px-3 pb-2 space-y-1.5">
                      {cat.sections.map((sec, si) => (
                        <div
                          key={sec.name}
                          className="group relative rounded-lg overflow-hidden border border-gold-800/20 hover:border-gold-500/30 transition-colors cursor-pointer"
                          data-ocid={`builder.section_thumb.${si + 1}`}
                        >
                          <div
                            className={`h-10 w-full ${sec.color} flex items-center justify-center`}
                          >
                            <span className="text-[10px] text-muted-foreground">
                              {sec.name}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-[10px] bg-gold-700 text-background px-2 py-0.5 rounded font-semibold">
                              Add
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* CENTER CANVAS */}
          <main className="flex-1 flex flex-col overflow-auto bg-background min-w-0">
            {/* Device Toggle Bar */}
            <div className="flex items-center justify-center gap-1 py-2 border-b border-gold-800/20 bg-card/40">
              {(["mobile", "tablet", "desktop"] as DeviceMode[]).map((d) => {
                const Icon = DEVICE_ICONS[d];
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      device === d
                        ? "bg-gold-700 text-background"
                        : "text-muted-foreground hover:bg-muted/30"
                    }`}
                    data-ocid={`builder.device.${d}.toggle`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline capitalize">{d}</span>
                    <span className="text-[10px] opacity-60">
                      ({DEVICE_WIDTHS[d]}px)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Canvas Frame */}
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center">
              <div
                className="bg-white rounded-xl border-2 border-gold-800/30 shadow-2xl min-h-[500px] transition-all duration-300"
                style={{ width: `min(100%, ${canvasWidth}px)` }}
                data-ocid="builder.canvas_target"
              >
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 gap-3">
                  <Wand2 className="w-10 h-10 text-gray-300" />
                  <p className="text-sm text-gray-400 font-sans">
                    Drop sections here or use AI Builder below
                  </p>
                  <p className="text-xs text-gray-300">
                    Canvas width: <strong>{canvasWidth}px</strong> ({device})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    {["Hero Section", "Services Grid", "Contact Form"].map(
                      (hint) => (
                        <span
                          key={hint}
                          className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200"
                        >
                          {hint}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* AI Builder Bar */}
              <div className="w-full max-w-2xl mt-4 flex gap-2">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
                  <Input
                    placeholder="Describe a section… e.g. 'A hero with gold gradient and contact CTA'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="pl-9 bg-card border-gold-800/30 text-foreground text-sm placeholder:text-muted-foreground"
                    data-ocid="builder.ai_prompt.input"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-gold-700 hover:bg-gold-600 text-background gap-1 shrink-0"
                  data-ocid="builder.ai_generate.button"
                >
                  <Wand2 className="w-4 h-4" />
                  {generating ? "Generating…" : "Generate"}
                </Button>
              </div>
            </div>
          </main>

          {/* RIGHT STYLE PANEL — desktop */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l border-gold-800/30 bg-card/60 overflow-y-auto">
            <div className="p-3 border-b border-gold-800/20">
              <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
                Style Editor
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Colors */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Colors
                </p>
                {[
                  {
                    label: "Background",
                    value: bgColor,
                    onChange: setBgColor,
                    id: "bg",
                  },
                  {
                    label: "Accent",
                    value: accentColor,
                    onChange: setAccentColor,
                    id: "accent",
                  },
                  {
                    label: "Text",
                    value: textColor,
                    onChange: setTextColor,
                    id: "text",
                  },
                  {
                    label: "Secondary",
                    value: secondaryColor,
                    onChange: setSecondaryColor,
                    id: "secondary",
                  },
                ].map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between"
                    data-ocid={`builder.color.${c.id}`}
                  >
                    <Label className="text-sm text-foreground">{c.label}</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-gold-800/20"
                        style={{ background: c.value }}
                      />
                      <input
                        type="color"
                        value={c.value}
                        onChange={(e) => c.onChange(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-gold-800/20" />

              {/* Fonts */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Typography
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Heading Font
                  </Label>
                  <select
                    value={headingFont}
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
                    data-ocid="builder.heading_font.select"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Body Font
                  </Label>
                  <select
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
                    data-ocid="builder.body_font.select"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Separator className="bg-gold-800/20" />

              {/* Spacing */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Spacing
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-xs text-foreground">
                      Section Padding
                    </Label>
                    <span className="text-xs text-gold-400">{padding}px</span>
                  </div>
                  <input
                    type="range"
                    min={16}
                    max={120}
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full accent-gold-500"
                    data-ocid="builder.padding.slider"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-xs text-foreground">
                      Border Radius
                    </Label>
                    <span className="text-xs text-gold-400">
                      {borderRadius}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full accent-gold-500"
                    data-ocid="builder.border_radius.slider"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Sections Drawer */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/60"
              role="presentation"
              onClick={() => setShowMobileSidebar(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setShowMobileSidebar(false)
              }
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-card border-t border-gold-800/30 rounded-t-2xl max-h-[70vh] flex flex-col"
              data-ocid="builder.sections.sheet"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gold-800/20">
                <p className="font-serif font-semibold text-foreground text-sm">
                  Sections Library
                </p>
                <button
                  type="button"
                  onClick={() => setShowMobileSidebar(false)}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="builder.sections.close_button"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1 py-2">
                {SECTION_CATEGORIES.map((cat) => (
                  <div
                    key={cat.label}
                    className="border-b border-gold-800/10 last:border-0"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors text-left"
                      onClick={() => toggleCategory(cat.label)}
                    >
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <span>{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </span>
                      {openCategories[cat.label] ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {openCategories[cat.label] && (
                      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
                        {cat.sections.map((sec, si) => (
                          <div
                            key={sec.name}
                            className={`h-12 rounded-lg ${sec.color} border border-gold-800/20 flex items-center justify-center`}
                            data-ocid={`builder.mobile_section.${si + 1}`}
                          >
                            <span className="text-[9px] text-muted-foreground text-center px-1 leading-tight">
                              {sec.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SecureAppGate>
  );
}
