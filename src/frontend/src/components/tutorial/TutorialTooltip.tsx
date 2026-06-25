import { useEffect, useRef } from "react";
import type { TutorialStepLocal } from "../../hooks/useTutorialQueries";

interface TutorialTooltipProps {
  step: TutorialStepLocal;
  position?: "top" | "bottom" | "left" | "right" | "center";
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkipAll: () => void;
}

export default function TutorialTooltip({
  step,
  position = "center",
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkipAll,
}: TutorialTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  // On mobile, always show as fixed bottom panel
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Focus trap
  useEffect(() => {
    tooltipRef.current?.focus();
  }, []);

  // Lock body scroll when tutorial is shown on mobile
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

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkipAll();
      if (e.key === "ArrowRight" || e.key === "Enter") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onSkipAll]);

  return (
    <>
      {/* Dimmed backdrop */}
      <div
        className="tutorial-overlay-backdrop"
        role="presentation"
        onClick={onSkipAll}
        onKeyDown={(e) => e.key === "Enter" && onSkipAll()}
        aria-hidden="true"
        data-ocid="tutorial.overlay"
      />

      {/* Tooltip box */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tutorial step ${currentStep + 1} of ${totalSteps}: ${step.title}`}
        tabIndex={-1}
        className="tutorial-tooltip animate-tutorial-slide-in"
        data-position={isMobile ? "mobile" : position}
        data-ocid="tutorial.tooltip"
      >
        {/* Arrow indicator — only on desktop non-center positions */}
        {position !== "center" && !isMobile && (
          <div
            className={`tutorial-arrow tutorial-arrow--${position}`}
            aria-hidden="true"
          />
        )}

        {/* Step counter */}
        <div
          className="tutorial-tooltip__counter"
          data-ocid="tutorial.step_counter"
        >
          {currentStep + 1} of {totalSteps}
        </div>

        {/* Title */}
        <h3 className="tutorial-tooltip__title">{step.title}</h3>

        {/* Content */}
        <p className="tutorial-tooltip__content">{step.content}</p>

        {/* Progress dots */}
        {totalSteps > 1 && (
          <div className="tutorial-tooltip__dots" aria-hidden="true">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: static decorative array
                key={`dot-${i}`}
                className={`tutorial-dot ${
                  i === currentStep
                    ? "tutorial-dot--active"
                    : "tutorial-dot--inactive"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="tutorial-tooltip__actions">
          {!isFirst && (
            <button
              type="button"
              className="tutorial-btn tutorial-btn--secondary"
              onClick={onPrev}
              data-ocid="tutorial.prev_button"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            className="tutorial-btn tutorial-btn--primary"
            onClick={onNext}
            data-ocid="tutorial.next_button"
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>

        {/* Skip all — always visible */}
        <button
          type="button"
          className="tutorial-skip-button"
          onClick={onSkipAll}
          data-ocid="tutorial.skip_all_button"
        >
          Skip all
        </button>
      </div>
    </>
  );
}
