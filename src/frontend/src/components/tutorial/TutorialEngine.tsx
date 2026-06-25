import { useLocation } from "@tanstack/react-router";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTutorial } from "../../hooks/useTutorial";
import {
  type TutorialMode,
  useRecordCompletion,
  useTutorialSteps,
} from "../../hooks/useTutorialQueries";
import TutorialChoiceModal from "./TutorialChoiceModal";
import TutorialHelpButton from "./TutorialHelpButton";
import TutorialTooltip from "./TutorialTooltip";

// ── Context ───────────────────────────────────────────────────────────────────

interface TutorialEngineContextValue {
  openTutorialChoice: () => void;
  appKey: string;
}

const TutorialEngineContext = createContext<TutorialEngineContextValue>({
  openTutorialChoice: () => undefined,
  appKey: "home",
});

export function useTutorialEngine(): TutorialEngineContextValue {
  return useContext(TutorialEngineContext);
}

// ── App key derivation ────────────────────────────────────────────────────────

const ROUTE_TO_APP_KEY: Record<string, string> = {
  "/": "home",
  "/admin": "admin",
  "/properties": "properties",
  "/property-portal": "properties",
  "/crm": "crm",
  "/security": "security",
  "/legal-command": "legal-command",
  "/observe": "observe",
  "/master": "master",
  "/builder": "builder",
  "/analytics": "analytics",
  "/ai": "ai",
  "/command": "command",
  "/apps": "apps",
  "/briefing": "briefing",
};

const APP_NAMES: Record<string, string> = {
  home: "MSTC GLOBAL",
  admin: "Admin Dashboard",
  properties: "Property Portal",
  crm: "CRM",
  security: "Security Command",
  "legal-command": "Legal Command",
  observe: "Observer View",
  master: "Master Control",
  builder: "Website Builder",
  analytics: "Analytics Center",
  ai: "AI Universe",
  command: "Command Center",
  apps: "App Launcher",
  briefing: "Executive Briefing",
};

function deriveAppKey(pathname: string): string {
  // Exact match first
  const exact = ROUTE_TO_APP_KEY[pathname];
  if (exact) return exact;
  // Prefix match (for nested routes)
  for (const [prefix, key] of Object.entries(ROUTE_TO_APP_KEY)) {
    if (prefix !== "/" && pathname.startsWith(`${prefix}/`)) return key;
  }
  // Strip leading slash and use first segment as key
  const segment = pathname.split("/")[1];
  return segment || "home";
}

// ── Main engine ───────────────────────────────────────────────────────────────

function TutorialEngineInner() {
  const location = useLocation();
  const appKey = deriveAppKey(location.pathname);
  const appName = APP_NAMES[appKey] ?? appKey;

  const tutorial = useTutorial(appKey);
  const recordCompletion = useRecordCompletion();

  // Fetch quick steps (pre-load both)
  const { data: quickSteps = [] } = useTutorialSteps(appKey, "quick");
  const { data: fullSteps = [] } = useTutorialSteps(appKey, "full");

  // Track whether auto-play timer has fired for this appKey
  const [autoPlayFired, setAutoPlayFired] = useState<Record<string, boolean>>(
    {},
  );

  // Auto-show choice modal after 1.5s on route change if not yet seen
  useEffect(() => {
    if (!tutorial.shouldAutoPlay) return;
    if (autoPlayFired[appKey]) return;

    const timer = setTimeout(() => {
      setAutoPlayFired((prev) => ({ ...prev, [appKey]: true }));
      tutorial.openChoiceModal();
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    autoPlayFired,
    appKey,
    tutorial.shouldAutoPlay,
    tutorial.openChoiceModal,
  ]);

  // Record completion when a tutorial finishes
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  useEffect(() => {
    if (prevIsOpen && !tutorial.isOpen && tutorial.currentMode) {
      recordCompletion.mutate({
        userId: "local-user",
        appKey,
        mode: tutorial.currentMode,
        skipped: false,
      });
    }
    setPrevIsOpen(tutorial.isOpen);
  }, [
    prevIsOpen,
    appKey,
    tutorial.currentMode,
    tutorial.isOpen,
    recordCompletion.mutate,
  ]);

  const handleQuick = useCallback(() => {
    tutorial.startQuickTutorial(
      quickSteps.length > 0
        ? quickSteps
        : [
            {
              title: appName,
              content: "Explore this section to discover all features.",
              targetElement: null,
            },
          ],
    );
  }, [tutorial, quickSteps, appName]);

  const handleFull = useCallback(() => {
    tutorial.startFullTutorial(
      fullSteps.length > 0
        ? fullSteps
        : quickSteps.length > 0
          ? quickSteps
          : [
              {
                title: appName,
                content: "Explore this section to discover all features.",
                targetElement: null,
              },
            ],
    );
  }, [tutorial, fullSteps, quickSteps, appName]);

  const handleSkip = useCallback(() => {
    tutorial.skipAll();
    recordCompletion.mutate({
      userId: "local-user",
      appKey,
      mode: tutorial.currentMode ?? ("quick" as TutorialMode),
      skipped: true,
    });
  }, [tutorial, recordCompletion, appKey]);

  // Current step data
  const currentStepData = tutorial.stepData[tutorial.currentStep];

  const contextValue = useMemo(
    () => ({ openTutorialChoice: tutorial.openChoiceModal, appKey }),
    [tutorial.openChoiceModal, appKey],
  );

  return (
    <TutorialEngineContext.Provider value={contextValue}>
      {/* Persistent help button — bottom-left */}
      <TutorialHelpButton
        hasSeen={tutorial.hasSeenQuick || tutorial.skippedAll}
        isHidden={tutorial.isOpen || tutorial.isChoiceModalOpen}
        onClick={tutorial.openChoiceModal}
      />

      {/* Choice modal — shown on first visit or when ? clicked */}
      {tutorial.isChoiceModalOpen && !tutorial.isOpen && (
        <TutorialChoiceModal
          appName={appName}
          onQuick={handleQuick}
          onFull={handleFull}
          onSkip={handleSkip}
        />
      )}

      {/* Active tooltip */}
      {tutorial.isOpen && currentStepData && (
        <TutorialTooltip
          step={currentStepData}
          position="center"
          currentStep={tutorial.currentStep}
          totalSteps={tutorial.totalSteps}
          onNext={tutorial.nextStep}
          onPrev={tutorial.prevStep}
          onSkipAll={handleSkip}
        />
      )}
    </TutorialEngineContext.Provider>
  );
}

// ── Provider wrapper ──────────────────────────────────────────────────────────

export interface TutorialEngineProviderProps {
  children?: ReactNode;
}

export function TutorialEngineProvider({
  children,
}: TutorialEngineProviderProps) {
  return (
    <>
      <TutorialEngineInner />
      {children}
    </>
  );
}

// ── Wrapper with children support (used in App.tsx as <TutorialEngine>) ────────

interface TutorialEngineProps {
  children?: ReactNode;
}

function TutorialEngine({ children }: TutorialEngineProps) {
  return <TutorialEngineProvider>{children}</TutorialEngineProvider>;
}

// Default export for direct placement in App.tsx
export default TutorialEngine;
