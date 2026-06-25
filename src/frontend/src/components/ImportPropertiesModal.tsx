import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyListing as BackendPropertyListing } from "../backend";
import type {
  BulkImportError,
  BulkImportProgress,
  BulkImportResult,
} from "../hooks/usePropertyQueries";
import {
  ACTIONS,
  AHMEDABAD_LOCATIONS,
  PROPERTY_TYPES,
} from "../types/property";

// ── CSV Template ──────────────────────────────────────────────────────────────────────

const TEMPLATE_HEADERS = [
  "Title",
  "Property Type",
  "Action",
  "BHK",
  "Price",
  "Address",
  "Location",
  "City",
  "Description",
  "SqFt",
  "Furnishing",
  "Possession",
  "Floor No",
  "Facing",
  "Society Name",
  "Amenities",
  "Image1 URL",
  "Image2 URL",
  "Image3 URL",
  "Owner Name",
  "Owner Phone",
  "Owner Email",
  "Agency Name",
  "Agency Phone",
  "Source Tag",
  "Map Link",
];

const SAMPLE_ROWS = [
  [
    "3 BHK Flat in Satellite",
    "Residential",
    "Buy",
    "3 BHK",
    "7500000",
    "Plot 12, Shivalik Greens, Satellite Road, Ahmedabad 380015",
    "Satellite",
    "Ahmedabad",
    "Spacious 3 BHK with modular kitchen and garden view. Ready to move.",
    "1450",
    "Semi-Furnished",
    "Ready to Move",
    "5",
    "East",
    "Shivalik Greens",
    "Parking, Gym, Swimming Pool, Lift, Security",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "",
    "",
    "Rajesh Patel",
    "+91 9876543210",
    "rajesh@email.com",
    "Patel Realty",
    "+91 9876543211",
    "99acres",
    "https://maps.app.goo.gl/example",
  ],
  [
    "2 BHK Apartment for Rent in Bopal",
    "Residential",
    "Rent",
    "2 BHK",
    "18000",
    "B-301, Orchid Residency, Bopal, Ahmedabad 380058",
    "Bopal",
    "Ahmedabad",
    "Well-maintained 2 BHK with covered parking and 24hr security.",
    "980",
    "Furnished",
    "Immediate",
    "3",
    "West",
    "Orchid Residency",
    "Parking, Lift, Security, Power Backup",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "",
    "",
    "Meena Shah",
    "+91 9123456789",
    "meena@email.com",
    "",
    "",
    "MagicBricks",
    "",
  ],
  [
    "Commercial Office Space on SG Highway",
    "Commercial",
    "Lease",
    "Office",
    "120000",
    "6th Floor, SG Business Hub, SG Highway, Ahmedabad 380054",
    "SG Highway",
    "Ahmedabad",
    "Premium Grade A office space with full glass facade and 100 Mbps internet.",
    "2400",
    "Unfurnished",
    "Ready to Move",
    "6",
    "North",
    "SG Business Hub",
    "Parking, Lift, Security, Power Backup, Club House",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    "",
    "",
    "Vikram Desai",
    "+91 9988776655",
    "vikram@realty.com",
    "Desai Properties",
    "+91 9988776666",
    "Housing.com",
    "",
  ],
];

function generateTemplateCSV(): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const header = TEMPLATE_HEADERS.map(esc).join(",");
  const rows = SAMPLE_ROWS.map((r) => r.map(esc).join(","));
  return [header, ...rows].join("\n");
}

function downloadCSV() {
  const content = generateTemplateCSV();
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mstc-property-import-template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── File type badge ──────────────────────────────────────────────────────────────────

function FileTypeBadge({ ext }: { ext: string }) {
  const map: Record<string, string> = {
    csv: "bg-blue-600/20 text-blue-300 border-blue-600/40",
    xlsx: "bg-emerald-600/20 text-emerald-300 border-emerald-600/40",
    xls: "bg-emerald-600/20 text-emerald-300 border-emerald-600/40",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${map[ext] ?? "bg-muted/20 text-foreground border-border"}`}
    >
      .{ext}
    </span>
  );
}

function downloadErrorCSV(errors: BulkImportError[], fileName: string) {
  const header = "Row #,Property ID,Reason";
  const rows = errors.map(
    (e) =>
      `"${e.rowIndex}","${e.id.replace(/"/g, '""')}","${e.reason.replace(/"/g, '""')}"`,
  );
  const blob = new Blob([[header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `import-errors-${fileName.replace(/[^a-z0-9]/gi, "-")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── CSV Parser ──────────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): string[][] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  return lines.filter((l) => l.trim()).map(parseCSVLine);
}

// ── XLSX Parser (dynamic import via SheetJS) ─────────────────────────────────────────

// Declare the XLSX global shape that the CDN script injects
declare global {
  interface Window {
    XLSX?: XLSXLike;
  }
}

interface XLSXLike {
  read: (data: ArrayBuffer, opts: { type: string }) => XLSXWorkbook;
  utils: {
    sheet_to_json: (
      ws: unknown,
      opts: { header: number },
    ) => (string | number | null)[][];
  };
}

interface XLSXWorkbook {
  SheetNames: string[];
  Sheets: Record<string, unknown>;
}

async function parseXLSXBuffer(buffer: ArrayBuffer): Promise<string[][]> {
  // Load SheetJS from CDN (no bundle dep needed — deferred until user uploads XLSX)
  let XLSX: XLSXLike;
  if (window.XLSX) {
    XLSX = window.XLSX;
  } else {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      s.onload = () => resolve();
      s.onerror = () =>
        reject(
          new Error("Failed to load XLSX parser. Please try saving as CSV."),
        );
      document.head.appendChild(s);
    });
    if (!window.XLSX) throw new Error("XLSX parser not available.");
    XLSX = window.XLSX;
  }

  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  // header: 1 returns array-of-arrays
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as (
    | string
    | number
    | null
  )[][];
  // Normalise: convert every cell to string
  return rows
    .filter((r) => r.some((c) => c !== null && c !== undefined && c !== ""))
    .map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c))));
}

// ── Validation ─────────────────────────────────────────────────────────────────────

type ParsedRow = {
  rowNum: number;
  data: BackendPropertyListing;
  errors: string[];
};

const COLUMN_ALIASES: Record<string, string[]> = {
  price: [
    "prce",
    "cst",
    "amt",
    "rate",
    "cost",
    "value",
    "amount",
    "val",
    "prc",
    "propertyprice",
    "asking",
    "rent",
    "monthly",
  ],
  location: [
    "loc",
    "loctn",
    "lctn",
    "neighbourhood",
    "neighborhood",
    "zone",
    "area",
    "region",
    "locality",
    "city",
  ],
  bhk: ["bedroom", "bed", "bedrm", "rooms", "config", "bedrooms", "roomtype"],
  carpetArea: [
    "sqft",
    "size",
    "carpet",
    "builtup",
    "built_up",
    "sqmtr",
    "sqm",
    "areainsqft",
  ],
  title: ["prop", "heading", "name", "propname", "propertyname", "listing"],
  reraNumber: ["rera", "rerano", "reranumber", "reraid", "reranum", "rera_no"],
  furnishing: ["furnshd", "furnish", "furnished", "furnishingstatus"],
  possession: ["posession", "possn", "poss", "handover", "possession_status"],
  contactPhone: ["phone", "mobile", "ph", "mob", "contact", "contactno"],
};

function similarityScore(a: string, b: string): number {
  const s1 = a.toLowerCase().replace(/[^a-z0-9]/g, "");
  const s2 = b.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!s1 || !s2) return 0;
  let common = 0;
  for (const c of s1) {
    if (s2.includes(c)) common++;
  }
  return common / Math.max(s1.length, s2.length);
}

function validateAndMap(rows: string[][], headers: string[]): ParsedRow[] {
  const normalizedHeaders = headers.map((h) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""),
  );

  const h = (name: string): number => {
    // Step 1: exact match (case-insensitive)
    const exactIdx = headers.findIndex(
      (hdr) => hdr.trim().toLowerCase() === name.toLowerCase(),
    );
    if (exactIdx >= 0) return exactIdx;

    // Step 2: alias match
    const aliases = COLUMN_ALIASES[name] ?? [];
    const aliasIdx = normalizedHeaders.findIndex((nh) => aliases.includes(nh));
    if (aliasIdx >= 0) return aliasIdx;

    // Step 3: similarity match (threshold 0.65)
    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < normalizedHeaders.length; i++) {
      const score = similarityScore(name, normalizedHeaders[i]);
      if (score >= 0.65 && score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const col = (row: string[], name: string) => {
    const idx = h(name);
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  return rows.map((row, i): ParsedRow => {
    const rowNum = i + 2; // +2 because row 1 is headers
    const errors: string[] = [];

    const title = col(row, "Title");
    if (!title) errors.push("Title is required");

    const propertyType = col(row, "Property Type");
    if (!propertyType || !PROPERTY_TYPES.includes(propertyType)) {
      errors.push(
        `Invalid Property Type "${propertyType}". Must be one of: ${PROPERTY_TYPES.join(", ")}`,
      );
    }

    const action = col(row, "Action");
    if (!action || !ACTIONS.includes(action)) {
      errors.push(
        `Invalid Action "${action}". Must be one of: ${ACTIONS.join(", ")}`,
      );
    }

    const bhk = col(row, "BHK");
    if (!bhk) errors.push("BHK is required");

    const priceStr = col(row, "Price");
    const priceNum = Number(priceStr);
    if (!priceStr || Number.isNaN(priceNum) || priceNum < 0) {
      errors.push(
        "Price must be a positive number (e.g. 7500000 for \u20b975 Lakh, not \u20b975L)",
      );
    }

    const location = col(row, "Location") || "Ahmedabad";
    const city = col(row, "City") || "Ahmedabad";
    const address = col(row, "Address");
    const desc = col(row, "Description");
    const sqftStr = col(row, "SqFt");
    const sqft = Math.max(0, Number(sqftStr) || 0);
    const furnishing = col(row, "Furnishing");
    const possession = col(row, "Possession");
    const floorStr = col(row, "Floor No");
    const floorNo = Math.max(0, Number(floorStr) || 0);
    const facing = col(row, "Facing");
    const societyName = col(row, "Society Name");
    const amenitiesStr = col(row, "Amenities");
    const amenities = amenitiesStr
      ? amenitiesStr
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [];

    const images = [
      col(row, "Image1 URL"),
      col(row, "Image2 URL"),
      col(row, "Image3 URL"),
    ].filter(Boolean);

    const ownerName = col(row, "Owner Name");
    const ownerPhone = col(row, "Owner Phone");
    const ownerEmail = col(row, "Owner Email");
    const agencyName = col(row, "Agency Name");
    const agencyPhone = col(row, "Agency Phone");
    const sourceTagRaw = col(row, "Source Tag");
    const sourceTag = ["99acres", "MagicBricks", "Housing.com"].includes(
      sourceTagRaw,
    )
      ? sourceTagRaw
      : "99acres";
    const mapLink = col(row, "Map Link");

    const price = BigInt(Math.max(0, Number(priceStr) || 0));
    const formatINR = (n: number) => {
      if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(2)} Cr`;
      if (n >= 100000) return `\u20b9${(n / 100000).toFixed(2)} L`;
      if (n >= 1000) return `\u20b9${(n / 1000).toFixed(0)}K`;
      return `\u20b9${n}`;
    };
    const priceDisplay =
      priceNum > 0 ? formatINR(priceNum) : "Price on Request";

    const data: BackendPropertyListing = {
      id: "", // backend assigns ID
      title,
      propertyType: PROPERTY_TYPES.includes(propertyType)
        ? propertyType
        : "Residential",
      action: ACTIONS.includes(action) ? action : "Buy",
      bhk,
      sqft: BigInt(sqft),
      price,
      priceDisplay,
      address,
      location,
      city,
      furnishing,
      possession,
      facing,
      floorNo: BigInt(floorNo),
      societyName,
      description: desc,
      amenities,
      images,
      mapLink,
      sourceTag,
      listedDate: new Date().toISOString().slice(0, 10),
      agencyName,
      agencyPhone,
      ownerName,
      ownerPhone,
      ownerEmail,
    };

    return { rowNum, data, errors };
  });
}

// ── Guide Section ──────────────────────────────────────────────────────────────────

export function ImportGuide({
  onDownloadTemplate,
}: { onDownloadTemplate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden border border-gold-700/30"
      data-ocid="manage_properties.import_guide.section"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/10 transition-colors text-left"
        data-ocid="manage_properties.import_guide.toggle"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-gold-300">
            How to Import Properties via Excel
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gold-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gold-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-6 pt-4 space-y-4 bg-muted/5 border-t border-gold-700/20">
          <StepItem
            num={1}
            title="Download the Template"
            body={
              <>
                Click the button below to download a ready-made CSV template
                with all column headers and 3 sample properties already filled
                in.
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gold-700/20 text-gold-300 border border-gold-700/40 hover:bg-gold-700/30 transition-colors"
                  data-ocid="manage_properties.import_guide.download_button"
                >
                  <Download size={12} /> Download Template
                </button>
              </>
            }
          />

          <StepItem
            num={2}
            title="Fill in Your Properties"
            body={
              <>
                One row per property. Required columns:
                <span className="inline-flex flex-wrap gap-1 mt-1.5">
                  {["Title", "Property Type", "Action", "BHK", "Price"].map(
                    (c) => (
                      <code
                        key={c}
                        className="px-1.5 py-0.5 rounded bg-gold-700/15 text-gold-300 text-xs"
                      >
                        {c}
                      </code>
                    ),
                  )}
                </span>
                <br />
                Optional: Description, SqFt, Furnishing, Possession, Floor No,
                Facing, Society Name, Amenities (comma-separated), Image1–3 URL,
                Owner Name/Phone/Email, Agency Name/Phone, Source Tag, Map Link.
              </>
            }
          />

          <StepItem
            num={3}
            title="Save as CSV, XLSX, or XLS"
            body="Save as CSV (File → Save As → CSV) or keep as .xlsx / .xls — all three are supported. Large files are automatically split into 500-row batches."
          />

          <StepItem
            num={4}
            title="Upload and Import"
            body="Click ‘Import Properties’, upload your file, review the preview, then click ‘Confirm Import’. Progress is shown batch-by-batch with a time estimate."
          />

          <StepItem
            num={5}
            title="Properties Appear Immediately"
            body="Once imported, all your properties will be visible in the portal right away. A full summary (imported / skipped / errors) is shown at the end."
            last
          />

          <div className="rounded-lg p-4 space-y-3 bg-card border border-border">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              💡 Tips &amp; Limits
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-none">
              <li>
                🔢{" "}
                <strong className="text-foreground">
                  Large files are auto-batched
                </strong>{" "}
                — upload your entire 50,000-row sheet at once. The importer
                splits it into 500-row batches automatically and shows progress
                for each.
              </li>
              <li>
                💰 <strong className="text-foreground">Price</strong> must be a
                plain number — e.g.
                <code className="ml-1 px-1.5 py-0.5 rounded bg-gold-700/15 text-gold-300 text-xs">
                  7500000
                </code>
                for ₹75 Lakh, NOT ₹75L or 75,00,000.
              </li>
              <li>
                🏠 <strong className="text-foreground">Property Type</strong>{" "}
                must be one of:{" "}
                {PROPERTY_TYPES.map((t) => (
                  <code
                    key={t}
                    className="mx-0.5 px-1.5 py-0.5 rounded bg-muted/20 text-foreground text-xs"
                  >
                    {t}
                  </code>
                ))}
              </li>
              <li>
                📋 <strong className="text-foreground">Action</strong> must be
                one of:{" "}
                {ACTIONS.map((a) => (
                  <code
                    key={a}
                    className="mx-0.5 px-1.5 py-0.5 rounded bg-muted/20 text-foreground text-xs"
                  >
                    {a}
                  </code>
                ))}
              </li>
              <li>
                🏙️ <strong className="text-foreground">Source Tag</strong> must
                be one of:
                <code className="mx-0.5 px-1.5 py-0.5 rounded bg-muted/20 text-foreground text-xs">
                  99acres
                </code>
                <code className="mx-0.5 px-1.5 py-0.5 rounded bg-muted/20 text-foreground text-xs">
                  MagicBricks
                </code>
                <code className="mx-0.5 px-1.5 py-0.5 rounded bg-muted/20 text-foreground text-xs">
                  Housing.com
                </code>
              </li>
            </ul>

            <p className="text-xs font-semibold text-destructive/80 mt-2">
              Common Errors
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>
                ❌ Invalid Property Type — must be Residential, Commercial,
                Plot, Industrial, or Redevelopment
              </li>
              <li>❌ Invalid Action — must be Buy, Rent, Lease, or PG</li>
              <li>
                ❌ Price must be a number (e.g. 7500000 for ₹75 Lakh, not ₹75L)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function StepItem({
  num,
  title,
  body,
  last,
}: {
  num: number;
  title: string;
  body: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="w-6 h-6 rounded-full bg-gold-700/30 border border-gold-700/50 flex items-center justify-center text-xs font-bold text-gold-300">
          {num}
        </div>
        {!last && <div className="w-px flex-1 bg-gold-700/20 min-h-[12px]" />}
      </div>
      <div className="pb-2">
        <p className="text-xs font-semibold text-foreground mb-0.5">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// ── Elapsed-time hook ────────────────────────────────────────────────────────────────────

function useImportTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active]);
  return elapsed;
}

function fmtTime(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

// ── Main Modal ───────────────────────────────────────────────────────────────────────

type ImportStep = "upload" | "preview" | "importing" | "done";

interface BatchProgress {
  batchIndex: number;
  totalBatches: number;
  totalAdded: number;
  totalRows: number;
}

export interface ImportPropertiesModalProps {
  onClose: () => void;
  onImport: (
    rows: BackendPropertyListing[],
    onProgress: (progress: BulkImportProgress) => void,
  ) => Promise<BulkImportResult>;
}

export function ImportPropertiesModal({
  onClose,
  onImport,
}: ImportPropertiesModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null,
  );
  const [importError, setImportError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({
    batchIndex: 0,
    totalBatches: 0,
    totalAdded: 0,
    totalRows: 0,
  });
  // Per-batch timing for ETA
  const batchStartTimesRef = useRef<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const elapsed = useImportTimer(step === "importing");

  const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";
  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const errorRows = parsedRows.filter((r) => r.errors.length > 0);

  // Derived progress values
  const overallPct =
    batchProgress.totalBatches > 0
      ? Math.round(
          (batchProgress.batchIndex / batchProgress.totalBatches) * 100,
        )
      : 0;

  // ETA: avg ms per completed batch × remaining batches
  const batchesCompleted = batchProgress.batchIndex;
  const batchesLeft = batchProgress.totalBatches - batchesCompleted;
  let etaStr = "Calculating...";
  if (batchesCompleted > 0 && batchesLeft > 0) {
    const times = batchStartTimesRef.current;
    const avgMs =
      times.length > 1
        ? (times[times.length - 1] - times[0]) / (times.length - 1)
        : 0;
    if (avgMs > 0) {
      const etaSecs = Math.ceil((avgMs * batchesLeft) / 1000);
      etaStr = `~${fmtTime(etaSecs)} remaining`;
    }
  } else if (batchesLeft === 0 && batchesCompleted > 0) {
    etaStr = "Finishing up...";
  }

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setImportError("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    try {
      let allRows: string[][];
      if (ext === "xlsx" || ext === "xls") {
        const buffer = await file.arrayBuffer();
        allRows = await parseXLSXBuffer(buffer);
      } else {
        const text = await file.text();
        allRows = parseCSV(text);
      }
      if (allRows.length < 2) {
        setImportError("File appears to be empty or has no data rows.");
        return;
      }
      const headers = allRows[0];
      const dataRows = allRows.slice(1);
      const parsed = validateAndMap(dataRows, headers);
      setParsedRows(parsed);
      setStep("preview");
    } catch (err) {
      setImportError(
        err instanceof Error
          ? `Failed to parse file: ${err.message}`
          : "Failed to parse file. Please check the format and try again.",
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  async function handleConfirmImport() {
    const rows = validRows.map((r) => r.data);
    const totalBatches = Math.max(1, Math.ceil(rows.length / 500));
    setBatchProgress({
      batchIndex: 0,
      totalBatches,
      totalAdded: 0,
      totalRows: rows.length,
    });
    batchStartTimesRef.current = [];
    setStep("importing");

    try {
      const result = await onImport(rows, (progress) => {
        batchStartTimesRef.current.push(Date.now());
        setBatchProgress({
          batchIndex: progress.batchIndex,
          totalBatches: progress.totalBatches,
          totalAdded: progress.totalAdded,
          totalRows: progress.totalRows,
        });
      });
      setImportResult(result);
      setStep("done");
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : "Import failed. Please try again.",
      );
      setStep("preview");
    }
  }

  const STEPS = [
    { id: "upload", label: "Upload" },
    { id: "preview", label: "Preview" },
    { id: "importing", label: "Import" },
    { id: "done", label: "Done" },
  ];
  const stepIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div
      className="fixed inset-0 bg-obsidian-900/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      onKeyDown={(e) => e.key === "Escape" && step !== "importing" && onClose()}
      data-ocid="manage_properties.import.dialog"
    >
      <div className="w-full max-w-2xl bg-card border border-gold-700/40 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/30">
          <h2 className="font-serif text-lg font-bold gold-text">
            Import Properties
          </h2>
          {step !== "importing" && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-obsidian-700 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
              data-ocid="manage_properties.import.close_button"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 px-6 pt-5 pb-3">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    idx < stepIdx
                      ? "bg-green-600/30 text-green-400 border border-green-600/50"
                      : idx === stepIdx
                        ? "bg-gold-700/30 text-gold-300 border border-gold-700/60"
                        : "bg-muted/20 text-muted-foreground border border-border"
                  }`}
                >
                  {idx < stepIdx ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    idx === stepIdx ? "text-gold-300" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 transition-colors ${
                    idx < stepIdx ? "bg-green-600/40" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="px-6 pb-6 pt-2">
          {/* STEP 1 — UPLOAD */}
          {step === "upload" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-gold-700/20">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Don’t have a template yet?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download the CSV template with headers and 3 sample rows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-700/20 text-gold-300 border border-gold-700/40 hover:bg-gold-700/30 transition-colors text-sm font-semibold whitespace-nowrap shrink-0"
                  data-ocid="manage_properties.import.download_template_button"
                >
                  <Download size={15} /> Download Template
                </button>
              </div>

              <div
                className={`relative rounded-xl border-2 border-dashed transition-colors p-10 flex flex-col items-center gap-3 cursor-pointer ${
                  dragOver
                    ? "border-gold-500/70 bg-gold-700/10"
                    : "border-border hover:border-gold-700/50 hover:bg-muted/5"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  fileRef.current?.click()
                }
                tabIndex={0}
                role="button"
                aria-label="Upload property file (.csv, .xlsx, .xls)"
                data-ocid="manage_properties.import.dropzone"
              >
                <Upload
                  size={36}
                  className={
                    dragOver ? "text-gold-300" : "text-muted-foreground"
                  }
                />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Drag &amp; drop your file here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse —{" "}
                    <span className="text-gold-400 font-semibold">.csv</span>,{" "}
                    <span className="text-gold-400 font-semibold">.xlsx</span>,{" "}
                    <span className="text-gold-400 font-semibold">.xls</span>{" "}
                    accepted
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Large files are auto-split into 500-row batches
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                  data-ocid="manage_properties.import.upload_button"
                />
              </div>

              {importError && (
                <p
                  className="text-sm text-destructive text-center"
                  data-ocid="manage_properties.import.error_state"
                >
                  {importError}
                </p>
              )}
            </div>
          )}

          {/* STEP 2 — PREVIEW */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Batch info banner */}
              {validRows.length > 500 && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gold-700/10 border border-gold-700/30">
                  <span className="text-lg shrink-0">⚡</span>
                  <div>
                    <p className="text-sm font-semibold text-gold-300">
                      Auto-batching enabled
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {validRows.length.toLocaleString()} rows will be split
                      into{" "}
                      <strong className="text-foreground">
                        {Math.ceil(validRows.length / 500)}
                      </strong>{" "}
                      batches of 500. Each batch is processed concurrently —
                      progress shown per batch.
                    </p>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3.5 bg-green-600/10 border border-green-600/25">
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                    Ready to Import
                  </p>
                  <p className="text-2xl font-bold text-green-300 mt-1">
                    {validRows.length.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    properties will be added
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3.5 border ${
                    errorRows.length > 0
                      ? "bg-destructive/10 border-destructive/25"
                      : "bg-muted/10 border-border"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      errorRows.length > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    Rows with Errors
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      errorRows.length > 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {errorRows.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    will be skipped
                  </p>
                </div>
              </div>

              {/* Validation errors */}
              {errorRows.length > 0 && (
                <div
                  className="rounded-xl border border-destructive/25 bg-destructive/5 max-h-36 overflow-y-auto"
                  data-ocid="manage_properties.import.validation_errors"
                >
                  <div className="px-4 py-2 border-b border-destructive/15">
                    <p className="text-xs font-semibold text-destructive">
                      Validation Errors (these rows will be skipped)
                    </p>
                  </div>
                  <div className="divide-y divide-destructive/10">
                    {errorRows.map((r) => (
                      <div key={r.rowNum} className="px-4 py-2">
                        <p className="text-xs font-semibold text-foreground">
                          Row {r.rowNum}
                        </p>
                        {r.errors.map((err) => (
                          <p
                            key={err}
                            className="text-xs text-destructive/80 ml-2"
                          >
                            • {err}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {validRows.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Preview — first 10 valid rows
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="admin-table text-xs">
                      <thead>
                        <tr>
                          <th>Row</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Action</th>
                          <th>Location</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validRows.slice(0, 10).map((r) => (
                          <tr
                            key={r.rowNum}
                            data-ocid={`manage_properties.import.preview.item.${r.rowNum}`}
                          >
                            <td className="text-muted-foreground">
                              {r.rowNum}
                            </td>
                            <td className="max-w-40">
                              <span className="line-clamp-1">
                                {r.data.title}
                              </span>
                            </td>
                            <td>{r.data.propertyType}</td>
                            <td>{r.data.action}</td>
                            <td>{r.data.location}</td>
                            <td className="text-gold-300 font-mono">
                              {r.data.priceDisplay}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {validRows.length > 10 && (
                    <p className="text-xs text-muted-foreground mt-1.5 text-right">
                      + {(validRows.length - 10).toLocaleString()} more rows not
                      shown in preview
                    </p>
                  )}
                </div>
              )}

              {importError && (
                <p
                  className="text-sm text-destructive text-center"
                  data-ocid="manage_properties.import.error_state"
                >
                  {importError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("upload");
                    setFileName("");
                    setParsedRows([]);
                    setImportError("");
                  }}
                  className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 rounded-lg font-sans text-sm hover:bg-obsidian-700 transition-colors"
                  data-ocid="manage_properties.import.back_button"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={validRows.length === 0}
                  onClick={handleConfirmImport}
                  className="flex-1 py-2.5 gold-gradient text-obsidian-900 rounded-lg font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
                  data-ocid="manage_properties.import.confirm_button"
                >
                  Confirm Import ({validRows.length.toLocaleString()} rows)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — IMPORTING */}
          {step === "importing" && (
            <div
              className="flex flex-col items-center justify-center py-8 gap-5"
              data-ocid="manage_properties.import.loading_state"
            >
              {/* Circular SVG ring */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    className="text-obsidian-700"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold-500 transition-all duration-500"
                    strokeWidth="6"
                    strokeDasharray={String(2 * Math.PI * 34)}
                    strokeDashoffset={String(
                      2 * Math.PI * 34 * (1 - overallPct / 100),
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gold-300">
                  {overallPct}%
                </span>
              </div>

              {/* Batch counter — large, prominent */}
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-foreground">
                  {batchProgress.totalBatches > 0
                    ? `Batch ${batchProgress.batchIndex} of ${batchProgress.totalBatches}`
                    : "Preparing batches…"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {batchProgress.totalAdded.toLocaleString()}{" "}
                  <span className="text-foreground font-semibold">/</span>{" "}
                  {batchProgress.totalRows.toLocaleString()} properties imported
                </p>
              </div>

              {/* Linear progress bar */}
              <div className="w-full max-w-sm space-y-1.5">
                <div className="w-full h-3 bg-obsidian-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500 rounded-full"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">Elapsed: {fmtTime(elapsed)}</span>
                  <span className="font-mono">{etaStr}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Processing in 500-row batches concurrently. Keep this window
                open — do not close or refresh.
              </p>
            </div>
          )}

          {/* STEP 4 — DONE */}
          {step === "done" && importResult && (
            <div className="space-y-5 py-2">
              {/* Success header */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-green-600/20 border-2 border-green-600/40 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-400" />
                </div>
                <p
                  className="text-lg font-bold gold-text text-center"
                  data-ocid="manage_properties.import.success_state"
                >
                  Import Complete!
                </p>
                {fileName && (
                  <div className="flex items-center gap-2">
                    <FileTypeBadge ext={fileExt} />
                    <span className="text-xs text-muted-foreground">
                      {fileName}
                    </span>
                  </div>
                )}
              </div>

              {/* Big stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl p-3 bg-green-600/10 border border-green-600/25 text-center">
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1">
                    Added
                  </p>
                  <p className="text-3xl font-bold text-green-300 font-mono">
                    {importResult.added.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    new properties
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-blue-600/10 border border-blue-600/25 text-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Updated
                  </p>
                  <p className="text-3xl font-bold text-blue-300 font-mono">
                    {importResult.updated.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    refreshed existing
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-yellow-600/10 border border-yellow-600/25 text-center">
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">
                    Skipped
                  </p>
                  <p className="text-3xl font-bold text-yellow-300 font-mono">
                    {importResult.skipped.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    duplicate / invalid
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 border text-center ${
                    importResult.errors.length > 0
                      ? "bg-destructive/10 border-destructive/25"
                      : "bg-muted/10 border-border"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      importResult.errors.length > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    Errors
                  </p>
                  <p
                    className={`text-3xl font-bold font-mono ${
                      importResult.errors.length > 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {importResult.errors.length.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    row errors
                  </p>
                </div>
              </div>

              {/* Updated note */}
              {importResult.updated > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-600/10 border border-blue-600/25">
                  <span className="text-base shrink-0">ℹ️</span>
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>{importResult.updated.toLocaleString()}</strong>{" "}
                    propert{importResult.updated === 1 ? "y" : "ies"} already
                    existed and {importResult.updated === 1 ? "was" : "were"}{" "}
                    refreshed with the new data from your file.
                  </p>
                </div>
              )}

              {/* Collapsible error list */}
              {importResult.errors.length > 0 && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowErrors((e) => !e)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-destructive/5 transition-colors"
                    data-ocid="manage_properties.import.errors_toggle"
                  >
                    <span className="text-xs font-semibold text-destructive">
                      ⚠️ {importResult.errors.length} row(s) had errors
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          downloadErrorCSV(importResult.errors, fileName);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 transition-colors"
                        data-ocid="manage_properties.import.download_errors_button"
                      >
                        <Download size={10} /> Download CSV
                      </button>
                      {showErrors ? (
                        <ChevronUp size={14} className="text-destructive" />
                      ) : (
                        <ChevronDown size={14} className="text-destructive" />
                      )}
                    </div>
                  </button>

                  {showErrors && (
                    <div
                      className="border-t border-destructive/15 max-h-48 overflow-y-auto"
                      data-ocid="manage_properties.import.errors_list"
                    >
                      <table className="w-full text-[11px]">
                        <thead className="sticky top-0 bg-card">
                          <tr>
                            <th className="text-left px-3 py-1.5 text-muted-foreground font-semibold border-b border-border">
                              Row #
                            </th>
                            <th className="text-left px-3 py-1.5 text-muted-foreground font-semibold border-b border-border">
                              Property ID
                            </th>
                            <th className="text-left px-3 py-1.5 text-muted-foreground font-semibold border-b border-border">
                              Reason
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-destructive/10">
                          {importResult.errors.map((e) => (
                            <tr
                              key={`${e.rowIndex}-${e.id}`}
                              data-ocid={`manage_properties.import.error.item.${e.rowIndex}`}
                            >
                              <td className="px-3 py-1.5 font-mono text-muted-foreground">
                                #{e.rowIndex}
                              </td>
                              <td className="px-3 py-1.5 font-mono text-foreground">
                                {e.id || "—"}
                              </td>
                              <td className="px-3 py-1.5 text-destructive/80">
                                {e.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep("upload");
                    setFileName("");
                    setParsedRows([]);
                    setImportResult(null);
                    setImportError("");
                    setShowErrors(false);
                  }}
                  className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 rounded-lg font-sans text-sm hover:bg-obsidian-700 transition-colors"
                  data-ocid="manage_properties.import.import_more_button"
                >
                  Import More
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 gold-gradient text-obsidian-900 rounded-lg font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                  data-ocid="manage_properties.import.done_button"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
