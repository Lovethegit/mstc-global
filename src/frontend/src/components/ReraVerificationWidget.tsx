import { AlertCircle, CheckCircle, ExternalLink, Shield } from "lucide-react";
import React, { useState } from "react";
import { createActor } from "../backend";
import { useActor } from "../hooks/useActor";
export default function ReraVerificationWidget() {
  const { actor } = useActor(createActor);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "notfound">("idle");
  const [bname, setBname] = useState("");
  const [loading, setLoading] = useState(false);
  const verify = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      if (actor) {
        const r = await actor.getBuilderByRera(input.trim());
        if (r) {
          setBname((r as unknown as { name?: string }).name || "Verified");
          setStatus("found");
        } else setStatus("notfound");
      } else setStatus("notfound");
    } catch {
      setStatus("notfound");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black/40 border border-yellow-600/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-semibold text-yellow-400">
          RERA Quick Verify
        </span>
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="Enter RERA number"
          className="flex-1 bg-black/60 border border-yellow-600/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-xs"
        />
        <button
          type="button"
          onClick={verify}
          disabled={loading}
          className="px-3 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-xs hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "..." : "Verify"}
        </button>
      </div>
      {status === "found" && (
        <div className="flex items-center gap-1.5 mt-2 text-green-400 text-xs">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{bname} — RERA Verified</span>
        </div>
      )}
      {status === "notfound" && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not in our database</span>
          </div>
          <a
            href="https://rera.gujarat.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-yellow-400 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Verify at GujRERA
          </a>
        </div>
      )}
    </div>
  );
}
