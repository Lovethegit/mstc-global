import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Cpu, RefreshCw, TrendingUp } from "lucide-react";
// MSTC GLOBAL — AdminNeuralLabTab: ML & Neural Models Dashboard
import { useState } from "react";

interface MLModel {
  name: string;
  type: string;
  accuracy: number;
  status: "Trained" | "Training" | "Pending";
  lastImproved: string;
  sparkline: number[];
}

const ML_MODELS: MLModel[] = [
  {
    name: "Lead Scoring ML",
    type: "ML",
    accuracy: 94.7,
    status: "Trained",
    lastImproved: "2 hours ago",
    sparkline: [78, 82, 85, 88, 90, 91, 92, 93, 94, 94.7],
  },
  {
    name: "Price Prediction ML",
    type: "ML",
    accuracy: 89.3,
    status: "Trained",
    lastImproved: "4 hours ago",
    sparkline: [72, 76, 79, 82, 84, 85, 86, 87, 88, 89.3],
  },
  {
    name: "Churn Prediction ML",
    type: "ML",
    accuracy: 91.2,
    status: "Trained",
    lastImproved: "1 hour ago",
    sparkline: [74, 78, 81, 84, 86, 88, 89, 90, 91, 91.2],
  },
  {
    name: "Demand Forecasting ML",
    type: "ML",
    accuracy: 87.6,
    status: "Trained",
    lastImproved: "6 hours ago",
    sparkline: [70, 74, 77, 79, 81, 83, 84, 85, 86, 87.6],
  },
  {
    name: "Conversion Optimizer ML",
    type: "ML",
    accuracy: 93.1,
    status: "Training",
    lastImproved: "30 min ago",
    sparkline: [76, 80, 83, 86, 88, 89, 90, 91, 92, 93.1],
  },
  {
    name: "Content Recommendation ML",
    type: "ML",
    accuracy: 90.8,
    status: "Trained",
    lastImproved: "3 hours ago",
    sparkline: [73, 77, 80, 83, 85, 87, 88, 89, 90, 90.8],
  },
  {
    name: "Fraud Detection ML",
    type: "ML",
    accuracy: 97.4,
    status: "Trained",
    lastImproved: "1 day ago",
    sparkline: [82, 86, 89, 91, 93, 94, 95, 96, 97, 97.4],
  },
  {
    name: "Sentiment Analysis ML",
    type: "ML",
    accuracy: 92.3,
    status: "Trained",
    lastImproved: "2 hours ago",
    sparkline: [75, 79, 82, 85, 87, 88, 89, 90, 91, 92.3],
  },
  {
    name: "Image Quality ML",
    type: "ML",
    accuracy: 88.9,
    status: "Trained",
    lastImproved: "5 hours ago",
    sparkline: [71, 75, 78, 81, 83, 85, 86, 87, 88, 88.9],
  },
  {
    name: "Document Classification ML",
    type: "ML",
    accuracy: 94.1,
    status: "Trained",
    lastImproved: "3 hours ago",
    sparkline: [77, 81, 84, 87, 89, 90, 91, 92, 93, 94.1],
  },
  {
    name: "Valuation ML",
    type: "ML",
    accuracy: 85.7,
    status: "Trained",
    lastImproved: "8 hours ago",
    sparkline: [69, 73, 76, 78, 80, 81, 82, 83, 84, 85.7],
  },
  {
    name: "Rental Yield ML",
    type: "ML",
    accuracy: 88.2,
    status: "Trained",
    lastImproved: "4 hours ago",
    sparkline: [71, 74, 77, 80, 82, 83, 84, 86, 87, 88.2],
  },
  {
    name: "Builder Score ML",
    type: "ML",
    accuracy: 91.6,
    status: "Trained",
    lastImproved: "2 hours ago",
    sparkline: [74, 78, 81, 84, 86, 87, 88, 89, 90, 91.6],
  },
  {
    name: "Client LTV ML",
    type: "ML",
    accuracy: 86.4,
    status: "Pending",
    lastImproved: "12 hours ago",
    sparkline: [70, 73, 76, 78, 80, 81, 82, 83, 85, 86.4],
  },
  {
    name: "Enquiry Intent ML",
    type: "ML",
    accuracy: 93.8,
    status: "Trained",
    lastImproved: "1 hour ago",
    sparkline: [76, 80, 83, 86, 88, 90, 91, 92, 93, 93.8],
  },
  {
    name: "ANN Lead Scorer",
    type: "ANN",
    accuracy: 95.2,
    status: "Trained",
    lastImproved: "1 hour ago",
    sparkline: [79, 83, 86, 89, 91, 92, 93, 94, 95, 95.2],
  },
  {
    name: "CNN Photo Analyzer",
    type: "CNN",
    accuracy: 90.4,
    status: "Trained",
    lastImproved: "3 hours ago",
    sparkline: [73, 77, 80, 83, 85, 86, 87, 88, 89, 90.4],
  },
  {
    name: "RNN Market Predictor",
    type: "RNN",
    accuracy: 88.1,
    status: "Trained",
    lastImproved: "5 hours ago",
    sparkline: [71, 75, 78, 80, 82, 83, 84, 86, 87, 88.1],
  },
  {
    name: "GAN Property Visualizer",
    type: "GAN",
    accuracy: 84.3,
    status: "Training",
    lastImproved: "20 min ago",
    sparkline: [68, 71, 74, 76, 78, 79, 80, 81, 83, 84.3],
  },
  {
    name: "BERT Query AI",
    type: "BERT",
    accuracy: 96.8,
    status: "Trained",
    lastImproved: "45 min ago",
    sparkline: [81, 85, 88, 90, 92, 93, 94, 95, 96, 96.8],
  },
];

const TYPE_COLORS: Record<string, string> = {
  ML: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30",
  ANN: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  CNN: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  RNN: "bg-teal-500/10 text-teal-300 border-teal-500/30",
  GAN: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  GNN: "bg-orange-500/10 text-orange-300 border-orange-500/30",
  Transformer: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  BERT: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  RL: "bg-red-500/10 text-red-300 border-red-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  Trained: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Training: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30",
  Pending: "bg-zinc-600/20 text-zinc-400 border-zinc-600/30",
};

// Mini sparkline SVG
function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const _path = `M ${pts.join(" L ")}`;
  const fillPts = [`0,${h}`, ...pts, `${w},${h}`].join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="spkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#spkGrad)" />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#c9a84c"
        strokeWidth="1.5"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="2"
        fill="#c9a84c"
      />
    </svg>
  );
}

function ModelCard({ model, index }: { model: MLModel; index: number }) {
  const [retraining, setRetraining] = useState(false);
  const accuracyColor =
    model.accuracy >= 92
      ? "bg-emerald-500"
      : model.accuracy >= 87
        ? "bg-[#c9a84c]"
        : "bg-amber-500";

  function handleRetrain() {
    setRetraining(true);
    setTimeout(() => setRetraining(false), 3000);
  }

  return (
    <div
      className="bg-zinc-900/70 border border-zinc-800 hover:border-[#c9a84c]/30 rounded-xl p-4 flex flex-col gap-3 transition-all"
      data-ocid={`neural.model.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">
            {model.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Badge
              className={`text-[9px] border ${TYPE_COLORS[model.type] ?? "bg-zinc-700 text-zinc-300"}`}
            >
              {model.type}
            </Badge>
            <Badge
              className={`text-[9px] border ${STATUS_COLORS[model.status]}`}
            >
              {model.status === "Training" && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse mr-1" />
              )}
              {model.status}
            </Badge>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[#c9a84c] text-lg font-bold leading-none">
            {model.accuracy}%
          </p>
          <p className="text-zinc-600 text-[9px] mt-0.5">accuracy</p>
        </div>
      </div>

      {/* Accuracy bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`${accuracyColor} h-full rounded-full transition-all`}
            style={{ width: `${model.accuracy}%` }}
          />
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex items-end justify-between">
        <Sparkline data={model.sparkline} />
        <div className="text-right">
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] justify-end">
            <Clock className="w-2.5 h-2.5" />
            <span>{model.lastImproved}</span>
          </div>
        </div>
      </div>

      {/* Retrain button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-zinc-700 text-zinc-300 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] text-xs h-7"
        onClick={handleRetrain}
        disabled={retraining || model.status === "Training"}
        data-ocid={`neural.retrain.${index + 1}`}
      >
        <RefreshCw
          className={`w-3 h-3 mr-1.5 ${retraining ? "animate-spin" : ""}`}
        />
        {retraining ? "Retraining…" : "Retrain Model"}
      </Button>
    </div>
  );
}

export default function AdminNeuralLabTab() {
  const avgAccuracy = (
    ML_MODELS.reduce((a, m) => a + m.accuracy, 0) / ML_MODELS.length
  ).toFixed(1);
  const trainedCount = ML_MODELS.filter((m) => m.status === "Trained").length;

  const summaryStats = [
    {
      label: "Total Models",
      value: ML_MODELS.length.toString(),
      icon: Brain,
      color: "text-[#c9a84c]",
    },
    {
      label: "Avg Accuracy",
      value: `${avgAccuracy}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Models Trained",
      value: `${trainedCount}/${ML_MODELS.length}`,
      icon: Cpu,
      color: "text-blue-400",
    },
    {
      label: "Last Retrain",
      value: "30 min ago",
      icon: Clock,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="neural_lab.page">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Neural Intelligence Lab
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          20 ML, ANN, CNN, RNN, GAN, and BERT models powering MSTC's
          intelligence layer
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"
            data-ocid={`neural.stat.${label.toLowerCase().replace(/ /g, "_")}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-zinc-400 text-xs">{label}</span>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ML_MODELS.map((model, i) => (
          <ModelCard key={model.name} model={model} index={i} />
        ))}
      </div>
    </div>
  );
}
