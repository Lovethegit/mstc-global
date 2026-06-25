import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

const sizeMap = {
  sm: { outer: "w-8 h-8", icon: 14 },
  md: { outer: "w-11 h-11", icon: 18 },
  lg: { outer: "w-12 h-12", icon: 20 },
};

export default function CloseButton({
  onClick,
  className = "",
  size = "md",
  "aria-label": ariaLabel = "Close",
}: CloseButtonProps) {
  const { outer, icon } = sizeMap[size];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-ocid="close_button"
      className={`${outer} flex items-center justify-center rounded-lg bg-obsidian-800/80 border border-gold-700/40 text-gold-400 hover:text-gold-100 hover:bg-gold-700/20 hover:border-gold-500/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 shrink-0 ${className}`}
    >
      <X size={icon} />
    </button>
  );
}
