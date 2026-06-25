// Staff, Session, Security domain types
module {
  public type StaffRole = {
    #admin;
    #manager;
    #agent;
    #viewer;
  };

  public type Staff = {
    id : Text;
    name : Text;
    email : Text;
    passwordHash : Text;
    role : StaffRole;
    mobileNumber : Text;
    biometricEnrolled : Bool;
    biometricPublicKey : Text;
    firstLoginDone : Bool;
    isActive : Bool;
    isSuspended : Bool;
    createdAt : Int;
    lastLogin : Int;
    sessionToken : Text;
    deviceId : Text;
    loginAttempts : Nat;
    lockedUntil : Int;
  };

  public type Session = {
    sessionId : Text;
    staffId : Text;
    deviceId : Text;
    ipAddress : Text;
    userAgent : Text;
    createdAt : Int;
    lastActivity : Int;
    isActive : Bool;
  };

  public type SecurityEventType = {
    #LOGIN_SUCCESS;
    #LOGIN_FAIL;
    #LOCKOUT;
    #BIOMETRIC_ENROLL;
    #OTP_SENT;
    #OTP_FAIL;
    #FORCE_LOGOUT;
    #EMERGENCY_LOCKDOWN;
    #CANARY_TRIGGERED;
    #ANOMALY_DETECTED;
  };

  public type SecurityEvent = {
    id : Nat;
    eventType : SecurityEventType;
    staffId : Text;
    ipAddress : Text;
    deviceId : Text;
    details : Text;
    timestamp : Int;
  };

  public type OtpRecord = {
    staffId : Text;
    code : Text;
    expiry : Int;
    used : Bool;
  };

  public type BiometricEnrollment = {
    staffId : Text;
    publicKey : Text;
    requestedAt : Int;
    approvedAt : Int;
    isApproved : Bool;
    isRevoked : Bool;
  };

  public type AuditRecord = {
    id : Nat;
    staffId : Text;
    action : Text;
    target : Text;
    details : Text;
    ipAddress : Text;
    deviceId : Text;
    timestamp : Int;
  };

  public type ObserverCodeRecord = {
    code : Text;
    observerLabel : Text;
    createdBy : Text;
    expiresAt : Int;
    singleUse : Bool;
    used : Bool;
    scope : Text;
    isRevoked : Bool;
  };
};
