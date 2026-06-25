import {
  useLogCallbackRequest,
  useLogMoreInfoRequest,
  useLogQuoteRequest,
} from "@/hooks/useFormQueries";
import { FileText, Info, Phone } from "lucide-react";
import { useState } from "react";

const GOLD = "#c9a84c";
const DARK_BG = "#06090f";
const MODAL_BG = "#0d1117";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0a0d14",
  border: `1px solid ${GOLD}44`,
  borderRadius: "0.5rem",
  padding: "0.7rem 0.9rem",
  color: "#e8e0cc",
  fontFamily: "Inter, sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: `${GOLD}cc`,
  fontSize: "0.75rem",
  fontWeight: 600,
  marginBottom: "0.35rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor={htmlFor} style={labelStyle}>
        {label}
      </label>
      {children}
    </div>
  );
}

function LuxuryInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  dataOcid,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dataOcid: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-ocid={dataOcid}
      style={inputStyle}
      onFocus={(e) => {
        e.target.style.borderColor = GOLD;
        e.target.style.boxShadow = `0 0 0 2px ${GOLD}22`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = `${GOLD}44`;
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function LuxurySelect({
  id,
  value,
  onChange,
  dataOcid,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  dataOcid: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={dataOcid}
      style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={(e) => {
        e.target.style.borderColor = GOLD;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = `${GOLD}44`;
      }}
    >
      <option value="" style={{ background: MODAL_BG }}>
        Select a service...
      </option>
      {SERVICES.map((s) => (
        <option key={s} value={s} style={{ background: MODAL_BG }}>
          {s}
        </option>
      ))}
    </select>
  );
}

function LuxuryTextarea({
  id,
  value,
  onChange,
  placeholder,
  dataOcid,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dataOcid: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      data-ocid={dataOcid}
      style={{ ...inputStyle, resize: "vertical" }}
      onFocus={(e) => {
        e.target.style.borderColor = GOLD;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = `${GOLD}44`;
      }}
    />
  );
}

function ModalWrapper({
  title,
  ocid,
  onClose,
  onSubmit,
  isPending,
  submitted,
  children,
}: {
  title: string;
  ocid: string;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
  submitted: boolean;
  children: React.ReactNode;
}) {
  return (
    <dialog
      open
      data-ocid={`${ocid}.dialog`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(6,9,15,0.88)",
        backdropFilter: "blur(4px)",
        border: "none",
        padding: 0,
        margin: 0,
        maxWidth: "100vw",
        maxHeight: "100vh",
        width: "100vw",
        height: "100vh",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        style={{
          background: MODAL_BG,
          border: `1px solid ${GOLD}55`,
          borderRadius: "1rem",
          padding: "2rem",
          width: "min(92vw, 460px)",
          boxShadow: `0 8px 48px ${GOLD}22`,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          data-ocid={`${ocid}.close_button`}
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: `${GOLD}99`,
            fontSize: "1.4rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 3,
              height: 28,
              background: GOLD,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              color: GOLD,
              fontSize: "1.3rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        {submitted ? (
          <div
            data-ocid={`${ocid}.success_state`}
            style={{ textAlign: "center", padding: "1.5rem 0" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              ✅
            </div>
            <p
              style={{
                fontFamily: "Playfair Display, serif",
                color: GOLD,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Request Submitted!
            </p>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
              }}
            >
              Our team will get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            {children}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.25rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                data-ocid={`${ocid}.cancel_button`}
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: `1px solid ${GOLD}44`,
                  color: `${GOLD}99`,
                  borderRadius: "0.5rem",
                  padding: "0.6rem 1.25rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid={`${ocid}.submit_button`}
                onClick={onSubmit}
                disabled={isPending}
                style={{
                  background: GOLD,
                  border: "none",
                  color: DARK_BG,
                  borderRadius: "0.5rem",
                  padding: "0.6rem 1.5rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: isPending ? "not-allowed" : "pointer",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

// ── Individual Modals ────────────────────────────────────────────────────────

function CallbackModal({
  onClose,
  preselectedService,
}: {
  onClose: () => void;
  preselectedService: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(preselectedService);
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useLogCallbackRequest();

  async function handleSubmit() {
    if (!name || !phone || !indemnity) return;
    await mutateAsync({
      name,
      phone,
      service,
      pageName: window.location.pathname,
    });
    setSubmitted(true);
    setTimeout(onClose, 2500);
  }

  return (
    <ModalWrapper
      title="Request a Callback"
      ocid="callback"
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitted={submitted}
    >
      <FieldGroup label="Full Name" htmlFor="callback-name">
        <LuxuryInput
          id="callback-name"
          value={name}
          onChange={setName}
          placeholder="Your full name"
          dataOcid="callback.name_input"
        />
      </FieldGroup>
      <FieldGroup label="Phone Number" htmlFor="callback-phone">
        <LuxuryInput
          id="callback-phone"
          value={phone}
          onChange={setPhone}
          placeholder="+91 XXXXX XXXXX"
          type="tel"
          dataOcid="callback.phone_input"
        />
      </FieldGroup>
      <FieldGroup label="Service Interested In" htmlFor="callback-service">
        <LuxurySelect
          id="callback-service"
          value={service}
          onChange={setService}
          dataOcid="callback.service_select"
        />
      </FieldGroup>
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.6rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        <input
          type="checkbox"
          checked={indemnity}
          onChange={(e) => setIndemnity(e.target.checked)}
          data-ocid="callback.indemnity_checkbox"
          style={{ marginTop: "2px", accentColor: GOLD }}
        />
        <span
          style={{ color: "#8a8a8a", fontSize: "0.78rem", lineHeight: 1.5 }}
        >
          I agree to MSTC GLOBAL's Terms &amp; Conditions, Privacy Policy, and
          Indemnity Agreement. I understand MSTC GLOBAL is a facilitator and not
          liable for any outcomes.
          <span style={{ color: "#e55", marginLeft: "4px" }}>*Required</span>
        </span>
      </label>
    </ModalWrapper>
  );
}

function QuoteModal({
  onClose,
  preselectedService,
}: {
  onClose: () => void;
  preselectedService: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(preselectedService);
  const [message, setMessage] = useState("");
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useLogQuoteRequest();

  async function handleSubmit() {
    if (!name || !email || !indemnity) return;
    await mutateAsync({
      name,
      phone,
      email,
      service,
      message,
      pageName: window.location.pathname,
    });
    setSubmitted(true);
    setTimeout(onClose, 2500);
  }

  return (
    <ModalWrapper
      title="Request a Quote"
      ocid="quote"
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitted={submitted}
    >
      <FieldGroup label="Full Name" htmlFor="quote-name">
        <LuxuryInput
          id="quote-name"
          value={name}
          onChange={setName}
          placeholder="Your full name"
          dataOcid="quote.name_input"
        />
      </FieldGroup>
      <FieldGroup label="Phone Number" htmlFor="quote-phone">
        <LuxuryInput
          id="quote-phone"
          value={phone}
          onChange={setPhone}
          placeholder="+91 XXXXX XXXXX"
          type="tel"
          dataOcid="quote.phone_input"
        />
      </FieldGroup>
      <FieldGroup label="Email Address" htmlFor="quote-email">
        <LuxuryInput
          id="quote-email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          dataOcid="quote.email_input"
        />
      </FieldGroup>
      <FieldGroup label="Service Interested In" htmlFor="quote-service">
        <LuxurySelect
          id="quote-service"
          value={service}
          onChange={setService}
          dataOcid="quote.service_select"
        />
      </FieldGroup>
      <FieldGroup label="Message" htmlFor="quote-message">
        <LuxuryTextarea
          id="quote-message"
          value={message}
          onChange={setMessage}
          placeholder="Tell us about your project..."
          dataOcid="quote.textarea"
        />
      </FieldGroup>
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.6rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        <input
          type="checkbox"
          checked={indemnity}
          onChange={(e) => setIndemnity(e.target.checked)}
          data-ocid="quote.indemnity_checkbox"
          style={{ marginTop: "2px", accentColor: GOLD }}
        />
        <span
          style={{ color: "#8a8a8a", fontSize: "0.78rem", lineHeight: 1.5 }}
        >
          I agree to MSTC GLOBAL's Terms &amp; Conditions, Privacy Policy, and
          Indemnity Agreement. I understand MSTC GLOBAL is a facilitator and not
          liable for any outcomes.
          <span style={{ color: "#e55", marginLeft: "4px" }}>*Required</span>
        </span>
      </label>
    </ModalWrapper>
  );
}

function InfoModal({
  onClose,
  preselectedService,
}: {
  onClose: () => void;
  preselectedService: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(preselectedService);
  const [question, setQuestion] = useState("");
  const [indemnity, setIndemnity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useLogMoreInfoRequest();

  async function handleSubmit() {
    if (!name || !email || !indemnity) return;
    await mutateAsync({
      name,
      email,
      service,
      question,
      pageName: window.location.pathname,
    });
    setSubmitted(true);
    setTimeout(onClose, 2500);
  }

  return (
    <ModalWrapper
      title="Request Information"
      ocid="info_request"
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitted={submitted}
    >
      <FieldGroup label="Full Name" htmlFor="info-name">
        <LuxuryInput
          id="info-name"
          value={name}
          onChange={setName}
          placeholder="Your full name"
          dataOcid="info_request.name_input"
        />
      </FieldGroup>
      <FieldGroup label="Email Address" htmlFor="info-email">
        <LuxuryInput
          id="info-email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          dataOcid="info_request.email_input"
        />
      </FieldGroup>
      <FieldGroup label="Service Interested In" htmlFor="info-service">
        <LuxurySelect
          id="info-service"
          value={service}
          onChange={setService}
          dataOcid="info_request.service_select"
        />
      </FieldGroup>
      <FieldGroup label="Your Question" htmlFor="info-question">
        <LuxuryTextarea
          id="info-question"
          value={question}
          onChange={setQuestion}
          placeholder="What would you like to know?"
          dataOcid="info_request.textarea"
        />
      </FieldGroup>
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.6rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        <input
          type="checkbox"
          checked={indemnity}
          onChange={(e) => setIndemnity(e.target.checked)}
          data-ocid="info_request.indemnity_checkbox"
          style={{ marginTop: "2px", accentColor: GOLD }}
        />
        <span
          style={{ color: "#8a8a8a", fontSize: "0.78rem", lineHeight: 1.5 }}
        >
          I agree to MSTC GLOBAL's Terms &amp; Conditions, Privacy Policy, and
          Indemnity Agreement. I understand MSTC GLOBAL is a facilitator and not
          liable for any outcomes.
          <span style={{ color: "#e55", marginLeft: "4px" }}>*Required</span>
        </span>
      </label>
    </ModalWrapper>
  );
}

// ── Main exported section ────────────────────────────────────────────────────

type ModalType = "callback" | "quote" | "info" | null;

const BUTTONS: {
  type: ModalType;
  Icon: React.FC<{ size?: number; stroke?: string }>;
  label: string;
  sublabel: string;
  ocid: string;
}[] = [
  {
    type: "callback",
    Icon: Phone,
    label: "Request a Callback",
    sublabel: "We'll call you within 2 hours",
    ocid: "request_section.callback_button",
  },
  {
    type: "quote",
    Icon: FileText,
    label: "Request a Quote",
    sublabel: "Get a detailed proposal",
    ocid: "request_section.quote_button",
  },
  {
    type: "info",
    Icon: Info,
    label: "Request Information",
    sublabel: "Ask us anything",
    ocid: "request_section.info_button",
  },
];

interface RequestFormsSectionProps {
  preselectedService?: string;
}

export function RequestFormsSection({
  preselectedService = "",
}: RequestFormsSectionProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  function closeModal() {
    setActiveModal(null);
  }

  return (
    <>
      <section
        data-ocid="request_section.panel"
        style={{
          padding: "3rem 1.5rem",
          background:
            "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)",
          borderTop: `1px solid ${GOLD}22`,
          borderBottom: `1px solid ${GOLD}22`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p
              style={{
                color: `${GOLD}aa`,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              ✦ Ready to Begin? ✦
            </p>
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                color: GOLD,
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 700,
                margin: 0,
              }}
            >
              How Can We Help You?
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {BUTTONS.map(({ type, Icon, label, sublabel, ocid }) => (
              <button
                key={type}
                type="button"
                data-ocid={ocid}
                onClick={() => setActiveModal(type)}
                style={{
                  background: "#0d1117",
                  border: `1px solid ${GOLD}44`,
                  borderRadius: "0.875rem",
                  padding: "1.5rem 1.25rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition:
                    "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = GOLD;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 8px 32px ${GOLD}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${GOLD}44`;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: `${GOLD}18`,
                    border: `1px solid ${GOLD}44`,
                    borderRadius: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} stroke={GOLD} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Playfair Display, serif",
                      color: GOLD,
                      fontSize: "1rem",
                      fontWeight: 700,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      color: "#8a8a8a",
                      fontSize: "0.8rem",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {sublabel}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    color: GOLD,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Open Form →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeModal === "callback" && (
        <CallbackModal
          onClose={closeModal}
          preselectedService={preselectedService}
        />
      )}
      {activeModal === "quote" && (
        <QuoteModal
          onClose={closeModal}
          preselectedService={preselectedService}
        />
      )}
      {activeModal === "info" && (
        <InfoModal
          onClose={closeModal}
          preselectedService={preselectedService}
        />
      )}
    </>
  );
}
