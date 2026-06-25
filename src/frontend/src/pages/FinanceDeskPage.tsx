import SecureAppGate from "@/components/shared/SecureAppGate";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Home,
  Menu,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const _fmt = (n: number) =>
  new Intl.NumberFormat("en-IN").format(Math.round(n));

const TABS = [
  "EMI Calculator",
  "Home Loan Eligibility",
  "SIP Returns",
  "Capital Gains Tax",
  "Stamp Duty",
  "Rental Yield",
];

const RATES = [
  { bank: "RBI Repo Rate", rate: "6.50%", type: "Policy", updated: "Jun 2026" },
  {
    bank: "SBI Home Loan",
    rate: "8.50%",
    type: "Floating",
    updated: "Jun 2026",
  },
  { bank: "HDFC Bank", rate: "8.65%", type: "Floating", updated: "Jun 2026" },
  { bank: "ICICI Bank", rate: "8.75%", type: "Floating", updated: "Jun 2026" },
  {
    bank: "Bank of Baroda",
    rate: "8.40%",
    type: "Floating",
    updated: "Jun 2026",
  },
  {
    bank: "Kotak Mahindra",
    rate: "8.70%",
    type: "Floating",
    updated: "Jun 2026",
  },
  { bank: "Axis Bank", rate: "8.75%", type: "Floating", updated: "Jun 2026" },
  {
    bank: "LIC Housing Finance",
    rate: "8.75%",
    type: "Fixed",
    updated: "Jun 2026",
  },
  { bank: "PNB Housing", rate: "8.55%", type: "Floating", updated: "Jun 2026" },
  {
    bank: "Bajaj Housing Finance",
    rate: "8.48%",
    type: "Floating",
    updated: "Jun 2026",
  },
];

function EMICalc() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const n = tenure * 12;
  const emi =
    n > 0
      ? (principal * monthlyRate * (1 + monthlyRate) ** n) /
        ((1 + monthlyRate) ** n - 1)
      : 0;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  const amortization: Array<{
    year: number;
    emi: number;
    interest: number;
    principal: number;
    balance: number;
  }> = [];
  let balance = principal;
  for (let y = 1; y <= Math.min(tenure, 5); y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      const intPart = balance * monthlyRate;
      const prinPart = emi - intPart;
      yearInterest += intPart;
      yearPrincipal += prinPart;
      balance -= prinPart;
    }
    amortization.push({
      year: y,
      emi: emi * 12,
      interest: yearInterest,
      principal: yearPrincipal,
      balance: Math.max(0, balance),
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
          <input
            type="range"
            min="500000"
            max="50000000"
            step="100000"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full mt-2 accent-[#c9a84c]"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
          <input
            type="range"
            min="6"
            max="16"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full mt-2 accent-[#c9a84c]"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Tenure (Years)
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="w-full mt-2 accent-[#c9a84c]"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Monthly EMI", value: INR(emi) },
          { label: "Total Interest", value: INR(totalInterest) },
          { label: "Total Payment", value: INR(totalPayment) },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 text-center"
          >
            <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
            <div className="text-lg font-bold text-gold-400">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gold-800/30">
              {["Year", "Annual EMI", "Interest", "Principal", "Balance"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-2 pr-4 text-gold-400 font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {amortization.map((row) => (
              <tr
                key={row.year}
                className="border-b border-gold-900/20 hover:bg-gold-900/10"
              >
                <td className="py-1.5 pr-4 text-muted-foreground">
                  Year {row.year}
                </td>
                <td className="py-1.5 pr-4 text-foreground">{INR(row.emi)}</td>
                <td className="py-1.5 pr-4 text-red-400">
                  {INR(row.interest)}
                </td>
                <td className="py-1.5 pr-4 text-green-400">
                  {INR(row.principal)}
                </td>
                <td className="py-1.5 pr-4 text-foreground">
                  {INR(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-2">
          Showing first 5 years of amortization
        </p>
      </div>
    </div>
  );
}

function EligibilityCalc() {
  const [income, setIncome] = useState(150000);
  const [existing, setExisting] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const maxEMI = income * 0.5 - existing;
  const monthlyRate = rate / 12 / 100;
  const n = tenure * 12;
  const eligible =
    maxEMI > 0
      ? (maxEMI * ((1 + monthlyRate) ** n - 1)) /
        (monthlyRate * (1 + monthlyRate) ** n)
      : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Monthly Net Income (₹)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Existing EMI Obligations (₹)
          </label>
          <input
            type="number"
            value={existing}
            onChange={(e) => setExisting(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Applicable Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Loan Tenure (Years)
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-5 text-center">
          <div className="text-xs text-muted-foreground mb-2">
            Max Eligible EMI
          </div>
          <div className="text-2xl font-bold text-gold-400">
            {INR(maxEMI)}/mo
          </div>
        </div>
        <div className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-5 text-center">
          <div className="text-xs text-muted-foreground mb-2">
            Loan Eligibility
          </div>
          <div className="text-2xl font-bold text-green-400">
            {INR(eligible)}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Based on 50% FOIR (Fixed Obligation to Income Ratio) norms followed by
        Indian banks. Actual eligibility may vary.
      </p>
    </div>
  );
}

function SIPCalc() {
  const [monthly, setMonthly] = useState(25000);
  const [returns, setReturns] = useState(12);
  const [years, setYears] = useState(15);

  const n = years * 12;
  const r = returns / 12 / 100;
  const maturity = monthly * (((1 + r) ** n - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains = maturity - invested;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Monthly SIP (₹)",
            val: monthly,
            set: setMonthly,
            min: 1000,
            max: 500000,
            step: 1000,
          },
          {
            label: "Expected Returns (%/yr)",
            val: returns,
            set: setReturns,
            min: 6,
            max: 25,
            step: 0.5,
          },
          {
            label: "Time Period (Years)",
            val: years,
            set: setYears,
            min: 1,
            max: 40,
            step: 1,
          },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs text-gold-400 mb-1">
              {f.label}
            </label>
            <input
              type="number"
              step={f.step}
              value={f.val}
              onChange={(e) => f.set(+e.target.value)}
              className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
            />
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.val}
              onChange={(e) => f.set(+e.target.value)}
              className="w-full mt-2 accent-[#c9a84c]"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Amount Invested",
            val: INR(invested),
            color: "text-foreground",
          },
          {
            label: "Estimated Returns",
            val: INR(gains),
            color: "text-green-400",
          },
          {
            label: "Maturity Value",
            val: INR(maturity),
            color: "text-gold-400",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 text-center"
          >
            <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
            <div className={`text-lg font-bold ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CapitalGainsCalc() {
  const [buyPrice, setBuyPrice] = useState(3000000);
  const [sellPrice, setSellPrice] = useState(5500000);
  const [buyYear, setBuyYear] = useState(2018);
  const [sellYear, setSellYear] = useState(2026);

  const holding = sellYear - buyYear;
  const isLTCG = holding >= 2;
  const gain = sellPrice - buyPrice;
  const indexedCost = isLTCG ? buyPrice * 1.05 ** holding : buyPrice;
  const taxableGain = isLTCG ? Math.max(0, sellPrice - indexedCost) : gain;
  const taxRate = isLTCG ? 0.125 : 0.3;
  const tax = taxableGain * taxRate;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Purchase Price (₹)", val: buyPrice, set: setBuyPrice },
          { label: "Sale Price (₹)", val: sellPrice, set: setSellPrice },
          { label: "Purchase Year", val: buyYear, set: setBuyYear },
          { label: "Sale Year", val: sellYear, set: setSellYear },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs text-gold-400 mb-1">
              {f.label}
            </label>
            <input
              type="number"
              value={f.val}
              onChange={(e) => f.set(+e.target.value)}
              className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Holding Period",
            val: `${holding} yrs`,
            color: "text-foreground",
          },
          {
            label: "Type",
            val: isLTCG ? "LTCG (12.5%)" : "STCG (30%)",
            color: isLTCG ? "text-green-400" : "text-red-400",
          },
          {
            label: "Taxable Gain",
            val: INR(taxableGain),
            color: "text-foreground",
          },
          { label: "Approx Tax", val: INR(tax), color: "text-red-400" },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 text-center"
          >
            <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
            <div className={`text-base font-bold ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        LTCG on immovable property held &gt;2 years taxed at 12.5% (Finance Act
        2024). STCG at applicable slab. Consult your CA before filing.
      </p>
    </div>
  );
}

function StampDutyCalc() {
  const [value, setValue] = useState(5000000);
  const [type, setType] = useState("Residential");
  const [gender, setGender] = useState("Male");

  const rates: Record<string, Record<string, number>> = {
    Residential: { Male: 0.045, Female: 0.04, Joint: 0.04 },
    Commercial: { Male: 0.05, Female: 0.05, Joint: 0.05 },
    Agricultural: { Male: 0.03, Female: 0.03, Joint: 0.03 },
  };
  const stamp = value * (rates[type]?.[gender] ?? 0.045);
  const registration = value * 0.01;
  const total = stamp + registration;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Property Value (₹)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          >
            {["Residential", "Commercial", "Agricultural"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gold-400 mb-1">
            Buyer Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
          >
            {["Male", "Female", "Joint"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Stamp Duty", val: INR(stamp), color: "text-gold-400" },
          {
            label: "Registration",
            val: INR(registration),
            color: "text-foreground",
          },
          { label: "Total Cost", val: INR(total), color: "text-green-400" },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 text-center"
          >
            <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
            <div className={`text-lg font-bold ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Gujarat stamp duty: Residential 4–4.5%, Commercial 5%, Agricultural 3%.
        Registration: 1% of value. Female buyers get 0.5% concession.
      </p>
    </div>
  );
}

function RentalYieldCalc() {
  const [propValue, setPropValue] = useState(5000000);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [maintenance, setMaintenance] = useState(2000);

  const annualRent = monthlyRent * 12;
  const annualMaint = maintenance * 12;
  const netRent = annualRent - annualMaint;
  const grossYield = (annualRent / propValue) * 100;
  const netYield = (netRent / propValue) * 100;
  const payback = propValue / annualRent;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Property Value (₹)", val: propValue, set: setPropValue },
          { label: "Monthly Rent (₹)", val: monthlyRent, set: setMonthlyRent },
          {
            label: "Monthly Maintenance (₹)",
            val: maintenance,
            set: setMaintenance,
          },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs text-gold-400 mb-1">
              {f.label}
            </label>
            <input
              type="number"
              value={f.val}
              onChange={(e) => f.set(+e.target.value)}
              className="w-full bg-[#0e1420] border border-gold-800/40 rounded-lg px-3 py-2 text-sm text-foreground"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Annual Rent",
            val: INR(annualRent),
            color: "text-foreground",
          },
          {
            label: "Gross Yield",
            val: `${grossYield.toFixed(2)}%`,
            color: "text-gold-400",
          },
          {
            label: "Net Yield",
            val: `${netYield.toFixed(2)}%`,
            color: "text-green-400",
          },
          {
            label: "Payback Period",
            val: `${payback.toFixed(1)} yrs`,
            color: "text-foreground",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 text-center"
          >
            <div className="text-xs text-muted-foreground mb-1">{c.label}</div>
            <div className={`text-lg font-bold ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CALC_COMPONENTS: Record<string, React.ComponentType> = {
  "EMI Calculator": EMICalc,
  "Home Loan Eligibility": EligibilityCalc,
  "SIP Returns": SIPCalc,
  "Capital Gains Tax": CapitalGainsCalc,
  "Stamp Duty": StampDutyCalc,
  "Rental Yield": RentalYieldCalc,
};

export default function FinanceDeskPage() {
  const [activeTab, setActiveTab] = useState("EMI Calculator");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const CalcComponent = CALC_COMPONENTS[activeTab];

  return (
    <SecureAppGate appName="Finance Desk">
      <div className="min-h-screen bg-[#06090f] text-gold-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-800/30 bg-[#0a0e1a] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gold-900/20 md:hidden"
            data-ocid="finance-desk.menu_toggle"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
          <Link
            to="/apps"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm"
            data-ocid="finance-desk.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <div className="flex-1">
            <h1
              className="text-lg font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Finance Desk
            </h1>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              role="presentation"
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSidebarOpen(false);
              }}
            />
          )}
          {/* Sidebar — desktop: always visible flex sibling; mobile: fixed overlay */}
          <aside
            className={`
              flex-shrink-0 w-64 bg-[#0a0e1a] border-r border-gold-800/30 flex flex-col
              md:relative md:translate-x-0
              fixed inset-y-0 left-0 z-50 transition-transform duration-200
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-gold-800/20">
              <span className="font-bold text-gold-400 text-sm">
                Calculators
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gold-900/20 rounded md:hidden"
                data-ocid="finance-desk.close_sidebar"
              >
                <X className="w-4 h-4 text-gold-400" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${activeTab === tab ? "bg-gold-900/30 text-gold-300 border border-gold-700/30" : "text-muted-foreground hover:bg-gold-900/10 hover:text-gold-400"}`}
                  data-ocid={`finance-desk.calc_tab.${tab.toLowerCase().replace(/ /g, "_")}`}
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  {tab}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Repo Rate",
                  val: "6.50%",
                  icon: TrendingUp,
                  color: "text-gold-400",
                },
                {
                  label: "SBI Home Loan",
                  val: "8.50%",
                  icon: Home,
                  color: "text-green-400",
                },
                {
                  label: "HDFC Rate",
                  val: "8.65%",
                  icon: DollarSign,
                  color: "text-blue-400",
                },
                {
                  label: "Inflation (CPI)",
                  val: "4.83%",
                  icon: Calculator,
                  color: "text-orange-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Calculator panel */}
            <div className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4 md:p-6">
              <h2
                className="text-base font-bold text-gold-400 mb-5"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {activeTab}
              </h2>
              <CalcComponent />
            </div>

            {/* Rates table */}
            <div className="bg-[#0e1420] rounded-xl border border-gold-800/30 p-4">
              <h3 className="text-sm font-bold text-gold-400 mb-3">
                Current Home Loan Rates (Jun 2026)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-800/30">
                      {["Bank/NBFC", "Rate", "Type", "Updated"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 text-gold-400 text-xs font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RATES.map((r, i) => (
                      <tr
                        key={r.bank}
                        className={`border-b border-gold-900/20 hover:bg-gold-900/10 ${i === 0 ? "font-semibold" : ""}`}
                        data-ocid={`finance-desk.rate.${i + 1}`}
                      >
                        <td className="py-2 pr-4 text-foreground">{r.bank}</td>
                        <td className="py-2 pr-4 text-gold-400 font-bold">
                          {r.rate}
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs border ${r.type === "Fixed" ? "bg-blue-900/30 text-blue-300 border-blue-700/30" : "bg-green-900/30 text-green-300 border-green-700/30"}`}
                          >
                            {r.type}
                          </span>
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {r.updated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SecureAppGate>
  );
}
