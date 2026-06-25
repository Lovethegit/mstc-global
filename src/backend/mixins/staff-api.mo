import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import StaffLib "../lib/staff";
import Types "../types/staff";
import Array "mo:core/Array";
import Int "mo:core/Int";

mixin (
  staff : List.List<Types.Staff>,
  sessions : List.List<Types.Session>,
  securityEvents : List.List<Types.SecurityEvent>,
  otpRecords : List.List<Types.OtpRecord>,
  biometricEnrollments : List.List<Types.BiometricEnrollment>,
  auditRecords : List.List<Types.AuditRecord>,
  observerCodes : List.List<Types.ObserverCodeRecord>,
  staffState : { var nextEventId : Nat; var nextAuditId : Nat; var lockdownActive : Bool }
) {

  // 15-minute session timeout in nanoseconds
  let SESSION_TIMEOUT_NS : Int = 15 * 60 * 1_000_000_000;
  // OTP valid for 2 minutes
  let OTP_EXPIRY_NS : Int = 2 * 60 * 1_000_000_000;

  // ─── Internal helpers ───────────────────────────────────────────────────────

  func _logAudit(actorId : Text, action : Text, target : Text, details : Text, ip : Text, device : Text) {
    let id = staffState.nextAuditId;
    staffState.nextAuditId += 1;
    auditRecords.add(StaffLib.newAuditRecord(id, actorId, action, target, details, ip, device));
  };

  func _logEvent(eventType : Types.SecurityEventType, staffId : Text, ip : Text, device : Text, details : Text) {
    let id = staffState.nextEventId;
    staffState.nextEventId += 1;
    securityEvents.add({ id; eventType; staffId; ipAddress = ip; deviceId = device; details; timestamp = Time.now() });
  };

  // ─── Staff Authentication ────────────────────────────────────────────────────

  /// Authenticate with username + password hash; returns session token or error.
  public shared ({ caller }) func authenticateStaff(
    username : Text,
    passwordHash : Text,
    deviceId : Text,
    ipAddress : Text,
    userAgent : Text
  ) : async { ok : Bool; sessionId : Text; role : Text; message : Text } {
    ignore caller;
    if (staffState.lockdownActive) {
      return { ok = false; sessionId = ""; role = ""; message = "System is in emergency lockdown" };
    };
    switch (staff.find(func(s : Types.Staff) : Bool { s.email == username or s.id == username })) {
      case null {
        _logEvent(#LOGIN_FAIL, username, ipAddress, deviceId, "unknown user");
        { ok = false; sessionId = ""; role = ""; message = "Invalid credentials" }
      };
      case (?s) {
        if (s.isSuspended or not s.isActive) {
          _logEvent(#LOGIN_FAIL, s.id, ipAddress, deviceId, "suspended");
          return { ok = false; sessionId = ""; role = ""; message = "Account suspended" };
        };
        if (s.isLocked()) {
          _logEvent(#LOCKOUT, s.id, ipAddress, deviceId, "account locked");
          return { ok = false; sessionId = ""; role = ""; message = "Account locked. Try again later." };
        };
        if (s.passwordHash != passwordHash) {
          let updated = s.incrementAttempts();
          staff.mapInPlace(func(m : Types.Staff) : Types.Staff {
            if (m.id == s.id) updated else m
          });
          _logEvent(#LOGIN_FAIL, s.id, ipAddress, deviceId, "wrong password");
          _logAudit(s.id, "LOGIN_FAIL", "", "wrong password", ipAddress, deviceId);
          return { ok = false; sessionId = ""; role = ""; message = "Invalid credentials" };
        };
        // Success
        let reset = s.resetAttempts();
        staff.mapInPlace(func(m : Types.Staff) : Types.Staff {
          if (m.id == s.id) { { reset with firstLoginDone = true } } else m
        });
        let sessionId = s.id # "-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
        sessions.add(StaffLib.newSession(sessionId, s.id, deviceId, ipAddress, userAgent));
        _logEvent(#LOGIN_SUCCESS, s.id, ipAddress, deviceId, "password login");
        _logAudit(s.id, "LOGIN_SUCCESS", "", "password", ipAddress, deviceId);
        let roleText = switch (s.role) {
          case (#admin) "admin";
          case (#manager) "manager";
          case (#agent) "agent";
          case (#viewer) "viewer";
        };
        { ok = true; sessionId; role = roleText; message = "Login successful" }
      };
    }
  };

  /// Authenticate with fingerprint credential; returns session token or error.
  public shared ({ caller }) func authenticateFingerprint(
    staffId : Text,
    credentialId : Text,
    deviceId : Text,
    ipAddress : Text,
    userAgent : Text
  ) : async { ok : Bool; sessionId : Text; role : Text; message : Text } {
    ignore (caller, credentialId);
    if (staffState.lockdownActive) {
      return { ok = false; sessionId = ""; role = ""; message = "System is in emergency lockdown" };
    };
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
      case null {
        _logEvent(#LOGIN_FAIL, staffId, ipAddress, deviceId, "biometric: unknown staff");
        { ok = false; sessionId = ""; role = ""; message = "Staff not found" }
      };
      case (?s) {
        if (not s.firstLoginDone) {
          return { ok = false; sessionId = ""; role = ""; message = "Must complete password login first" };
        };
        if (s.isSuspended or not s.isActive) {
          return { ok = false; sessionId = ""; role = ""; message = "Account suspended" };
        };
        // Verify biometric enrollment is approved
        let approved = switch (biometricEnrollments.find(func(e : Types.BiometricEnrollment) : Bool { e.staffId == staffId })) {
          case (?e) { e.isApproved and not e.isRevoked };
          case null { false };
        };
        if (not approved) {
          _logEvent(#LOGIN_FAIL, staffId, ipAddress, deviceId, "biometric not approved");
          return { ok = false; sessionId = ""; role = ""; message = "Biometric not approved by admin" };
        };
        let sessionId = s.id # "-fp-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
        sessions.add(StaffLib.newSession(sessionId, s.id, deviceId, ipAddress, userAgent));
        _logEvent(#LOGIN_SUCCESS, s.id, ipAddress, deviceId, "biometric login");
        _logAudit(s.id, "LOGIN_SUCCESS", "", "fingerprint", ipAddress, deviceId);
        let roleText = switch (s.role) {
          case (#admin) "admin";
          case (#manager) "manager";
          case (#agent) "agent";
          case (#viewer) "viewer";
        };
        { ok = true; sessionId; role = roleText; message = "Biometric login successful" }
      };
    }
  };

  /// Enroll fingerprint for a staff member (credentialId is the WebAuthn credential ID).
  public shared ({ caller }) func enrollFingerprint(staffId : Text, credentialId : Text, publicKey : Text) : async Bool {
    ignore (caller, credentialId);
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
      case null { return false };
      case (?_) {};
    };
    var found = false;
    biometricEnrollments.mapInPlace(func(e : Types.BiometricEnrollment) : Types.BiometricEnrollment {
      if (e.staffId == staffId) {
        found := true;
        { e with publicKey; requestedAt = Time.now(); isApproved = false; isRevoked = false }
      } else { e }
    });
    if (not found) {
      biometricEnrollments.add({
        staffId;
        publicKey;
        requestedAt = Time.now();
        approvedAt = 0;
        isApproved = false;
        isRevoked = false;
      });
    };
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { { s with biometricEnrolled = true; biometricPublicKey = publicKey } }
      else { s }
    });
    _logEvent(#BIOMETRIC_ENROLL, staffId, "", "", "enrollment requested");
    _logAudit(staffId, "BIOMETRIC_ENROLL_REQUESTED", "", "", "", "");
    true
  };

  // ─── Send OTP ────────────────────────────────────────────────────────────────

  /// Generate and store a 4-digit OTP for mobile verification.
  public shared ({ caller }) func sendOtp(staffId : Text) : async Bool {
    ignore caller;
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
      case null { return false };
      case (?s) {
        if (not s.firstLoginDone) { return false };
      };
    };
    let code = Nat.toText(Int.abs(Time.now()) % 10000);
    otpRecords.mapInPlace(func(r : Types.OtpRecord) : Types.OtpRecord {
      if (r.staffId == staffId) { { r with used = true } } else { r }
    });
    otpRecords.add(StaffLib.newOtp(staffId, code, OTP_EXPIRY_NS));
    _logEvent(#OTP_SENT, staffId, "", "", "OTP sent");
    _logAudit(staffId, "OTP_SENT", "", "sent", "", "");
    true
  };

  /// Verify a 4-digit OTP; returns session token on success, lockout after 3 failures.
  public shared ({ caller }) func verifyOtp(
    staffId : Text,
    code : Text,
    deviceId : Text,
    ipAddress : Text,
    userAgent : Text
  ) : async { ok : Bool; sessionId : Text; role : Text; message : Text } {
    ignore caller;
    if (staffState.lockdownActive) {
      return { ok = false; sessionId = ""; role = ""; message = "System is in emergency lockdown" };
    };
    var result = { ok = false; sessionId = ""; role = ""; message = "Invalid OTP" };
    var matched = false;
    let now = Time.now();
    var failCount : Nat = 0;
    // Count failures for lockout
    for (r in otpRecords.values()) {
      if (r.staffId == staffId and r.used) { failCount += 1 };
    };
    if (failCount >= 3) {
      _logEvent(#OTP_FAIL, staffId, ipAddress, deviceId, "locked after 3 failures");
      return { ok = false; sessionId = ""; role = ""; message = "Too many OTP failures. Request a new OTP." };
    };
    otpRecords.mapInPlace(func(r : Types.OtpRecord) : Types.OtpRecord {
      if (r.staffId == staffId and not r.used and not matched) {
        if (r.expiry < now) {
          matched := true;
          result := { ok = false; sessionId = ""; role = ""; message = "OTP expired" };
          { r with used = true }
        } else if (r.code == code) {
          matched := true;
          switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
            case (?s) {
              let sessionId = s.id # "-otp-" # Nat.toText(Int.abs(now) % 1_000_000_000);
              sessions.add(StaffLib.newSession(sessionId, s.id, deviceId, ipAddress, userAgent));
              let roleText = switch (s.role) {
                case (#admin) "admin";
                case (#manager) "manager";
                case (#agent) "agent";
                case (#viewer) "viewer";
              };
              _logEvent(#LOGIN_SUCCESS, staffId, ipAddress, deviceId, "OTP login");
              _logAudit(staffId, "LOGIN_SUCCESS", "", "OTP", ipAddress, deviceId);
              result := { ok = true; sessionId; role = roleText; message = "OTP verified" };
            };
            case null {
              result := { ok = false; sessionId = ""; role = ""; message = "Staff not found" };
            };
          };
          { r with used = true }
        } else {
          _logEvent(#OTP_FAIL, staffId, ipAddress, deviceId, "wrong code");
          { r with used = true }
        }
      } else { r }
    });
    if (not matched) {
      _logEvent(#OTP_FAIL, staffId, ipAddress, deviceId, "no active OTP");
      result := { ok = false; sessionId = ""; role = ""; message = "No active OTP. Request a new one." };
    };
    result
  };

  // ─── Session Management ──────────────────────────────────────────────────────

  public query func validateSession(sessionId : Text, deviceId : Text) : async Bool {
    switch (sessions.find(func(s : Types.Session) : Bool { s.sessionId == sessionId and s.deviceId == deviceId })) {
      case null { false };
      case (?s) { s.isSessionValid(SESSION_TIMEOUT_NS) };
    }
  };

  public shared ({ caller }) func invalidateSession(sessionId : Text) : async Bool {
    ignore caller;
    var found = false;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.sessionId == sessionId) { found := true; { s with isActive = false } } else { s }
    });
    found
  };

  public shared ({ caller }) func invalidateAllSessions(staffId : Text) : async Bool {
    ignore caller;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.staffId == staffId) { { s with isActive = false } } else { s }
    });
    _logAudit(staffId, "FORCE_LOGOUT_ALL", "", "all sessions invalidated", "", "");
    true
  };

  public shared ({ caller }) func getActiveSessions() : async [Types.Session] {
    ignore caller;
    sessions.filter(func(s : Types.Session) : Bool { s.isActive }).toArray()
  };

  public shared ({ caller }) func emergencyLockdown(adminPasswordHash : Text) : async Bool {
    ignore (caller, adminPasswordHash);
    staffState.lockdownActive := true;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      let isAdmin = switch (staff.find(func(m : Types.Staff) : Bool { m.id == s.staffId })) {
        case (?m) { switch (m.role) { case (#admin) true; case (_) false } };
        case null { false };
      };
      if (not isAdmin) { { s with isActive = false } } else { s }
    });
    _logEvent(#EMERGENCY_LOCKDOWN, "admin", "", "", "emergency lockdown activated");
    _logAudit("admin", "EMERGENCY_LOCKDOWN", "", "all non-admin sessions killed", "", "");
    true
  };

  public shared ({ caller }) func liftLockdown(adminPasswordHash : Text) : async Bool {
    ignore (caller, adminPasswordHash);
    staffState.lockdownActive := false;
    _logAudit("admin", "LOCKDOWN_LIFTED", "", "", "", "");
    true
  };

  public query func isLockdownActive() : async Bool {
    staffState.lockdownActive
  };

  // ─── Staff Management ────────────────────────────────────────────────────────

  /// Create a new staff member (admin only by convention).
  public shared ({ caller }) func createStaff(
    username : Text,
    passwordHash : Text,
    role : Types.StaffRole,
    mobileNumber : Text
  ) : async { ok : Bool; id : Text; message : Text } {
    ignore caller;
    let id = "staff-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
    switch (staff.find(func(s : Types.Staff) : Bool { s.email == username or s.id == username })) {
      case (?_) { return { ok = false; id = ""; message = "Username already exists" } };
      case null {};
    };
    let s = StaffLib.newStaff(id, username, username, passwordHash, role, mobileNumber);
    staff.add(s);
    _logAudit("admin", "STAFF_CREATED", id, username, "", "");
    { ok = true; id; message = "Staff created" }
  };

  /// addStaff kept for backward-compat (delegates to createStaff logic inline).
  public shared ({ caller }) func addStaff(
    id : Text,
    name : Text,
    email : Text,
    passwordHash : Text,
    role : Types.StaffRole,
    mobileNumber : Text
  ) : async Bool {
    ignore caller;
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == id })) {
      case (?_) { return false };
      case null {};
    };
    let s = StaffLib.newStaff(id, name, email, passwordHash, role, mobileNumber);
    staff.add(s);
    _logAudit("admin", "STAFF_ADDED", id, name, "", "");
    true
  };

  public shared ({ caller }) func listStaff() : async [Types.Staff] {
    ignore caller;
    staff.toArray()
  };

  public shared ({ caller }) func getStaff() : async [Types.Staff] {
    ignore caller;
    staff.toArray()
  };

  public query func getStaffById(staffId : Text) : async ?Types.Staff {
    staff.find(func(s : Types.Staff) : Bool { s.id == staffId })
  };

  public shared ({ caller }) func updateStaff(
    staffId : Text,
    name : Text,
    email : Text,
    role : Types.StaffRole
  ) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) {
        found := true;
        { s with name; email; role }
      } else { s }
    });
    if (found) { _logAudit("admin", "STAFF_UPDATED", staffId, "", "", "") };
    found
  };

  public shared ({ caller }) func suspendStaff(staffId : Text) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) {
        found := true;
        { s with isSuspended = true; isActive = false }
      } else { s }
    });
    if (found) { _logAudit("admin", "STAFF_SUSPENDED", staffId, "", "", "") };
    found
  };

  public shared ({ caller }) func removeStaff(staffId : Text) : async Bool {
    ignore caller;
    let before = staff.size();
    staff.retain(func(s : Types.Staff) : Bool { s.id != staffId });
    let removed = staff.size() < before;
    if (removed) { _logAudit("admin", "STAFF_REMOVED", staffId, "", "", "") };
    removed
  };

  /// Set mobile number (admin only — staff cannot change their own number).
  public shared ({ caller }) func setMobileNumber(staffId : Text, mobileNumber : Text) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { found := true; { s with mobileNumber } } else { s }
    });
    if (found) { _logAudit("admin", "MOBILE_SET", staffId, mobileNumber, "", "") };
    found
  };

  public shared ({ caller }) func updateStaffRole(staffId : Text, role : Types.StaffRole) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { found := true; { s with role } } else { s }
    });
    found
  };

  public shared ({ caller }) func updateStaffMobile(staffId : Text, mobileNumber : Text) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { found := true; { s with mobileNumber } } else { s }
    });
    found
  };

  // ─── Security Events ─────────────────────────────────────────────────────────

  public shared ({ caller }) func logSecurityEvent(
    eventType : Types.SecurityEventType,
    staffId : Text,
    ipAddress : Text,
    deviceId : Text,
    details : Text
  ) : async Nat {
    ignore caller;
    let id = staffState.nextEventId;
    staffState.nextEventId += 1;
    securityEvents.add({ id; eventType; staffId; ipAddress; deviceId; details; timestamp = Time.now() });
    id
  };

  public shared ({ caller }) func getSecurityEvents(limit : Nat) : async [Types.SecurityEvent] {
    ignore caller;
    let all = securityEvents.toArray();
    let sz = all.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count : Nat = sz - start;
    Array.tabulate<Types.SecurityEvent>(count, func(i) { all[start + i] })
  };

  /// Compute a 0–100 security score based on recent events and lockdown state.
  public query func getSecurityScore() : async Nat {
    let total = securityEvents.size();
    if (total == 0) { return 80 };
    let arr = securityEvents.toArray();
    let recent = if (arr.size() > 100) {
      Array.tabulate(100, func(i) { arr[arr.size() - 100 + i] })
    } else { arr };
    var failures : Nat = 0;
    var lockouts : Nat = 0;
    for (ev in recent.vals()) {
      switch (ev.eventType) {
        case (#LOGIN_FAIL) { failures += 1 };
        case (#LOCKOUT) { lockouts += 1 };
        case (#OTP_FAIL) { failures += 1 };
        case (_) {};
      };
    };
    let penalty = failures * 2 + lockouts * 5;
    let base : Nat = 95;
    if (penalty >= base) { 5 } else { base - penalty }
  };

  // ─── OTP (backward-compat aliases) ──────────────────────────────────────────

  public shared ({ caller }) func generateOtp(staffId : Text) : async Bool {
    ignore caller;
    let code = Nat.toText(Int.abs(Time.now()) % 10000);
    otpRecords.mapInPlace(func(r : Types.OtpRecord) : Types.OtpRecord {
      if (r.staffId == staffId) { { r with used = true } } else { r }
    });
    otpRecords.add(StaffLib.newOtp(staffId, code, OTP_EXPIRY_NS));
    true
  };

  public shared ({ caller }) func validateOtp(staffId : Text, code : Text) : async Bool {
    ignore caller;
    var valid = false;
    otpRecords.mapInPlace(func(r : Types.OtpRecord) : Types.OtpRecord {
      if (r.staffId == staffId and r.code == code and r.isOtpValid()) {
        valid := true;
        { r with used = true }
      } else { r }
    });
    valid
  };

  // ─── Biometric Enrollment ────────────────────────────────────────────────────

  public shared ({ caller }) func enrollBiometric(staffId : Text, publicKey : Text) : async Bool {
    ignore caller;
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
      case null { return false };
      case (?_) {};
    };
    var found = false;
    biometricEnrollments.mapInPlace(func(e : Types.BiometricEnrollment) : Types.BiometricEnrollment {
      if (e.staffId == staffId) {
        found := true;
        { e with publicKey; requestedAt = Time.now(); isApproved = false; isRevoked = false }
      } else { e }
    });
    if (not found) {
      biometricEnrollments.add({
        staffId; publicKey; requestedAt = Time.now();
        approvedAt = 0; isApproved = false; isRevoked = false;
      });
    };
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { { s with biometricEnrolled = true; biometricPublicKey = publicKey } }
      else { s }
    });
    true
  };

  public shared ({ caller }) func approveBiometric(staffId : Text, adminPasswordHash : Text) : async Bool {
    ignore (caller, adminPasswordHash);
    var found = false;
    biometricEnrollments.mapInPlace(func(e : Types.BiometricEnrollment) : Types.BiometricEnrollment {
      if (e.staffId == staffId and not e.isRevoked) {
        found := true;
        { e with isApproved = true; approvedAt = Time.now() }
      } else { e }
    });
    if (found) { _logAudit("admin", "BIOMETRIC_APPROVED", staffId, "", "", "") };
    found
  };

  public shared ({ caller }) func revokeBiometric(staffId : Text) : async Bool {
    ignore caller;
    var found = false;
    biometricEnrollments.mapInPlace(func(e : Types.BiometricEnrollment) : Types.BiometricEnrollment {
      if (e.staffId == staffId) { found := true; { e with isRevoked = true } } else { e }
    });
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { { s with biometricEnrolled = false; biometricPublicKey = "" } }
      else { s }
    });
    found
  };

  // ─── Audit Trail ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func logAction(
    staffId : Text,
    action : Text,
    target : Text,
    details : Text,
    ipAddress : Text,
    deviceId : Text
  ) : async Nat {
    ignore caller;
    let id = staffState.nextAuditId;
    staffState.nextAuditId += 1;
    auditRecords.add(StaffLib.newAuditRecord(id, staffId, action, target, details, ipAddress, deviceId));
    id
  };

  /// Paginated audit log.
  public shared ({ caller }) func getAuditLog(limit : Nat, offset : Nat) : async [Types.AuditRecord] {
    ignore caller;
    let all = auditRecords.toArray();
    let start = if (offset < all.size()) { offset } else { all.size() };
    let end_ = if (start + limit < all.size()) { start + limit } else { all.size() };
    Array.tabulate<Types.AuditRecord>(end_ - start, func(i) { all[start + i] })
  };

  /// Backward-compat: get most recent N audit records.
  public shared ({ caller }) func getAuditTrail(limit : Nat) : async [Types.AuditRecord] {
    ignore caller;
    let all = auditRecords.toArray();
    let sz2 = all.size();
    let startInt2 : Int = (sz2 : Int) - (limit : Int);
    let start2 : Nat = if (startInt2 < 0) 0 else Int.abs(startInt2);
    let count2 : Nat = sz2 - start2;
    Array.tabulate<Types.AuditRecord>(count2, func(i) { all[start2 + i] })
  };

  // ─── Observer Codes ──────────────────────────────────────────────────────────

  public shared ({ caller }) func generateObserverCode(
    observerLabel : Text,
    expiresAt : Int,
    singleUse : Bool,
    scope : Text
  ) : async Text {
    ignore caller;
    let ts = Time.now();
    let code = "OBS-" # Nat.toText(Int.abs(ts) % 100_000_000);
    observerCodes.add(StaffLib.newObserverCode(code, observerLabel, "admin", expiresAt, singleUse, scope));
    _logAudit("admin", "OBSERVER_CODE_GENERATED", code, observerLabel, "", "");
    code
  };

  public query func validateObserverCode(code : Text) : async Bool {
    switch (observerCodes.find(func(r : Types.ObserverCodeRecord) : Bool { r.code == code })) {
      case null { false };
      case (?r) { r.isObserverCodeValid() };
    }
  };

  public shared ({ caller }) func revokeObserverCode(code : Text) : async Bool {
    ignore caller;
    var found = false;
    observerCodes.mapInPlace(func(r : Types.ObserverCodeRecord) : Types.ObserverCodeRecord {
      if (r.code == code) { found := true; { r with isRevoked = true } } else { r }
    });
    if (found) { _logAudit("admin", "OBSERVER_CODE_REVOKED", code, "", "", "") };
    found
  };

  public shared ({ caller }) func listObserverCodes() : async [Types.ObserverCodeRecord] {
    ignore caller;
    observerCodes.toArray()
  };

  // ─── Session helpers (backward-compat) ───────────────────────────────────────

  // ─── Enhanced Session Management ────────────────────────────────────────────

  /// Create a session and return the token (simplified signature for new API).
  public shared ({ caller }) func createSessionSimple(
    staffId : Text,
    deviceInfo : Text,
    ip : Text
  ) : async Text {
    ignore caller;
    let sessionId = staffId # "-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
    sessions.add(StaffLib.newSession(sessionId, staffId, deviceInfo, ip, "web"));
    _logAudit(staffId, "SESSION_CREATED", sessionId, "", ip, deviceInfo);
    sessionId
  };

  /// Validate session token; updates lastActivity and returns staff record if valid.
  public shared ({ caller }) func validateSessionToken(token : Text) : async ?Types.Staff {
    ignore caller;
    let now = Time.now();
    var result : ?Types.Staff = null;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.sessionId == token and s.isActive) {
        if (now - s.lastActivity < SESSION_TIMEOUT_NS) {
          let updated = { s with lastActivity = now };
          result := staff.find(func(m : Types.Staff) : Bool { m.id == s.staffId });
          updated
        } else {
          { s with isActive = false }
        }
      } else { s }
    });
    result
  };

  /// Force logout all sessions for a staff member; returns true if any were removed.
  public shared ({ caller }) func forceLogoutStaff(staffId : Text) : async Bool {
    ignore caller;
    var count : Nat = 0;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.staffId == staffId and s.isActive) {
        count += 1;
        { s with isActive = false }
      } else { s }
    });
    _logEvent(#FORCE_LOGOUT, staffId, "", "", "forced logout");
    _logAudit("admin", "FORCE_LOGOUT", staffId, "all sessions cleared", "", "");
    count > 0
  };

  /// Emergency lockdown — deactivates all non-admin sessions; returns count deactivated.
  public shared ({ caller }) func emergencyLockdownCount() : async Nat {
    ignore caller;
    staffState.lockdownActive := true;
    var count : Nat = 0;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.isActive) {
        let isAdmin = switch (staff.find(func(m : Types.Staff) : Bool { m.id == s.staffId })) {
          case (?m) { switch (m.role) { case (#admin) true; case (_) false } };
          case null { false };
        };
        if (not isAdmin) {
          count += 1;
          { s with isActive = false }
        } else { s }
      } else { s }
    });
    _logEvent(#EMERGENCY_LOCKDOWN, "admin", "", "", "emergency lockdown activated");
    _logAudit("admin", "EMERGENCY_LOCKDOWN", "", count.toText() # " sessions terminated", "", "");
    count
  };

  /// Terminate a specific session by token.
  public shared ({ caller }) func terminateSession(token : Text) : async Bool {
    ignore caller;
    var found = false;
    sessions.mapInPlace(func(s : Types.Session) : Types.Session {
      if (s.sessionId == token and s.isActive) {
        found := true;
        { s with isActive = false }
      } else { s }
    });
    found
  };

  /// Get all currently active session infos (for admin dashboard).
  public query func getActiveSessionInfos() : async [Types.Session] {
    sessions.filter(func(s : Types.Session) : Bool { s.isActive }).toArray()
  };

  // ─── Enhanced Staff Credential Management ────────────────────────────────

  /// Create staff with text-based role ("admin"|"manager"|"agent"|"viewer").
  public shared ({ caller }) func createStaffWithRole(
    name : Text,
    roleText : Text,
    email : Text,
    passwordHash : Text
  ) : async Text {
    ignore caller;
    let role : Types.StaffRole = switch (roleText) {
      case ("admin") { #admin };
      case ("manager") { #manager };
      case ("agent") { #agent };
      case (_) { #viewer };
    };
    let id = "staff-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
    switch (staff.find(func(s : Types.Staff) : Bool { s.email == email })) {
      case (?_) { return "ERR:exists" };
      case null {};
    };
    let s = StaffLib.newStaff(id, name, email, passwordHash, role, "");
    staff.add(s);
    _logAudit("admin", "STAFF_CREATED", id, name, "", "");
    id
  };

  /// Authenticate staff with identifier+hash; locks after 5 failures; returns token+record.
  public shared ({ caller }) func authenticateWithToken(
    identifier : Text,
    passwordHash : Text
  ) : async ?{ token : Text; staffId : Text; role : Text } {
    ignore caller;
    if (staffState.lockdownActive) { return null };
    switch (staff.find(func(s : Types.Staff) : Bool { s.email == identifier or s.id == identifier })) {
      case null {
        _logEvent(#LOGIN_FAIL, identifier, "", "", "unknown user");
        null
      };
      case (?s) {
        if (s.isSuspended or not s.isActive) { return null };
        if (s.isLocked()) { return null };
        if (s.passwordHash != passwordHash) {
          let updated = s.incrementAttempts();
          staff.mapInPlace(func(m : Types.Staff) : Types.Staff {
            if (m.id == s.id) updated else m
          });
          _logEvent(#LOGIN_FAIL, s.id, "", "", "wrong password");
          return null;
        };
        let reset = s.resetAttempts();
        staff.mapInPlace(func(m : Types.Staff) : Types.Staff {
          if (m.id == s.id) { { reset with firstLoginDone = true } } else m
        });
        let token = s.id # "-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
        sessions.add(StaffLib.newSession(token, s.id, "web", "0.0.0.0", "web"));
        _logEvent(#LOGIN_SUCCESS, s.id, "", "", "password auth");
        let roleText = switch (s.role) {
          case (#admin) "admin";
          case (#manager) "manager";
          case (#agent) "agent";
          case (#viewer) "viewer";
        };
        ?{ token; staffId = s.id; role = roleText }
      };
    }
  };

  /// Admin-only biometric enrollment; adminToken must be valid admin session.
  public shared ({ caller }) func enrollBiometricWithAdmin(
    staffId : Text,
    adminToken : Text,
    credentialId : Text
  ) : async Bool {
    ignore (caller, credentialId);
    let isAdmin = switch (sessions.find(func(s : Types.Session) : Bool { s.sessionId == adminToken and s.isActive })) {
      case (?sess) {
        switch (staff.find(func(m : Types.Staff) : Bool { m.id == sess.staffId })) {
          case (?m) { switch (m.role) { case (#admin) true; case (_) false } };
          case null { false };
        }
      };
      case null { false };
    };
    if (not isAdmin) { return false };
    switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
      case null { return false };
      case (?_) {};
    };
    var found = false;
    biometricEnrollments.mapInPlace(func(e : Types.BiometricEnrollment) : Types.BiometricEnrollment {
      if (e.staffId == staffId) {
        found := true;
        { e with isApproved = true; approvedAt = Time.now(); isRevoked = false }
      } else { e }
    });
    if (not found) {
      biometricEnrollments.add({
        staffId;
        publicKey = credentialId;
        requestedAt = Time.now();
        approvedAt = Time.now();
        isApproved = true;
        isRevoked = false;
      });
    };
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) { { s with biometricEnrolled = true; biometricPublicKey = credentialId } }
      else { s }
    });
    _logAudit(adminToken, "BIOMETRIC_ENROLLED", staffId, "", "", "");
    true
  };

  /// Get all staff records.
  public query func getAllStaff() : async [Types.Staff] {
    staff.toArray()
  };

  /// Update staff status: "active"|"suspended"|"terminated".
  public shared ({ caller }) func updateStaffStatus(staffId : Text, status : Text) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) {
        found := true;
        switch (status) {
          case ("suspended") { { s with isSuspended = true; isActive = false } };
          case ("terminated") { { s with isSuspended = true; isActive = false } };
          case (_) { { s with isSuspended = false; isActive = true } };
        }
      } else { s }
    });
    if (found) { _logAudit("admin", "STAFF_STATUS_UPDATED", staffId, status, "", "") };
    found
  };

  /// Reset failed login attempts for a staff member.
  public shared ({ caller }) func resetFailedAttempts(staffId : Text) : async Bool {
    ignore caller;
    var found = false;
    staff.mapInPlace(func(s : Types.Staff) : Types.Staff {
      if (s.id == staffId) {
        found := true;
        { s with loginAttempts = 0; lockedUntil = 0 }
      } else { s }
    });
    if (found) { _logAudit("admin", "ATTEMPTS_RESET", staffId, "", "", "") };
    found
  };

  public shared ({ caller }) func createSession(
    staffId : Text,
    deviceId : Text,
    ipAddress : Text,
    userAgent : Text
  ) : async ?Text {
    ignore caller;
    if (staffState.lockdownActive) {
      switch (staff.find(func(s : Types.Staff) : Bool { s.id == staffId })) {
        case (?s) {
          switch (s.role) {
            case (#admin) {};
            case (_) { return null };
          };
        };
        case null { return null };
      };
    };
    let sessionId = staffId # "-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
    let sess = StaffLib.newSession(sessionId, staffId, deviceId, ipAddress, userAgent);
    sessions.add(sess);
    ?sessionId
  };
};
