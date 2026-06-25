import { useEffect, useRef, useState } from "react";

interface TutorialHelpButtonProps {
  hasSeen: boolean;
  isHidden?: boolean;
  onClick: () => void;
}

export default function TutorialHelpButton({
  hasSeen,
  isHidden = false,
  onClick,
}: TutorialHelpButtonProps) {
  const [pulseActive, setPulseActive] = useState(!hasSeen);
  const [hovered, setHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [faded, setFaded] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stop pulse after 10s
  useEffect(() => {
    if (!hasSeen) {
      const timer = setTimeout(() => setPulseActive(false), 10_000);
      return () => clearTimeout(timer);
    }
  }, [hasSeen]);

  // Auto-fade when scrolling, reappear when idle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Auto-fade after 5s of no mouse movement
  useEffect(() => {
    const startFadeTimer = () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => setFaded(true), 5000);
    };
    const handleActivity = () => {
      setFaded(false);
      startFadeTimer();
    };
    startFadeTimer();
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  if (isHidden) return null;

  const sizeClass = hasSeen
    ? "tutorial-help-btn--small"
    : "tutorial-help-btn--normal";
  const pulseClass = pulseActive ? "animate-gentle-pulse" : "";

  return (
    <div
      className={`tutorial-help-btn ${sizeClass} ${pulseClass} ${
        isScrolling ? "is-scrolling" : ""
      }`}
      style={{
        opacity: faded && !hovered ? 0.25 : 1,
        transition: "opacity 0.4s ease",
        position: "fixed",
        bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
        left: "1rem",
        zIndex: 8990,
      }}
      data-hovered={hovered}
      data-seen={hasSeen}
      data-ocid="tutorial.help_button"
    >
      <button
        type="button"
        aria-label="Open tutorial guide"
        onClick={() => {
          setFaded(false);
          onClick();
        }}
        onMouseEnter={() => {
          setHovered(true);
          setFaded(false);
        }}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => {
          setHovered(true);
          setFaded(false);
        }}
        onBlur={() => setHovered(false)}
        className="tutorial-help-btn__trigger"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          touchAction: "manipulation",
        }}
      >
        ?
      </button>
      {hovered && (
        <span className="tutorial-help-btn__tooltip" role="tooltip">
          Help
        </span>
      )}
    </div>
  );
}
