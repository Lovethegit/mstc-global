import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "mstc_admin_auth";
const FIRST_LOGIN_KEY = "mstc_first_login_done";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;
const SESSIONS_KEY = "mstc_sessions";
const AUDIT_KEY = "mstc_audit_log";

export type LoginMode = "password" | "biometric" | "otp";

export interface SessionRecord {
  id: string;
  staffId: string;
  name: string;
  device: string;
  ip: string;
  activity: string;
  startedAt: number;
  lastActivity: number;
}

export interface AuditEntry {
  id: string;
  ts: number;
  staff: string;
  action: string;
  ip: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

function getStoredAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getFirstLoginDone(): boolean {
  try {
    return localStorage.getItem(FIRST_LOGIN_KEY) === "true";
  } catch {
    return false;
  }
}

function generateOTPCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function getClientIP(): string {
  return "103.45.67.89";
}

function getDeviceName(): string {
  if (typeof navigator === "undefined") return "Unknown Device";
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return "Safari / iPhone";
  if (/iPad/i.test(ua)) return "Safari / iPad";
  if (/Android/i.test(ua)) return "Chrome / Android";
  if (/Macintosh/i.test(ua)) return "Chrome / Mac";
  if (/Windows/i.test(ua)) return "Chrome / Windows";
  return "Browser / Desktop";
}

function getSessions(): SessionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionRecord[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
}

function getAuditLog(): AuditEntry[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAuditLog(log: AuditEntry[]) {
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(-500)));
  } catch {
    /* ignore */
  }
}

function appendAudit(
  staff: string,
  action: string,
  details: string,
  severity: AuditEntry["severity"] = "info",
) {
  const log = getAuditLog();
  log.push({
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    ts: Date.now(),
    staff,
    action,
    ip: getClientIP(),
    details,
    severity,
  });
  saveAuditLog(log);
}

/**
 * MSTC GLOBAL Admin Auth Hook
 * Supports: password | biometric (WebAuthn) | OTP
 * 15-minute session timeout, 5 failed attempt lockout.
 */
export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getStoredAuth);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [firstLoginDone, setFirstLoginDone] =
    useState<boolean>(getFirstLoginDone);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<LoginMode>("password");
  const [isLockedDown, setIsLockedDown] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("mstc_lockdown") === "true",
  );
  // OTP state
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLockedUntil, setOtpLockedUntil] = useState<number>(0);
  // Biometric
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(setBiometricAvailable)
        .catch(() => setBiometricAvailable(false));
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setIsTimedOut(true),
      SESSION_TIMEOUT_MS,
    );
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isTimedOut) startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoggedIn, isTimedOut, startTimer]);

  function resetTimer() {
    if (isLoggedIn && !isTimedOut) startTimer();
  }

  function markSuccessfulLogin(staffName = "Love Parekh", sid?: string) {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    const newSid =
      sid ?? `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    // Register session record
    const sessions = getSessions().filter((s) => s.id !== newSid);
    sessions.push({
      id: newSid,
      staffId: "love@mstc",
      name: staffName,
      device: getDeviceName(),
      ip: getClientIP(),
      activity: "Logged in",
      startedAt: Date.now(),
      lastActivity: Date.now(),
    });
    saveSessions(sessions);
    appendAudit(staffName, "Login successful", "Session started", "info");
    setSessionId(newSid);
    setFailedAttempts(0);
    setIsLoggedIn(true);
    setIsTimedOut(false);
    startTimer();
  }

  function markFirstLoginDoneInternal() {
    try {
      localStorage.setItem(FIRST_LOGIN_KEY, "true");
    } catch {
      /* ignore */
    }
    setFirstLoginDone(true);
  }

  /** Option 1 — ID + Password */
  function loginWithPassword(
    id: string,
    password: string,
  ): { ok: boolean; reason?: string } {
    const now = Date.now();
    if (isLockedDown) {
      return {
        ok: false,
        reason: "Platform is in emergency lockdown. Contact admin.",
      };
    }
    if (lockedUntil > now) {
      const mins = Math.ceil((lockedUntil - now) / 60000);
      appendAudit(id, "Login blocked", "Account locked", "warning");
      return {
        ok: false,
        reason: `Account locked. Try again in ${mins} minute(s).`,
      };
    }
    if (id === "love@mstc" && password === "Lovemstc@2019") {
      markSuccessfulLogin("Love Parekh");
      if (!firstLoginDone) markFirstLoginDoneInternal();
      return { ok: true };
    }
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    appendAudit(
      id,
      "Login failed",
      `Wrong password attempt ${newAttempts}`,
      "warning",
    );
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      setLockedUntil(now + LOCKOUT_MS);
      setFailedAttempts(0);
      appendAudit(id, "Account locked", "Exceeded max attempts", "critical");
      return {
        ok: false,
        reason:
          "Too many failed attempts. Account locked for 30 minutes. Contact admin.",
      };
    }
    return {
      ok: false,
      reason: `Incorrect ID or password. ${MAX_FAILED_ATTEMPTS - newAttempts} attempt(s) remaining.`,
    };
  }

  /** Option 2 — WebAuthn Biometric */
  async function loginWithBiometric(): Promise<{
    ok: boolean;
    reason?: string;
  }> {
    if (!biometricAvailable) {
      return {
        ok: false,
        reason: "Biometric authentication is not available on this device.",
      };
    }
    try {
      const storedCredId = localStorage.getItem("mstc_biometric_cred_id");
      if (!storedCredId) {
        return {
          ok: false,
          reason:
            "No biometric registered. Please use ID + Password to log in.",
        };
      }
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          rpId: window.location.hostname,
          allowCredentials: [
            {
              id: Uint8Array.from(atob(storedCredId), (c) => c.charCodeAt(0)),
              type: "public-key" as PublicKeyCredentialType,
            },
          ],
          userVerification: "required",
        },
      };
      const assertion = await navigator.credentials.get(
        credentialRequestOptions,
      );
      if (assertion) {
        markSuccessfulLogin("Love Parekh");
        appendAudit(
          "Love Parekh",
          "Biometric login",
          "WebAuthn assertion verified",
          "info",
        );
        return { ok: true };
      }
      appendAudit(
        "unknown",
        "Biometric failed",
        "Assertion returned null",
        "warning",
      );
      return { ok: false, reason: "Fingerprint not recognized. Try again." };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        return {
          ok: false,
          reason: "Fingerprint scan was cancelled. Try again.",
        };
      }
      return {
        ok: false,
        reason:
          "Fingerprint authentication failed. Please use password instead.",
      };
    }
  }

  /** Register biometric (Owner only — from OwnerControlCenter) */
  async function registerBiometric(staffId?: string): Promise<{
    ok: boolean;
    credentialId?: string;
    reason?: string;
  }> {
    if (!biometricAvailable) {
      return { ok: false, reason: "Platform authenticator not available." };
    }
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: { name: "MSTC GLOBAL Admin", id: window.location.hostname },
          user: {
            id: userId,
            name: staffId ?? "love@mstc",
            displayName:
              staffId === "love@mstc"
                ? "Love Parekh (MD)"
                : (staffId ?? "Staff"),
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" as PublicKeyCredentialType },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false,
          },
          timeout: 60000,
        },
      };
      const credential = (await navigator.credentials.create(
        credentialCreationOptions,
      )) as PublicKeyCredential | null;
      if (credential) {
        const credId = btoa(
          String.fromCharCode(...new Uint8Array(credential.rawId)),
        );
        localStorage.setItem(
          `mstc_biometric_cred_id_${staffId ?? "owner"}`,
          credId,
        );
        if (!staffId || staffId === "love@mstc") {
          localStorage.setItem("mstc_biometric_cred_id", credId);
        }
        appendAudit(
          "Love Parekh",
          "Biometric enrolled",
          `Staff: ${staffId ?? "owner"} registered fingerprint`,
          "info",
        );
        return { ok: true, credentialId: credId };
      }
      return { ok: false, reason: "Registration failed. Try again." };
    } catch (err: unknown) {
      if (err instanceof Error) return { ok: false, reason: err.message };
      return { ok: false, reason: "Biometric registration failed." };
    }
  }

  /** Option 3 — Mobile OTP (4-digit, 2 min expiry) */
  function sendOTP(_phone?: string): {
    ok: boolean;
    code: string;
    reason?: string;
  } {
    const now = Date.now();
    if (otpLockedUntil > now) {
      const mins = Math.ceil((otpLockedUntil - now) / 60000);
      return {
        ok: false,
        code: "",
        reason: `OTP locked for ${mins} minute(s) due to too many failed attempts.`,
      };
    }
    const code = generateOTPCode();
    setOtpCode(code);
    setOtpExpiry(now + 2 * 60 * 1000);
    setOtpAttempts(0);
    appendAudit(
      "System",
      "OTP sent",
      "OTP dispatched to registered number",
      "info",
    );
    return { ok: true, code };
  }

  function verifyOTP(
    _phone: string,
    inputCode: string,
  ): { ok: boolean; reason?: string } {
    const now = Date.now();
    if (otpLockedUntil > now)
      return { ok: false, reason: "OTP locked. Too many failed attempts." };
    if (!otpCode)
      return {
        ok: false,
        reason: "No OTP generated. Please request a new one.",
      };
    if (now > otpExpiry) {
      setOtpCode(null);
      return {
        ok: false,
        reason: "OTP has expired. Please request a new one.",
      };
    }
    if (inputCode === otpCode) {
      setOtpCode(null);
      setOtpAttempts(0);
      markSuccessfulLogin("Love Parekh");
      appendAudit(
        "Love Parekh",
        "OTP login",
        "OTP verified successfully",
        "info",
      );
      return { ok: true };
    }
    const newAttempts = otpAttempts + 1;
    setOtpAttempts(newAttempts);
    appendAudit(
      "unknown",
      "OTP failed",
      `Wrong OTP attempt ${newAttempts}`,
      "warning",
    );
    if (newAttempts >= MAX_OTP_ATTEMPTS) {
      setOtpLockedUntil(now + LOCKOUT_MS);
      setOtpCode(null);
      appendAudit("unknown", "OTP locked", "Too many OTP failures", "critical");
      return {
        ok: false,
        reason: "Too many wrong attempts. Account locked for 30 minutes.",
      };
    }
    return {
      ok: false,
      reason: `Invalid OTP. ${MAX_OTP_ATTEMPTS - newAttempts} attempt(s) remaining.`,
    };
  }

  function continueSession() {
    setIsTimedOut(false);
    startTimer();
  }

  function logout(): void {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (sessionId) {
      const sessions = getSessions().filter((s) => s.id !== sessionId);
      saveSessions(sessions);
    }
    appendAudit("Love Parekh", "Logout", "Session ended by user", "info");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setIsLoggedIn(false);
    setIsTimedOut(false);
    setSessionId(null);
    setActiveMode("password");
  }

  /** Force-logout a specific session — owner action */
  function forceLogoutSession(sid: string): void {
    const sessions = getSessions().filter((s) => s.id !== sid);
    saveSessions(sessions);
    appendAudit(
      "Love Parekh",
      "Force logout",
      `Session ${sid.slice(0, 12)} terminated by owner`,
      "warning",
    );
  }

  /** Emergency lockdown */
  function emergencyLockdown(): void {
    setIsLockedDown(true);
    appendAudit(
      "Love Parekh",
      "EMERGENCY LOCKDOWN",
      "All staff sessions terminated. Platform locked.",
      "critical",
    );
    const sessions = getSessions().filter((s) => s.staffId === "love@mstc");
    saveSessions(sessions);
    try {
      localStorage.setItem("mstc_lockdown", "true");
    } catch {
      /* ignore */
    }
  }

  function liftLockdown(): void {
    setIsLockedDown(false);
    appendAudit(
      "Love Parekh",
      "Lockdown lifted",
      "Platform unlocked by owner",
      "info",
    );
    try {
      localStorage.removeItem("mstc_lockdown");
    } catch {
      /* ignore */
    }
  }

  function getActiveSessions(): SessionRecord[] {
    return getSessions();
  }

  function getAuditTrail(): AuditEntry[] {
    return getAuditLog().reverse();
  }

  const isLocked = lockedUntil > Date.now();
  const isOtpLocked = otpLockedUntil > Date.now();
  const lockoutRemaining =
    lockedUntil > Date.now()
      ? Math.ceil((lockedUntil - Date.now()) / 60000)
      : 0;
  const loginAttempts = failedAttempts;
  const isOwner = isLoggedIn && sessionId != null;

  /** Derive device ID from userAgent for session binding */
  const deviceId =
    typeof navigator !== "undefined"
      ? btoa(navigator.userAgent).slice(0, 32)
      : "unknown";

  /** Enroll biometric for a staff member — owner only */
  async function enrollBiometric(
    staffId: string,
  ): Promise<{ ok: boolean; reason?: string }> {
    if (!isOwner) return { ok: false, reason: "Owner access required." };
    return registerBiometric(staffId);
  }

  /** Verify biometric for a given staff member */
  async function verifyBiometric(
    _staffId: string,
  ): Promise<{ ok: boolean; reason?: string }> {
    return loginWithBiometric();
  }

  return {
    isLoggedIn,
    isTimedOut,
    isLocked,
    isOtpLocked,
    lockoutRemaining,
    loginAttempts,
    isOwner,
    deviceId,
    firstLoginDone,
    sessionId,
    activeMode,
    setActiveMode,
    biometricAvailable,
    isLockedDown,
    otpCode,
    // Auth functions
    loginWithPassword,
    loginWithBiometric,
    registerBiometric,
    enrollBiometric,
    verifyBiometric,
    sendOTP,
    verifyOTP,
    // Session & lockdown
    logout,
    resetTimer,
    continueSession,
    forceLogoutSession,
    emergencyLockdown,
    liftLockdown,
    getActiveSessions,
    getAuditTrail,
    // Legacy compat
    login: (id: string, pw: string) => loginWithPassword(id, pw).ok,
  };
}
