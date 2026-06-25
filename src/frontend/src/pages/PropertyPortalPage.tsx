import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  useGetPriceHistory,
  useIncrementPropertyView,
  useProperties,
  useSubmitPropertyAlert,
  useSubmitPropertyEnquiry,
  useSubmitVisitRequest,
} from "@/hooks/usePropertyQueries";
import {
  ACTIONS,
  AHMEDABAD_LOCATIONS,
  BHK_OPTIONS,
  BUY_BUDGET_RANGES,
  DEFAULT_FILTERS,
  FURNISHING_OPTIONS,
  GUJARAT_CITIES,
  LEASE_BUDGET_RANGES,
  POSSESSION_OPTIONS,
  PROPERTY_TYPES,
  RENT_BUDGET_RANGES,
} from "@/types/property";
import type {
  BudgetRange,
  PropertyFilters,
  PropertyListing,
  SortOption,
} from "@/types/property";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Building2,
  Calculator,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Grid3X3,
  Heart,
  Home,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  QrCode,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PropertyListing as BackendListing } from "../backend";

const PAGE_SIZE = 12;
const SHORTLIST_KEY = "mstc_shortlist";
const MAX_COMPARE = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(n: bigint | number): string {
  const v = typeof n === "bigint" ? Number(n) : n;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
}

function mapListing(l: BackendListing): PropertyListing {
  return {
    id: l.id,
    title: l.title,
    propertyType: l.propertyType,
    action: l.action,
    bhk: l.bhk,
    sqft: l.sqft,
    price: l.price,
    priceDisplay: l.priceDisplay,
    address: l.address,
    location: l.location,
    city: l.city,
    furnishing: l.furnishing,
    possession: l.possession,
    facing: l.facing,
    floorNo: l.floorNo,
    societyName: l.societyName,
    description: l.description,
    amenities: l.amenities,
    images: l.images,
    mapLink: l.mapLink,
    sourceTag: l.sourceTag,
    listedDate: l.listedDate,
    agencyName: l.agencyName,
    agencyPhone: l.agencyPhone,
  };
}

function getBudgetRanges(action: string): BudgetRange[] {
  if (action === "Rent" || action === "PG") return RENT_BUDGET_RANGES;
  if (action === "Lease") return LEASE_BUDGET_RANGES;
  return BUY_BUDGET_RANGES;
}

// ─── Shortlist Hook ────────────────────────────────────────────────────────────
function useShortlist() {
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SHORTLIST_KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const toggle = useCallback((id: string) => {
    setShortlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { shortlist, toggle };
}

// ─── Compact Filter Bar ────────────────────────────────────────────────────────
function FilterBar({
  filters,
  setFilters,
  search,
  setSearch,
  resultCount,
  totalCount,
  onShowLocality,
  showLocality,
  shortlistCount,
  showShortlistOnly,
  setShowShortlistOnly,
  onAlert,
}: {
  filters: PropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  search: string;
  setSearch: (v: string) => void;
  resultCount: number;
  totalCount: number;
  onShowLocality: () => void;
  showLocality: boolean;
  shortlistCount: number;
  showShortlistOnly: boolean;
  setShowShortlistOnly: (v: boolean) => void;
  onAlert: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const budgetRanges = getBudgetRanges(filters.action);

  const hasFilters = !!(
    filters.propertyType ||
    filters.action ||
    filters.location ||
    filters.bhk ||
    filters.furnishing ||
    filters.possession ||
    filters.budgetRange
  );

  const sel =
    (k: keyof PropertyFilters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters((p) => ({
        ...p,
        [k]: e.target.value,
        ...(k === "action" ? { budgetRange: "" } : {}),
      }));

  return (
    <div
      className="bg-obsidian-800/90 border-b border-gold-800/30 sticky top-16 z-20"
      data-ocid="portal.filter_bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Row 1 — search + core filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-shrink-0 w-52">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-500"
            />
            <input
              type="text"
              placeholder="Search properties…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tool-field-input pl-8 py-1.5 text-xs w-full"
              data-ocid="portal.search_input"
            />
          </div>
          {/* Transaction type */}
          <select
            value={filters.action}
            onChange={sel("action")}
            className="tool-field-input text-xs py-1.5"
            data-ocid="portal.filter_action"
          >
            <option value="">All Actions</option>
            {ACTIONS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          {/* Property type */}
          <select
            value={filters.propertyType}
            onChange={sel("propertyType")}
            className="tool-field-input text-xs py-1.5"
            data-ocid="portal.filter_type"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {/* Budget — changes by action */}
          <select
            value={filters.budgetRange}
            onChange={sel("budgetRange")}
            className="tool-field-input text-xs py-1.5"
            data-ocid="portal.filter_budget"
          >
            <option value="">Any Budget</option>
            {budgetRanges.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
          {/* Locality */}
          <select
            value={filters.location}
            onChange={sel("location")}
            className="tool-field-input text-xs py-1.5"
            data-ocid="portal.filter_location"
          >
            <option value="">All Locations</option>
            {[...AHMEDABAD_LOCATIONS, ...GUJARAT_CITIES].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          {/* More filters toggle */}
          <button
            type="button"
            onClick={() => setExpanded((x) => !x)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-sans border rounded-sm transition-all ${expanded ? "bg-gold-600 border-gold-500 text-obsidian-900 font-semibold" : "border-gold-800/40 text-gold-400 hover:border-gold-600/50"}`}
            data-ocid="portal.more_filters_toggle"
          >
            <SlidersHorizontal size={11} /> More
          </button>
          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-sans border border-gold-800/30 text-gold-500 hover:text-gold-300 rounded-sm transition-all"
              data-ocid="portal.clear_filters_button"
            >
              <RotateCcw size={10} /> Clear
            </button>
          )}
          {/* Shortlist toggle */}
          <button
            type="button"
            onClick={() => setShowShortlistOnly(!showShortlistOnly)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-sans border rounded-sm transition-all ml-auto ${
              showShortlistOnly
                ? "bg-gold-600 border-gold-500 text-obsidian-900 font-semibold"
                : "border-gold-800/30 text-gold-400 hover:border-gold-600/50"
            }`}
            data-ocid="portal.shortlist_toggle"
          >
            <Heart
              size={11}
              className={showShortlistOnly ? "fill-obsidian-900" : ""}
            />
            Shortlist{" "}
            {shortlistCount > 0 && (
              <span className="bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ml-0.5">
                {shortlistCount}
              </span>
            )}
          </button>
          {/* Locality view */}
          <button
            type="button"
            onClick={onShowLocality}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-sans border rounded-sm transition-all ${showLocality ? "bg-gold-600 border-gold-500 text-obsidian-900 font-semibold" : "border-gold-800/30 text-gold-400 hover:border-gold-600/50"}`}
            data-ocid="portal.locality_view_toggle"
          >
            <Grid3X3 size={11} /> Localities
          </button>
          {/* Alert */}
          <button
            type="button"
            onClick={onAlert}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-sans border border-gold-800/30 text-gold-400 hover:border-gold-600/50 rounded-sm transition-all"
            data-ocid="portal.alert_button"
          >
            <Bell size={11} /> Alert
          </button>
        </div>

        {/* Expanded row */}
        {expanded && (
          <div className="flex flex-wrap gap-2 items-center mt-2 pt-2 border-t border-gold-800/20">
            <select
              value={filters.bhk}
              onChange={sel("bhk")}
              className="tool-field-input text-xs py-1.5"
              data-ocid="portal.filter_bhk"
            >
              <option value="">Any BHK</option>
              {BHK_OPTIONS.filter((b) => b !== "Any").map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select
              value={filters.furnishing}
              onChange={sel("furnishing")}
              className="tool-field-input text-xs py-1.5"
              data-ocid="portal.filter_furnishing"
            >
              <option value="">Any Furnishing</option>
              {FURNISHING_OPTIONS.filter((f) => f !== "Any").map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select
              value={filters.possession}
              onChange={sel("possession")}
              className="tool-field-input text-xs py-1.5"
              data-ocid="portal.filter_possession"
            >
              <option value="">Any Possession</option>
              {POSSESSION_OPTIONS.filter((p) => p !== "Any").map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs font-sans text-obsidian-400">
            Showing{" "}
            <span className="text-gold-400 font-semibold">{resultCount}</span>{" "}
            of <span className="text-obsidian-200">{totalCount}</span>{" "}
            properties
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Locality View ─────────────────────────────────────────────────────────────
function LocalityView({
  properties,
  onSelectLocality,
}: { properties: PropertyListing[]; onSelectLocality: (loc: string) => void }) {
  const localities = useMemo(() => {
    const map = new Map<
      string,
      { count: number; minPrice: number; maxPrice: number; types: Set<string> }
    >();
    for (const p of properties) {
      const loc = p.location || p.city;
      if (!loc) continue;
      const entry = map.get(loc) ?? {
        count: 0,
        minPrice: Number.POSITIVE_INFINITY,
        maxPrice: 0,
        types: new Set(),
      };
      entry.count++;
      const pr = Number(p.price);
      if (pr < entry.minPrice) entry.minPrice = pr;
      if (pr > entry.maxPrice) entry.maxPrice = pr;
      entry.types.add(p.propertyType);
      map.set(loc, entry);
    }
    return Array.from(map.entries())
      .map(([loc, v]) => ({ loc, ...v, types: Array.from(v.types) }))
      .sort((a, b) => b.count - a.count);
  }, [properties]);

  const typeColors: Record<string, string> = {
    Residential: "bg-emerald-500",
    Commercial: "bg-blue-500",
    Plot: "bg-amber-500",
    Industrial: "bg-purple-500",
    Redevelopment: "bg-rose-500",
  };

  return (
    <div className="py-6" data-ocid="portal.locality_view">
      <h2 className="font-serif text-xl text-gold-200 font-bold mb-4">
        Browse by Locality
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {localities.map(({ loc, count, minPrice, maxPrice, types }) => (
          <button
            type="button"
            key={loc}
            onClick={() => onSelectLocality(loc)}
            className="text-left p-4 bg-obsidian-800/60 border border-gold-800/30 hover:border-gold-600/50 rounded-sm transition-all group"
            data-ocid={`portal.locality_card.${loc.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          >
            <p className="font-serif text-sm font-semibold text-gold-200 group-hover:text-gold-100 mb-1">
              {loc}
            </p>
            <p className="font-sans text-xs text-gold-400 font-bold mb-1">
              {count} properties
            </p>
            <p className="font-sans text-[10px] text-obsidian-300 mb-2">
              {formatINR(minPrice)} – {formatINR(maxPrice)}
            </p>
            <div className="flex gap-1 flex-wrap">
              {types.map((t) => (
                <span
                  key={t}
                  className={`w-2 h-2 rounded-full ${typeColors[t] ?? "bg-gold-500"}`}
                  title={t}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── QR Code Modal ────────────────────────────────────────────────────────────
function QrModal({
  property,
  onClose,
}: { property: PropertyListing; onClose: () => void }) {
  const url = `https://mstcglobal-kh8.caffeine.xyz/#/property/${encodeURIComponent(property.id)}`;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      data-ocid="portal.qr_dialog"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-xs mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gold-800/30">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-gold-500" />
            <h2 className="font-serif text-base text-gold-200 font-bold">
              QR Code
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.qr_close_button"
          >
            <X size={16} className="text-gold-400" />
          </button>
        </div>
        <div className="p-5 flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded">
            <QRCodeSVG value={url} size={160} level="M" />
          </div>
          <p className="font-serif text-xs text-gold-200 text-center font-semibold line-clamp-2">
            {property.title}
          </p>
          <p className="text-[10px] font-sans text-obsidian-400 text-center break-all">
            {url}
          </p>
          <p className="text-[10px] font-sans text-obsidian-300 text-center">
            Scan to view this property on MSTC GLOBAL
          </p>
        </div>
      </div>
    </div>
  );
}

function getLocalityBadge(
  location: string,
): { label: string; color: string } | null {
  const loc = location.toLowerCase();
  if (
    ["vastral", "naroda", "motera", "chandkheda", "sabarmati", "ranip"].some(
      (l) => loc.includes(l),
    )
  ) {
    return {
      label: "Near Metro",
      color: "bg-blue-900/60 text-blue-300 border border-blue-700",
    };
  }
  if (
    ["sg highway", "prahlad nagar", "thaltej", "bodakdev"].some((l) =>
      loc.includes(l),
    )
  ) {
    return {
      label: "IT Hub",
      color: "bg-purple-900/60 text-purple-300 border border-purple-700",
    };
  }
  if (
    ["navrangpura", "ambawadi", "naranpura", "satellite"].some((l) =>
      loc.includes(l),
    )
  ) {
    return {
      label: "Education Zone",
      color: "bg-teal-900/60 text-teal-300 border border-teal-700",
    };
  }
  if (
    [
      "naroda",
      "nikol",
      "vastral",
      "vatva",
      "odhav",
      "gomtipur",
      "bapunagar",
    ].some((l) => loc.includes(l))
  ) {
    return {
      label: "Affordable",
      color: "bg-green-900/60 text-green-300 border border-green-700",
    };
  }
  if (
    [
      "satellite",
      "prahlad nagar",
      "bodakdev",
      "vastrapur",
      "thaltej",
      "bopal",
    ].some((l) => loc.includes(l))
  ) {
    return {
      label: "Premium",
      color: "bg-yellow-900/60 text-yellow-300 border border-yellow-700",
    };
  }
  return null;
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  onViewDetails,
  onEnquire,
  onScheduleVisit,
  index,
  shortlisted,
  onToggleShortlist,
  compareList,
  onToggleCompare,
}: {
  property: PropertyListing;
  onViewDetails: (p: PropertyListing) => void;
  onEnquire: (p: PropertyListing) => void;
  onScheduleVisit: (p: PropertyListing) => void;
  index: number;
  shortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
}) {
  const incrementView = useIncrementPropertyView();
  const [qrOpen, setQrOpen] = useState(false);
  const inCompare = compareList.includes(property.id);
  const compareDisabled = !inCompare && compareList.length >= MAX_COMPARE;

  return (
    <>
      {qrOpen && (
        <QrModal property={property} onClose={() => setQrOpen(false)} />
      )}
      <div
        className={`flex flex-col bg-obsidian-800/60 border hover:border-gold-600/50 rounded-sm overflow-hidden transition-all duration-300 group ${
          inCompare ? "border-gold-500/70" : "border-gold-800/30"
        }`}
        data-ocid={`portal.property.item.${index + 1}`}
      >
        {/* Header strip */}
        <div className="relative flex items-center justify-between px-4 pt-3 pb-2 border-b border-gold-800/20">
          {property.isPreLaunch && (
            <span className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-black rounded bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 animate-pulse shadow-lg">
              PRE-LAUNCH
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-obsidian-700/70 border border-gold-800/30 text-gold-300">
              {property.action}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Compare checkbox */}
            <button
              type="button"
              title={
                compareDisabled
                  ? "Max 3 to compare"
                  : inCompare
                    ? "Remove from compare"
                    : "Add to compare"
              }
              disabled={compareDisabled}
              onClick={() => onToggleCompare(property.id)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                inCompare
                  ? "bg-gold-600 border-gold-500"
                  : compareDisabled
                    ? "border-obsidian-600 opacity-40"
                    : "border-gold-700/50 hover:border-gold-500"
              }`}
              data-ocid={`portal.compare_check.${index + 1}`}
            >
              {inCompare && (
                <CheckCircle2 size={9} className="text-obsidian-900" />
              )}
            </button>
            {/* Heart */}
            <button
              type="button"
              onClick={() => onToggleShortlist(property.id)}
              className="p-0.5 hover:scale-110 transition-transform"
              aria-label={
                shortlisted ? "Remove from shortlist" : "Add to shortlist"
              }
              data-ocid={`portal.shortlist.${index + 1}`}
            >
              <Heart
                size={14}
                className={
                  shortlisted
                    ? "text-gold-400 fill-gold-400"
                    : "text-gold-600 hover:text-gold-400"
                }
              />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-serif text-sm font-semibold text-gold-200 leading-snug mb-1 line-clamp-2">
            {property.title}
          </h3>
          <p className="font-serif text-xl font-bold text-gold-400 mb-3">
            {property.priceDisplay || formatINR(property.price)}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
            {property.propertyType && (
              <div>
                <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                  Type
                </p>
                <p className="text-xs font-sans text-obsidian-100 font-medium">
                  {property.propertyType}
                </p>
              </div>
            )}
            {property.bhk && (
              <div>
                <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                  BHK
                </p>
                <p className="text-xs font-sans text-obsidian-100 font-medium">
                  {property.bhk}
                </p>
              </div>
            )}
            {property.sqft > 0n && (
              <div>
                <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                  Area
                </p>
                <p className="text-xs font-sans text-obsidian-100 font-medium">
                  {Number(property.sqft).toLocaleString()} sqft
                </p>
              </div>
            )}
            {property.furnishing && (
              <div>
                <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                  Furnishing
                </p>
                <p className="text-xs font-sans text-obsidian-100 font-medium">
                  {property.furnishing}
                </p>
              </div>
            )}
            {property.possession && (
              <div>
                <p className="text-[10px] font-sans text-obsidian-400 uppercase tracking-widest">
                  Possession
                </p>
                <p className="text-xs font-sans text-obsidian-100 font-medium">
                  {property.possession}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-sans text-obsidian-300 mb-3">
            <MapPin size={11} className="flex-shrink-0 text-gold-600" />
            <span className="line-clamp-1">
              {property.location}
              {property.city && property.city !== property.location
                ? `, ${property.city}`
                : ""}
            </span>
          </div>

          {/* Society name + locality badges */}
          {property.societyName && (
            <p className="text-[10px] font-sans text-gold-500/70 mb-1 truncate">
              {property.societyName}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-1 mb-2">
            {(() => {
              const badge = getLocalityBadge(property.location);
              return badge ? (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}
                >
                  {badge.label}
                </span>
              ) : null;
            })()}
            {/* Show RERA badge only when sourceTag explicitly contains 'rera' — never show source platform names */}
            {property.sourceTag?.toLowerCase().includes("rera") &&
            !property.sourceTag?.toLowerCase().includes("magicbrick") &&
            !property.sourceTag?.toLowerCase().includes("99acre") &&
            !property.sourceTag?.toLowerCase().includes("housing.com") &&
            !property.sourceTag?.toLowerCase().includes("nobroker") ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/60 text-green-300 border border-green-700 font-medium">
                RERA ✓
              </span>
            ) : null}
          </div>

          {property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {property.amenities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="px-1.5 py-0.5 text-[10px] font-sans bg-obsidian-700/60 text-obsidian-200 rounded"
                >
                  {a}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] font-sans text-gold-500">
                  +{property.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  incrementView.mutate(property.id);
                  onViewDetails(property);
                }}
                className="flex-1 py-2 text-xs font-sans font-semibold tracking-wider uppercase border border-gold-700/40 text-gold-400 hover:bg-gold-900/30 hover:border-gold-500/60 rounded-sm transition-all"
                data-ocid={`portal.view_details.${index + 1}`}
              >
                More Details
              </button>
              <button
                type="button"
                onClick={() => onEnquire(property)}
                className="flex-1 py-2 text-xs font-sans font-semibold tracking-wider uppercase bg-gold-600 hover:bg-gold-500 text-obsidian-900 rounded-sm transition-all"
                data-ocid={`portal.enquire.${index + 1}`}
              >
                Enquire Now
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onScheduleVisit(property)}
                className="flex-1 py-1.5 text-xs font-sans font-medium border border-gold-800/30 text-gold-500 hover:border-gold-600/50 hover:text-gold-400 rounded-sm transition-all flex items-center justify-center gap-1.5"
                data-ocid={`portal.schedule_visit.${index + 1}`}
              >
                <CalendarCheck size={11} /> Schedule Visit
              </button>
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="px-3 py-1.5 text-xs font-sans border border-gold-800/30 text-gold-500 hover:border-gold-600/50 hover:text-gold-400 rounded-sm transition-all flex items-center justify-center gap-1"
                aria-label="Show QR Code"
                data-ocid={`portal.qr_button.${index + 1}`}
              >
                <QrCode size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Compare Bar ──────────────────────────────────────────────────────────────
function CompareBar({
  compareList,
  allProperties,
  onClear,
  onCompare,
}: {
  compareList: string[];
  allProperties: PropertyListing[];
  onClear: () => void;
  onCompare: () => void;
}) {
  if (compareList.length < 2) return null;
  const selected = allProperties.filter((p) => compareList.includes(p.id));
  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 bg-obsidian-800 border border-gold-600/60 rounded-sm shadow-2xl"
      data-ocid="portal.compare_bar"
    >
      <span className="font-sans text-xs text-gold-300">
        Comparing{" "}
        <span className="text-gold-400 font-bold">{compareList.length}</span>{" "}
        properties
      </span>
      {selected.map((p) => (
        <span
          key={p.id}
          className="text-[10px] font-sans text-obsidian-200 px-2 py-1 bg-obsidian-700/60 rounded"
        >
          {p.title.slice(0, 18)}…
        </span>
      ))}
      <button
        type="button"
        onClick={onCompare}
        className="px-4 py-1.5 bg-gold-600 text-obsidian-900 font-sans font-bold text-xs rounded-sm hover:bg-gold-500 transition-all"
        data-ocid="portal.compare_view_button"
      >
        Compare
      </button>
      <button
        type="button"
        onClick={onClear}
        className="px-3 py-1.5 border border-gold-800/40 text-gold-400 font-sans text-xs rounded-sm hover:bg-obsidian-700"
        data-ocid="portal.compare_clear_button"
      >
        Clear
      </button>
    </div>
  );
}

// ─── Compare Modal ────────────────────────────────────────────────────────────
function CompareModal({
  properties,
  onClose,
}: { properties: PropertyListing[]; onClose: () => void }) {
  const fields: [string, (p: PropertyListing) => string][] = [
    ["Price", (p) => p.priceDisplay || formatINR(p.price)],
    ["Type", (p) => p.propertyType],
    ["BHK", (p) => p.bhk],
    [
      "Area",
      (p) => (p.sqft > 0n ? `${Number(p.sqft).toLocaleString()} sqft` : "—"),
    ],
    ["Furnishing", (p) => p.furnishing || "—"],
    ["Possession", (p) => p.possession || "—"],
    ["Location", (p) => p.location],
    ["Society", (p) => p.societyName || "—"],
    ["Action", (p) => p.action],
  ];
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      data-ocid="portal.compare_modal"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <h2 className="font-serif text-lg text-gold-200 font-bold">
            Property Comparison
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.compare_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr>
                <th className="text-left text-obsidian-400 uppercase tracking-widest pb-3 pr-4 w-28">
                  Feature
                </th>
                {properties.map((p) => (
                  <th
                    key={p.id}
                    className="text-left text-gold-300 pb-3 px-3 font-serif font-semibold text-sm"
                  >
                    {p.title.slice(0, 30)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(([label, fn]) => (
                <tr key={label} className="border-t border-gold-800/20">
                  <td className="text-obsidian-400 py-2.5 pr-4 uppercase tracking-widest text-[10px]">
                    {label}
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="text-obsidian-100 py-2.5 px-3">
                      {fn(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  property,
  onClose,
  onEnquire,
  onScheduleVisit,
}: {
  property: PropertyListing;
  onClose: () => void;
  onEnquire: (p: PropertyListing) => void;
  onScheduleVisit: (p: PropertyListing) => void;
}) {
  const { data: history = [] } = useGetPriceHistory(
    property.id,
    Number(property.price),
  );

  // EMI calculator state (pre-filled)
  const basePrice = Number(property.price);
  const [dp, setDp] = useState(Math.round(basePrice * 0.2));
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const r = rate / 100 / 12;
  const n = tenure * 12;
  const loan = basePrice - dp;
  const emi =
    loan > 0 && r > 0
      ? Math.round((loan * r * (1 + r) ** n) / ((1 + r) ** n - 1))
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end"
      data-ocid="portal.detail_panel"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close panel"
      />
      <div className="relative z-10 w-full sm:w-[560px] h-full sm:h-auto sm:max-h-[92vh] overflow-y-auto bg-obsidian-800 border-l border-t border-gold-800/30 sm:rounded-l-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-obsidian-300 uppercase tracking-widest">
              {property.propertyType}
            </span>
            {property.action && (
              <span className="px-2 py-0.5 rounded text-xs font-sans bg-obsidian-700/70 border border-gold-800/30 text-gold-300">
                {property.action}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.detail_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div>
            <h2 className="font-serif text-xl text-gold-200 font-bold leading-tight">
              {property.title}
            </h2>
            <p className="font-serif text-2xl text-gold-400 font-bold mt-1">
              {property.priceDisplay || formatINR(property.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-sans">
            {(
              [
                property.bhk && ["BHK", property.bhk],
                property.sqft > 0n && [
                  "Area",
                  `${Number(property.sqft).toLocaleString()} sqft`,
                ],
                property.furnishing && ["Furnishing", property.furnishing],
                property.facing && ["Facing", property.facing],
                property.floorNo > 0n && [
                  "Floor",
                  `${Number(property.floorNo)}`,
                ],
                property.possession && ["Possession", property.possession],
              ] as (false | [string, string])[]
            )
              .filter(Boolean)
              .map((row) => {
                const [k, v] = row as [string, string];
                return (
                  <div key={k} className="bg-obsidian-700/40 rounded p-2">
                    <div className="text-xs text-obsidian-300 mb-0.5">{k}</div>
                    <div className="text-gold-200 font-medium">{v}</div>
                  </div>
                );
              })}
          </div>

          {property.societyName && (
            <div>
              <span className="text-xs font-sans text-obsidian-300 uppercase tracking-widest">
                Society / Project
              </span>
              <p className="font-sans text-sm text-gold-300 mt-0.5">
                {property.societyName}
              </p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-sans text-sm text-obsidian-100">
                {property.address}
              </p>
              <p className="font-sans text-xs text-obsidian-300 mt-0.5">
                {property.location}
                {property.city && `, ${property.city}`}
              </p>
            </div>
          </div>
          {property.description && (
            <div>
              <p className="text-xs font-sans text-obsidian-300 uppercase tracking-widest mb-1">
                Description
              </p>
              <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}
          {property.amenities.length > 0 && (
            <div>
              <p className="text-xs font-sans text-obsidian-300 uppercase tracking-widest mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 px-2.5 py-1 bg-obsidian-700/50 border border-gold-800/30 rounded text-xs font-sans text-obsidian-100"
                  >
                    <CheckCircle2 size={10} className="text-gold-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price trend */}
          {history.length >= 2 &&
            (() => {
              const pct = (
                ((history[history.length - 1].price - history[0].price) /
                  history[0].price) *
                100
              ).toFixed(1);
              const isUp = Number(pct) >= 0;
              return (
                <div>
                  <p className="text-xs font-sans text-obsidian-300 uppercase tracking-widest mb-1">
                    Price Trend (12 months)
                  </p>
                  <span
                    className={`text-xs font-sans font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {isUp ? "▲" : "▼"} {Math.abs(Number(pct))}% this year
                  </span>
                </div>
              );
            })()}

          {/* EMI Calculator */}
          {(property.action === "Buy" || !property.action) && (
            <div className="bg-obsidian-700/40 border border-gold-800/30 rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={14} className="text-gold-500" />
                <span className="text-xs font-sans font-semibold text-gold-400 uppercase tracking-widest">
                  EMI Calculator
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-[10px] text-obsidian-300 mb-1 block">
                    Down Payment ₹
                  </label>
                  <input
                    type="number"
                    value={dp}
                    onChange={(e) => setDp(Number(e.target.value))}
                    className="tool-field-input text-xs py-1"
                    data-ocid="portal.emi_dp_input"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-obsidian-300 mb-1 block">
                    Rate % p.a.
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="tool-field-input text-xs py-1"
                    data-ocid="portal.emi_rate_input"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-obsidian-300 mb-1 block">
                    Tenure (yrs)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="tool-field-input text-xs py-1"
                    data-ocid="portal.emi_tenure_input"
                  />
                </div>
              </div>
              {emi > 0 && (
                <div className="text-center">
                  <p className="text-xs text-obsidian-400 mb-0.5">
                    Monthly EMI
                  </p>
                  <p className="font-serif text-2xl font-bold text-gold-400">
                    ₹{emi.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-obsidian-400 mt-1">
                    Loan amount: {formatINR(loan)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Contact locked */}
          <div className="bg-obsidian-700/40 border border-gold-800/30 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} className="text-gold-500" />
              <span className="text-xs font-sans font-semibold text-gold-400 uppercase tracking-widest">
                Contact Information
              </span>
            </div>
            <p className="text-xs font-sans text-obsidian-300">
              Submit an enquiry to reveal owner/agent contact details.
            </p>
          </div>
          <p className="text-xs font-sans text-obsidian-400">
            Listed: {property.listedDate}
          </p>
        </div>

        <div className="p-5 border-t border-gold-800/30 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEnquire(property)}
            className="flex-1 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm transition-all"
            data-ocid="portal.detail_enquire_button"
          >
            Enquire Now
          </button>
          <button
            type="button"
            onClick={() => onScheduleVisit(property)}
            className="flex-1 py-3 border border-gold-700/50 text-gold-400 hover:bg-gold-900/30 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm transition-all"
            data-ocid="portal.detail_visit_button"
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────
function EnquiryModal({
  property,
  onClose,
}: { property: PropertyListing; onClose: () => void }) {
  const submitEnquiry = useSubmitPropertyEnquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredTime: "",
    visitDate: "",
    indemnity: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[+\d\s-]{8,}$/.test(form.phone))
      e.phone = "Enter a valid phone number";
    if (!form.indemnity) e.indemnity = "You must accept the terms";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await submitEnquiry.mutateAsync({
        propertyId: property.id,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerMessage: form.message,
        preferredTime: form.preferredTime,
        visitDate: form.visitDate,
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Submission failed. Please try again." });
    }
  };

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({
        ...p,
        [k]:
          (e.target as HTMLInputElement).type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value,
      }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-ocid="portal.enquiry_dialog"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div>
            <h2 className="font-serif text-lg text-gold-200 font-bold">
              Property Enquiry
            </h2>
            <p className="text-xs font-sans text-obsidian-300 mt-0.5 line-clamp-1">
              {property.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.enquiry_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={48} className="text-gold-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-gold-200 mb-2">
              Enquiry Submitted!
            </h3>
            <p className="font-sans text-sm text-obsidian-200 mb-4">
              Our team will review and contact you shortly.
            </p>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500"
            >
              <Phone size={16} /> WhatsApp: +91 9512609016
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  className="w-full tool-field-input"
                  data-ocid="portal.enquiry_name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="portal.enquiry_name_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 9XXXXXXXXX"
                  className="w-full tool-field-input"
                  data-ocid="portal.enquiry_phone_input"
                />
                {errors.phone && (
                  <p
                    className="text-xs text-red-400 mt-1"
                    data-ocid="portal.enquiry_phone_error"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                className="w-full tool-field-input"
                data-ocid="portal.enquiry_email_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Preferred Time
                </label>
                <select
                  value={form.preferredTime}
                  onChange={set("preferredTime")}
                  className="w-full tool-field-input"
                  data-ocid="portal.enquiry_time_select"
                >
                  <option value="">Any time</option>
                  <option>Morning (9–12)</option>
                  <option>Afternoon (12–5)</option>
                  <option>Evening (5–8)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={set("visitDate")}
                  className="w-full tool-field-input"
                  data-ocid="portal.enquiry_date_input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={set("message")}
                rows={3}
                placeholder="Any specific requirements..."
                className="w-full tool-field-input resize-none"
                data-ocid="portal.enquiry_message_input"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.indemnity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, indemnity: e.target.checked }))
                }
                className="mt-0.5 cursor-pointer accent-gold-500"
                data-ocid="portal.enquiry_indemnity_checkbox"
              />
              <span className="text-xs font-sans text-obsidian-200 leading-relaxed">
                I agree that{" "}
                <strong className="text-gold-400">
                  MSTC Global is a facilitator
                </strong>{" "}
                only and accept the Terms of Service. Property details are
                subject to independent verification.{" "}
                <span className="text-red-400">*</span>
              </span>
            </label>
            {errors.indemnity && (
              <p
                className="text-xs text-red-400"
                data-ocid="portal.enquiry_indemnity_error"
              >
                {errors.indemnity}
              </p>
            )}
            {errors.submit && (
              <p
                className="text-xs text-red-400"
                data-ocid="portal.enquiry_error_state"
              >
                {errors.submit}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 font-sans font-medium text-sm rounded-sm hover:bg-obsidian-700"
                data-ocid="portal.enquiry_cancel_button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitEnquiry.isPending}
                className="flex-1 py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-60 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
                data-ocid="portal.enquiry_submit_button"
              >
                {submitEnquiry.isPending ? (
                  <span className="w-4 h-4 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Submit
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Visit Modal ──────────────────────────────────────────────────────────────
function VisitModal({
  property,
  onClose,
}: { property: PropertyListing; onClose: () => void }) {
  const submitVisit = useSubmitVisitRequest();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    preferredDate: "",
    preferredSlot: "",
    visitType: "In-Person",
  });
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitVisit.mutateAsync({
        propertyId: property.id,
        propertyTitle: property.title,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        preferredDate: form.preferredDate,
        preferredSlot: form.preferredSlot,
        visitType: form.visitType,
      });
      setDone(true);
    } catch {
      /* best-effort */
    }
  };
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      data-ocid="portal.visit_modal"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div className="flex items-center gap-2">
            <CalendarCheck size={16} className="text-gold-500" />
            <h2 className="font-serif text-lg text-gold-200 font-bold">
              Schedule a Visit
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.visit_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <CalendarCheck size={40} className="text-gold-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-gold-200 mb-2">
              Visit Scheduled!
            </h3>
            <p className="font-sans text-sm text-obsidian-200 mb-4">
              Our team will confirm your {form.visitType} visit.
            </p>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500"
            >
              <Phone size={14} /> WhatsApp: +91 9512609016
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-xs font-sans text-obsidian-300 line-clamp-1 border-b border-gold-800/20 pb-3">
              {property.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.customerName}
                  onChange={set("customerName")}
                  className="w-full tool-field-input"
                  data-ocid="portal.visit_name_input"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.customerPhone}
                  onChange={set("customerPhone")}
                  className="w-full tool-field-input"
                  data-ocid="portal.visit_phone_input"
                  placeholder="+91 9XXXXXXXXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Preferred Date *
                </label>
                <input
                  required
                  type="date"
                  value={form.preferredDate}
                  onChange={set("preferredDate")}
                  className="w-full tool-field-input"
                  min={new Date().toISOString().split("T")[0]}
                  data-ocid="portal.visit_date_input"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Time Slot *
                </label>
                <select
                  required
                  value={form.preferredSlot}
                  onChange={set("preferredSlot")}
                  className="w-full tool-field-input"
                  data-ocid="portal.visit_slot_select"
                >
                  <option value="">Select slot</option>
                  <option value="Morning 9-12">Morning (9–12)</option>
                  <option value="Afternoon 12-5">Afternoon (12–5)</option>
                  <option value="Evening 5-8">Evening (5–8)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              {["In-Person", "Video Call"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, visitType: t }))}
                  className={`flex-1 py-2 text-xs font-sans border rounded-sm transition-all ${
                    form.visitType === t
                      ? "bg-gold-600 border-gold-500 text-obsidian-900 font-semibold"
                      : "border-gold-800/40 text-gold-300 hover:border-gold-600/60"
                  }`}
                  data-ocid={`portal.visit_type_${t.toLowerCase().replace(" ", "_")}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitVisit.isPending}
              className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
              data-ocid="portal.visit_submit_button"
            >
              {submitVisit.isPending ? (
                <span className="w-4 h-4 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
              ) : (
                <>
                  <CalendarCheck size={14} /> Confirm Visit
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Alert Modal ──────────────────────────────────────────────────────────────
function AlertModal({ onClose }: { onClose: () => void }) {
  const submitAlert = useSubmitPropertyAlert();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    actionType: "",
    locationPreference: "",
    maxBudget: "",
    bhk: "",
  });
  const [done, setDone] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitAlert.mutateAsync(form);
      setDone(true);
    } catch {
      /* best-effort */
    }
  };
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      data-ocid="portal.alert_modal"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-gold-500" />
            <h2 className="font-serif text-lg text-gold-200 font-bold">
              Set Property Alert
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.alert_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <Bell size={40} className="text-gold-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-gold-200 mb-2">
              Alert Set!
            </h3>
            <p className="font-sans text-sm text-obsidian-200 mb-4">
              We'll notify you when matching properties are available.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500"
              data-ocid="portal.alert_done_button"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_name_input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_phone_input"
                  placeholder="+91 9XXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className="w-full tool-field-input"
                data-ocid="portal.alert_email_input"
                placeholder="your@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Property Type
                </label>
                <select
                  value={form.propertyType}
                  onChange={set("propertyType")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_type_select"
                >
                  <option value="">Any</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Looking to
                </label>
                <select
                  value={form.actionType}
                  onChange={set("actionType")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_action_select"
                >
                  <option value="">Any</option>
                  {ACTIONS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Preferred Location
              </label>
              <select
                value={form.locationPreference}
                onChange={set("locationPreference")}
                className="w-full tool-field-input"
                data-ocid="portal.alert_location_select"
              >
                <option value="">Any Location</option>
                {[...AHMEDABAD_LOCATIONS, ...GUJARAT_CITIES].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Max Budget
                </label>
                <select
                  value={form.maxBudget}
                  onChange={set("maxBudget")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_budget_select"
                >
                  <option value="">Any</option>
                  <option value="1000000">Under ₹10L</option>
                  <option value="2500000">Under ₹25L</option>
                  <option value="5000000">Under ₹50L</option>
                  <option value="10000000">Under ₹1 Cr</option>
                  <option value="20000000">Under ₹2 Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  BHK
                </label>
                <select
                  value={form.bhk}
                  onChange={set("bhk")}
                  className="w-full tool-field-input"
                  data-ocid="portal.alert_bhk_select"
                >
                  <option value="">Any</option>
                  {BHK_OPTIONS.filter((b) => b !== "Any").map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitAlert.isPending}
              className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
              data-ocid="portal.alert_submit_button"
            >
              {submitAlert.isPending ? (
                <span className="w-4 h-4 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Bell size={14} /> Set Alert
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Contact More Properties Modal ────────────────────────────────────────────
function ContactMoreModal({
  onClose,
  onSuccess,
  submitFn,
}: {
  onClose: () => void;
  onSuccess: () => void;
  submitFn: (data: Record<string, string>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    requirement: "",
    budget: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFn(form);
      setDone(true);
      setTimeout(onSuccess, 3000);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      data-ocid="portal.contact_more_modal"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gold-500" />
            <h2 className="font-serif text-lg text-gold-200 font-bold">
              Contact for More Properties
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="portal.contact_more_close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={48} className="text-gold-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-gold-200 mb-2">
              Request Received!
            </h3>
            <p className="font-sans text-sm text-obsidian-200 mb-4">
              Our team will reach out with curated property options.
            </p>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500"
            >
              <Phone size={16} /> WhatsApp: +91 9512609016
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  className="w-full tool-field-input"
                  data-ocid="portal.contact_more_name_input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  className="w-full tool-field-input"
                  data-ocid="portal.contact_more_phone_input"
                  placeholder="+91 9XXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className="w-full tool-field-input"
                data-ocid="portal.contact_more_email_input"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                What are you looking for? *
              </label>
              <textarea
                required
                value={form.requirement}
                onChange={set("requirement")}
                rows={2}
                className="w-full tool-field-input resize-none"
                data-ocid="portal.contact_more_requirement_input"
                placeholder="e.g. 3BHK apartment in Satellite under ₹80L"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Budget
                </label>
                <select
                  value={form.budget}
                  onChange={set("budget")}
                  className="w-full tool-field-input"
                  data-ocid="portal.contact_more_budget_select"
                >
                  <option value="">Any</option>
                  {BUY_BUDGET_RANGES.slice(1).map((r) => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
                  Location Preference
                </label>
                <select
                  value={form.location}
                  onChange={set("location")}
                  className="w-full tool-field-input"
                  data-ocid="portal.contact_more_location_select"
                >
                  <option value="">Any</option>
                  {[...AHMEDABAD_LOCATIONS, ...GUJARAT_CITIES].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
              data-ocid="portal.contact_more_submit_button"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} /> Submit Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
function PropertyPortal() {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSearchDebounced = (value: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setSearch(value), 300);
  };
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const [showLocality, setShowLocality] = useState(false);
  const [showShortlistOnly, setShowShortlistOnly] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [contactMoreOpen, setContactMoreOpen] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [detailProperty, setDetailProperty] = useState<PropertyListing | null>(
    null,
  );
  const [enquiryProperty, setEnquiryProperty] =
    useState<PropertyListing | null>(null);
  const [visitProperty, setVisitProperty] = useState<PropertyListing | null>(
    null,
  );
  const { shortlist, toggle: toggleShortlist } = useShortlist();
  const submitEnquiry = useSubmitPropertyEnquiry();

  // Load ALL properties by default (no gate)
  const { data: rawData = [], isLoading } = useProperties(
    {
      propertyType: "",
      action: "",
      location: "",
      bhk: "",
      furnishing: "",
      minPrice: BigInt(0),
      maxPrice: BigInt(999999999999),
    },
    true,
  );

  const allProperties = useMemo(() => rawData.map(mapListing), [rawData]);

  // Client-side filtering
  const filtered = useMemo(() => {
    let res = allProperties;
    if (filters.action) res = res.filter((p) => p.action === filters.action);
    if (filters.propertyType)
      res = res.filter((p) => p.propertyType === filters.propertyType);
    if (filters.location)
      res = res.filter(
        (p) => p.location === filters.location || p.city === filters.location,
      );
    if (filters.bhk) res = res.filter((p) => p.bhk === filters.bhk);
    if (filters.furnishing)
      res = res.filter((p) => p.furnishing === filters.furnishing);
    if (filters.possession)
      res = res.filter((p) => p.possession === filters.possession);
    if (filters.budgetRange) {
      const ranges = getBudgetRanges(filters.action);
      const range = ranges.find((r) => r.label === filters.budgetRange);
      if (range)
        res = res.filter(
          (p) => Number(p.price) >= range.min && Number(p.price) <= range.max,
        );
    }
    if (search.length >= 2) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    if (showShortlistOnly) res = res.filter((p) => shortlist.includes(p.id));
    return res;
  }, [allProperties, filters, search, showShortlistOnly, shortlist]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => Number(a.price - b.price));
    else if (sort === "price-desc")
      arr.sort((a, b) => Number(b.price - a.price));
    else if (sort === "area-asc") arr.sort((a, b) => Number(a.sqft - b.sqft));
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page on filter/search/tab change using sorted length as proxy
  const sortedKey = `${filters.action}|${filters.propertyType}|${filters.location}|${filters.budgetRange}|${filters.bhk}|${filters.furnishing}|${filters.possession}|${search}|${showShortlistOnly ? 1 : 0}`;
  const prevSortedKeyRef = useRef(sortedKey);
  if (prevSortedKeyRef.current !== sortedKey) {
    prevSortedKeyRef.current = sortedKey;
    if (page !== 1) setPage(1);
  }

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < MAX_COMPARE
          ? [...prev, id]
          : prev,
    );
  };

  const handleContactMoreSubmit = async (data: Record<string, string>) => {
    await submitEnquiry.mutateAsync({
      propertyId: "contact-more",
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email,
      customerMessage: `Requirement: ${data.requirement} | Budget: ${data.budget} | Location: ${data.location}`,
      preferredTime: "",
      visitDate: "",
    });
  };

  const compareProperties = allProperties.filter((p) =>
    compareList.includes(p.id),
  );

  return (
    <>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearchDebounced}
        resultCount={sorted.length}
        totalCount={allProperties.length}
        onShowLocality={() => setShowLocality((x) => !x)}
        showLocality={showLocality}
        shortlistCount={shortlist.length}
        showShortlistOnly={showShortlistOnly}
        setShowShortlistOnly={setShowShortlistOnly}
        onAlert={() => setAlertOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Locality View */}
        {showLocality && (
          <LocalityView
            properties={allProperties}
            onSelectLocality={(loc) => {
              setFilters((p) => ({ ...p, location: loc }));
              setShowLocality(false);
            }}
          />
        )}

        {!showLocality && (
          <>
            {/* Sort */}
            <div className="flex items-center justify-end gap-4 flex-wrap mb-5">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="tool-field-input text-xs py-2"
                data-ocid="portal.sort_select"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
                <option value="area-asc">Area: Smallest–Largest</option>
              </select>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="portal.loading_state"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <div
                    key={k}
                    className="bg-obsidian-800/60 border border-gold-800/20 rounded-sm h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-24" data-ocid="portal.empty_state">
                <Building2
                  size={48}
                  className="text-gold-700 mx-auto mb-4 opacity-50"
                />
                <h3 className="font-serif text-xl text-gold-400 mb-2">
                  No Properties Found
                </h3>
                <p className="font-sans text-sm text-obsidian-300 mb-6">
                  Try adjusting your filters or clear them to see all
                  properties.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setSearch("");
                  }}
                  className="px-6 py-3 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm hover:bg-gold-500"
                  data-ocid="portal.empty_clear_button"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginated.map((p, i) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      index={(page - 1) * PAGE_SIZE + i}
                      onViewDetails={setDetailProperty}
                      onEnquire={setEnquiryProperty}
                      onScheduleVisit={setVisitProperty}
                      shortlisted={shortlist.includes(p.id)}
                      onToggleShortlist={toggleShortlist}
                      compareList={compareList}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-sans border border-gold-800/30 text-gold-400 hover:bg-obsidian-700/60 disabled:opacity-40 rounded-sm"
                      data-ocid="portal.pagination_prev"
                    >
                      <ChevronLeft size={13} /> Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          Math.abs(p - page) <= 2 ||
                          p === 1 ||
                          p === totalPages,
                      )
                      .map((p, idx, arr) => (
                        <span key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="text-obsidian-500 px-1">…</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPage(p)}
                            className={`px-3 py-2 text-xs font-sans border rounded-sm transition-all ${
                              p === page
                                ? "bg-gold-600 border-gold-500 text-obsidian-900 font-bold"
                                : "border-gold-800/30 text-gold-400 hover:bg-obsidian-700/60"
                            }`}
                            data-ocid={`portal.page_${p}`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-sans border border-gold-800/30 text-gold-400 hover:bg-obsidian-700/60 disabled:opacity-40 rounded-sm"
                      data-ocid="portal.pagination_next"
                    >
                      Next <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Expert CTA */}
            <div className="mt-12 p-6 bg-obsidian-800/60 border border-gold-800/30 rounded-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-gold-200 mb-1">
                  Need Expert Guidance?
                </h3>
                <p className="font-sans text-sm text-obsidian-200">
                  Our property consultants are available to help you find the
                  perfect match.
                </p>
              </div>
              <a
                href="tel:+919512609016"
                className="flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-widest uppercase rounded-sm transition-all shadow-gold"
                data-ocid="portal.expert_cta_button"
              >
                <Phone size={16} /> +91 9512609016
              </a>
            </div>
          </>
        )}
      </div>

      {/* Compare bar */}
      <CompareBar
        compareList={compareList}
        allProperties={allProperties}
        onClear={() => setCompareList([])}
        onCompare={() => setCompareModalOpen(true)}
      />

      {/* Contact More — sticky */}
      <button
        type="button"
        onClick={() => setContactMoreOpen(true)}
        className="fixed bottom-[4.5rem] right-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-obsidian-800 border border-gold-600/60 text-gold-300 font-sans text-xs font-semibold rounded-sm shadow-gold hover:bg-obsidian-700 hover:text-gold-200 transition-all"
        data-ocid="portal.contact_more_button"
      >
        <MessageSquare size={13} /> Contact for More ▼
      </button>

      {/* Modals */}
      {detailProperty && (
        <DetailPanel
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onEnquire={(p) => {
            setDetailProperty(null);
            setEnquiryProperty(p);
          }}
          onScheduleVisit={(p) => {
            setDetailProperty(null);
            setVisitProperty(p);
          }}
        />
      )}
      {enquiryProperty && (
        <EnquiryModal
          property={enquiryProperty}
          onClose={() => setEnquiryProperty(null)}
        />
      )}
      {visitProperty && (
        <VisitModal
          property={visitProperty}
          onClose={() => setVisitProperty(null)}
        />
      )}
      {alertOpen && <AlertModal onClose={() => setAlertOpen(false)} />}
      {compareModalOpen && (
        <CompareModal
          properties={compareProperties}
          onClose={() => setCompareModalOpen(false)}
        />
      )}
      {contactMoreOpen && (
        <ContactMoreModal
          onClose={() => setContactMoreOpen(false)}
          onSuccess={() => setContactMoreOpen(false)}
          submitFn={handleContactMoreSubmit}
        />
      )}
    </>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export default function PropertyPortalPage() {
  const navigate = useNavigate();
  return (
    <PrivacyGate>
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />
        <div className="pt-16">
          {/* Page header */}
          <div className="bg-obsidian-800/80 border-b border-gold-800/30 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/services/purchase-rent" })}
                    className="flex items-center gap-1.5 text-gold-500 hover:text-gold-400 text-xs font-sans transition-colors"
                    data-ocid="portal.back_button"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <span className="text-obsidian-600">/</span>
                  <span className="text-xs font-sans text-obsidian-400">
                    Properties
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-gold-500" />
                  <h1 className="font-serif text-2xl font-bold gold-text">
                    Property Portal
                  </h1>
                  <span className="hidden sm:inline-block text-xs font-sans text-obsidian-400 border border-gold-800/30 px-2 py-0.5 rounded">
                    Ahmedabad &amp; Gujarat
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home size={14} className="text-gold-600" />
                <span className="text-xs font-sans text-obsidian-300 hidden sm:block">
                  MSTC GLOBAL Property Services
                </span>
              </div>
            </div>
          </div>

          <PropertyPortal />
        </div>
        <Footer />
      </div>
    </PrivacyGate>
  );
}
