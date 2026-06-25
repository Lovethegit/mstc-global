import { useState } from "react";

interface VolunteerEntry {
  id: string;
  name: string;
  activity: string;
  date: string;
  hours: number;
}

const SCHEDULE_VII = [
  "Eradicating hunger, poverty, malnutrition",
  "Promoting education including special education",
  "Promoting gender equality and women empowerment",
  "Reducing child mortality and improving maternal health",
  "Combating human immunodeficiency virus, diseases",
  "Ensuring environmental sustainability and ecological balance",
  "Protection of national heritage, art and culture",
  "Measures for the benefit of armed forces veterans",
  "Promotion and development of traditional arts and handicrafts",
  "Measures for the welfare of SC, ST, OBC and minorities",
  "Slum area development",
  "Disaster management and rehabilitation",
  "Rural development projects",
  "Setting up homes and hostels for women and orphans",
  "Setting up old age homes, day care centres",
];

const ALLOCATION = [
  { category: "Education", pct: 30 },
  { category: "Healthcare", pct: 25 },
  { category: "Environment", pct: 20 },
  { category: "Rural Development", pct: 15 },
  { category: "Other", pct: 10 },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function loadVolunteers(): VolunteerEntry[] {
  try {
    return JSON.parse(localStorage.getItem("mstc_volunteers") || "[]");
  } catch {
    return [];
  }
}

export default function CsrToolsPage() {
  const [activeTab, setActiveTab] = useState<
    "budget" | "receipt" | "volunteer"
  >("budget");

  // Budget planner
  const [netProfit, setNetProfit] = useState("");
  const [unspent, setUnspent] = useState("");

  // 80G Receipt
  const [donor, setDonor] = useState("");
  const [pan, setPan] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [receiptNo, setReceiptNo] = useState(
    `MSTCF/${new Date().getFullYear()}/001`,
  );
  const [showReceipt, setShowReceipt] = useState(false);

  // Volunteer tracker
  const [volunteers, setVolunteers] =
    useState<VolunteerEntry[]>(loadVolunteers);
  const [vName, setVName] = useState("");
  const [vActivity, setVActivity] = useState("");
  const [vDate, setVDate] = useState(new Date().toISOString().split("T")[0]);
  const [vHours, setVHours] = useState("1");
  const [certFor, setCertFor] = useState<string | null>(null);

  const profit = Number.parseFloat(netProfit.replace(/,/g, "")) || 0;
  const unspentAmt = Number.parseFloat(unspent.replace(/,/g, "")) || 0;
  const mandatory = profit * 0.02;
  const transferToFund = unspentAmt > 5000000;

  const saveVolunteers = (list: VolunteerEntry[]) => {
    setVolunteers(list);
    localStorage.setItem("mstc_volunteers", JSON.stringify(list));
  };

  const addVolunteer = () => {
    if (!vName.trim() || !vActivity.trim()) return;
    const entry: VolunteerEntry = {
      id: Date.now().toString(),
      name: vName.trim(),
      activity: vActivity.trim(),
      date: vDate,
      hours: Number.parseFloat(vHours) || 1,
    };
    saveVolunteers([...volunteers, entry]);
    setVName("");
    setVActivity("");
    setVHours("1");
  };

  const removeVolunteer = (id: string) =>
    saveVolunteers(volunteers.filter((v) => v.id !== id));

  const totalHours = volunteers.reduce((s, v) => s + v.hours, 0);

  const certEntry = volunteers.find((v) => v.id === certFor);
  const certText = certEntry
    ? `CERTIFICATE OF VOLUNTEER SERVICE\n\nThis is to certify that\n\n${certEntry.name}\n\nhas volunteered ${certEntry.hours} hour(s) for the activity:\n"${certEntry.activity}"\n\non ${certEntry.date}\n\nunder the aegis of MSTC GLOBAL FOUNDATION, Ahmedabad.\n\nWe appreciate their valuable contribution towards social welfare.\n\n\nAuthorised Signatory\nMSTC GLOBAL FOUNDATION\nAhmedabad, Gujarat - 380054`
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            CSR & NGO Tools
          </h1>
          <p className="text-muted-foreground font-sans">
            Compliance, receipts, and volunteer management for corporate social
            responsibility.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border flex-wrap">
          {(["budget", "receipt", "volunteer"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid={`csr_tools.${tab}_tab`}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 font-sans text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {tab === "budget"
                ? "CSR Budget Planner"
                : tab === "receipt"
                  ? "80G Receipt Generator"
                  : "Volunteer Tracker"}
            </button>
          ))}
        </div>

        {/* === CSR BUDGET PLANNER === */}
        {activeTab === "budget" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Annual Net Profit (₹)
                </label>
                <input
                  type="text"
                  value={netProfit}
                  data-ocid="csr_tools.net_profit_input"
                  onChange={(e) => setNetProfit(e.target.value)}
                  placeholder="e.g. 50000000"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Previous Year Unspent CSR Amount (₹)
                </label>
                <input
                  type="text"
                  value={unspent}
                  data-ocid="csr_tools.unspent_input"
                  onChange={(e) => setUnspent(e.target.value)}
                  placeholder="e.g. 0"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                />
              </div>

              {profit > 0 && (
                <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-muted-foreground">
                      Mandatory CSR Spend (2%)
                    </span>
                    <span className="font-serif font-bold text-primary text-lg">
                      {fmt(mandatory)}
                    </span>
                  </div>
                  {unspentAmt > 0 && (
                    <div
                      className={`text-xs font-sans p-3 rounded-lg ${
                        transferToFund
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {transferToFund
                        ? `Unspent amount ${fmt(unspentAmt)} exceeds ₹50L — must be transferred to PM Relief Fund or scheduled bank as per Companies Act Section 135(6).`
                        : `Unspent amount ${fmt(unspentAmt)} must be spent within the next financial year.`}
                    </div>
                  )}

                  <div className="border-t border-border pt-3">
                    <div className="font-sans text-sm font-medium text-foreground mb-3">
                      Recommended Allocation
                    </div>
                    {ALLOCATION.map((a) => (
                      <div
                        key={a.category}
                        className="flex justify-between items-center py-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-sans text-foreground">
                            {a.category} ({a.pct}%)
                          </span>
                        </div>
                        <span className="text-sm font-sans text-primary font-medium">
                          {fmt(Math.round((mandatory * a.pct) / 100))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-muted/40 rounded-xl p-4">
                <h4 className="font-sans text-sm font-medium text-foreground mb-2">
                  Schedule VII Activities
                </h4>
                <ul className="space-y-1">
                  {SCHEDULE_VII.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs font-sans text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif text-base font-bold text-foreground mb-3">
                CSR Compliance Notes
              </h3>
              <div className="space-y-3 text-xs font-sans text-muted-foreground leading-relaxed">
                <p>
                  • Section 135 of the Companies Act 2013 mandates CSR for
                  companies with net worth ≥ ₹500 crore, turnover ≥ ₹1,000
                  crore, or net profit ≥ ₹5 crore.
                </p>
                <p>
                  • The mandatory spend is 2% of average net profit of the
                  preceding 3 financial years.
                </p>
                <p>
                  • CSR activities must be as per Schedule VII of the Companies
                  Act.
                </p>
                <p>
                  • Annual CSR Report must be filed with MCA via Form AOC-4 /
                  Annual Report.
                </p>
                <p>
                  • Board of Directors must form a CSR Committee (for applicable
                  companies).
                </p>
                <p>
                  • MSTC GLOBAL can assist in CSR policy drafting,
                  implementation, and reporting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* === 80G RECEIPT === */}
        {activeTab === "receipt" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                {
                  label: "Donor Name",
                  val: donor,
                  set: setDonor,
                  id: "donor_name_input",
                  ph: "Full name",
                },
                {
                  label: "PAN Number",
                  val: pan,
                  set: setPan,
                  id: "pan_input",
                  ph: "ABCDE1234F",
                },
                {
                  label: "Amount (₹)",
                  val: amount,
                  set: setAmount,
                  id: "amount_input",
                  ph: "e.g. 5000",
                },
                {
                  label: "Receipt Number",
                  val: receiptNo,
                  set: setReceiptNo,
                  id: "receipt_no_input",
                  ph: "",
                },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.val}
                    data-ocid={`csr_tools.${field.id}`}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder={field.ph}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                  Date
                </label>
                <input
                  type="date"
                  value={receiptDate}
                  data-ocid="csr_tools.receipt_date_input"
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                />
              </div>
              <button
                type="button"
                data-ocid="csr_tools.generate_receipt_button"
                onClick={() => setShowReceipt(true)}
                disabled={!donor || !amount}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Generate Receipt
              </button>
              <p className="text-xs text-muted-foreground font-sans">
                Disclaimer: This is a template receipt for documentation
                purposes. Please consult a chartered accountant for official 80G
                receipts and Income Tax compliance.
              </p>
            </div>

            {showReceipt && (
              <div
                className="bg-white text-black rounded-xl p-6 border border-border"
                id="receipt-printable"
              >
                <div className="text-center border-b-2 border-yellow-600 pb-4 mb-4">
                  <div className="text-lg font-bold text-yellow-700">
                    MSTC GLOBAL FOUNDATION
                  </div>
                  <div className="text-xs">
                    5, ShwetShikhar Society, Shantivan, Ahmedabad - 380054
                  </div>
                  <div className="text-xs">
                    Phone: +91 9512609016 | Email: mstc.gbl@gmail.com
                  </div>
                  <div className="text-xs font-medium mt-1">
                    80G Registration: [Reg. No.] | PAN: [MSTCF PAN]
                  </div>
                </div>
                <div className="text-center text-sm font-bold mb-4 uppercase tracking-wide">
                  Receipt for Donation — 80G
                </div>
                <table className="w-full text-xs mb-4">
                  <tbody>
                    {[
                      ["Receipt No.", receiptNo],
                      ["Date", receiptDate],
                      ["Donor Name", donor],
                      ["Donor PAN", pan || "Not Provided"],
                      [
                        "Amount",
                        `₹${(
                          Number.parseFloat(amount.replace(/,/g, "")) || 0
                        ).toLocaleString("en-IN")}`,
                      ],
                      [
                        "Amount in Words",
                        `Rupees ${(
                          Number.parseFloat(amount.replace(/,/g, "")) || 0
                        ).toLocaleString("en-IN")} only`,
                      ],
                      ["Mode of Payment", "As declared by donor"],
                      ["Purpose", "General Donation for Social Welfare"],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-gray-100">
                        <td className="py-1.5 font-medium w-1/3">{k}</td>
                        <td className="py-1.5">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mb-4">
                  This donation qualifies for 50% deduction under Section 80G of
                  the Income Tax Act, 1961. Subject to overall qualifying limit.
                </p>
                <div className="text-right text-xs">
                  <div className="mt-8 border-t border-gray-300 pt-2 inline-block w-40 text-center">
                    Authorised Signatory
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  data-ocid="csr_tools.print_receipt_button"
                  className="mt-4 w-full py-2 rounded-lg bg-yellow-600 text-white font-sans font-semibold text-sm hover:bg-yellow-700 transition-colors print:hidden"
                >
                  Print Receipt
                </button>
              </div>
            )}
          </div>
        )}

        {/* === VOLUNTEER TRACKER === */}
        {activeTab === "volunteer" && (
          <div>
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-serif text-base font-bold text-primary mb-4">
                Add Volunteer Entry
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "Volunteer Name",
                    val: vName,
                    set: setVName,
                    id: "vol_name_input",
                    ph: "Full name",
                  },
                  {
                    label: "Activity / Program",
                    val: vActivity,
                    set: setVActivity,
                    id: "vol_activity_input",
                    ph: "Tree plantation, blood camp…",
                  },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1 font-sans">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={f.val}
                      data-ocid={`csr_tools.${f.id}`}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.ph}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1 font-sans">
                    Date
                  </label>
                  <input
                    type="date"
                    value={vDate}
                    data-ocid="csr_tools.vol_date_input"
                    onChange={(e) => setVDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1 font-sans">
                    Hours
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={24}
                    step={0.5}
                    value={vHours}
                    data-ocid="csr_tools.vol_hours_input"
                    onChange={(e) => setVHours(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                  />
                </div>
              </div>
              <button
                type="button"
                data-ocid="csr_tools.add_volunteer_button"
                onClick={addVolunteer}
                disabled={!vName.trim() || !vActivity.trim()}
                className="mt-3 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                Add Entry
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-base font-bold text-foreground">
                Volunteer Log
              </h3>
              <div className="text-sm font-sans text-primary font-medium">
                {totalHours} total hours
              </div>
            </div>

            {volunteers.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground font-sans"
                data-ocid="csr_tools.volunteers_empty_state"
              >
                No entries yet. Add your first volunteer above.
              </div>
            ) : (
              <div className="space-y-2">
                {volunteers.map((v, i) => (
                  <div
                    key={v.id}
                    data-ocid={`csr_tools.volunteer_item.${i + 1}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm font-medium text-foreground">
                        {v.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans">
                        {v.activity} · {v.date}
                      </div>
                    </div>
                    <div className="text-sm font-sans text-primary font-medium shrink-0">
                      {v.hours}h
                    </div>
                    <button
                      type="button"
                      data-ocid={`csr_tools.volunteer_cert_button.${i + 1}`}
                      onClick={() => setCertFor(certFor === v.id ? null : v.id)}
                      className="text-xs px-3 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors font-sans"
                    >
                      Certificate
                    </button>
                    <button
                      type="button"
                      data-ocid={`csr_tools.volunteer_delete_button.${i + 1}`}
                      onClick={() => removeVolunteer(v.id)}
                      className="text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors font-sans"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {certEntry && (
              <div className="mt-6 bg-white text-black rounded-xl p-6 border border-border">
                <pre className="font-sans text-xs whitespace-pre-wrap text-center">
                  {certText}
                </pre>
                <button
                  type="button"
                  onClick={() => window.print()}
                  data-ocid="csr_tools.print_cert_button"
                  className="mt-4 w-full py-2 rounded-lg bg-yellow-600 text-white font-sans font-semibold text-sm hover:bg-yellow-700 transition-colors print:hidden"
                >
                  Print Certificate
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
