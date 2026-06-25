import { cn } from "@/lib/utils";

type SkeletonVariant = "table-row" | "card" | "chart" | "text" | "stat";

type SkeletonLoaderProps = {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
};

const shimmer =
  "animate-pulse bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg";

function SkeletonBase({
  className,
  style,
}: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn(shimmer, className)} style={style} />;
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border/20">
      <SkeletonBase className="w-4 h-4 rounded-sm shrink-0" />
      <SkeletonBase className="h-4 flex-1" />
      <SkeletonBase className="h-4 w-24 shrink-0" />
      <SkeletonBase className="h-4 w-20 shrink-0" />
      <SkeletonBase className="h-6 w-16 rounded-full shrink-0" />
      <SkeletonBase className="h-7 w-7 rounded-xl shrink-0" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-border/20 bg-card/30 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBase className="h-5 w-32" />
        <SkeletonBase className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-3/4" />
      <div className="flex gap-2 pt-1">
        <SkeletonBase className="h-8 flex-1 rounded-xl" />
        <SkeletonBase className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-border/20 bg-card/30">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBase className="h-5 w-40" />
        <SkeletonBase className="h-7 w-28 rounded-xl" />
      </div>
      <div className="flex items-end gap-2 h-36">
        {[65, 45, 80, 35, 70, 50, 90, 40, 60, 75].map((h) => (
          <SkeletonBase
            key={h}
            className="flex-1 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-5/6" />
      <SkeletonBase className="h-4 w-4/6" />
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-border/20 bg-card/30 space-y-2">
      <SkeletonBase className="h-3 w-24" />
      <SkeletonBase className="h-8 w-20" />
      <SkeletonBase className="h-3 w-16" />
    </div>
  );
}

const VARIANT_MAP: Record<SkeletonVariant, () => React.ReactElement> = {
  "table-row": TableRowSkeleton,
  card: CardSkeleton,
  chart: ChartSkeleton,
  text: TextSkeleton,
  stat: StatSkeleton,
};

export default function SkeletonLoader({
  variant = "card",
  count = 3,
  className,
}: SkeletonLoaderProps) {
  const Component = VARIANT_MAP[variant];
  return (
    <div
      className={cn("space-y-2", className)}
      data-ocid="skeleton_loader.loading_state"
    >
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable positional skeleton, no identity
        <Component key={`skeleton-item-${i}`} />
      ))}
    </div>
  );
}

export { SkeletonBase };
