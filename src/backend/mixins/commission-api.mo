import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Array "mo:core/Array";
import CommissionTypes "../types/commission";

mixin (
  commissions : List.List<CommissionTypes.CommissionRecord>,
  commissionState : { var nextCommissionCounter : Nat }
) {

  // ─── Core CRUD ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func createCommissionRecord(
    dealId : Text,
    agentId : Text,
    amount : Float,
    percentage : Float
  ) : async { #ok : CommissionTypes.CommissionRecord; #err : Text } {
    ignore caller;
    commissionState.nextCommissionCounter += 1;
    let record : CommissionTypes.CommissionRecord = {
      id = "comm-" # commissionState.nextCommissionCounter.toText();
      dealId;
      agentId;
      amount;
      percentage;
      status = "pending";
      approvedBy = null;
      paidAt = null;
      createdAt = Time.now();
    };
    commissions.add(record);
    #ok(record)
  };

  /// Calculate commission amount from sale price and percentage
  /// Returns commission id for the new record
  public shared ({ caller }) func calculateCommission(
    dealId : Text,
    staffId : Text,
    salePrice : Float,
    percentage : Float
  ) : async Text {
    ignore caller;
    let amount = salePrice * percentage / 100.0;
    commissionState.nextCommissionCounter += 1;
    let id = "comm-" # commissionState.nextCommissionCounter.toText();
    let record : CommissionTypes.CommissionRecord = {
      id;
      dealId;
      agentId = staffId;
      amount;
      percentage;
      status = "pending";
      approvedBy = null;
      paidAt = null;
      createdAt = Time.now();
    };
    commissions.add(record);
    id
  };

  public query func getCommissions() : async [CommissionTypes.CommissionRecord] {
    commissions.toArray()
  };

  public query func listCommissions() : async [CommissionTypes.CommissionRecord] {
    commissions.toArray()
  };

  public query func getAgentCommissions(agentId : Text) : async [CommissionTypes.CommissionRecord] {
    commissions.toArray().filter<CommissionTypes.CommissionRecord>(func(c) { c.agentId == agentId })
  };

  public query func getCommissionsByStaff(staffId : Text) : async [CommissionTypes.CommissionRecord] {
    commissions.toArray().filter<CommissionTypes.CommissionRecord>(func(c) { c.agentId == staffId })
  };

  public shared ({ caller }) func approveCommission(
    commissionId : Text,
    approvedBy : Text
  ) : async { #ok : CommissionTypes.CommissionRecord; #err : Text } {
    ignore caller;
    var updated : ?CommissionTypes.CommissionRecord = null;
    commissions.mapInPlace(func(c : CommissionTypes.CommissionRecord) : CommissionTypes.CommissionRecord {
      if (c.id == commissionId) {
        let u = { c with status = "approved"; approvedBy = ?approvedBy };
        updated := ?u;
        u
      } else { c }
    });
    switch (updated) {
      case (?c) { #ok(c) };
      case null { #err("Commission record not found") };
    }
  };

  public shared ({ caller }) func markCommissionPaid(
    commissionId : Text
  ) : async Bool {
    ignore caller;
    var found = false;
    commissions.mapInPlace(func(c : CommissionTypes.CommissionRecord) : CommissionTypes.CommissionRecord {
      if (c.id == commissionId) {
        found := true;
        { c with status = "paid"; paidAt = ?Time.now() }
      } else { c }
    });
    found
  };

  public shared ({ caller }) func markCommissionPaidResult(
    commissionId : Text
  ) : async { #ok : CommissionTypes.CommissionRecord; #err : Text } {
    ignore caller;
    var updated : ?CommissionTypes.CommissionRecord = null;
    commissions.mapInPlace(func(c : CommissionTypes.CommissionRecord) : CommissionTypes.CommissionRecord {
      if (c.id == commissionId) {
        let u = { c with status = "paid"; paidAt = ?Time.now() };
        updated := ?u;
        u
      } else { c }
    });
    switch (updated) {
      case (?c) { #ok(c) };
      case null { #err("Commission record not found") };
    }
  };
};
