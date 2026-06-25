// AI Briefing and Trust Architecture types
module {
  public type MarketNewsItem = {
    headline : Text;
    source : Text;
    timestamp : Int;
  };

  public type DailyBriefing = {
    id : Text;
    date : Text; // YYYY-MM-DD
    newLeadsCount : Nat;
    dealsMovingCount : Nat;
    revenueFigure : Float;
    securityEventsCount : Nat;
    marketNews : [Text]; // array of headline strings
    tasksDueCount : Nat;
    generatedSummary : Text;
    createdAt : Int;
  };

  public type AiDecisionType = {
    #PROPERTY_PUBLISHED;
    #CONTENT_PUBLISHED;
    #LEAD_SCORED;
    #SECURITY_BLOCKED;
    #MINOR_UI_FIX;
    #FOLLOW_UP_SENT;
    #BOOKING_CONFIRMED;
    #COMMISSION_CALCULATED;
    #ANOMALY_FLAGGED;
    #OTHER;
  };

  public type AiDecision = {
    id : Text;
    decisionType : AiDecisionType;
    description : Text;
    actionTaken : Text;
    confidenceScore : Nat; // 0-100
    agentName : Text;
    timestamp : Int;
    reversible : Bool;
    reversed : Bool;
    reversedAt : ?Int;
    reversalReason : Text;
    outcome : Text;
  };

  public type ObserverAccessLog = {
    id : Text;
    code : Text;
    sessionId : Text; // anonymous session token
    timestamp : Int;
    scope : Text;
  };
};
