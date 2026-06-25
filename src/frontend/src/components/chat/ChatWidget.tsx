import { MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const _scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock body scroll on mobile when panel is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isOpen) {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty("--scroll-y", `-${scrollY}px`);
      document.body.classList.add("body-scroll-locked");
    } else {
      const scrollY = document.body.style.top;
      document.body.classList.remove("body-scroll-locked");
      document.documentElement.style.removeProperty("--scroll-y");
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.classList.remove("body-scroll-locked");
      document.documentElement.style.removeProperty("--scroll-y");
    };
  }, [isOpen]);

  useEffect(() => {
    if (dismissed) return;
    const alreadyDismissed =
      sessionStorage.getItem("mstc_proactive_dismissed") === "1";
    if (alreadyDismissed) {
      setDismissed(true);
      return;
    }

    // After 5 minutes: show unread badge
    const badgeTimer = window.setTimeout(
      () => {
        if (!isOpen && !dismissed) setUnreadCount(1);
      },
      5 * 60 * 1000,
    );

    // After 8 minutes: show small bubble
    const bubbleTimer = window.setTimeout(
      () => {
        if (!isOpen && !dismissed) setShowBubble(true);
      },
      8 * 60 * 1000,
    );

    return () => {
      clearTimeout(badgeTimer);
      clearTimeout(bubbleTimer);
    };
  }, [isOpen, dismissed]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setShowBubble(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDismissBubble = useCallback(() => {
    setShowBubble(false);
    setDismissed(true);
    setUnreadCount(0);
    sessionStorage.setItem("mstc_proactive_dismissed", "1");
  }, []);

  // Dismiss bubble on click outside
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showBubble) return;
    const handleOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        handleDismissBubble();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showBubble, handleDismissBubble]);

  return (
    <>
      {/* Mobile overlay — tap to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9997] md:hidden"
          onClick={handleClose}
          onKeyDown={(e) => e.key === "Enter" && handleClose()}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <ChatPanel isOpen={isOpen} onClose={handleClose} />

      {/* Proactive bubble — tiny tooltip only, never expands button */}
      {!isOpen && showBubble && !dismissed && (
        <div
          ref={bubbleRef}
          style={{
            position: "fixed",
            bottom:
              "calc(max(1.25rem, env(safe-area-inset-bottom, 1.25rem)) + 60px + 0.75rem)",
            right: "1.25rem",
            maxWidth: "220px",
            zIndex: 8999,
            animation: "slideUpFade 0.3s ease both",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "oklch(0.14 0.015 62)",
              border: "1px solid oklch(0.72 0.18 76 / 0.45)",
              borderRadius: "0.75rem",
              padding: "0.6rem 0.875rem",
              boxShadow: "0 4px 20px oklch(0 0 0 / 0.5)",
            }}
          >
            <button
              type="button"
              onClick={handleDismissBubble}
              aria-label="Dismiss"
              style={{
                position: "absolute",
                top: "4px",
                right: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "oklch(0.6 0.04 75)",
                fontSize: "12px",
                lineHeight: 1,
                padding: "2px",
              }}
            >
              <X size={10} />
            </button>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.85 0.03 78)",
                margin: 0,
                paddingRight: "1rem",
                lineHeight: 1.5,
              }}
            >
              Need help finding the right property? Chat with us!
            </p>
            <button
              type="button"
              onClick={handleOpen}
              style={{
                marginTop: "0.4rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                background: "oklch(0.72 0.18 76)",
                color: "oklch(0.1 0.01 60)",
                border: "none",
                borderRadius: "0.3rem",
                padding: "0.2rem 0.6rem",
                cursor: "pointer",
                display: "inline-block",
              }}
              data-ocid="chat.proactive_bubble_open"
            >
              Chat →
            </button>
            {/* Tail arrow pointing down-right */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "-7px",
                right: "20px",
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "7px solid oklch(0.72 0.18 76 / 0.45)",
              }}
            />
          </div>
        </div>
      )}

      {/* Floating button — 48px circle, fixed bottom-right, never blocks content */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open support chat"
          aria-expanded={false}
          data-ocid="chat.open_modal_button"
          style={{
            position: "fixed",
            bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
            right: "1rem",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "oklch(0.72 0.18 76)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px oklch(0 0 0 / 0.5)",
            zIndex: 9998,
          }}
        >
          <MessageCircle size={22} color="#06090f" />
          {/* Unread count badge */}
          {unreadCount > 0 && !dismissed && (
            <span
              aria-label={`${unreadCount} unread messages`}
              style={{
                position: "absolute",
                top: "3px",
                right: "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "oklch(0.65 0.22 30)",
                border: "2px solid #06090f",
                fontSize: "10px",
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </>
  );
}
