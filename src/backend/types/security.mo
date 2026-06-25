// Extended security types: device registry, canary tokens, threat intel, audit, rich events
module {
  // ─── Audit Log ─────────────────────────────────────────────────────────────
  public type AuditEntry = {
    id : Text;
    timestamp : Int;
    actorId : Text;
    action : Text;
    target : Text;
    details : Text;
    ipAddress : Text;
    result : Text;
  };

  // ─── Rich Security Events (text-based severity/type for frontend) ────────────
  public type RichSecurityEvent = {
    id : Text;
    timestamp : Int;
    eventType : Text;
    severity : Text;  // low | medium | high | critical
    description : Text;
    sourceIp : Text;
    resolved : Bool;
    resolvedAt : ?Int;
    aiTierId : Text;
  };

  // ─── Observer Code (enhanced schema) ────────────────────────────────────────
  public type ObserverCodeInfo = {
    code : Text;
    codeLabel : Text;
    createdBy : Text;
    createdAt : Int;
    expiresAt : ?Int;
    singleUse : Bool;
    used : Bool;
    usedAt : ?Int;
    usedBy : ?Text;
    scope : [Text];
    active : Bool;
  };

  // ─── Session Info (rich, text-based) ────────────────────────────────────────
  public type SessionInfo = {
    sessionToken : Text;
    staffId : Text;
    deviceInfo : Text;
    ipAddress : Text;
    loginTime : Int;
    lastActivity : Int;
  };

  public type DeviceStatus = {
    #trusted;
    #pending;
    #blocked;
    #revoked;
  };

  public type DeviceRecord = {
    id : Text;
    staffId : Text;
    deviceId : Text;
    userAgent : Text;
    ipAddress : Text;
    registeredAt : Int;
    lastSeenAt : Int;
    status : DeviceStatus;
    trustScore : Nat; // 0-100; increases with successful logins
  };

  public type CanaryToken = {
    id : Text;
    tokenLabel : Text;
    tokenValue : Text; // the planted value
    createdAt : Int;
    triggeredAt : ?Int;
    triggeredBy : Text;
    isTriggered : Bool;
  };

  public type ThreatIntelEntry = {
    id : Text;
    ipAddress : Text;
    reason : Text;
    severity : Text; // low | medium | high | critical
    detectedAt : Int;
    isBlocked : Bool;
  };

  public type SecurityHealthReport = {
    generatedAt : Int;
    overallScore : Nat; // 0-100
    failedLoginsLast24h : Nat;
    lockoutsLast24h : Nat;
    activeSessions : Nat;
    suspendedAccounts : Nat;
    pendingBiometrics : Nat;
    threatsBlocked : Nat;
    canaryTriggered : Bool;
    recommendations : [Text];
  };
};
