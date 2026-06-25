import { useEffect } from "react";

interface TutorialChoiceModalProps {
  appName: string;
  onQuick: () => void;
  onFull: () => void;
  onSkip: () => void;
}

export default function TutorialChoiceModal({
  appName,
  onQuick,
  onFull,
  onSkip,
}: TutorialChoiceModalProps) {
  // Lock body scroll on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `-${scrollY}px`);
      document.body.classList.add("body-scroll-locked");
      return () => {
        document.body.classList.remove("body-scroll-locked");
        document.documentElement.style.removeProperty("--scroll-y");
      };
    }
  }, [isMobile]);

  // Dismiss on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onSkip]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="tutorial-overlay-backdrop"
        role="presentation"
        onClick={onSkip}
        onKeyDown={(e) => e.key === "Enter" && onSkip()}
        aria-hidden="true"
        data-ocid="tutorial_choice.backdrop"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-choice-title"
        className="tutorial-choice-modal animate-tutorial-slide-in"
        data-ocid="tutorial_choice.dialog"
      >
        {/* MSTC brand accent */}
        <div className="tutorial-choice-modal__brand" aria-hidden="true">
          <span className="tutorial-brand-dot" />
          <span className="tutorial-brand-dot" />
          <span className="tutorial-brand-dot" />
        </div>

        <h2 id="tutorial-choice-title" className="tutorial-choice-modal__title">
          Welcome to {appName}
        </h2>
        <p className="tutorial-choice-modal__subtitle">
          Would you like a guided tour of this section?
        </p>

        <div className="tutorial-choice-modal__actions">
          <button
            type="button"
            className="tutorial-choice-btn tutorial-choice-btn--quick"
            onClick={onQuick}
            data-ocid="tutorial_choice.quick_button"
          >
            <span className="tutorial-choice-btn__icon">⚡</span>
            <span>
              <span className="tutorial-choice-btn__label">Quick Tour</span>
              <span className="tutorial-choice-btn__meta">
                2 min · 3–4 highlights
              </span>
            </span>
          </button>

          <button
            type="button"
            className="tutorial-choice-btn tutorial-choice-btn--full"
            onClick={onFull}
            data-ocid="tutorial_choice.full_button"
          >
            <span className="tutorial-choice-btn__icon">📖</span>
            <span>
              <span className="tutorial-choice-btn__label">Full Tour</span>
              <span className="tutorial-choice-btn__meta">
                5–10 min · everything covered
              </span>
            </span>
          </button>
        </div>

        {/* Skip — always visible even on small screens */}
        <button
          type="button"
          className="tutorial-skip-button"
          onClick={onSkip}
          data-ocid="tutorial_choice.skip_button"
          style={{ marginTop: "0.75rem" }}
        >
          Skip for now
        </button>
      </div>
    </>
  );
}
