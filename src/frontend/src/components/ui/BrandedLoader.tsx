import { cn } from "@/lib/utils";

type BrandedLoaderProps = {
  /** Whether this is a full-screen loader */
  fullScreen?: boolean;
  className?: string;
  message?: string;
};

export default function BrandedLoader({
  fullScreen = true,
  className,
  message,
}: BrandedLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        fullScreen && "fixed inset-0 bg-[oklch(0.1_0.01_60)] z-[999]",
        className,
      )}
      data-ocid="branded_loader.loading_state"
      aria-live="polite"
      aria-label="Loading MSTC GLOBAL"
    >
      {/* Logo + spinning ring */}
      <div className="relative w-20 h-20">
        {/* Outer spinning ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDuration: "1.4s" }}
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="oklch(0.72 0.18 76 / 0.15)"
            strokeWidth="3"
          />
          <path
            d="M 40 4 A 36 36 0 0 1 76 40"
            stroke="oklch(0.72 0.18 76)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        {/* Inner logo badge */}
        <div className="absolute inset-3 rounded-full bg-[oklch(0.14_0.015_62)] border border-primary/30 flex items-center justify-center">
          <span className="text-lg font-black text-primary font-serif tracking-tight">
            M
          </span>
        </div>
      </div>

      {/* Brand name */}
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-black text-primary font-serif tracking-widest">
          MSTC GLOBAL
        </h1>
        <p className="text-xs text-muted-foreground font-sans tracking-[0.3em] uppercase">
          {message ?? "LETUS MANAGE"}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/40"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
