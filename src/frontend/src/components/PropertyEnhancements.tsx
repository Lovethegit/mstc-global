import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Home,
  MapPin,
  Phone,
  Printer,
  RefreshCw,
  Star,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// PROPERTY FLIP CALCULATOR
// ─────────────────────────────────────────────────────────────
export function PropertyFlipCalculator() {
  const [form, setForm] = useState({
    purchasePrice: "",
    renovationCost: "",
    holdingMonths: "",
    sellingPrice: "",
  });
  const [result, setResult] = useState<null | {
    grossProfit: number;
    transactionCosts: number;
    holdingCosts: number;
    netProfit: number;
    roi: number;
    annualizedRoi: number;
    profitable: boolean;
  }>(null);

  const calculate = () => {
    const purchase = Number.parseFloat(form.purchasePrice) || 0;
    const renovation = Number.parseFloat(form.renovationCost) || 0;
    const months = Number.parseFloat(form.holdingMonths) || 1;
    const selling = Number.parseFloat(form.sellingPrice) || 0;
    const transactionCosts = (purchase + selling) * 0.07;
    const holdingCosts = purchase * 0.005 * months; // ~0.5% per month holding
    const totalInvested =
      purchase + renovation + transactionCosts + holdingCosts;
    const grossProfit = selling - purchase - renovation;
    const netProfit = selling - totalInvested;
    const roi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
    const annualizedRoi = months > 0 ? (roi / months) * 12 : 0;
    setResult({
      grossProfit,
      transactionCosts,
      holdingCosts,
      netProfit,
      roi,
      annualizedRoi,
      profitable: netProfit > 0,
    });
  };

  const reset = () => {
    setForm({
      purchasePrice: "",
      renovationCost: "",
      holdingMonths: "",
      sellingPrice: "",
    });
    setResult(null);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            key: "purchasePrice",
            label: "Purchase Price (₹)",
            placeholder: "e.g. 5000000",
          },
          {
            key: "renovationCost",
            label: "Renovation Cost (₹)",
            placeholder: "e.g. 300000",
          },
          {
            key: "holdingMonths",
            label: "Holding Period (Months)",
            placeholder: "e.g. 12",
          },
          {
            key: "sellingPrice",
            label: "Expected Selling Price (₹)",
            placeholder: "e.g. 6200000",
          },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-gold-300 font-sans text-xs uppercase tracking-wider">
              {label}
            </Label>
            <Input
              type="number"
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className="bg-background border-gold-800/40 text-foreground focus:border-gold-500"
              data-ocid={`flip_calc.${key}_input`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={calculate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans"
          data-ocid="flip_calc.calculate_button"
        >
          <Calculator size={15} className="mr-2" />
          Calculate Flip
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          className="border-gold-800/40 text-gold-400 hover:bg-gold-900/20"
          data-ocid="flip_calc.reset_button"
        >
          <RefreshCw size={14} className="mr-2" />
          Reset
        </Button>
      </div>

      {result && (
        <div
          className={`rounded-xl border p-5 space-y-4 transition-all ${
            result.profitable
              ? "border-emerald-500/40 bg-emerald-950/30"
              : "border-red-500/40 bg-red-950/30"
          }`}
          data-ocid="flip_calc.result_card"
        >
          <div className="flex items-center gap-2">
            {result.profitable ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <XCircle size={18} className="text-red-400" />
            )}
            <span
              className={`font-serif text-lg font-semibold ${
                result.profitable ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {result.profitable ? "Profitable Flip" : "Not Profitable"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Gross Profit",
                value: fmt(result.grossProfit),
                highlight: false,
              },
              {
                label: "Transaction Costs (7%)",
                value: fmt(result.transactionCosts),
                highlight: false,
              },
              {
                label: "Holding Costs",
                value: fmt(result.holdingCosts),
                highlight: false,
              },
              {
                label: "Net Profit",
                value: fmt(result.netProfit),
                highlight: true,
                color: result.profitable ? "text-emerald-300" : "text-red-300",
              },
              {
                label: "ROI",
                value: `${result.roi.toFixed(2)}%`,
                highlight: true,
                color: result.profitable ? "text-emerald-300" : "text-red-300",
              },
              {
                label: "Annualized ROI",
                value: `${result.annualizedRoi.toFixed(2)}%`,
                highlight: true,
                color: result.profitable ? "text-emerald-300" : "text-red-300",
              },
            ].map(({ label, value, highlight, color }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground font-sans">
                  {label}
                </p>
                <p
                  className={`font-serif font-semibold text-sm ${highlight ? color : "text-foreground"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            * Transaction costs include stamp duty, registration & agent fees
            (7%). Holding costs estimated at 0.5%/month.
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROPERTY COMPARISON TOOL
// ─────────────────────────────────────────────────────────────
const AMENITIES = ["Parking", "Gym", "Pool", "Security", "Lift"];

type CompProp = {
  name: string;
  price: string;
  sqft: string;
  bhk: string;
  location: string;
  amenities: boolean[];
};

const emptyProp = (): CompProp => ({
  name: "",
  price: "",
  sqft: "",
  bhk: "",
  location: "",
  amenities: [false, false, false, false, false],
});

export function PropertyComparisonTool() {
  const [props, setProps] = useState<CompProp[]>([
    emptyProp(),
    emptyProp(),
    emptyProp(),
  ]);
  const [compared, setCompared] = useState(false);

  const update = (
    i: number,
    field: keyof CompProp,
    value: string | boolean[],
  ) => {
    setProps((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );
    setCompared(false);
  };

  const toggleAmenity = (propIdx: number, amenIdx: number) => {
    setProps((prev) =>
      prev.map((p, i) => {
        if (i !== propIdx) return p;
        const next = [...p.amenities];
        next[amenIdx] = !next[amenIdx];
        return { ...p, amenities: next };
      }),
    );
  };

  const filledCount = props.filter(
    (p) => p.name.trim() && p.price.trim(),
  ).length;

  // Best value: highest sqft per lakh
  const sqftPerLakh = props.map((p) => {
    const price = Number.parseFloat(p.price) || 0;
    const sqft = Number.parseFloat(p.sqft) || 0;
    return price > 0 ? sqft / (price / 100000) : 0;
  });
  const maxSqftPerLakh = Math.max(...sqftPerLakh);
  const lowestPrice = Math.min(
    ...props.map((p) => Number.parseFloat(p.price) || Number.POSITIVE_INFINITY),
  );
  const highestSqft = Math.max(
    ...props.map((p) => Number.parseFloat(p.sqft) || 0),
  );
  const mostAmenities = Math.max(
    ...props.map((p) => p.amenities.filter(Boolean).length),
  );

  const fmt = (n: string) => {
    const num = Number.parseFloat(n);
    if (!num) return "—";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Input cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["prop-1", "prop-2", "prop-3"] as const).map((propKey, i) => {
          const p = props[i];
          return (
            <Card key={propKey} className="border-gold-800/30 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-serif text-gold-300">
                  Property {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    field: "name" as const,
                    label: "Property Name",
                    placeholder: "e.g. Sky Residency",
                  },
                  {
                    field: "price" as const,
                    label: "Price (₹)",
                    placeholder: "e.g. 5500000",
                  },
                  {
                    field: "sqft" as const,
                    label: "Area (sqft)",
                    placeholder: "e.g. 1200",
                  },
                  {
                    field: "bhk" as const,
                    label: "BHK",
                    placeholder: "e.g. 2BHK",
                  },
                  {
                    field: "location" as const,
                    label: "Location",
                    placeholder: "e.g. Bopal",
                  },
                ].map(({ field, label, placeholder }) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-[11px] text-gold-400 font-sans uppercase tracking-wide">
                      {label}
                    </Label>
                    <Input
                      value={p[field]}
                      onChange={(e) => update(i, field, e.target.value)}
                      placeholder={placeholder}
                      className="h-8 text-xs bg-background border-gold-800/30 text-foreground"
                      data-ocid={`comparison.prop${i + 1}_${field}_input`}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-gold-400 font-sans uppercase tracking-wide">
                    Amenities
                  </Label>
                  <div className="grid grid-cols-2 gap-1">
                    {AMENITIES.map((a, ai) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(i, ai)}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border transition-all font-sans ${
                          p.amenities[ai]
                            ? "bg-gold-900/40 border-gold-600/50 text-gold-300"
                            : "border-gold-800/20 text-muted-foreground hover:border-gold-700/40"
                        }`}
                        data-ocid={`comparison.prop${i + 1}_amenity_${ai}`}
                      >
                        <CheckCircle2
                          size={11}
                          className={
                            p.amenities[ai]
                              ? "text-gold-400"
                              : "text-muted-foreground"
                          }
                        />
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setCompared(true)}
          disabled={filledCount < 2}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="comparison.compare_button"
        >
          Compare Properties
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setProps([emptyProp(), emptyProp(), emptyProp()]);
            setCompared(false);
          }}
          className="border-gold-800/40 text-gold-400 hover:bg-gold-900/20"
          data-ocid="comparison.clear_button"
        >
          Clear Comparison
        </Button>
      </div>

      {compared && filledCount >= 2 && (
        <div
          className="overflow-x-auto rounded-xl border border-gold-800/30"
          data-ocid="comparison.result_table"
        >
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-gold-800/30 bg-muted/40">
                <th className="text-left px-4 py-3 text-gold-400 font-semibold text-xs uppercase tracking-wider">
                  Attribute
                </th>
                {(["prop-1", "prop-2", "prop-3"] as const).map((propKey, i) => (
                  <th
                    key={propKey}
                    className="text-left px-4 py-3 text-foreground font-serif text-sm"
                  >
                    {props[i].name || `Property ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Price",
                  values: props.map((p) => fmt(p.price)),
                  best: props.findIndex(
                    (p) =>
                      (Number.parseFloat(p.price) ||
                        Number.POSITIVE_INFINITY) === lowestPrice,
                  ),
                },
                {
                  label: "Area (sqft)",
                  values: props.map((p) => (p.sqft ? `${p.sqft} sqft` : "—")),
                  best: props.findIndex(
                    (p) =>
                      Number.parseFloat(p.sqft) === highestSqft &&
                      highestSqft > 0,
                  ),
                },
                {
                  label: "Value / Lakh",
                  values: sqftPerLakh.map((v) =>
                    v > 0 ? `${v.toFixed(1)} sqft/L` : "—",
                  ),
                  best: sqftPerLakh.findIndex(
                    (v) => v === maxSqftPerLakh && v > 0,
                  ),
                },
                {
                  label: "BHK",
                  values: props.map((p) => p.bhk || "—"),
                  best: -1,
                },
                {
                  label: "Location",
                  values: props.map((p) => p.location || "—"),
                  best: -1,
                },
                {
                  label: "Amenities",
                  values: props.map((p) => {
                    const count = p.amenities.filter(Boolean).length;
                    return count > 0 ? `${count}/${AMENITIES.length}` : "—";
                  }),
                  best: props.findIndex(
                    (p) =>
                      p.amenities.filter(Boolean).length === mostAmenities &&
                      mostAmenities > 0,
                  ),
                },
              ].map(({ label, values, best }) => (
                <tr
                  key={label}
                  className="border-b border-gold-800/20 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </td>
                  {values.map((v, i) => (
                    <td
                      key={`col-${i + 1}`}
                      className={`px-4 py-3 font-medium ${
                        best === i
                          ? "text-gold-300 font-semibold"
                          : "text-foreground"
                      }`}
                    >
                      {best === i && (
                        <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded-sm bg-gold-900/40 text-gold-400 text-[10px] font-sans">
                          ★ Best
                        </span>
                      )}
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROPERTY OF THE WEEK
// ─────────────────────────────────────────────────────────────
const FEATURED_PROPERTY = {
  title: "Mondeal Greens — Signature 3BHK",
  location: "Thaltej, Ahmedabad",
  price: "₹1.15 Crore",
  sqft: 1680,
  bhk: "3BHK",
  type: "Residential",
  action: "Buy",
  possession: "Ready to Move",
  highlights: [
    "Premium gated society",
    "3 covered car parks",
    "Rooftop garden & infinity pool",
    "2 km from ISKCON & SG Highway",
    "High appreciation zone",
  ],
  agent: "+91 9512609016",
};

export function PropertyOfTheWeek() {
  return (
    <div
      className="rounded-2xl border border-gold-600/40 bg-gradient-to-br from-card via-gold-950/20 to-card overflow-hidden"
      data-ocid="potw.card"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-sans font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Star size={11} fill="currentColor" />
            Property of the Week
          </Badge>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="text-xs font-sans border-gold-700/40 text-gold-400"
            >
              {FEATURED_PROPERTY.action}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-sans border-gold-700/40 text-gold-400"
            >
              {FEATURED_PROPERTY.possession}
            </Badge>
          </div>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1">
          {FEATURED_PROPERTY.title}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-sans mb-5">
          <MapPin size={13} className="text-gold-500" />
          {FEATURED_PROPERTY.location}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Price", value: FEATURED_PROPERTY.price },
            { label: "Configuration", value: FEATURED_PROPERTY.bhk },
            {
              label: "Area",
              value: `${FEATURED_PROPERTY.sqft.toLocaleString()} sqft`,
            },
            { label: "Type", value: FEATURED_PROPERTY.type },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg bg-muted/30 border border-gold-800/20 p-3"
            >
              <p className="text-[11px] text-muted-foreground font-sans uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p className="font-serif font-semibold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-[11px] text-gold-500 font-sans uppercase tracking-widest mb-2">
            Why this property stands out
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {FEATURED_PROPERTY.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm font-sans text-muted-foreground"
              >
                <CheckCircle2
                  size={13}
                  className="text-gold-500 mt-0.5 flex-shrink-0"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans"
            data-ocid="potw.enquire_button"
          >
            <a href={`tel:${FEATURED_PROPERTY.agent}`}>
              <Phone size={14} className="mr-2" />
              Enquire Now
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-gold-700/40 text-gold-400 hover:bg-gold-900/20"
            asChild
            data-ocid="potw.browse_button"
          >
            <a href="/property-portal">
              Browse All Properties
              <ArrowRight size={14} className="ml-2" />
            </a>
          </Button>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground font-sans">
          📌 Admin: To change this featured property, edit{" "}
          <code className="text-gold-600 text-[10px]">FEATURED_PROPERTY</code>{" "}
          in{" "}
          <code className="text-gold-600 text-[10px]">
            PropertyEnhancements.tsx
          </code>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROPERTY REPORT CARD (printable)
// ─────────────────────────────────────────────────────────────
export type PrintProperty = {
  title: string;
  type?: string;
  action?: string;
  price?: string;
  bhk?: string;
  sqft?: number;
  location?: string;
  amenities?: string[];
  possession?: string;
};

export function PropertyReportCard({ property }: { property: PrintProperty }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#mstc-report-card-root) { display: none !important; }
          #mstc-report-card-root { display: block !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div id="mstc-report-card-root" ref={printRef}>
        <div
          className="rounded-xl border border-gold-700/40 bg-card overflow-hidden"
          data-ocid="report_card.container"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-900/60 to-gold-800/30 border-b border-gold-700/30 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gold-500 font-sans uppercase tracking-widest">
                MSTC GLOBAL — Property Report
              </p>
              <h3 className="font-serif text-lg font-bold text-foreground mt-0.5">
                {property.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans">
              <Home size={12} className="text-gold-500" />
              mstcglobal-kh8.caffeine.xyz
            </div>
          </div>

          {/* Details grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {[
                { label: "Type", value: property.type ?? "—" },
                { label: "Transaction", value: property.action ?? "—" },
                { label: "Price", value: property.price ?? "—" },
                { label: "Configuration", value: property.bhk ?? "—" },
                {
                  label: "Built-up Area",
                  value: property.sqft
                    ? `${property.sqft.toLocaleString()} sqft`
                    : "—",
                },
                { label: "Location", value: property.location ?? "—" },
                { label: "Possession", value: property.possession ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-serif font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] text-gold-500 font-sans uppercase tracking-wider mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-full bg-gold-900/30 border border-gold-700/30 text-xs font-sans text-gold-300"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agency contact */}
            <div className="border-t border-gold-800/20 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider">
                  Contact MSTC GLOBAL
                </p>
                <p className="text-sm font-sans font-semibold text-gold-300">
                  +91 9512609016 | mstc.gbl@gmail.com
                </p>
                <p className="text-[11px] text-muted-foreground font-sans">
                  5, ShwetShikhar Society, Shantivan, Ahmedabad
                </p>
              </div>
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="no-print border-gold-700/40 text-gold-400 hover:bg-gold-900/20"
                data-ocid="report_card.print_button"
              >
                <Printer size={13} className="mr-1.5" />
                Print Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// IS THIS PRICE FAIR?
// ─────────────────────────────────────────────────────────────
const PRICE_BENCHMARKS: Record<string, { min: number; max: number }> = {
  Navrangpura: { min: 8000, max: 11000 },
  Satellite: { min: 7000, max: 9500 },
  Prahladnagar: { min: 7500, max: 10500 },
  Vastrapur: { min: 7500, max: 10000 },
  Bodakdev: { min: 8000, max: 11000 },
  Thaltej: { min: 7000, max: 9000 },
  "SG Highway": { min: 6500, max: 9000 },
  "South Bopal": { min: 5500, max: 7500 },
  Bopal: { min: 5000, max: 7000 },
  Chandkheda: { min: 4500, max: 6500 },
  Gota: { min: 4500, max: 6500 },
  Nikol: { min: 3500, max: 5000 },
  Vastral: { min: 3000, max: 4500 },
  Motera: { min: 4000, max: 5500 },
  Maninagar: { min: 3500, max: 5000 },
};

export function IsPriceFairTool() {
  const [form, setForm] = useState({
    area: "",
    pricePerSqft: "",
  });
  const [verdict, setVerdict] = useState<null | {
    status: "fair" | "above" | "below";
    diff: number;
    benchmark: { min: number; max: number };
  }>(null);

  const check = () => {
    const benchmark = PRICE_BENCHMARKS[form.area];
    if (!benchmark || !form.pricePerSqft) return;
    const price = Number.parseFloat(form.pricePerSqft);
    if (price >= benchmark.min && price <= benchmark.max) {
      setVerdict({ status: "fair", diff: 0, benchmark });
    } else if (price > benchmark.max) {
      const diff = ((price - benchmark.max) / benchmark.max) * 100;
      setVerdict({ status: "above", diff, benchmark });
    } else {
      const diff = ((benchmark.min - price) / benchmark.min) * 100;
      setVerdict({ status: "below", diff, benchmark });
    }
  };

  const statusConfig = {
    fair: {
      icon: <CheckCircle2 size={18} className="text-emerald-400" />,
      label: "Fair Price",
      color: "text-emerald-300",
      bg: "border-emerald-500/40 bg-emerald-950/30",
      desc: "This price is within the expected market range for this area.",
    },
    above: {
      icon: <TrendingUp size={18} className="text-red-400" />,
      label: "Above Market",
      color: "text-red-300",
      bg: "border-red-500/40 bg-red-950/30",
      desc: "",
    },
    below: {
      icon: <TrendingDown size={18} className="text-blue-400" />,
      label: "Below Market",
      color: "text-blue-300",
      bg: "border-blue-500/40 bg-blue-950/30",
      desc: "",
    },
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-gold-300 font-sans text-xs uppercase tracking-wider">
            Ahmedabad Area / Locality
          </Label>
          <Select
            value={form.area}
            onValueChange={(v) => {
              setForm((f) => ({ ...f, area: v }));
              setVerdict(null);
            }}
          >
            <SelectTrigger
              className="bg-background border-gold-800/40 text-foreground"
              data-ocid="price_fair.area_select"
            >
              <SelectValue placeholder="Select locality" />
            </SelectTrigger>
            <SelectContent className="bg-card border-gold-800/40">
              {Object.keys(PRICE_BENCHMARKS).map((area) => (
                <SelectItem key={area} value={area} className="font-sans">
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-gold-300 font-sans text-xs uppercase tracking-wider">
            Asking Price per Sqft (₹)
          </Label>
          <Input
            type="number"
            placeholder="e.g. 7500"
            value={form.pricePerSqft}
            onChange={(e) => {
              setForm((f) => ({ ...f, pricePerSqft: e.target.value }));
              setVerdict(null);
            }}
            className="bg-background border-gold-800/40 text-foreground"
            data-ocid="price_fair.price_input"
          />
        </div>
      </div>

      <Button
        onClick={check}
        disabled={!form.area || !form.pricePerSqft}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        data-ocid="price_fair.check_button"
      >
        Check Price Fairness
      </Button>

      {form.area && PRICE_BENCHMARKS[form.area] && (
        <p className="text-xs text-muted-foreground font-sans">
          2025 benchmark for <span className="text-gold-400">{form.area}</span>:{" "}
          <span className="text-foreground font-medium">
            ₹{PRICE_BENCHMARKS[form.area].min.toLocaleString()}–
            {PRICE_BENCHMARKS[form.area].max.toLocaleString()} per sqft
          </span>
        </p>
      )}

      {verdict && (
        <div
          className={`rounded-xl border p-5 ${statusConfig[verdict.status].bg}`}
          data-ocid="price_fair.result_card"
        >
          <div className="flex items-center gap-2 mb-3">
            {statusConfig[verdict.status].icon}
            <span
              className={`font-serif text-lg font-semibold ${statusConfig[verdict.status].color}`}
            >
              {statusConfig[verdict.status].label}
              {verdict.status !== "fair" &&
                ` (${verdict.diff.toFixed(1)}% ${verdict.status === "above" ? "higher" : "lower"})`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-sans">
                Market Min
              </p>
              <p className="font-serif font-semibold text-foreground">
                ₹{verdict.benchmark.min.toLocaleString()}/sqft
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-sans">
                Market Max
              </p>
              <p className="font-serif font-semibold text-foreground">
                ₹{verdict.benchmark.max.toLocaleString()}/sqft
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-sans">
                Your Price
              </p>
              <p
                className={`font-serif font-semibold ${statusConfig[verdict.status].color}`}
              >
                ₹{Number.parseFloat(form.pricePerSqft).toLocaleString()}/sqft
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            {verdict.status === "fair" &&
              "This price is within the expected market range for this area."}
            {verdict.status === "above" &&
              "This asking price exceeds the current market range. Consider negotiating or verifying premium features."}
            {verdict.status === "below" &&
              "This price is below market average. Could indicate an urgent sale, older construction, or a genuine deal — verify thoroughly."}
          </p>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground font-sans">
        * Benchmarks are based on curated 2025 market data for Ahmedabad
        residential properties (buy). Commercial rates differ.
      </p>
    </div>
  );
}
