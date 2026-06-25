import {
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  MessageSquare,
  Shield,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

type TabId = "password" | "biometric" | "otp";

const MSTC_AUTH_KEY = "mstc_internal_auth";
const _VALID_USER = "love@mstc";
const _VALID_PASS = "Lovemstc@2019";

function checkAuth(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(MSTC_AUTH_KEY) === "authenticated";
}

function setAuth() {
  sessionStorage.setItem(MSTC_AUTH_KEY, "authenticated");
}

interface SecureAppGateProps {
  children: ReactNode;
  appName?: string;
}

export default function SecureAppGate({
  children,
  appName,
}: SecureAppGateProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [checked, setChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("password");

  // Password tab
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  // Biometric tab
  const [bioLoading, setBioLoading] = useState(false);
  const [bioError, setBioError] = useState("");

  // OTP tab
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  const auth = useAdminAuth();
  const DEMO_PHONE = "+91 9512609016";

  useEffect(() => {
    setIsAuth(checkAuth());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setTimeout(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (auth.isLocked) {
      setPwError(`Account locked. ${auth.lockoutRemaining} min(s) remaining.`);
      return;
    }
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = auth.loginWithPassword(username, password);
    if (result.ok) {
      setAuth();
      setIsAuth(true);
    } else {
      setPwError(result.reason ?? "Invalid credentials.");
    }
    setPwLoading(false);
  }

  async function handleBiometric() {
    setBioLoading(true);
    setBioError("");
    const result = await auth.loginWithBiometric();
    if (result.ok) {
      setAuth();
      setIsAuth(true);
    } else {
      setBioError(result.reason ?? "Biometric failed.");
    }
    setBioLoading(false);
  }

  function handleSendOTP() {
    setOtpError("");
    const result = auth.sendOTP(DEMO_PHONE);
    if (result.ok) {
      setOtpSent(true);
      setOtpCooldown(120);
      alert(
        `DEMO OTP Code: ${result.code}\n(In production this sends via SMS)`,
      );
    } else {
      setOtpError(result.reason ?? "Failed to send OTP.");
    }
  }

  function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");
    const result = auth.verifyOTP(DEMO_PHONE, otpInput);
    if (result.ok) {
      setAuth();
      setIsAuth(true);
    } else {
      setOtpError(result.reason ?? "Invalid OTP.");
    }
    setOtpLoading(false);
  }

  if (!checked) return null;
  if (isAuth) return <>{children}</>;

  type TabMeta = { id: TabId; label: string; icon: React.ReactNode };
  const ALL_TABS: TabMeta[] = [
    { id: "password", label: "Password", icon: <Lock size={14} /> },
    { id: "biometric", label: "Fingerprint", icon: <Fingerprint size={14} /> },
    { id: "otp", label: "Mobile OTP", icon: <MessageSquare size={14} /> },
  ];
  const visibleTabs = auth.firstLoginDone
    ? ALL_TABS
    : ALL_TABS.filter((t) => t.id === "password");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#06090f] px-4 py-8"
      data-ocid="secure_gate.page"
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-md shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-16 h-16 rounded-full border-2 border-primary/60 bg-primary/10 flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary tracking-wide text-center">
              MSTC GLOBAL
            </h1>
            <p className="font-sans text-xs text-muted-foreground mt-1 tracking-widest uppercase">
              {appName ?? "Secure Access"}
            </p>
          </div>

          {/* Tab bar — only visible after first login */}
          {visibleTabs.length > 1 && (
            <div
              className="flex rounded-xl border border-primary/20 bg-background/40 p-1 mb-6"
              data-ocid="secure_gate.tabs"
            >
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPwError("");
                    setBioError("");
                    setOtpError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-sans font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`secure_gate.tab.${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab 1: Password */}
          {activeTab === "password" && (
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col gap-4"
              data-ocid="secure_gate.password_form"
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="love@mstc"
                  className="w-full bg-card border border-border/60 rounded-xl px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                  data-ocid="secure_gate.username_input"
                  autoComplete="username"
                  disabled={auth.isLocked}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-card border border-border/60 rounded-xl px-4 py-3 pr-12 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                    data-ocid="secure_gate.password_input"
                    autoComplete="current-password"
                    disabled={auth.isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    data-ocid="secure_gate.toggle_password_button"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {auth.isLocked && (
                <div
                  className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
                  data-ocid="secure_gate.locked_state"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="font-sans text-xs text-red-400">
                    Account locked. {auth.lockoutRemaining} minute(s) remaining.
                  </p>
                </div>
              )}

              {pwError && (
                <div
                  className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
                  data-ocid="secure_gate.error_state"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="font-sans text-xs text-red-400">{pwError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={pwLoading || auth.isLocked}
                className="w-full py-3.5 rounded-xl bg-primary text-[#06090f] font-sans font-semibold text-sm tracking-wide hover:opacity-90 transition-all duration-200 disabled:opacity-60 shadow-lg mt-1"
                data-ocid="secure_gate.submit_button"
              >
                {pwLoading ? "Verifying..." : "Access"}
              </button>
            </form>
          )}

          {/* Tab 2: Fingerprint */}
          {activeTab === "biometric" && (
            <div
              className="flex flex-col items-center gap-5 py-4"
              data-ocid="secure_gate.biometric_section"
            >
              <div className="text-center">
                <p className="font-sans text-sm text-muted-foreground">
                  Touch the sensor to authenticate
                </p>
                <p className="font-sans text-xs text-muted-foreground/60 mt-1">
                  Must be enrolled by admin first
                </p>
              </div>
              <button
                type="button"
                onClick={handleBiometric}
                disabled={bioLoading}
                className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                  bioLoading
                    ? "border-primary/60 bg-primary/10 scale-95"
                    : "border-primary/40 bg-primary/5 hover:bg-primary/15 hover:border-primary/70 hover:scale-105 active:scale-95"
                }`}
                data-ocid="secure_gate.biometric_button"
                aria-label="Authenticate with fingerprint"
              >
                <Fingerprint
                  className={`w-16 h-16 transition-colors ${
                    bioLoading
                      ? "text-primary animate-pulse"
                      : "text-primary/80"
                  }`}
                />
                <span className="font-sans text-xs text-muted-foreground">
                  {bioLoading ? "Checking..." : "Touch Sensor"}
                </span>
              </button>
              {bioError && (
                <div
                  className="w-full flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
                  data-ocid="secure_gate.biometric_error_state"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="font-sans text-xs text-red-400">{bioError}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Mobile OTP */}
          {activeTab === "otp" && (
            <div
              className="flex flex-col gap-4"
              data-ocid="secure_gate.otp_section"
            >
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="font-sans text-xs text-muted-foreground mb-1">
                  Sending OTP to:
                </p>
                <p className="font-sans text-sm font-medium text-primary">
                  {DEMO_PHONE}
                </p>
                <p className="font-sans text-[10px] text-muted-foreground/60 mt-0.5">
                  Number set by admin only
                </p>
              </div>

              {!otpSent ? (
                <>
                  {otpError && (
                    <div
                      className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
                      data-ocid="secure_gate.otp_error_state"
                    >
                      <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <p className="font-sans text-xs text-red-400">
                        {otpError}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpCooldown > 0}
                    className="w-full py-3 rounded-xl bg-primary text-[#06090f] font-sans font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                    data-ocid="secure_gate.send_otp_button"
                  >
                    {otpCooldown > 0
                      ? `Resend in ${otpCooldown}s`
                      : "Send OTP Code"}
                  </button>
                </>
              ) : (
                <form
                  onSubmit={handleVerifyOTP}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) =>
                        setOtpInput(
                          e.target.value.replace(/\D/g, "").slice(0, 4),
                        )
                      }
                      placeholder="0000"
                      maxLength={4}
                      className="w-full bg-card border border-border/60 rounded-xl px-4 py-3 font-mono text-2xl text-center text-foreground tracking-[0.5em] placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 transition-all"
                      data-ocid="secure_gate.otp_input"
                      autoComplete="one-time-code"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpCooldown > 0}
                      className="font-sans text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                      data-ocid="secure_gate.resend_otp_button"
                    >
                      {otpCooldown > 0
                        ? `Resend in ${otpCooldown}s`
                        : "Resend OTP"}
                    </button>
                    <p className="font-sans text-xs text-muted-foreground/60">
                      Valid for 2 minutes
                    </p>
                  </div>
                  {otpError && (
                    <div
                      className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5"
                      data-ocid="secure_gate.otp_error_state"
                    >
                      <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <p className="font-sans text-xs text-red-400">
                        {otpError}
                      </p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={otpInput.length < 4 || otpLoading}
                    className="w-full py-3.5 rounded-xl bg-primary text-[#06090f] font-sans font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-lg"
                    data-ocid="secure_gate.verify_otp_button"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="font-sans text-xs text-muted-foreground/50 text-center mt-6">
            Authorized access only. All activity is monitored and logged.
          </p>
        </div>

        <p className="text-center font-sans text-xs text-muted-foreground/30 mt-6">
          © {new Date().getFullYear()} MSTC GLOBAL — Private & Confidential
        </p>
      </div>
    </div>
  );
}
