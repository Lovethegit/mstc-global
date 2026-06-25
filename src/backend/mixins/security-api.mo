import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import SecurityTypes "../types/security";

mixin (
  deviceRecords : List.List<SecurityTypes.DeviceRecord>,
  canaryTokens : List.List<SecurityTypes.CanaryToken>,
  threatIntel : List.List<SecurityTypes.ThreatIntelEntry>,
  securityApiState : { var nextDeviceCounter : Nat; var nextCanaryCounter : Nat; var nextThreatCounter : Nat },
  auditLog : List.List<SecurityTypes.AuditEntry>,
  richSecurityEvents : List.List<SecurityTypes.RichSecurityEvent>,
  observerCodeInfos : List.List<SecurityTypes.ObserverCodeInfo>,
  secState2 : { var nextAuditCounter : Nat; var nextRichEventCounter : Nat; var threatsBlockedCount : Nat }
) {

  // ─── Device Registry ────────────────────────────────────────────────────────

  /// Register a new device; if already registered, update last-seen and return existing.
  public shared ({ caller }) func registerDevice(
    staffId : Text,
    deviceId : Text,
    userAgent : Text,
    ipAddress : Text
  ) : async { #ok : SecurityTypes.DeviceRecord; #err : Text } {
    ignore caller;
    switch (deviceRecords.find(func(d : SecurityTypes.DeviceRecord) : Bool {
      d.staffId == staffId and d.deviceId == deviceId
    })) {
      case (?existing) {
        // Update last-seen; trust score increases slightly per successful registration
        var updated : SecurityTypes.DeviceRecord = existing;
        deviceRecords.mapInPlace(func(d : SecurityTypes.DeviceRecord) : SecurityTypes.DeviceRecord {
          if (d.staffId == staffId and d.deviceId == deviceId) {
            let newScore = if (d.trustScore >= 98) 100 else d.trustScore + 2;
            let u = { d with lastSeenAt = Time.now(); ipAddress; trustScore = newScore };
            updated := u;
            u
          } else { d }
        });
        #ok(updated)
      };
      case null {
        securityApiState.nextDeviceCounter += 1;
        let record : SecurityTypes.DeviceRecord = {
          id = "dev-" # securityApiState.nextDeviceCounter.toText();
          staffId;
          deviceId;
          userAgent;
          ipAddress;
          registeredAt = Time.now();
          lastSeenAt = Time.now();
          status = #pending;
          trustScore = 30; // starts low, must be approved
        };
        deviceRecords.add(record);
        #ok(record)
      };
    }
  };

  public query func listDevices(staffId : Text) : async [SecurityTypes.DeviceRecord] {
    let arr = deviceRecords.toArray();
    arr.filter<SecurityTypes.DeviceRecord>(func(d) { d.staffId == staffId })
  };

  public query func getAllDevices() : async [SecurityTypes.DeviceRecord] {
    deviceRecords.toArray()
  };

  /// Approve a pending device (admin action).
  public shared ({ caller }) func approveDevice(
    staffId : Text,
    deviceId : Text
  ) : async { #ok : SecurityTypes.DeviceRecord; #err : Text } {
    ignore caller;
    var updated : ?SecurityTypes.DeviceRecord = null;
    deviceRecords.mapInPlace(func(d : SecurityTypes.DeviceRecord) : SecurityTypes.DeviceRecord {
      if (d.staffId == staffId and d.deviceId == deviceId) {
        let u = { d with status = #trusted; trustScore = 80 };
        updated := ?u;
        u
      } else { d }
    });
    switch (updated) {
      case (?r) { #ok(r) };
      case null { #err("Device not found") };
    }
  };

  /// Revoke a device (admin action).
  public shared ({ caller }) func revokeDevice(
    staffId : Text,
    deviceId : Text
  ) : async { #ok : SecurityTypes.DeviceRecord; #err : Text } {
    ignore caller;
    var updated : ?SecurityTypes.DeviceRecord = null;
    deviceRecords.mapInPlace(func(d : SecurityTypes.DeviceRecord) : SecurityTypes.DeviceRecord {
      if (d.staffId == staffId and d.deviceId == deviceId) {
        let u = { d with status = #revoked; trustScore = 0 };
        updated := ?u;
        u
      } else { d }
    });
    switch (updated) {
      case (?r) { #ok(r) };
      case null { #err("Device not found") };
    }
  };

  /// Check if a device is trusted for a given staff member.
  public query func isDeviceTrusted(staffId : Text, deviceId : Text) : async Bool {
    switch (deviceRecords.find(func(d : SecurityTypes.DeviceRecord) : Bool {
      d.staffId == staffId and d.deviceId == deviceId
    })) {
      case (?d) { d.status == #trusted };
      case null { false };
    }
  };

  // ─── Canary Tokens ───────────────────────────────────────────────────────────

  public shared ({ caller }) func plantCanaryToken(
    tokenLabel : Text,
    tokenValue : Text
  ) : async { #ok : SecurityTypes.CanaryToken; #err : Text } {
    ignore caller;
    securityApiState.nextCanaryCounter += 1;
    let token : SecurityTypes.CanaryToken = {
      id = "canary-" # securityApiState.nextCanaryCounter.toText();
      tokenLabel = tokenLabel;
      tokenValue;
      createdAt = Time.now();
      triggeredAt = null;
      triggeredBy = "";
      isTriggered = false;
    };
    canaryTokens.add(token);
    #ok(token)
  };

  /// Call this when a canary token is used — triggers alert recording.
  public shared ({ caller }) func triggerCanary(
    tokenValue : Text,
    triggeredBy : Text
  ) : async { #ok : SecurityTypes.CanaryToken; #err : Text } {
    ignore caller;
    var updated : ?SecurityTypes.CanaryToken = null;
    canaryTokens.mapInPlace(func(t : SecurityTypes.CanaryToken) : SecurityTypes.CanaryToken {
      if (t.tokenValue == tokenValue and not t.isTriggered) {
        let u = { t with isTriggered = true; triggeredAt = ?Time.now(); triggeredBy };
        updated := ?u;
        u
      } else { t }
    });
    switch (updated) {
      case (?t) { #ok(t) };
      case null { #err("Canary token not found or already triggered") };
    }
  };

  public query func listCanaryTokens() : async [SecurityTypes.CanaryToken] {
    canaryTokens.toArray()
  };

  public query func getTriggeredCanaries() : async [SecurityTypes.CanaryToken] {
    let arr = canaryTokens.toArray();
    arr.filter<SecurityTypes.CanaryToken>(func(t) { t.isTriggered })
  };

  // ─── Threat Intelligence ─────────────────────────────────────────────────────

  public shared ({ caller }) func addThreatEntry(
    ipAddress : Text,
    reason : Text,
    severity : Text
  ) : async { #ok : SecurityTypes.ThreatIntelEntry; #err : Text } {
    ignore caller;
    securityApiState.nextThreatCounter += 1;
    let entry : SecurityTypes.ThreatIntelEntry = {
      id = "threat-" # securityApiState.nextThreatCounter.toText();
      ipAddress;
      reason;
      severity;
      detectedAt = Time.now();
      isBlocked = true;
    };
    threatIntel.add(entry);
    #ok(entry)
  };

  public query func getThreatIntel(limit : Nat) : async [SecurityTypes.ThreatIntelEntry] {
    let arr = threatIntel.toArray();
    let sz = arr.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count = sz - start;
    Array.tabulate<SecurityTypes.ThreatIntelEntry>(count, func(i) { arr[start + i] })
  };

  public query func isIpBlocked(ipAddress : Text) : async Bool {
    threatIntel.find(func(e : SecurityTypes.ThreatIntelEntry) : Bool {
      e.ipAddress == ipAddress and e.isBlocked
    }) != null
  };

  // ─── Audit Log ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func logAuditEvent(
    actorId : Text,
    action : Text,
    target : Text,
    details : Text,
    ip : Text,
    result : Text
  ) : async Text {
    ignore caller;
    secState2.nextAuditCounter += 1;
    let id = "audit-" # secState2.nextAuditCounter.toText();
    let entry : SecurityTypes.AuditEntry = {
      id;
      timestamp = Time.now();
      actorId;
      action;
      target;
      details;
      ipAddress = ip;
      result;
    };
    auditLog.add(entry);
    id
  };

  /// Returns most recent N audit entries (most recent first).
  /// Returns most recent N rich audit entries (most recent first) from security extended log.
  public query func getSecurityAuditLog(limit : Nat) : async [SecurityTypes.AuditEntry] {
    let all = auditLog.toArray();
    let sz = all.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count = sz - start;
    let slice = Array.tabulate(count, func(i) { all[start + i] });
    let len = slice.size();
    Array.tabulate<SecurityTypes.AuditEntry>(len, func(i) { slice[len - 1 - i] })
  };

  public query func getAuditLogByActor(actorId : Text) : async [SecurityTypes.AuditEntry] {
    let all = auditLog.toArray();
    let filtered = all.filter(func(e) { e.actorId == actorId });
    let len = filtered.size();
    // most-recent-first
    Array.tabulate<SecurityTypes.AuditEntry>(len, func(i) { filtered[len - 1 - i] })
  };

  public shared ({ caller }) func clearOldAuditEntries(beforeTimestamp : Int) : async Nat {
    ignore caller;
    let before = auditLog.size();
    auditLog.retain(func(e : SecurityTypes.AuditEntry) : Bool { e.timestamp >= beforeTimestamp });
    before - auditLog.size()
  };

  // ─── Rich Security Events ────────────────────────────────────────────────

  public shared ({ caller }) func recordSecurityEvent(
    eventType : Text,
    severity : Text,
    description : Text,
    ip : Text,
    aiTierId : Text
  ) : async Text {
    ignore caller;
    secState2.nextRichEventCounter += 1;
    let id = "sevt-" # secState2.nextRichEventCounter.toText();
    // Count threats blocked if severity is high or critical
    if (severity == "high" or severity == "critical") {
      secState2.threatsBlockedCount += 1;
    };
    let ev : SecurityTypes.RichSecurityEvent = {
      id;
      timestamp = Time.now();
      eventType;
      severity;
      description;
      sourceIp = ip;
      resolved = false;
      resolvedAt = null;
      aiTierId;
    };
    richSecurityEvents.add(ev);
    id
  };

  public query func getRichSecurityEvents(limit : Nat) : async [SecurityTypes.RichSecurityEvent] {
    let all = richSecurityEvents.toArray();
    let sz = all.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count = sz - start;
    let slice = Array.tabulate(count, func(i) { all[start + i] });
    let len = slice.size();
    Array.tabulate<SecurityTypes.RichSecurityEvent>(len, func(i) { slice[len - 1 - i] })
  };

  public shared ({ caller }) func resolveSecurityEvent(id : Text) : async Bool {
    ignore caller;
    var found = false;
    richSecurityEvents.mapInPlace(func(e : SecurityTypes.RichSecurityEvent) : SecurityTypes.RichSecurityEvent {
      if (e.id == id and not e.resolved) {
        found := true;
        { e with resolved = true; resolvedAt = ?Time.now() }
      } else { e }
    });
    found
  };

  public query func getSecurityStats() : async { totalEvents : Nat; criticalCount : Nat; resolvedCount : Nat; threatsBlocked : Nat } {
    let all = richSecurityEvents.toArray();
    var criticalCount : Nat = 0;
    var resolvedCount : Nat = 0;
    for (ev in all.vals()) {
      if (ev.severity == "critical") { criticalCount += 1 };
      if (ev.resolved) { resolvedCount += 1 };
    };
    {
      totalEvents = all.size();
      criticalCount;
      resolvedCount;
      threatsBlocked = secState2.threatsBlockedCount;
    }
  };

  // ─── Observer Code Info (enhanced schema) ─────────────────────────────────

  public shared ({ caller }) func generateObserverCodeInfo(
    codeLabel : Text,
    adminToken : Text,
    expiresIn : ?Int,
    singleUse : Bool,
    scope : [Text]
  ) : async Text {
    ignore (caller, adminToken);
    let now = Time.now();
    let code = "OBS2-" # Nat.toText(Int.abs(now) % 1_000_000_000);
    let expiresAt : ?Int = switch (expiresIn) {
      case (?secs) { ?(now + secs * 1_000_000_000) };
      case null { null };
    };
    let info : SecurityTypes.ObserverCodeInfo = {
      code;
      codeLabel = codeLabel;
      createdBy = adminToken;
      createdAt = now;
      expiresAt;
      singleUse;
      used = false;
      usedAt = null;
      usedBy = null;
      scope;
      active = true;
    };
    observerCodeInfos.add(info);
    code
  };

  public shared ({ caller }) func validateObserverCodeInfo(code : Text, visitorInfo : Text) : async Bool {
    ignore caller;
    let now = Time.now();
    var valid = false;
    observerCodeInfos.mapInPlace(func(c : SecurityTypes.ObserverCodeInfo) : SecurityTypes.ObserverCodeInfo {
      if (c.code == code and c.active) {
        let notExpired = switch (c.expiresAt) {
          case (?exp) { exp > now };
          case null { true };
        };
        let notUsedSingleUse = not (c.singleUse and c.used);
        if (notExpired and notUsedSingleUse) {
          valid := true;
          if (c.singleUse) {
            { c with used = true; usedAt = ?now; usedBy = ?visitorInfo }
          } else {
            { c with usedAt = ?now; usedBy = ?visitorInfo }
          }
        } else { c }
      } else { c }
    });
    valid
  };

  public shared ({ caller }) func revokeObserverCodeInfo(code : Text, adminToken : Text) : async Bool {
    ignore (caller, adminToken);
    var found = false;
    observerCodeInfos.mapInPlace(func(c : SecurityTypes.ObserverCodeInfo) : SecurityTypes.ObserverCodeInfo {
      if (c.code == code) { found := true; { c with active = false } } else { c }
    });
    found
  };

  public query func listObserverCodeInfos(adminToken : Text) : async [SecurityTypes.ObserverCodeInfo] {
    ignore adminToken;
    observerCodeInfos.toArray()
  };

  // ─── Security Health Report ──────────────────────────────────────────────────

  /// Generate a security health report from current device and threat data.
  public query func getSecurityHealthReport(
    activeSessionCount : Nat,
    suspendedAccountCount : Nat,
    pendingBiometricCount : Nat,
    failedLoginsLast24h : Nat,
    lockoutsLast24h : Nat
  ) : async SecurityTypes.SecurityHealthReport {
    let threatsBlocked = threatIntel.toArray().filter(func(e) { e.isBlocked }).size();
    let canaryTriggered = canaryTokens.toArray().find<SecurityTypes.CanaryToken>(func(t) { t.isTriggered }) != null;

    var score : Nat = 100;
    let penaltyFailed = failedLoginsLast24h * 2;
    let penaltyLockouts = lockoutsLast24h * 5;
    let penaltySuspended = suspendedAccountCount * 3;
    let penaltyCanary : Nat = if (canaryTriggered) { 15 } else { 0 };
    let total = penaltyFailed + penaltyLockouts + penaltySuspended + penaltyCanary;
    score := if (total >= score) { 5 } else { score - total };

    let recommendations : [Text] = [
      if (failedLoginsLast24h > 10) "High failed login rate — review brute force settings" else "",
      if (lockoutsLast24h > 0) "Accounts locked — review lockout policy" else "",
      if (canaryTriggered) "ALERT: Canary token triggered — investigate immediately" else "",
      if (pendingBiometricCount > 0) "Pending biometric approvals awaiting admin action" else "",
      if (threatsBlocked > 50) "High threat volume — consider IP geofencing" else ""
    ];
    let filtered = recommendations.filter(func(r) { r != "" });

    {
      generatedAt = Time.now();
      overallScore = score;
      failedLoginsLast24h;
      lockoutsLast24h;
      activeSessions = activeSessionCount;
      suspendedAccounts = suspendedAccountCount;
      pendingBiometrics = pendingBiometricCount;
      threatsBlocked;
      canaryTriggered;
      recommendations = filtered;
    }
  };
};
