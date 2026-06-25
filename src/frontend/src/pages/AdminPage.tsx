import AIActivityBar from "@/components/AIActivityBar";
import AINetworkStats from "@/components/AINetworkStats";
import AdminAICommandCenterTab from "@/components/AdminAICommandCenterTab";
import AdminAIManagerTab from "@/components/AdminAIManagerTab";
import AdminAINetworkMap from "@/components/AdminAINetworkMap";
import AdminAIStaffDirectory from "@/components/AdminAIStaffDirectory";
import AdminAgentBrowserTab from "@/components/AdminAgentBrowserTab";
import AdminAgentsConfigTab from "@/components/AdminAgentsConfigTab";
import AdminAnnouncementsTab from "@/components/AdminAnnouncementsTab";
import AdminAutomationCenterTab from "@/components/AdminAutomationCenterTab";
import AdminContinuousImprovementTab from "@/components/AdminContinuousImprovementTab";
import AdminDashboardAIAssistant from "@/components/AdminDashboardAIAssistant";
import AdminDashboardEnhancerTab from "@/components/AdminDashboardEnhancerTab";
import AdminDashboardToolsTab from "@/components/AdminDashboardToolsTab";
import AdminExpansionHubTab from "@/components/AdminExpansionHubTab";
import AdminFeatureSuggestionsTab from "@/components/AdminFeatureSuggestionsTab";
import AdminGodTierTab from "@/components/AdminGodTierTab";
import AdminKnowledgeCenterTab from "@/components/AdminKnowledgeCenterTab";
import AdminLeadCoordinationTab from "@/components/AdminLeadCoordinationTab";
import AdminLearningCenterTab from "@/components/AdminLearningCenterTab";
import AdminLegalFormsTab from "@/components/AdminLegalFormsTab";
import AdminLocalityIntelligenceTab from "@/components/AdminLocalityIntelligenceTab";
import AdminMarketDataTab from "@/components/AdminMarketDataTab";
import AdminNeuralLabTab from "@/components/AdminNeuralLabTab";
import AdminNeuralVisualizerTab from "@/components/AdminNeuralVisualizerTab";
import AdminNewClustersTab from "@/components/AdminNewClustersTab";
import AdminQualitySecurityTab from "@/components/AdminQualitySecurityTab";
import AdminRemindersTab from "@/components/AdminRemindersTab";
import AdminSecurityTab from "@/components/AdminSecurityTab";
import AdminSegmentIntelligenceTab from "@/components/AdminSegmentIntelligenceTab";
import AdminSidebar from "@/components/AdminSidebar";
import AdminStaffManagementTab from "@/components/AdminStaffManagementTab";
import AdminTutorialManagerTab from "@/components/AdminTutorialManagerTab";
import {
  useMarkAllRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/useNotificationQueries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Folder,
  FolderOpen,
  Grid3x3,
  LogOut,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Printer,
  Search,
  Settings,
  Shield,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createActor } from "../backend";
import type {
  PropertyListing as BackendPropertyListing,
  CallbackRequest,
  Feedback,
  MoreInfoRequest,
  PropertyEnquiry,
  QuoteRequest,
  ServiceSubmission,
  SupportForm,
} from "../backend";
import type { LeadQualification } from "../backend";
import { AnalyticsTab } from "../components/AdminAnalyticsTab";
import { ArtistManagementTab } from "../components/AdminArtistManagementTab";
import { CSRManagementTab } from "../components/AdminCSRTab";
import { EventBookingsTab } from "../components/AdminEventBookingsTab";
import { LeadPipelineTab } from "../components/AdminLeadPipelineTab";
import { WatchlistAlertsTab } from "../components/AdminWatchlistAlertsTab";
import {
  ImportGuide,
  ImportPropertiesModal,
} from "../components/ImportPropertiesModal";
import { useActor } from "../hooks/useActor";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  useCallbackRequests,
  useDeleteCallback,
  useDeleteFeedback,
  useDeleteMoreInfo,
  useDeleteQuote,
  useDeleteSupport,
  useFeedback,
  useFormStats,
  useMarkCallbackRead,
  useMarkFeedbackRead,
  useMarkMoreInfoRead,
  useMarkQuoteRead,
  useMarkSupportRead,
  useMoreInfoRequests,
  useQuoteRequests,
  useSupportForms,
} from "../hooks/useFormQueries";
import {
  LEAD_STAGES,
  useMarkContacted,
  useNewEnquiryCount,
  usePropertyEnquiries,
  useUpdateEnquiryStatus,
  useUpdateLeadStage,
} from "../hooks/usePropertyEnquiryQueries";
import {
  useAddProperty,
  useBulkAddProperties,
  useDeleteProperty,
  useGetPropertyCount,
  usePropertiesForAdmin,
  useUpdateProperty,
} from "../hooks/usePropertyQueries";
import {
  useAllInteractions,
  useClearAllInteractions,
  useDeleteInteraction,
  useInteractionStats,
  useInteractions,
  useSearchInteractions,
} from "../hooks/useQueries";
import {
  useDeleteReferral,
  useGetAllReferrals,
} from "../hooks/useReferralQueries";
import type { ReferralRecord } from "../hooks/useReferralQueries";
import type { ChatInteraction } from "../types/chat";

const CHAT_PAGE_SIZE = 20;
type TabId =
  | "overview"
  | "chatbot"
  | "feedback"
  | "requests"
  | "support"
  | "byservice"
  | "legaldocs"
  | "propertyenquiries"
  | "manageproperties"
  | "analytics"
  | "pipeline"
  | "leadqualifications"
  | "referrals"
  | "eventbookings"
  | "watchlistalerts"
  | "csrmanagement"
  | "artistmanagement"
  | "settings"
  | "team"
  | "tools"
  | "legalforms"
  | "blog"
  | "partners"
  | "announcements"
  | "reminders"
  | "agents"
  | "ai-manager"
  | "dashboard-enhancer"
  | "security"
  | "feature-suggestions"
  | "admin-ai"
  | "market-data"
  | "lead-coordination"
  | "ai-god-tier"
  | "ai-agent-browser"
  | "ai-localities"
  | "ai-segments"
  | "ai-neural"
  | "ai-automation"
  | "ai-expansion"
  | "ai-quality"
  | "ai-knowledge"
  | "ai-continuous"
  | "ai-command-center"
  | "new-clusters"
  | "ai-staff-directory"
  | "ai-network-map"
  | "ai-neural-lab"
  | "ai-learning-center"
  | "tutorial-manager";

// ── Shared helpers ─────────────────────────────────────────────────────────────

function fmt(ts: bigint | string | number) {
  const n = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(n).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isRead
          ? "bg-muted/30 text-muted-foreground border border-border"
          : "bg-gold-700/20 text-gold-300 border border-gold-700/40"
      }`}
    >
      {isRead ? "Read" : "Unread"}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const lower = sentiment.toLowerCase();
  if (lower === "positive")
    return <span className="sentiment-badge sentiment-positive">Positive</span>;
  if (lower === "needs_attention" || lower === "needs attention")
    return (
      <span className="sentiment-badge sentiment-attention">
        Needs Attention
      </span>
    );
  return <span className="sentiment-badge sentiment-neutral">Neutral</span>;
}

function StatCard({
  label,
  value,
  sub,
}: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="admin-stats-card">
      <span className="admin-stats-label">{label}</span>
      <span className="admin-stats-value">{value}</span>
      {sub && <span className="admin-stats-meta">{sub}</span>}
    </div>
  );
}

function ExpandableText({
  text,
  maxLen = 80,
}: { text: string; maxLen?: number }) {
  const [open, setOpen] = useState(false);
  if (text.length <= maxLen) return <span>{text}</span>;
  return (
    <span>
      {open ? text : `${text.slice(0, maxLen)}…`}{" "}
      <button
        type="button"
        className="text-gold-400 hover:text-gold-300 text-xs underline underline-offset-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((x) => !x);
        }}
      >
        {open ? "less" : "more"}
      </button>
    </span>
  );
}

// ── Session Re-Login Form ────────────────────────────────────────────────────────

function SessionReLoginForm({
  onSuccess,
  onLogout,
}: { onSuccess: () => void; onLogout: () => void }) {
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === "Lovemstc@2019") {
      setPw("");
      setError("");
      onSuccess();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-medium text-gold-400 tracking-wider uppercase"
          htmlFor="session-pw"
        >
          Re-enter Password
        </label>
        <div className="relative">
          <input
            id="session-pw"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2.5 pr-10 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500"
            data-ocid="admin.session_timeout.password_input"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold-400 transition-colors"
            onClick={() => setShowPw((x) => !x)}
            aria-label={showPw ? "Hide" : "Show"}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && (
        <p
          className="text-destructive text-sm text-center"
          data-ocid="admin.session_timeout.error_state"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        className="w-full py-3 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity"
        data-ocid="admin.session_timeout.submit_button"
      >
        Continue Session
      </button>
      <button
        type="button"
        onClick={onLogout}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="admin.session_timeout.logout_button"
      >
        Log out instead
      </button>
    </form>
  );
}

// ── Login screen ───────────────────────────────────────────────────────────────

function AdminLogin() {
  const {
    loginWithPassword,
    loginWithBiometric,
    sendOTP,
    verifyOTP,
    firstLoginDone,
    biometricAvailable,
  } = useAdminAuth();

  const [loginState, setLoginState] = useState<"password" | "choice" | "otp">(
    "password",
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP countdown
  useEffect(() => {
    if (loginState !== "otp") return;
    if (otpTimer <= 0) return;
    const t = setInterval(() => setOtpTimer((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [loginState, otpTimer]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = loginWithPassword(username, password);
    if (!result.ok) {
      setError(result.reason ?? "Invalid credentials.");
      return;
    }
    // Successful password login — if first login done, offer choice next time
    if (firstLoginDone && biometricAvailable) {
      // already logged in via loginWithPassword which calls markSuccessfulLogin
    }
  }

  async function handleBiometricLogin() {
    setLoading(true);
    setError("");
    const result = await loginWithBiometric();
    setLoading(false);
    if (!result.ok) setError(result.reason ?? "Biometric failed.");
  }

  function handleSendOTP() {
    setError("");
    const result = sendOTP();
    if (!result.ok) {
      setError(result.reason ?? "Could not send OTP.");
      return;
    }
    // In real deployment OTP goes to registered mobile; shown here for owner use
    setOtpTimer(120);
    setOtpDigits(["", "", "", ""]);
    setLoginState("otp");
  }

  function handleOtpInput(idx: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    if (val && idx < 3) otpRefs[idx + 1]?.current?.focus();
  }

  function handleOtpKeyDown(
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0)
      otpRefs[idx - 1]?.current?.focus();
  }

  function handleVerifyOTP() {
    const code = otpDigits.join("");
    const result = verifyOTP("", code);
    if (!result.ok) setError(result.reason ?? "Invalid OTP.");
  }

  const header = (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield size={28} className="text-gold-400" />
      </div>
      <div className="font-serif font-bold text-2xl gold-text tracking-widest mb-0.5">
        MSTC GLOBAL
      </div>
      <div className="text-xs text-gold-500 tracking-[0.3em] uppercase mb-5">
        Admin Portal
      </div>
      <h1 className="font-serif text-xl text-foreground">Staff Login</h1>
    </div>
  );

  // Screen 1 — ID + Password (always first)
  if (loginState === "password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-900 px-4">
        <div
          className="w-full max-w-sm rounded-2xl border border-gold-700/40 bg-card p-8 shadow-2xl"
          data-ocid="admin.login_card"
        >
          {header}
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium text-gold-400 tracking-wider uppercase"
                htmlFor="admin-id"
              >
                Admin ID
              </label>
              <input
                id="admin-id"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2.5 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500 placeholder:text-muted-foreground/50"
                placeholder="love@mstc"
                data-ocid="admin.id_input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium text-gold-400 tracking-wider uppercase"
                htmlFor="admin-pw"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-pw"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground text-sm focus:outline-none focus:border-gold-500"
                  data-ocid="admin.password_input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold-400 transition-colors"
                  onClick={() => setShowPassword((x) => !x)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your password is hidden for security
              </p>
            </div>
            {error && (
              <p
                className="text-destructive text-sm text-center"
                data-ocid="admin.login.error_state"
              >
                {error}
              </p>
            )}
            <p className="text-xs italic text-gold-500/70 text-center -mb-1">
              This login is for authorized staff only.
            </p>
            <button
              type="submit"
              className="w-full py-3 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity mt-1"
              data-ocid="admin.login.submit_button"
            >
              Login
            </button>
            {firstLoginDone && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setLoginState("choice");
                }}
                className="text-xs text-gold-500 hover:text-gold-300 transition-colors text-center mt-1"
                data-ocid="admin.other_methods_button"
              >
                Other login methods
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Screen 2 — Choose method (biometric or OTP)
  if (loginState === "choice") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-900 px-4">
        <div
          className="w-full max-w-sm rounded-2xl border border-gold-700/40 bg-card p-8 shadow-2xl"
          data-ocid="admin.choice_card"
        >
          {header}
          <div className="flex flex-col gap-4">
            {biometricAvailable && (
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={loading}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-lg border border-gold-700/40 bg-obsidian-900 text-gold-300 text-sm font-medium hover:bg-gold-700/10 transition-colors disabled:opacity-50"
                data-ocid="admin.biometric_button"
              >
                <span className="text-lg">&#128422;</span>{" "}
                {loading ? "Verifying…" : "Login with Fingerprint"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full py-3 flex items-center justify-center gap-2 rounded-lg border border-gold-700/40 bg-obsidian-900 text-gold-300 text-sm font-medium hover:bg-gold-700/10 transition-colors"
              data-ocid="admin.otp_button"
            >
              <span className="text-lg">&#128241;</span> Login with Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setLoginState("password");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              data-ocid="admin.back_to_password_button"
            >
              Back to ID + Password
            </button>
            {error && (
              <p
                className="text-destructive text-sm text-center"
                data-ocid="admin.choice.error_state"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Screen 3 — OTP entry
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-900 px-4">
      <div
        className="w-full max-w-sm rounded-2xl border border-gold-700/40 bg-card p-8 shadow-2xl"
        data-ocid="admin.otp_card"
      >
        {header}
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground text-center">
            Enter the 4-digit OTP sent to your registered mobile number.
          </p>
          <div className="flex gap-3 justify-center">
            {([0, 1, 2, 3] as const).map((pos) => (
              <input
                key={`otp-pos-${pos}`}
                ref={otpRefs[pos]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpDigits[pos]}
                onChange={(e) => handleOtpInput(pos, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(pos, e)}
                className="w-12 h-14 text-center text-xl rounded-lg bg-obsidian-900 border border-gold-700/40 text-foreground focus:outline-none focus:border-gold-500"
                data-ocid={`admin.otp.digit_${pos + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {otpTimer > 0 ? `OTP expires in ${otpTimer}s` : "OTP expired"}
          </p>
          {error && (
            <p
              className="text-destructive text-sm text-center"
              data-ocid="admin.otp.error_state"
            >
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={otpDigits.join("").length < 4 || otpTimer <= 0}
            className="w-full py-3 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            data-ocid="admin.otp.verify_button"
          >
            Verify OTP
          </button>
          {otpTimer <= 0 && (
            <button
              type="button"
              onClick={handleSendOTP}
              className="text-xs text-gold-500 hover:text-gold-300 transition-colors text-center"
              data-ocid="admin.otp.resend_button"
            >
              Resend OTP
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setError("");
              setLoginState("choice");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
            data-ocid="admin.otp.back_button"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────────────────

function OverviewTab() {
  const stats = useInteractionStats();
  const formStats = useFormStats();
  const enquiryCountQuery = useNewEnquiryCount();
  const totalEnquiryQuery = usePropertyEnquiries();
  const s = stats.data;
  const f = formStats.data;
  const totalEnquiries = totalEnquiryQuery.data?.length ?? 0;
  const newEnquiries = Number(enquiryCountQuery.data ?? BigInt(0));

  const totalRequests = f
    ? Number(f.totalCallbacks) + Number(f.totalQuotes) + Number(f.totalMoreInfo)
    : 0;
  const todayRequests = f
    ? Number(f.todayCallbacks) + Number(f.todayQuotes)
    : 0;
  const unreadRequests = f
    ? Number(f.unreadCallbacks) +
      Number(f.unreadQuotes) +
      Number(f.unreadMoreInfo)
    : 0;

  return (
    <div className="space-y-8">
      {/* All Apps quick-access banner */}
      <div
        className="flex items-center justify-between gap-4 rounded-xl border border-gold-700/40 bg-gold-700/10 px-5 py-4"
        data-ocid="overview.all_apps.section"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-700/20 border border-gold-700/40">
            <Grid3x3 size={20} className="text-gold-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gold-300">App Launcher</p>
            <p className="text-xs text-muted-foreground">
              Browse and access all 50+ MSTC apps
            </p>
          </div>
        </div>
        <a
          href="/apps"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#c9a84c] hover:bg-[#dbb95e] text-[#06090f] font-bold text-sm transition-colors shadow-lg"
          data-ocid="overview.all_apps_button"
        >
          <Grid3x3 size={16} />
          All Apps
        </a>
      </div>

      {/* Totals */}
      <div>
        <h3 className="text-sm font-medium text-gold-400 tracking-wider uppercase mb-3">
          Total
        </h3>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="overview.totals.section"
        >
          <StatCard
            label="Total Chats"
            value={s ? Number(s.total).toLocaleString() : "—"}
            sub="AI bot interactions"
          />
          <StatCard
            label="Total Feedback"
            value={f ? Number(f.totalFeedback).toLocaleString() : "—"}
            sub="Page ratings"
          />
          <StatCard
            label="Total Requests"
            value={totalRequests.toLocaleString() || "—"}
            sub="Callbacks + Quotes + More Info"
          />
          <StatCard
            label="Total Support"
            value={f ? Number(f.totalSupport).toLocaleString() : "—"}
            sub="Contact forms"
          />
          <StatCard
            label="Property Enquiries"
            value={totalEnquiries.toLocaleString()}
            sub={newEnquiries > 0 ? `${newEnquiries} new` : "All handled"}
          />
        </div>
      </div>

      {/* Today */}
      <div>
        <h3 className="text-sm font-medium text-gold-400 tracking-wider uppercase mb-3">
          Today
        </h3>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="overview.today.section"
        >
          <StatCard
            label="Chats Today"
            value={s ? Number(s.todayCount).toLocaleString() : "—"}
          />
          <StatCard
            label="Feedback Today"
            value={f ? Number(f.todayFeedback).toLocaleString() : "—"}
          />
          <StatCard
            label="Requests Today"
            value={todayRequests.toLocaleString() || "—"}
          />
          <StatCard
            label="Support Today"
            value={f ? Number(f.todaySupport).toLocaleString() : "—"}
          />
        </div>
      </div>

      {/* Unread */}
      <div>
        <h3 className="text-sm font-medium text-gold-400 tracking-wider uppercase mb-3">
          Unread
        </h3>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="overview.unread.section"
        >
          <StatCard
            label="Needs Attention"
            value={s ? Number(s.needsAttentionCount).toLocaleString() : "—"}
            sub="Low-confidence chats"
          />
          <StatCard
            label="Unread Feedback"
            value={f ? Number(f.unreadFeedback).toLocaleString() : "—"}
          />
          <StatCard
            label="Unread Requests"
            value={unreadRequests.toLocaleString() || "—"}
          />
          <StatCard
            label="Unread Support"
            value={f ? Number(f.unreadSupport).toLocaleString() : "—"}
          />
        </div>
      </div>
    </div>
  );
}

// ── Chatbot Tab ─────────────────────────────────────────────────────────────────

function ChatRow({
  row,
  index,
  onDelete,
}: { row: ChatInteraction; index: number; onDelete: (id: bigint) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <tr
      className="cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && setExpanded((ex) => !ex)
      }
      tabIndex={0}
      data-ocid={`chatbot.table.item.${index + 1}`}
    >
      <td className="text-muted-foreground text-sm">{Number(row.id)}</td>
      <td className="text-sm whitespace-nowrap">{fmt(row.timestamp)}</td>
      <td>
        <p className={expanded ? "" : "line-clamp-2"}>{row.userMessage}</p>
      </td>
      <td>
        <p className={expanded ? "" : "line-clamp-2"}>{row.botResponse}</p>
      </td>
      <td>
        <SentimentBadge sentiment={row.sentimentTag} />
      </td>
      <td
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded hover:bg-muted/20 text-muted-foreground transition-colors"
            aria-label="Toggle expand"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((x) => !x);
            }}
            data-ocid={`chatbot.edit_button.${index + 1}`}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
            aria-label="Delete interaction"
            onClick={() => {
              if (confirm("Delete this interaction?")) onDelete(row.id);
            }}
            data-ocid={`chatbot.delete_button.${index + 1}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ChatbotTab() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [csvExportEnabled, setCsvExportEnabled] = useState(false);

  const statsQuery = useInteractionStats();
  const interactionsQuery = useInteractions(
    page * CHAT_PAGE_SIZE,
    CHAT_PAGE_SIZE,
  );
  const searchQuery = useSearchInteractions(search, 0, 100);
  const allQuery = useAllInteractions(csvExportEnabled);
  const deleteM = useDeleteInteraction();
  const clearM = useClearAllInteractions();

  const rows: ChatInteraction[] = useMemo(() => {
    if (search.trim()) return searchQuery.data ?? [];
    return interactionsQuery.data ?? [];
  }, [search, searchQuery.data, interactionsQuery.data]);

  const totalCount = statsQuery.data ? Number(statsQuery.data.total) : 0;
  const totalPages = Math.ceil(totalCount / CHAT_PAGE_SIZE) || 1;

  function exportCSV(interactions: ChatInteraction[]) {
    const header = "ID,Timestamp,UserMessage,BotResponse,Sentiment\n";
    const csvRows = interactions.map((r) => {
      const ts = new Date(Number(r.timestamp) / 1_000_000).toISOString();
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      return [
        Number(r.id),
        ts,
        esc(r.userMessage),
        esc(r.botResponse),
        r.sentimentTag,
      ].join(",");
    });
    const blob = new Blob([header + csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mstc-chatbot-interactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Trigger export when data arrives
  if (csvExportEnabled && allQuery.data && !allQuery.isLoading) {
    exportCSV(allQuery.data);
    setCsvExportEnabled(false);
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search interactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            data-ocid="chatbot.search_input"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
          onClick={() => {
            if (allQuery.data) exportCSV(allQuery.data);
            else setCsvExportEnabled(true);
          }}
          disabled={csvExportEnabled && allQuery.isLoading}
          data-ocid="chatbot.export_button"
        >
          <Download size={16} />
          {csvExportEnabled && allQuery.isLoading ? "Fetching…" : "Export CSV"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
          onClick={() => setConfirmClear(true)}
          data-ocid="chatbot.clear_button"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      {/* Confirm clear */}
      {confirmClear && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          data-ocid="chatbot.dialog"
        >
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-serif text-foreground mb-2">
              Clear All Interactions?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              This will permanently delete all chat interactions. This cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/20 text-sm"
                onClick={() => setConfirmClear(false)}
                data-ocid="chatbot.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium"
                onClick={() => {
                  clearM.mutate();
                  setConfirmClear(false);
                }}
                data-ocid="chatbot.confirm_button"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {interactionsQuery.isLoading || searchQuery.isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="chatbot.loading_state"
          >
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="chatbot.empty_state"
          >
            No interactions found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>User Message</th>
                <th>Bot Response</th>
                <th>Sentiment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <ChatRow
                  key={String(row.id)}
                  row={row}
                  index={i}
                  onDelete={(id) => deleteM.mutate(id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!search.trim() && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted/20 transition-colors"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              data-ocid="chatbot.pagination_prev"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted/20 transition-colors"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              data-ocid="chatbot.pagination_next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feedback Tab ────────────────────────────────────────────────────────────────

function FeedbackTab() {
  const { data: items = [], isLoading } = useFeedback();
  const markRead = useMarkFeedbackRead();
  const deleteFb = useDeleteFeedback();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (f) =>
        f.comment.toLowerCase().includes(q) ||
        f.pageName.toLowerCase().includes(q),
    );
  }, [items, search]);

  function stars(rating: bigint) {
    const n = Number(rating);
    return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search feedback…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
          data-ocid="feedback.search_input"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="feedback.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="feedback.empty_state"
          >
            No feedback yet.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Comment</th>
                <th>Page</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f: Feedback, i) => (
                <tr key={f.id} data-ocid={`feedback.table.item.${i + 1}`}>
                  <td>
                    <span className="text-gold-400 text-sm font-mono tracking-tight">
                      {stars(f.rating)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {Number(f.rating)}/5
                    </span>
                  </td>
                  <td>
                    <ExpandableText text={f.comment || "(no comment)"} />
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground">
                      {f.pageName}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(f.timestamp)}
                    </span>
                  </td>
                  <td>
                    <ReadBadge isRead={f.isRead} />
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-primary/10 text-primary transition-colors text-xs"
                        onClick={() =>
                          markRead.mutate({ id: f.id, isRead: !f.isRead })
                        }
                        aria-label="Toggle read"
                        data-ocid={`feedback.toggle_button.${i + 1}`}
                      >
                        {f.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                        onClick={() => {
                          if (confirm("Delete?")) deleteFb.mutate(f.id);
                        }}
                        aria-label="Delete"
                        data-ocid={`feedback.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Requests Tab ────────────────────────────────────────────────────────────────

type RequestType = "all" | "callback" | "quote" | "moreinfo";

type MergedRequest =
  | ({ _type: "callback" } & CallbackRequest)
  | ({ _type: "quote" } & QuoteRequest)
  | ({ _type: "moreinfo" } & MoreInfoRequest);

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    callback: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    quote: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    moreinfo: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  };
  const labels: Record<string, string> = {
    callback: "Callback",
    quote: "Quote",
    moreinfo: "More Info",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[type] ?? "bg-muted/20 text-foreground border-border"}`}
    >
      {labels[type] ?? type}
    </span>
  );
}

function RequestsTab() {
  const { data: callbacks = [], isLoading: lCb } = useCallbackRequests();
  const { data: quotes = [], isLoading: lQt } = useQuoteRequests();
  const { data: moreInfos = [], isLoading: lMi } = useMoreInfoRequests();
  const markCb = useMarkCallbackRead();
  const markQt = useMarkQuoteRead();
  const markMi = useMarkMoreInfoRead();
  const deleteCb = useDeleteCallback();
  const deleteQt = useDeleteQuote();
  const deleteMi = useDeleteMoreInfo();
  const [filter, setFilter] = useState<RequestType>("all");
  const [search, setSearch] = useState("");

  const merged: MergedRequest[] = useMemo(() => {
    const cb: MergedRequest[] = callbacks.map((r) => ({
      ...r,
      _type: "callback" as const,
    }));
    const qt: MergedRequest[] = quotes.map((r) => ({
      ...r,
      _type: "quote" as const,
    }));
    const mi: MergedRequest[] = moreInfos.map((r) => ({
      ...r,
      _type: "moreinfo" as const,
    }));
    return [...cb, ...qt, ...mi].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp),
    );
  }, [callbacks, quotes, moreInfos]);

  const filtered = useMemo(() => {
    let arr =
      filter === "all" ? merged : merged.filter((r) => r._type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          ("phone" in r ? r.phone : "").toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q),
      );
    }
    return arr;
  }, [merged, filter, search]);

  const isLoading = lCb || lQt || lMi;

  function toggleRead(r: MergedRequest) {
    const vars = { id: r.id, isRead: !r.isRead };
    if (r._type === "callback") markCb.mutate(vars);
    else if (r._type === "quote") markQt.mutate(vars);
    else markMi.mutate(vars);
  }
  function deleteRow(r: MergedRequest) {
    if (!confirm("Delete?")) return;
    if (r._type === "callback") deleteCb.mutate(r.id);
    else if (r._type === "quote") deleteQt.mutate(r.id);
    else deleteMi.mutate(r.id);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["all", "callback", "quote", "moreinfo"] as RequestType[]).map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  filter === t
                    ? "border-gold-500/60 bg-gold-700/20 text-gold-300"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40"
                }`}
                data-ocid={`requests.filter.${t}.tab`}
              >
                {t === "all"
                  ? "All"
                  : t === "callback"
                    ? "Callback"
                    : t === "quote"
                      ? "Quote"
                      : "More Info"}
              </button>
            ),
          )}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            data-ocid="requests.search_input"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="requests.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="requests.empty_state"
          >
            No requests found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Details</th>
                <th>Page</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const contact =
                  "phone" in r ? r.phone : "email" in r ? r.email : "";
                const details =
                  "message" in r
                    ? r.message
                    : "question" in r
                      ? r.question
                      : "";
                return (
                  <tr
                    key={`${r._type}-${r.id}`}
                    data-ocid={`requests.table.item.${i + 1}`}
                  >
                    <td>
                      <TypeBadge type={r._type} />
                    </td>
                    <td className="font-medium text-sm">{r.name}</td>
                    <td className="text-sm text-muted-foreground">{contact}</td>
                    <td className="text-xs text-muted-foreground">
                      {r.service}
                    </td>
                    <td>
                      <ExpandableText text={details || "—"} />
                    </td>
                    <td>
                      <span className="text-xs text-muted-foreground">
                        {r.pageName}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {fmt(r.timestamp)}
                      </span>
                    </td>
                    <td>
                      <ReadBadge isRead={r.isRead} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-primary/10 text-primary transition-colors"
                          onClick={() => toggleRead(r)}
                          aria-label="Toggle read"
                          data-ocid={`requests.toggle_button.${i + 1}`}
                        >
                          {r.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                          onClick={() => deleteRow(r)}
                          aria-label="Delete"
                          data-ocid={`requests.delete_button.${i + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Support Tab ─────────────────────────────────────────────────────────────────

function SupportTab() {
  const { data: items = [], isLoading } = useSupportForms();
  const markRead = useMarkSupportRead();
  const deleteS = useDeleteSupport();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (s: SupportForm) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.service.toLowerCase().includes(q),
    );
  }, [items, search]);

  return (
    <div className="space-y-5">
      <div className="relative max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search support forms…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
          data-ocid="support.search_input"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="support.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="support.empty_state"
          >
            No support forms yet.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Service</th>
                <th>Message</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: SupportForm, i) => (
                <tr key={s.id} data-ocid={`support.table.item.${i + 1}`}>
                  <td className="font-medium text-sm">{s.name}</td>
                  <td className="text-sm text-muted-foreground">{s.phone}</td>
                  <td className="text-sm text-muted-foreground">{s.email}</td>
                  <td className="text-xs text-muted-foreground">{s.service}</td>
                  <td>
                    <ExpandableText text={s.message} />
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(s.timestamp)}
                    </span>
                  </td>
                  <td>
                    <ReadBadge isRead={s.isRead} />
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-primary/10 text-primary transition-colors"
                        onClick={() =>
                          markRead.mutate({ id: s.id, isRead: !s.isRead })
                        }
                        aria-label="Toggle read"
                        data-ocid={`support.toggle_button.${i + 1}`}
                      >
                        {s.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                        onClick={() => {
                          if (confirm("Delete?")) deleteS.mutate(s.id);
                        }}
                        aria-label="Delete"
                        data-ocid={`support.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── By Service Tab ──────────────────────────────────────────────────────────────

const SERVICE_FOLDERS = [
  { key: "infrastructure", label: "Infrastructure & Property" },
  { key: "rera", label: "RERA & PR Consulting" },
  { key: "purchase", label: "Purchase / Rent / Redevelopment" },
  { key: "finance", label: "Finance & Investment" },
  { key: "music", label: "Music & Cultural" },
  { key: "hospitality", label: "Hospitality & Events" },
  { key: "ngo", label: "NGO & CSR" },
  { key: "media", label: "Media & Tourism" },
];

function useLeadQualifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LeadQualification[]>({
    queryKey: ["leadQualifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeadQualifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

// ── Lead Qualifications Tab ──────────────────────────────────────────────────────────────────

function LeadScoreBadge({ score }: { score: string }) {
  const lower = score.toLowerCase();
  if (lower === "hot")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-600/20 text-red-300 border border-red-600/40">
        🔥 Hot
      </span>
    );
  if (lower === "warm")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-600/20 text-orange-300 border border-orange-600/40">
        ☀️ Warm
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-muted/20 text-muted-foreground border border-border">
      ❄️ Cold
    </span>
  );
}

function LeadQualificationsTab() {
  const { data: leads = [], isLoading } = useLeadQualifications();
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  const filtered = useMemo(() => {
    let arr = leads;
    if (scoreFilter !== "all") {
      arr = arr.filter(
        (l) => l.leadScore.toLowerCase() === scoreFilter.toLowerCase(),
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (l) =>
          l.budget.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.propertyType.toLowerCase().includes(q) ||
          l.sessionId.toLowerCase().includes(q),
      );
    }
    return [...arr].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [leads, search, scoreFilter]);

  const hotCount = leads.filter(
    (l) => l.leadScore.toLowerCase() === "hot",
  ).length;
  const warmCount = leads.filter(
    (l) => l.leadScore.toLowerCase() === "warm",
  ).length;
  const coldCount = leads.filter(
    (l) => l.leadScore.toLowerCase() === "cold",
  ).length;

  function exportCSV() {
    const header =
      "ID,Session ID,Budget,Location,Property Type,Lead Score,Created At\n";
    const rows = filtered.map((l) => {
      const ts = new Date(Number(l.createdAt) / 1_000_000).toISOString();
      const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
      return [
        esc(l.id),
        esc(l.sessionId),
        esc(l.budget),
        esc(l.location),
        esc(l.propertyType),
        esc(l.leadScore),
        ts,
      ].join(",");
    });
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mstc-lead-qualifications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5" data-ocid="leadqualifications.section">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="admin-stats-card border-red-600/30">
          <span className="admin-stats-label">🔥 Hot Leads</span>
          <span className="admin-stats-value text-red-400">{hotCount}</span>
        </div>
        <div className="admin-stats-card border-orange-600/30">
          <span className="admin-stats-label">☀️ Warm Leads</span>
          <span className="admin-stats-value text-orange-400">{warmCount}</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">❄️ Cold Leads</span>
          <span className="admin-stats-value">{coldCount}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["all", "hot", "warm", "cold"] as const).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setScoreFilter(score)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                scoreFilter === score
                  ? "border-gold-500/60 bg-gold-700/20 text-gold-300"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40"
              }`}
              data-ocid={`leadqualifications.filter.${score}.tab`}
            >
              {score.charAt(0).toUpperCase() + score.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by budget, location, property type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            data-ocid="leadqualifications.search_input"
          />
        </div>
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
          data-ocid="leadqualifications.export_button"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="leadqualifications.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="leadqualifications.empty_state"
          >
            No lead qualifications yet.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Score</th>
                <th>Budget</th>
                <th>Location</th>
                <th>Property Type</th>
                <th>Session ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr
                  key={l.id}
                  data-ocid={`leadqualifications.table.item.${i + 1}`}
                >
                  <td>
                    <LeadScoreBadge score={l.leadScore} />
                  </td>
                  <td className="text-sm font-medium text-gold-300">
                    {l.budget || "—"}
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {l.location || "—"}
                  </td>
                  <td className="text-xs text-muted-foreground">
                    {l.propertyType || "—"}
                  </td>
                  <td>
                    <span className="font-mono text-xs text-muted-foreground">
                      {l.sessionId.slice(0, 12)}…
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(Number(l.createdAt) / 1_000_000).toLocaleString(
                        "en-IN",
                        { dateStyle: "medium", timeStyle: "short" },
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function useSubmissionsByService(serviceCategory: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ServiceSubmission[]>({
    queryKey: ["submissionsByService", serviceCategory],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubmissionsByService(serviceCategory);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

function useMarkSubmissionRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: bigint; isRead: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markSubmissionRead(vars.id, vars.isRead);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["submissionsByService"] });
      void vars;
    },
  });
}

function useDeleteSubmission() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSubmission(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissionsByService"] });
    },
  });
}

function ServiceFolder({
  folderKey,
  label,
}: { folderKey: string; label: string }) {
  const [open, setOpen] = useState(false);
  const { data: items = [], isLoading } = useSubmissionsByService(
    open ? folderKey : "",
  );
  const markRead = useMarkSubmissionRead();
  const deleteS = useDeleteSubmission();

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(var(--border))" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/10"
        style={{ background: "oklch(var(--card))" }}
        data-ocid={`byservice.${folderKey}.toggle`}
      >
        {open ? (
          <FolderOpen size={18} style={{ color: "oklch(var(--primary))" }} />
        ) : (
          <Folder size={18} style={{ color: "oklch(var(--primary))" }} />
        )}
        <span className="font-serif font-semibold text-foreground">
          {label}
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-sans"
          style={{
            background: "oklch(var(--primary) / 0.12)",
            color: "oklch(var(--primary))",
            border: "1px solid oklch(var(--primary) / 0.25)",
          }}
        >
          {isLoading && open ? "…" : open ? items.length : ""}
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {open && (
        <div
          className="divide-y"
          style={{
            borderTop: "1px solid oklch(var(--border))",
            background: "oklch(var(--background))",
          }}
        >
          {isLoading ? (
            <div
              className="px-5 py-6 text-sm text-muted-foreground"
              data-ocid={`byservice.${folderKey}.loading_state`}
            >
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div
              className="px-5 py-6 text-sm text-muted-foreground"
              data-ocid={`byservice.${folderKey}.empty_state`}
            >
              No submissions yet for this service.
            </div>
          ) : (
            items.map((sub: ServiceSubmission, i) => (
              <div
                key={String(sub.id)}
                className="px-5 py-4 space-y-3"
                style={{
                  background: sub.isRead
                    ? "transparent"
                    : "oklch(var(--primary) / 0.03)",
                }}
                data-ocid={`byservice.${folderKey}.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-semibold text-sm text-foreground truncate">
                        {sub.submitterName || "(unnamed)"}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-sans"
                        style={{
                          background: "oklch(var(--primary) / 0.1)",
                          color: "oklch(var(--primary))",
                          border: "1px solid oklch(var(--primary) / 0.2)",
                        }}
                      >
                        {sub.innerPage}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-sans"
                        style={{
                          background: "oklch(var(--muted) / 0.3)",
                          color: "oklch(var(--muted-foreground))",
                          border: "1px solid oklch(var(--border))",
                        }}
                      >
                        {sub.formType}
                      </span>
                      <ReadBadge isRead={sub.isRead} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      {sub.submitterPhone && (
                        <span className="font-sans text-xs text-muted-foreground">
                          📞 {sub.submitterPhone}
                        </span>
                      )}
                      {sub.submitterEmail && (
                        <span className="font-sans text-xs text-muted-foreground">
                          ✉️ {sub.submitterEmail}
                        </span>
                      )}
                      <span className="font-sans text-xs text-muted-foreground whitespace-nowrap">
                        {fmt(sub.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                      onClick={() =>
                        markRead.mutate({ id: sub.id, isRead: !sub.isRead })
                      }
                      aria-label="Toggle read"
                      data-ocid={`byservice.${folderKey}.toggle_button.${i + 1}`}
                    >
                      {sub.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                      onClick={() => {
                        if (confirm("Delete this submission?"))
                          deleteS.mutate(sub.id);
                      }}
                      aria-label="Delete"
                      data-ocid={`byservice.${folderKey}.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {sub.fields.length > 0 && (
                  <div
                    className="rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                    style={{
                      background: "oklch(var(--muted) / 0.2)",
                      border: "1px solid oklch(var(--border))",
                    }}
                  >
                    {sub.fields.map(([k, v]: [string, string]) =>
                      v ? (
                        <div key={k} className="flex flex-col gap-0.5">
                          <span
                            className="font-sans text-xs font-semibold"
                            style={{ color: "oklch(var(--muted-foreground))" }}
                          >
                            {k}
                          </span>
                          <span
                            className="font-sans text-xs"
                            style={{ color: "oklch(var(--foreground))" }}
                          >
                            {v}
                          </span>
                        </div>
                      ) : null,
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ByServiceTab() {
  return (
    <div className="space-y-4" data-ocid="byservice.section">
      <div className="flex items-center gap-2 mb-2">
        <Folder size={16} style={{ color: "oklch(var(--primary))" }} />
        <h3
          className="text-sm font-medium tracking-wider uppercase"
          style={{ color: "oklch(var(--primary))" }}
        >
          Submissions by Service
        </h3>
      </div>
      <p className="text-xs text-muted-foreground font-sans mb-4">
        Click a folder to expand and view all form submissions from that service
        division.
      </p>
      {SERVICE_FOLDERS.map((f) => (
        <ServiceFolder key={f.key} folderKey={f.key} label={f.label} />
      ))}
    </div>
  );
}

// ── Legal Documents Tab ──────────────────────────────────────────────────────────

const LEGAL_CATEGORIES = [
  {
    id: "business-reg",
    label: "Business Registration",
    icon: "🏢",
    forms: [
      {
        title: "Proprietorship / Sole Trader Registration",
        desc: "Application form for registering a sole proprietorship with Ahmedabad Municipal Corporation.",
        fields: [
          { label: "Applicant Full Name", value: "Love Vijaybhai Parekh" },
          { label: "Business Name", value: "MSTC GLOBAL" },
          { label: "Business Address", value: "Ahmedabad, Gujarat, India" },
          { label: "Mobile Number", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "PAN Number", value: "" },
          { label: "Aadhaar Number", value: "" },
          { label: "Nature of Business", value: "Multi-sector Consulting" },
          { label: "Date of Commencement", value: "" },
          { label: "Signature", value: "" },
        ],
      },
      {
        title: "LLP Incorporation Form (FiLLiP)",
        desc: "Form for Limited Liability Partnership registration with MCA portal.",
        fields: [
          { label: "Proposed LLP Name", value: "MSTC GLOBAL LLP" },
          { label: "Registered Office State", value: "Gujarat" },
          { label: "Registered Office City", value: "Ahmedabad" },
          { label: "Partner 1 Name", value: "Love Vijaybhai Parekh" },
          { label: "Partner 1 DIN/DPIN", value: "" },
          { label: "Contribution by Partner 1", value: "" },
          {
            label: "Business Activity",
            value: "Consulting, Real Estate, Finance",
          },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "CA/CS Certification", value: "" },
        ],
      },
      {
        title: "Private Limited Company Incorporation (SPICe+)",
        desc: "Simplified Proforma for Incorporating Company Electronically — MCA Form SPICe+.",
        fields: [
          {
            label: "Proposed Company Name",
            value: "MSTC Global Private Limited",
          },
          { label: "State", value: "Gujarat" },
          { label: "Registered Address", value: "Ahmedabad, Gujarat" },
          { label: "Director 1 Name", value: "Love Vijaybhai Parekh" },
          { label: "Director 1 DIN", value: "" },
          { label: "Authorized Capital", value: "" },
          { label: "Paid-Up Capital", value: "" },
          { label: "Company Email", value: "lovevijaybhai@gmail.com" },
          { label: "Company Mobile", value: "+91 9512609016" },
          { label: "CA/CS Name & Membership No.", value: "" },
        ],
      },
      {
        title: "Partnership Deed Template",
        desc: "Standard Partnership Deed for Ahmedabad/Gujarat with profit sharing, dissolution, and arbitration clauses.",
        fields: [
          { label: "Firm Name", value: "MSTC GLOBAL" },
          { label: "Date of Deed", value: "" },
          {
            label: "Partner 1 Name & Address",
            value: "Love Vijaybhai Parekh, Ahmedabad",
          },
          { label: "Partner 2 Name & Address", value: "" },
          {
            label: "Business Nature",
            value: "Multi-sector Consulting & Real Estate",
          },
          { label: "Place of Business", value: "Ahmedabad, Gujarat" },
          { label: "Profit Sharing Ratio", value: "" },
          { label: "Capital Contribution", value: "" },
          {
            label: "Dispute Resolution",
            value: "Arbitration under Arbitration & Conciliation Act 1996",
          },
          { label: "Witness 1 Name", value: "" },
        ],
      },
      {
        title: "Udyam Registration Form (MSME)",
        desc: "Online Udyam Registration for micro, small, and medium enterprises on udyamregistration.gov.in.",
        fields: [
          { label: "Aadhaar of Proprietor / Director", value: "" },
          { label: "Name of Entrepreneur", value: "Love Vijaybhai Parekh" },
          { label: "Name of Enterprise", value: "MSTC GLOBAL" },
          { label: "Type of Organization", value: "Proprietorship" },
          { label: "Major Activity", value: "Services" },
          { label: "Social Category", value: "" },
          { label: "Registered Office Address", value: "Ahmedabad, Gujarat" },
          { label: "Date of Commencement", value: "" },
          { label: "Bank Account No.", value: "" },
          { label: "NIC Code", value: "" },
        ],
      },
    ],
  },
  {
    id: "tax",
    label: "Tax & Compliance",
    icon: "📋",
    forms: [
      {
        title: "GST Registration Application (REG-01)",
        desc: "Application for new GST registration on gstin.gov.in. Mandatory for services turnover > ₹20L.",
        fields: [
          { label: "Legal Name of Business", value: "MSTC GLOBAL" },
          { label: "PAN", value: "" },
          {
            label: "Constitution of Business",
            value: "Proprietorship / LLP / Pvt Ltd",
          },
          { label: "State", value: "Gujarat" },
          { label: "District", value: "Ahmedabad" },
          { label: "Principal Place of Business", value: "Ahmedabad, Gujarat" },
          {
            label: "Authorized Signatory Name",
            value: "Love Vijaybhai Parekh",
          },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Bank Account No. (for refund)", value: "" },
        ],
      },
      {
        title: "Professional Tax Registration (Gujarat)",
        desc: "Registration under Gujarat Professional Tax Act 1976. Applicable to businesses with employees and self-employed persons.",
        fields: [
          { label: "Name of Employer / Business", value: "MSTC GLOBAL" },
          { label: "Address", value: "Ahmedabad, Gujarat" },
          { label: "Nature of Business", value: "Consulting" },
          { label: "PAN", value: "" },
          { label: "Number of Employees", value: "" },
          { label: "Authorised Person Name", value: "Love Vijaybhai Parekh" },
          { label: "Designation", value: "Managing Director" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Date of Registration", value: "" },
        ],
      },
      {
        title: "Trade License Application (AMC)",
        desc: "Application for trade license from Ahmedabad Municipal Corporation for business premises.",
        fields: [
          { label: "Applicant Name", value: "Love Vijaybhai Parekh" },
          { label: "Business Name", value: "MSTC GLOBAL" },
          { label: "Business Category", value: "Consulting / Services" },
          { label: "Premises Address", value: "Ahmedabad, Gujarat" },
          { label: "Ward / Zone", value: "" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Area of Premises (sq ft)", value: "" },
          { label: "No. of Employees", value: "" },
          { label: "Fire NOC (if required)", value: "" },
        ],
      },
      {
        title: "GST Invoice Template",
        desc: "GST-compliant tax invoice template pre-filled with MSTC GLOBAL details. Print and fill service details.",
        fields: [
          {
            label: "Supplier (From)",
            value: "MSTC GLOBAL, Ahmedabad, Gujarat",
          },
          { label: "GSTIN of Supplier", value: "" },
          { label: "Invoice Number", value: "" },
          { label: "Invoice Date", value: "" },
          { label: "Customer Name", value: "" },
          { label: "Customer GSTIN", value: "" },
          { label: "Description of Services", value: "" },
          { label: "Taxable Value (₹)", value: "" },
          { label: "GST Rate (%)", value: "18" },
          { label: "Total Amount (₹)", value: "" },
        ],
      },
    ],
  },
  {
    id: "realestate",
    label: "Real Estate & RERA",
    icon: "🏗️",
    forms: [
      {
        title: "GujRERA Project Registration Form",
        desc: "Form A — Application for registration of real estate project with Gujarat RERA (RERA Registration for Promoters).",
        fields: [
          { label: "Project Name", value: "" },
          { label: "Promoter Name", value: "MSTC GLOBAL" },
          { label: "Promoter Type", value: "Individual / Company" },
          { label: "Registered Address", value: "Ahmedabad, Gujarat" },
          { label: "GSTIN", value: "" },
          { label: "Location of Project", value: "Ahmedabad, Gujarat" },
          { label: "Type of Project", value: "Residential / Commercial" },
          { label: "Total Project Area (sq mt)", value: "" },
          { label: "Estimated Completion Date", value: "" },
          { label: "Carpet Area (per unit)", value: "" },
        ],
      },
      {
        title: "GujRERA Agent Registration (Form G)",
        desc: "Registration form for real estate agents under Gujarat RERA Act 2016.",
        fields: [
          { label: "Agent Full Name", value: "Love Vijaybhai Parekh" },
          { label: "Enterprise Name", value: "MSTC GLOBAL" },
          { label: "Type", value: "Individual / Firm" },
          { label: "Registered Address", value: "Ahmedabad, Gujarat" },
          { label: "PAN", value: "" },
          { label: "Aadhaar", value: "" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Income Tax Return (last 3 years)", value: "Attached" },
          { label: "Registration Fee (₹)", value: "10,000 (individual)" },
        ],
      },
      {
        title: "Rental Agreement Template (Leave & Licence)",
        desc: "Standard Leave and Licence Agreement for residential/commercial rental in Gujarat. Stamp duty applicable.",
        fields: [
          { label: "Licensor (Owner) Name", value: "" },
          { label: "Licensee (Tenant) Name", value: "" },
          { label: "Property Address", value: "Ahmedabad, Gujarat" },
          { label: "Monthly Licence Fee (₹)", value: "" },
          { label: "Security Deposit (₹)", value: "" },
          { label: "Agreement Start Date", value: "" },
          { label: "Agreement Period (months)", value: "11" },
          { label: "Notice Period", value: "30 days" },
          { label: "Facilitated By", value: "MSTC GLOBAL, Ahmedabad" },
          { label: "Stamp Duty Paid", value: "" },
        ],
      },
      {
        title: "Property Sale Agreement Template",
        desc: "Agreement to Sell for residential/commercial property in Gujarat. Should be registered with Sub-Registrar Office.",
        fields: [
          { label: "Seller Name", value: "" },
          { label: "Buyer Name", value: "" },
          { label: "Property Description", value: "" },
          { label: "Survey / Plot Number", value: "" },
          { label: "Total Sale Consideration (₹)", value: "" },
          { label: "Token Amount Paid (₹)", value: "" },
          { label: "Balance Payment Due By", value: "" },
          { label: "Possession Date", value: "" },
          { label: "Facilitated By", value: "MSTC GLOBAL, Ahmedabad" },
          { label: "Witness Name", value: "" },
        ],
      },
      {
        title: "Redevelopment Agreement Template",
        desc: "Agreement between society/land owner and developer for redevelopment under MOFA/Gujarat RERA.",
        fields: [
          { label: "Society / Owner Name", value: "" },
          { label: "Developer Name", value: "" },
          { label: "Property Address", value: "Ahmedabad, Gujarat" },
          { label: "Total FSI / Built-up Area", value: "" },
          { label: "Corpus Fund (₹)", value: "" },
          { label: "Rent During Construction (₹/month)", value: "" },
          { label: "Expected Completion Period", value: "" },
          { label: "RERA Registration No.", value: "" },
          { label: "Facilitated By", value: "MSTC GLOBAL, Ahmedabad" },
          { label: "Arbitration Clause", value: "Ahmedabad jurisdiction" },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance & Investment",
    icon: "💰",
    forms: [
      {
        title: "Home Loan Application Form",
        desc: "Standard home loan application for DSA submission to banks/NBFCs partnered with MSTC GLOBAL.",
        fields: [
          { label: "Applicant Name", value: "" },
          { label: "Date of Birth", value: "" },
          { label: "Occupation", value: "" },
          { label: "Monthly Income (₹)", value: "" },
          { label: "Loan Amount Required (₹)", value: "" },
          { label: "Property Address", value: "Ahmedabad, Gujarat" },
          { label: "Co-Applicant Name", value: "" },
          { label: "Preferred Bank / NBFC", value: "" },
          { label: "PAN", value: "" },
          { label: "Facilitated By", value: "MSTC GLOBAL — +91 9512609016" },
        ],
      },
      {
        title: "Business Loan Application Form",
        desc: "Business loan / term loan application for submission to banks/NBFCs.",
        fields: [
          { label: "Business Name", value: "MSTC GLOBAL" },
          {
            label: "Proprietor / Director Name",
            value: "Love Vijaybhai Parekh",
          },
          { label: "Business Type", value: "Proprietorship / LLP / Pvt Ltd" },
          { label: "Business Address", value: "Ahmedabad, Gujarat" },
          { label: "Annual Turnover (₹)", value: "" },
          { label: "Loan Amount Required (₹)", value: "" },
          { label: "Purpose of Loan", value: "" },
          { label: "Repayment Period", value: "" },
          { label: "Existing Liabilities (₹)", value: "" },
          { label: "Facilitated By", value: "MSTC GLOBAL — +91 9512609016" },
        ],
      },
      {
        title: "NDA — Non-Disclosure Agreement Template",
        desc: "Mutual NDA for protecting confidential information in investment/financing discussions.",
        fields: [
          {
            label: "Party 1 Name",
            value: "MSTC GLOBAL / Love Vijaybhai Parekh",
          },
          { label: "Party 1 Address", value: "Ahmedabad, Gujarat" },
          { label: "Party 2 Name", value: "" },
          { label: "Party 2 Address", value: "" },
          { label: "Purpose", value: "Investment / Business Discussions" },
          {
            label: "Confidential Information Covered",
            value: "All financial, strategic, and operational information",
          },
          { label: "Duration of NDA", value: "2 years" },
          {
            label: "Governing Law",
            value: "Laws of India; Ahmedabad jurisdiction",
          },
          { label: "Date", value: "" },
          { label: "Witness Name", value: "" },
        ],
      },
      {
        title: "Service Agreement / Client Contract Template",
        desc: "Standard service agreement for MSTC GLOBAL client engagements. Covers scope, fees, timelines, and IP.",
        fields: [
          {
            label: "Service Provider",
            value: "MSTC GLOBAL, Ahmedabad, Gujarat",
          },
          {
            label: "Provider Contact",
            value: "+91 9512609016 | lovevijaybhai@gmail.com",
          },
          { label: "Client Name", value: "" },
          { label: "Client Address", value: "" },
          { label: "Service Description", value: "" },
          { label: "Service Fee (₹)", value: "" },
          { label: "Payment Terms", value: "" },
          { label: "Start Date", value: "" },
          { label: "End Date / Duration", value: "" },
          { label: "Governing Law", value: "Gujarat; Ahmedabad jurisdiction" },
        ],
      },
    ],
  },
  {
    id: "labor",
    label: "Labour & Employment",
    icon: "👔",
    forms: [
      {
        title: "Employee Appointment Letter Template",
        desc: "Appointment letter for new employees. Includes designation, CTC, probation, notice period, and confidentiality clause.",
        fields: [
          { label: "Company Name", value: "MSTC GLOBAL" },
          { label: "Company Address", value: "Ahmedabad, Gujarat" },
          { label: "Employee Name", value: "" },
          { label: "Designation", value: "" },
          { label: "Date of Joining", value: "" },
          { label: "CTC per Annum (₹)", value: "" },
          { label: "Probation Period", value: "3 months" },
          { label: "Notice Period", value: "30 days" },
          { label: "Reporting To", value: "Love Vijaybhai Parekh, MD" },
          { label: "Authorised Signatory", value: "Love Vijaybhai Parekh" },
        ],
      },
      {
        title: "Shops & Establishments Registration (Gujarat)",
        desc: "Registration under Gujarat Shops and Establishments Act for business premises. Apply within 30 days of opening.",
        fields: [
          { label: "Name of Establishment", value: "MSTC GLOBAL" },
          { label: "Address", value: "Ahmedabad, Gujarat" },
          { label: "Category", value: "Commercial Establishment" },
          { label: "Employer Name", value: "Love Vijaybhai Parekh" },
          { label: "No. of Employees", value: "" },
          { label: "Date of Opening", value: "" },
          { label: "Nature of Work", value: "Consulting / Services" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "PAN / TAN", value: "" },
        ],
      },
      {
        title: "Contractor / Vendor Agreement Template",
        desc: "Standard vendor agreement covering scope of work, payment, penalties, and IP for service contractors.",
        fields: [
          {
            label: "Principal (Hiring Party)",
            value: "MSTC GLOBAL, Ahmedabad",
          },
          { label: "Vendor / Contractor Name", value: "" },
          { label: "Vendor Address", value: "" },
          { label: "Scope of Work", value: "" },
          { label: "Contract Value (₹)", value: "" },
          { label: "Payment Schedule", value: "" },
          { label: "Penalty Clause", value: "" },
          { label: "Start Date", value: "" },
          { label: "End Date", value: "" },
          { label: "Governing Law", value: "Gujarat; Ahmedabad jurisdiction" },
        ],
      },
    ],
  },
  {
    id: "ngo",
    label: "NGO & CSR",
    icon: "🤝",
    forms: [
      {
        title: "Society Registration Application (Gujarat)",
        desc: "Registration under the Societies Registration Act 1860 / Gujarat Societies Act. File with Registrar of Societies.",
        fields: [
          { label: "Society Name", value: "" },
          { label: "Registered Address", value: "Ahmedabad, Gujarat" },
          { label: "President Name", value: "Love Vijaybhai Parekh" },
          { label: "Secretary Name", value: "" },
          { label: "Treasurer Name", value: "" },
          {
            label: "Objects of the Society",
            value: "Social welfare, education, community development",
          },
          { label: "No. of Members (min 7)", value: "" },
          {
            label: "Source of Income",
            value: "Donations, CSR Grants, Membership Fees",
          },
          { label: "Bank Name & Branch", value: "" },
          { label: "Witness Name & Designation", value: "" },
        ],
      },
      {
        title: "CSR Proposal Template (Companies Act S.135)",
        desc: "Structured CSR proposal format for submission to Corporate CSR committees. Follows Schedule VII activities.",
        fields: [
          { label: "Proposing Organisation", value: "MSTC GLOBAL" },
          {
            label: "Contact",
            value: "+91 9512609016 | lovevijaybhai@gmail.com",
          },
          { label: "Corporate Partner (Target)", value: "" },
          { label: "CSR Theme", value: "Education / Health / Environment" },
          { label: "Schedule VII Activity", value: "" },
          { label: "Proposed Budget (₹)", value: "" },
          { label: "Target Beneficiaries", value: "" },
          { label: "Implementation Area", value: "Ahmedabad / Rural Gujarat" },
          { label: "Duration of Project", value: "" },
          { label: "Measurable Outcomes", value: "" },
        ],
      },
      {
        title: "Niti Aayog Darpan Registration",
        desc: "Mandatory Darpan registration for NGOs seeking government grants and CSR funding. Apply at ngodarpan.gov.in.",
        fields: [
          { label: "Organisation Name", value: "" },
          { label: "Registration Type", value: "Society / Trust / Section 8" },
          { label: "State", value: "Gujarat" },
          { label: "District", value: "Ahmedabad" },
          { label: "Head of Organisation", value: "Love Vijaybhai Parekh" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          { label: "Registration Certificate No.", value: "" },
          { label: "PAN", value: "" },
          { label: "12A / 80G Certificate No.", value: "" },
        ],
      },
    ],
  },
  {
    id: "general",
    label: "General Business",
    icon: "📄",
    forms: [
      {
        title: "Business Proposal / Quotation Template",
        desc: "Professional business proposal format for MSTC GLOBAL client pitches.",
        fields: [
          { label: "Proposal Prepared By", value: "MSTC GLOBAL" },
          {
            label: "Contact",
            value: "+91 9512609016 | lovevijaybhai@gmail.com",
          },
          { label: "Proposal Date", value: "" },
          { label: "Valid Until", value: "" },
          { label: "Prepared For (Client)", value: "" },
          { label: "Service / Project Title", value: "" },
          { label: "Scope of Work", value: "" },
          { label: "Deliverables", value: "" },
          { label: "Total Fee (₹)", value: "" },
          { label: "Payment Terms", value: "50% advance, 50% on completion" },
        ],
      },
      {
        title: "Trademark Registration Application (Form TM-A)",
        desc: "Application for trademark registration with IP India for the MSTC GLOBAL brand.",
        fields: [
          {
            label: "Applicant Name",
            value: "Love Vijaybhai Parekh / MSTC GLOBAL",
          },
          { label: "Address for Service", value: "Ahmedabad, Gujarat, India" },
          { label: "Trademark / Brand Name", value: "MSTC GLOBAL" },
          { label: "Class (NICE)", value: "35, 36, 41, 45" },
          {
            label: "Description of Goods/Services",
            value:
              "Business consulting, real estate, financial services, events",
          },
          { label: "First Use in India", value: "" },
          { label: "Agent / Attorney", value: "" },
          { label: "Mobile", value: "+91 9512609016" },
          { label: "Email", value: "lovevijaybhai@gmail.com" },
          {
            label: "Payment of Fees",
            value: "₹4,500 online / ₹5,000 offline (individual/MSME)",
          },
        ],
      },
      {
        title: "Power of Attorney (General)",
        desc: "General Power of Attorney for authorising a representative to act on behalf of MSTC GLOBAL in transactions.",
        fields: [
          { label: "Principal (Grantor) Name", value: "Love Vijaybhai Parekh" },
          { label: "Principal Address", value: "Ahmedabad, Gujarat" },
          { label: "Attorney (Agent) Name", value: "" },
          { label: "Attorney Address", value: "" },
          { label: "Scope of Authority", value: "" },
          { label: "Effective Date", value: "" },
          { label: "Expiry Date", value: "" },
          {
            label: "Registration Required",
            value: "Yes (Sub-Registrar Office)",
          },
          { label: "Witness 1 Name", value: "" },
          { label: "Notarised By", value: "" },
        ],
      },
      {
        title: "Client Onboarding / KYC Form",
        desc: "Know Your Customer form for MSTC GLOBAL onboarding. Collect PAN, Aadhaar, address proof, and purpose.",
        fields: [
          { label: "Client Full Name", value: "" },
          { label: "Date of Birth", value: "" },
          { label: "PAN Number", value: "" },
          { label: "Aadhaar Number", value: "" },
          { label: "Mobile", value: "" },
          { label: "Email", value: "" },
          { label: "Permanent Address", value: "" },
          { label: "Service Required", value: "" },
          { label: "Source of Funds", value: "" },
          {
            label: "KYC Completed By",
            value: `MSTC GLOBAL — ${new Date().toLocaleDateString("en-IN")}`,
          },
        ],
      },
    ],
  },
];

function LegalFormCard({
  form,
}: {
  form: {
    title: string;
    desc: string;
    fields: { label: string; value: string }[];
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(form.fields.map((f) => [f.label, f.value])),
  );

  function handlePrint() {
    const rows = form.fields
      .map(
        (f) =>
          `<tr><td style="padding:6px 12px;border:1px solid #c9a84c;font-weight:600;color:#c9a84c;width:40%;font-size:12px">${f.label}</td><td style="padding:6px 12px;border:1px solid #dee2e6;font-size:12px">${values[f.label] || ""}</td></tr>`,
      )
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><title>${form.title} — MSTC GLOBAL</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111;}h1{font-size:18px;border-bottom:2px solid #c9a84c;padding-bottom:8px;margin-bottom:16px;}p{font-size:12px;color:#555;margin-bottom:16px;}table{width:100%;border-collapse:collapse;}@media print{button{display:none;}}</style></head><body><h1>${form.title}</h1><p>${form.desc}</p><p>Prepared by: MSTC GLOBAL, Ahmedabad | +91 9512609016 | lovevijaybhai@gmail.com</p><table>${rows}</table><br/><p style="font-size:11px;color:#888;">This form is a template. Verify all legal requirements with a qualified professional before submission. MSTC Global is a facilitator only.</p><script>window.onload=()=>window.print();<\/script></body></html>`,
    );
    win.document.close();
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid oklch(var(--border))",
        background: "oklch(var(--card))",
      }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <FileText
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: "oklch(var(--primary))" }}
            />
            <div className="min-w-0">
              <p className="font-sans font-semibold text-sm text-foreground">
                {form.title}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {form.desc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: "oklch(var(--primary) / 0.12)",
                color: "oklch(var(--primary))",
                border: "1px solid oklch(var(--primary) / 0.25)",
              }}
              data-ocid="legaldocs.print_button"
            >
              <Printer size={12} /> Print
            </button>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40 transition-colors"
              data-ocid="legaldocs.expand_button"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? "Collapse" : "Fill Form"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="px-5 pb-5 space-y-3"
          style={{
            borderTop: "1px solid oklch(var(--border))",
            paddingTop: "1rem",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.fields.map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <label
                  className="font-sans text-xs font-semibold"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {f.label}
                </label>
                <input
                  type="text"
                  className="font-sans text-xs px-2.5 py-1.5 rounded-md"
                  style={{
                    background: "oklch(var(--input))",
                    border: "1px solid oklch(var(--border))",
                    color: "oklch(var(--foreground))",
                  }}
                  value={values[f.label]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.label]: e.target.value }))
                  }
                  placeholder={f.value ? "" : "Enter value…"}
                />
              </div>
            ))}
          </div>
          <p
            className="font-sans text-xs italic"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            <BookOpen size={11} className="inline mr-1" />
            Tip: Fill in the fields above, then click Print to print or save as
            PDF from your browser.
          </p>
        </div>
      )}
    </div>
  );
}

function LegalDocsTab() {
  return (
    <div className="space-y-8" data-ocid="legaldocs.section">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} style={{ color: "oklch(var(--primary))" }} />
          <h3
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: "oklch(var(--primary))" }}
          >
            Legal & Business Documents — India (Gujarat / Ahmedabad)
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-sans mb-6">
          All forms are pre-filled with MSTC GLOBAL details. Click "Fill Form"
          to expand and edit fields, then click "Print" to print or save as PDF.
          These are reference templates — verify with a qualified professional
          before submission.
        </p>

        {LEGAL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.icon}</span>
              <h4 className="font-serif font-semibold text-foreground">
                {cat.label}
              </h4>
              <div
                className="flex-1 h-px ml-2"
                style={{ background: "oklch(var(--border))" }}
              />
            </div>
            <div className="space-y-3">
              {cat.forms.map((form) => (
                <LegalFormCard key={form.title} form={form} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Status helpers ─────────────────────────────────────────────────────────────

const ENQUIRY_STATUSES = ["New", "Contacted", "In Progress", "Closed"] as const;
type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number] | "All";

function EnquiryStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    New: "bg-gold-700/20 text-gold-300 border-gold-700/40",
    Contacted: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    "In Progress": "bg-purple-500/15 text-purple-300 border-purple-500/30",
    Closed: "bg-muted/30 text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        styles[status] ?? "bg-muted/20 text-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

// ── Enquiry Detail Drawer ───────────────────────────────────────────────────────

function EnquiryDetailPanel({
  enquiry,
  onClose,
}: {
  enquiry: PropertyEnquiry;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(enquiry.notes);
  const [status, setStatus] = useState(enquiry.status);
  const [savedNotes, setSavedNotes] = useState(false);
  const updateStatus = useUpdateEnquiryStatus();
  const markContacted = useMarkContacted();

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    updateStatus.mutate({ id: enquiry.id, status: newStatus, notes });
  }

  function handleSaveNotes() {
    updateStatus.mutate(
      { id: enquiry.id, status, notes },
      { onSuccess: () => setSavedNotes(true) },
    );
    setTimeout(() => setSavedNotes(false), 2000);
  }

  function handleMarkContacted() {
    markContacted.mutate(enquiry.id, {
      onSuccess: () => {
        setStatus("Contacted");
        updateStatus.mutate({ id: enquiry.id, status: "Contacted", notes });
      },
    });
  }

  const waMsg = encodeURIComponent(
    `Following up on ${enquiry.customerName}'s enquiry for ${enquiry.propertyAddress}`,
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-end z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="propertyenquiries.detail.dialog"
    >
      <div className="w-full max-w-4xl min-h-screen bg-obsidian-900 border-l border-gold-700/30 shadow-2xl flex flex-col">
        {/* Panel header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card border-b border-gold-700/30">
          <div className="flex items-center gap-3 min-w-0">
            <Building2 size={18} className="text-gold-400 shrink-0" />
            <div className="min-w-0">
              <p className="font-serif font-semibold text-foreground truncate">
                {enquiry.propertyTitle}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {enquiry.propertyAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <EnquiryStatusBadge status={status} />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40 transition-colors"
              aria-label="Close"
              data-ocid="propertyenquiries.detail.close_button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Two-panel body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* LEFT — Property & Owner/Agent */}
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-gold-400" />
              <h3 className="text-xs font-semibold tracking-wider uppercase text-gold-400">
                Property &amp; Owner / Agent
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Detail label="Title" value={enquiry.propertyTitle} />
              <Detail label="Address" value={enquiry.propertyAddress} />
              <Detail label="Price" value={enquiry.propertyPrice} />
              <Detail label="BHK" value={enquiry.propertyBhk} />
              <Detail
                label="Sq Ft"
                value={Number(enquiry.propertySqft).toLocaleString("en-IN")}
              />
              <Detail label="Type" value={enquiry.propertyType} />
              <Detail label="Source" value={enquiry.sourceTag} highlight />
            </div>

            <div
              className="rounded-lg p-4 space-y-2"
              style={{
                background: "oklch(var(--primary) / 0.05)",
                border: "1px solid oklch(var(--primary) / 0.2)",
              }}
            >
              <p className="text-xs font-semibold text-gold-400 tracking-wider uppercase mb-2">
                Owner / Agent
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Detail label="Name" value={enquiry.ownerName} />
                <Detail label="Phone" value={enquiry.ownerPhone} />
                <Detail label="Email" value={enquiry.ownerEmail} />
                <Detail label="Agency" value={enquiry.agencyName} />
                <Detail label="Agency Phone" value={enquiry.agencyPhone} />
              </div>
            </div>

            {/* External Platform Links — Admin Only */}
            <div
              className="rounded-lg p-4 space-y-3"
              style={{
                background: "oklch(0.12 0.02 250 / 0.6)",
                border: "1px solid oklch(var(--primary) / 0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <ExternalLink size={13} className="text-gold-500" />
                <p className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
                  View on External Platforms
                </p>
                <span className="ml-auto text-[10px] font-sans px-1.5 py-0.5 rounded bg-obsidian-700/60 border border-gold-800/30 text-obsidian-300">
                  Admin Only
                </span>
              </div>
              <p className="text-[11px] font-sans text-obsidian-400 leading-relaxed">
                Search for this property on external platforms to find
                additional listings or contact the owner directly.
              </p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      label: "99acres",
                      color:
                        "bg-emerald-700/20 text-emerald-300 border-emerald-700/40 hover:bg-emerald-700/30",
                      url: `https://www.99acres.com/property-in-${enquiry.propertyAddress.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "-") || "ahmedabad"}-ahmedabad-ffid`,
                    },
                    {
                      label: "MagicBricks",
                      color:
                        "bg-orange-700/20 text-orange-300 border-orange-700/40 hover:bg-orange-700/30",
                      url: `https://www.magicbricks.com/property-for-${enquiry.propertyType?.toLowerCase() === "residential" ? "sale" : "sale"}/residential-real-estate?proptype=Multistorey-Apartment&cityName=Ahmedabad&Area=${encodeURIComponent(enquiry.propertyAddress.split(",")[0]?.trim() || "Ahmedabad")}`,
                    },
                    {
                      label: "Housing.com",
                      color:
                        "bg-rose-700/20 text-rose-300 border-rose-700/40 hover:bg-rose-700/30",
                      url: `https://housing.com/in/buy/searches/${enquiry.propertyAddress.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "-") || "ahmedabad"}-ahmedabad`,
                    },
                  ] as { label: string; color: string; url: string }[]
                ).map(({ label, color, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${color}`}
                    data-ocid={`propertyenquiries.detail.external_${label.toLowerCase().replace(".", "")}_button`}
                  >
                    <span>Search on {label}</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Customer Enquiry */}
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-gold-400" />
              <h3 className="text-xs font-semibold tracking-wider uppercase text-gold-400">
                Customer Enquiry
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Detail label="Name" value={enquiry.customerName} />
              <Detail label="Phone" value={enquiry.customerPhone} />
              <Detail label="Email" value={enquiry.customerEmail} />
              <Detail
                label="Preferred Time"
                value={enquiry.preferredTime || "—"}
              />
              <Detail label="Visit Date" value={enquiry.visitDate || "—"} />
              <Detail label="Submitted At" value={fmt(enquiry.submittedAt)} />
              {enquiry.contactedAt !== undefined &&
                enquiry.contactedAt > BigInt(0) && (
                  <Detail
                    label="Contacted At"
                    value={fmt(enquiry.contactedAt)}
                    highlight
                  />
                )}
            </div>

            {enquiry.customerMessage && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Message
                </p>
                <p className="text-sm text-foreground leading-relaxed bg-muted/10 rounded-lg p-3 border border-border">
                  {enquiry.customerMessage}
                </p>
              </div>
            )}

            {/* Status + Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </label>
                <select
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-foreground focus:outline-none focus:border-gold-500"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  data-ocid="propertyenquiries.detail.select"
                >
                  {ENQUIRY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {enquiry.contactedAt === undefined ||
                enquiry.contactedAt === BigInt(0) ? (
                  <button
                    type="button"
                    onClick={handleMarkContacted}
                    disabled={markContacted.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      background: "oklch(var(--primary) / 0.15)",
                      color: "oklch(var(--primary))",
                      border: "1px solid oklch(var(--primary) / 0.3)",
                    }}
                    data-ocid="propertyenquiries.detail.confirm_button"
                  >
                    <Phone size={12} />
                    {markContacted.isPending ? "Marking…" : "Mark as Contacted"}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/20 text-muted-foreground border border-border">
                    <Phone size={12} />
                    Contacted on {fmt(enquiry.contactedAt)}
                  </span>
                )}

                <a
                  href={`https://wa.me/919512609016?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600/15 text-green-400 border border-green-600/30 hover:bg-green-600/25 transition-colors"
                  data-ocid="propertyenquiries.detail.whatsapp_button"
                >
                  <MessageSquare size={12} /> WhatsApp Follow-up
                </a>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-gold-500 resize-none"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes…"
                  data-ocid="propertyenquiries.detail.textarea"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={updateStatus.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium gold-gradient text-obsidian-900 hover:opacity-90 transition-opacity"
                    data-ocid="propertyenquiries.detail.save_button"
                  >
                    {updateStatus.isPending ? "Saving…" : "Save Notes"}
                  </button>
                  {savedNotes && (
                    <span className="text-xs text-green-400">Saved ✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-xs ${
          highlight ? "text-gold-400 font-semibold" : "text-foreground"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ── Property Enquiries Tab ──────────────────────────────────────────────────────

function PropertyEnquiriesTab() {
  const { data: enquiries = [], isLoading } = usePropertyEnquiries();
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus>("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<PropertyEnquiry | null>(null);
  const [pipelineTarget, setPipelineTarget] = useState<string | null>(null);
  const updateStage = useUpdateLeadStage();

  // Summary counts
  const countByStatus = (s: string) =>
    enquiries.filter((e) => e.status === s).length;
  const newCount = countByStatus("New");
  const contactedCount = countByStatus("Contacted");
  const inProgressCount = countByStatus("In Progress");
  const closedCount = countByStatus("Closed");

  const filtered = useMemo(() => {
    let arr = enquiries;
    if (statusFilter !== "All")
      arr = arr.filter((e) => e.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.customerName.toLowerCase().includes(q) ||
          e.customerPhone.toLowerCase().includes(q) ||
          e.propertyAddress.toLowerCase().includes(q),
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      arr = arr.filter((e) => Number(e.submittedAt) / 1_000_000 >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000;
      arr = arr.filter((e) => Number(e.submittedAt) / 1_000_000 <= to);
    }
    return arr.sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt));
  }, [enquiries, statusFilter, search, dateFrom, dateTo]);

  function exportCSV() {
    const header =
      "ID,Property,Address,Price,BHK,Type,CustomerName,CustomerPhone,CustomerEmail,Status,SubmittedAt,OwnerName,OwnerPhone,OwnerEmail,AgencyName,Notes\n";
    const rows = filtered.map((e) => {
      const ts = new Date(Number(e.submittedAt) / 1_000_000).toISOString();
      const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
      return [
        esc(e.id),
        esc(e.propertyTitle),
        esc(e.propertyAddress),
        esc(e.propertyPrice),
        esc(e.propertyBhk),
        esc(e.propertyType),
        esc(e.customerName),
        esc(e.customerPhone),
        esc(e.customerEmail),
        esc(e.status),
        ts,
        esc(e.ownerName),
        esc(e.ownerPhone),
        esc(e.ownerEmail),
        esc(e.agencyName),
        esc(e.notes),
      ].join(",");
    });
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mstc-property-enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6" data-ocid="propertyenquiries.section">
      {/* Summary bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-5 gap-3"
        data-ocid="propertyenquiries.summary.section"
      >
        <div className="admin-stats-card">
          <span className="admin-stats-label">Total</span>
          <span className="admin-stats-value">{enquiries.length}</span>
        </div>
        <div
          className="admin-stats-card"
          style={{
            borderColor:
              newCount > 0 ? "oklch(var(--primary) / 0.5)" : undefined,
          }}
        >
          <span className="admin-stats-label">New</span>
          <span
            className={`admin-stats-value ${
              newCount > 0 ? "text-gold-300" : ""
            }`}
          >
            {newCount}
          </span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Contacted</span>
          <span className="admin-stats-value">{contactedCount}</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">In Progress</span>
          <span className="admin-stats-value">{inProgressCount}</span>
        </div>
        <div className="admin-stats-card">
          <span className="admin-stats-label">Closed</span>
          <span className="admin-stats-value">{closedCount}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by name, phone, address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            data-ocid="propertyenquiries.search_input"
          />
        </div>

        {/* Date filters */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary w-full sm:w-36"
          title="From date"
          data-ocid="propertyenquiries.date_from.input"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary w-full sm:w-36"
          title="To date"
          data-ocid="propertyenquiries.date_to.input"
        />

        {/* CSV Export */}
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
          data-ocid="propertyenquiries.export_button"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All", ...ENQUIRY_STATUSES] as EnquiryStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              statusFilter === s
                ? "border-gold-500/60 bg-gold-700/20 text-gold-300"
                : "border-border text-muted-foreground hover:text-foreground hover:border-gold-700/40"
            }`}
            data-ocid={`propertyenquiries.filter.${s.toLowerCase().replace(/ /g, "_")}.tab`}
          >
            {s}
            {s === "New" && newCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="propertyenquiries.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="propertyenquiries.empty_state"
          >
            No property enquiries found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedEnquiry(e)}
                  onKeyDown={(ev) =>
                    (ev.key === "Enter" || ev.key === " ") &&
                    setSelectedEnquiry(e)
                  }
                  tabIndex={0}
                  data-ocid={`propertyenquiries.table.item.${i + 1}`}
                >
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm text-foreground line-clamp-1">
                        {e.propertyTitle}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {e.propertyAddress}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium text-sm">{e.customerName}</td>
                  <td className="text-sm text-muted-foreground">
                    {e.customerPhone}
                  </td>
                  <td>
                    <EnquiryStatusBadge status={e.status} />
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {fmt(e.submittedAt)}
                    </span>
                  </td>
                  <td
                    onClick={(ev) => ev.stopPropagation()}
                    onKeyDown={(ev) => ev.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setSelectedEnquiry(e)}
                        data-ocid={`propertyenquiries.edit_button.${i + 1}`}
                      >
                        View Details
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-gold-700/40 text-gold-400 hover:bg-gold-700/10 transition-colors"
                          onClick={() =>
                            setPipelineTarget(
                              pipelineTarget === e.id ? null : e.id,
                            )
                          }
                          data-ocid={`propertyenquiries.pipeline_button.${i + 1}`}
                        >
                          Move to Pipeline
                        </button>
                        {pipelineTarget === e.id && (
                          <div
                            className="absolute right-0 top-8 z-20 bg-card border border-gold-700/40 rounded-xl shadow-2xl overflow-hidden min-w-36"
                            data-ocid={`propertyenquiries.pipeline_dropdown.${i + 1}`}
                          >
                            {LEAD_STAGES.map((stage) => (
                              <button
                                key={stage}
                                type="button"
                                className="block w-full text-left px-4 py-2 text-xs hover:bg-gold-700/15 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => {
                                  updateStage.mutate({ id: e.id, stage });
                                  setPipelineTarget(null);
                                }}
                                data-ocid={`propertyenquiries.pipeline_stage.${stage.toLowerCase().replace(/ /g, "_")}.${i + 1}`}
                              >
                                → {stage}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail panel */}
      {selectedEnquiry && (
        <EnquiryDetailPanel
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
        />
      )}
    </div>
  );
}

// ── Manage Properties Tab ────────────────────────────────────────────────────

const EMPTY_LISTING: BackendPropertyListing = {
  id: "",
  title: "",
  propertyType: "Residential",
  action: "Buy",
  bhk: "",
  sqft: BigInt(0),
  price: BigInt(0),
  priceDisplay: "",
  address: "",
  location: "",
  city: "Ahmedabad",
  furnishing: "",
  possession: "",
  facing: "",
  floorNo: BigInt(0),
  societyName: "",
  description: "",
  amenities: [],
  images: [],
  mapLink: "",
  sourceTag: "99acres",
  listedDate: new Date().toISOString().slice(0, 10),
  agencyName: "",
  agencyPhone: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
};

type PropForm = {
  id: string;
  title: string;
  propertyType: string;
  action: string;
  bhk: string;
  sqft: string;
  price: string;
  priceDisplay: string;
  address: string;
  location: string;
  city: string;
  furnishing: string;
  possession: string;
  facing: string;
  floorNo: string;
  societyName: string;
  description: string;
  amenities: string;
  images: string;
  mapLink: string;
  sourceTag: string;
  listedDate: string;
  agencyName: string;
  agencyPhone: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
};

function toForm(l: BackendPropertyListing): PropForm {
  return {
    id: l.id,
    title: l.title,
    propertyType: l.propertyType,
    action: l.action,
    bhk: l.bhk,
    sqft: Number(l.sqft).toString(),
    price: Number(l.price).toString(),
    priceDisplay: l.priceDisplay,
    address: l.address,
    location: l.location,
    city: l.city,
    furnishing: l.furnishing,
    possession: l.possession,
    facing: l.facing,
    floorNo: Number(l.floorNo).toString(),
    societyName: l.societyName,
    description: l.description,
    amenities: l.amenities.join(", "),
    images: l.images.join("\n"),
    mapLink: l.mapLink,
    sourceTag: l.sourceTag,
    listedDate: l.listedDate,
    agencyName: l.agencyName,
    agencyPhone: l.agencyPhone,
    ownerName: l.ownerName,
    ownerPhone: l.ownerPhone,
    ownerEmail: l.ownerEmail,
  };
}

function fromForm(f: PropForm): BackendPropertyListing {
  return {
    id: f.id,
    title: f.title,
    propertyType: f.propertyType,
    action: f.action,
    bhk: f.bhk,
    sqft: BigInt(Math.max(0, Number(f.sqft) || 0)),
    price: BigInt(Math.max(0, Number(f.price) || 0)),
    priceDisplay: f.priceDisplay,
    address: f.address,
    location: f.location,
    city: f.city,
    furnishing: f.furnishing,
    possession: f.possession,
    facing: f.facing,
    floorNo: BigInt(Math.max(0, Number(f.floorNo) || 0)),
    societyName: f.societyName,
    description: f.description,
    amenities: f.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
    images: f.images
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean),
    mapLink: f.mapLink,
    sourceTag: f.sourceTag,
    listedDate: f.listedDate || new Date().toISOString().slice(0, 10),
    agencyName: f.agencyName,
    agencyPhone: f.agencyPhone,
    ownerName: f.ownerName,
    ownerPhone: f.ownerPhone,
    ownerEmail: f.ownerEmail,
  };
}

function PropertyFormModal({
  initial,
  onClose,
  onSave,
  isSaving,
}: {
  initial: PropForm;
  onClose: () => void;
  onSave: (f: PropForm) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<PropForm>(initial);
  const set =
    (k: keyof PropForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const isEdit = !!initial.id;

  const F = ({
    label,
    k,
    placeholder,
    type = "text",
    hint,
  }: {
    label: string;
    k: keyof PropForm;
    placeholder?: string;
    type?: string;
    hint?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
        {label}
      </label>
      <input
        type={type}
        value={form[k]}
        onChange={set(k)}
        placeholder={placeholder}
        className="px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-obsidian-900/90 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      data-ocid="manage_properties.form.dialog"
    >
      <div className="w-full max-w-3xl bg-card border border-gold-700/40 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/30">
          <h2 className="font-serif text-lg font-bold gold-text">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-obsidian-700 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="manage_properties.form.close_button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <F
                  label="Title *"
                  k="title"
                  placeholder="e.g. 3 BHK Flat in Satellite"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
                  Property Type
                </label>
                <select
                  value={form.propertyType}
                  onChange={set("propertyType")}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                >
                  {[
                    "Residential",
                    "Commercial",
                    "Plot",
                    "Industrial",
                    "Redevelopment",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
                  Action
                </label>
                <select
                  value={form.action}
                  onChange={set("action")}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                >
                  {["Buy", "Rent", "Lease", "PG"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
                  Source Platform
                </label>
                <select
                  value={form.sourceTag}
                  onChange={set("sourceTag")}
                  className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                >
                  {["99acres", "MagicBricks", "Housing.com"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <F label="BHK" k="bhk" placeholder="e.g. 3 BHK" />
              <F
                label="Price (₹)"
                k="price"
                type="number"
                placeholder="e.g. 7500000"
              />
              <F
                label="Price Display"
                k="priceDisplay"
                placeholder="e.g. ₹75 L"
              />
              <F
                label="Area (sqft)"
                k="sqft"
                type="number"
                placeholder="e.g. 1200"
              />
              <F
                label="Floor No."
                k="floorNo"
                type="number"
                placeholder="e.g. 5"
              />
              <F
                label="Furnishing"
                k="furnishing"
                placeholder="Furnished / Semi / Unfurnished"
              />
              <F
                label="Possession"
                k="possession"
                placeholder="Ready to Move"
              />
              <F
                label="Facing"
                k="facing"
                placeholder="East / West / North / South"
              />
              <F label="Listed Date" k="listedDate" type="date" />
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
              Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F
                label="Society / Project Name"
                k="societyName"
                placeholder="e.g. Shivalik Greens"
              />
              <F
                label="Location / Locality"
                k="location"
                placeholder="e.g. Satellite"
              />
              <F label="City" k="city" placeholder="Ahmedabad" />
              <div className="sm:col-span-2">
                <F
                  label="Full Address"
                  k="address"
                  placeholder="e.g. Plot 12, Satellite Road, Ahmedabad"
                />
              </div>
              <div className="sm:col-span-2">
                <F
                  label="Google Maps Link"
                  k="mapLink"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
              Media
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
                  Image URLs (one per line)
                </label>
                <textarea
                  rows={3}
                  value={form.images}
                  onChange={set("images")}
                  placeholder="https://...\nhttps://..."
                  className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.amenities}
                  onChange={set("amenities")}
                  placeholder="Parking, Gym, Swimming Pool, Lift"
                  className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gold-400 tracking-wider uppercase mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the property..."
              className="w-full px-3 py-2 bg-obsidian-900 border border-gold-700/40 text-foreground text-sm rounded-lg focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          {/* Owner / Agency — Admin Only */}
          <div>
            <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
              Owner / Agent Info (Admin Only — not shown to users)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <F
                label="Owner Name"
                k="ownerName"
                placeholder="Owner's full name"
              />
              <F label="Owner Phone" k="ownerPhone" placeholder="+91 ..." />
              <F
                label="Owner Email"
                k="ownerEmail"
                placeholder="owner@email.com"
              />
              <F
                label="Agency Name"
                k="agencyName"
                placeholder="Agency / Broker name"
              />
              <F label="Agency Phone" k="agencyPhone" placeholder="+91 ..." />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gold-700/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gold-700/40 text-gold-400 rounded-lg font-sans text-sm hover:bg-obsidian-700 transition-colors"
            data-ocid="manage_properties.form.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving || !form.title.trim()}
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 gold-gradient text-obsidian-900 rounded-lg font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            data-ocid="manage_properties.form.submit_button"
          >
            {isSaving ? "Saving…" : isEdit ? "Update Property" : "Add Property"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ManagePropertiesTab() {
  const { data: properties = [], isLoading } = usePropertiesForAdmin();
  const { data: propertyCount } = useGetPropertyCount();
  const addProp = useAddProperty();
  const updateProp = useUpdateProperty();
  const deleteProp = useDeleteProperty();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editTarget, setEditTarget] = useState<BackendPropertyListing | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] =
    useState<BackendPropertyListing | null>(null);
  const [qrTarget, setQrTarget] = useState<BackendPropertyListing | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const bulkAdd = useBulkAddProperties();
  const BASE_URL = "https://mstcglobal-kh8.caffeine.xyz";

  const filtered = useMemo(() => {
    if (!search.trim()) return properties;
    const q = search.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q) ||
        p.sourceTag.toLowerCase().includes(q),
    );
  }, [properties, search]);

  function flash(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleSave(f: PropForm) {
    const listing = fromForm(f);
    if (editTarget) {
      await updateProp.mutateAsync({ id: editTarget.id, listing });
      flash("Property updated successfully.");
    } else {
      await addProp.mutateAsync(listing);
      flash("Property added successfully.");
    }
    setShowForm(false);
    setEditTarget(null);
  }

  async function handleDelete(p: BackendPropertyListing) {
    await deleteProp.mutateAsync(p.id);
    setDeleteTarget(null);
    flash("Property deleted.");
  }

  function formatPriceNum(p: bigint) {
    const n = Number(p);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  }

  const sourceBadge: Record<string, string> = {
    "99acres": "bg-emerald-700/20 text-emerald-300 border-emerald-700/40",
    MagicBricks: "bg-orange-700/20 text-orange-300 border-orange-700/40",
    "Housing.com": "bg-rose-700/20 text-rose-300 border-rose-700/40",
  };

  const isMutating = addProp.isPending || updateProp.isPending;

  return (
    <div className="space-y-5" data-ocid="manage_properties.section">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={18} className="text-gold-400" />
          <div>
            <h3 className="font-serif font-semibold text-foreground">
              Property Listings
            </h3>
            <p className="text-xs text-muted-foreground">
              {propertyCount !== undefined
                ? `${Number(propertyCount)} properties in portal`
                : "Loading count…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-700/50 bg-gold-700/10 text-gold-300 font-semibold text-sm hover:bg-gold-700/20 transition-colors"
            data-ocid="manage_properties.import_button"
          >
            <Download size={16} /> Import Properties
          </button>
          <button
            type="button"
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-obsidian-900 font-semibold text-sm hover:opacity-90 transition-opacity"
            data-ocid="manage_properties.add_button"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {successMsg && (
        <div
          className="px-4 py-3 rounded-lg bg-green-600/15 text-green-400 border border-green-600/30 text-sm"
          data-ocid="manage_properties.success_state"
        >
          {successMsg}
        </div>
      )}

      {/* Import Guide */}
      <ImportGuide
        onDownloadTemplate={() => {
          // Trigger the same downloadCSV helper via dynamic import of the module
          import("../components/ImportPropertiesModal").then((m) => {
            // The modal exposes downloadCSV via its own button; this guide button is just a shortcut
            // We replicate the CSV generation here directly
            void m;
            const TEMPLATE_HEADERS = [
              "Title",
              "Property Type",
              "Action",
              "BHK",
              "Price",
              "Address",
              "Location",
              "City",
              "Description",
              "SqFt",
              "Furnishing",
              "Possession",
              "Floor No",
              "Facing",
              "Society Name",
              "Amenities",
              "Image1 URL",
              "Image2 URL",
              "Image3 URL",
              "Owner Name",
              "Owner Phone",
              "Owner Email",
              "Agency Name",
              "Agency Phone",
              "Source Tag",
              "Map Link",
            ];
            const SAMPLE_ROWS = [
              [
                "3 BHK Flat in Satellite",
                "Residential",
                "Buy",
                "3 BHK",
                "7500000",
                "Plot 12, Shivalik Greens, Satellite Road, Ahmedabad 380015",
                "Satellite",
                "Ahmedabad",
                "Spacious 3 BHK with modular kitchen",
                "1450",
                "Semi-Furnished",
                "Ready to Move",
                "5",
                "East",
                "Shivalik Greens",
                "Parking, Gym, Lift",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "",
                "",
                "Rajesh Patel",
                "+91 9876543210",
                "rajesh@email.com",
                "Patel Realty",
                "+91 9876543211",
                "99acres",
                "",
              ],
              [
                "2 BHK Apartment for Rent",
                "Residential",
                "Rent",
                "2 BHK",
                "18000",
                "B-301, Orchid Residency, Bopal",
                "Bopal",
                "Ahmedabad",
                "Well-maintained 2 BHK",
                "980",
                "Furnished",
                "Immediate",
                "3",
                "West",
                "Orchid Residency",
                "Parking, Lift, Security",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                "",
                "",
                "Meena Shah",
                "+91 9123456789",
                "",
                "",
                "",
                "MagicBricks",
                "",
              ],
            ];
            const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
            const csv = [
              TEMPLATE_HEADERS.map(esc).join(","),
              ...SAMPLE_ROWS.map((r) => r.map(esc).join(",")),
            ].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mstc-property-import-template.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
        }}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by title, location, type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
          data-ocid="manage_properties.search_input"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="manage_properties.loading_state"
          >
            Loading properties…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="manage_properties.empty_state"
          >
            {search.trim()
              ? "No properties match your search."
              : 'No properties yet. Click "Add Property" to get started.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Action</th>
                <th>Price</th>
                <th>BHK</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  data-ocid={`manage_properties.table.item.${i + 1}`}
                >
                  <td>
                    <div className="flex flex-col gap-0.5 max-w-48">
                      <span className="font-medium text-sm text-foreground line-clamp-1">
                        {p.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-muted-foreground">
                      {p.location}
                      {p.city && p.city !== p.location ? `, ${p.city}` : ""}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground">
                      {p.propertyType}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted/20 text-foreground border border-border">
                      {p.action}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-sm text-gold-300">
                      {p.priceDisplay || formatPriceNum(p.price)}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground">
                      {p.bhk || "—"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        sourceBadge[p.sourceTag] ??
                        "bg-muted/20 text-foreground border-border"
                      }`}
                    >
                      {p.sourceTag}
                    </span>
                  </td>
                  <td
                    onClick={(ev) => ev.stopPropagation()}
                    onKeyDown={(ev) => ev.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gold-700/10 text-gold-400 transition-colors"
                        aria-label="QR Code"
                        onClick={() => setQrTarget(p)}
                        title="Show QR Code"
                        data-ocid={`manage_properties.qr_button.${i + 1}`}
                      >
                        <span className="text-xs font-bold">QR</span>
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                        aria-label="Edit"
                        onClick={() => {
                          setEditTarget(p);
                          setShowForm(true);
                        }}
                        data-ocid={`manage_properties.edit_button.${i + 1}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                        aria-label="Delete"
                        onClick={() => setDeleteTarget(p)}
                        data-ocid={`manage_properties.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Import Modal */}
      {showImport && (
        <ImportPropertiesModal
          onClose={() => setShowImport(false)}
          onImport={async (rows, onProgress) => {
            const result = await bulkAdd.mutateAsync({
              listings: rows,
              onProgress,
            });
            const parts: string[] = [];
            if (result.added > 0) parts.push(`${result.added} added`);
            if (result.updated > 0) parts.push(`${result.updated} updated`);
            if (parts.length > 0)
              flash(`Import complete: ${parts.join(", ")} properties.`);
            return result;
          }}
        />
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <PropertyFormModal
          initial={
            editTarget ? toForm(editTarget) : toForm({ ...EMPTY_LISTING })
          }
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          onSave={handleSave}
          isSaving={isMutating}
        />
      )}

      {/* QR Code Modal */}
      {qrTarget && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          data-ocid="manage_properties.qr.dialog"
          onClick={(e) => e.target === e.currentTarget && setQrTarget(null)}
          onKeyDown={(e) => e.key === "Escape" && setQrTarget(null)}
        >
          <div className="bg-card border border-gold-700/40 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-semibold text-foreground">
                Property QR Code
              </h3>
              <button
                type="button"
                onClick={() => setQrTarget(null)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
                data-ocid="manage_properties.qr.close_button"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 font-medium">
              {qrTarget.title}
            </p>
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${BASE_URL}/#/property/${qrTarget.id}`)}`}
                alt={`QR code for ${qrTarget.title}`}
                width={200}
                height={200}
                className="rounded"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono break-all opacity-70">
              {BASE_URL}/#/property/{qrTarget.id}
            </p>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`${BASE_URL}/#/property/${qrTarget.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 border border-gold-700/40 text-gold-400 rounded-lg text-sm hover:bg-gold-700/10 transition-colors inline-flex items-center justify-center gap-2"
              data-ocid="manage_properties.qr.download_button"
            >
              <Download size={15} /> Download QR PNG
            </a>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          data-ocid="manage_properties.delete.dialog"
        >
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-serif text-foreground mb-2">
              Delete Property?
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              <strong className="text-foreground">{deleteTarget.title}</strong>
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              This will permanently remove the listing from the portal.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/20 text-sm"
                onClick={() => setDeleteTarget(null)}
                data-ocid="manage_properties.delete.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteProp.isPending}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium disabled:opacity-60"
                onClick={() => handleDelete(deleteTarget)}
                data-ocid="manage_properties.delete.confirm_button"
              >
                {deleteProp.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Referrals Tab ──────────────────────────────────────────────────────────────

function ReferralsTab() {
  const { data: referrals = [], isLoading } = useGetAllReferrals();
  const deleteRef = useDeleteReferral();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return referrals;
    const q = search.toLowerCase();
    return referrals.filter(
      (r: ReferralRecord) =>
        r.creatorName.toLowerCase().includes(q) ||
        r.creatorPhone.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q),
    );
  }, [referrals, search]);

  return (
    <div className="space-y-5" data-ocid="referrals.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-serif font-semibold text-foreground">
            Referral Codes
          </h3>
          <p className="text-xs text-muted-foreground">
            {referrals.length} referral{referrals.length !== 1 ? "s" : ""}{" "}
            generated
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search referrals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            data-ocid="referrals.search_input"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        {isLoading ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="referrals.loading_state"
          >
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="referrals.empty_state"
          >
            No referrals yet. Users can generate their referral link at /refer.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Creator Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Clicks</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: ReferralRecord, i: number) => (
                <tr key={r.code} data-ocid={`referrals.table.item.${i + 1}`}>
                  <td>
                    <span className="font-mono font-bold text-gold-400 text-sm tracking-wider">
                      {r.code}
                    </span>
                  </td>
                  <td className="font-medium text-sm">{r.creatorName}</td>
                  <td className="text-sm text-muted-foreground">
                    {r.creatorPhone}
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {r.creatorEmail || "—"}
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-700/20 text-gold-300 border border-gold-700/40">
                      {r.clicks}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                      aria-label="Delete referral"
                      onClick={() => {
                        if (confirm("Delete this referral?"))
                          deleteRef.mutate(r.code);
                      }}
                      data-ocid={`referrals.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Main AdminPage ──────────────────────────────────────────────────────────────

// ── Settings Tab ────────────────────────────────────────────────────────────

interface AISettings {
  activeProvider: string;
  openaiKey: string;
  geminiKey: string;
  claudeKey: string;
  personality: string;
  language: string;
  customGreeting: string;
}

function SettingsTab() {
  const [settings, setSettings] = useState<AISettings>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mstc_ai_settings") || "{}",
      ) as AISettings;
    } catch {
      return {
        activeProvider: "auto",
        openaiKey: "",
        geminiKey: "",
        claudeKey: "",
        personality: "professional",
        language: "auto",
        customGreeting: "",
      };
    }
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    gemini: false,
    claude: false,
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof AISettings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    localStorage.setItem("mstc_ai_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const goldInput: React.CSSProperties = {
    width: "100%",
    background: "#0f1319",
    border: "1px solid #c9a84c44",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    color: "#e8e8e8",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  };

  const goldSelect: React.CSSProperties = {
    ...goldInput,
    cursor: "pointer",
    appearance: "none" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#c9a84c",
    marginBottom: "0.35rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "680px" }}>
      <div
        style={{
          borderBottom: "2px solid #c9a84c44",
          paddingBottom: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.35rem",
            fontFamily: "Playfair Display, serif",
            color: "#c9a84c",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Settings size={20} /> AI &amp; Site Configuration
        </h2>
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.25rem" }}>
          API keys are stored securely in your browser and never exposed in the
          chatbot UI.
        </p>
      </div>

      {/* API Keys */}
      <section style={{ marginBottom: "1.75rem" }}>
        <h3
          style={{
            fontSize: "0.9rem",
            color: "#e8e8e8",
            fontWeight: 700,
            marginBottom: "1rem",
            borderLeft: "3px solid #c9a84c",
            paddingLeft: "0.6rem",
          }}
        >
          API Keys
        </h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          {/* OpenAI */}
          <div>
            <label style={labelStyle}>OpenAI API Key (GPT-4o)</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type={showKeys.openai ? "text" : "password"}
                placeholder="sk-..."
                value={settings.openaiKey || ""}
                onChange={(e) => update("openaiKey", e.target.value)}
                data-ocid="settings.openai_key_input"
                style={{ ...goldInput, flex: 1, fontFamily: "monospace" }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowKeys((k) => ({ ...k, openai: !k.openai }))
                }
                data-ocid="settings.openai_key_toggle"
                style={{
                  background: "#1a1f2e",
                  border: "1px solid #c9a84c44",
                  borderRadius: "0.375rem",
                  padding: "0 0.75rem",
                  color: "#c9a84c",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={showKeys.openai ? "Hide key" : "Show key"}
              >
                {showKeys.openai ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {/* Gemini */}
          <div>
            <label style={labelStyle}>Google Gemini API Key</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type={showKeys.gemini ? "text" : "password"}
                placeholder="AIza..."
                value={settings.geminiKey || ""}
                onChange={(e) => update("geminiKey", e.target.value)}
                data-ocid="settings.gemini_key_input"
                style={{ ...goldInput, flex: 1, fontFamily: "monospace" }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowKeys((k) => ({ ...k, gemini: !k.gemini }))
                }
                data-ocid="settings.gemini_key_toggle"
                style={{
                  background: "#1a1f2e",
                  border: "1px solid #c9a84c44",
                  borderRadius: "0.375rem",
                  padding: "0 0.75rem",
                  color: "#c9a84c",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={showKeys.gemini ? "Hide key" : "Show key"}
              >
                {showKeys.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {/* Claude */}
          <div>
            <label style={labelStyle}>Anthropic Claude API Key</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type={showKeys.claude ? "text" : "password"}
                placeholder="sk-ant-..."
                value={settings.claudeKey || ""}
                onChange={(e) => update("claudeKey", e.target.value)}
                data-ocid="settings.claude_key_input"
                style={{ ...goldInput, flex: 1, fontFamily: "monospace" }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowKeys((k) => ({ ...k, claude: !k.claude }))
                }
                data-ocid="settings.claude_key_toggle"
                style={{
                  background: "#1a1f2e",
                  border: "1px solid #c9a84c44",
                  borderRadius: "0.375rem",
                  padding: "0 0.75rem",
                  color: "#c9a84c",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={showKeys.claude ? "Hide key" : "Show key"}
              >
                {showKeys.claude ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Behaviour */}
      <section style={{ marginBottom: "1.75rem" }}>
        <h3
          style={{
            fontSize: "0.9rem",
            color: "#e8e8e8",
            fontWeight: 700,
            marginBottom: "1rem",
            borderLeft: "3px solid #c9a84c",
            paddingLeft: "0.6rem",
          }}
        >
          AI Behaviour
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Active Provider</label>
            <select
              value={settings.activeProvider || "auto"}
              onChange={(e) => update("activeProvider", e.target.value)}
              data-ocid="settings.active_provider_select"
              style={goldSelect}
            >
              <option value="auto">🔄 Auto (try all, use best)</option>
              <option value="openai">🤖 OpenAI GPT-4o</option>
              <option value="gemini">✨ Google Gemini</option>
              <option value="claude">🧠 Anthropic Claude</option>
              <option value="builtin">⚡ Built-in (always works)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Personality</label>
            <select
              value={settings.personality || "professional"}
              onChange={(e) => update("personality", e.target.value)}
              data-ocid="settings.personality_select"
              style={goldSelect}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly &amp; Warm</option>
              <option value="formal">Formal</option>
              <option value="conversational">Conversational</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Response Language</label>
            <select
              value={settings.language || "auto"}
              onChange={(e) => update("language", e.target.value)}
              data-ocid="settings.language_select"
              style={goldSelect}
            >
              <option value="auto">🌐 Auto-detect</option>
              <option value="english">English</option>
              <option value="gujarati">Gujarati (ગુજરાતી)</option>
              <option value="hindi">Hindi (हिंदी)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Custom Greeting</label>
            <input
              type="text"
              placeholder="Welcome to MSTC GLOBAL! How can I help?"
              value={settings.customGreeting || ""}
              onChange={(e) => update("customGreeting", e.target.value)}
              data-ocid="settings.custom_greeting_input"
              style={goldInput}
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          type="button"
          onClick={save}
          data-ocid="settings.save_button"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e2b96a)",
            color: "#06090f",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.65rem 2rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.03em",
            transition: "opacity 0.2s",
          }}
        >
          Save Settings
        </button>
        {saved && (
          <span
            data-ocid="settings.success_state"
            style={{ color: "#38a169", fontSize: "0.875rem", fontWeight: 600 }}
          >
            ✓ Settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}

function AdminBlogTab() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBlogPosts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });

  const publishMut = useMutation({
    mutationFn: async ({
      id,
      isPublished,
    }: { id: string; isPublished: boolean }) => {
      if (!actor) return false;
      return actor.publishBlogPost(id, isPublished);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });

  const addMut = useMutation({
    mutationFn: async () => {
      if (!actor) return "";
      return actor.addBlogPost(
        form.title,
        form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        form.content,
        form.excerpt,
        form.category,
        form.author,
        "",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setShowForm(false);
      setForm({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "",
        author: "",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-amber-400">Blog Posts</h2>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
          data-ocid="blog.add_button"
        >
          New Post
        </button>
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            placeholder="Slug (auto if empty)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <input
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          />
          <input
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          />
          <input
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) =>
              setForm((f) => ({ ...f, excerpt: e.target.value }))
            }
          />
          <textarea
            className="w-full px-3 py-2 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground"
            rows={4}
            placeholder="Content"
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addMut.mutate()}
              disabled={addMut.isPending}
              className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors disabled:opacity-50"
              data-ocid="blog.save_button"
            >
              {addMut.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
              data-ocid="blog.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="text-muted-foreground">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground" data-ocid="blog.empty_state">
          No blog posts yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Published</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-muted/20"
                  data-ocid={`blog.item.${i + 1}`}
                >
                  <td className="px-3 py-2 text-foreground">{p.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.category}
                  </td>
                  <td className="px-3 py-2">
                    {p.isPublished ? (
                      <span className="text-green-400 text-xs">Yes</span>
                    ) : (
                      <span className="text-amber-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        publishMut.mutate({
                          id: p.id,
                          isPublished: !p.isPublished,
                        })
                      }
                      className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                      data-ocid={`blog.toggle.${i + 1}`}
                    >
                      {p.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminPartnersTab() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["admin-partner-applications"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPartnerApplications();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) return false;
      return actor.updatePartnerStatus(id, status, "");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-partner-applications"],
      }),
  });

  const statusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved")
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-700/20 text-green-300 border border-green-700/40">
          Approved
        </span>
      );
    if (s === "rejected")
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-700/20 text-red-300 border border-red-700/40">
          Rejected
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-700/20 text-amber-300 border border-amber-700/40">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-amber-400">
        Partner Applications
      </h2>
      {isLoading ? (
        <div className="text-muted-foreground">Loading applications...</div>
      ) : partners.length === 0 ? (
        <div className="text-muted-foreground" data-ocid="partners.empty_state">
          No partner applications yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Areas</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-muted/20"
                  data-ocid={`partners.item.${i + 1}`}
                >
                  <td className="px-3 py-2 text-foreground">{p.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.company}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.phone}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.areas}</td>
                  <td className="px-3 py-2">{statusBadge(p.status)}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        statusMut.mutate({ id: p.id, status: "approved" })
                      }
                      className="text-xs px-2 py-1 rounded bg-green-700/20 text-green-300 border border-green-700/40 hover:bg-green-700/30 transition-colors"
                      data-ocid={`partners.approve_button.${i + 1}`}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        statusMut.mutate({ id: p.id, status: "rejected" })
                      }
                      className="text-xs px-2 py-1 rounded bg-red-700/20 text-red-300 border border-red-700/40 hover:bg-red-700/30 transition-colors"
                      data-ocid={`partners.reject_button.${i + 1}`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const _TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "pipeline", label: "Lead Pipeline" },
  { id: "leadqualifications", label: "Lead Quals" },
  { id: "chatbot", label: "Chatbot" },
  { id: "feedback", label: "Feedback" },
  { id: "requests", label: "Requests" },
  { id: "support", label: "Support" },
  { id: "byservice", label: "By Service" },
  { id: "legaldocs", label: "Legal Docs" },
  { id: "propertyenquiries", label: "Property Enquiries" },
  { id: "manageproperties", label: "Manage Properties" },
  { id: "eventbookings", label: "Event Bookings" },
  { id: "watchlistalerts", label: "Watchlist Alerts" },
  { id: "csrmanagement", label: "CSR Management" },
  { id: "artistmanagement", label: "Artist Mgmt" },
  { id: "referrals", label: "Referrals" },
  { id: "settings", label: "⚙️ Settings" },
  { id: "team", label: "Team" },
  { id: "tools", label: "Tools" },
  { id: "legalforms", label: "Legal Library" },
  { id: "blog", label: "Blog" },
  { id: "partners", label: "Partners" },
  { id: "announcements", label: "Announcements" },
  { id: "reminders", label: "Reminders" },
];

const NotificationBell = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: count = BigInt(0) } = useUnreadCount();
  const { data: notifs = [] } = useNotifications();
  const { mutate: markAll } = useMarkAllRead();
  const unread = Number(count);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setNotifOpen(!notifOpen)}
        className="relative p-2 text-amber-400 hover:text-amber-300 transition-colors"
        title="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {notifOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0d1117] border border-amber-500/30 rounded-xl shadow-2xl z-[100]">
          <div className="flex items-center justify-between p-3 border-b border-amber-500/20">
            <span className="text-amber-400 font-semibold text-sm">
              Notifications
            </span>
            <button
              type="button"
              onClick={() => {
                markAll();
                setNotifOpen(false);
              }}
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifs.slice(0, 10).map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b border-gray-800/50 ${!n.isRead ? "bg-amber-950/20" : ""}`}
              >
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
              </div>
            ))}
            {notifs.length === 0 && (
              <p className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminPage() {
  const { isLoggedIn, logout, isTimedOut, resetTimer, continueSession } =
    useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [_mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const newEnquiryBadge = useNewEnquiryCount();
  const _newEnquiryBadgeCount = Number(newEnquiryBadge.data ?? BigInt(0));

  // Reset activity timer on every user interaction
  function handleActivity() {
    resetTimer();
  }

  if (!isLoggedIn && !isTimedOut) {
    return <AdminLogin />;
  }

  return (
    <div
      className="min-h-screen bg-obsidian-900 text-foreground flex flex-col"
      onClick={handleActivity}
      onKeyDown={handleActivity}
    >
      {/* Session timeout re-login modal */}
      {isTimedOut && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          data-ocid="admin.session_timeout.dialog"
        >
          <div className="w-full max-w-sm rounded-2xl border border-gold-700/40 bg-card p-8 shadow-2xl">
            <div className="text-center mb-6">
              <Shield size={28} className="text-gold-400 mx-auto mb-3" />
              <h2 className="font-serif text-xl font-bold gold-text">
                Session Expired
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Your session timed out after 15 minutes of inactivity.
              </p>
            </div>
            <SessionReLoginForm onSuccess={continueSession} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Sticky Dashboard Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-gold-700/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-yellow-400 hover:bg-white/10"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <a
                href="/apps"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-700/40 text-gold-400 hover:bg-gold-700/10 transition-colors text-sm"
                data-ocid="admin.all_apps_button"
                aria-label="All Apps"
              >
                <Grid3x3 size={15} /> All Apps
              </a>
              <Shield size={20} className="text-gold-400" />
              <span className="font-serif font-bold text-lg gold-text tracking-wider">
                MSTC GLOBAL Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <AINetworkStats />
              <NotificationBell />
              <span className="text-xs text-muted-foreground hidden sm:block">
                love@mstc
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-700/40 text-gold-400 hover:bg-gold-700/10 transition-colors text-sm"
                data-ocid="admin.logout_button"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Tab Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as TabId);
            setMobileSidebarOpen(false);
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "pipeline" && <LeadPipelineTab />}
          {activeTab === "leadqualifications" && <LeadQualificationsTab />}
          {activeTab === "chatbot" && <ChatbotTab />}
          {activeTab === "feedback" && <FeedbackTab />}
          {activeTab === "requests" && <RequestsTab />}
          {activeTab === "support" && <SupportTab />}
          {activeTab === "byservice" && <ByServiceTab />}
          {activeTab === "legaldocs" && <LegalDocsTab />}
          {activeTab === "propertyenquiries" && <PropertyEnquiriesTab />}
          {activeTab === "manageproperties" && <ManagePropertiesTab />}
          {activeTab === "eventbookings" && <EventBookingsTab />}
          {activeTab === "watchlistalerts" && <WatchlistAlertsTab />}
          {activeTab === "csrmanagement" && <CSRManagementTab />}
          {activeTab === "artistmanagement" && <ArtistManagementTab />}
          {activeTab === "referrals" && <ReferralsTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "team" && <AdminStaffManagementTab />}
          {activeTab === "tools" && <AdminDashboardToolsTab />}
          {activeTab === "legalforms" && <AdminLegalFormsTab />}
          {activeTab === "blog" && <AdminBlogTab />}
          {activeTab === "partners" && <AdminPartnersTab />}
          {activeTab === "announcements" && <AdminAnnouncementsTab />}
          {activeTab === "reminders" && <AdminRemindersTab />}
          {activeTab === "agents" && <AdminAgentsConfigTab />}
          {activeTab === "ai-manager" && <AdminAIManagerTab />}
          {activeTab === "dashboard-enhancer" && <AdminDashboardEnhancerTab />}
          {activeTab === "security" && <AdminSecurityTab />}
          {activeTab === "feature-suggestions" && (
            <AdminFeatureSuggestionsTab />
          )}
          {activeTab === "admin-ai" && <AdminDashboardAIAssistant />}
          {activeTab === "market-data" && <AdminMarketDataTab />}
          {activeTab === "lead-coordination" && <AdminLeadCoordinationTab />}
          {activeTab === "ai-god-tier" && <AdminGodTierTab />}
          {activeTab === "ai-agent-browser" && <AdminAgentBrowserTab />}
          {activeTab === "ai-localities" && <AdminLocalityIntelligenceTab />}
          {activeTab === "ai-segments" && <AdminSegmentIntelligenceTab />}
          {activeTab === "ai-neural" && <AdminNeuralVisualizerTab />}
          {activeTab === "ai-automation" && <AdminAutomationCenterTab />}
          {activeTab === "ai-expansion" && <AdminExpansionHubTab />}
          {activeTab === "ai-quality" && <AdminQualitySecurityTab />}
          {activeTab === "ai-knowledge" && <AdminKnowledgeCenterTab />}
          {activeTab === "ai-continuous" && <AdminContinuousImprovementTab />}
          {activeTab === "ai-command-center" && <AdminAICommandCenterTab />}
          {activeTab === "new-clusters" && <AdminNewClustersTab />}
          {activeTab === "ai-staff-directory" && <AdminAIStaffDirectory />}
          {activeTab === "ai-network-map" && <AdminAINetworkMap />}
          {activeTab === "ai-neural-lab" && <AdminNeuralLabTab />}
          {activeTab === "ai-learning-center" && <AdminLearningCenterTab />}
          {activeTab === "tutorial-manager" && (
            <Suspense
              fallback={
                <div className="p-8 text-center text-muted-foreground">
                  Loading Tutorial Manager…
                </div>
              }
            >
              <AdminTutorialManagerTab />
            </Suspense>
          )}
        </main>
      </div>
      {/* Always-visible AI Activity Bar at bottom of dashboard */}
      <AIActivityBar />
    </div>
  );
}
