import Types "../types/staff";
import Time "mo:core/Time";

module {
  public type Staff = Types.Staff;
  public type Session = Types.Session;
  public type SecurityEvent = Types.SecurityEvent;
  public type OtpRecord = Types.OtpRecord;
  public type BiometricEnrollment = Types.BiometricEnrollment;
  public type AuditRecord = Types.AuditRecord;
  public type ObserverCodeRecord = Types.ObserverCodeRecord;

  // Staff helpers
  public func newStaff(
    id : Text,
    name : Text,
    email : Text,
    passwordHash : Text,
    role : Types.StaffRole,
    mobileNumber : Text
  ) : Staff {
    {
      id;
      name;
      email;
      passwordHash;
      role;
      mobileNumber;
      biometricEnrolled = false;
      biometricPublicKey = "";
      firstLoginDone = false;
      isActive = true;
      isSuspended = false;
      createdAt = Time.now();
      lastLogin = 0;
      sessionToken = "";
      deviceId = "";
      loginAttempts = 0;
      lockedUntil = 0;
    }
  };

  public func isLocked(self : Staff) : Bool {
    self.lockedUntil > Time.now()
  };

  // Increment login failure counter; lock for 15 minutes after 5 failures
  public func incrementAttempts(self : Staff) : Staff {
    let attempts = self.loginAttempts + 1;
    let lockUntil : Int = if (attempts >= 5) {
      Time.now() + 15 * 60 * 1_000_000_000
    } else {
      self.lockedUntil
    };
    { self with loginAttempts = attempts; lockedUntil = lockUntil }
  };

  public func resetAttempts(self : Staff) : Staff {
    { self with loginAttempts = 0; lockedUntil = 0; lastLogin = Time.now() }
  };

  // Session helpers
  public func newSession(
    sessionId : Text,
    staffId : Text,
    deviceId : Text,
    ipAddress : Text,
    userAgent : Text
  ) : Session {
    {
      sessionId;
      staffId;
      deviceId;
      ipAddress;
      userAgent;
      createdAt = Time.now();
      lastActivity = Time.now();
      isActive = true;
    }
  };

  // Session valid when active, bound to correct device, and not timed out
  public func isSessionValid(self : Session, timeoutNs : Int) : Bool {
    self.isActive and (Time.now() - self.lastActivity < timeoutNs)
  };

  // OTP helpers
  public func newOtp(staffId : Text, code : Text, expiryNs : Int) : OtpRecord {
    { staffId; code; expiry = Time.now() + expiryNs; used = false }
  };

  public func isOtpValid(self : OtpRecord) : Bool {
    not self.used and self.expiry > Time.now()
  };

  // Audit helpers
  public func newAuditRecord(
    id : Nat,
    staffId : Text,
    action : Text,
    target : Text,
    details : Text,
    ipAddress : Text,
    deviceId : Text
  ) : AuditRecord {
    { id; staffId; action; target; details; ipAddress; deviceId; timestamp = Time.now() }
  };

  // Observer code helpers
  public func newObserverCode(
    code : Text,
    observerLabel : Text,
    createdBy : Text,
    expiresAt : Int,
    singleUse : Bool,
    scope : Text
  ) : ObserverCodeRecord {
    { code; observerLabel; createdBy; expiresAt; singleUse; used = false; scope; isRevoked = false }
  };

  public func isObserverCodeValid(self : ObserverCodeRecord) : Bool {
    not self.isRevoked
    and not (self.singleUse and self.used)
    and self.expiresAt > Time.now()
  };
};
