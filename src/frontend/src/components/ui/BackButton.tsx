import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const baseClass = `inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 rounded ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClass} data-ocid="back_button.link">
        <ChevronLeft size={16} className="shrink-0" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={baseClass}
      data-ocid="back_button.button"
    >
      <ChevronLeft size={16} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}
