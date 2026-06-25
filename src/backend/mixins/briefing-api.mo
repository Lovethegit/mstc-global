import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import BriefingTypes "../types/briefing";

mixin (
  dailyBriefings : List.List<BriefingTypes.DailyBriefing>,
  aiDecisions : List.List<BriefingTypes.AiDecision>,
  observerAccessLogs : List.List<BriefingTypes.ObserverAccessLog>,
  briefingState : { var nextBriefingCounter : Nat; var nextDecisionCounter : Nat; var nextAccessLogCounter : Nat }
) {

  // ─── Daily Briefing ──────────────────────────────────────────────────────────

  public shared ({ caller }) func createDailyBriefing(
    date : Text,
    newLeadsCount : Nat,
    dealsMovingCount : Nat,
    revenueFigure : Float,
    securityEventsCount : Nat,
    marketNews : [Text],
    tasksDueCount : Nat,
    generatedSummary : Text
  ) : async { #ok : BriefingTypes.DailyBriefing; #err : Text } {
    ignore caller;
    briefingState.nextBriefingCounter += 1;
    let briefing : BriefingTypes.DailyBriefing = {
      id = "brief-" # briefingState.nextBriefingCounter.toText();
      date;
      newLeadsCount;
      dealsMovingCount;
      revenueFigure;
      securityEventsCount;
      marketNews;
      tasksDueCount;
      generatedSummary;
      createdAt = Time.now();
    };
    dailyBriefings.add(briefing);
    #ok(briefing)
  };

  public query func getLatestBriefing() : async ?BriefingTypes.DailyBriefing {
    let arr = dailyBriefings.toArray();
    if (arr.size() == 0) { return null };
    ?arr[arr.size() - 1]
  };

  public query func getBriefingByDate(date : Text) : async ?BriefingTypes.DailyBriefing {
    dailyBriefings.find(func(b : BriefingTypes.DailyBriefing) : Bool { b.date == date })
  };

  public query func listBriefings(limit : Nat) : async [BriefingTypes.DailyBriefing] {
    let arr = dailyBriefings.toArray();
    let sz = arr.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count : Nat = if (sz > start) sz - start else 0;
    Array.tabulate<BriefingTypes.DailyBriefing>(count, func(i) { arr[start + i] })
  };

  // ─── AI Decision Log ─────────────────────────────────────────────────────────

  public shared ({ caller }) func logAiDecision(
    decisionType : BriefingTypes.AiDecisionType,
    description : Text,
    actionTaken : Text,
    confidenceScore : Nat,
    agentName : Text,
    reversible : Bool,
    outcome : Text
  ) : async { #ok : BriefingTypes.AiDecision; #err : Text } {
    ignore caller;
    briefingState.nextDecisionCounter += 1;
    let decision : BriefingTypes.AiDecision = {
      id = "decision-" # briefingState.nextDecisionCounter.toText();
      decisionType;
      description;
      actionTaken;
      confidenceScore;
      agentName;
      timestamp = Time.now();
      reversible;
      reversed = false;
      reversedAt = null;
      reversalReason = "";
      outcome;
    };
    aiDecisions.add(decision);
    #ok(decision)
  };

  public query func listAiDecisions(limit : Nat) : async [BriefingTypes.AiDecision] {
    let arr = aiDecisions.toArray();
    let sz = arr.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count : Nat = if (sz > start) sz - start else 0;
    Array.tabulate<BriefingTypes.AiDecision>(count, func(i) { arr[start + i] })
  };

  public query func getAiDecision(decisionId : Text) : async { #ok : BriefingTypes.AiDecision; #err : Text } {
    switch (aiDecisions.find(func(d : BriefingTypes.AiDecision) : Bool { d.id == decisionId })) {
      case (?d) { #ok(d) };
      case null { #err("Decision not found") };
    }
  };

  /// Rollback an AI decision — marks as reversed and stores reason.
  public shared ({ caller }) func rollbackAiDecision(
    decisionId : Text,
    reason : Text
  ) : async { #ok : BriefingTypes.AiDecision; #err : Text } {
    ignore caller;
    var updated : ?BriefingTypes.AiDecision = null;
    aiDecisions.mapInPlace(func(d : BriefingTypes.AiDecision) : BriefingTypes.AiDecision {
      if (d.id == decisionId) {
        if (not d.reversible) {
          updated := ?d; // will return the unchanged record; caller checks reversed flag
          d
        } else {
          let u = { d with reversed = true; reversedAt = ?Time.now(); reversalReason = reason };
          updated := ?u;
          u
        }
      } else { d }
    });
    switch (updated) {
      case (?d) {
        if (not d.reversible and not d.reversed) {
          #err("Decision is not reversible")
        } else { #ok(d) }
      };
      case null { #err("Decision not found") };
    }
  };

  // ─── Observer Access Log ─────────────────────────────────────────────────────

  public shared ({ caller }) func logObserverAccess(
    code : Text,
    sessionId : Text,
    scope : Text
  ) : async Text {
    ignore caller;
    briefingState.nextAccessLogCounter += 1;
    let entry : BriefingTypes.ObserverAccessLog = {
      id = "obslog-" # briefingState.nextAccessLogCounter.toText();
      code;
      sessionId;
      timestamp = Time.now();
      scope;
    };
    observerAccessLogs.add(entry);
    entry.id
  };

  public query func getObserverAccessLogs(code : Text) : async [BriefingTypes.ObserverAccessLog] {
    let arr = observerAccessLogs.toArray();
    arr.filter<BriefingTypes.ObserverAccessLog>(func(l) { l.code == code })
  };

  public query func listAllObserverAccessLogs(limit : Nat) : async [BriefingTypes.ObserverAccessLog] {
    let arr = observerAccessLogs.toArray();
    let sz = arr.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count : Nat = if (sz > start) sz - start else 0;
    Array.tabulate<BriefingTypes.ObserverAccessLog>(count, func(i) { arr[start + i] })
  };
};
