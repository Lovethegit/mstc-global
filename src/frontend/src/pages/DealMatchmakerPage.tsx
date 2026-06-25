import type { PropertyListing as BackendListing } from "@/backend";
import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import {
  useProperties,
  useSubmitPropertyEnquiry,
} from "@/hooks/usePropertyQueries";
import type { PropertyListing } from "@/types/property";
import {
  AHMEDABAD_LOCATIONS,
  BHK_OPTIONS,
  BUY_BUDGET_RANGES,
  FURNISHING_OPTIONS,
  GUJARAT_CITIES,
  POSSESSION_OPTIONS,
  RENT_BUDGET_RANGES,
  formatINR,
} from "@/types/property";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Intent = "Buy" | "Rent" | "Invest";
type Step = 1 | 2 | 3 | 4;

interface Preferences {
  intent: Intent;
  budgetRange: string;
  bhk: string;
  location: string;
  propertyType: string;
  furnishing: string;
  possession: string;
}

const DEFAULT_PREFS: Preferences = {
  intent: "Buy",
  budgetRange: "",
  bhk: "",
  location: "",
  propertyType: "",
  furnishing: "",
  possession: "",
};

const PROPERTY_TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Plot",
  "Industrial",
  "Any",
];

const MSTC_SERVICES = [
  {
    slug: "/services/purchase-rent",
    label: "Buy / Rent / Redevelop",
    hint: "Purchase, rent or redevelop property with MSTC",
    forIntent: ["Buy", "Rent"] as Intent[],
  },
  {
    slug: "/services/rera-consulting",
    label: "RERA Consulting",
    hint: "RERA registration, compliance & legal guidance",
    forIntent: ["Buy", "Invest"] as Intent[],
  },
  {
    slug: "/services/finance",
    label: "Finance & Investment",
    hint: "Home loans, investment advisory, ROI analysis",
    forIntent: ["Invest", "Buy"] as Intent[],
  },
  {
    slug: "/services/infrastructure",
    label: "Infrastructure & Property",
    hint: "New construction, commercial & industrial spaces",
    forIntent: ["Invest", "Buy"] as Intent[],
  },
];

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

function scoreProperty(p: PropertyListing, prefs: Preferences): number {
  let score = 0;

  // Action match
  const intentAction = prefs.intent === "Rent" ? "Rent" : "Buy";
  if (p.action === intentAction) score += 30;
  else if (
    prefs.intent === "Invest" &&
    (p.action === "Buy" || p.action === "Lease")
  )
    score += 20;

  // Location match
  if (
    prefs.location &&
    (p.location === prefs.location || p.city === prefs.location)
  )
    score += 25;

  // Budget match
  if (prefs.budgetRange) {
    const ranges =
      prefs.intent === "Rent" ? RENT_BUDGET_RANGES : BUY_BUDGET_RANGES;
    const range = ranges.find((r) => r.label === prefs.budgetRange);
    if (range) {
      const price = Number(p.price);
      if (price >= range.min && price <= range.max) score += 25;
      else if (price < range.min * 1.2 && price > range.min * 0.8) score += 10;
    }
  }

  // BHK match
  if (prefs.bhk && p.bhk === prefs.bhk) score += 15;

  // Property type match
  if (
    prefs.propertyType &&
    prefs.propertyType !== "Any" &&
    p.propertyType === prefs.propertyType
  )
    score += 10;

  // Furnishing match
  if (
    prefs.furnishing &&
    prefs.furnishing !== "Any" &&
    p.furnishing === prefs.furnishing
  )
    score += 5;

  // Possession match
  if (
    prefs.possession &&
    prefs.possession !== "Any" &&
    p.possession === prefs.possession
  )
    score += 5;

  return score;
}

interface MatchedProperty extends PropertyListing {
  matchScore: number;
  relaxed: boolean;
}

function computeMatches(
  properties: PropertyListing[],
  prefs: Preferences,
): MatchedProperty[] {
  const scored = properties
    .map((p) => ({ ...p, matchScore: scoreProperty(p, prefs), relaxed: false }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const strict = scored.filter((p) => p.matchScore >= 40);
  if (strict.length >= 3) return strict.slice(0, 5);

  // Relaxed: top results regardless of score
  return scored.slice(0, 5).map((p) => ({ ...p, relaxed: true }));
}

// ─── Step 1: Intent ────────────────────────────────────────────────────────────
function IntentStep({
  prefs,
  setPrefs,
  onNext,
}: {
  prefs: Preferences;
  setPrefs: (p: Preferences) => void;
  onNext: () => void;
}) {
  const options: { value: Intent; label: string; desc: string }[] = [
    {
      value: "Buy",
      label: "🏠 Buy",
      desc: "Purchase a residential or commercial property",
    },
    {
      value: "Rent",
      label: "🔑 Rent",
      desc: "Find a rental home, office, or commercial space",
    },
    {
      value: "Invest",
      label: "📈 Invest",
      desc: "Property investment for returns & capital growth",
    },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif font-bold text-2xl gold-text mb-1">
          What are you looking for?
        </h2>
        <p className="text-sm font-sans text-obsidian-300">
          Tell us your intent and we'll match you with the best properties and
          MSTC services.
        </p>
      </div>
      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setPrefs({ ...prefs, intent: o.value })}
            className={`w-full p-4 text-left border rounded-sm transition-all ${
              prefs.intent === o.value
                ? "border-gold-500 bg-gold-900/20"
                : "border-gold-800/30 bg-obsidian-800/40 hover:border-gold-700/50"
            }`}
            data-ocid={`matchmaker.intent_${o.value.toLowerCase()}_button`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-sm text-gold-200">
                  {o.label}
                </p>
                <p className="text-xs font-sans text-obsidian-300 mt-0.5">
                  {o.desc}
                </p>
              </div>
              {prefs.intent === o.value && (
                <CheckCircle2
                  size={18}
                  className="text-gold-400 flex-shrink-0"
                />
              )}
            </div>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-bold text-sm tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2"
        data-ocid="matchmaker.step1_next_button"
      >
        Continue <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ─── Step 2: Preferences ───────────────────────────────────────────────────────
function PreferencesStep({
  prefs,
  setPrefs,
  onNext,
  onBack,
}: {
  prefs: Preferences;
  setPrefs: (p: Preferences) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const budgetRanges =
    prefs.intent === "Rent" ? RENT_BUDGET_RANGES : BUY_BUDGET_RANGES;
  const sel =
    (k: keyof Preferences) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setPrefs({ ...prefs, [k]: e.target.value });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif font-bold text-2xl gold-text mb-1">
          Your Property Preferences
        </h2>
        <p className="text-sm font-sans text-obsidian-300">
          Help us understand exactly what you need.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            Budget Range
          </label>
          <select
            value={prefs.budgetRange}
            onChange={sel("budgetRange")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.budget_select"
          >
            <option value="">Any Budget</option>
            {budgetRanges
              .filter((r) => r.label !== "Any")
              .map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            BHK / Config
          </label>
          <select
            value={prefs.bhk}
            onChange={sel("bhk")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.bhk_select"
          >
            <option value="">Any BHK</option>
            {BHK_OPTIONS.filter((b) => b !== "Any").map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            Possession
          </label>
          <select
            value={prefs.possession}
            onChange={sel("possession")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.possession_select"
          >
            {POSSESSION_OPTIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            Preferred Location
          </label>
          <select
            value={prefs.location}
            onChange={sel("location")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.location_select"
          >
            <option value="">Any Location</option>
            {[...AHMEDABAD_LOCATIONS, ...GUJARAT_CITIES].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            Property Type
          </label>
          <select
            value={prefs.propertyType}
            onChange={sel("propertyType")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.property_type_select"
          >
            {PROPERTY_TYPE_OPTIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-gold-400 mb-1">
            Furnishing
          </label>
          <select
            value={prefs.furnishing}
            onChange={sel("furnishing")}
            className="w-full tool-field-input"
            data-ocid="matchmaker.furnishing_select"
          >
            {FURNISHING_OPTIONS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 font-sans font-medium text-sm rounded-sm hover:bg-obsidian-700 flex items-center justify-center gap-1"
          data-ocid="matchmaker.step2_back_button"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-2.5 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-bold text-sm tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2"
          data-ocid="matchmaker.find_match_button"
        >
          Find My Best Match <Sparkles size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Match Card ────────────────────────────────────────────────────────────────
function MatchCard({
  property,
  rank,
  relaxed,
}: {
  property: MatchedProperty;
  rank: number;
  relaxed: boolean;
}) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const submitEnquiry = useSubmitPropertyEnquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    indemnity: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.indemnity) errs.indemnity = "Required";
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
        customerMessage: `Match #${rank} from Deal Matchmaker`,
        preferredTime: "",
        visitDate: "",
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Failed. Please try again." });
    }
  };

  return (
    <div
      className={`bg-obsidian-800/60 border rounded-sm overflow-hidden transition-all ${
        rank === 1
          ? "border-gold-500/60"
          : "border-gold-800/30 hover:border-gold-700/40"
      }`}
      data-ocid={`matchmaker.result.item.${rank}`}
    >
      {rank === 1 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gold-600/20 border-b border-gold-500/30">
          <Star size={12} className="text-gold-400 fill-gold-400" />
          <span className="text-xs font-sans font-bold text-gold-400 uppercase tracking-widest">
            Best Match
          </span>
        </div>
      )}
      {relaxed && rank === 1 && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-obsidian-700/50 border-b border-gold-800/20">
          <span className="text-[10px] font-sans text-obsidian-400">
            No exact match found — showing closest available properties
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-serif text-sm font-semibold text-gold-200 leading-snug line-clamp-2">
            {property.title}
          </h4>
          <span className="flex-shrink-0 text-xs font-sans font-bold text-gold-400 bg-gold-900/20 border border-gold-800/30 rounded px-2 py-0.5">
            #{rank}
          </span>
        </div>
        <p className="font-serif text-base font-bold text-gold-400 mb-2">
          {property.priceDisplay || formatINR(Number(property.price))}
        </p>
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-2 text-xs font-sans">
          {property.bhk && (
            <div>
              <span className="text-obsidian-400">BHK: </span>
              <span className="text-obsidian-100">{property.bhk}</span>
            </div>
          )}
          {property.sqft > 0n && (
            <div>
              <span className="text-obsidian-400">Area: </span>
              <span className="text-obsidian-100">
                {Number(property.sqft).toLocaleString()} sqft
              </span>
            </div>
          )}
          {property.furnishing && (
            <div>
              <span className="text-obsidian-400">Furn: </span>
              <span className="text-obsidian-100">{property.furnishing}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs font-sans text-obsidian-300 mb-3">
          <MapPin size={10} className="text-gold-600 flex-shrink-0" />
          {property.location}
          {property.city && property.city !== property.location
            ? `, ${property.city}`
            : ""}
        </div>
        {!enquiryOpen && !submitted && (
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="w-full py-2 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-xs tracking-wider uppercase rounded-sm transition-all"
            data-ocid={`matchmaker.contact_button.${rank}`}
          >
            Contact MSTC About This
          </button>
        )}
        {enquiryOpen && !submitted && (
          <form
            onSubmit={handleSubmit}
            className="mt-2 space-y-2 border-t border-gold-800/20 pt-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Name *"
                  className="w-full tool-field-input text-xs py-1.5"
                  data-ocid={`matchmaker.name_input.${rank}`}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-400">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Phone *"
                  className="w-full tool-field-input text-xs py-1.5"
                  data-ocid={`matchmaker.phone_input.${rank}`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-400">{errors.phone}</p>
                )}
              </div>
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="Email"
              className="w-full tool-field-input text-xs py-1.5"
              data-ocid={`matchmaker.email_input.${rank}`}
            />
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.indemnity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, indemnity: e.target.checked }))
                }
                className="mt-0.5 accent-gold-500"
                data-ocid={`matchmaker.indemnity_checkbox.${rank}`}
              />
              <span className="text-[10px] font-sans text-obsidian-300">
                I agree MSTC Global is a facilitator. Terms apply.{" "}
                <span className="text-red-400">*</span>
              </span>
            </label>
            {errors.indemnity && (
              <p className="text-[10px] text-red-400">{errors.indemnity}</p>
            )}
            {errors.submit && (
              <p
                className="text-[10px] text-red-400"
                data-ocid={`matchmaker.error_state.${rank}`}
              >
                {errors.submit}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEnquiryOpen(false)}
                className="flex-1 py-1.5 text-xs font-sans border border-gold-700/40 text-gold-400 rounded-sm"
                data-ocid={`matchmaker.cancel_button.${rank}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitEnquiry.isPending}
                className="flex-1 py-1.5 text-xs font-sans bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-semibold rounded-sm flex items-center justify-center gap-1"
                data-ocid={`matchmaker.submit_button.${rank}`}
              >
                {submitEnquiry.isPending ? (
                  <span className="w-3 h-3 border border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={11} /> Send
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        {submitted && (
          <div
            className="mt-2 border-t border-gold-800/20 pt-3 text-center"
            data-ocid={`matchmaker.success_state.${rank}`}
          >
            <CheckCircle2 size={20} className="text-gold-400 mx-auto mb-1" />
            <p className="text-xs font-sans text-gold-300">
              Submitted! Our team will contact you.
            </p>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 px-4 py-1.5 bg-gold-600 text-obsidian-900 font-sans font-semibold text-xs rounded-sm hover:bg-gold-500 transition-all"
            >
              <Phone size={11} /> WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3/4: Loading + Results ──────────────────────────────────────────────
function ResultsStep({
  prefs,
  onReset,
  onBack,
}: {
  prefs: Preferences;
  onReset: () => void;
  onBack: () => void;
}) {
  const navigate = useNavigate();

  const { data: rawData = [], isLoading } = useProperties({
    propertyType: "",
    action: "",
    location: "",
    bhk: "",
    furnishing: "",
    minPrice: BigInt(0),
    maxPrice: BigInt(999999999999),
  });

  const allProperties = useMemo(() => rawData.map(mapListing), [rawData]);

  const matches = useMemo(() => {
    if (allProperties.length === 0) return [];
    return computeMatches(allProperties, prefs);
  }, [allProperties, prefs]);

  const relevantServices = useMemo(
    () => MSTC_SERVICES.filter((s) => s.forIntent.includes(prefs.intent)),
    [prefs.intent],
  );

  const isRelaxed = matches.length > 0 && matches[0].relaxed;

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-gold-400" />
            <h2 className="font-serif font-bold text-2xl gold-text">
              Your Best Matches
            </h2>
          </div>
          <p className="text-xs font-sans text-obsidian-300">
            Intent: <span className="text-gold-400">{prefs.intent}</span>
            {prefs.location && (
              <>
                {" "}
                · <span className="text-gold-400">{prefs.location}</span>
              </>
            )}
            {prefs.budgetRange && (
              <>
                {" "}
                · <span className="text-gold-400">{prefs.budgetRange}</span>
              </>
            )}
            {prefs.bhk && (
              <>
                {" "}
                · <span className="text-gold-400">{prefs.bhk}</span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-sans text-obsidian-400 hover:text-gold-400 transition-colors flex-shrink-0"
          data-ocid="matchmaker.results_back_button"
        >
          <ArrowLeft size={12} /> Edit
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="matchmaker.loading_state">
          <div className="flex items-center gap-2 text-sm font-sans text-obsidian-300">
            <span className="w-4 h-4 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin" />
            Searching {allProperties.length > 0 ? allProperties.length : ""}{" "}
            properties for your best match…
          </div>
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-32 bg-obsidian-800/60 border border-gold-800/20 rounded-sm animate-pulse"
            />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div
          className="text-center py-12 bg-obsidian-800/40 border border-gold-800/20 rounded-sm"
          data-ocid="matchmaker.empty_state"
        >
          <Building2
            size={40}
            className="text-gold-700 mx-auto mb-3 opacity-40"
          />
          <h3 className="font-serif text-base text-gold-400 mb-2">
            No Properties Found
          </h3>
          <p className="font-sans text-xs text-obsidian-300 mb-4">
            Our portal is growing. Contact us and we'll personally find your
            ideal property.
          </p>
          <a
            href="https://wa.me/919512609016"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-600 text-obsidian-900 font-sans font-semibold text-sm rounded-sm hover:bg-gold-500 transition-all"
          >
            <Phone size={14} /> WhatsApp MSTC
          </a>
        </div>
      ) : (
        <>
          {isRelaxed && (
            <div className="px-3 py-2 bg-obsidian-700/40 border border-gold-800/20 rounded-sm text-xs font-sans text-obsidian-300">
              No exact match found — showing {matches.length} closest properties
              based on your preferences.
            </div>
          )}
          <div className="space-y-3">
            {matches.map((m, i) => (
              <MatchCard
                key={m.id}
                property={m}
                rank={i + 1}
                relaxed={m.relaxed}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/property-portal" })}
            className="w-full py-2.5 border border-gold-700/40 text-gold-400 font-sans font-medium text-sm rounded-sm hover:bg-obsidian-700/40 transition-all flex items-center justify-center gap-2"
            data-ocid="matchmaker.view_portal_button"
          >
            Browse All Properties <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Relevant MSTC Services */}
      <div className="border-t border-gold-800/20 pt-5">
        <h3 className="font-serif text-base text-gold-300 mb-3">
          Recommended MSTC Services for You
        </h3>
        <div className="space-y-2">
          {relevantServices.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => navigate({ to: s.slug as never })}
              className="w-full flex items-center justify-between p-3 border border-gold-800/30 bg-obsidian-800/40 hover:border-gold-600/50 rounded-sm transition-all text-left"
              data-ocid={`matchmaker.service_button.${s.label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
            >
              <div>
                <div className="font-sans font-semibold text-xs text-gold-200">
                  {s.label}
                </div>
                <div className="text-[10px] font-sans text-obsidian-400 mt-0.5">
                  {s.hint}
                </div>
              </div>
              <ArrowRight size={13} className="text-gold-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-xs font-sans text-obsidian-400 hover:text-gold-400 transition-colors"
        data-ocid="matchmaker.reset_button"
      >
        Start over
      </button>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  const labels = ["Intent", "Preferences", "Results"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold font-sans transition-all ${
                i + 1 < step
                  ? "bg-gold-600 border-gold-500 text-obsidian-900"
                  : i + 1 === step
                    ? "bg-gold-900/40 border-gold-500 text-gold-400"
                    : "bg-obsidian-700/40 border-gold-800/30 text-obsidian-500"
              }`}
            >
              {i + 1 < step ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-sans whitespace-nowrap ${
                i + 1 === step ? "text-gold-400" : "text-obsidian-500"
              }`}
            >
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div
              className={`flex-1 h-px mt-[-1rem] ${
                i + 1 < step ? "bg-gold-600" : "bg-obsidian-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function DealMatchmakerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);

  const handleReset = () => {
    setStep(1);
    setPrefs(DEFAULT_PREFS);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />

        {/* Hero */}
        <section className="pt-20 pb-6 px-4 bg-obsidian-800/80 border-b border-gold-800/30">
          <div className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 text-sm font-sans text-obsidian-400 hover:text-gold-400 transition-colors mb-4"
              data-ocid="matchmaker.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles size={22} className="text-gold-500" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                AI Deal Matchmaker
              </h1>
            </div>
            <p className="font-sans text-sm text-obsidian-300">
              Answer a few questions — we'll match you with the best available
              properties and MSTC services instantly.
            </p>
          </div>
        </section>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <ProgressBar step={step} />

          {step === 1 && (
            <IntentStep
              prefs={prefs}
              setPrefs={setPrefs}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PreferencesStep
              prefs={prefs}
              setPrefs={setPrefs}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <ResultsStep
              prefs={prefs}
              onReset={handleReset}
              onBack={() => setStep(2)}
            />
          )}
        </main>

        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
