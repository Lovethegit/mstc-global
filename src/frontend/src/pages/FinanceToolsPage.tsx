import {
  Calculator,
  CheckCircle,
  DollarSign,
  FileText,
  GitCompare,
  Home,
  TrendingUp,
} from "lucide-react";
import { type ChangeEvent, useState } from "react";

type TabId =
  | "sip"
  | "rental"
  | "wealth"
  | "downpayment"
  | "readiness"
  | "stampduty"
  | "buyvsrent";

const inp =
  "w-full bg-white/5 border border-yellow-900/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500/50";
const lbl = "text-xs text-gray-400 mb-1 block";
const resultBox =
  "mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-2";
const resultRow = "flex justify-between text-sm";

function fmt(n: number) {
  return `\u20B9${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
function fmtL(n: number) {
  return n >= 10000000
    ? `${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `${(n / 100000).toFixed(2)} L`
      : fmt(n);
}

function SIPvsProperty() {
  const [sip, setSip] = useState("15000");
  const [sipRate, setSipRate] = useState("12");
  const [propPrice, setPropPrice] = useState("6000000");
  const [down, setDown] = useState("20");
  const [loanRate, setLoanRate] = useState("8.75");
  const years = 20;
  const sipAmt = Number.parseFloat(sip) || 0;
  const sipR = (Number.parseFloat(sipRate) || 12) / 100 / 12;
  const n = years * 12;
  const sipValue = sipAmt * (((1 + sipR) ** n - 1) / sipR) * (1 + sipR);
  const price = Number.parseFloat(propPrice) || 0;
  const loanAmt = price * (1 - Number.parseFloat(down) / 100);
  const lr = (Number.parseFloat(loanRate) || 8.75) / 100 / 12;
  const emi = (loanAmt * lr * (1 + lr) ** n) / ((1 + lr) ** n - 1);
  const propValue = price * 1.08 ** years;
  const totalPaid = emi * n + price * (Number.parseFloat(down) / 100);
  const propNetGain = propValue - totalPaid;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold text-sm">
            SIP Investment
          </h3>
          <div>
            <label className={lbl}>Monthly SIP (&#8377;)</label>
            <input
              type="number"
              className={inp}
              value={sip}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSip(e.target.value)
              }
            />
          </div>
          <div>
            <label className={lbl}>Expected Return (%)</label>
            <input
              type="number"
              className={inp}
              value={sipRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSipRate(e.target.value)
              }
            />
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-gray-400">SIP Value after {years}yr</span>
              <span className="text-blue-400 font-bold">{fmtL(sipValue)}</span>
            </div>
            <div className={resultRow}>
              <span className="text-gray-400">Total invested</span>
              <span className="text-white">{fmtL(sipAmt * n)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <h3 className="text-yellow-400 font-semibold text-sm">
            Property Investment
          </h3>
          <div>
            <label className={lbl}>Property Price (&#8377;)</label>
            <input
              type="number"
              className={inp}
              value={propPrice}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPropPrice(e.target.value)
              }
            />
          </div>
          <div>
            <label className={lbl}>Down Payment (%)</label>
            <input
              type="number"
              className={inp}
              value={down}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDown(e.target.value)
              }
            />
          </div>
          <div>
            <label className={lbl}>Loan Rate (%)</label>
            <input
              type="number"
              className={inp}
              value={loanRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLoanRate(e.target.value)
              }
            />
          </div>
          <div className={resultBox}>
            <div className={resultRow}>
              <span className="text-gray-400">
                Property value after {years}yr
              </span>
              <span className="text-yellow-400 font-bold">
                {fmtL(propValue)}
              </span>
            </div>
            <div className={resultRow}>
              <span className="text-gray-400">Monthly EMI</span>
              <span className="text-white">{fmt(emi)}</span>
            </div>
            <div className={resultRow}>
              <span className="text-gray-400">Net Gain</span>
              <span
                className={propNetGain > 0 ? "text-green-400" : "text-red-400"}
              >
                {fmtL(propNetGain)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${resultBox} border-yellow-500/40`}>
        <p className="text-yellow-400 font-semibold">
          20-Year Winner: {sipValue > propValue ? "SIP" : "Property"} &#8212;{" "}
          {fmtL(Math.max(sipValue, propValue))}
        </p>
      </div>
    </div>
  );
}

function StampDuty() {
  const [price, setPrice] = useState("5000000");
  const [gender, setGender] = useState<"male" | "female" | "joint">("male");
  const p = Number.parseFloat(price) || 0;
  const rates = { male: 0.049, female: 0.047, joint: 0.045 };
  const sd = p * rates[gender];
  const reg = Math.min(p * 0.01, 30000);
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Property Price (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
        />
      </div>
      <div>
        <p className={lbl}>Buyer Type</p>
        <div className="flex gap-2 flex-wrap">
          {(["male", "female", "joint"] as const).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGender(g)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${gender === g ? "bg-yellow-500 text-black" : "border-gray-600 text-gray-300"}`}
            >
              {g === "male"
                ? "Male (4.9%)"
                : g === "female"
                  ? "Female (4.7%)"
                  : "Joint w/Female (4.5%)"}
            </button>
          ))}
        </div>
      </div>
      <div className={resultBox}>
        <div className={resultRow}>
          <span className="text-gray-400">Stamp Duty</span>
          <span className="text-yellow-400">{fmt(sd)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">
            Registration (1%, max &#8377;30K)
          </span>
          <span className="text-yellow-400">{fmt(reg)}</span>
        </div>
        <div
          className={`${resultRow} font-bold border-t border-yellow-500/20 pt-2`}
        >
          <span className="text-white">Total Govt Charges</span>
          <span className="text-yellow-400">{fmt(sd + reg)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Total Cost of Purchase</span>
          <span className="text-white">{fmt(p + sd + reg)}</span>
        </div>
      </div>
    </div>
  );
}

function WealthProjection() {
  const [val, setVal] = useState("5000000");
  const [rate, setRate] = useState("8");
  const v = Number.parseFloat(val) || 0;
  const r = Number.parseFloat(rate) / 100 || 0.08;
  const years = [5, 10, 15, 20];
  const max = v * (1 + r) ** 20;
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Current Property Value (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={val}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setVal(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Annual Appreciation (%)</label>
        <input
          type="number"
          className={inp}
          value={rate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRate(e.target.value)
          }
        />
      </div>
      <div className="space-y-3 mt-4">
        {years.map((y) => {
          const pv = v * (1 + r) ** y;
          return (
            <div key={`w${y}`} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{y} Years</span>
                <span className="text-yellow-400 font-semibold">
                  {fmtL(pv)}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                  style={{ width: `${(pv / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DownPaymentPlanner() {
  const [price, setPrice] = useState("6000000");
  const [pct, setPct] = useState("20");
  const [savings, setSavings] = useState("500000");
  const [monthly, setMonthly] = useState("15000");
  const req =
    ((Number.parseFloat(price) || 0) * (Number.parseFloat(pct) || 20)) / 100;
  const saved = Number.parseFloat(savings) || 0;
  const mon = Number.parseFloat(monthly) || 0;
  const rem = Math.max(0, req - saved);
  const months = mon > 0 ? Math.ceil(rem / mon) : 0;
  const savedPct = Math.min(100, Math.round((saved / req) * 100));
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Target Property Price (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Down Payment (%)</label>
        <input
          type="number"
          className={inp}
          value={pct}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPct(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Current Savings (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={savings}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSavings(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Monthly Savings (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={monthly}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMonthly(e.target.value)
          }
        />
      </div>
      <div className={resultBox}>
        <div className={resultRow}>
          <span className="text-gray-400">Required Down Payment</span>
          <span className="text-yellow-400">{fmt(req)}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress: {savedPct}%</span>
            <span>
              {fmt(saved)} / {fmt(req)}
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full"
              style={{ width: `${savedPct}%` }}
            />
          </div>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Remaining</span>
          <span className="text-orange-400">{fmt(rem)}</span>
        </div>
        <div className={`${resultRow} font-semibold`}>
          <span className="text-gray-400">Time to goal</span>
          <span className="text-yellow-400">
            {months > 0
              ? `${months} months`
              : saved >= req
                ? "Ready!"
                : "Set monthly savings"}
          </span>
        </div>
      </div>
    </div>
  );
}

function RentalTax() {
  const [rent, setRent] = useState("360000");
  const [tax, setTax] = useState("5000");
  const [interest, setInterest] = useState("0");
  const gr = Number.parseFloat(rent) || 0;
  const t = Number.parseFloat(tax) || 0;
  const i = Number.parseFloat(interest) || 0;
  const nav = gr - t;
  const stdDed = nav * 0.3;
  const taxable = Math.max(0, nav - stdDed - Math.min(i, 200000));
  const estTax = taxable * 0.3;
  // suppress unused variable warning
  void i;
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Annual Rental Income (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={rent}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRent(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Property Tax Paid (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={tax}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTax(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Home Loan Interest (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={interest}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInterest(e.target.value)
          }
        />
      </div>
      <div className={resultBox}>
        <div className={resultRow}>
          <span className="text-gray-400">Gross Rent</span>
          <span>{fmt(gr)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Less: Property Tax</span>
          <span className="text-red-400">-{fmt(t)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">NAV</span>
          <span className="text-yellow-400">{fmt(nav)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Less: 30% Std Deduction</span>
          <span className="text-red-400">-{fmt(stdDed)}</span>
        </div>
        <div
          className={`${resultRow} font-bold border-t border-yellow-500/20 pt-2`}
        >
          <span className="text-yellow-400">Taxable Income</span>
          <span className="text-yellow-400">{fmt(taxable)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Estimated Tax @ 30%</span>
          <span className="text-red-400">{fmt(estTax)}</span>
        </div>
      </div>
    </div>
  );
}

function BuyReadiness() {
  const [income, setIncome] = useState("");
  const [debts, setDebts] = useState("");
  const [savings, setSavings] = useState("");
  const [stableJob, setStableJob] = useState<boolean | null>(null);
  const [emergency, setEmergency] = useState<boolean | null>(null);
  const [propPrice, setPropPrice] = useState("");
  const [done, setDone] = useState(false);
  const inc = Number.parseFloat(income) || 0;
  const dbt = Number.parseFloat(debts) || 0;
  const svgs = Number.parseFloat(savings) || 0;
  const price = Number.parseFloat(propPrice) || 0;
  let score = 0;
  if (inc > 0 && dbt / inc < 0.3) score += 25;
  else if (inc > 0 && dbt / inc < 0.5) score += 10;
  if (price > 0 && svgs >= price * 0.2) score += 25;
  else if (price > 0 && svgs >= price * 0.1) score += 10;
  if (stableJob === true) score += 25;
  if (emergency === true) score += 25;
  const verdict =
    score >= 75
      ? "Ready to Buy! \u2713"
      : score >= 50
        ? "Wait 6-12 Months"
        : "Not Yet \u2014 Build Foundation";
  const color =
    score >= 75
      ? "text-green-400"
      : score >= 50
        ? "text-orange-400"
        : "text-red-400";
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Monthly Income (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={income}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setIncome(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Existing Monthly EMIs (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={debts}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDebts(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Current Savings (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={savings}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSavings(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Target Property Price (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={propPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPropPrice(e.target.value)
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className={lbl}>Stable Job 2+ Years?</p>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button
                type="button"
                key={String(v)}
                onClick={() => setStableJob(v)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${stableJob === v ? "bg-yellow-500 text-black" : "border-gray-600 text-gray-300"}`}
              >
                {v ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className={lbl}>6-Month Emergency Fund?</p>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button
                type="button"
                key={String(v)}
                onClick={() => setEmergency(v)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${emergency === v ? "bg-yellow-500 text-black" : "border-gray-600 text-gray-300"}`}
              >
                {v ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDone(true)}
        className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400"
      >
        Check My Readiness
      </button>
      {done && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className={`text-xl font-bold font-playfair ${color}`}>
            {verdict}
          </p>
          <p className="text-sm text-gray-400 mt-1">Score: {score}/100</p>
          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BuyVsRent() {
  const [price, setPrice] = useState("5000000");
  const [lp, setLp] = useState("80");
  const [lr, setLr] = useState("8.75");
  const [rent, setRent] = useState("20000");
  const p = Number.parseFloat(price) || 0;
  const loan = (p * (Number.parseFloat(lp) || 80)) / 100;
  const r = (Number.parseFloat(lr) || 8.75) / 100 / 12;
  const n = 240;
  const emi = (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  // suppress unused variable warning
  void p;
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={lbl}>Property Price (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
        />
      </div>
      <div>
        <label className={lbl}>Loan %</label>
        <input
          type="number"
          className={inp}
          value={lp}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLp(e.target.value)}
        />
      </div>
      <div>
        <label className={lbl}>Loan Interest Rate (%)</label>
        <input
          type="number"
          className={inp}
          value={lr}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLr(e.target.value)}
        />
      </div>
      <div>
        <label className={lbl}>Equivalent Monthly Rent (&#8377;)</label>
        <input
          type="number"
          className={inp}
          value={rent}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRent(e.target.value)
          }
        />
      </div>
      <div className={resultBox}>
        <div className={resultRow}>
          <span className="text-gray-400">Monthly EMI if buying</span>
          <span className="text-yellow-400 font-bold">{fmt(emi)}</span>
        </div>
        <div className={resultRow}>
          <span className="text-gray-400">Monthly rent</span>
          <span className="text-blue-400 font-bold">
            {fmt(Number.parseFloat(rent) || 0)}
          </span>
        </div>
        <div
          className={`${resultRow} font-semibold border-t border-yellow-500/20 pt-2`}
        >
          <span className="text-gray-400">Difference (EMI - Rent)</span>
          <span
            className={
              emi > (Number.parseFloat(rent) || 0)
                ? "text-orange-400"
                : "text-green-400"
            }
          >
            {fmt(emi - (Number.parseFloat(rent) || 0))}
          </span>
        </div>
        <p className="text-xs text-gray-400 pt-1">
          Buying builds equity. Renting provides flexibility. Long-term,
          property ownership in Ahmedabad typically wins.
        </p>
      </div>
    </div>
  );
}

const TABS = [
  {
    id: "sip" as TabId,
    label: "SIP vs Property",
    icon: <TrendingUp className="w-4 h-4" />,
    comp: <SIPvsProperty />,
  },
  {
    id: "rental" as TabId,
    label: "Rental Tax",
    icon: <FileText className="w-4 h-4" />,
    comp: <RentalTax />,
  },
  {
    id: "wealth" as TabId,
    label: "Wealth Projection",
    icon: <TrendingUp className="w-4 h-4" />,
    comp: <WealthProjection />,
  },
  {
    id: "downpayment" as TabId,
    label: "Down Payment",
    icon: <Home className="w-4 h-4" />,
    comp: <DownPaymentPlanner />,
  },
  {
    id: "readiness" as TabId,
    label: "Buy Readiness",
    icon: <CheckCircle className="w-4 h-4" />,
    comp: <BuyReadiness />,
  },
  {
    id: "stampduty" as TabId,
    label: "Stamp Duty",
    icon: <DollarSign className="w-4 h-4" />,
    comp: <StampDuty />,
  },
  {
    id: "buyvsrent" as TabId,
    label: "Buy vs Rent",
    icon: <GitCompare className="w-4 h-4" />,
    comp: <BuyVsRent />,
  },
];

export default function FinanceToolsPage() {
  const [active, setActive] = useState<TabId>("sip");
  const tab = TABS.find((t) => t.id === active)!;
  return (
    <div className="min-h-screen bg-[#06090f] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs mb-4">
            <Calculator className="w-3.5 h-3.5" />
            Finance Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-yellow-400">
            Finance Tools &amp; Calculators
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Professional-grade tools for smart real estate and investment
            decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {TABS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === t.id ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-yellow-400 font-playfair mb-6">
            {tab.label}
          </h2>
          {tab.comp}
        </div>
        <div className="text-center space-y-3 pt-4">
          <p className="text-gray-400 text-sm">Need personalized guidance?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/properties"
              className="px-6 py-2.5 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 text-sm"
            >
              Browse Properties
            </a>
            <a
              href="tel:+919512609016"
              className="px-6 py-2.5 bg-white/10 text-white rounded-xl border border-white/10 text-sm"
            >
              Call +91 9512609016
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
