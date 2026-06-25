import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import DealTypes "../types/dealroom";

mixin (
  deals : List.List<DealTypes.Deal>,
  dealNotes : List.List<DealTypes.DealNote>,
  dealState : { var nextDealCounter : Nat; var nextNoteCounter : Nat }
) {

  public shared ({ caller }) func createDeal(
    title : Text,
    propertyId : Text,
    clientId : Text
  ) : async { #ok : DealTypes.Deal; #err : Text } {
    ignore caller;
    dealState.nextDealCounter += 1;
    let id = "deal-" # dealState.nextDealCounter.toText();
    let deal : DealTypes.Deal = {
      id;
      title;
      propertyId;
      clientId;
      agentId = "";
      stage = "negotiation";
      documents = [];
      notes = "";
      expectedCloseDate = 0;
      actualCloseDate = null;
      commissionAmount = 0.0;
      createdAt = Time.now();
    };
    deals.add(deal);
    #ok(deal)
  };

  public query func getDeal(dealId : Text) : async { #ok : DealTypes.Deal; #err : Text } {
    switch (deals.find(func(d : DealTypes.Deal) : Bool { d.id == dealId })) {
      case (?d) { #ok(d) };
      case null { #err("Deal not found") };
    }
  };

  public query func listDeals() : async [DealTypes.Deal] {
    deals.toArray()
  };

  public shared ({ caller }) func updateDealStage(
    dealId : Text,
    stage : Text
  ) : async { #ok : DealTypes.Deal; #err : Text } {
    ignore caller;
    var updated : ?DealTypes.Deal = null;
    deals.mapInPlace(func(d : DealTypes.Deal) : DealTypes.Deal {
      if (d.id == dealId) {
        let u = { d with stage };
        updated := ?u;
        u
      } else { d }
    });
    switch (updated) {
      case (?d) { #ok(d) };
      case null { #err("Deal not found") };
    }
  };

  public shared ({ caller }) func addDealNote(
    dealId : Text,
    authorId : Text,
    content : Text
  ) : async { #ok : DealTypes.DealNote; #err : Text } {
    ignore caller;
    switch (deals.find(func(d : DealTypes.Deal) : Bool { d.id == dealId })) {
      case null { return #err("Deal not found") };
      case (?_) {};
    };
    dealState.nextNoteCounter += 1;
    let note : DealTypes.DealNote = {
      id = "note-" # dealState.nextNoteCounter.toText();
      dealId;
      authorId;
      content;
      timestamp = Time.now();
    };
    dealNotes.add(note);
    #ok(note)
  };

  public query func getDealNotes(dealId : Text) : async [DealTypes.DealNote] {
    let all = dealNotes.toArray();
    Array.filter<DealTypes.DealNote>(all, func(n) { n.dealId == dealId })
  };

};
