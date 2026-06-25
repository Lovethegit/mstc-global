import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Shared Helpers ─────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
const fmtC = (n: number) => `₹${fmt(n)}`;

const inp =
  "w-full bg-[#06090f] border border-[#c9a84c]/30 text-[#e8e8e8] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/60 placeholder-[#e8e8e8]/30";
const lbl = "block text-[#e8e8e8]/60 text-xs mb-1";
const btn =
  "bg-[#c9a84c] text-black font-semibold px-5 py-2 rounded-lg text-sm hover:bg-[#e2b96a] transition-colors";
const resultBox =
  "text-center py-3 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30";

const GOLD = "#c9a84c";
const DARK_BG = "#0f1319";

// ─── 1. Part-Prepayment Optimizer ───────────────────────────────────────────
export function PrepaymentOptimizer() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [yearsIn, setYearsIn] = useState("5");
  const [prepay, setPrepay] = useState("");
  const [result, setResult] = useState<{
    origTotalInterest: number;
    newTotalInterest: number;
    interestSaved: number;
    timeSaved: number;
    newTenureMonths: number;
    newEmiSameTenure: number;
    origEmi: number;
  } | null>(null);

  const calculate = () => {
    const P = Number(loan) * 100000;
    const r = Number(rate) / 12 / 100;
    const n = Number(tenure) * 12;
    const paidMonths = Number(yearsIn) * 12;
    const prepayAmt = Number(prepay);
    if (!P || !r || !n || !prepayAmt) return;

    // Original EMI
    const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    // Outstanding balance after `paidMonths`
    const outstanding =
      P * (1 + r) ** paidMonths - (emi * ((1 + r) ** paidMonths - 1)) / r;
    // Outstanding after prepayment
    const afterPrepay = Math.max(0, outstanding - prepayAmt);
    // Remaining months original
    const remainOrig = n - paidMonths;
    // New tenure keeping same EMI
    const newTenure =
      afterPrepay > 0
        ? Math.ceil(Math.log(emi / (emi - afterPrepay * r)) / Math.log(1 + r))
        : 0;
    const timeSaved = remainOrig - newTenure;
    // Original total interest
    const origTotalInterest = emi * n - P;
    // Interest from start to prepayment
    const interestPaid = emi * paidMonths - (P - outstanding);
    // Interest on remaining balance with new tenure
    const newInterestAfter = emi * newTenure - afterPrepay;
    const newTotalInterest = interestPaid + newInterestAfter + prepayAmt;
    // New EMI if tenure kept same (remaining)
    const newEmiSameTenure =
      afterPrepay > 0
        ? (afterPrepay * r * (1 + r) ** remainOrig) /
          ((1 + r) ** remainOrig - 1)
        : 0;
    setResult({
      origTotalInterest,
      newTotalInterest,
      interestSaved:
        origTotalInterest -
        newInterestAfter -
        interestPaid +
        (origTotalInterest - newTotalInterest),
      timeSaved: Math.max(0, timeSaved),
      newTenureMonths: newTenure,
      newEmiSameTenure,
      origEmi: emi,
    });
  };

  const chartData = result
    ? [
        {
          name: "Without Prepayment",
          interest: Math.round(result.origTotalInterest),
        },
        {
          name: "With Prepayment",
          interest: Math.round(
            result.origTotalInterest -
              (result.origTotalInterest -
                result.newTotalInterest +
                result.interestSaved) /
                2,
          ),
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Calculate how much interest and time you save by making a lump-sum
        prepayment on your home loan.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          ["Loan Amount (Lakhs ₹)", loan, setLoan, "50"],
          ["Interest Rate (%)", rate, setRate, "8.5"],
          ["Loan Tenure (yrs)", tenure, setTenure, "20"],
          ["Years Into Loan", yearsIn, setYearsIn, "5"],
          ["Prepayment Amount (₹)", prepay, setPrepay, "500000"],
        ].map(([label, val, setter, ph]) => (
          <div key={label as string}>
            <label className={lbl}>{label as string}</label>
            <input
              className={inp}
              type="number"
              value={val as string}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              placeholder={ph as string}
              data-ocid={`tools.prepayment_${(label as string).toLowerCase().replace(/\s+/g, "_")}_input`}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={calculate}
        className={btn}
        data-ocid="tools.prepayment_calculate_button"
      >
        Calculate Savings
      </button>
      {result && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ["Interest Saved", fmtC(Math.max(0, result.interestSaved))],
                ["Time Saved", `${result.timeSaved} months`],
                [
                  "New Tenure",
                  `${Math.floor(result.newTenureMonths / 12)}y ${result.newTenureMonths % 12}m`,
                ],
                [
                  "New EMI (same tenure)",
                  fmtC(Math.round(result.newEmiSameTenure)),
                ],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l} className={resultBox}>
                <p className="text-[#e8e8e8]/60 text-xs">{l}</p>
                <p className="text-[#c9a84c] font-bold text-base mt-1">{v}</p>
              </div>
            ))}
          </div>
          {chartData.length > 0 && (
            <div>
              <p className="text-[#e8e8e8]/60 text-xs mb-2">
                Total Interest Comparison
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#e8e8e8", fontSize: 10 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fill: "#e8e8e8", fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v: number) => fmtC(v)}
                    contentStyle={{
                      background: DARK_BG,
                      border: `1px solid ${GOLD}`,
                      color: "#e8e8e8",
                    }}
                  />
                  <Bar dataKey="interest" fill={GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-[#e8e8e8]/40 text-xs">
            * Calculations are indicative. Consult your lender for exact
            figures.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 2. Loan Restructuring Calculator ──────────────────────────────────────
export function LoanRestructuringCalc() {
  const [balance, setBalance] = useState("");
  const [curEmi, setCurEmi] = useState("");
  const [curRate, setCurRate] = useState("");
  const [newRate, setNewRate] = useState("");
  const [extendBy, setExtendBy] = useState("2");
  const [result, setResult] = useState<{
    newEmi: number;
    emiReduction: number;
    emiReductionPct: number;
    origTotalLeft: number;
    newTotal: number;
    extraInterest: number;
    netBenefit: number;
  } | null>(null);

  const calculate = () => {
    const B = Number(balance) * 100000;
    const origEmi = Number(curEmi);
    const rO = Number(curRate) / 12 / 100;
    const rN = Number(newRate) / 12 / 100;
    const ext = Number(extendBy) * 12;
    if (!B || !origEmi || !rO || !rN) return;
    // Current remaining tenure (months)
    const remMonths = Math.ceil(
      Math.log(origEmi / (origEmi - B * rO)) / Math.log(1 + rO),
    );
    const newTenure = remMonths + ext;
    const newEmi =
      (B * rN * (1 + rN) ** newTenure) / ((1 + rN) ** newTenure - 1);
    const emiReduction = origEmi - newEmi;
    const emiReductionPct = (emiReduction / origEmi) * 100;
    const origTotalLeft = origEmi * remMonths;
    const newTotal = newEmi * newTenure;
    const extraInterest = newTotal - origTotalLeft;
    const monthlySaving = emiReduction;
    const netBenefit = monthlySaving * newTenure - extraInterest;
    setResult({
      newEmi: Math.round(newEmi),
      emiReduction: Math.round(emiReduction),
      emiReductionPct,
      origTotalLeft: Math.round(origTotalLeft),
      newTotal: Math.round(newTotal),
      extraInterest: Math.round(extraInterest),
      netBenefit: Math.round(netBenefit),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Estimate how restructuring your loan (lower rate + extended tenure)
        affects your monthly EMI and total cost.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(
          [
            ["Outstanding Balance (Lakhs ₹)", balance, setBalance, "40"],
            ["Current Monthly EMI (₹)", curEmi, setCurEmi, "35000"],
            ["Current Rate (%)", curRate, setCurRate, "9"],
            ["New Rate (%)", newRate, setNewRate, "8"],
          ] as [string, string, (v: string) => void, string][]
        ).map(([l, v, s, p]) => (
          <div key={l}>
            <label className={lbl}>{l}</label>
            <input
              className={inp}
              type="number"
              step="0.1"
              value={v}
              onChange={(e) => s(e.target.value)}
              placeholder={p}
              data-ocid={`tools.restructure_${l.toLowerCase().replace(/\s+/g, "_")}_input`}
            />
          </div>
        ))}
        <div>
          <label className={lbl}>Extend Tenure By (years)</label>
          <select
            className={inp}
            value={extendBy}
            onChange={(e) => setExtendBy(e.target.value)}
            data-ocid="tools.restructure_extend_select"
          >
            {["1", "2", "3", "5"].map((y) => (
              <option key={y} value={y}>
                {y} yrs
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={calculate}
        className={btn}
        data-ocid="tools.restructure_calculate_button"
      >
        Analyse Restructuring
      </button>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {(
            [
              ["New Monthly EMI", fmtC(result.newEmi)],
              [
                "EMI Reduction",
                `${fmtC(result.emiReduction)} (${result.emiReductionPct.toFixed(1)}%)`,
              ],
              ["Extra Interest Paid", fmtC(result.extraInterest)],
              [
                "Net Benefit",
                result.netBenefit >= 0
                  ? `+${fmtC(result.netBenefit)}`
                  : fmtC(result.netBenefit),
              ],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} className={resultBox}>
              <p className="text-[#e8e8e8]/60 text-xs">{l}</p>
              <p
                className={`font-bold text-sm mt-1 ${l === "Net Benefit" ? (result.netBenefit >= 0 ? "text-green-400" : "text-red-400") : "text-[#c9a84c]"}`}
              >
                {v}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 3. Break-Even Calculator (Buy vs Rent) ─────────────────────────────────
export function BreakEvenCalc() {
  const [price, setPrice] = useState("");
  const [dp, setDp] = useState("20");
  const [loanRate, setLoanRate] = useState("8.5");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [appreciation, setAppreciation] = useState("7");
  const [rentIncrease, setRentIncrease] = useState("5");
  const [maintenance, setMaintenance] = useState("2000");
  const [result, setResult] = useState<{
    breakEvenYear: number;
    yearData: { year: number; buyCumulative: number; rentCumulative: number }[];
    netWorthDiff20y: number;
  } | null>(null);

  const calculate = () => {
    const P = Number(price) * 100000;
    const downPct = Number(dp) / 100;
    const downAmt = P * downPct;
    const loanAmt = P - downAmt;
    const r = Number(loanRate) / 12 / 100;
    const n = 240; // 20 year
    const rent0 = Number(monthlyRent);
    const appr = Number(appreciation) / 100;
    const ri = Number(rentIncrease) / 100;
    const maint = Number(maintenance);
    if (!P || !loanAmt || !rent0) return;

    const emi = (loanAmt * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const yearData: {
      year: number;
      buyCumulative: number;
      rentCumulative: number;
    }[] = [];
    let buyCumulative = downAmt; // down payment is upfront cost
    let rentCumulative = 0;
    let curRent = rent0;
    let breakEvenYear = -1;
    let propValue = P;

    for (let yr = 1; yr <= 20; yr++) {
      // Annual buying cost = EMI*12 + maintenance*12 - appreciation gain
      const annualEmi = emi * 12;
      const annualMaint = maint * 12;
      propValue = propValue * (1 + appr);
      const appreciationGain = propValue - P; // unrealized
      buyCumulative += annualEmi + annualMaint;
      // Annual renting cost
      const annualRent = curRent * 12;
      rentCumulative += annualRent;
      curRent = curRent * (1 + ri);
      // Net cost of buying = cumulative paid - appreciation gained
      const buyNetCost = buyCumulative - appreciationGain;
      yearData.push({
        year: yr,
        buyCumulative: Math.round(buyNetCost),
        rentCumulative: Math.round(rentCumulative),
      });
      if (breakEvenYear === -1 && buyNetCost <= rentCumulative)
        breakEvenYear = yr;
    }

    const last = yearData[19];
    const netWorthDiff20y = last.rentCumulative - last.buyCumulative;

    setResult({
      breakEvenYear: breakEvenYear === -1 ? 21 : breakEvenYear,
      yearData,
      netWorthDiff20y,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Find the year when buying a property becomes financially better than
        renting the same.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(
          [
            ["Property Price (Lakhs ₹)", price, setPrice, "80"],
            ["Down Payment (%)", dp, setDp, "20"],
            ["Loan Rate (%)", loanRate, setLoanRate, "8.5"],
            ["Monthly Rent (₹)", monthlyRent, setMonthlyRent, "25000"],
            ["Annual Appreciation (%)", appreciation, setAppreciation, "7"],
            ["Annual Rent Increase (%)", rentIncrease, setRentIncrease, "5"],
            ["Maintenance (₹/month)", maintenance, setMaintenance, "2000"],
          ] as [string, string, (v: string) => void, string][]
        ).map(([l, v, s, p]) => (
          <div key={l}>
            <label className={lbl}>{l}</label>
            <input
              className={inp}
              type="number"
              step="0.5"
              value={v}
              onChange={(e) => s(e.target.value)}
              placeholder={p}
              data-ocid={`tools.breakeven_${l.toLowerCase().replace(/[^a-z0-9]/g, "_")}_input`}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={calculate}
        className={btn}
        data-ocid="tools.breakeven_calculate_button"
      >
        Calculate Break-Even
      </button>
      {result && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className={`${resultBox} col-span-1`}>
              <p className="text-[#e8e8e8]/60 text-xs">Break-Even Year</p>
              <p className="text-[#c9a84c] font-bold text-2xl mt-1">
                {result.breakEvenYear > 20
                  ? ">20 yrs"
                  : `Year ${result.breakEvenYear}`}
              </p>
              <p className="text-[#e8e8e8]/40 text-xs mt-1">
                Buying becomes cheaper than renting
              </p>
            </div>
            <div className={`${resultBox} col-span-1`}>
              <p className="text-[#e8e8e8]/60 text-xs">20-Year Net Advantage</p>
              <p
                className={`font-bold text-2xl mt-1 ${result.netWorthDiff20y >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {result.netWorthDiff20y >= 0
                  ? `+${fmtC(result.netWorthDiff20y)}`
                  : fmtC(result.netWorthDiff20y)}
              </p>
              <p className="text-[#e8e8e8]/40 text-xs mt-1">
                {result.netWorthDiff20y >= 0 ? "Buying wins" : "Renting wins"}{" "}
                over 20 years
              </p>
            </div>
          </div>
          <p className="text-[#e8e8e8]/60 text-xs mb-1">
            20-Year Cumulative Cost Comparison
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={result.yearData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="year"
                label={{
                  value: "Year",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#e8e8e8",
                }}
                tick={{ fill: "#e8e8e8", fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                tick={{ fill: "#e8e8e8", fontSize: 10 }}
              />
              <Tooltip
                formatter={(v: number) => fmtC(v)}
                contentStyle={{
                  background: DARK_BG,
                  border: `1px solid ${GOLD}`,
                  color: "#e8e8e8",
                }}
              />
              <Legend wrapperStyle={{ color: "#e8e8e8", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="buyCumulative"
                name="Net Cost of Buying"
                stroke={GOLD}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="rentCumulative"
                name="Cost of Renting"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[#e8e8e8]/40 text-xs">
            * Buying net cost = EMI + maintenance − appreciation gain.
            Indicative only.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 4. GST on Property Calculator ─────────────────────────────────────────
export function GSTPropertyCalc() {
  const [propValue, setPropValue] = useState("");
  const [category, setCategory] = useState("affordable");
  const [parking, setParking] = useState("");
  const [result, setResult] = useState<{
    gstRate: number;
    gstAmount: number;
    parkingGst: number;
    totalCost: number;
    note: string;
  } | null>(null);

  const calculate = () => {
    const val = Number(propValue) * 100000;
    const parkingVal = Number(parking) || 0;
    if (!val) return;
    // GST Rates 2024 for under-construction:
    // Affordable (≤₹45L and ≤60sqm metro / ≤90sqm non-metro): 1% effective (5% minus ITC)
    // Regular: 5% without ITC
    // Luxury (>₹1.5Cr): 5% without ITC (same slab, luxury is marketing term)
    // Note: Ready-to-move = 0%
    let gstRate: number;
    let note: string;
    if (category === "affordable") {
      gstRate = 1; // 1% effective for affordable under GST council 2019 revision
      note =
        "Affordable housing: 1% effective GST (post-ITC revision, Mar 2019). Applicable for ≤₹45L & ≤60 sqm (metro) / ≤90 sqm (non-metro).";
    } else if (category === "luxury") {
      gstRate = 5;
      note =
        "Luxury / premium under-construction: 5% GST (without ITC). Commercial use may allow ITC credit — consult your CA.";
    } else {
      gstRate = 5;
      note =
        "Regular under-construction: 5% GST (without ITC, post-Apr 2019 rates).";
    }
    const gstAmount = Math.round((val * gstRate) / 100);
    const parkingGst = parkingVal > 0 ? Math.round(parkingVal * 0.18) : 0; // Parking sold separately: 18%
    const totalCost = val + gstAmount + parkingVal + parkingGst;
    setResult({ gstRate, gstAmount, parkingGst, totalCost, note });
  };

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Calculate GST applicable on under-construction properties. Ready-to-move
        properties attract 0% GST.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className={lbl}>Property Value (Lakhs ₹)</label>
          <input
            className={inp}
            type="number"
            value={propValue}
            onChange={(e) => setPropValue(e.target.value)}
            placeholder="e.g. 60"
            data-ocid="tools.gst_propvalue_input"
          />
        </div>
        <div>
          <label className={lbl}>Property Category</label>
          <select
            className={inp}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-ocid="tools.gst_category_select"
          >
            <option value="affordable">Affordable (≤₹45L)</option>
            <option value="regular">Regular</option>
            <option value="luxury">Luxury (&gt;₹1.5Cr)</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Parking Charges (₹) — if separate</label>
          <input
            className={inp}
            type="number"
            value={parking}
            onChange={(e) => setParking(e.target.value)}
            placeholder="e.g. 150000"
            data-ocid="tools.gst_parking_input"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={calculate}
        className={btn}
        data-ocid="tools.gst_calculate_button"
      >
        Calculate GST
      </button>
      {result && (
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ["GST Rate", `${result.gstRate}%`],
                ["GST on Property", fmtC(result.gstAmount)],
                ["GST on Parking (18%)", fmtC(result.parkingGst)],
                ["Total Effective Cost", fmtC(result.totalCost)],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l} className={resultBox}>
                <p className="text-[#e8e8e8]/60 text-xs">{l}</p>
                <p className="text-[#c9a84c] font-bold text-base mt-1">{v}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-3">
            <p className="text-[#c9a84c] text-xs font-semibold mb-1">
              📋 Important Note
            </p>
            <p className="text-[#e8e8e8]/70 text-xs">{result.note}</p>
          </div>
          <p className="text-[#e8e8e8]/40 text-xs">
            * GST rates as per GST Council decisions effective 2024. Consult a
            CA for property-specific advice.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 5. Income Tax on Rental Income ─────────────────────────────────────────
export function RentalIncomeTaxCalc() {
  const [annualRent, setAnnualRent] = useState("");
  const [propType, setPropType] = useState("let-out");
  const [homeLoanInterest, setHomeLoanInterest] = useState("");
  const [municipalTax, setMunicipalTax] = useState("");
  const [taxBracket, setTaxBracket] = useState("30");
  const [result, setResult] = useState<{
    grossRent: number;
    municipalTaxDed: number;
    netAnnualValue: number;
    standardDed: number;
    interestDed: number;
    taxableIncome: number;
    taxPayable: number;
    effectiveRate: number;
  } | null>(null);

  const calculate = () => {
    const gross = Number(annualRent);
    const muniTax = Number(municipalTax) || 0;
    const hlInterest = Number(homeLoanInterest) || 0;
    const bracket = Number(taxBracket) / 100;
    if (!gross) return;

    // Step 1: Gross Annual Value
    // Step 2: Less Municipal Tax paid
    const netAnnualValue = gross - muniTax;
    // Step 3: 30% Standard Deduction (Section 24a) on NAV
    const standardDed = Math.round(netAnnualValue * 0.3);
    // Step 4: Home loan interest deduction (Section 24b)
    // Let-out: no limit; Self-occupied: max ₹2L
    const interestLimit =
      propType === "self-occupied" ? 200000 : Number.POSITIVE_INFINITY;
    const interestDed = Math.min(hlInterest, interestLimit);
    // Step 5: Taxable income from property
    const taxableIncome = Math.max(
      0,
      netAnnualValue - standardDed - interestDed,
    );
    // Step 6: Tax payable
    const taxPayable = Math.round(taxableIncome * bracket);
    const effectiveRate = gross > 0 ? (taxPayable / gross) * 100 : 0;

    setResult({
      grossRent: gross,
      municipalTaxDed: muniTax,
      netAnnualValue,
      standardDed,
      interestDed,
      taxableIncome,
      taxPayable,
      effectiveRate,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Calculate income tax on rental income under the old tax regime. Covers
        Section 24(a) standard deduction and Section 24(b) home loan interest.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className={lbl}>Annual Rental Income (₹)</label>
          <input
            className={inp}
            type="number"
            value={annualRent}
            onChange={(e) => setAnnualRent(e.target.value)}
            placeholder="e.g. 300000"
            data-ocid="tools.rentaltax_annual_rent_input"
          />
        </div>
        <div>
          <label className={lbl}>Property Type</label>
          <select
            className={inp}
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
            data-ocid="tools.rentaltax_proptype_select"
          >
            <option value="let-out">Let-Out (Rented)</option>
            <option value="self-occupied">Self-Occupied</option>
            <option value="deemed-let-out">Deemed Let-Out</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Home Loan Interest (₹/year)</label>
          <input
            className={inp}
            type="number"
            value={homeLoanInterest}
            onChange={(e) => setHomeLoanInterest(e.target.value)}
            placeholder="e.g. 200000"
            data-ocid="tools.rentaltax_hli_input"
          />
        </div>
        <div>
          <label className={lbl}>Municipal Tax Paid (₹/year)</label>
          <input
            className={inp}
            type="number"
            value={municipalTax}
            onChange={(e) => setMunicipalTax(e.target.value)}
            placeholder="e.g. 12000"
            data-ocid="tools.rentaltax_municipal_input"
          />
        </div>
        <div>
          <label className={lbl}>Tax Bracket</label>
          <select
            className={inp}
            value={taxBracket}
            onChange={(e) => setTaxBracket(e.target.value)}
            data-ocid="tools.rentaltax_bracket_select"
          >
            <option value="5">5%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={calculate}
        className={btn}
        data-ocid="tools.rentaltax_calculate_button"
      >
        Calculate Tax
      </button>
      {result && (
        <div className="space-y-3 mt-2">
          <div className="bg-[#06090f] rounded-lg border border-[#c9a84c]/20 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {(
                  [
                    ["Gross Annual Rent", fmtC(result.grossRent), false],
                    [
                      "Less: Municipal Tax",
                      `– ${fmtC(result.municipalTaxDed)}`,
                      false,
                    ],
                    [
                      "Net Annual Value (NAV)",
                      fmtC(result.netAnnualValue),
                      false,
                    ],
                    [
                      "Less: 30% Standard Deduction (Sec 24a)",
                      `– ${fmtC(result.standardDed)}`,
                      false,
                    ],
                    [
                      "Less: Home Loan Interest (Sec 24b)",
                      `– ${fmtC(result.interestDed)}`,
                      false,
                    ],
                    [
                      "Taxable Income from Property",
                      fmtC(result.taxableIncome),
                      true,
                    ],
                    ["Tax Payable", fmtC(result.taxPayable), true],
                  ] as [string, string, boolean][]
                ).map(([l, v, bold]) => (
                  <tr key={l} className="border-b border-[#c9a84c]/10">
                    <td
                      className={`px-3 py-2 ${bold ? "text-[#c9a84c] font-semibold" : "text-[#e8e8e8]/60"}`}
                    >
                      {l}
                    </td>
                    <td
                      className={`px-3 py-2 text-right ${bold ? "text-[#c9a84c] font-bold" : "text-[#e8e8e8]"}`}
                    >
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={resultBox}>
            <p className="text-[#e8e8e8]/60 text-xs">
              Effective Tax Rate on Rental Income
            </p>
            <p className="text-[#c9a84c] font-bold text-xl mt-1">
              {result.effectiveRate.toFixed(2)}%
            </p>
          </div>
          <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-3 space-y-1">
            <p className="text-[#c9a84c] text-xs font-semibold">💡 Key Tips</p>
            <p className="text-[#e8e8e8]/70 text-xs">
              • TDS @10% deducted by tenant if annual rent &gt; ₹2.4L (Section
              194I)
            </p>
            <p className="text-[#e8e8e8]/70 text-xs">
              • Advance tax required if total tax liability &gt; ₹10,000/quarter
            </p>
            <p className="text-[#e8e8e8]/70 text-xs">
              • Section 24b: ₹2L cap applies only for self-occupied; no cap for
              let-out
            </p>
            <p className="text-[#e8e8e8]/70 text-xs">
              • New tax regime (2024): standard deduction removed; flat slab
              rates apply
            </p>
          </div>
          <p className="text-[#e8e8e8]/40 text-xs">
            * Old tax regime calculations. Consult a CA for personalised tax
            advice.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 6. Portfolio Builder ────────────────────────────────────────────────────
interface PropertyEntry {
  id: number;
  name: string;
  purchasePrice: string;
  currentValue: string;
  monthlyRent: string;
  loanEmi: string;
  purchaseYear: string;
}

const GOLD_COLORS = [
  "#c9a84c",
  "#e2b96a",
  "#f0d080",
  "#a87c30",
  "#d4a445",
  "#8b5e10",
];

export function PortfolioBuilder() {
  const [properties, setProperties] = useState<PropertyEntry[]>([
    {
      id: 1,
      name: "Property 1",
      purchasePrice: "",
      currentValue: "",
      monthlyRent: "",
      loanEmi: "",
      purchaseYear: "2020",
    },
  ]);
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  const addProp = () =>
    setProperties((p) => [
      ...p,
      {
        id: Date.now(),
        name: `Property ${p.length + 1}`,
        purchasePrice: "",
        currentValue: "",
        monthlyRent: "",
        loanEmi: "",
        purchaseYear: String(new Date().getFullYear() - 2),
      },
    ]);
  const removeProp = (id: number) =>
    setProperties((p) => p.filter((x) => x.id !== id));
  const updateProp = (id: number, field: keyof PropertyEntry, val: string) =>
    setProperties((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: val } : x)),
    );

  const currentYear = new Date().getFullYear();

  const summary = (() => {
    const valid = properties.filter((p) => Number(p.purchasePrice) > 0);
    if (valid.length === 0) return null;
    const totalInvestment = valid.reduce(
      (s, p) => s + Number(p.purchasePrice) * 100000,
      0,
    );
    const totalCurrentValue = valid.reduce(
      (s, p) =>
        s + (Number(p.currentValue) || Number(p.purchasePrice)) * 100000,
      0,
    );
    const totalUnrealizedGain = totalCurrentValue - totalInvestment;
    const unrealizedGainPct = (totalUnrealizedGain / totalInvestment) * 100;
    const totalMonthlyRent = valid.reduce(
      (s, p) => s + Number(p.monthlyRent),
      0,
    );
    const totalEmi = valid.reduce((s, p) => s + Number(p.loanEmi), 0);
    const netCashFlow = totalMonthlyRent - totalEmi;
    const avgYield =
      totalCurrentValue > 0
        ? ((totalMonthlyRent * 12) / totalCurrentValue) * 100
        : 0;
    const years = valid
      .map((p) => currentYear - Number(p.purchaseYear))
      .filter((y) => y > 0);
    const avgYears =
      years.length > 0 ? years.reduce((a, b) => a + b, 0) / years.length : 1;
    const portfolioROI =
      avgYears > 0
        ? ((totalCurrentValue / totalInvestment) ** (1 / avgYears) - 1) * 100
        : 0;
    const pieData = valid.map((p) => ({
      name: p.name,
      value:
        Number(p.currentValue) * 100000 || Number(p.purchasePrice) * 100000,
    }));
    return {
      totalInvestment,
      totalCurrentValue,
      totalUnrealizedGain,
      unrealizedGainPct,
      totalMonthlyRent,
      totalEmi,
      netCashFlow,
      avgYield,
      portfolioROI,
      pieData,
    };
  })();

  const copyToClipboard = () => {
    if (!summary) return;
    const text = [
      "MSTC GLOBAL — Property Portfolio Summary",
      `Total Investment: ${fmtC(summary.totalInvestment)}`,
      `Portfolio Value: ${fmtC(summary.totalCurrentValue)}`,
      `Unrealized Gain: ${fmtC(summary.totalUnrealizedGain)} (${summary.unrealizedGainPct.toFixed(1)}%)`,
      `Monthly Rental Income: ${fmtC(summary.totalMonthlyRent)}`,
      `Total Loan EMIs: ${fmtC(summary.totalEmi)}`,
      `Net Monthly Cash Flow: ${fmtC(summary.netCashFlow)}`,
      `Average Rental Yield: ${summary.avgYield.toFixed(2)}%`,
      `Portfolio CAGR: ${summary.portfolioROI.toFixed(2)}%`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-[#e8e8e8]/60 text-xs">
        Build and analyse your entire property portfolio in one place. Add each
        property to see consolidated metrics.
      </p>
      {/* Property Entries */}
      <div className="space-y-3">
        {properties.map((prop, idx) => (
          <div
            key={prop.id}
            className="bg-[#06090f] rounded-xl border border-[#c9a84c]/20 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <input
                className="bg-transparent text-[#c9a84c] font-semibold text-sm focus:outline-none border-b border-[#c9a84c]/30 pb-0.5 w-40"
                value={prop.name}
                onChange={(e) => updateProp(prop.id, "name", e.target.value)}
                data-ocid={`tools.portfolio_name_${idx + 1}_input`}
              />
              {properties.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProp(prop.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  data-ocid={`tools.portfolio_remove_${idx + 1}_button`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  ["Purchase Price (Lakhs ₹)", "purchasePrice", "50"],
                  ["Current Value (Lakhs ₹)", "currentValue", "70"],
                  ["Monthly Rent (₹)", "monthlyRent", "25000"],
                  ["Loan EMI (₹/mo)", "loanEmi", "35000"],
                  ["Purchase Year", "purchaseYear", "2020"],
                ] as [string, keyof PropertyEntry, string][]
              ).map(([l, f, p]) => (
                <div key={f}>
                  <label className={lbl}>{l}</label>
                  <input
                    className={inp}
                    type="number"
                    value={prop[f]}
                    onChange={(e) => updateProp(prop.id, f, e.target.value)}
                    placeholder={p}
                    data-ocid={`tools.portfolio_${f}_${idx + 1}_input`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={addProp}
          className="flex items-center gap-2 border border-[#c9a84c]/40 text-[#c9a84c] text-sm px-4 py-2 rounded-lg hover:bg-[#c9a84c]/10 transition-colors"
          data-ocid="tools.portfolio_add_button"
        >
          <Plus size={14} /> Add Property
        </button>
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className={btn}
          data-ocid="tools.portfolio_analyse_button"
        >
          Analyse Portfolio
        </button>
      </div>
      {showSummary && summary && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ["Total Investment", fmtC(summary.totalInvestment)],
                ["Portfolio Value", fmtC(summary.totalCurrentValue)],
                [
                  "Unrealized Gain",
                  `${fmtC(summary.totalUnrealizedGain)} (${summary.unrealizedGainPct.toFixed(1)}%)`,
                ],
                ["Monthly Rental Income", fmtC(summary.totalMonthlyRent)],
                ["Total Loan EMIs", fmtC(summary.totalEmi)],
                ["Net Cash Flow/Month", fmtC(summary.netCashFlow)],
                ["Avg Rental Yield", `${summary.avgYield.toFixed(2)}%`],
                ["Portfolio CAGR", `${summary.portfolioROI.toFixed(2)}%`],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l} className={resultBox}>
                <p className="text-[#e8e8e8]/60 text-xs">{l}</p>
                <p className="text-[#c9a84c] font-bold text-sm mt-1">{v}</p>
              </div>
            ))}
          </div>
          {summary.pieData.length > 1 && (
            <div>
              <p className="text-[#e8e8e8]/60 text-xs mb-2">
                Value Distribution by Property
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={summary.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {summary.pieData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={GOLD_COLORS[i % GOLD_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => fmtC(v)}
                    contentStyle={{
                      background: DARK_BG,
                      border: `1px solid ${GOLD}`,
                      color: "#e8e8e8",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#e8e8e8", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <button
            type="button"
            onClick={copyToClipboard}
            className="border border-[#c9a84c]/40 text-[#c9a84c] text-sm px-4 py-2 rounded-lg hover:bg-[#c9a84c]/10 transition-colors"
            data-ocid="tools.portfolio_copy_button"
          >
            {copied ? "✓ Copied!" : "Copy Summary to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible Accordion Wrapper ──────────────────────────────────────────
export function CollapsibleTool({
  title,
  description,
  children,
}: { title: string; description: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#c9a84c]/30 rounded-lg overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 bg-[#0f1319] hover:bg-[#1a1f2a] transition-colors"
      >
        <span
          className="font-sans font-semibold"
          style={{ color: "oklch(var(--primary))" }}
        >
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: "oklch(var(--primary))" }}
        />
      </button>
      {open && (
        <div className="p-5" style={{ background: "oklch(var(--card))" }}>
          {description && (
            <p
              className="font-sans text-xs mb-4"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
