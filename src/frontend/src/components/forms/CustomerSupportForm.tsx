import { useLogSupportForm } from "@/hooks/useFormQueries";
import { useState } from "react";

const GOLD = "#c9a84c";
const DARK_BG = "#06090f";

const SERVICES = [
  "Infrastructure Land & Property Development",
  "RERA Impact & PR Consulting",
  "Purchase Rent & Redevelopment",
  "Finance Loans & Investment",
  "Music & Cultural Services",
  "Hospitality & Event Management",
  "NGO & CSR Initiatives",
  "Media Sports & Tourism",
];

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(201,168,76,0.04)",
  border: `1px solid ${GOLD}44`,
  borderRadius: "0.6rem",
  padding: "0.8rem 1rem",
  color: "#e8e0cc",
  fontFamily: "Inter, sans-serif",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelBase: React.CSSProperties = {
  display: "block",
  color: `${GOLD}cc`,
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  marginBottom: "0.4rem",
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label htmlFor={htmlFor} style={labelBase}>
        {label}
      </label>
      {children}
    </div>
  );
}

function focusStyle(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.target.style.borderColor = GOLD;
  e.target.style.boxShadow = `0 0 0 3px ${GOLD}1a`;
}

function blurStyle(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.target.style.borderColor = `${GOLD}44`;
  e.target.style.boxShadow = "none";
}

export function CustomerSupportForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useLogSupportForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    await mutateAsync({ name, phone, email, service, message });
    setSubmitted(true);
    setName("");
    setPhone("");
    setEmail("");
    setService("");
    setMessage("");
  }

  return (
    <div
      data-ocid="support_form.panel"
      style={{
        background: "#0a0d14",
        border: `1px solid ${GOLD}33`,
        borderRadius: "1rem",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        maxWidth: 620,
        margin: "0 auto",
        boxShadow: `0 4px 40px ${GOLD}0d`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gold accent top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      <div style={{ marginBottom: "1.75rem" }}>
        <p
          style={{
            color: `${GOLD}aa`,
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ✦ Customer Support ✦
        </p>
        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            color: GOLD,
            fontSize: "clamp(1.3rem, 3vw, 1.7rem)",
            fontWeight: 700,
            margin: 0,
          }}
        >
          How Can We Help?
        </h3>
        <p
          style={{
            color: "#8a8a8a",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Fill in the form and our team will respond within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div
          data-ocid="support_form.success_state"
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            border: `1px solid ${GOLD}33`,
            borderRadius: "0.75rem",
            background: `${GOLD}08`,
          }}
        >
          <a
            href="https://wa.me/919512609016?text=Hi+MSTC%2C+I+submitted+a+support+request.+Please+confirm."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-600 text-sm font-semibold mb-3"
          >
            ✓ WhatsApp Confirmation
          </a>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🙏</div>
          <p
            style={{
              fontFamily: "Playfair Display, serif",
              color: GOLD,
              fontSize: "1.15rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Message Sent Successfully!
          </p>
          <p
            style={{
              color: "#8a8a8a",
              fontSize: "0.875rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            style={{
              marginTop: "1rem",
              background: "transparent",
              border: `1px solid ${GOLD}44`,
              color: GOLD,
              borderRadius: "0.5rem",
              padding: "0.5rem 1.25rem",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Two-column row on wider screens */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0 1rem",
            }}
          >
            <Field label="Full Name" htmlFor="sf-name">
              <input
                id="sf-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                data-ocid="support_form.name_input"
                style={inputBase}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
            <Field label="Phone Number" htmlFor="sf-phone">
              <input
                id="sf-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                data-ocid="support_form.phone_input"
                style={inputBase}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
          </div>

          <Field label="Email Address" htmlFor="sf-email">
            <input
              id="sf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              data-ocid="support_form.email_input"
              style={inputBase}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          <Field label="Service Interested In" htmlFor="sf-service">
            <select
              id="sf-service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              data-ocid="support_form.service_select"
              style={{ ...inputBase, cursor: "pointer" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              <option value="" style={{ background: "#0a0d14" }}>
                Select a service...
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s} style={{ background: "#0a0d14" }}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Message" htmlFor="sf-message">
            <textarea
              id="sf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe how we can help you..."
              required
              rows={4}
              data-ocid="support_form.message_textarea"
              style={{ ...inputBase, resize: "vertical" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Validation hint */}
          {(!name || !email || !message) && (
            <p
              data-ocid="support_form.field_error"
              style={{
                color: `${GOLD}77`,
                fontSize: "0.78rem",
                fontFamily: "Inter, sans-serif",
                marginBottom: "0.75rem",
              }}
            >
              * Full Name, Email, and Message are required
            </p>
          )}

          <button
            type="submit"
            data-ocid="support_form.submit_button"
            disabled={isPending || !name || !email || !message}
            style={{
              width: "100%",
              background:
                isPending || !name || !email || !message
                  ? `${GOLD}55`
                  : `linear-gradient(135deg, #d4aa50 0%, ${GOLD} 50%, #b8962e 100%)`,
              border: "none",
              borderRadius: "0.6rem",
              padding: "0.9rem 2rem",
              color: DARK_BG,
              fontFamily: "Playfair Display, serif",
              fontSize: "1rem",
              fontWeight: 700,
              cursor:
                isPending || !name || !email || !message
                  ? "not-allowed"
                  : "pointer",
              letterSpacing: "0.04em",
              transition: "opacity 0.2s, transform 0.15s",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!isPending && name && email && message)
                e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
