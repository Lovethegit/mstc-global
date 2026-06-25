import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "full";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-[95vw]",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Lock body scroll and handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-0 sm:p-4"
      data-ocid="modal.dialog"
    >
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
      />

      {/* Panel */}
      <dialog
        ref={dialogRef}
        open
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 w-full ${maxWidthMap[size]} bg-card border border-gold-700/30 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85dvh] overflow-hidden`}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-700/20 shrink-0">
            {title ? (
              <h2 className="font-serif text-lg text-gold-300 font-semibold leading-tight truncate pr-2">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              data-ocid="modal.close_button"
              className="ml-auto flex items-center justify-center w-9 h-9 rounded-lg bg-obsidian-800/60 border border-gold-700/30 text-gold-400 hover:text-gold-100 hover:bg-gold-700/20 transition-all duration-150 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </dialog>
    </div>
  );
}
