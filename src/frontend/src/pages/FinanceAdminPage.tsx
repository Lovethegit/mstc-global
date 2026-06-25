import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import SecureAppGate from "@/components/shared/SecureAppGate";
import { useInvoices } from "@/hooks/useCrmQueries";
import type { CommissionInvoice } from "@/types/crm";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 10_000_000
    ? `₹${(n / 10_000_000).toFixed(2)} Cr`
    : n >= 100_000
      ? `₹${(n / 100_000).toFixed(2)} L`
      : `₹${Math.round(n).toLocaleString("en-IN")}`;

function calcEMI(p: number, rAnnual: number, months: number) {
  const r = rAnnual / 1200;
  if (r === 0) return p / months;
  return (p * r * (1 + r) ** months) / ((1 + r) ** months - 1);
}

const inp =
  "w-full mt-1 px-3 py-2.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm focus:border-gold-500/60 focus:outline-none transition-colors";
const sel =
  "w-full mt-1 px-3 py-2.5 rounded-lg border border-gold-800/40 bg-background text-foreground text-sm focus:border-gold-500/60 focus:outline-none";
const lbl = "text-xs font-medium text-gold-600";
const resultBox = "rounded-lg bg-gold-700/10 border border-gold-700/30 p-3";
const resultRow = "flex justify-between items-center py-1";

const MOCK_INVOICES: CommissionInvoice[] = [
  {
    id: 1n,
    clientName: "Rajesh Mehta",
    serviceType: "Property Sale",
    amount: 8500000n,
    commission: 170000n,
    status: "Paid",
    dueDate: 0n,
    paidDate: [0n],
    description: "2% commission on Prahlad Nagar 3BHK",
    createdAt: 0n,
  },
  {
    id: 2n,
    clientName: "Anita Joshi",
    serviceType: "Commercial Lease",
    amount: 660000n,
    commission: 66000n,
    status: "Pending",
    dueDate: 0n,
    paidDate: [],
    description: "Annual lease facilitation",
    createdAt: 0n,
  },
  {
    id: 3n,
    clientName: "Priya Shah",
    serviceType: "Home Loan",
    amount: 7000000n,
    commission: 35000n,
    status: "Paid",
    dueDate: 0n,
    paidDate: [0n],
    description: "0.5% RERA commission",
    createdAt: 0n,
  },
  {
    id: 4n,
    clientName: "Vikram Patel",
    serviceType: "Property Sale",
    amount: 6500000n,
    commission: 130000n,
    status: "Overdue",
    dueDate: 0n,
    paidDate: [],
    description: "2% commission on Navrangpura plot",
    createdAt: 0n,
  },
  {
    id: 5n,
    clientName: "Neha Agarwal",
    serviceType: "Property Rental",
    amount: 360000n,
    commission: 36000n,
    status: "Paid",
    dueDate: 0n,
    paidDate: [0n],
    description: "1 month rental commission — Bopal 2BHK",
    createdAt: 0n,
  },
  {
    id: 6n,
    clientName: "Suresh Kothari",
    serviceType: "Redevelopment",
    amount: 45000000n,
    commission: 900000n,
    status: "Pending",
    dueDate: 0n,
    paidDate: [],
    description: "2% on Maninagar society redevelopment",
    createdAt: 0n,
  },
];

function EmiCalc() {
  const [p, setP] = useState("");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");
  const [showResult, setShowResult] = useState(false);

  const months = Number(years) * 12;
  const emi = showResult && p ? calcEMI(Number(p), Number(rate), months) : 0;
  const totalAmt = emi * months;
  const totalInterest = totalAmt - Number(p);

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Loan Amount (₹)</label>
        <input
          type="number"
          value={p}
          onChange={(e) => {
            setP(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 5000000"
          className={inp}
          data-ocid="finance.emi_principal_input"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Interest Rate (% p.a.)</label>
          <input
            type="number"
            value={rate}
            step="0.05"
            onChange={(e) => {
              setRate(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Tenure (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => {
              setYears(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
        data-ocid="finance.emi_calc_button"
      >
        Calculate EMI
      </button>
      {showResult && emi > 0 && (
        <div className="space-y-2">
          <div className={`${resultBox} text-center`}>
            <p className="text-xs text-gold-600 mb-1">Monthly EMI</p>
            <p className="font-serif text-2xl font-bold text-gold-400">
              {fmt(emi)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="font-semibold text-red-300 text-sm mt-0.5">
                {fmt(totalInterest)}
              </p>
            </div>
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="font-semibold text-gold-300 text-sm mt-0.5">
                {fmt(totalAmt)}
              </p>
            </div>
          </div>
          <div className={resultBox}>
            <p className="text-xs text-muted-foreground mb-1">
              Loan-to-Interest Ratio
            </p>
            <div className="w-full h-2 bg-gold-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full"
                style={{
                  width: `${Math.min(100, (Number(p) / totalAmt) * 100).toFixed(1)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
              <span>
                Principal: {((Number(p) / totalAmt) * 100).toFixed(1)}%
              </span>
              <span>
                Interest: {((totalInterest / totalAmt) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StampDutyCalc() {
  const [value, setValue] = useState("");
  const [genderType, setGenderType] = useState("male");
  const [showResult, setShowResult] = useState(false);

  const rates: Record<string, number> = {
    male: 0.049,
    female: 0.039,
    joint: 0.044,
  };
  const stampRate = rates[genderType] ?? 0.049;
  const stamp = showResult && value ? Number(value) * stampRate : 0;
  const reg = showResult && value ? Number(value) * 0.01 : 0;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Property Value (₹)</label>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 8500000"
          className={inp}
          data-ocid="finance.stamp_value_input"
        />
      </div>
      <div>
        <label className={lbl}>Buyer Category</label>
        <select
          value={genderType}
          onChange={(e) => {
            setGenderType(e.target.value);
            setShowResult(false);
          }}
          className={sel}
        >
          <option value="male">Male (4.9%)</option>
          <option value="female">Female (3.9%) — 1% concession</option>
          <option value="joint">Joint (4.4%) — avg</option>
        </select>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
        data-ocid="finance.stamp_calc_button"
      >
        Calculate
      </button>
      {showResult && stamp > 0 && (
        <div className="space-y-2">
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Stamp Duty ({(stampRate * 100).toFixed(1)}%)
              </span>
              <span className="text-gold-400 font-semibold">{fmt(stamp)}</span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Registration (1%)
              </span>
              <span className="text-gold-400 font-semibold">{fmt(reg)}</span>
            </div>
            <div className="border-t border-gold-800/30 mt-2 pt-2">
              <div className={resultRow}>
                <span className="text-sm font-semibold text-foreground">
                  Total Govt. Charges
                </span>
                <span className="text-gold-300 font-bold text-lg">
                  {fmt(stamp + reg)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Gujarat rates. Verify with sub-registrar before payment.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 2. Home Loan Eligibility ──────────────────────────────────────────────────
function LoanEligibilityCalc() {
  const [income, setIncome] = useState("");
  const [existingEmi, setExistingEmi] = useState("0");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");
  const [showResult, setShowResult] = useState(false);

  const maxMonthlyEmi = (Number(income) / 12) * 0.5 - Number(existingEmi);
  const months = Number(years) * 12;
  const r = Number(rate) / 1200;
  const maxLoan =
    showResult && r > 0
      ? (maxMonthlyEmi * ((1 + r) ** months - 1)) / (r * (1 + r) ** months)
      : 0;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Annual Income (₹)</label>
        <input
          type="number"
          value={income}
          onChange={(e) => {
            setIncome(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 1200000"
          className={inp}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Existing EMIs (₹/month)</label>
          <input
            type="number"
            value={existingEmi}
            onChange={(e) => {
              setExistingEmi(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Rate (% p.a.)</label>
          <input
            type="number"
            value={rate}
            step="0.05"
            onChange={(e) => {
              setRate(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
      </div>
      <div>
        <label className={lbl}>Loan Tenure (years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => {
            setYears(e.target.value);
            setShowResult(false);
          }}
          className={inp}
        />
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
        data-ocid="finance.eligibility_calc_button"
      >
        Check Eligibility
      </button>
      {showResult && maxLoan > 0 && (
        <div className="space-y-2">
          <div className={`${resultBox} text-center`}>
            <p className="text-xs text-gold-600">Maximum Eligible Loan</p>
            <p className="font-serif text-2xl font-bold text-gold-400">
              {fmt(maxLoan)}
            </p>
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Eligible EMI (50% FOIR)
              </span>
              <span className="text-gold-300 text-sm font-medium">
                {fmt(maxMonthlyEmi)}/mo
              </span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Monthly Income
              </span>
              <span className="text-foreground text-sm">
                {fmt(Number(income) / 12)}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            * Based on 50% FOIR. Actual bank approval may vary.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 4. Capital Gains Tax ──────────────────────────────────────────────────────
function CapitalGainsCalc() {
  const [purchase, setPurchase] = useState("");
  const [sale, setSale] = useState("");
  const [years, setYears] = useState("3");
  const [showResult, setShowResult] = useState(false);

  const isLTCG = Number(years) >= 2;
  const gain =
    showResult && sale ? Math.max(0, Number(sale) - Number(purchase)) : 0;
  const indexedCost = Number(purchase) * (1 + 0.04 * Number(years));
  const indexedGain = isLTCG ? Math.max(0, Number(sale) - indexedCost) : gain;
  const tax = isLTCG ? indexedGain * 0.2 : gain * 0.3;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Purchase Price (₹)</label>
          <input
            type="number"
            value={purchase}
            onChange={(e) => {
              setPurchase(e.target.value);
              setShowResult(false);
            }}
            placeholder="e.g. 5000000"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Sale Price (₹)</label>
          <input
            type="number"
            value={sale}
            onChange={(e) => {
              setSale(e.target.value);
              setShowResult(false);
            }}
            placeholder="e.g. 8000000"
            className={inp}
          />
        </div>
      </div>
      <div>
        <label className={lbl}>Holding Period (years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => {
            setYears(e.target.value);
            setShowResult(false);
          }}
          className={inp}
        />
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Calculate Tax
      </button>
      {showResult && (
        <div className="space-y-2">
          <div className={`${resultBox} flex justify-between items-center`}>
            <span className="text-xs text-muted-foreground">Type</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${isLTCG ? "bg-green-900/30 text-green-300" : "bg-orange-900/30 text-orange-300"}`}
            >
              {isLTCG ? "LTCG (≥2 yrs)" : "STCG (<2 yrs)"}
            </span>
          </div>
          {gain > 0 && (
            <div className={resultBox}>
              <div className={resultRow}>
                <span className="text-xs text-muted-foreground">
                  Actual Gain
                </span>
                <span className="text-gold-400">{fmt(gain)}</span>
              </div>
              {isLTCG && (
                <div className={resultRow}>
                  <span className="text-xs text-muted-foreground">
                    Indexed Gain (CII approx)
                  </span>
                  <span className="text-gold-400">{fmt(indexedGain)}</span>
                </div>
              )}
              <div className="border-t border-gold-800/30 mt-2 pt-2">
                <div className={resultRow}>
                  <span className="text-sm font-semibold text-foreground">
                    Tax Liability
                  </span>
                  <span className="text-red-400 font-bold text-lg">
                    {fmt(tax)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {isLTCG
                    ? "20% LTCG with indexation"
                    : "30% STCG at slab rate"}{" "}
                  + 4% cess
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 5. Rental Yield Calculator ───────────────────────────────────────────────
function RentalYieldCalc() {
  const [propVal, setPropVal] = useState("");
  const [rent, setRent] = useState("");
  const [showResult, setShowResult] = useState(false);

  const annualRent = Number(rent) * 12;
  const grossYield =
    showResult && propVal ? (annualRent / Number(propVal)) * 100 : 0;
  const netYield = grossYield * 0.85;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Property Value (₹)</label>
        <input
          type="number"
          value={propVal}
          onChange={(e) => {
            setPropVal(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 8000000"
          className={inp}
        />
      </div>
      <div>
        <label className={lbl}>Monthly Rent (₹)</label>
        <input
          type="number"
          value={rent}
          onChange={(e) => {
            setRent(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 30000"
          className={inp}
        />
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Calculate Yield
      </button>
      {showResult && grossYield > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className={`${resultBox} text-center`}>
              <p className="text-xs text-muted-foreground">Gross Yield</p>
              <p className="font-serif text-2xl font-bold text-gold-400">
                {grossYield.toFixed(2)}%
              </p>
            </div>
            <div className={`${resultBox} text-center`}>
              <p className="text-xs text-muted-foreground">
                Net Yield (~15% exp)
              </p>
              <p className="font-serif text-2xl font-bold text-green-400">
                {netYield.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">Annual Rent</span>
              <span className="text-gold-400">{fmt(annualRent)}</span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Ahmedabad Avg
              </span>
              <span className="text-muted-foreground">2.5–3.5%</span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">Rating</span>
              <span
                className={`text-xs font-bold ${grossYield >= 4 ? "text-green-300" : grossYield >= 2.5 ? "text-yellow-300" : "text-red-300"}`}
              >
                {grossYield >= 4
                  ? "Excellent"
                  : grossYield >= 2.5
                    ? "Good"
                    : "Below Average"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 6. Rent vs Buy ───────────────────────────────────────────────────────────
function RentVsBuyCalc() {
  const [rent, setRent] = useState("");
  const [price, setPrice] = useState("");
  const [yrs, setYrs] = useState("10");
  const [showResult, setShowResult] = useState(false);

  const totalRent = Number(rent) * 12 * Number(yrs) * 1.05;
  const emi = price ? calcEMI(Number(price) * 0.8, 8.5, Number(yrs) * 12) : 0;
  const totalEmi = emi * 12 * Number(yrs);
  const appreciation = price ? Number(price) * (1.08 ** Number(yrs) - 1) : 0;
  const netBuyCost = totalEmi - appreciation;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Monthly Rent (₹)</label>
        <input
          type="number"
          value={rent}
          onChange={(e) => {
            setRent(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 30000"
          className={inp}
        />
      </div>
      <div>
        <label className={lbl}>Property Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 8000000"
          className={inp}
        />
      </div>
      <div>
        <label className={lbl}>Duration (years)</label>
        <input
          type="number"
          value={yrs}
          onChange={(e) => {
            setYrs(e.target.value);
            setShowResult(false);
          }}
          className={inp}
        />
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Compare
      </button>
      {showResult && totalRent > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className={`${resultBox} text-center`}>
              <p className="text-xs text-muted-foreground">Total Rent Cost</p>
              <p className="font-serif text-xl font-bold text-red-400">
                {fmt(totalRent)}
              </p>
            </div>
            <div className={`${resultBox} text-center`}>
              <p className="text-xs text-muted-foreground">Net Buy Cost</p>
              <p className="font-serif text-xl font-bold text-green-400">
                {netBuyCost > 0 ? fmt(netBuyCost) : "Profit!"}
              </p>
            </div>
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Total EMI paid
              </span>
              <span className="text-gold-400">{fmt(totalEmi)}</span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                Appreciation (8% CAGR)
              </span>
              <span className="text-green-400">+{fmt(appreciation)}</span>
            </div>
            <div className="border-t border-gold-800/30 mt-2 pt-2">
              <p className="text-xs font-semibold text-center text-gold-300">
                {netBuyCost < totalRent
                  ? "Buying is MORE BENEFICIAL"
                  : "Renting may save more"}{" "}
                over {yrs} years
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7. Property ROI Calculator ───────────────────────────────────────────────
function PropertyROICalc() {
  const [purchase, setPurchase] = useState("");
  const [rent, setRent] = useState("");
  const [appreciation, setAppreciation] = useState("8");
  const [showResult, setShowResult] = useState(false);

  const yr5 =
    showResult && purchase
      ? Number(purchase) * (1 + Number(appreciation) / 100) ** 5
      : 0;
  const yr10 =
    showResult && purchase
      ? Number(purchase) * (1 + Number(appreciation) / 100) ** 10
      : 0;
  const rent5 = Number(rent) * 12 * 5;
  const rent10 = Number(rent) * 12 * 10;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Purchase Price (₹)</label>
        <input
          type="number"
          value={purchase}
          onChange={(e) => {
            setPurchase(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 7000000"
          className={inp}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Monthly Rental (₹)</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => {
              setRent(e.target.value);
              setShowResult(false);
            }}
            placeholder="e.g. 28000"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Appreciation (% p.a.)</label>
          <input
            type="number"
            value={appreciation}
            step="0.5"
            onChange={(e) => {
              setAppreciation(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Calculate ROI
      </button>
      {showResult && yr5 > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">5-Year Value</p>
              <p className="font-semibold text-gold-400">{fmt(yr5)}</p>
              <p className="text-[10px] text-green-400">+Rent {fmt(rent5)}</p>
            </div>
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">10-Year Value</p>
              <p className="font-semibold text-gold-400">{fmt(yr10)}</p>
              <p className="text-[10px] text-green-400">+Rent {fmt(rent10)}</p>
            </div>
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                5-yr Total Return
              </span>
              <span className="text-green-400 font-semibold">
                {fmt(yr5 - Number(purchase) + rent5)}
              </span>
            </div>
            <div className={resultRow}>
              <span className="text-xs text-muted-foreground">
                10-yr Total Return
              </span>
              <span className="text-green-400 font-semibold">
                {fmt(yr10 - Number(purchase) + rent10)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 8. Bank Loan Comparator ──────────────────────────────────────────────────
function LoanComparatorCalc() {
  const [amount, setAmount] = useState("");
  const [years, setYears] = useState("20");
  const [showResult, setShowResult] = useState(false);

  const banks = [
    { name: "SBI", rate: 8.5, special: "Best for salaried" },
    { name: "HDFC Bank", rate: 8.75, special: "Fastest processing" },
    { name: "ICICI Bank", rate: 9.0, special: "NRI-friendly" },
    { name: "Axis Bank", rate: 8.75, special: "Max loan 90%" },
    { name: "Bank of Baroda", rate: 8.4, special: "Lowest rate" },
    { name: "LIC HFL", rate: 8.75, special: "Senior citizen benefit" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Loan Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setShowResult(false);
            }}
            placeholder="e.g. 5000000"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Tenure (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => {
              setYears(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Compare Banks
      </button>
      {showResult && amount && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-800/30">
                {["Bank", "Rate", "EMI/mo", "Total Interest", "Best For"].map(
                  (h) => (
                    <th key={h} className="text-left py-1.5 pr-3 text-gold-600">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {banks.map((b, i) => {
                const emi = calcEMI(Number(amount), b.rate, Number(years) * 12);
                const totalInterest = emi * Number(years) * 12 - Number(amount);
                return (
                  <tr
                    key={b.name}
                    className={`border-b border-gold-900/20 ${i === 4 ? "bg-gold-900/10" : ""}`}
                    data-ocid={`finance.bank_comparator.${i + 1}`}
                  >
                    <td className="py-1.5 pr-3 font-semibold text-foreground">
                      {b.name}
                    </td>
                    <td className="py-1.5 pr-3 text-gold-400 font-bold">
                      {b.rate}%
                    </td>
                    <td className="py-1.5 pr-3 text-gold-300">{fmt(emi)}</td>
                    <td className="py-1.5 pr-3 text-red-400">
                      {fmt(totalInterest)}
                    </td>
                    <td className="py-1.5 text-muted-foreground">
                      {b.special}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── 9. SIP Calculator ────────────────────────────────────────────────────────
function SIPCalc() {
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("10");
  const [rate, setRate] = useState("12");
  const [showResult, setShowResult] = useState(false);

  const months = Number(years) * 12;
  const r = Number(rate) / 1200;
  const maturity =
    showResult && monthly
      ? ((Number(monthly) * ((1 + r) ** months - 1)) / r) * (1 + r)
      : 0;
  const invested = Number(monthly) * months;
  const gains = maturity - invested;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Monthly Investment (₹)</label>
        <input
          type="number"
          value={monthly}
          onChange={(e) => {
            setMonthly(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 25000"
          className={inp}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Expected Return (% p.a.)</label>
          <input
            type="number"
            value={rate}
            step="0.5"
            onChange={(e) => {
              setRate(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Duration (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => {
              setYears(e.target.value);
              setShowResult(false);
            }}
            className={inp}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Calculate Maturity
      </button>
      {showResult && maturity > 0 && (
        <div className="space-y-2">
          <div className={`${resultBox} text-center`}>
            <p className="text-xs text-gold-600">Maturity Amount</p>
            <p className="font-serif text-2xl font-bold text-gold-400">
              {fmt(maturity)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">Amount Invested</p>
              <p className="font-semibold text-foreground">{fmt(invested)}</p>
            </div>
            <div className={resultBox}>
              <p className="text-xs text-muted-foreground">Total Gains</p>
              <p className="font-semibold text-green-400">{fmt(gains)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 10. GST Calculator ───────────────────────────────────────────────────────
function GSTCalc() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("12");
  const [showResult, setShowResult] = useState(false);

  const gstAmt =
    showResult && amount ? (Number(amount) * Number(gstRate)) / 100 : 0;
  const total = Number(amount) + gstAmt;

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Base Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setShowResult(false);
          }}
          placeholder="e.g. 500000"
          className={inp}
        />
      </div>
      <div>
        <label className={lbl}>GST Rate</label>
        <select
          value={gstRate}
          onChange={(e) => {
            setGstRate(e.target.value);
            setShowResult(false);
          }}
          className={sel}
        >
          <option value="5">5% — Under Construction Property</option>
          <option value="12">12% — Commercial Property</option>
          <option value="18">18% — Services / Consulting</option>
          <option value="28">28% — Luxury Goods</option>
        </select>
      </div>
      <button
        type="button"
        onClick={() => setShowResult(true)}
        className="w-full py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-medium hover:bg-gold-500/30 transition-colors"
      >
        Calculate GST
      </button>
      {showResult && gstAmt > 0 && (
        <div className={resultBox}>
          <div className={resultRow}>
            <span className="text-xs text-muted-foreground">Base Amount</span>
            <span className="text-foreground">{fmt(Number(amount))}</span>
          </div>
          <div className={resultRow}>
            <span className="text-xs text-muted-foreground">
              GST ({gstRate}%)
            </span>
            <span className="text-gold-400 font-semibold">{fmt(gstAmt)}</span>
          </div>
          <div className="border-t border-gold-800/30 mt-2 pt-2">
            <div className={resultRow}>
              <span className="text-sm font-bold text-foreground">
                Total Amount
              </span>
              <span className="text-gold-300 font-bold text-lg">
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calculator Registry ──────────────────────────────────────────────────────
const CALC_LIST = [
  { id: "emi", label: "EMI Calculator", component: EmiCalc },
  {
    id: "eligibility",
    label: "Loan Eligibility",
    component: LoanEligibilityCalc,
  },
  { id: "stamp", label: "Stamp Duty", component: StampDutyCalc },
  { id: "capgains", label: "Capital Gains", component: CapitalGainsCalc },
  { id: "yield", label: "Rental Yield", component: RentalYieldCalc },
  { id: "rentvsbuy", label: "Rent vs Buy", component: RentVsBuyCalc },
  { id: "roi", label: "Property ROI", component: PropertyROICalc },
  { id: "compare", label: "Bank Comparator", component: LoanComparatorCalc },
  { id: "sip", label: "SIP Calculator", component: SIPCalc },
  { id: "gst", label: "GST Calculator", component: GSTCalc },
] as const;

type CalcId = (typeof CALC_LIST)[number]["id"];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FinanceAdminPage() {
  const { data: fetchedInvoices = [] } = useInvoices();
  const invoices: CommissionInvoice[] =
    fetchedInvoices.length > 0
      ? (fetchedInvoices as unknown as CommissionInvoice[])
      : MOCK_INVOICES;
  const [activeCalc, setActiveCalc] = useState<CalcId | null>("emi");

  const totalCommissions = invoices.reduce(
    (s, i) => s + Number(i.commission),
    0,
  );
  const paidCommissions = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + Number(i.commission), 0);
  const pendingCommissions = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + Number(i.commission), 0);

  const activeEntry = CALC_LIST.find((c) => c.id === activeCalc);
  const CalcComponent = activeEntry?.component ?? null;

  return (
    <SecureAppGate appName="Finance Desk">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="finance_admin.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <h1 className="font-serif font-bold text-lg text-foreground leading-tight">
                Finance Desk
              </h1>
              <p className="text-[11px] text-muted-foreground">
                10 working calculators · Indian rates · Real-time overview
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5 space-y-6">
          {/* Revenue Overview */}
          <section>
            <h2 className="font-serif font-semibold text-base text-gold-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Revenue Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "This Month",
                  value: "₹12.4 Cr",
                  sub: "+18% MoM",
                  color: "text-gold-400",
                },
                {
                  label: "Commission",
                  value: fmt(totalCommissions),
                  sub: `${invoices.length} invoices`,
                  color: "text-gold-300",
                },
                {
                  label: "Collected",
                  value: fmt(paidCommissions),
                  sub: "Settled",
                  color: "text-green-400",
                },
                {
                  label: "Pending",
                  value: fmt(pendingCommissions),
                  sub: "Due",
                  color: "text-yellow-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gold-800/30 bg-card p-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {s.label}
                  </p>
                  <p
                    className={`font-serif text-xl font-bold ${s.color} truncate`}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Live Rate Board */}
          <section className="rounded-xl border border-gold-800/30 bg-card p-4">
            <h2 className="font-serif font-semibold text-base text-foreground mb-3">
              Live Rate Board — India 2025
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-gold-700/10 border border-gold-700/20 p-3">
                <p className="text-[11px] text-gold-600 font-semibold uppercase tracking-wide mb-2">
                  RBI Policy
                </p>
                {[
                  ["Repo Rate", "6.50%"],
                  ["CRR", "4.00%"],
                  ["SLR", "18.00%"],
                  ["Last Change", "Feb 2025"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-gold-400 font-bold text-xs">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-gold-700/10 border border-gold-700/20 p-3">
                <p className="text-[11px] text-gold-600 font-semibold uppercase tracking-wide mb-2">
                  Home Loan Rates
                </p>
                {[
                  ["SBI", "8.50%–9.50%"],
                  ["HDFC Bank", "8.75%–9.75%"],
                  ["ICICI Bank", "9.00%–10.0%"],
                  ["Axis Bank", "8.75%–9.50%"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-gold-400 font-bold text-xs">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-gold-700/10 border border-gold-700/20 p-3">
                <p className="text-[11px] text-gold-600 font-semibold uppercase tracking-wide mb-2">
                  Gujarat Stamp Duty
                </p>
                {[
                  ["Male", "4.9%"],
                  ["Female", "3.9%"],
                  ["Joint", "4.4%"],
                  ["Registration", "1.0%"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-gold-400 font-bold text-xs">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-gold-700/10 border border-gold-700/20 p-3">
                <p className="text-[11px] text-gold-600 font-semibold uppercase tracking-wide mb-2">
                  Tax &amp; Charges
                </p>
                {[
                  ["GST (Const.)", "5%"],
                  ["TDS on Sale", "1% (>₹50L)"],
                  ["LTCG Tax", "20% (idx)"],
                  ["STCG Tax", "30% slab"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-gold-400 font-bold text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Financial Calculators */}
          <section>
            <h2 className="font-serif font-semibold text-base text-foreground mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gold-400" />
              Financial Calculators
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {CALC_LIST.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setActiveCalc(activeCalc === c.id ? null : (c.id as CalcId))
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${activeCalc === c.id ? "border-gold-500/60 bg-gold-700/20 text-gold-300" : "border-gold-800/30 bg-card text-muted-foreground hover:border-gold-600/40 hover:text-gold-400"}`}
                  data-ocid={`finance_admin.calc.${c.id}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {activeCalc && CalcComponent && (
              <div className="rounded-xl border border-gold-700/40 bg-card p-5 max-w-xl">
                <h3 className="font-serif font-semibold text-gold-400 mb-4 text-base">
                  {activeEntry?.label}
                </h3>
                <CalcComponent />
              </div>
            )}
          </section>

          {/* Commission Invoices */}
          <section>
            <h2 className="font-serif font-semibold text-base text-foreground mb-3">
              Commission Invoices
            </h2>
            <div className="rounded-xl border border-gold-800/30 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card border-b border-gold-800/30">
                  <tr>
                    {[
                      "Client",
                      "Service",
                      "Amount",
                      "Commission",
                      "Description",
                      "Status",
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
                  {invoices.map((inv, i) => (
                    <tr
                      key={String(inv.id)}
                      className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                      data-ocid={`finance_admin.invoice.item.${i + 1}`}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                        {inv.clientName}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                        {inv.serviceType}
                      </td>
                      <td className="px-3 py-2.5 text-right text-foreground">
                        {fmt(Number(inv.amount))}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gold-400 font-medium">
                        {fmt(Number(inv.commission))}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs max-w-[180px] truncate">
                        {inv.description}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                            inv.status === "Paid"
                              ? "bg-green-900/20 text-green-300 border-green-800/30"
                              : inv.status === "Overdue"
                                ? "bg-red-900/20 text-red-300 border-red-800/30"
                                : "bg-yellow-900/20 text-yellow-300 border-yellow-800/30"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <TutorialFloatingButton />
    </SecureAppGate>
  );
}
