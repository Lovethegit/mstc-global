import { useCallback, useEffect, useState } from "react";
import type { TutorialMode, TutorialStepLocal } from "./useTutorialQueries";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TutorialStorageState {
  hasSeenQuick: boolean;
  hasSeenFull: boolean;
  skippedAll: boolean;
}

export interface TutorialState {
  shouldAutoPlay: boolean;
  currentMode: TutorialMode | null;
  currentStep: number;
  totalSteps: number;
  isOpen: boolean;
  stepData: TutorialStepLocal[];
  hasSeenQuick: boolean;
  hasSeenFull: boolean;
  skippedAll: boolean;
}

interface UseTutorialReturn extends TutorialState {
  startQuickTutorial: (steps: TutorialStepLocal[]) => void;
  startFullTutorial: (steps: TutorialStepLocal[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipAll: () => void;
  closeTutorial: () => void;
  resetForApp: () => void;
  openChoiceModal: () => void;
  isChoiceModalOpen: boolean;
  closeChoiceModal: () => void;
}

// ── Storage helpers ───────────────────────────────────────────────────────────

function storageKey(appKey: string): string {
  return `mstc_tutorial_${appKey}`;
}

function readStorage(appKey: string): TutorialStorageState {
  try {
    const raw = localStorage.getItem(storageKey(appKey));
    if (raw) return JSON.parse(raw) as TutorialStorageState;
  } catch {
    // ignore parse errors
  }
  return { hasSeenQuick: false, hasSeenFull: false, skippedAll: false };
}

function writeStorage(appKey: string, state: TutorialStorageState): void {
  try {
    localStorage.setItem(storageKey(appKey), JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTutorial(appKey: string): UseTutorialReturn {
  const [stored, setStored] = useState<TutorialStorageState>(() =>
    readStorage(appKey),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<TutorialMode | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<TutorialStepLocal[]>([]);

  // Re-read storage when appKey changes
  useEffect(() => {
    const s = readStorage(appKey);
    setStored(s);
    setIsOpen(false);
    setCurrentStep(0);
    setStepData([]);
    setCurrentMode(null);
  }, [appKey]);

  const persist = useCallback(
    (updates: Partial<TutorialStorageState>) => {
      const next = { ...stored, ...updates };
      setStored(next);
      writeStorage(appKey, next);
    },
    [appKey, stored],
  );

  const startQuickTutorial = useCallback((steps: TutorialStepLocal[]) => {
    setStepData(steps);
    setCurrentMode("quick");
    setCurrentStep(0);
    setIsOpen(true);
    setIsChoiceModalOpen(false);
  }, []);

  const startFullTutorial = useCallback((steps: TutorialStepLocal[]) => {
    setStepData(steps);
    setCurrentMode("full");
    setCurrentStep(0);
    setIsOpen(true);
    setIsChoiceModalOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= stepData.length) {
        // Mark as seen
        setIsOpen(false);
        if (currentMode === "quick") persist({ hasSeenQuick: true });
        if (currentMode === "full") persist({ hasSeenFull: true });
        return 0;
      }
      return next;
    });
  }, [stepData.length, currentMode, persist]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const skipAll = useCallback(() => {
    setIsOpen(false);
    setIsChoiceModalOpen(false);
    persist({ skippedAll: true, hasSeenQuick: true, hasSeenFull: true });
  }, [persist]);

  const closeTutorial = useCallback(() => {
    setIsOpen(false);
    if (currentMode === "quick") persist({ hasSeenQuick: true });
    if (currentMode === "full") persist({ hasSeenFull: true });
  }, [currentMode, persist]);

  const resetForApp = useCallback(() => {
    const reset: TutorialStorageState = {
      hasSeenQuick: false,
      hasSeenFull: false,
      skippedAll: false,
    };
    setStored(reset);
    writeStorage(appKey, reset);
    setIsOpen(false);
    setCurrentStep(0);
  }, [appKey]);

  const openChoiceModal = useCallback(() => {
    setIsChoiceModalOpen(true);
  }, []);

  const closeChoiceModal = useCallback(() => {
    setIsChoiceModalOpen(false);
  }, []);

  const shouldAutoPlay = !stored.skippedAll && !stored.hasSeenQuick;

  return {
    shouldAutoPlay,
    currentMode,
    currentStep,
    totalSteps: stepData.length,
    isOpen,
    stepData,
    hasSeenQuick: stored.hasSeenQuick,
    hasSeenFull: stored.hasSeenFull,
    skippedAll: stored.skippedAll,
    startQuickTutorial,
    startFullTutorial,
    nextStep,
    prevStep,
    skipAll,
    closeTutorial,
    resetForApp,
    openChoiceModal,
    isChoiceModalOpen,
    closeChoiceModal,
  };
}
