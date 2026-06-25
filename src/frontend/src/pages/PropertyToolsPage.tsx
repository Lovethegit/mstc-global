import {
  IsPriceFairTool,
  PropertyComparisonTool,
  PropertyFlipCalculator,
  PropertyOfTheWeek,
} from "@/components/PropertyEnhancements";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckSquare,
  Star,
} from "lucide-react";
import { useState } from "react";

type Tab = "flip" | "price" | "compare" | "featured";

const TABS: {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "flip",
    label: "Flip Calculator",
    icon: <Calculator size={15} />,
    description: "Analyse profit & ROI for property flipping",
  },
  {
    id: "price",
    label: "Price Checker",
    icon: <BarChart3 size={15} />,
    description: "Is this asking price fair for the area?",
  },
  {
    id: "compare",
    label: "Compare Properties",
    icon: <CheckSquare size={15} />,
    description: "Side-by-side comparison of up to 3 properties",
  },
  {
    id: "featured",
    label: "Property of the Week",
    icon: <Star size={15} />,
    description: "Curated featured listing from our portfolio",
  },
];

export default function PropertyToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("flip");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="bg-card border-b border-gold-800/30 py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-3 bg-gold-900/40 text-gold-300 border border-gold-700/30 font-sans text-xs uppercase tracking-widest">
              Property Intelligence
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Property Tools & Calculators
            </h1>
            <p className="font-sans text-muted-foreground text-sm sm:text-base max-w-2xl">
              Make smarter real estate decisions with MSTC GLOBAL's suite of
              property tools. Analyse flips, verify pricing, compare options,
              and discover featured listings.
            </p>
            <div className="mt-5">
              <Button
                asChild
                variant="outline"
                className="border-gold-700/40 text-gold-300 hover:bg-gold-900/20 font-sans"
                data-ocid="property_tools.browse_button"
              >
                <a href="/property-portal">
                  Browse All Properties
                  <ArrowRight size={14} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Tab navigation */}
        <section className="border-b border-gold-800/20 bg-card/60 sticky top-0 z-10 px-4">
          <div className="max-w-5xl mx-auto">
            <nav
              className="flex gap-1 overflow-x-auto py-2"
              aria-label="Property tools navigation"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gold-900/50 text-gold-300 border border-gold-700/40"
                      : "text-muted-foreground hover:text-gold-400 hover:bg-gold-900/20"
                  }`}
                  data-ocid={`property_tools.tab_${tab.id}`}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Tab content */}
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Active tab header */}
            <div className="mb-6">
              {TABS.filter((t) => t.id === activeTab).map((tab) => (
                <div key={tab.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-400">{tab.icon}</span>
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      {tab.label}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-sans">
                    {tab.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Tool panels */}
            {activeTab === "flip" && (
              <div
                className="rounded-2xl border border-gold-800/30 bg-card p-6"
                data-ocid="property_tools.flip_panel"
              >
                <PropertyFlipCalculator />
              </div>
            )}
            {activeTab === "price" && (
              <div
                className="rounded-2xl border border-gold-800/30 bg-card p-6"
                data-ocid="property_tools.price_panel"
              >
                <IsPriceFairTool />
              </div>
            )}
            {activeTab === "compare" && (
              <div
                className="rounded-2xl border border-gold-800/30 bg-card p-6"
                data-ocid="property_tools.compare_panel"
              >
                <PropertyComparisonTool />
              </div>
            )}
            {activeTab === "featured" && (
              <div data-ocid="property_tools.featured_panel">
                <PropertyOfTheWeek />
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-muted/30 border-t border-gold-800/20 py-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Ready to find your perfect property?
            </h3>
            <p className="text-sm text-muted-foreground font-sans mb-5">
              Explore our full portfolio of 1,200+ verified Ahmedabad listings.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="property_tools.cta_browse_button"
              >
                <a href="/property-portal">
                  Browse All Properties
                  <ArrowRight size={14} className="ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-gold-700/40 text-gold-300 hover:bg-gold-900/20"
                asChild
                data-ocid="property_tools.cta_contact_button"
              >
                <a href="tel:+919512609016">Call +91 9512609016</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
