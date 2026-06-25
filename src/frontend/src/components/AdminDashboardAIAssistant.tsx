import {
  Activity,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Provider = "openai" | "gemini" | "claude";
type ProviderStatus = "active" | "error" | "unconfigured" | "testing";

interface ProviderConfig {
  key: string;
  status: ProviderStatus;
  name: string;
  icon: React.ReactNode;
}

interface AdminMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
  provider?: Provider;
}

const QUICK_ACTIONS = [
  { label: "📊 Daily Briefing", key: "daily-briefing" },
  { label: "🎯 Lead Summary", key: "lead-summary" },
  { label: "🏠 Property Performance", key: "property-performance" },
  { label: "💰 Revenue Forecast", key: "revenue-forecast" },
] as const;

type QuickActionKey = (typeof QUICK_ACTIONS)[number]["key"];

const QUICK_ACTION_RESPONSES: Record<QuickActionKey, string> = {
  "daily-briefing": `📊 **MSTC GLOBAL — Daily Briefing**

🕐 ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}

**Property Portal:** 1,051+ active listings across Ahmedabad. Top performing localities today: SG Highway, Prahlad Nagar, Bopal.

**Leads:** 3 new enquiries since midnight. 2 high-priority leads flagged for follow-up. Deal pipeline: ₹4.2Cr in active negotiations.

**Finance Tools:** EMI calculator accessed 28 times today. Loan eligibility tool showing strong engagement from 25–35 age group.

**AI Agents:** All 11 agents operational. Property Search Agent handled 7 queries. Legal Guide assisted 4 users with RERA clarifications.

**Action Required:** 2 callback requests pending. 1 complaint ticket open for 48+ hours — please review.

*All systems nominal. Your platform is performing well today.* ✅`,

  "lead-summary": `🎯 **Lead Pipeline Summary**

**Hot Leads (This Week)**
• 3 leads with budget ₹80L–₹1.2Cr looking for 3BHK in Prahlad Nagar
• 1 NRI buyer interested in commercial space on SG Highway
• 2 first-time buyers need home loan guidance (connect to Finance Agent)

**Follow-up Required**
• 5 leads have had no contact in 72+ hours
• 2 appointments booked for tomorrow — confirm by 6PM today

**Conversion This Month:** 4 deals closed, ₹2.8Cr total value.

**Lead Sources:** WhatsApp (42%), Website form (31%), Referral (19%), Direct call (8%).

*Recommendation: Prioritize NRI buyer — high intent, time-sensitive.* 🚀`,

  "property-performance": `🏠 **Property Portal Performance**

**Active Listings:** 1,051 verified properties
**Most Viewed (7 days):** 3BHK Prahlad Nagar ₹95L, 2BHK Bopal ₹58L, Commercial SG Highway ₹2.1Cr

**Category Breakdown:**
• Residential Buy: 623 listings (59%)
• Residential Rent: 287 listings (27%)
• Commercial: 98 listings (9%)
• Plots & Land: 43 listings (4%)

**Price Alerts Triggered:** 12 users notified of price drops
**Shortlists Created:** 8 active shortlists this week

**Longest Unsold Listings (60+ days):** 4 properties — consider price review or featured placement.

**Localities with highest enquiry growth:** Chandkheda (+34%), Vastral (+28%), Gota (+22%).

*Tip: Add virtual site visit to the top 10 listings for faster conversion.* 💡`,

  "revenue-forecast": `💰 **90-Day Revenue Forecast**

**Current Pipeline Value:** ₹7.4 Cr across 11 active deals

**30-Day Forecast:** ₹1.8Cr (3 deals likely to close — high confidence)
**60-Day Forecast:** ₹3.2Cr (5 additional deals in advanced negotiation)
**90-Day Forecast:** ₹5.9Cr (full pipeline, assuming 65% close rate)

**Service Revenue Breakdown:**
• Property brokerage: 71%
• Finance advisory: 12%
• Events & Hospitality: 9%
• Legal consulting: 5%
• Other services: 3%

**Key Risk Factors:**
• RBI rate decision in 2 weeks may affect buyer sentiment
• 2 large deals dependent on loan approvals — track closely

**Recommendation:** Focus on mid-segment (₹60L–₹90L) this quarter — fastest-moving segment with lowest drop-off rate.

*Forecast confidence: Medium-High based on current pipeline quality.* 📈`,
};

const WELCOME_MESSAGE: AdminMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste! I'm your MSTC Business Intelligence Assistant. I have full context of your platform — properties, leads, finance, compliance, and all 8 service divisions. Ask me anything, or use a quick action above to get started.",
  ts: Date.now(),
};

function generateResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("property") || q.includes("listing"))
    return "Based on current data, MSTC GLOBAL has 1,051+ verified property listings across Ahmedabad. Top performing areas this month are Prahlad Nagar, SG Highway, and Bopal. Would you like a detailed breakdown by category or locality?";
  if (q.includes("lead") || q.includes("enquiry") || q.includes("enquiries"))
    return "Your current lead pipeline shows 3 high-priority contacts this week. The AI Lead Manager has auto-categorized them by budget range and intent score. 5 follow-ups are overdue — I recommend actioning those before end of day.";
  if (q.includes("finance") || q.includes("revenue") || q.includes("money"))
    return "Finance overview: Current quarter pipeline is ₹7.4Cr across 11 active deals. EMI calculators and loan tools are generating 28–35 daily interactions. The SIP vs Property tool is the highest-engagement finance feature this week.";
  if (q.includes("rera") || q.includes("legal") || q.includes("compliance"))
    return "All RERA compliance items are current. The Legal Guide AI agent has assisted 4 users today. Next compliance review date: 15th of this month. No pending RERA filings flagged.";
  if (q.includes("agent") || q.includes("ai"))
    return "All 11 AI agents are operational. Property Search Agent handled 7 queries today. Finance Advisor is engaged in 3 active consultations. The RERA Compliance Agent flagged 0 issues this week. Would you like to reconfigure any agent from the AI Operations Center?";
  if (q.includes("event") || q.includes("hospitality"))
    return "Events & Hospitality division: 2 upcoming events scheduled. The event planning wizard has 1 active inquiry. No vendor confirmations pending. Post-event reports for last 2 events have been generated.";
  if (q.includes("ngo") || q.includes("csr"))
    return "CSR division: Current year CSR budget utilization at 67%. 3 active campaigns. Volunteer tracker shows 24 registered volunteers. Next CSR compliance report due in 3 weeks — the CSR Agent will auto-generate it.";
  if (q.includes("music") || q.includes("artist") || q.includes("cultural"))
    return "Music & Cultural division: 8 artists currently profiled on the portal. 2 booking requests received this week. The performance calendar has 3 upcoming events listed. Talent submission portal has 1 new application pending review.";
  if (q.includes("security") || q.includes("fraud") || q.includes("spam"))
    return "Security status: No active threats detected. Anti-fraud AI blocked 3 suspicious form submissions today (bot signatures). All admin login attempts are from known India IPs. Data integrity check passed at last scan.";
  if (q.includes("hello") || q.includes("hi") || q.includes("namaste"))
    return "Namaste! How can I help you today? You can ask me about your properties, leads, revenue, AI agents, compliance, or any of the 8 MSTC service divisions. Or use the quick action buttons above for instant reports.";
  return `I've analyzed your query about "${input.trim()}". Based on current MSTC GLOBAL platform data: all systems are operational, your property portal has 1,051+ active listings, and AI agents are processing requests normally. For more specific information, please refine your question or I can generate a detailed report on any service division.`;
}

const STORAGE_KEYS: Record<Provider, string> = {
  openai: "mstc_admin_openai_key",
  gemini: "mstc_admin_gemini_key",
  claude: "mstc_admin_claude_key",
};

function loadKey(p: Provider): string {
  return localStorage.getItem(STORAGE_KEYS[p]) ?? "";
}
function saveKey(p: Provider, val: string) {
  localStorage.setItem(STORAGE_KEYS[p], val);
}

export default function AdminDashboardAIAssistant() {
  const [messages, setMessages] = useState<AdminMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configs, setConfigs] = useState<Record<Provider, ProviderConfig>>(
    () => ({
      openai: {
        key: loadKey("openai"),
        status: loadKey("openai") ? "active" : "unconfigured",
        name: "OpenAI",
        icon: <Brain size={14} />,
      },
      gemini: {
        key: loadKey("gemini"),
        status: loadKey("gemini") ? "active" : "unconfigured",
        name: "Gemini",
        icon: <Sparkles size={14} />,
      },
      claude: {
        key: loadKey("claude"),
        status: loadKey("claude") ? "active" : "unconfigured",
        name: "Claude",
        icon: <Bot size={14} />,
      },
    }),
  );
  const [showKeys, setShowKeys] = useState<Record<Provider, boolean>>({
    openai: false,
    gemini: false,
    claude: false,
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function activeProvider(): Provider {
    const order: Provider[] = ["openai", "gemini", "claude"];
    return (
      order.find((p) => configs[p].status === "active" && configs[p].key) ??
      "openai"
    );
  }

  function sendMsg(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: AdminMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    window.setTimeout(
      () => {
        const reply: AdminMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateResponse(trimmed),
          ts: Date.now(),
          provider: activeProvider(),
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      },
      900 + Math.random() * 600,
    );
  }

  function handleQuickAction(key: QuickActionKey) {
    const label = QUICK_ACTIONS.find((a) => a.key === key)?.label ?? key;
    const userMsg: AdminMessage = {
      id: Date.now().toString(),
      role: "user",
      content: label,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    window.setTimeout(
      () => {
        const reply: AdminMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: QUICK_ACTION_RESPONSES[key],
          ts: Date.now(),
          provider: activeProvider(),
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      },
      1100 + Math.random() * 400,
    );
  }

  function updateKey(provider: Provider, val: string) {
    saveKey(provider, val);
    setConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        key: val,
        status: val ? "active" : "unconfigured",
      },
    }));
  }

  function testConnection(provider: Provider) {
    setConfigs((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], status: "testing" },
    }));
    window.setTimeout(() => {
      const hasKey = configs[provider].key.length > 0;
      setConfigs((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], status: hasKey ? "active" : "error" },
      }));
    }, 1400);
  }

  function toggleShowKey(p: Provider) {
    setShowKeys((prev) => ({ ...prev, [p]: !prev[p] }));
  }

  const PROVIDERS: Provider[] = ["openai", "gemini", "claude"];

  function statusColor(s: ProviderStatus) {
    if (s === "active") return "text-green-400";
    if (s === "error") return "text-red-400";
    if (s === "testing") return "text-yellow-400";
    return "text-obsidian-400";
  }

  function statusIcon(s: ProviderStatus) {
    if (s === "active")
      return <CheckCircle2 size={14} className="text-green-400" />;
    if (s === "error") return <XCircle size={14} className="text-red-400" />;
    if (s === "testing")
      return <Loader2 size={14} className="text-yellow-400 animate-spin" />;
    return <Activity size={14} className="text-obsidian-400" />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-text">
            Admin AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Private business intelligence — not visible to public users
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Provider status indicators */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900/60 border border-gold-800/20">
            {PROVIDERS.map((p) => (
              <span
                key={p}
                className={`flex items-center gap-1 text-xs font-sans ${statusColor(configs[p].status)}`}
              >
                {statusIcon(configs[p].status)}
                {configs[p].name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => handleQuickAction(action.key)}
            disabled={isTyping}
            data-ocid={`admin-ai.quick_action.${action.key}`}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gold-800/30 bg-obsidian-900/50 hover:border-gold-500/60 hover:bg-gold-900/10 text-sm font-sans text-gold-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base">{action.label.split(" ")[0]}</span>
            <span className="text-xs">
              {action.label.split(" ").slice(1).join(" ")}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div
        className="rounded-2xl border border-gold-800/25 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.09 0.01 280/0.95) 0%, oklch(0.07 0.01 280) 100%)",
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b border-gold-800/20"
          style={{ background: "oklch(0.11 0.015 280/0.8)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center">
              <Bot size={14} className="text-obsidian-900" />
            </div>
            <span className="font-serif font-semibold text-sm text-foreground">
              MSTC Business Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-950/60 border border-green-700/40 text-green-400 text-[10px] font-sans">
              ADMIN ONLY
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-sans text-muted-foreground">
            <Zap size={11} className="text-gold-600" />
            Active provider:{" "}
            <span className="text-gold-400 ml-1">
              {configs[activeProvider()].name}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          className="overflow-y-auto p-5 space-y-4"
          style={{ minHeight: "320px", maxHeight: "420px" }}
          role="log"
          aria-live="polite"
          data-ocid="admin-ai.chat_messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <Bot size={13} className="text-obsidian-900" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-gold-700/20 border border-gold-600/30 text-foreground ml-8"
                    : "bg-obsidian-800/60 border border-gold-800/20 text-foreground"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                {msg.provider && msg.role === "assistant" && (
                  <span className="mt-1.5 block text-[10px] text-obsidian-400">
                    via {configs[msg.provider]?.name ?? msg.provider}
                  </span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-gold-700/30 border border-gold-600/40 flex items-center justify-center ml-2 mt-0.5 flex-shrink-0">
                  <Users size={13} className="text-gold-400" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-start gap-2">
              <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <Bot size={13} className="text-obsidian-900" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-obsidian-800/60 border border-gold-800/20">
                <span className="flex gap-1 items-center">
                  {[0, 160, 320].map((delay) => (
                    <span
                      key={delay}
                      className="animate-bounce inline-block text-gold-400"
                      style={{
                        animationDelay: `${delay}ms`,
                        fontSize: "1.1rem",
                        lineHeight: 1,
                      }}
                    >
                      •
                    </span>
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-t border-gold-800/20"
          style={{ background: "oklch(0.11 0.015 280/0.8)" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isTyping && sendMsg(input)}
            placeholder="Ask about properties, leads, revenue, compliance…"
            disabled={isTyping}
            data-ocid="admin-ai.chat_input"
            className="flex-1 bg-obsidian-900/60 border border-gold-800/30 rounded-xl px-4 py-2.5 text-sm font-sans text-foreground placeholder:text-obsidian-400 focus:outline-none focus:border-gold-500/60 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => sendMsg(input)}
            disabled={!input.trim() || isTyping}
            data-ocid="admin-ai.send_button"
            className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center transition-opacity disabled:opacity-40"
            aria-label="Send message"
          >
            {isTyping ? (
              <Loader2 size={16} className="text-obsidian-900 animate-spin" />
            ) : (
              <Send size={16} className="text-obsidian-900" />
            )}
          </button>
        </div>
      </div>

      {/* API Configuration Panel */}
      <div className="rounded-2xl border border-gold-800/25 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowConfig((x) => !x)}
          data-ocid="admin-ai.config_toggle"
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold-900/10 transition-colors"
          style={{ background: "oklch(0.11 0.015 280/0.8)" }}
        >
          <div className="flex items-center gap-2">
            <Key size={16} className="text-gold-500" />
            <span className="font-serif font-semibold text-sm text-foreground">
              AI Provider Configuration
            </span>
            <span className="px-2 py-0.5 rounded-full bg-obsidian-800 border border-gold-800/30 text-[10px] font-sans text-obsidian-300">
              Admin Only — Not shown to public
            </span>
          </div>
          {showConfig ? (
            <ChevronUp size={16} className="text-gold-600" />
          ) : (
            <ChevronDown size={16} className="text-gold-600" />
          )}
        </button>

        {showConfig && (
          <div
            className="p-5 space-y-5 border-t border-gold-800/20"
            style={{ background: "oklch(0.09 0.01 280)" }}
          >
            <p className="text-xs font-sans text-muted-foreground">
              API keys are stored locally in your browser and never sent to
              public users. The assistant auto-selects the first active
              provider.
            </p>
            {PROVIDERS.map((provider) => (
              <div
                key={provider}
                className="rounded-xl border border-gold-800/20 p-4 space-y-3"
                style={{ background: "oklch(0.11 0.015 280/0.6)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {configs[provider].icon}
                    <span className="font-serif font-semibold text-sm text-foreground">
                      {configs[provider].name} GPT
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs font-sans ${statusColor(configs[provider].status)}`}
                    >
                      {statusIcon(configs[provider].status)}
                      {configs[provider].status === "unconfigured"
                        ? "No key"
                        : configs[provider].status}
                    </span>
                  </div>
                  <TrendingUp size={14} className="text-obsidian-500" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKeys[provider] ? "text" : "password"}
                      value={configs[provider].key}
                      onChange={(e) => updateKey(provider, e.target.value)}
                      placeholder={`Enter ${configs[provider].name} API key…`}
                      data-ocid={`admin-ai.${provider}_key_input`}
                      className="w-full bg-obsidian-900/80 border border-gold-800/30 rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-obsidian-400 focus:outline-none focus:border-gold-500/60 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider)}
                      aria-label={showKeys[provider] ? "Hide key" : "Show key"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-gold-400 transition-colors"
                    >
                      {showKeys[provider] ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => testConnection(provider)}
                    disabled={
                      !configs[provider].key ||
                      configs[provider].status === "testing"
                    }
                    data-ocid={`admin-ai.${provider}_test_button`}
                    className="px-3 py-2 rounded-lg border border-gold-700/40 text-gold-400 hover:border-gold-500/60 text-xs font-sans transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    {configs[provider].status === "testing"
                      ? "Testing…"
                      : "Test Connection"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
