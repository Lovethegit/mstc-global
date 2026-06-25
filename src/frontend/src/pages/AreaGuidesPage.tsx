import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

type LocalityType = "Premium" | "Mid-Range" | "Affordable" | "Commercial";

interface Locality {
  slug: string;
  name: string;
  zone: string;
  type: LocalityType;
  avgPrice: string;
  pricePerSqft: string;
  metro: string;
  description: string;
  tags: string[];
}

const LOCALITIES: Locality[] = [
  {
    slug: "bopal",
    name: "Bopal",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹60–90L",
    pricePerSqft: "₹4,200–5,800",
    metro: "Nearby",
    description:
      "Bopal is a rapidly developing premium residential hub in West Ahmedabad. With wide roads, quality schools, and proximity to SG Highway, it attracts mid-to-high income families seeking modern living in a well-planned environment.",
    tags: ["Good Schools", "Wide Roads", "Green Cover"],
  },
  {
    slug: "sg-highway",
    name: "SG Highway",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹80L–1.5Cr",
    pricePerSqft: "₹5,500–8,000",
    metro: "Yes",
    description:
      "SG Highway (Sardar Patel Ring Road to Gandhinagar connector) is Ahmedabad's most prestigious commercial and residential corridor. Luxury high-rises, premium malls, IT parks, and corporate offices line this stretch.",
    tags: ["Metro Connected", "IT Hub", "Luxury Projects"],
  },
  {
    slug: "navrangpura",
    name: "Navrangpura",
    zone: "Central Ahmedabad",
    type: "Premium",
    avgPrice: "₹90L–2Cr",
    pricePerSqft: "₹6,000–9,500",
    metro: "Yes",
    description:
      "Navrangpura is Ahmedabad's central business district. It combines old-city charm with modern infrastructure, housing top hospitals, elite schools, coaching institutes, and premium apartments. An investor's favourite.",
    tags: ["City Centre", "Hospitals", "Education Hub"],
  },
  {
    slug: "prahlad-nagar",
    name: "Prahlad Nagar",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹1Cr–3Cr",
    pricePerSqft: "₹7,000–12,000",
    metro: "Nearby",
    description:
      "Prahlad Nagar is Ahmedabad's prime luxury zone. Home to Iscon Mega Mall, premium gated communities, and the city's top restaurants and nightlife. Properties here command the highest values in the city.",
    tags: ["Luxury Zone", "Premium Malls", "High Appreciation"],
  },
  {
    slug: "thaltej",
    name: "Thaltej",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹65L–1.2Cr",
    pricePerSqft: "₹4,800–7,200",
    metro: "Yes",
    description:
      "Thaltej is an emerging premium locality on the SG Highway belt. With excellent metro connectivity and new residential launches from top builders, it offers better value than established luxury zones while still delivering quality living.",
    tags: ["Emerging Premium", "Metro Station", "New Launches"],
  },
  {
    slug: "gota",
    name: "Gota",
    zone: "North-West Ahmedabad",
    type: "Mid-Range",
    avgPrice: "₹30–60L",
    pricePerSqft: "₹2,800–4,200",
    metro: "Nearby",
    description:
      "Gota is one of Ahmedabad's fastest-growing affordable-quality localities. With robust social infrastructure, multiple schools, hospitals, and good connectivity to SG Highway and BRTS, it suits first-time buyers and growing families.",
    tags: ["Affordable", "Good Connectivity", "First-Home Friendly"],
  },
  {
    slug: "chandkheda",
    name: "Chandkheda",
    zone: "North Ahmedabad",
    type: "Affordable",
    avgPrice: "₹25–50L",
    pricePerSqft: "₹2,200–3,800",
    metro: "Yes",
    description:
      "Chandkheda is North Ahmedabad's growing township zone. With proximity to PDPU, Gandhinagar, and the metro line, it attracts students, government employees, and young professionals seeking affordable housing with good amenities.",
    tags: ["Budget Friendly", "Near Gandhinagar", "Metro Access"],
  },
  {
    slug: "ambli",
    name: "Ambli",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹55–90L",
    pricePerSqft: "₹4,000–5,800",
    metro: "Nearby",
    description:
      "Ambli is a peaceful suburban locality known for low density, large plotted developments, and proximity to the Ambli Bopal Road corridor. It appeals to buyers seeking quieter surroundings without sacrificing West Ahmedabad amenities.",
    tags: ["Low Density", "Spacious Plots", "Peaceful Living"],
  },
  {
    slug: "satellite",
    name: "Satellite",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹70L–1.5Cr",
    pricePerSqft: "₹5,200–8,500",
    metro: "Yes",
    description:
      "Satellite is a well-established premium locality in West Ahmedabad, flanked by Shivranjani to the east and Bodakdev to the west. It offers excellent social infrastructure, premium apartments, and is one of the most sought-after residential addresses.",
    tags: ["Established Area", "Top Schools", "Premium Apartments"],
  },
  {
    slug: "vastrapur",
    name: "Vastrapur",
    zone: "West Ahmedabad",
    type: "Premium",
    avgPrice: "₹80L–2Cr",
    pricePerSqft: "₹6,000–10,000",
    metro: "Yes",
    description:
      "Vastrapur is Ahmedabad's lakeside luxury enclave. Adjacent to the serene Vastrapur Lake, it combines natural beauty with urban luxury. Home to IIM Ahmedabad and top hospitals, it is a coveted address for professionals and investors alike.",
    tags: ["Lakeside", "IIM Ahmedabad", "High ROI"],
  },
];

const TYPE_COLORS: Record<LocalityType, string> = {
  Premium: "bg-gold-600/20 text-gold-400 border-gold-600/30",
  "Mid-Range": "bg-amber-700/20 text-amber-400 border-amber-600/30",
  Affordable: "bg-emerald-700/20 text-emerald-400 border-emerald-600/30",
  Commercial: "bg-blue-700/20 text-blue-400 border-blue-600/30",
};

function LocalityCard({ loc }: { loc: Locality }) {
  return (
    <div className="group rounded-2xl border border-gold-800/30 bg-card hover:border-gold-500/50 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-gold-300 transition-colors">
              {loc.name}
            </h3>
            <p className="font-sans text-xs text-gold-500 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {loc.zone}
            </p>
          </div>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium font-sans border ${TYPE_COLORS[loc.type]}`}
          >
            {loc.type}
          </span>
        </div>

        {/* Price Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-obsidian-800/60 px-3 py-2">
            <p className="text-[10px] text-gold-600 font-sans uppercase tracking-wide">
              Avg Price
            </p>
            <p className="font-serif font-semibold text-sm text-gold-300">
              {loc.avgPrice}
            </p>
          </div>
          <div className="rounded-lg bg-obsidian-800/60 px-3 py-2">
            <p className="text-[10px] text-gold-600 font-sans uppercase tracking-wide">
              Per Sq Ft
            </p>
            <p className="font-serif font-semibold text-sm text-gold-300">
              {loc.pricePerSqft}
            </p>
          </div>
        </div>

        {/* Metro */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans text-gold-500">Metro:</span>
          <span
            className={`text-xs font-medium font-sans ${
              loc.metro === "Yes"
                ? "text-emerald-400"
                : loc.metro === "Nearby"
                  ? "text-amber-400"
                  : "text-red-400"
            }`}
          >
            {loc.metro}
          </span>
        </div>

        {/* Description */}
        <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {loc.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {loc.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-obsidian-700/60 text-gold-500 border border-gold-800/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <a
          href={`/area-guides/${loc.slug}`}
          className="block w-full text-center py-2.5 rounded-lg border border-gold-600/40 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500/60 transition-all duration-200 font-sans text-sm font-medium"
          data-ocid={`area-guides.locality_card.${loc.slug}`}
        >
          Read Full Guide →
        </a>
      </div>
    </div>
  );
}

export default function AreaGuidesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return LOCALITIES;
    const q = search.toLowerCase();
    return LOCALITIES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.zone.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 px-4 text-center bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/property-portal"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="area-guides.back_link"
            >
              <ArrowLeft size={16} /> Back to Property Portal
            </Link>
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp size={20} className="text-gold-500" />
              <span className="text-gold-500 font-sans text-xs uppercase tracking-widest">
                Ahmedabad Real Estate
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-5xl gold-text mb-4">
              Area Guides
            </h1>
            <p className="font-sans text-base text-obsidian-100 max-w-xl mx-auto">
              Detailed locality insights, pricing trends, infrastructure
              analysis, and honest pros &amp; cons for Ahmedabad's top
              residential and commercial zones.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="sticky top-16 z-20 bg-obsidian-800/95 backdrop-blur-md border-b border-gold-800/20 py-3 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-600"
              />
              <input
                type="text"
                placeholder="Search by locality, zone or type…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-obsidian-800 border border-gold-800/40 rounded-xl text-sm text-gold-100 placeholder-gold-700 font-sans focus:outline-none focus:border-gold-500/60 transition-colors"
                data-ocid="area-guides.search_input"
              />
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans text-sm text-gold-500">
                {filtered.length}{" "}
                {filtered.length === 1 ? "locality" : "localities"} found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="area-guides.empty_state"
              >
                <MapPin size={40} className="mx-auto text-gold-700/40 mb-4" />
                <p className="font-serif text-xl text-gold-400 mb-2">
                  No localities found
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((loc) => (
                  <LocalityCard key={loc.slug} loc={loc} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
