import {
  Check,
  Download,
  Edit2,
  Plus,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BankRate {
  id: string;
  bank: string;
  homeLoan: string;
  personalLoan: string;
  fd: string;
}

interface JantriRate {
  id: string;
  locality: string;
  ratePerSqm: string;
  lastUpdated: string;
}

interface PriceIndex {
  id: string;
  locality: string;
  price: string;
  trend: string;
}

interface MarketData {
  bankRates: BankRate[];
  jantriRates: JantriRate[];
  priceIndex: PriceIndex[];
  lastUpdated: string;
}

// ── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_BANK_RATES: BankRate[] = [
  { id: "sbi", bank: "SBI", homeLoan: "8.5", personalLoan: "11.0", fd: "7.1" },
  {
    id: "hdfc",
    bank: "HDFC Bank",
    homeLoan: "8.75",
    personalLoan: "11.5",
    fd: "7.25",
  },
  {
    id: "icici",
    bank: "ICICI Bank",
    homeLoan: "8.75",
    personalLoan: "11.75",
    fd: "7.15",
  },
  {
    id: "axis",
    bank: "Axis Bank",
    homeLoan: "8.75",
    personalLoan: "11.25",
    fd: "7.2",
  },
  {
    id: "kotak",
    bank: "Kotak Mahindra",
    homeLoan: "8.65",
    personalLoan: "10.99",
    fd: "7.4",
  },
  {
    id: "bob",
    bank: "Bank of Baroda",
    homeLoan: "8.4",
    personalLoan: "11.4",
    fd: "7.3",
  },
  {
    id: "pnb",
    bank: "Punjab National Bank",
    homeLoan: "8.5",
    personalLoan: "11.25",
    fd: "7.15",
  },
  {
    id: "canara",
    bank: "Canara Bank",
    homeLoan: "8.45",
    personalLoan: "11.0",
    fd: "7.0",
  },
];

const DEFAULT_JANTRI_RATES: JantriRate[] = [
  {
    id: "bopal",
    locality: "Bopal",
    ratePerSqm: "12000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "satellite",
    locality: "Satellite",
    ratePerSqm: "25000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "sghighway",
    locality: "SG Highway",
    ratePerSqm: "22000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "navrangpura",
    locality: "Navrangpura",
    ratePerSqm: "28000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "prahladnagar",
    locality: "Prahlad Nagar",
    ratePerSqm: "24000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "vastrapur",
    locality: "Vastrapur",
    ratePerSqm: "23000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "bodakdev",
    locality: "Bodakdev",
    ratePerSqm: "26000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "thaltej",
    locality: "Thaltej",
    ratePerSqm: "20000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "gota",
    locality: "Gota",
    ratePerSqm: "11000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
  {
    id: "chandkheda",
    locality: "Chandkheda",
    ratePerSqm: "10000",
    lastUpdated: new Date().toLocaleDateString("en-IN"),
  },
];

const DEFAULT_PRICE_INDEX: PriceIndex[] = [
  { id: "ahmedabad", locality: "Ahmedabad Avg", price: "4200", trend: "+3.2" },
  { id: "bopal", locality: "Bopal", price: "4800", trend: "+2.8" },
  { id: "sghighway", locality: "SG Highway", price: "6200", trend: "+4.1" },
  { id: "satellite", locality: "Satellite", price: "7500", trend: "+1.9" },
  { id: "navrangpura", locality: "Navrangpura", price: "8800", trend: "+5.2" },
];

const STORAGE_KEY = "mstc-market-data";

function loadData(): MarketData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MarketData;
  } catch {
    // ignore
  }
  return {
    bankRates: DEFAULT_BANK_RATES,
    jantriRates: DEFAULT_JANTRI_RATES,
    priceIndex: DEFAULT_PRICE_INDEX,
    lastUpdated: new Date().toLocaleString("en-IN"),
  };
}

function saveData(data: MarketData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Inline editable cell ──────────────────────────────────────────────────────

function EditableCell({
  value,
  onSave,
  prefix = "",
  suffix = "",
}: {
  value: string;
  onSave: (v: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  }

  function discard() {
    setDraft(value);
    setEditing(false);
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") discard();
          }}
          className="w-24 px-2 py-0.5 rounded bg-[#1a1c22] border border-yellow-500/50 text-yellow-200 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/60"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className="text-sm text-foreground/80 hover:text-yellow-300 transition-colors cursor-pointer group flex items-center gap-1"
      title="Click to edit"
    >
      {prefix}
      {value}
      {suffix}
      <Edit2
        size={11}
        className="opacity-0 group-hover:opacity-60 transition-opacity"
      />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminMarketDataTab() {
  const [data, setData] = useState<MarketData>(loadData);
  const [pdfReady, setPdfReady] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<PriceIndex | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load jsPDF dynamically
  useEffect(() => {
    const existing = document.querySelector("script[data-jspdf]");
    if (existing) {
      setPdfReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.setAttribute("data-jspdf", "true");
    script.onload = () => setPdfReady(true);
    document.head.appendChild(script);
  }, []);

  const updateTimestamp = useCallback(() => {
    return new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, []);

  // ── Bank rate helpers ──
  function updateBankCell(id: string, field: keyof BankRate, val: string) {
    setData((prev) => ({
      ...prev,
      bankRates: prev.bankRates.map((r) =>
        r.id === id ? { ...r, [field]: val } : r,
      ),
      lastUpdated: updateTimestamp(),
    }));
  }

  function addBankRow() {
    setData((prev) => ({
      ...prev,
      bankRates: [
        ...prev.bankRates,
        {
          id: `bank-${Date.now()}`,
          bank: "New Bank",
          homeLoan: "0",
          personalLoan: "0",
          fd: "0",
        },
      ],
    }));
  }

  function removeBankRow(id: string) {
    setData((prev) => ({
      ...prev,
      bankRates: prev.bankRates.filter((r) => r.id !== id),
    }));
  }

  // ── Jantri rate helpers ──
  function updateJantriCell(id: string, field: keyof JantriRate, val: string) {
    setData((prev) => ({
      ...prev,
      jantriRates: prev.jantriRates.map((r) =>
        r.id === id
          ? { ...r, [field]: val, lastUpdated: updateTimestamp() }
          : r,
      ),
      lastUpdated: updateTimestamp(),
    }));
  }

  function addJantriRow() {
    setData((prev) => ({
      ...prev,
      jantriRates: [
        ...prev.jantriRates,
        {
          id: `jantri-${Date.now()}`,
          locality: "New Locality",
          ratePerSqm: "0",
          lastUpdated: new Date().toLocaleDateString("en-IN"),
        },
      ],
    }));
  }

  function removeJantriRow(id: string) {
    setData((prev) => ({
      ...prev,
      jantriRates: prev.jantriRates.filter((r) => r.id !== id),
    }));
  }

  // ── Price index helpers ──
  function startEditPrice(item: PriceIndex) {
    setEditingPriceId(item.id);
    setPriceDraft({ ...item });
  }

  function commitEditPrice() {
    if (!priceDraft) return;
    setData((prev) => ({
      ...prev,
      priceIndex: prev.priceIndex.map((p) =>
        p.id === priceDraft.id ? priceDraft : p,
      ),
      lastUpdated: updateTimestamp(),
    }));
    setEditingPriceId(null);
    setPriceDraft(null);
  }

  // ── Save all ──
  function handleSaveAll() {
    const updated = { ...data, lastUpdated: updateTimestamp() };
    setData(updated);
    saveData(updated);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  // ── Export PDF ──
  function handleExportPDF() {
    if (!pdfReady) return;
    try {
      // @ts-expect-error jsPDF loaded dynamically
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("MSTC GLOBAL — Market Intelligence Report", 14, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${data.lastUpdated}`, 14, 28);

      let y = 38;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Bank Interest Rates (Home Loans)", 14, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const r of data.bankRates) {
        doc.text(
          `${r.bank}: Home ${r.homeLoan}% | Personal ${r.personalLoan}% | FD ${r.fd}%`,
          14,
          y,
        );
        y += 6;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }

      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Jantri Rates (Circle Rates)", 14, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const r of data.jantriRates) {
        doc.text(
          `${r.locality}: ₹${Number(r.ratePerSqm).toLocaleString("en-IN")}/sqm`,
          14,
          y,
        );
        y += 6;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }

      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Property Price Index", 14, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const p of data.priceIndex) {
        doc.text(
          `${p.locality}: ₹${Number(p.price).toLocaleString("en-IN")}/sqft (${p.trend}%)`,
          14,
          y,
        );
        y += 6;
      }

      doc.save("MSTC-Market-Intelligence.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  }

  const trendPositive = (t: string) => !t.startsWith("-");

  return (
    <div className="space-y-8 pb-10" data-ocid="market-data.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-yellow-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Market Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Powered by MSTC Intelligence AI
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Last updated: {data.lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
            data-ocid="market-data.save_button"
          >
            {savedFlash ? <Check size={15} /> : <Save size={15} />}
            {savedFlash ? "Saved!" : "Save All"}
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={!pdfReady}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-700/30 text-yellow-400/80 hover:bg-yellow-700/10 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            data-ocid="market-data.export_button"
          >
            <Download size={15} />
            {pdfReady ? "Export PDF" : "Loading PDF..."}
          </button>
        </div>
      </div>

      {/* Bank Interest Rates */}
      <section
        className="rounded-xl border border-yellow-700/20 bg-[#0d0f14] overflow-hidden"
        data-ocid="market-data.bank-rates.section"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-yellow-700/20 bg-[#111318]">
          <h2
            className="text-base font-semibold text-yellow-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Bank Interest Rates (Home Loans)
          </h2>
          <button
            type="button"
            onClick={addBankRow}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
            data-ocid="market-data.bank-rates.add_button"
          >
            <Plus size={13} /> Add Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-700/15">
                {[
                  "Bank Name",
                  "Home Loan Rate (%)",
                  "Personal Loan Rate (%)",
                  "FD Rate (%)",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-medium text-yellow-500/70 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.bankRates.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-yellow-700/10 transition-colors hover:bg-yellow-500/5 ${
                    i % 2 === 0 ? "bg-[#0d0f14]" : "bg-[#111318]/60"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={row.bank}
                      onSave={(v) => updateBankCell(row.id, "bank", v)}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={row.homeLoan}
                      onSave={(v) => updateBankCell(row.id, "homeLoan", v)}
                      suffix="%"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={row.personalLoan}
                      onSave={(v) => updateBankCell(row.id, "personalLoan", v)}
                      suffix="%"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={row.fd}
                      onSave={(v) => updateBankCell(row.id, "fd", v)}
                      suffix="%"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => removeBankRow(row.id)}
                      className="p-1 rounded text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      data-ocid={`market-data.bank-rates.delete_button.${i + 1}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Jantri Rates */}
      <section
        className="rounded-xl border border-yellow-700/20 bg-[#0d0f14] overflow-hidden"
        data-ocid="market-data.jantri.section"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-yellow-700/20 bg-[#111318]">
          <h2
            className="text-base font-semibold text-yellow-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Jantri Rates (Government Circle Rates)
          </h2>
          <button
            type="button"
            onClick={addJantriRow}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
            data-ocid="market-data.jantri.add_button"
          >
            <Plus size={13} /> Add Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-700/15">
                {["Locality", "Rate per sqm (₹)", "Last Updated", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-medium text-yellow-500/70 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {data.jantriRates.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-yellow-700/10 hover:bg-yellow-500/5 transition-colors ${
                    i % 2 === 0 ? "bg-[#0d0f14]" : "bg-[#111318]/60"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={row.locality}
                      onSave={(v) => updateJantriCell(row.id, "locality", v)}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <EditableCell
                      value={Number(row.ratePerSqm).toLocaleString("en-IN")}
                      onSave={(v) =>
                        updateJantriCell(
                          row.id,
                          "ratePerSqm",
                          v.replace(/,/g, ""),
                        )
                      }
                      prefix="₹"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground/60">
                    {row.lastUpdated}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => removeJantriRow(row.id)}
                      className="p-1 rounded text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      data-ocid={`market-data.jantri.delete_button.${i + 1}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Property Price Index */}
      <section
        className="rounded-xl border border-yellow-700/20 bg-[#0d0f14] overflow-hidden"
        data-ocid="market-data.price-index.section"
      >
        <div className="px-5 py-3 border-b border-yellow-700/20 bg-[#111318]">
          <h2
            className="text-base font-semibold text-yellow-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Property Price Index (per sqft)
          </h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {data.priceIndex.map((item, i) => {
            const isPos = trendPositive(item.trend);
            const isEditing = editingPriceId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-lg border border-yellow-700/20 bg-[#111318] p-4 flex flex-col gap-2 relative group"
                data-ocid={`market-data.price-index.card.${i + 1}`}
              >
                {isEditing && priceDraft ? (
                  <>
                    <input
                      className="text-sm font-semibold bg-transparent border-b border-yellow-500/40 text-yellow-300 focus:outline-none w-full mb-1"
                      value={priceDraft.locality}
                      onChange={(e) =>
                        setPriceDraft({
                          ...priceDraft,
                          locality: e.target.value,
                        })
                      }
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">₹</span>
                      <input
                        className="text-xl font-bold bg-transparent border-b border-yellow-500/40 text-yellow-200 focus:outline-none w-full"
                        value={priceDraft.price}
                        onChange={(e) =>
                          setPriceDraft({
                            ...priceDraft,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        className="text-xs bg-transparent border-b border-yellow-500/30 text-green-400 focus:outline-none w-20"
                        value={priceDraft.trend}
                        onChange={(e) =>
                          setPriceDraft({
                            ...priceDraft,
                            trend: e.target.value,
                          })
                        }
                        placeholder="+3.2"
                      />
                      <span className="text-xs text-muted-foreground">
                        % trend
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={commitEditPrice}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Check size={12} /> Save
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {item.locality}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${isPos ? "text-green-400" : "text-red-400"}`}
                    >
                      {isPos ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {item.trend}%
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditPrice(item)}
                      className="absolute top-3 right-3 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      data-ocid={`market-data.price-index.edit_button.${i + 1}`}
                    >
                      <Edit2 size={11} />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
