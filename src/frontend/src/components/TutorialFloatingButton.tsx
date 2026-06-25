import { useAppSidebar } from "@/components/layout/AppSidebar";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export type TutorialStep = {
  title: string;
  description: string;
  targetId?: string; // optional data-ocid or element id to highlight
};

const DEFAULT_QUICK_STEPS: TutorialStep[] = [
  {
    title: "Welcome to MSTC",
    description:
      "This is your MSTC GLOBAL platform. Use the sidebar on the left to navigate between sections.",
  },
  {
    title: "Sidebar Navigation",
    description:
      "The sidebar collapses to an icon strip. Click the chevron or any icon to expand or collapse it.",
  },
  {
    title: "You're all set!",
    description:
      "Explore the app using the sidebar links. For more help, press the ? button at any time.",
  },
];

const DEFAULT_FULL_STEPS: TutorialStep[] = [
  ...DEFAULT_QUICK_STEPS,
  {
    title: "Global Search",
    description:
      "Press Ctrl+K (or Cmd+K on Mac) to open global search and quickly jump to any section.",
  },
  {
    title: "Notifications",
    description:
      "The bell icon in the top bar shows real-time notifications from all apps.",
  },
  {
    title: "Observer Access",
    description:
      "Share a read-only Observer link from Master Control for clients, CAs, or investors.",
  },
  {
    title: "Security",
    description:
      "Access the Security app to manage staff sessions, force logout, and emergency lockdown.",
  },
  {
    title: "App Launcher",
    description:
      "Click 'App Launcher' in the sidebar footer to return to the full 50+ app grid.",
  },
];

type TutorialType = "quick" | "full" | null;

type Props = {
  quickSteps?: TutorialStep[];
  fullSteps?: TutorialStep[];
};

export default function TutorialFloatingButton({
  quickSteps = DEFAULT_QUICK_STEPS,
  fullSteps = DEFAULT_FULL_STEPS,
}: Props) {
  const location = useLocation();
  const tutorialKey = `mstc-tutorial-${location.pathname.replace(/\//g, "-")}`;

  const { isMobileOpen } = useAppSidebar();

  const [showMenu, setShowMenu] = useState(false);
  const [tutorialType, setTutorialType] = useState<TutorialType>(null);
  const [step, setStep] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const steps = tutorialType === "quick" ? quickSteps : fullSteps;
  const totalSteps = steps.length;
  const isTutorialActive = tutorialType !== null;
  const progressPct = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  // Auto-start tutorial on first visit to this path
  useEffect(() => {
    const seen = localStorage.getItem(tutorialKey);
    if (!seen) {
      // delay to let page settle
      const t = setTimeout(() => setShowMenu(true), 1200);
      return () => clearTimeout(t);
    }
  }, [tutorialKey]);

  // Restore saved step on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${tutorialKey}-progress`);
    if (saved) {
      const parsed = JSON.parse(saved) as { type: TutorialType; step: number };
      if (
        parsed.type &&
        parsed.step < (parsed.type === "quick" ? quickSteps : fullSteps).length
      ) {
        setTutorialType(parsed.type);
        setStep(parsed.step);
      }
    }
  }, [tutorialKey, quickSteps, fullSteps]);

  // Save progress when step/type changes
  useEffect(() => {
    if (tutorialType) {
      localStorage.setItem(
        `${tutorialKey}-progress`,
        JSON.stringify({ type: tutorialType, step }),
      );
    }
  }, [tutorialType, step, tutorialKey]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  function startTutorial(type: "quick" | "full") {
    setTutorialType(type);
    setStep(0);
    setShowMenu(false);
  }

  function nextStep() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      completeTutorial();
    }
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  function completeTutorial() {
    localStorage.setItem(tutorialKey, "seen");
    localStorage.removeItem(`${tutorialKey}-progress`);
    setTutorialType(null);
    setStep(0);
  }

  function skipAll() {
    completeTutorial();
    setShowMenu(false);
    setMinimized(false);
  }

  // Hide button when mobile sidebar is open
  if (isMobileOpen) return null;

  return (
    <>
      {/* Floating "?" button — bottom-left, never overlaps right-side floating elements */}
      <div
        className="tutorial-help-btn"
        style={{
          bottom: isTutorialActive ? "1.5rem" : undefined,
          opacity: minimized ? 0.35 : 1,
        }}
        data-ocid="tutorial.help_button"
        ref={menuRef}
      >
        <div
          className={`tutorial-help-btn ${
            minimized ? "tutorial-help-btn--small" : "tutorial-help-btn--normal"
          }`}
        >
          <button
            type="button"
            className="tutorial-help-btn__trigger"
            onClick={() => {
              if (isTutorialActive) {
                // If tutorial is running, close it
                setTutorialType(null);
                setStep(0);
              } else {
                setShowMenu((v) => !v);
                setMinimized(false);
              }
            }}
            aria-label={
              isTutorialActive ? "Close tutorial" : "Open tutorial menu"
            }
            data-ocid="tutorial.trigger_button"
            aria-expanded={showMenu}
          >
            {isTutorialActive ? "×" : minimized ? "?" : "?"}
          </button>

          {/* Mini label when not minimized and no tutorial active */}
          {!isTutorialActive && !minimized && !showMenu && (
            <span className="tutorial-help-btn__tooltip">Help</span>
          )}
        </div>

        {/* Dropdown menu */}
        {showMenu && !isTutorialActive && (
          <div
            className="tutorial-choice-modal"
            role="dialog"
            aria-label="Tutorial options"
            data-ocid="tutorial.choice_modal"
            style={{
              position: "absolute",
              bottom: "calc(100% + 0.75rem)",
              left: 0,
              top: "auto",
              transform: "none",
            }}
          >
            <div className="tutorial-choice-modal__brand">
              <div className="tutorial-brand-dot" />
              <div className="tutorial-brand-dot" />
              <div className="tutorial-brand-dot" />
            </div>
            <h2 className="tutorial-choice-modal__title">MSTC Tutorial</h2>
            <p className="tutorial-choice-modal__subtitle">
              How would you like to explore this page?
            </p>

            <div className="tutorial-choice-modal__actions">
              <button
                type="button"
                className="tutorial-choice-btn tutorial-choice-btn--quick"
                onClick={() => startTutorial("quick")}
                data-ocid="tutorial.quick_button"
              >
                <span className="tutorial-choice-btn__icon">⚡</span>
                <span>
                  <span className="tutorial-choice-btn__label">Quick Tour</span>
                  <span className="tutorial-choice-btn__meta">
                    3 steps · ~30 seconds
                  </span>
                </span>
              </button>

              <button
                type="button"
                className="tutorial-choice-btn tutorial-choice-btn--full"
                onClick={() => startTutorial("full")}
                data-ocid="tutorial.full_button"
              >
                <span className="tutorial-choice-btn__icon">📖</span>
                <span>
                  <span className="tutorial-choice-btn__label">
                    Full Tutorial
                  </span>
                  <span className="tutorial-choice-btn__meta">
                    {fullSteps.length} steps · complete walkthrough
                  </span>
                </span>
              </button>
            </div>

            <button
              type="button"
              className="tutorial-skip-button"
              onClick={skipAll}
              data-ocid="tutorial.skip_button"
            >
              Skip — I know my way around
            </button>
          </div>
        )}
      </div>

      {/* Tutorial overlay tooltip */}
      {isTutorialActive && steps[step] && (
        <>
          {/* Semi-transparent backdrop */}
          <div
            className="tutorial-overlay-backdrop"
            onClick={() => {
              if (step < totalSteps - 1) {
                nextStep();
              } else {
                completeTutorial();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (step < totalSteps - 1) nextStep();
                else completeTutorial();
              }
              if (e.key === "Escape") completeTutorial();
            }}
            role="button"
            tabIndex={-1}
            aria-label="Close tutorial"
          />

          {/* Tooltip card */}
          <div
            className="tutorial-tooltip tutorial-tooltip-mobile"
            style={{
              bottom: "6rem",
              left: "1rem",
              right: "auto",
              top: "auto",
              maxWidth: "min(22rem, calc(100vw - 2rem))",
              zIndex: 9100,
            }}
            role="dialog"
            aria-label="Tutorial step"
            data-ocid={`tutorial.step.${step + 1}`}
          >
            {/* Step counter + progress */}
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "oklch(0.72 0.18 76)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {tutorialType === "quick" ? "Quick Tour" : "Full Tutorial"} —
                Step {step + 1} of {totalSteps}
              </span>
              <button
                type="button"
                onClick={completeTutorial}
                aria-label="Close tutorial"
                data-ocid="tutorial.close_button"
                style={{
                  color: "oklch(0.65 0.06 78)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: "0.125rem",
                  borderRadius: "0.25rem",
                }}
              >
                ×
              </button>
            </div>

            <div className="tutorial-progress-bar">
              <div
                className="tutorial-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "oklch(0.72 0.18 76)",
                margin: "0.75rem 0 0.35rem",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {steps[step].title}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "oklch(0.75 0.025 75)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {steps[step].description}
            </p>

            {/* Navigation buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  data-ocid="tutorial.prev_button"
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid oklch(0.72 0.18 76 / 0.3)",
                    background: "transparent",
                    color: "oklch(0.75 0.025 75)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={nextStep}
                data-ocid="tutorial.next_button"
                style={{
                  flex: 1,
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid oklch(0.72 0.18 76 / 0.5)",
                  background: "oklch(0.72 0.18 76 / 0.12)",
                  color: "oklch(0.72 0.18 76)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                {step < totalSteps - 1 ? "Next →" : "Finish ✓"}
              </button>
            </div>

            <button
              type="button"
              className="tutorial-skip-button"
              onClick={skipAll}
              data-ocid="tutorial.skip_all_button"
            >
              Skip All
            </button>
          </div>
        </>
      )}
    </>
  );
}
