import SecureAppGate from "@/components/shared/SecureAppGate";
import { Building2 } from "lucide-react";
import { useState } from "react";

const COMMERCIAL_LISTINGS = [
  {
    id: 1,
    title: "SG Highway IT Office",
    type: "Office",
    area: 2200,
    price: 12000000,
    rent: 55000,
    yield: 5.5,
    action: "Buy",
    tenant: "Available",
  },
  {
    id: 2,
    title: "Navrangpura Commercial Complex",
    type: "Retail",
    area: 1800,
    price: 9500000,
    rent: 45000,
    yield: 5.7,
    action: "Rent",
    tenant: "MNC Retail",
  },
  {
    id: 3,
    title: "Bodakdev Showroom",
    type: "Showroom",
    area: 3500,
    price: 18000000,
    rent: 85000,
    yield: 5.7,
    action: "Buy",
    tenant: "Available",
  },
  {
    id: 4,
    title: "Maninagar Warehouse",
    type: "Warehouse",
    area: 8000,
    price: 22000000,
    rent: 95000,
    yield: 5.2,
    action: "Rent",
    tenant: "Logistics Co",
  },
  {
    id: 5,
    title: "Chandkheda Industrial Plot",
    type: "Industrial",
    area: 5000,
    price: 15000000,
    rent: 65000,
    yield: 5.2,
    action: "Buy",
    tenant: "Available",
  },
];

export default function CommercialPage() {
  const [leaseArea, setLeaseArea] = useState("");
  const [leaseRent, setLeaseRent] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [business, setBusiness] = useState("");
  const [budget, setBudget] = useState("");
  const [matchResults, setMatchResults] = useState<
    typeof COMMERCIAL_LISTINGS | null
  >(null);

  const leaseCost =
    leaseArea && leaseRent ? Number(leaseArea) * Number(leaseRent) * 12 * 3 : 0;
  const buyTotal = buyPrice ? Number(buyPrice) * 1.054 : 0;
  const leaseSaves =
    leaseCost && buyTotal
      ? leaseCost < buyTotal
        ? `Leasing saves ₹${((buyTotal - leaseCost) / 100000).toFixed(1)}L over 3 years`
        : `Buying saves ₹${((leaseCost - buyTotal) / 100000).toFixed(1)}L over 3 years`
      : null;

  const handleMatch = () => {
    const budgetNum = Number(budget) * 100000;
    setMatchResults(
      COMMERCIAL_LISTINGS.filter(
        (l) => l.price <= budgetNum || l.rent <= budgetNum,
      ),
    );
  };

  return (
    <SecureAppGate appName="Commercial Desk">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="commercial.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Commercial Desk
            </h1>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Listings Table */}
          <h3 className="font-serif font-semibold text-foreground mb-3">
            Commercial Listings
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gold-800/30 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {[
                    "Property",
                    "Type",
                    "Area (sqft)",
                    "Price",
                    "Rent/mo",
                    "Yield%",
                    "Action",
                    "Tenant",
                  ].map((h) => (
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
                {COMMERCIAL_LISTINGS.map((l, i) => (
                  <tr
                    key={l.id}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`commercial.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {l.title}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {l.type}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">
                      {l.area.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gold-400 font-medium whitespace-nowrap">
                      ₹{(l.price / 100000).toFixed(0)}L
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">
                      ₹{l.rent.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-medium">
                      {l.yield}%
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {l.action}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {l.tenant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lease vs Buy Comparator */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4 mb-5">
            <h3 className="font-serif font-semibold text-foreground mb-3">
              Lease vs Buy Comparator
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gold-600 uppercase tracking-wide">
                  Lease Option
                </p>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    value={leaseArea}
                    onChange={(e) => setLeaseArea(e.target.value)}
                    className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="commercial.lease_area_input"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Rent/sqft/mo (₹)
                  </label>
                  <input
                    type="number"
                    value={leaseRent}
                    onChange={(e) => setLeaseRent(e.target.value)}
                    className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="commercial.lease_rent_input"
                  />
                </div>
                {leaseCost > 0 && (
                  <p className="text-xs text-blue-400">
                    3-yr Cost: ₹{(leaseCost / 100000).toFixed(1)}L
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gold-600 uppercase tracking-wide">
                  Buy Option
                </p>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Purchase Price (₹)
                  </label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                    data-ocid="commercial.buy_price_input"
                  />
                </div>
                {buyTotal > 0 && (
                  <p className="text-xs text-gold-400">
                    Total incl. 5.4% tax: ₹{(buyTotal / 100000).toFixed(1)}L
                  </p>
                )}
              </div>
            </div>
            {leaseSaves && (
              <div className="mt-3 p-2 rounded-lg bg-green-900/10 border border-green-800/30 text-xs text-green-300 text-center">
                {leaseSaves}
              </div>
            )}
          </div>

          {/* Tenant Profiler */}
          <div className="rounded-xl border border-gold-800/30 bg-card p-4">
            <h3 className="font-serif font-semibold text-foreground mb-3">
              Tenant Profiler
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Business Type
                </label>
                <input
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="e.g. IT, Retail"
                  className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                  data-ocid="commercial.business_type_input"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Budget (Lakhs)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm"
                  data-ocid="commercial.budget_input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleMatch}
              className="w-full py-2 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
              data-ocid="commercial.match_button"
            >
              Find Matching Properties
            </button>
            {matchResults && (
              <div className="mt-3 space-y-2">
                {matchResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center">
                    No matches found for this budget
                  </p>
                ) : (
                  matchResults.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-xs"
                    >
                      <span className="text-foreground">{l.title}</span>
                      <span className="text-gold-400">
                        {l.action === "Rent"
                          ? `₹${l.rent.toLocaleString()}/mo`
                          : `₹${(l.price / 100000).toFixed(0)}L`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
