import { useNavigate } from "@tanstack/react-router";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

interface Props {
  message: ChatMessageType;
  onClose?: () => void;
  onOpenSettings?: () => void;
}

export default function ChatMessage({
  message,
  onClose,
  onOpenSettings,
}: Props) {
  const navigate = useNavigate();
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleNav = (path: string) => {
    if (
      path.startsWith("tel:") ||
      path.startsWith("https:") ||
      path.startsWith("http:")
    ) {
      window.open(path, "_blank", "noopener,noreferrer");
      return;
    }
    onClose?.();
    navigate({ to: path as never });
  };

  return (
    <div
      className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`message-bubble ${isUser ? "message-user" : "message-bot"}`}
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {message.text}
      </div>

      {/* Property data cards — no photos per company policy */}
      {!isUser && message.propertyCards && message.propertyCards.length > 0 && (
        <div className="flex flex-col gap-2 w-full mt-1 pl-1">
          {message.propertyCards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg p-3"
              style={{
                border: "1px solid oklch(var(--border))",
                background: "oklch(var(--card))",
              }}
            >
              {/* Type + BHK badges */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="text-xs font-sans font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: "oklch(var(--primary) / 0.15)",
                    color: "oklch(var(--primary))",
                  }}
                >
                  {card.bhk}
                </span>
                <span
                  className="text-xs font-sans px-2 py-0.5 rounded"
                  style={{
                    background: "oklch(var(--muted))",
                    color: "oklch(var(--muted-foreground))",
                  }}
                >
                  {card.propertyType}
                </span>
              </div>
              {/* Title */}
              <p
                className="font-sans font-semibold text-xs leading-snug mb-1"
                style={{ color: "oklch(var(--foreground))" }}
              >
                {card.title}
              </p>
              {/* Price */}
              <p
                className="font-sans text-sm font-bold mb-1"
                style={{ color: "oklch(var(--primary))" }}
              >
                {card.price}
              </p>
              {/* Details row */}
              <div
                className="flex items-center gap-2 text-xs mb-2"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                <span>{card.location}</span>
                {card.sqft && <span>· {card.sqft}</span>}
                {card.furnishing && <span>· {card.furnishing}</span>}
              </div>
              <button
                type="button"
                onClick={() => handleNav(card.action)}
                data-ocid="chat.property_enquire_button"
                className="w-full text-xs font-sans font-semibold py-1.5 rounded transition-all duration-150 active:scale-95"
                style={{
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                Enquire Now
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleNav("/properties")}
            data-ocid="chat.see_all_properties_button"
            className="self-start text-xs font-sans font-semibold px-2 py-1 rounded transition-all duration-150 hover:opacity-80"
            style={{ color: "oklch(var(--primary))" }}
          >
            View All Properties &rarr;
          </button>
        </div>
      )}

      {/* Navigation action buttons */}
      {!isUser && message.links && message.links.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-1 mt-0.5">
          {message.links.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => handleNav(link.path)}
              className="text-xs font-sans font-semibold px-2.5 py-1 rounded-md transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "oklch(var(--primary) / 0.15)",
                color: "oklch(var(--primary))",
                border: "1px solid oklch(var(--primary) / 0.35)",
              }}
            >
              {link.label} &rarr;
            </button>
          ))}
        </div>
      )}

      {/* Contact action bar — shown when showContact=true or isEscalated */}
      {!isUser && (message.showContact || message.isEscalated) && (
        <div
          className="flex flex-wrap gap-2 pl-1 mt-1 p-2 rounded-lg w-full"
          style={{
            background: "oklch(var(--primary) / 0.08)",
            border: "1px solid oklch(var(--primary) / 0.2)",
          }}
        >
          {message.isEscalated && (
            <p
              className="w-full text-xs font-sans mb-1"
              style={{ color: "oklch(var(--primary))" }}
            >
              Our team is ready to help you directly:
            </p>
          )}
          <a
            href="https://wa.me/919512609016"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="chat.whatsapp_button"
            className="flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:opacity-90"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <span>💬</span> WhatsApp
          </a>
          <a
            href="tel:+919512609016"
            data-ocid="chat.call_button"
            className="flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:opacity-90"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <span>📞</span> +91 9512609016
          </a>
          <a
            href="tel:+917926638800"
            data-ocid="chat.office_call_button"
            className="flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:opacity-90"
            style={{
              background: "oklch(var(--muted))",
              color: "oklch(var(--foreground))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <span>🏢</span> Office
          </a>
        </div>
      )}

      {/* Suggest settings when no API key */}
      {!isUser && message.isApiKeyMissing && (
        <button
          type="button"
          onClick={() => onOpenSettings?.()}
          data-ocid="chat.configure_ai_button"
          className="self-start text-xs font-sans font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: "oklch(var(--primary) / 0.12)",
            color: "oklch(var(--primary))",
            border: "1px solid oklch(var(--primary) / 0.3)",
          }}
        >
          ⚙️ Configure AI →
        </button>
      )}

      <span className="text-xs opacity-40 px-1">{time}</span>
    </div>
  );
}
