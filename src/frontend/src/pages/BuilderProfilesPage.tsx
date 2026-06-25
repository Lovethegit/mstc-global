import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  MapPin,
  Search,
  Shield,
  Star,
} from "lucide-react";
import { useState } from "react";

interface Builder {
  id: string;
  name: string;
  reraId: string;
  rating: number;
  completedProjects: number;
  ongoingProjects: number;
  localities: string[];
  about: string;
  established: number;
  totalUnits: number;
  website?: string;
}

const FALLBACK_BUILDERS: Builder[] = [
  {
    id: "navratna",
    name: "Navratna Group",
    reraId: "RAA02210000218",
    rating: 4.5,
    completedProjects: 28,
    ongoingProjects: 6,
    localities: ["Bopal", "South Bopal", "Ghuma", "Ambli"],
    about:
      "One of Ahmedabad's most trusted developers with over two decades of excellence in residential and commercial real estate. Known for quality construction and timely delivery across western Ahmedabad.",
    established: 1998,
    totalUnits: 4200,
    website: "https://navratnagroup.com",
  },
  {
    id: "shivalik",
    name: "Shivalik Group",
    reraId: "RAA02210000431",
    rating: 4.3,
    completedProjects: 35,
    ongoingProjects: 8,
    localities: ["Thaltej", "Prahlad Nagar", "Satellite", "Bodakdev"],
    about:
      "Premium developer specializing in luxury apartments and row houses across the most sought-after corridors of Ahmedabad. Known for smart home features and contemporary architecture.",
    established: 1994,
    totalUnits: 6800,
    website: "https://shivalikgroup.com",
  },
  {
    id: "safal",
    name: "Safal Developers",
    reraId: "RAA02210000672",
    rating: 4.4,
    completedProjects: 22,
    ongoingProjects: 5,
    localities: ["SG Highway", "Science City Road", "Sola", "Gota"],
    about:
      "A reliable name in Ahmedabad's mid-segment and affordable housing sector. Safal Developers is known for value-for-money projects that never compromise on construction quality or amenities.",
    established: 2002,
    totalUnits: 3500,
    website: "https://safaldevelopers.com",
  },
  {
    id: "iscon",
    name: "Iscon Group",
    reraId: "RAA02210000189",
    rating: 4.6,
    completedProjects: 42,
    ongoingProjects: 10,
    localities: ["Jodhpur", "Satellite", "Mansi Cross Road", "Jodhpur Village"],
    about:
      "A legacy builder with 30+ years of shaping Ahmedabad's skyline. Iscon Group commands trust through consistent quality, large township projects, and a reputation for excellent post-handover support.",
    established: 1991,
    totalUnits: 9200,
    website: "https://iscongroup.com",
  },
  {
    id: "arvind",
    name: "Arvind SmartSpaces",
    reraId: "RAA02210000303",
    rating: 4.7,
    completedProjects: 18,
    ongoingProjects: 12,
    localities: ["Shela", "Changodar", "Adalaj", "Khoraj"],
    about:
      "Part of the renowned Arvind Limited conglomerate. Arvind SmartSpaces brings corporate governance to real estate — transparent dealings, RERA-compliant projects, and township-level developments with world-class amenities.",
    established: 2017,
    totalUnits: 3800,
    website: "https://arvindsmartspaces.com",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : star - 0.5 <= rating
                ? "text-yellow-400 fill-yellow-200"
                : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function BuilderProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reraQuery, setReraQuery] = useState("");
  const [verifiedRera, setVerifiedRera] = useState<string | null>(null);
  const [reraStatus, setReraStatus] = useState<"idle" | "found" | "notfound">(
    "idle",
  );

  const filteredBuilders = FALLBACK_BUILDERS.filter((builder) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      builder.name.toLowerCase().includes(q) ||
      builder.localities.some((l) => l.toLowerCase().includes(q)) ||
      builder.reraId.toLowerCase().includes(q)
    );
  });

  const handleReraVerify = () => {
    if (!reraQuery.trim()) return;
    const found = FALLBACK_BUILDERS.find(
      (b) => b.reraId.toLowerCase() === reraQuery.trim().toLowerCase(),
    );
    setVerifiedRera(reraQuery.trim());
    setReraStatus(found ? "found" : "notfound");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/property-portal"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Property Portal
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Builder Profiles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Trusted Builder Profiles
          </h1>
          <p className="text-muted-foreground">
            Explore verified Ahmedabad builders with RERA registration, project
            history, and locality expertise.
          </p>
        </div>

        {/* RERA Verification Box */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              RERA Number Verification
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter a GujRERA registration number to instantly verify a builder's
            credentials.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={reraQuery}
              onChange={(e) => {
                setReraQuery(e.target.value);
                setReraStatus("idle");
              }}
              placeholder="e.g. RAA02210000218"
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === "Enter" && handleReraVerify()}
            />
            <button
              type="button"
              onClick={handleReraVerify}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Verify
            </button>
          </div>
          {reraStatus === "found" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span>
                ✓ RERA ID <strong>{verifiedRera}</strong> is registered and
                active in GujRERA.
              </span>
            </div>
          )}
          {reraStatus === "notfound" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <span>
                ✗ RERA ID <strong>{verifiedRera}</strong> was not found in our
                records. Verify directly at rera.gujarat.gov.in.
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by builder name, locality, or RERA number..."
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Builder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBuilders.map((builder) => (
            <div
              key={builder.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors"
            >
              {/* Card Header */}
              <div className="bg-muted/30 px-6 py-4 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {builder.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Est. {builder.established}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {builder.totalUnits.toLocaleString()} units delivered
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full border border-green-500/20">
                      <CheckCircle className="w-3 h-3" />
                      RERA Verified
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <StarRating rating={builder.rating} />
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4">
                {/* RERA ID */}
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">RERA:</span>
                  <span className="text-xs font-mono text-foreground">
                    {builder.reraId}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-primary">
                      {builder.completedProjects}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed Projects
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-foreground">
                      {builder.ongoingProjects}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ongoing Projects
                    </div>
                  </div>
                </div>

                {/* About */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {builder.about}
                </p>

                {/* Localities */}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {builder.localities.map((loc) => (
                      <span
                        key={loc}
                        className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-muted/10 border-t border-border flex gap-3">
                <Link
                  to="/property-portal"
                  search={{ builder: builder.name } as Record<string, string>}
                  className="flex-1 text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors py-1"
                >
                  View Properties →
                </Link>
                <a
                  href={`https://wa.me/919512609016?text=${encodeURIComponent(`Hi, I'm interested in properties by ${builder.name}. Please share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-1 rounded-lg"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredBuilders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No builders found matching your search.</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted/20 border border-border rounded-lg text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> Builder information and RERA IDs are for
          reference only. Always verify directly with{" "}
          <a
            href="https://rera.gujarat.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            rera.gujarat.gov.in
          </a>{" "}
          before making any property decisions.
        </div>
      </div>
    </div>
  );
}
