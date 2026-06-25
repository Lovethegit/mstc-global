import {
  BreakEvenCalc,
  GSTPropertyCalc,
  LoanRestructuringCalc,
  PortfolioBuilder,
  PrepaymentOptimizer,
  RentalIncomeTaxCalc,
} from "@/components/AdvancedFinanceTools";
import {
  BarChart2,
  Building2,
  Calculator,
  Clock,
  CreditCard,
  FileSearch,
  FileText,
  Globe,
  Home,
  Layers,
  Percent,
  PiggyBank,
  Receipt,
  RefreshCcw,
  Scale,
  Shield,
  Sofa,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

// ─── Utilities ─────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const fmtCurrency = (n: number) => `₹${fmt(n)}`;

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      role="button"
      tabIndex={0}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") onClose();
      }}
      data-ocid="tools.dialog"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl mx-4 rounded-2xl border border-[#c9a84c]/40 overflow-y-auto"
        style={{ background: "#0f1319", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c9a84c]/20">
          <h2 className="text-[#c9a84c] text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#e8e8e8] hover:text-[#c9a84c] transition-colors"
            aria-label="Close"
            data-ocid="tools.close_button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm text-[#c9a84c]/80 mb-1">{children}</label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#0a0e17] border border-[#c9a84c]/30 text-[#e8e8e8] rounded px-3 py-2 focus:border-[#c9a84c] focus:outline-none text-sm mb-3"
    />
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  },
) {
  return (
    <select
      {...props}
      className="w-full bg-[#0a0e17] border border-[#c9a84c]/30 text-[#e8e8e8] rounded px-3 py-2 focus:border-[#c9a84c] focus:outline-none text-sm mb-3"
    />
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0e17] rounded-lg p-4 mt-4 border border-[#c9a84c]/10">
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  gold,
}: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#c9a84c]/10 last:border-0">
      <span className="text-[#e8e8e8]/70 text-sm">{label}</span>
      <span
        className={`font-bold text-base ${
          gold ? "text-[#c9a84c] text-lg" : "text-[#e8e8e8]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CalcButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 mb-4 bg-[#c9a84c] text-black font-semibold px-5 py-2 rounded-lg hover:bg-[#e2b96a] transition-colors text-sm"
      data-ocid="tools.submit_button"
    >
      {children}
    </button>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-[#e8e8e8]/50 text-xs mt-3 italic">{children}</p>;
}

// ─── Calculator 1: Stamp Duty ───────────────────────────────────────────────
function StampDutyCalc() {
  const [val, setVal] = useState("");
  const [txn, setTxn] = useState("Sale");
  const [pType, setPType] = useState("Residential");
  const [result, setResult] = useState<null | {
    stamp: number;
    reg: number;
    total: number;
  }>(null);

  const calc = () => {
    const v = Number.parseFloat(val.replace(/,/g, "")) || 0;
    let stampPct = 0;
    if (txn === "Sale") stampPct = 0.049;
    else stampPct = 0.005;
    const stamp = Math.max(txn !== "Sale" ? 200 : 0, v * stampPct);
    const maxReg = pType === "Residential" ? 30000 : 100000;
    const reg = Math.min(v * 0.01, maxReg);
    setResult({ stamp, reg, total: stamp + reg });
  };

  return (
    <div>
      <Label>Property Value (₹)</Label>
      <Input
        type="number"
        placeholder="e.g. 5000000"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <Label>Transaction Type</Label>
      <Select value={txn} onChange={(e) => setTxn(e.target.value)}>
        <option>Sale</option>
        <option>Gift</option>
        <option>Mortgage</option>
      </Select>
      <Label>Property Type</Label>
      <Select value={pType} onChange={(e) => setPType(e.target.value)}>
        <option>Residential</option>
        <option>Commercial</option>
      </Select>
      <CalcButton onClick={calc}>Calculate</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Property Value"
            value={fmtCurrency(Number.parseFloat(val.replace(/,/g, "")) || 0)}
          />
          <Row label="Transaction Type" value={txn} />
          <Row label="Stamp Duty" value={fmtCurrency(result.stamp)} />
          <Row label="Registration Fee" value={fmtCurrency(result.reg)} />
          <Row
            label="Total Government Charges"
            value={fmtCurrency(result.total)}
            gold
          />
          <Note>
            Gujarat stamp duty: 4.9% for sale, 0.5% for gift/mortgage (min
            ₹200). Registration fee: 1% capped at ₹30,000 (residential) /
            ₹1,00,000 (commercial).
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 2: TDS 194IA ────────────────────────────────────────────────
function TDSCalc() {
  const [val, setVal] = useState("");
  const [sellerType, setSellerType] = useState("Resident Indian");
  const [result, setResult] = useState<null | {
    tds: number;
    net: number;
    pct: number;
  }>(null);

  const calc = () => {
    const v = Number.parseFloat(val.replace(/,/g, "")) || 0;
    let pct = 0;
    if (sellerType === "Resident Indian") {
      pct = v > 5000000 ? 0.01 : 0;
    } else {
      pct = 0.2;
    }
    const tds = v * pct;
    setResult({ tds, net: v - tds, pct });
  };

  return (
    <div>
      <Label>Property Sale Value (₹)</Label>
      <Input
        type="number"
        placeholder="e.g. 7500000"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <Label>Seller Type</Label>
      <Select
        value={sellerType}
        onChange={(e) => setSellerType(e.target.value)}
      >
        <option>Resident Indian</option>
        <option>NRI</option>
      </Select>
      <CalcButton onClick={calc}>Calculate TDS</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Sale Value"
            value={fmtCurrency(Number.parseFloat(val.replace(/,/g, "")) || 0)}
          />
          <Row label="TDS Rate" value={`${result.pct * 100}%`} />
          <Row
            label="TDS Amount (Buyer Deducts)"
            value={fmtCurrency(result.tds)}
            gold
          />
          <Row label="Amount to Seller (Net)" value={fmtCurrency(result.net)} />
          <Note>
            {sellerType === "NRI"
              ? "NRI: TDS @ 20% (LTCG assumed). For STCG the rate is 30%. Buyer must deposit in Form 26QB within 30 days. Certificate of lower deduction from AO may reduce TDS."
              : result.tds > 0
                ? "Resident TDS @ 1% for transactions above ₹50 Lakh (Sec 194IA). Deposit via Form 26QB within 30 days."
                : "No TDS applicable — property value is below ₹50 Lakh for Resident sellers."}
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 3: Capital Gains ───────────────────────────────────────────
const CII: Record<string, number> = {
  "2001": 100,
  "2002": 105,
  "2003": 109,
  "2004": 113,
  "2005": 117,
  "2006": 122,
  "2007": 129,
  "2008": 137,
  "2009": 148,
  "2010": 167,
  "2011": 184,
  "2012": 200,
  "2013": 220,
  "2014": 240,
  "2015": 254,
  "2016": 264,
  "2017": 272,
  "2018": 280,
  "2019": 289,
  "2020": 301,
  "2021": 317,
  "2022": 331,
  "2023": 348,
  "2024": 363,
};

function CapGainsCalc() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [improvement, setImprovement] = useState("");
  const [result, setResult] = useState<null | {
    type: string;
    holdingYears: number;
    gain: number;
    tax: number;
    indexedCost?: number;
  }>(null);

  const calc = () => {
    const pp = Number.parseFloat(purchasePrice.replace(/,/g, "")) || 0;
    const sp = Number.parseFloat(salePrice.replace(/,/g, "")) || 0;
    const imp = Number.parseFloat(improvement.replace(/,/g, "")) || 0;
    const pDate = new Date(purchaseDate);
    const sDate = new Date(saleDate);
    const months =
      (sDate.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const holdingYears = months / 12;

    const pYear = pDate.getFullYear().toString();
    const sYear = sDate.getFullYear().toString();

    if (months < 24) {
      const gain = sp - pp - imp;
      setResult({
        type: "Short Term (STCG)",
        holdingYears,
        gain,
        tax: gain > 0 ? gain * 0.3 : 0,
      });
    } else {
      const ciiP = CII[pYear] ?? CII["2001"];
      const ciiS = CII[sYear] ?? CII["2024"];
      const indexedCost = (pp + imp) * (ciiS / ciiP);
      const gain = sp - indexedCost;
      const tax = gain > 0 ? gain * 0.2 : 0;
      setResult({
        type: "Long Term (LTCG)",
        holdingYears,
        gain,
        tax,
        indexedCost,
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Purchase Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 3000000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Purchase Date</Label>
          <Input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Sale Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 6000000"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Sale Date</Label>
          <Input
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
          />
        </div>
      </div>
      <Label>Improvement Cost (₹, optional)</Label>
      <Input
        type="number"
        placeholder="e.g. 200000"
        value={improvement}
        onChange={(e) => setImprovement(e.target.value)}
      />
      <CalcButton onClick={calc}>Calculate Gains</CalcButton>
      {result && (
        <ResultBox>
          <Row label="Capital Gains Type" value={result.type} />
          <Row
            label="Holding Period"
            value={`${result.holdingYears.toFixed(1)} years`}
          />
          {result.indexedCost !== undefined && (
            <Row label="Indexed Cost" value={fmtCurrency(result.indexedCost)} />
          )}
          <Row
            label="Capital Gain / (Loss)"
            value={fmtCurrency(result.gain)}
            gold
          />
          <Row label="Estimated Tax" value={fmtCurrency(result.tax)} />
          <Note>
            LTCG @ 20% with indexation. STCG taxed at slab rate (30% shown as
            max). Exemptions available under Sec 54 (reinvest in residential
            property) and Sec 54F. Consult a CA for accurate tax filing.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 4: Rental Yield ────────────────────────────────────────────
function RentalYieldCalc() {
  const [propVal, setPropVal] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [propTax, setPropTax] = useState("");
  const [result, setResult] = useState<null | {
    gross: number;
    net: number;
    cashFlow: number;
  }>(null);

  const calc = () => {
    const pv = Number.parseFloat(propVal.replace(/,/g, "")) || 0;
    const mr = Number.parseFloat(monthlyRent.replace(/,/g, "")) || 0;
    const maint = Number.parseFloat(maintenance.replace(/,/g, "")) || 0;
    const tax = Number.parseFloat(propTax.replace(/,/g, "")) || 0;
    const annualRent = mr * 12;
    const gross = (annualRent / pv) * 100;
    const net = ((annualRent - maint - tax) / pv) * 100;
    const cashFlow = mr - (maint + tax) / 12;
    setResult({ gross, net, cashFlow });
  };

  const yieldColor = (y: number) =>
    y > 4 ? "text-green-400" : y >= 2 ? "text-amber-400" : "text-red-400";

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Property Value (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={propVal}
            onChange={(e) => setPropVal(e.target.value)}
          />
        </div>
        <div>
          <Label>Monthly Rent (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 20000"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Maintenance (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 24000"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Property Tax (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000"
            value={propTax}
            onChange={(e) => setPropTax(e.target.value)}
          />
        </div>
      </div>
      <CalcButton onClick={calc}>Calculate Yield</CalcButton>
      {result && (
        <ResultBox>
          <div className="flex gap-6 mb-3">
            <div className="text-center">
              <p className="text-[#e8e8e8]/60 text-xs">Gross Yield</p>
              <p className={`text-2xl font-bold ${yieldColor(result.gross)}`}>
                {result.gross.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[#e8e8e8]/60 text-xs">Net Yield</p>
              <p className={`text-2xl font-bold ${yieldColor(result.net)}`}>
                {result.net.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[#e8e8e8]/60 text-xs">Monthly Cash Flow</p>
              <p className="text-2xl font-bold text-[#c9a84c]">
                {fmtCurrency(result.cashFlow)}
              </p>
            </div>
          </div>
          <Note>
            Green &gt; 4% | Amber 2–4% | Red &lt; 2%. Good rental yield in
            Ahmedabad is typically 3–5%.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 5: Home Loan Tax Benefit ───────────────────────────────────
function HomeLoanTaxCalc() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<null | {
    emi: number;
    annualInterest: number;
    annualPrincipal: number;
    sec24: number;
    sec80c: number;
    taxSaved: number;
    netCost: number;
    taxRate: number;
  }>(null);

  const calc = () => {
    const P = Number.parseFloat(loan.replace(/,/g, "")) || 0;
    const annualRate = Number.parseFloat(rate) || 0;
    const years = Number.parseFloat(tenure) || 0;
    const inc = Number.parseFloat(income.replace(/,/g, "")) || 0;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    const emi =
      n > 0 && r > 0 ? (P * r * (1 + r) ** n) / ((1 + r) ** n - 1) : P / n;
    const annualEMI = emi * 12;
    const annualInterest = P * r * 12; // approx year 1
    const annualPrincipal = annualEMI - annualInterest;
    const sec24 = Math.min(annualInterest, 200000);
    const sec80c = Math.min(annualPrincipal, 150000);
    const taxRate = inc > 1000000 ? 0.3 : inc > 500000 ? 0.2 : 0.05;
    const taxSaved = (sec24 + sec80c) * taxRate;
    setResult({
      emi,
      annualInterest,
      annualPrincipal,
      sec24,
      sec80c,
      taxSaved,
      netCost: annualEMI - taxSaved,
      taxRate,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Loan Amount (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 4000000"
            value={loan}
            onChange={(e) => setLoan(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Interest Rate (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 8.5"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div>
          <Label>Tenure (years)</Label>
          <Input
            type="number"
            placeholder="e.g. 20"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Taxable Income (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 1200000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
      </div>
      <CalcButton onClick={calc}>Calculate Benefits</CalcButton>
      {result && (
        <ResultBox>
          <Row label="Monthly EMI" value={fmtCurrency(result.emi)} gold />
          <Row
            label="Year 1 – Annual Interest"
            value={fmtCurrency(result.annualInterest)}
          />
          <Row
            label="Year 1 – Annual Principal"
            value={fmtCurrency(result.annualPrincipal)}
          />
          <Row
            label="Sec 24 Deduction (Interest)"
            value={fmtCurrency(result.sec24)}
          />
          <Row
            label="Sec 80C Deduction (Principal)"
            value={fmtCurrency(result.sec80c)}
          />
          <Row
            label={`Tax Rate (${(result.taxRate * 100).toFixed(0)}%)`}
            value={fmtCurrency(result.taxSaved)}
          />
          <Row
            label="Total Tax Saved (Year 1)"
            value={fmtCurrency(result.taxSaved)}
            gold
          />
          <Row
            label="Net Annual Cost After Savings"
            value={fmtCurrency(result.netCost)}
          />
          <Note>
            Sec 24 cap: ₹2L/year (self-occupied). Sec 80C: part of ₹1.5L
            combined limit. Figures shown for Year 1. Consult a CA for exact
            filing.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 6: Redevelopment Feasibility ───────────────────────────────
function RedevelopmentCalc() {
  const [plotArea, setPlotArea] = useState("");
  const [fsi, setFsi] = useState("1.8");
  const [existing, setExisting] = useState("");
  const [costPerSqft, setCostPerSqft] = useState("2500");
  const [result, setResult] = useState<null | {
    maxBuildable: number;
    extra: number;
    cost: number;
    breakeven: number;
    feasible: boolean;
  }>(null);

  const calc = () => {
    const pa = Number.parseFloat(plotArea.replace(/,/g, "")) || 0;
    const f = Number.parseFloat(fsi) || 1.8;
    const ex = Number.parseFloat(existing.replace(/,/g, "")) || 0;
    const cost = Number.parseFloat(costPerSqft.replace(/,/g, "")) || 2500;
    const max = pa * f;
    const extra = max - ex;
    const totalCost = extra > 0 ? extra * cost : 0;
    const breakeven = extra > 0 ? totalCost / extra : 0;
    setResult({
      maxBuildable: max,
      extra,
      cost: totalCost,
      breakeven,
      feasible: extra > 0,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Plot Area (sq ft)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000"
            value={plotArea}
            onChange={(e) => setPlotArea(e.target.value)}
          />
        </div>
        <div>
          <Label>Current FSI</Label>
          <Input
            type="number"
            placeholder="1.8"
            value={fsi}
            onChange={(e) => setFsi(e.target.value)}
          />
        </div>
        <div>
          <Label>Existing Structure (sq ft)</Label>
          <Input
            type="number"
            placeholder="e.g. 4000"
            value={existing}
            onChange={(e) => setExisting(e.target.value)}
          />
        </div>
        <div>
          <Label>Construction Cost (₹/sq ft)</Label>
          <Input
            type="number"
            placeholder="2500"
            value={costPerSqft}
            onChange={(e) => setCostPerSqft(e.target.value)}
          />
        </div>
      </div>
      <CalcButton onClick={calc}>Check Feasibility</CalcButton>
      {result && (
        <ResultBox>
          {result.feasible ? (
            <div className="mb-3 inline-flex items-center gap-2 bg-green-900/40 border border-green-500/40 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
              ✓ Redevelopment Feasible
            </div>
          ) : (
            <div className="mb-3 inline-flex items-center gap-2 bg-red-900/40 border border-red-500/40 text-red-400 text-sm font-semibold px-3 py-1 rounded-full">
              ✗ No Extra Buildable Area
            </div>
          )}
          <Row
            label="Max Buildable Area"
            value={`${fmt(result.maxBuildable)} sq ft`}
          />
          <Row
            label="Extra Buildable Area"
            value={`${fmt(result.extra)} sq ft`}
            gold
          />
          <Row
            label="Estimated Construction Cost"
            value={fmtCurrency(result.cost)}
          />
          <Row
            label="Breakeven Price per sq ft"
            value={fmtCurrency(result.breakeven)}
          />
          <Note>
            FSI norms vary by zone and policy. Verify current FSI with AUDA/AMC
            before proceeding.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 7: Property Insurance Estimator ────────────────────────────
function InsuranceCalc() {
  const [propVal, setPropVal] = useState("");
  const [pType, setPType] = useState("Flat");
  const [yearBuilt, setYearBuilt] = useState("");
  const [risk, setRisk] = useState("Low");
  const [result, setResult] = useState<null | {
    minAnnual: number;
    maxAnnual: number;
  }>(null);

  const calc = () => {
    const pv = Number.parseFloat(propVal.replace(/,/g, "")) || 0;
    const age =
      new Date().getFullYear() -
      (Number.parseInt(yearBuilt) || new Date().getFullYear());
    const rateMap: Record<string, [number, number]> = {
      Low: [0.0005, 0.0008],
      Medium: [0.0008, 0.0012],
      High: [0.0012, 0.002],
    };
    let [minRate, maxRate] = rateMap[risk] ?? rateMap.Low;
    if (age > 20) {
      minRate += 0.0002;
      maxRate += 0.0002;
    }
    setResult({ minAnnual: pv * minRate, maxAnnual: pv * maxRate });
  };

  const covered = [
    "Fire & natural calamities",
    "Earthquake",
    "Flood",
    "Theft & burglary",
    "Third-party liability",
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Property Value (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={propVal}
            onChange={(e) => setPropVal(e.target.value)}
          />
        </div>
        <div>
          <Label>Property Type</Label>
          <Select value={pType} onChange={(e) => setPType(e.target.value)}>
            <option>Flat</option>
            <option>Villa</option>
            <option>Commercial</option>
          </Select>
        </div>
        <div>
          <Label>Year Built</Label>
          <Input
            type="number"
            placeholder="e.g. 2010"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
          />
        </div>
        <div>
          <Label>Location Risk</Label>
          <Select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </Select>
        </div>
      </div>
      <CalcButton onClick={calc}>Estimate Premium</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Annual Premium Range"
            value={`${fmtCurrency(result.minAnnual)} – ${fmtCurrency(result.maxAnnual)}`}
            gold
          />
          <Row
            label="Monthly Premium Range"
            value={`${fmtCurrency(result.minAnnual / 12)} – ${fmtCurrency(result.maxAnnual / 12)}`}
          />
          <div className="mt-3">
            <p className="text-[#c9a84c]/70 text-xs font-semibold mb-1">
              Typically Covered:
            </p>
            <ul className="list-disc list-inside text-[#e8e8e8]/60 text-xs space-y-0.5">
              {covered.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <Note>
            Premiums are indicative. Actual rates depend on insurer, policy
            type, and specific coverage. Get quotes from LIC, New India, HDFC
            ERGO, ICICI Lombard.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 8: Interior Cost Estimator ─────────────────────────────────
function InteriorCalc() {
  const [area, setArea] = useState("");
  const [finish, setFinish] = useState("Standard");
  const [result, setResult] = useState<null | {
    min: number;
    max: number;
    rooms: { name: string; min: number; max: number }[];
  }>(null);

  const rates: Record<string, [number, number]> = {
    Basic: [500, 800],
    Standard: [800, 1200],
    Premium: [1200, 2000],
    Luxury: [2000, 4000],
  };

  const roomPcts = [
    { name: "Living Room", pct: 0.25 },
    { name: "Master Bedroom", pct: 0.22 },
    { name: "Kitchen", pct: 0.18 },
    { name: "Bedroom 2", pct: 0.15 },
    { name: "Bathrooms", pct: 0.12 },
    { name: "Other Areas", pct: 0.08 },
  ];

  const calc = () => {
    const a = Number.parseFloat(area.replace(/,/g, "")) || 0;
    const [minR, maxR] = rates[finish] ?? rates.Standard;
    const rooms = roomPcts.map((r) => ({
      name: r.name,
      min: a * r.pct * minR,
      max: a * r.pct * maxR,
    }));
    setResult({ min: a * minR, max: a * maxR, rooms });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Carpet Area (sq ft)</Label>
          <Input
            type="number"
            placeholder="e.g. 1200"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
        <div>
          <Label>Finish Level</Label>
          <Select value={finish} onChange={(e) => setFinish(e.target.value)}>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
            <option>Luxury</option>
          </Select>
        </div>
      </div>
      <CalcButton onClick={calc}>Estimate Cost</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Total Interior Cost"
            value={`${fmtCurrency(result.min)} – ${fmtCurrency(result.max)}`}
            gold
          />
          <div className="mt-3 space-y-1">
            {result.rooms.map((r) => (
              <Row
                key={r.name}
                label={r.name}
                value={`${fmtCurrency(r.min)} – ${fmtCurrency(r.max)}`}
              />
            ))}
          </div>
          <Note>
            Estimates for Ahmedabad market 2024–25. Actual costs vary by
            contractor, materials, and design complexity.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 9: Society Maintenance Estimator ───────────────────────────
function MaintenanceCalc() {
  const [flatSize, setFlatSize] = useState("");
  const [sType, setSType] = useState("Mid-range");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<null | {
    baseMin: number;
    baseMax: number;
    totalMin: number;
    totalMax: number;
  }>(null);

  const baseRates: Record<string, [number, number]> = {
    Basic: [2, 4],
    "Mid-range": [4, 8],
    Premium: [8, 15],
    Luxury: [15, 30],
  };

  const addOnCosts: Record<string, [number, number]> = {
    Pool: [500, 1000],
    Gym: [300, 600],
    "Power Backup": [500, 1500],
    CCTV: [200, 500],
    Garden: [300, 600],
  };

  const toggleAddOn = (name: string) => {
    setAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  const calc = () => {
    const a = Number.parseFloat(flatSize.replace(/,/g, "")) || 0;
    const [minR, maxR] = baseRates[sType] ?? baseRates["Mid-range"];
    const baseMin = a * minR;
    const baseMax = a * maxR;
    let addMin = 0;
    let addMax = 0;
    for (const ao of addOns) {
      const [mn, mx] = addOnCosts[ao] ?? [0, 0];
      addMin += mn;
      addMax += mx;
    }
    setResult({
      baseMin,
      baseMax,
      totalMin: baseMin + addMin,
      totalMax: baseMax + addMax,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Flat Size (sq ft)</Label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={flatSize}
            onChange={(e) => setFlatSize(e.target.value)}
          />
        </div>
        <div>
          <Label>Society Type</Label>
          <Select value={sType} onChange={(e) => setSType(e.target.value)}>
            <option>Basic</option>
            <option>Mid-range</option>
            <option>Premium</option>
            <option>Luxury</option>
          </Select>
        </div>
      </div>
      <Label>Add-ons (check all that apply)</Label>
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.keys(addOnCosts).map((ao) => (
          <button
            key={ao}
            type="button"
            onClick={() => toggleAddOn(ao)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              addOns.includes(ao)
                ? "bg-[#c9a84c] text-black border-[#c9a84c]"
                : "bg-transparent text-[#c9a84c] border-[#c9a84c]/40 hover:border-[#c9a84c]"
            }`}
          >
            {ao}
          </button>
        ))}
      </div>
      <CalcButton onClick={calc}>Calculate Maintenance</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Base Monthly Maintenance"
            value={`${fmtCurrency(result.baseMin)} – ${fmtCurrency(result.baseMax)}`}
          />
          {addOns.length > 0 && (
            <Row label={`Add-ons (${addOns.join(", ")})`} value="included" />
          )}
          <Row
            label="Total Monthly Maintenance"
            value={`${fmtCurrency(result.totalMin)} – ${fmtCurrency(result.totalMax)}`}
            gold
          />
          <Note>
            Maintenance rates: Basic ₹2–4, Mid ₹4–8, Premium ₹8–15, Luxury
            ₹15–30 per sq ft/month. Actual rates depend on society AGM
            decisions.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 10: EMI Calculator ─────────────────────────────────────────
function EMICalc() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState<null | {
    emi: number;
    total: number;
    interest: number;
    ratio: number;
    schedule: {
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }[];
  }>(null);

  const calc = () => {
    const P = Number.parseFloat(loan.replace(/,/g, "")) || 0;
    const r = Number.parseFloat(rate) / 12 / 100;
    const n = tenure * 12;
    const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const total = emi * n;
    const interest = total - P;
    const ratio = (interest / P) * 100;

    // Yearly schedule (first 5 years + last year)
    const schedule: {
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    let balance = P;
    for (let y = 1; y <= Math.min(tenure, 5); y++) {
      let yPrincipal = 0;
      let yInterest = 0;
      for (let m = 0; m < 12; m++) {
        const interestM = balance * r;
        const principalM = emi - interestM;
        yInterest += interestM;
        yPrincipal += principalM;
        balance -= principalM;
      }
      schedule.push({
        year: y,
        principal: yPrincipal,
        interest: yInterest,
        balance: Math.max(0, balance),
      });
    }

    setResult({ emi, total, interest, ratio, schedule });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Loan Amount (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={loan}
            onChange={(e) => setLoan(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Interest Rate (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 8.5"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      </div>
      <Label>Tenure: {tenure} years</Label>
      <input
        type="range"
        min={5}
        max={30}
        value={tenure}
        onChange={(e) => setTenure(Number.parseInt(e.target.value))}
        className="w-full accent-[#c9a84c] mb-3"
        style={{ accentColor: "#c9a84c" }}
      />
      <div className="flex justify-between text-[#e8e8e8]/40 text-xs mb-3">
        <span>5 yrs</span>
        <span>30 yrs</span>
      </div>
      <CalcButton onClick={calc}>Calculate EMI</CalcButton>
      {result && (
        <ResultBox>
          <Row label="Monthly EMI" value={fmtCurrency(result.emi)} gold />
          <Row label="Total Payment" value={fmtCurrency(result.total)} />
          <Row label="Total Interest" value={fmtCurrency(result.interest)} />
          <Row
            label="Interest to Principal Ratio"
            value={`${result.ratio.toFixed(1)}%`}
          />
          <div className="mt-3">
            <p className="text-[#c9a84c]/70 text-xs font-semibold mb-2">
              Year-by-Year Summary (First 5 Years)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#c9a84c]/20">
                    <th className="text-left text-[#c9a84c]/60 pb-1 pr-3">
                      Year
                    </th>
                    <th className="text-right text-[#c9a84c]/60 pb-1 pr-3">
                      Principal
                    </th>
                    <th className="text-right text-[#c9a84c]/60 pb-1 pr-3">
                      Interest
                    </th>
                    <th className="text-right text-[#c9a84c]/60 pb-1">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="border-b border-[#c9a84c]/10">
                      <td className="text-[#e8e8e8]/70 py-1 pr-3">
                        Yr {row.year}
                      </td>
                      <td className="text-right text-[#e8e8e8]/80 pr-3">
                        {fmtCurrency(row.principal)}
                      </td>
                      <td className="text-right text-[#e8e8e8]/80 pr-3">
                        {fmtCurrency(row.interest)}
                      </td>
                      <td className="text-right text-[#c9a84c]">
                        {fmtCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 11: Loan Eligibility ───────────────────────────────────────
function LoanEligibilityCalc() {
  const [income, setIncome] = useState("");
  const [existingEmi, setExistingEmi] = useState("");
  const [tenure, setTenure] = useState("20");
  const [rate, setRate] = useState("9");
  const [result, setResult] = useState<null | {
    eligible: number;
    maxEmi: number;
  }>(null);

  const calc = () => {
    const inc = Number.parseFloat(income.replace(/,/g, "")) || 0;
    const existing = Number.parseFloat(existingEmi.replace(/,/g, "")) || 0;
    const years = Number.parseFloat(tenure) || 20;
    const annualRate = Number.parseFloat(rate) || 9;
    const maxEmi = inc * 0.5 - existing;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    const eligible =
      maxEmi > 0 && r > 0
        ? (maxEmi * ((1 + r) ** n - 1)) / (r * (1 + r) ** n)
        : 0;
    setResult({ eligible, maxEmi });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Monthly Income (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 100000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div>
          <Label>Existing Monthly EMIs (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 15000"
            value={existingEmi}
            onChange={(e) => setExistingEmi(e.target.value)}
          />
        </div>
        <div>
          <Label>Preferred Tenure (years)</Label>
          <Input
            type="number"
            placeholder="20"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>
        <div>
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            placeholder="9"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      </div>
      <CalcButton onClick={calc}>Calculate Eligibility</CalcButton>
      {result && (
        <ResultBox>
          <Row label="Maximum EMI Allowed" value={fmtCurrency(result.maxEmi)} />
          <Row
            label="Maximum Eligible Loan Amount"
            value={fmtCurrency(result.eligible)}
            gold
          />
          <Note>
            Based on 50% of monthly income minus existing EMIs. Actual
            eligibility depends on bank policies and credit score.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 12: Rent vs Buy 10-Year Comparison ─────────────────────────
function RentVsBuyCalc() {
  const [propPrice, setPropPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [appreciation, setAppreciation] = useState("");
  const [result, setResult] = useState<null | {
    ownYear5: number;
    ownYear10: number;
    rentYear5: number;
    rentYear10: number;
    propValueYear10: number;
  }>(null);

  const calc = () => {
    const price = Number.parseFloat(propPrice.replace(/,/g, "")) || 0;
    const down = Number.parseFloat(downPayment.replace(/,/g, "")) || 0;
    const rate = Number.parseFloat(loanRate) || 0;
    const rent = Number.parseFloat(monthlyRent.replace(/,/g, "")) || 0;
    const apprec = Number.parseFloat(appreciation) || 0;
    const loan = price - down;
    const r = rate / 12 / 100;
    const n = 20 * 12;
    const emi =
      loan > 0 && r > 0 ? (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1) : 0;

    let ownCost5 = down;
    let ownCost10 = down;
    let balance = loan;
    for (let m = 0; m < 120; m++) {
      const interestM = balance * r;
      const principalM = emi - interestM;
      ownCost5 += emi;
      balance -= principalM;
    }
    balance = loan;
    for (let m = 0; m < 240; m++) {
      const interestM = balance * r;
      const principalM = emi - interestM;
      ownCost10 += emi;
      balance -= principalM;
    }

    const rentCost5 = rent * 12 * 5;
    const rentCost10 = rent * 12 * 10;
    const propValueYear10 = price * (1 + apprec / 100) ** 10;

    setResult({
      ownYear5: ownCost5,
      ownYear10: ownCost10,
      rentYear5: rentCost5,
      rentYear10: rentCost10,
      propValueYear10,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Property Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={propPrice}
            onChange={(e) => setPropPrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Down Payment (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 1000000"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>
        <div>
          <Label>Home Loan Rate (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 8.5"
            value={loanRate}
            onChange={(e) => setLoanRate(e.target.value)}
          />
        </div>
        <div>
          <Label>Monthly Rent if Renting (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 25000"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />
        </div>
      </div>
      <Label>Annual Property Appreciation (%)</Label>
      <Input
        type="number"
        placeholder="e.g. 5"
        value={appreciation}
        onChange={(e) => setAppreciation(e.target.value)}
      />
      <CalcButton onClick={calc}>Compare</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Cost of Owning (5 Years)"
            value={fmtCurrency(result.ownYear5)}
          />
          <Row
            label="Cost of Renting (5 Years)"
            value={fmtCurrency(result.rentYear5)}
          />
          <Row
            label="Cost of Owning (10 Years)"
            value={fmtCurrency(result.ownYear10)}
          />
          <Row
            label="Cost of Renting (10 Years)"
            value={fmtCurrency(result.rentYear10)}
          />
          <Row
            label="Property Value (Year 10)"
            value={fmtCurrency(result.propValueYear10)}
            gold
          />
          <Note>
            Assumes 20-year loan tenure. Does not include maintenance, taxes, or
            rental increases.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 13: Investment ROI ───────────────────────────────────────────
function InvestmentROICalc() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [appreciationRate, setAppreciationRate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState<null | {
    totalReturn: number;
    cagr: number;
    totalRental: number;
  }>(null);

  const calc = () => {
    const price = Number.parseFloat(purchasePrice.replace(/,/g, "")) || 0;
    const apprec = Number.parseFloat(appreciationRate) || 0;
    const rent = Number.parseFloat(monthlyRent.replace(/,/g, "")) || 0;
    const years = Number.parseFloat(period) || 0;
    const futureValue = price * (1 + apprec / 100) ** years;
    const totalRental = rent * 12 * years;
    const totalReturn = futureValue - price + totalRental;
    const cagr =
      years > 0 ? ((futureValue / price) ** (1 / years) - 1) * 100 : 0;
    setResult({ totalReturn, cagr, totalRental });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Purchase Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Appreciation Rate (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 5"
            value={appreciationRate}
            onChange={(e) => setAppreciationRate(e.target.value)}
          />
        </div>
        <div>
          <Label>Monthly Rental Income (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 20000"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />
        </div>
        <div>
          <Label>Investment Period (years)</Label>
          <Input
            type="number"
            placeholder="e.g. 10"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
      </div>
      <CalcButton onClick={calc}>Calculate ROI</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Total Return"
            value={fmtCurrency(result.totalReturn)}
            gold
          />
          <Row label="CAGR" value={`${result.cagr.toFixed(2)}%`} />
          <Row
            label="Total Rental Income"
            value={fmtCurrency(result.totalRental)}
          />
          <Note>
            Total return includes capital appreciation and rental income. Does
            not account for taxes or maintenance.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 14: NRI Repatriation ───────────────────────────────────────────
function NRIRepatriationCalc() {
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [improvement, setImprovement] = useState("");
  const [result, setResult] = useState<null | {
    capitalGain: number;
    tds: number;
    netRepatriable: number;
  }>(null);

  const calc = () => {
    const sp = Number.parseFloat(salePrice.replace(/,/g, "")) || 0;
    const pp = Number.parseFloat(purchasePrice.replace(/,/g, "")) || 0;
    const imp = Number.parseFloat(improvement.replace(/,/g, "")) || 0;
    const capitalGain = sp - pp - imp;
    const tds = sp * 0.2288;
    const netRepatriable = sp - tds;
    setResult({ capitalGain, tds, netRepatriable });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Sale Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 10000000"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Purchase Price (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
      </div>
      <Label>Cost of Improvement (₹)</Label>
      <Input
        type="number"
        placeholder="e.g. 500000"
        value={improvement}
        onChange={(e) => setImprovement(e.target.value)}
      />
      <CalcButton onClick={calc}>Calculate</CalcButton>
      {result && (
        <ResultBox>
          <Row label="Capital Gain" value={fmtCurrency(result.capitalGain)} />
          <Row label="TDS Deducted (22.88%)" value={fmtCurrency(result.tds)} />
          <Row
            label="Net Amount Repatriable"
            value={fmtCurrency(result.netRepatriable)}
            gold
          />
          <Note>
            TDS rate of 22.88% includes surcharge and cess for NRI property
            sales. Actual TDS may vary based on capital gains type and DTAA.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 15: Packers & Movers Estimator ─────────────────────────────
function PackersMoversCalc() {
  const [homeSize, setHomeSize] = useState("1BHK");
  const [moveType, setMoveType] = useState("Within City");
  const [floor, setFloor] = useState("Ground");
  const [result, setResult] = useState<null | {
    min: number;
    max: number;
  }>(null);

  const calc = () => {
    const baseRates: Record<string, [number, number]> = {
      "1BHK": [5000, 15000],
      "2BHK": [8000, 20000],
      "3BHK": [12000, 30000],
      "4BHK+": [18000, 40000],
      Office: [15000, 50000],
    };
    const [minBase, maxBase] = baseRates[homeSize] ?? [5000, 15000];
    let multiplier = 1;
    if (moveType === "Within State") multiplier = 4;
    else if (moveType === "Other State") multiplier = 6.5;
    let floorMultiplier = 1;
    if (floor === "1-3") floorMultiplier = 1.1;
    else if (floor === "4-6") floorMultiplier = 1.2;
    else if (floor === "7+") floorMultiplier = 1.35;
    setResult({
      min: Math.round(minBase * multiplier * floorMultiplier),
      max: Math.round(maxBase * multiplier * floorMultiplier),
    });
  };

  return (
    <div>
      <Label>Home Size</Label>
      <Select value={homeSize} onChange={(e) => setHomeSize(e.target.value)}>
        <option>1BHK</option>
        <option>2BHK</option>
        <option>3BHK</option>
        <option>4BHK+</option>
        <option>Office</option>
      </Select>
      <Label>Move Type</Label>
      <Select value={moveType} onChange={(e) => setMoveType(e.target.value)}>
        <option>Within City</option>
        <option>Within State</option>
        <option>Other State</option>
      </Select>
      <Label>Floor</Label>
      <Select value={floor} onChange={(e) => setFloor(e.target.value)}>
        <option>Ground</option>
        <option>1-3</option>
        <option>4-6</option>
        <option>7+</option>
      </Select>
      <CalcButton onClick={calc}>Estimate Cost</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Estimated Cost Range"
            value={`${fmtCurrency(result.min)} – ${fmtCurrency(result.max)}`}
            gold
          />
          <Note>
            Estimates include packing, loading, transport, and unloading.
            Insurance and storage are extra.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Calculator 18: Commission Split ─────────────────────────────────────────
function CommissionSplitCalc() {
  const [dealValue, setDealValue] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [numAgents, setNumAgents] = useState("2");
  const [shares, setShares] = useState<string[]>(["50", "50", "", "", ""]);
  const [result, setResult] = useState<null | {
    totalCommission: number;
    agentShares: number[];
    warning: string;
  }>(null);

  const calc = () => {
    const val = Number.parseFloat(dealValue.replace(/,/g, "")) || 0;
    const rate = Number.parseFloat(commissionRate) || 0;
    const totalCommission = val * (rate / 100);
    const n = Math.min(Math.max(Number.parseInt(numAgents) || 1, 1), 5);
    const agentShares = shares.slice(0, n).map((s) => {
      const pct = Number.parseFloat(s) || 0;
      return totalCommission * (pct / 100);
    });
    const totalPct = shares
      .slice(0, n)
      .reduce((sum, s) => sum + (Number.parseFloat(s) || 0), 0);
    const warning =
      Math.abs(totalPct - 100) > 0.01
        ? `Warning: shares total ${totalPct.toFixed(1)}% (should be 100%)`
        : "";
    setResult({ totalCommission, agentShares, warning });
  };

  const maxAgents = Math.min(5, Math.max(1, Number.parseInt(numAgents) || 2));
  const agentInputElements = [
    "agent-0",
    "agent-1",
    "agent-2",
    "agent-3",
    "agent-4",
  ]
    .slice(0, maxAgents)
    .map((agentId) => {
      const agentNum = Number.parseInt(agentId.split("-")[1]) + 1;
      return (
        <div key={agentId}>
          <Label>Agent {agentNum} Share (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 50"
            value={shares[agentNum - 1]}
            onChange={(e) => {
              const newShares = [...shares];
              newShares[agentNum - 1] = e.target.value;
              setShares(newShares);
            }}
          />
        </div>
      );
    });

  const agentShareResultElements = result
    ? ["share-0", "share-1", "share-2", "share-3", "share-4"]
        .slice(0, result.agentShares.length)
        .map((shareId) => {
          const shareNum = Number.parseInt(shareId.split("-")[1]) + 1;
          return (
            <Row
              key={shareId}
              label={`Agent ${shareNum} Share`}
              value={fmtCurrency(result.agentShares[shareNum - 1])}
            />
          );
        })
    : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Deal Value (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000000"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
          />
        </div>
        <div>
          <Label>Total Commission Rate (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 2"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
          />
        </div>
      </div>
      <Label>Number of Agents</Label>
      <Select value={numAgents} onChange={(e) => setNumAgents(e.target.value)}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Select>
      {agentInputElements}
      <CalcButton onClick={calc}>Calculate Split</CalcButton>
      {result && (
        <ResultBox>
          <Row
            label="Total Commission"
            value={fmtCurrency(result.totalCommission)}
            gold
          />
          {agentShareResultElements}
          {result.warning && (
            <p className="text-red-400 text-xs mt-2">{result.warning}</p>
          )}
          <Note>
            Enter share percentages that sum to 100%. Commission is calculated
            on the total deal value.
          </Note>
        </ResultBox>
      )}
    </div>
  );
}

// ─── Tool Config ────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "stamp-duty",
    icon: <Calculator size={22} className="text-[#c9a84c]" />,
    title: "Stamp Duty Calculator",
    desc: "Calculate Gujarat stamp duty & registration charges for any property transaction.",
    component: <StampDutyCalc />,
  },
  {
    id: "tds",
    icon: <TrendingUp size={22} className="text-[#c9a84c]" />,
    title: "TDS Calculator (194IA)",
    desc: "Find TDS applicable on property sale for Resident Indian and NRI sellers.",
    component: <TDSCalc />,
  },
  {
    id: "cap-gains",
    icon: <BarChart2 size={22} className="text-[#c9a84c]" />,
    title: "Capital Gains Calculator",
    desc: "Calculate STCG or LTCG with CII indexation for any property sale.",
    component: <CapGainsCalc />,
  },
  {
    id: "rental-yield",
    icon: <Home size={22} className="text-[#c9a84c]" />,
    title: "Rental Yield Calculator",
    desc: "Compute gross & net rental yield and monthly cash flow for any property.",
    component: <RentalYieldCalc />,
  },
  {
    id: "tax-benefit",
    icon: <PiggyBank size={22} className="text-[#c9a84c]" />,
    title: "Home Loan Tax Benefit",
    desc: "Estimate annual tax savings under Section 24 and Section 80C on your home loan.",
    component: <HomeLoanTaxCalc />,
  },
  {
    id: "redevelopment",
    icon: <Building2 size={22} className="text-[#c9a84c]" />,
    title: "Redevelopment Feasibility",
    desc: "Check if a plot can be redeveloped profitably using FSI and construction cost.",
    component: <RedevelopmentCalc />,
  },
  {
    id: "insurance",
    icon: <Shield size={22} className="text-[#c9a84c]" />,
    title: "Property Insurance Estimator",
    desc: "Get annual premium range for home or commercial property insurance.",
    component: <InsuranceCalc />,
  },
  {
    id: "interior",
    icon: <Sofa size={22} className="text-[#c9a84c]" />,
    title: "Interior Cost Estimator",
    desc: "Estimate interior design costs by area and finish level for Ahmedabad 2024–25.",
    component: <InteriorCalc />,
  },
  {
    id: "maintenance",
    icon: <Users size={22} className="text-[#c9a84c]" />,
    title: "Society Maintenance Estimator",
    desc: "Calculate monthly maintenance charges with amenity add-ons by society type.",
    component: <MaintenanceCalc />,
  },
  {
    id: "emi",
    icon: <CreditCard size={22} className="text-[#c9a84c]" />,
    title: "EMI Calculator",
    desc: "Calculate monthly EMI, total interest, and year-by-year repayment schedule.",
    component: <EMICalc />,
  },
  {
    id: "loan-eligibility",
    icon: <Wallet size={22} className="text-[#c9a84c]" />,
    title: "Loan Eligibility Calculator",
    desc: "Find your maximum eligible home loan amount based on income and existing EMIs.",
    component: <LoanEligibilityCalc />,
  },
  {
    id: "rent-vs-buy",
    icon: <Scale size={22} className="text-[#c9a84c]" />,
    title: "Rent vs Buy Comparison",
    desc: "Compare the 10-year cost of owning a property versus renting it.",
    component: <RentVsBuyCalc />,
  },
  {
    id: "investment-roi",
    icon: <BarChart2 size={22} className="text-[#c9a84c]" />,
    title: "Investment ROI Calculator",
    desc: "Calculate total return, CAGR, and rental income for property investments.",
    component: <InvestmentROICalc />,
  },
  {
    id: "nri-repatriation",
    icon: <Globe size={22} className="text-[#c9a84c]" />,
    title: "NRI Repatriation Calculator",
    desc: "Estimate TDS and net repatriable amount for NRI property sales in India.",
    component: <NRIRepatriationCalc />,
  },
  {
    id: "packers-movers",
    icon: <Truck size={22} className="text-[#c9a84c]" />,
    title: "Packers & Movers Estimator",
    desc: "Get estimated relocation costs by home size, move type, and floor level.",
    component: <PackersMoversCalc />,
  },
  {
    id: "gst-property",
    icon: <Receipt size={22} className="text-[#c9a84c]" />,
    title: "GST on Property Calculator",
    desc: "Calculate GST payable on under-construction, ready-to-move, and land purchases.",
    component: <GSTPropertyCalc />,
  },
  {
    id: "rental-income-tax",
    icon: <FileText size={22} className="text-[#c9a84c]" />,
    title: "Income Tax on Rental Income",
    desc: "Estimate tax on rental income after standard deductions and loan interest.",
    component: <RentalIncomeTaxCalc />,
  },
  {
    id: "commission-split",
    icon: <Users size={22} className="text-[#c9a84c]" />,
    title: "Commission Split Calculator",
    desc: "Split brokerage commission among multiple agents with share validation.",
    component: <CommissionSplitCalc />,
  },
  {
    id: "break-even",
    icon: <Clock size={22} className="text-[#c9a84c]" />,
    title: "Break-even Calculator",
    desc: "Find the year when buying a property becomes cheaper than renting it.",
    component: <BreakEvenCalc />,
  },
  {
    id: "prepayment-optimizer",
    icon: <TrendingUp size={22} className="text-[#c9a84c]" />,
    title: "Part-Prepayment Optimizer",
    desc: "Calculate interest and time saved by making a lump-sum prepayment on your home loan.",
    component: <PrepaymentOptimizer />,
  },
  {
    id: "loan-restructuring",
    icon: <RefreshCcw size={22} className="text-[#c9a84c]" />,
    title: "Loan Restructuring Calculator",
    desc: "Analyse impact of lower rate + extended tenure on EMI and total interest cost.",
    component: <LoanRestructuringCalc />,
  },
  {
    id: "gst-property",
    icon: <Percent size={22} className="text-[#c9a84c]" />,
    title: "GST on Property Calculator",
    desc: "Calculate GST on under-construction properties — affordable (1%), regular/luxury (5%).",
    component: <GSTPropertyCalc />,
  },
  {
    id: "rental-income-tax",
    icon: <FileSearch size={22} className="text-[#c9a84c]" />,
    title: "Income Tax on Rental Income",
    desc: "Compute taxable rent with Sec 24(a) standard deduction & Sec 24(b) interest deduction.",
    component: <RentalIncomeTaxCalc />,
  },
  {
    id: "portfolio-builder",
    icon: <Layers size={22} className="text-[#c9a84c]" />,
    title: "Portfolio Builder",
    desc: "Add multiple properties to see total value, rental yield, cash flow & portfolio CAGR.",
    component: <PortfolioBuilder />,
  },
];

// ─── Main Export ────────────────────────────────────────────────────────────
export default function AdminDashboardToolsTab() {
  const [openTool, setOpenTool] = useState<string | null>(null);
  const currentTool = TOOLS.find((t) => t.id === openTool);

  return (
    <div className="py-2" data-ocid="tools.section">
      <div className="mb-6">
        <h2 className="text-[#c9a84c] text-xl font-semibold">
          Financial Tools
        </h2>
        <p className="text-[#e8e8e8]/50 text-sm mt-1">
          25 professional calculators for property transactions, taxation, and
          investment decisions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool, idx) => (
          <div
            key={tool.id}
            className="bg-[#0f1319] rounded-xl border border-[#c9a84c]/20 p-5 flex flex-col gap-3 hover:border-[#c9a84c]/60 transition-colors"
            data-ocid={`tools.card.${idx + 1}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#c9a84c]/10">{tool.icon}</div>
              <h3 className="text-[#c9a84c] font-semibold text-sm leading-tight">
                {tool.title}
              </h3>
            </div>
            <p className="text-[#e8e8e8]/60 text-xs leading-relaxed flex-1">
              {tool.desc}
            </p>
            <button
              type="button"
              onClick={() => setOpenTool(tool.id)}
              className="bg-[#c9a84c] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e2b96a] transition-colors w-full"
              data-ocid={`tools.open_modal_button.${idx + 1}`}
            >
              Open Calculator
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={!!openTool}
        onClose={() => setOpenTool(null)}
        title={currentTool?.title ?? ""}
      >
        {currentTool?.component}
      </Modal>
    </div>
  );
}
