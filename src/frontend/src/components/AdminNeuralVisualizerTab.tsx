import type React from "react";
import { useState } from "react";
import { NEURAL_STACKS } from "./AIManagerData_Extended";
import type { NeuralModel, NeuralStack } from "./AIManagerData_Extended";

const modelTypeColors: Record<string, string> = {
  ANN: "#c9a84c",
  CNN: "#3498db",
  RNN: "#27ae60",
  GAN: "#9b59b6",
  GNN: "#e67e22",
  RL: "#e74c3c",
  ML: "#1abc9c",
  Transformer: "#e91e63",
};

const AdminNeuralVisualizerTab: React.FC = () => {
  const [selectedStack, setSelectedStack] = useState<NeuralStack | null>(null);
  const [selectedModel, setSelectedModel] = useState<NeuralModel | null>(null);

  const allModels = NEURAL_STACKS.flatMap((s) => s.models);
  const totalModels = allModels.length;
  const avgAccuracy =
    totalModels > 0
      ? Math.round(allModels.reduce((a, m) => a + m.accuracy, 0) / totalModels)
      : 0;

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Neural Intelligence Visualizer
        </h2>
        <p className="text-gray-400 text-sm">
          {totalModels} neural models across {NEURAL_STACKS.length} domain
          stacks — continuously learning from MSTC data
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Domain Stacks",
            value: String(NEURAL_STACKS.length),
            color: "#c9a84c",
          },
          {
            label: "Neural Models",
            value: String(totalModels),
            color: "#9b59b6",
          },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, color: "#27ae60" },
          { label: "Model Types", value: "8", color: "#3498db" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gray-900/60 border border-gray-700/40 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Model Type Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(modelTypeColors).map(([type, color]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-700/40 bg-gray-900/40"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-300">{type}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {NEURAL_STACKS.map((stack) => (
          <div
            key={stack.id}
            onClick={() => {
              setSelectedStack(stack);
              setSelectedModel(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedStack(stack);
                setSelectedModel(null);
              }
            }}
            role="button"
            tabIndex={0}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 cursor-pointer hover:border-[#c9a84c]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-sm">{stack.name}</h3>
                <p className="text-gray-500 text-xs">
                  {stack.domain} &middot; {stack.models.length} models
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              </div>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {stack.models.map((model) => (
                <div
                  key={model.id}
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${modelTypeColors[model.modelType] ?? "#607d8b"}44`,
                    color: modelTypeColors[model.modelType] ?? "#607d8b",
                  }}
                >
                  {model.modelType}
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {stack.models.slice(0, 3).map((model) => (
                <div
                  key={model.id}
                  className="bg-gray-800/40 rounded-lg p-2 text-center"
                >
                  <div
                    className="font-bold text-xs"
                    style={{
                      color: modelTypeColors[model.modelType] ?? "#607d8b",
                    }}
                  >
                    {model.accuracy}%
                  </div>
                  <div className="text-gray-600 text-xs truncate">
                    {model.modelType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedStack && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedStack(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedStack(null);
          }}
          role="presentation"
        >
          <div
            className="bg-[#06090f] border border-gray-700/60 rounded-2xl p-6 max-w-xl w-full my-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-[#c9a84c] text-xl font-bold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selectedStack.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {selectedStack.domain} &middot; {selectedStack.models.length}{" "}
                  neural models
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStack(null)}
                className="text-gray-500 hover:text-white text-2xl leading-none"
                aria-label="Close"
              >
                &#10005;
              </button>
            </div>

            <div className="space-y-3">
              {selectedStack.models.map((model) => (
                <div
                  key={model.id}
                  onClick={() =>
                    setSelectedModel(
                      selectedModel?.id === model.id ? null : model,
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedModel(
                        selectedModel?.id === model.id ? null : model,
                      );
                  }}
                  role="button"
                  tabIndex={0}
                  className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4 cursor-pointer hover:border-[#c9a84c]/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${modelTypeColors[model.modelType] ?? "#607d8b"}33`,
                          color: modelTypeColors[model.modelType] ?? "#607d8b",
                        }}
                      >
                        {model.modelType}
                      </div>
                      <span className="text-white text-sm font-medium">
                        {model.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-bold text-sm"
                        style={{
                          color: modelTypeColors[model.modelType] ?? "#607d8b",
                        }}
                      >
                        {model.accuracy}%
                      </div>
                      <div className="text-gray-600 text-xs">accuracy</div>
                    </div>
                  </div>

                  {selectedModel?.id === model.id && (
                    <div className="mt-2 pt-2 border-t border-gray-700/40 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-500 mb-0.5">
                          Training Data
                        </div>
                        <div className="text-gray-300">
                          {model.trainingDataSize}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-0.5">Confidence</div>
                        <div className="text-[#c9a84c] font-semibold">
                          {model.confidence}%
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-500 mb-0.5">
                          Last Prediction
                        </div>
                        <div className="text-gray-300">
                          {model.lastPrediction}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNeuralVisualizerTab;
