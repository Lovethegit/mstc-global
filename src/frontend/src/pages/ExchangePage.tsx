import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Filter, MapPin, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LISTINGS = [
  {
    id: 1,
    title: "3BHK Premium Flat – Prahlad Nagar",
    type: "Residential",
    price: 8500000,
    area: 1850,
    locality: "Prahlad Nagar, Ahmedabad",
    status: "For Sale",
    img: "🏢",
    beds: 3,
    baths: 2,
    listed: "2 days ago",
  },
  {
    id: 2,
    title: "Commercial Space – SG Highway",
    type: "Commercial",
    price: 22000000,
    area: 3200,
    locality: "SG Highway, Ahmedabad",
    status: "For Sale",
    img: "🏙️",
    beds: 0,
    baths: 4,
    listed: "5 days ago",
  },
  {
    id: 3,
    title: "2BHK Apartment – Bopal",
    type: "Residential",
    price: 4800000,
    area: 1200,
    locality: "Bopal, Ahmedabad",
    status: "For Sale",
    img: "🏠",
    beds: 2,
    baths: 2,
    listed: "1 week ago",
  },
  {
    id: 4,
    title: "Industrial Plot – Sanand GIDC",
    type: "Industrial",
    price: 15000000,
    area: 10000,
    locality: "Sanand, Ahmedabad",
    status: "For Bid",
    img: "🏦",
    beds: 0,
    baths: 0,
    listed: "3 days ago",
  },
  {
    id: 5,
    title: "Bungalow – Vastrapur",
    type: "Residential",
    price: 18500000,
    area: 4200,
    locality: "Vastrapur, Ahmedabad",
    status: "For Sale",
    img: "🏡",
    beds: 5,
    baths: 4,
    listed: "Today",
  },
  {
    id: 6,
    title: "Retail Shop – Navrangpura",
    type: "Commercial",
    price: 6500000,
    area: 850,
    locality: "Navrangpura, Ahmedabad",
    status: "For Sale",
    img: "🏪",
    beds: 0,
    baths: 1,
    listed: "4 days ago",
  },
];

const TYPES = ["All", "Residential", "Commercial", "Industrial"];

export default function ExchangePage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = LISTINGS.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.locality.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || l.type === filterType;
    const matchPrice =
      !maxPrice || l.price <= Number.parseInt(maxPrice) * 100000;
    return matchSearch && matchType && matchPrice;
  });

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50 transition-colors"
              data-ocid="exchange.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                MSTC Exchange
              </h1>
              <p className="text-sm text-muted-foreground">
                Private property marketplace – Buy, Bid & Enquire
              </p>
            </div>
            <Button
              onClick={() => toast.success("Listing your property")}
              className="bg-primary text-primary-foreground"
              data-ocid="exchange.list_button"
            >
              + List Property
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-card/60 border border-gold-800/30 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full bg-muted/30 border border-gold-800/30 rounded-lg pl-9 pr-3 py-2 text-sm"
                placeholder="Search by property name or locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="exchange.search_input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    filterType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gold-800/30 text-muted-foreground hover:text-gold-300"
                  }`}
                  data-ocid={`exchange.filter.${t.toLowerCase()}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="bg-muted/30 border border-gold-800/30 rounded-lg pl-9 pr-3 py-2 text-sm w-40"
                placeholder="Max ₹ (Lakhs)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                data-ocid="exchange.price_filter"
              />
            </div>
          </div>

          {/* Count */}
          <div className="text-sm text-muted-foreground">
            {filtered.length} properties available
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((l, i) => (
              <div
                key={l.id}
                className="bg-card/80 border border-gold-800/30 rounded-2xl overflow-hidden hover:border-gold-600/40 transition-all"
                data-ocid={`exchange.listing.item.${i + 1}`}
              >
                <div className="h-40 bg-gradient-to-br from-gold-900/30 to-obsidian-800/60 flex items-center justify-center text-5xl">
                  {l.img}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-foreground leading-snug text-sm">
                      {l.title}
                    </div>
                    <Badge
                      className={
                        l.status === "For Bid"
                          ? "bg-amber-900/30 text-amber-300 border-amber-700/40 flex-shrink-0"
                          : "bg-green-900/30 text-green-300 border-green-700/40 flex-shrink-0"
                      }
                    >
                      {l.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" /> {l.locality}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-gold-400">
                      ₹{(l.price / 100000).toFixed(1)}L
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {l.area} sq ft
                    </span>
                    {l.beds > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {l.beds}BHK
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {l.listed}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {l.status === "For Bid" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 text-xs border border-amber-700/40"
                        onClick={() =>
                          toast.success(`Bid placed on ${l.title}`)
                        }
                        data-ocid={`exchange.listing.bid_button.${i + 1}`}
                      >
                        Place Bid
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 text-xs"
                        onClick={() => toast.success(`Buying ${l.title}`)}
                        data-ocid={`exchange.listing.buy_button.${i + 1}`}
                      >
                        Buy Now
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold-800/30 text-gold-400 text-xs"
                      onClick={() => toast.info(`Enquiry sent for ${l.title}`)}
                      data-ocid={`exchange.listing.enquire_button.${i + 1}`}
                    >
                      Enquire
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="exchange.empty_state"
            >
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>
                No listings match your filters. Try adjusting the search or
                type.
              </p>
            </div>
          )}
        </div>
      </div>
    </SecureAppGate>
  );
}
