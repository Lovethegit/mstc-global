import { useEffect, useState } from "react";

/**
 * Full-screen branded loading overlay.
 * Shows MSTC letter mark + gold pulsing spinner.
 * Use as Suspense fallback for lazy-loaded pages.
 */
export default function LoadingScreen() {
  const [show, setShow] = useState(false);

  // Delay appearance by 300ms to avoid flicker on fast loads
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06090f]"
      role="status"
      aria-label="Loading MSTC GLOBAL"
      data-ocid="loading_screen.loading_state"
    >
      {/* MSTC letter mark */}
      <div className="relative mb-8">
        <div className="flex items-end gap-1">
          {["M", "S", "T", "C"].map((letter, i) => (
            <span
              key={letter}
              className="font-serif font-bold text-3xl text-primary"
              style={{
                animation: "mstcPulse 1.6s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
                opacity: 0.6,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p
          className="text-center text-[10px] font-sans tracking-[0.3em] text-primary/40 mt-1 uppercase"
          style={{ letterSpacing: "0.35em" }}
        >
          LETUS MANAGE
        </p>
      </div>

      {/* Gold pulsing spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="w-12 h-12 rounded-full border-2 border-primary/20"
          style={{
            position: "absolute",
            animation: "pingOnce 1.5s ease-out infinite",
          }}
        />
        {/* Spinning arc */}
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "var(--color-primary)",
            borderRightColor: "var(--color-primary, #c9a84c)",
            animation: "spin 800ms linear infinite",
          }}
        />
        {/* Center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-primary/70" />
      </div>

      {/* Loading label */}
      <p className="mt-6 text-xs font-sans text-muted-foreground/50 tracking-widest uppercase">
        Loading…
      </p>

      <style>
        {
          "@keyframes mstcPulse { 0%, 100% { opacity: 0.4; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-4px); } } @keyframes pingOnce { 0% { transform: scale(1); opacity: 0.6; } 80%, 100% { transform: scale(1.8); opacity: 0; } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"
        }
      </style>
    </div>
  );
}
