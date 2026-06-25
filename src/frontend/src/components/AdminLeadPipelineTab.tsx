import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PropertyEnquiry } from "../backend";
import { usePropertyEnquiries } from "../hooks/usePropertyEnquiryQueries";
import {
  LEAD_STAGES,
  type LeadStage,
  useGetLeadPipelineStats,
  useUpdateLeadStage,
} from "../hooks/usePropertyEnquiryQueries";

function fmt(ts: bigint | string | number) {
  const n = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(n).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const COLUMN_COLORS: Record<
  LeadStage,
  { header: string; badge: string; border: string }
> = {
  New: {
    header: "text-gold-300",
    badge: "bg-gold-700/20 text-gold-300 border-gold-700/40",
    border: "border-gold-700/30",
  },
  Contacted: {
    header: "text-blue-300",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    border: "border-blue-500/30",
  },
  "Site Visit": {
    header: "text-purple-300",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    border: "border-purple-500/30",
  },
  "Closed Won": {
    header: "text-green-300",
    badge: "bg-green-600/15 text-green-300 border-green-600/30",
    border: "border-green-600/30",
  },
  "Closed Lost": {
    header: "text-red-300",
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    border: "border-red-500/30",
  },
};

function LeadCard({
  enquiry,
  onMove,
}: { enquiry: PropertyEnquiry; onMove: (stage: LeadStage) => void }) {
  const [showMove, setShowMove] = useState(false);
  const curStage = enquiry.status as LeadStage;

  return (
    <div
      className="rounded-lg border border-border bg-card p-3 space-y-2 hover:border-gold-700/40 transition-colors cursor-default"
      data-ocid={`pipeline.card.${enquiry.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm text-foreground line-clamp-1 flex-1">
          {enquiry.customerName}
        </p>
        <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
          {fmt(enquiry.submittedAt)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {enquiry.propertyTitle}
      </p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-col gap-0.5">
          {enquiry.customerPhone && (
            <span className="text-xs text-gold-400/80">
              📞 {enquiry.customerPhone}
            </span>
          )}
          {enquiry.propertyPrice && (
            <span className="text-xs text-muted-foreground">
              {enquiry.propertyPrice}
            </span>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-gold-300 hover:border-gold-700/40 transition-colors"
            onClick={() => setShowMove((v) => !v)}
            data-ocid={`pipeline.move_button.${enquiry.id}`}
          >
            Move <ChevronRight size={10} />
          </button>
          {showMove && (
            <div
              className="absolute right-0 top-8 z-20 bg-card border border-gold-700/40 rounded-xl shadow-2xl overflow-hidden min-w-36"
              data-ocid={`pipeline.stage_select.${enquiry.id}`}
            >
              {LEAD_STAGES.filter((s) => s !== curStage).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className="block w-full text-left px-4 py-2 text-xs hover:bg-gold-700/15 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    onMove(stage);
                    setShowMove(false);
                  }}
                  data-ocid={`pipeline.stage_option.${stage.toLowerCase().replace(/ /g, "_")}`}
                >
                  → {stage}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  stage,
  cards,
  onMove,
}: {
  stage: LeadStage;
  cards: PropertyEnquiry[];
  onMove: (id: string, stage: LeadStage) => void;
}) {
  const colors = COLUMN_COLORS[stage];
  return (
    <div
      className="flex flex-col min-w-56 max-w-72 w-full shrink-0"
      data-ocid={`pipeline.column.${stage.toLowerCase().replace(/ /g, "_")}`}
    >
      {/* Column header */}
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl border ${colors.border} border-b-0 bg-card`}
      >
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${colors.header}`}
        >
          {stage}
        </span>
        <span
          className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold border ${colors.badge}`}
        >
          {cards.length}
        </span>
      </div>
      {/* Cards */}
      <div
        className={`flex-1 min-h-24 rounded-b-xl border ${colors.border} bg-background/60 p-2 space-y-2 overflow-y-auto max-h-[60vh]`}
      >
        {cards.length === 0 ? (
          <div
            className="text-xs text-muted-foreground text-center py-6 opacity-60"
            data-ocid={`pipeline.${stage.toLowerCase().replace(/ /g, "_")}.empty_state`}
          >
            No leads
          </div>
        ) : (
          cards.map((card) => (
            <LeadCard
              key={card.id}
              enquiry={card}
              onMove={(s) => onMove(card.id, s)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function LeadPipelineTab() {
  const { data: enquiries = [], isLoading } = usePropertyEnquiries();
  const { data: pipelineStats } = useGetLeadPipelineStats();
  const updateStage = useUpdateLeadStage();

  // Group enquiries into pipeline stages
  const columns: Record<LeadStage, PropertyEnquiry[]> = {
    New: [],
    Contacted: [],
    "Site Visit": [],
    "Closed Won": [],
    "Closed Lost": [],
  };
  for (const e of enquiries) {
    const stage = e.status as LeadStage;
    if (stage in columns) columns[stage].push(e);
    else columns.New.push(e);
  }

  function handleMove(id: string, stage: LeadStage) {
    updateStage.mutate({ id, stage });
  }

  return (
    <div className="space-y-6" data-ocid="pipeline.section">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-serif font-semibold text-foreground">
            Lead Pipeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drag or move leads through your sales pipeline stages
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEAD_STAGES.map((s) => {
            const colors = COLUMN_COLORS[s];
            return (
              <span
                key={s}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors.badge}`}
              >
                {s}: {pipelineStats?.[s] ?? columns[s].length}
              </span>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="pipeline.loading_state"
        >
          Loading pipeline…
        </div>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          data-ocid="pipeline.board"
        >
          {LEAD_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              cards={columns[stage]}
              onMove={handleMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
