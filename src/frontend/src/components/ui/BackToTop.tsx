import { ArrowUp, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed z-40 flex items-center gap-1"
      style={{
        bottom: "max(4.5rem, calc(env(safe-area-inset-bottom, 0px) + 4.5rem))",
        right: "1.25rem",
      }}
      data-ocid="back_to_top.container"
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="w-5 h-5 rounded-full bg-obsidian-700 border border-gold-700/40 flex items-center justify-center text-gold-400 hover:text-gold-200 transition-colors"
        aria-label="Dismiss Back to Top"
        data-ocid="back_to_top.dismiss_button"
      >
        <X size={10} />
      </button>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-10 h-10 rounded-full bg-obsidian-800 border border-gold-600/50 text-gold-400 hover:text-gold-200 hover:border-gold-400 flex items-center justify-center transition-all duration-200 shadow-lg"
        aria-label="Back to top"
        data-ocid="back_to_top.button"
      >
        <ArrowUp size={16} />
      </button>
    </div>
  );
}
