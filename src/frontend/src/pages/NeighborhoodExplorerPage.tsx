import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Heart,
  MapPin,
  School,
  Search,
  ShoppingBag,
  Star,
  Train,
  TreePine,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Neighborhood {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  connectivity: number;
  schools: number;
  hospitals: number;
  markets: number;
  greenery: number;
  safety: number;
  avgBuyPrice: string;
  avgRentPrice: string;
  pricePerSqft: string;
  trending: "up" | "stable" | "down";
  trendPct: string;
  description: string;
  highlights: string[];
}

const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: "satellite",
    name: "Satellite",
    tag: "Premium",
    tagColor: "text-gold-400 bg-gold-900/20 border-gold-700/40",
    connectivity: 9,
    schools: 9,
    hospitals: 8,
    markets: 9,
    greenery: 7,
    safety: 9,
    avgBuyPrice: "₹85L–2.5Cr",
    avgRentPrice: "₹18K–55K/mo",
    pricePerSqft: "₹7,500–12,000",
    trending: "up",
    trendPct: "+8.2%",
    description:
      "Ahmedabad's most prestigious residential corridor. Premium schools, luxury malls, and excellent metro connectivity.",
    highlights: [
      "Metro Station",
      "Premium Schools",
      "5-Star Hotels",
      "Major Hospitals",
    ],
  },
  {
    id: "bopal",
    name: "Bopal",
    tag: "Family Favourite",
    tagColor: "text-emerald-400 bg-emerald-900/20 border-emerald-700/40",
    connectivity: 7,
    schools: 9,
    hospitals: 7,
    markets: 8,
    greenery: 8,
    safety: 8,
    avgBuyPrice: "₹55L–1.5Cr",
    avgRentPrice: "₹12K–35K/mo",
    pricePerSqft: "₹5,500–8,000",
    trending: "up",
    trendPct: "+6.5%",
    description:
      "Rapidly developing suburb with top-ranked schools, quiet residential lanes, and lush green parks.",
    highlights: [
      "Top Schools",
      "Parks & Gardens",
      "Quiet Lanes",
      "Growing Infrastructure",
    ],
  },
  {
    id: "sg-highway",
    name: "SG Highway",
    tag: "IT & Commerce",
    tagColor: "text-blue-400 bg-blue-900/20 border-blue-700/40",
    connectivity: 10,
    schools: 7,
    hospitals: 8,
    markets: 10,
    greenery: 6,
    safety: 8,
    avgBuyPrice: "₹70L–3Cr",
    avgRentPrice: "₹15K–60K/mo",
    pricePerSqft: "₹6,500–14,000",
    trending: "up",
    trendPct: "+9.1%",
    description:
      "Prime commercial corridor for IT companies, retail mega-hubs, and luxury residential developments.",
    highlights: [
      "IT Companies",
      "Luxury Malls",
      "Metro Access",
      "Premium Offices",
    ],
  },
  {
    id: "navrangpura",
    name: "Navrangpura",
    tag: "Central",
    tagColor: "text-purple-400 bg-purple-900/20 border-purple-700/40",
    connectivity: 10,
    schools: 8,
    hospitals: 9,
    markets: 9,
    greenery: 6,
    safety: 8,
    avgBuyPrice: "₹80L–2Cr",
    avgRentPrice: "₹20K–50K/mo",
    pricePerSqft: "₹7,000–11,000",
    trending: "stable",
    trendPct: "+2.1%",
    description:
      "Heart of Ahmedabad. Walking distance to hospitals, metro stations, and key commercial centres.",
    highlights: [
      "Metro Hub",
      "Central Location",
      "Major Hospitals",
      "Commercial Centre",
    ],
  },
  {
    id: "thaltej",
    name: "Thaltej",
    tag: "Upcoming",
    tagColor: "text-cyan-400 bg-cyan-900/20 border-cyan-700/40",
    connectivity: 8,
    schools: 8,
    hospitals: 7,
    markets: 8,
    greenery: 7,
    safety: 8,
    avgBuyPrice: "₹60L–1.8Cr",
    avgRentPrice: "₹13K–40K/mo",
    pricePerSqft: "₹5,800–9,500",
    trending: "up",
    trendPct: "+7.4%",
    description:
      "Fast-growing locality along the Ahmedabad Metro line with rapidly appreciating property values.",
    highlights: [
      "Metro Station",
      "New Developments",
      "Good Schools",
      "Rising Values",
    ],
  },
  {
    id: "maninagar",
    name: "Maninagar",
    tag: "Affordable",
    tagColor: "text-amber-400 bg-amber-900/20 border-amber-700/40",
    connectivity: 9,
    schools: 7,
    hospitals: 8,
    markets: 9,
    greenery: 5,
    safety: 7,
    avgBuyPrice: "₹30L–80L",
    avgRentPrice: "₹7K–20K/mo",
    pricePerSqft: "₹3,200–5,500",
    trending: "stable",
    trendPct: "+3.2%",
    description:
      "Well-connected affordable locality near the railway station and major commercial markets.",
    highlights: [
      "Railway Station",
      "Affordable Prices",
      "Local Markets",
      "Good Connectivity",
    ],
  },
  {
    id: "prahlad-nagar",
    name: "Prahlad Nagar",
    tag: "Elite",
    tagColor: "text-gold-400 bg-gold-900/30 border-gold-600/50",
    connectivity: 9,
    schools: 9,
    hospitals: 9,
    markets: 9,
    greenery: 8,
    safety: 10,
    avgBuyPrice: "₹90L–4Cr",
    avgRentPrice: "₹22K–70K/mo",
    pricePerSqft: "₹8,000–16,000",
    trending: "up",
    trendPct: "+10.3%",
    description:
      "The most prestigious address in Ahmedabad. Home to corporate headquarters, luxury villas, and 5-star amenities.",
    highlights: [
      "Corporate Hub",
      "Luxury Villas",
      "Top Hospitals",
      "5-Star Dining",
    ],
  },
  {
    id: "gota",
    name: "Gota",
    tag: "Budget Friendly",
    tagColor: "text-emerald-400 bg-emerald-900/20 border-emerald-700/40",
    connectivity: 7,
    schools: 8,
    hospitals: 7,
    markets: 8,
    greenery: 8,
    safety: 7,
    avgBuyPrice: "₹30L–90L",
    avgRentPrice: "₹7K–22K/mo",
    pricePerSqft: "₹3,500–6,000",
    trending: "stable",
    trendPct: "+2.8%",
    description:
      "Growing locality with good schools, public parks, and affordable housing options for families.",
    highlights: [
      "Good Schools",
      "Public Parks",
      "Affordable",
      "Family Friendly",
    ],
  },
  {
    id: "chandkheda",
    name: "Chandkheda",
    tag: "Tech Hub",
    tagColor: "text-blue-400 bg-blue-900/20 border-blue-700/40",
    connectivity: 8,
    schools: 7,
    hospitals: 6,
    markets: 8,
    greenery: 7,
    safety: 7,
    avgBuyPrice: "₹35L–95L",
    avgRentPrice: "₹8K–24K/mo",
    pricePerSqft: "₹3,800–6,500",
    trending: "up",
    trendPct: "+5.6%",
    description:
      "Emerging IT and residential belt with good highway connectivity and growing social infrastructure.",
    highlights: [
      "IT Companies",
      "Highway Access",
      "New Apartments",
      "Growing Area",
    ],
  },
  {
    id: "vastral",
    name: "Vastral",
    tag: "Affordable",
    tagColor: "text-amber-400 bg-amber-900/20 border-amber-700/40",
    connectivity: 7,
    schools: 6,
    hospitals: 6,
    markets: 7,
    greenery: 6,
    safety: 7,
    avgBuyPrice: "₹20L–55L",
    avgRentPrice: "₹5K–15K/mo",
    pricePerSqft: "₹2,800–4,500",
    trending: "up",
    trendPct: "+4.2%",
    description:
      "Eastern Ahmedabad's affordable zone with metro connectivity and upcoming infrastructure projects.",
    highlights: [
      "Metro Access",
      "Very Affordable",
      "Eastern Location",
      "New Projects",
    ],
  },
  {
    id: "paldi",
    name: "Paldi",
    tag: "Classic",
    tagColor: "text-purple-400 bg-purple-900/20 border-purple-700/40",
    connectivity: 9,
    schools: 8,
    hospitals: 8,
    markets: 8,
    greenery: 7,
    safety: 8,
    avgBuyPrice: "₹55L–1.4Cr",
    avgRentPrice: "₹12K–30K/mo",
    pricePerSqft: "₹5,000–8,500",
    trending: "stable",
    trendPct: "+3.5%",
    description:
      "Classic established area with wide roads, good schools, and Ahmedabad's famous Ellisbridge neighbourhood.",
    highlights: [
      "Established Area",
      "Wide Roads",
      "River View",
      "Cultural Hub",
    ],
  },
  {
    id: "vastrapur",
    name: "Vastrapur",
    tag: "Lake View",
    tagColor: "text-cyan-400 bg-cyan-900/20 border-cyan-700/40",
    connectivity: 8,
    schools: 8,
    hospitals: 7,
    markets: 8,
    greenery: 9,
    safety: 9,
    avgBuyPrice: "₹70L–1.8Cr",
    avgRentPrice: "₹16K–45K/mo",
    pricePerSqft: "₹6,000–10,000",
    trending: "up",
    trendPct: "+6.8%",
    description:
      "Beautiful locality around Vastrapur Lake with scenic views, jogging tracks, and upscale residences.",
    highlights: [
      "Lake View",
      "Jogging Tracks",
      "Premium Residences",
      "Green Zone",
    ],
  },
  {
    id: "bodakdev",
    name: "Bodakdev",
    tag: "Upscale",
    tagColor: "text-gold-400 bg-gold-900/20 border-gold-700/40",
    connectivity: 8,
    schools: 9,
    hospitals: 8,
    markets: 8,
    greenery: 7,
    safety: 9,
    avgBuyPrice: "₹75L–2.2Cr",
    avgRentPrice: "₹18K–50K/mo",
    pricePerSqft: "₹6,800–11,500",
    trending: "up",
    trendPct: "+7.1%",
    description:
      "Upscale west Ahmedabad with premium schools, corporate offices, and well-planned residential streets.",
    highlights: [
      "Premium Schools",
      "Corporate Offices",
      "Wide Roads",
      "Well-Planned",
    ],
  },
  {
    id: "vejalpur",
    name: "Vejalpur",
    tag: "Mid-Range",
    tagColor: "text-amber-400 bg-amber-900/20 border-amber-700/40",
    connectivity: 7,
    schools: 7,
    hospitals: 7,
    markets: 8,
    greenery: 6,
    safety: 7,
    avgBuyPrice: "₹45L–1.1Cr",
    avgRentPrice: "₹10K–25K/mo",
    pricePerSqft: "₹4,200–7,000",
    trending: "stable",
    trendPct: "+2.9%",
    description:
      "Mid-range south Ahmedabad locality with good connectivity to major city roads and commercial areas.",
    highlights: [
      "Affordable Mid-Range",
      "Good Connectivity",
      "Commercial Access",
      "Growing Area",
    ],
  },
  {
    id: "sarkhej",
    name: "Sarkhej",
    tag: "Industrial Belt",
    tagColor: "text-obsidian-300 bg-obsidian-700/40 border-obsidian-600/40",
    connectivity: 8,
    schools: 6,
    hospitals: 6,
    markets: 7,
    greenery: 5,
    safety: 7,
    avgBuyPrice: "₹30L–75L",
    avgRentPrice: "₹6K–18K/mo",
    pricePerSqft: "₹3,000–5,200",
    trending: "stable",
    trendPct: "+1.8%",
    description:
      "Residential-cum-industrial zone with GSRTC connectivity and proximity to Sanand industrial corridor.",
    highlights: [
      "Industrial Access",
      "Highway Proximity",
      "Affordable",
      "GSRTC Hub",
    ],
  },
  {
    id: "shela",
    name: "Shela",
    tag: "Peaceful",
    tagColor: "text-emerald-400 bg-emerald-900/20 border-emerald-700/40",
    connectivity: 6,
    schools: 7,
    hospitals: 6,
    markets: 6,
    greenery: 9,
    safety: 8,
    avgBuyPrice: "₹40L–1.2Cr",
    avgRentPrice: "₹9K–28K/mo",
    pricePerSqft: "₹4,000–7,200",
    trending: "up",
    trendPct: "+5.3%",
    description:
      "Peaceful outskirt locality with open spaces, new townships, and proximity to Sanand belt for investors.",
    highlights: [
      "Open Spaces",
      "New Townships",
      "Peaceful Living",
      "Investment Zone",
    ],
  },
  {
    id: "motera",
    name: "Motera",
    tag: "Sports Hub",
    tagColor: "text-blue-400 bg-blue-900/20 border-blue-700/40",
    connectivity: 8,
    schools: 7,
    hospitals: 7,
    markets: 7,
    greenery: 7,
    safety: 8,
    avgBuyPrice: "₹45L–1.1Cr",
    avgRentPrice: "₹10K–26K/mo",
    pricePerSqft: "₹4,500–7,000",
    trending: "up",
    trendPct: "+5.8%",
    description:
      "Home to the world's largest cricket stadium. Growing infrastructure and upcoming development projects.",
    highlights: [
      "World's Largest Stadium",
      "River Proximity",
      "New Projects",
      "Sport Tourism",
    ],
  },
  {
    id: "naranpura",
    name: "Naranpura",
    tag: "Commercial",
    tagColor: "text-blue-400 bg-blue-900/20 border-blue-700/40",
    connectivity: 9,
    schools: 8,
    hospitals: 8,
    markets: 9,
    greenery: 6,
    safety: 8,
    avgBuyPrice: "₹60L–1.5Cr",
    avgRentPrice: "₹14K–38K/mo",
    pricePerSqft: "₹5,500–9,000",
    trending: "stable",
    trendPct: "+3.4%",
    description:
      "Well-established commercial and residential area with excellent connectivity to central Ahmedabad.",
    highlights: [
      "Commercial Hub",
      "Metro Access",
      "Good Schools",
      "Central Location",
    ],
  },
  {
    id: "ambawadi",
    name: "Ambawadi",
    tag: "Education Hub",
    tagColor: "text-purple-400 bg-purple-900/20 border-purple-700/40",
    connectivity: 8,
    schools: 10,
    hospitals: 8,
    markets: 8,
    greenery: 7,
    safety: 8,
    avgBuyPrice: "₹65L–1.6Cr",
    avgRentPrice: "₹15K–40K/mo",
    pricePerSqft: "₹5,800–9,500",
    trending: "stable",
    trendPct: "+2.7%",
    description:
      "Educational heart of Ahmedabad with top universities, coaching institutes, and family-friendly infrastructure.",
    highlights: [
      "Top Universities",
      "Coaching Institutes",
      "Family Friendly",
      "Cultural Events",
    ],
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar",
    tag: "Capital City",
    tagColor: "text-gold-400 bg-gold-900/20 border-gold-700/40",
    connectivity: 9,
    schools: 8,
    hospitals: 8,
    markets: 7,
    greenery: 10,
    safety: 9,
    avgBuyPrice: "₹35L–1.2Cr",
    avgRentPrice: "₹8K–28K/mo",
    pricePerSqft: "₹3,500–7,000",
    trending: "up",
    trendPct: "+6.9%",
    description:
      "Gujarat's planned capital with GIFT City, greenest city in India, and growing IT & BFSI sectors.",
    highlights: [
      "GIFT City",
      "Government Hub",
      "Green City",
      "IT & BFSI Sector",
    ],
  },
];

const TAG_FILTER_OPTIONS = [
  "All",
  "Premium",
  "Affordable",
  "Family Favourite",
  "IT & Commerce",
  "Upcoming",
  "Elite",
];

function ScoreBar({
  label,
  icon,
  value,
}: { label: string; icon: React.ReactNode; value: number }) {
  const color =
    value >= 9
      ? "bg-gold-500"
      : value >= 7
        ? "bg-emerald-500"
        : value >= 5
          ? "bg-amber-500"
          : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 text-gold-500 flex-shrink-0">{icon}</span>
      <span className="text-xs font-sans text-obsidian-300 w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-obsidian-700/50 rounded-full h-1.5">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gold-200 w-5 text-right">
        {value}
      </span>
    </div>
  );
}

function NeighborhoodDetail({
  n,
  onClose,
  onViewProperties,
}: {
  n: Neighborhood;
  onClose: () => void;
  onViewProperties: (name: string) => void;
}) {
  const avgScore =
    Math.round(
      ((n.connectivity +
        n.schools +
        n.hospitals +
        n.markets +
        n.greenery +
        n.safety) /
        6) *
        10,
    ) / 10;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="neighborhood.detail_dialog"
    >
      <div
        className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md bg-obsidian-800 border border-gold-800/40 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-800/30">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-gold-200">
                {n.name}
              </h2>
              <span
                className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded border ${n.tagColor}`}
              >
                {n.tag}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star size={11} className="text-gold-400 fill-gold-400" />
                <span className="text-xs font-semibold text-gold-400">
                  {avgScore}/10 overall
                </span>
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  n.trending === "up"
                    ? "text-emerald-400"
                    : n.trending === "down"
                      ? "text-red-400"
                      : "text-obsidian-300"
                }`}
              >
                {n.trending === "up" ? (
                  <TrendingUp size={11} />
                ) : n.trending === "down" ? (
                  <TrendingDown size={11} />
                ) : null}
                {n.trendPct} this year
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-obsidian-700 rounded-sm"
            data-ocid="neighborhood.close_button"
          >
            <X size={18} className="text-gold-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <p className="font-sans text-sm text-obsidian-200 leading-relaxed">
            {n.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {n.highlights.map((h) => (
              <span
                key={h}
                className="px-2 py-0.5 text-[10px] font-sans bg-obsidian-700/60 border border-gold-800/30 text-obsidian-200 rounded"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Score bars */}
          <div>
            <h4 className="text-xs font-sans font-semibold text-gold-400 uppercase tracking-widest mb-3">
              Locality Scores
            </h4>
            <div className="space-y-2.5">
              <ScoreBar
                label="Connectivity"
                icon={<Train size={12} />}
                value={n.connectivity}
              />
              <ScoreBar
                label="Schools"
                icon={<School size={12} />}
                value={n.schools}
              />
              <ScoreBar
                label="Hospitals"
                icon={<Building size={12} />}
                value={n.hospitals}
              />
              <ScoreBar
                label="Markets"
                icon={<ShoppingBag size={12} />}
                value={n.markets}
              />
              <ScoreBar
                label="Greenery"
                icon={<TreePine size={12} />}
                value={n.greenery}
              />
              <ScoreBar
                label="Safety"
                icon={<Heart size={12} />}
                value={n.safety}
              />
            </div>
          </div>

          {/* Price info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-obsidian-700/40 rounded p-2">
              <p className="text-[10px] font-sans text-obsidian-400 mb-0.5">
                Buy Range
              </p>
              <p className="text-xs font-sans font-semibold text-gold-200">
                {n.avgBuyPrice}
              </p>
            </div>
            <div className="bg-obsidian-700/40 rounded p-2">
              <p className="text-[10px] font-sans text-obsidian-400 mb-0.5">
                Monthly Rent
              </p>
              <p className="text-xs font-sans font-semibold text-gold-200">
                {n.avgRentPrice}
              </p>
            </div>
            <div className="bg-obsidian-700/40 rounded p-2">
              <p className="text-[10px] font-sans text-obsidian-400 mb-0.5">
                Per Sq.ft
              </p>
              <p className="text-xs font-sans font-semibold text-gold-200">
                {n.pricePerSqft}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onViewProperties(n.name)}
              className="flex-1 py-2.5 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-2"
              data-ocid="neighborhood.view_properties_button"
            >
              View Properties <ArrowRight size={13} />
            </button>
            <a
              href="https://wa.me/919512609016"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 hover:bg-obsidian-700 font-sans font-medium text-sm rounded-sm transition-all text-center"
              data-ocid="neighborhood.whatsapp_button"
            >
              Ask MSTC
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeighborhoodCard({
  n,
  index,
  onClick,
}: { n: Neighborhood; index: number; onClick: () => void }) {
  const avgScore =
    Math.round(
      ((n.connectivity +
        n.schools +
        n.hospitals +
        n.markets +
        n.greenery +
        n.safety) /
        6) *
        10,
    ) / 10;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-obsidian-800/60 border border-gold-800/30 hover:border-gold-600/50 rounded-sm overflow-hidden transition-all duration-300 group"
      data-ocid={`neighborhood.card.${index + 1}`}
    >
      {/* Color accent bar */}
      <div
        className={`h-1 w-full ${
          n.trending === "up"
            ? "bg-emerald-500"
            : n.trending === "down"
              ? "bg-red-400"
              : "bg-obsidian-500"
        }`}
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif font-semibold text-sm text-gold-200 group-hover:text-gold-100">
              {n.name}
            </h3>
            <span
              className={`text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded border ${n.tagColor}`}
            >
              {n.tag}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold bg-gold-900/20 border border-gold-800/30 rounded px-2 py-1">
            <Star size={9} className="text-gold-400 fill-gold-400" />
            <span className="text-gold-400">{avgScore}</span>
          </div>
        </div>
        <p className="text-xs font-sans text-obsidian-300 leading-relaxed mb-3 line-clamp-2">
          {n.description}
        </p>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1 text-[10px] font-sans">
            <span className="text-obsidian-400 w-16">Buy:</span>
            <span className="text-obsidian-100 font-medium">
              {n.avgBuyPrice}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-sans">
            <span className="text-obsidian-400 w-16">Rent:</span>
            <span className="text-obsidian-100 font-medium">
              {n.avgRentPrice}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`flex items-center gap-0.5 text-[10px] font-semibold ${
              n.trending === "up"
                ? "text-emerald-400"
                : n.trending === "down"
                  ? "text-red-400"
                  : "text-obsidian-400"
            }`}
          >
            {n.trending === "up" ? (
              <TrendingUp size={10} />
            ) : n.trending === "down" ? (
              <TrendingDown size={10} />
            ) : null}
            {n.trendPct}
          </span>
          <span className="text-[10px] font-sans text-gold-500 group-hover:text-gold-400 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </button>
  );
}

export default function NeighborhoodExplorerPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Neighborhood | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");

  const filtered = useMemo(() => {
    let res = NEIGHBORHOODS;
    if (search.length >= 2) {
      const q = search.toLowerCase();
      res = res.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.tag.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q),
      );
    }
    if (tagFilter !== "All") res = res.filter((n) => n.tag === tagFilter);
    return res;
  }, [search, tagFilter]);

  const handleViewProperties = (localityName: string) => {
    setSelected(null);
    navigate({
      to: `/property-portal?location=${encodeURIComponent(localityName)}` as never,
    });
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />

        {/* Hero */}
        <section className="pt-20 pb-6 px-4 bg-obsidian-800/80 border-b border-gold-800/30">
          <div className="max-w-7xl mx-auto">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 text-sm font-sans text-obsidian-400 hover:text-gold-400 transition-colors mb-4"
              data-ocid="neighborhood.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <MapPin size={22} className="text-gold-500" />
                  <h1 className="font-serif font-bold text-3xl gold-text">
                    Neighborhood Explorer
                  </h1>
                </div>
                <p className="font-sans text-sm text-obsidian-300">
                  {NEIGHBORHOODS.length} Ahmedabad localities with detailed
                  scores — schools, hospitals, metro, markets &amp; safety.
                </p>
              </div>
              <div className="text-xs font-sans text-obsidian-400 bg-obsidian-700/40 border border-gold-800/20 rounded-sm px-3 py-1.5">
                Click any locality for full details + View Properties
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500"
              />
              <input
                type="text"
                placeholder="Search localities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full tool-field-input pl-8 text-sm"
                data-ocid="neighborhood.search_input"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TAG_FILTER_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1.5 text-xs font-sans rounded-sm border transition-all ${
                    tagFilter === tag
                      ? "bg-gold-600 border-gold-500 text-obsidian-900 font-semibold"
                      : "border-gold-800/30 text-gold-400 hover:border-gold-600/50"
                  }`}
                  data-ocid={`neighborhood.filter_${tag.toLowerCase().replace(/[^a-z0-9]/g, "_")}_button`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              className="text-center py-16"
              data-ocid="neighborhood.empty_state"
            >
              <MapPin
                size={40}
                className="text-gold-700 mx-auto mb-3 opacity-30"
              />
              <h3 className="font-serif text-lg text-gold-400 mb-2">
                No localities found
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTagFilter("All");
                }}
                className="text-sm font-sans text-gold-500 hover:text-gold-400"
                data-ocid="neighborhood.clear_search_button"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs font-sans text-obsidian-400 mb-4">
                Showing{" "}
                <span className="text-gold-400 font-semibold">
                  {filtered.length}
                </span>{" "}
                localities
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                data-ocid="neighborhood.list"
              >
                {filtered.map((n, i) => (
                  <NeighborhoodCard
                    key={n.id}
                    n={n}
                    index={i}
                    onClick={() => setSelected(n)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 p-6 bg-obsidian-800/60 border border-gold-800/30 rounded-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-serif text-lg text-gold-200 mb-1">
                Not Sure Which Locality?
              </h3>
              <p className="font-sans text-sm text-obsidian-200">
                Our property experts can personally guide you to the right
                neighborhood based on your budget and needs.
              </p>
            </div>
            <a
              href="tel:+919512609016"
              className="flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-500 text-obsidian-900 font-sans font-semibold text-sm tracking-widest uppercase rounded-sm transition-all"
              data-ocid="neighborhood.expert_cta_button"
            >
              <MapPin size={15} /> +91 9512609016
            </a>
          </div>
        </main>

        <Footer />
        <BackToTop />

        {selected && (
          <NeighborhoodDetail
            n={selected}
            onClose={() => setSelected(null)}
            onViewProperties={handleViewProperties}
          />
        )}
      </div>
    </PrivacyGate>
  );
}
