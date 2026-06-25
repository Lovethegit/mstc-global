import { AI_AGENTS, trackAgentUsage } from "@/utils/aiAgents";
import { MessageCircle, Mic, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import type { Language } from "../../types/chat";
import ChatMessageBubble from "./ChatMessage";

const LANG_LABELS: Record<Language, string> = { en: "EN", gu: "GU", hi: "HI" };
const LANG_LIST: Language[] = ["en", "gu", "hi"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: Props) {
  const {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    bottomRef,
    language,
    setLanguage,
  } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("general");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const [quickRepliesUsed, setQuickRepliesUsed] = useState(false);

  const QUICK_REPLIES = [
    {
      label: "🏠 Find a Property",
      text: "I'm looking for a property in Ahmedabad",
    },
    { label: "💰 EMI Calculator", text: "Help me calculate my home loan EMI" },
    {
      label: "📋 RERA Query",
      text: "I have a question about RERA regulations",
    },
    {
      label: "📅 Book Appointment",
      text: "I'd like to book an appointment with MSTC",
    },
    { label: "👤 Talk to Agent", text: "Connect me to a human agent" },
  ] as const;

  function handleQuickReply(text: string) {
    setQuickRepliesUsed(true);
    sendMessage(text);
  }

  const handleSend = () => sendMessage(input);

  const handleMic = () => {
    if (!speechSupported) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang =
        language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const transcript = String(event.results[0][0].transcript);
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      setSpeechSupported(false);
    }
  };

  return (
    <dialog
      className={`chat-panel ${isOpen ? "open" : ""}`}
      aria-label="MSTC Support Chat"
      open={isOpen}
      data-ocid="chat.dialog"
    >
      {/* Header */}
      <div className="chat-header">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageCircle size={20} className="shrink-0" />
          <h3 className="font-serif text-sm sm:text-base truncate leading-tight">
            MSTC AI Assistant
          </h3>
        </div>

        {/* Language toggle */}
        <div
          className="flex items-center gap-0.5 rounded-md overflow-hidden shrink-0"
          style={{ border: "1px solid oklch(var(--primary-foreground) / 0.3)" }}
        >
          {LANG_LIST.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              aria-label={`Switch to ${LANG_LABELS[lang]}`}
              data-ocid={`chat.lang_${lang}_toggle`}
              className="px-2 py-0.5 text-xs font-sans font-semibold transition-all duration-150"
              style={{
                background:
                  language === lang
                    ? "oklch(var(--primary-foreground) / 0.85)"
                    : "transparent",
                color:
                  language === lang
                    ? "oklch(var(--primary))"
                    : "oklch(var(--primary-foreground) / 0.7)",
              }}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* ── ONLY close button in entire chat UI ── */}
        <button
          type="button"
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Close chat"
          data-ocid="chat.close_button"
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick reply buttons — shown on first open before any user message */}
      {!quickRepliesUsed && messages.length <= 1 && (
        <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-b border-white/10">
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr.text}
              type="button"
              onClick={() => handleQuickReply(qr.text)}
              data-ocid={`chat.quick_reply.${qr.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_|_$/g, "")}`}
              className="text-xs px-2.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-gold-700/20 hover:border-gold-600/50 text-gray-200 hover:text-gold-300 transition-all duration-150 whitespace-nowrap"
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} onClose={onClose} />
        ))}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="message-bubble message-bot">
              <span className="flex gap-1 items-center">
                <span
                  className="animate-bounce inline-block"
                  style={{
                    animationDelay: "0ms",
                    color: "oklch(var(--primary))",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                  }}
                >
                  •
                </span>
                <span
                  className="animate-bounce inline-block"
                  style={{
                    animationDelay: "160ms",
                    color: "oklch(var(--primary))",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                  }}
                >
                  •
                </span>
                <span
                  className="animate-bounce inline-block"
                  style={{
                    animationDelay: "320ms",
                    color: "oklch(var(--primary))",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                  }}
                >
                  •
                </span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Agent selector */}
      <div className="flex gap-1 overflow-x-auto py-1 px-2 scrollbar-hide border-t border-white/10">
        {AI_AGENTS.slice(0, 6).map((agent) => (
          <button
            key={agent.id}
            type="button"
            onClick={() => {
              setSelectedAgentId(agent.id);
              trackAgentUsage(agent.id);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
              selectedAgentId === agent.id
                ? "bg-yellow-500 text-black font-medium"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <span>{agent.icon}</span>
            <span>{agent.name}</span>
          </button>
        ))}
      </div>

      {/* Input area — mic + text + send always fully visible */}
      <div className="chat-input-area">
        {speechSupported && (
          <button
            type="button"
            onClick={handleMic}
            aria-label={isRecording ? "Stop recording" : "Voice input"}
            data-ocid="chat.mic_button"
            title={isRecording ? "Stop" : "Speak"}
            style={{
              background: isRecording
                ? "oklch(0.55 0.22 30 / 0.18)"
                : "oklch(var(--muted))",
              border: `1px solid ${
                isRecording
                  ? "oklch(0.55 0.22 30 / 0.5)"
                  : "oklch(var(--border))"
              }`,
              borderRadius: "0.5rem",
              padding: "0.5rem",
              minWidth: "44px",
              minHeight: "44px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            <Mic
              size={16}
              style={{
                color: isRecording
                  ? "oklch(0.65 0.22 30)"
                  : "oklch(var(--foreground))",
              }}
            />
            {isRecording && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "oklch(0.65 0.22 30)",
                  animation: "pulse-gold 1s ease-in-out infinite",
                }}
              />
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything about MSTC..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          aria-label="Chat message"
          data-ocid="chat.input"
        />
        <button
          type="button"
          onClick={handleSend}
          aria-label="Send message"
          data-ocid="chat.submit_button"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Footer — WhatsApp contact (non-floating, inside panel) */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{
          borderTop: "1px solid oklch(var(--border))",
          background: "oklch(var(--muted) / 0.5)",
        }}
      >
        <span
          className="text-xs font-sans"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Powered by{" "}
          <strong style={{ color: "oklch(var(--primary))" }}>MSTC AI</strong>
        </span>
        <a
          href="https://wa.me/919512609016"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="chat.whatsapp_footer_button"
          className="flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:opacity-90"
          style={{
            background: "#25D366",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <span aria-hidden="true">💬</span> WhatsApp Us
        </a>
      </div>
    </dialog>
  );
}
