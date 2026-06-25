import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import PropExtTypes "../types/property_extended";

mixin (
  priceHistory : List.List<PropExtTypes.PriceHistoryEntry>,
  localityDemand : List.List<PropExtTypes.LocalityDemand>,
  builderTrustRecords : List.List<PropExtTypes.BuilderTrustRecord>,
  jantriRates : List.List<PropExtTypes.JantriRate>,
  propertyIntelligence : List.List<PropExtTypes.PropertyIntelligence>,
  propIntelState : { var nextPriceHistoryCounter : Nat }
) {

  // ─── Price History ───────────────────────────────────────────────────────────

  public shared ({ caller }) func recordPriceHistory(
    propertyId : Text,
    price : Nat,
    recordedBy : Text,
    note : Text
  ) : async { #ok : PropExtTypes.PriceHistoryEntry; #err : Text } {
    ignore caller;
    propIntelState.nextPriceHistoryCounter += 1;
    let entry : PropExtTypes.PriceHistoryEntry = {
      propertyId;
      price;
      recordedAt = Time.now();
      recordedBy;
      note;
    };
    priceHistory.add(entry);
    #ok(entry)
  };

  public query func getPriceHistory(propertyId : Text) : async [PropExtTypes.PriceHistoryEntry] {
    let arr = priceHistory.toArray();
    arr.filter<PropExtTypes.PriceHistoryEntry>(func(e) { e.propertyId == propertyId })
  };

  // ─── Locality Demand Tracking ─────────────────────────────────────────────────

  /// Increment view count for a locality.
  public shared ({ caller }) func recordLocalityView(locality : Text) : async () {
    ignore caller;
    var found = false;
    localityDemand.mapInPlace(func(d : PropExtTypes.LocalityDemand) : PropExtTypes.LocalityDemand {
      if (d.locality == locality) {
        found := true;
        { d with viewCount = d.viewCount + 1; lastUpdated = Time.now() }
      } else { d }
    });
    if (not found) {
      localityDemand.add({
        locality;
        viewCount = 1;
        enquiryCount = 0;
        lastUpdated = Time.now();
      });
    };
  };

  /// Increment enquiry count for a locality.
  public shared ({ caller }) func recordLocalityEnquiry(locality : Text) : async () {
    ignore caller;
    var found = false;
    localityDemand.mapInPlace(func(d : PropExtTypes.LocalityDemand) : PropExtTypes.LocalityDemand {
      if (d.locality == locality) {
        found := true;
        { d with enquiryCount = d.enquiryCount + 1; lastUpdated = Time.now() }
      } else { d }
    });
    if (not found) {
      localityDemand.add({
        locality;
        viewCount = 0;
        enquiryCount = 1;
        lastUpdated = Time.now();
      });
    };
  };

  public query func getLocalityDemand() : async [PropExtTypes.LocalityDemand] {
    localityDemand.toArray()
  };

  public query func getLocalityDemandFor(locality : Text) : async ?PropExtTypes.LocalityDemand {
    localityDemand.find(func(d : PropExtTypes.LocalityDemand) : Bool { d.locality == locality })
  };

  // ─── Builder Trust Scores ─────────────────────────────────────────────────────

  public shared ({ caller }) func upsertBuilderTrust(
    builderId : Text,
    builderName : Text,
    reraFilingCount : Nat,
    complaintCount : Nat,
    deliveryScore : Nat
  ) : async { #ok : PropExtTypes.BuilderTrustRecord; #err : Text } {
    ignore caller;
    // Trust score: base 60, +2 per RERA filing (max 20), -3 per complaint (min 0), +delivery/5
    let reraBonus : Nat = if (reraFilingCount * 2 > 20) 20 else reraFilingCount * 2;
    let complaintPenalty : Nat = complaintCount * 3;
    let base : Nat = 60;
    let partial : Nat = base + reraBonus + (deliveryScore / 5);
    let trustScore : Nat = if (complaintPenalty >= partial) 5 else partial - complaintPenalty;

    var updated : ?PropExtTypes.BuilderTrustRecord = null;
    builderTrustRecords.mapInPlace(func(b : PropExtTypes.BuilderTrustRecord) : PropExtTypes.BuilderTrustRecord {
      if (b.builderId == builderId) {
        let u = { b with builderName; reraFilingCount; complaintCount; deliveryScore; trustScore; lastUpdated = Time.now() };
        updated := ?u;
        u
      } else { b }
    });
    let record = switch (updated) {
      case (?r) { r };
      case null {
        let r : PropExtTypes.BuilderTrustRecord = {
          builderId; builderName; reraFilingCount; complaintCount; deliveryScore; trustScore;
          lastUpdated = Time.now();
        };
        builderTrustRecords.add(r);
        r
      };
    };
    #ok(record)
  };

  public query func getBuilderTrust(builderId : Text) : async ?PropExtTypes.BuilderTrustRecord {
    builderTrustRecords.find(func(b : PropExtTypes.BuilderTrustRecord) : Bool { b.builderId == builderId })
  };

  public query func listBuilderTrust() : async [PropExtTypes.BuilderTrustRecord] {
    builderTrustRecords.toArray()
  };

  // ─── Jantri Rates ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func upsertJantriRate(
    area : Text,
    ratePerSqFt : Nat,
    effectiveFrom : Text
  ) : async { #ok : PropExtTypes.JantriRate; #err : Text } {
    ignore caller;
    var updated : ?PropExtTypes.JantriRate = null;
    jantriRates.mapInPlace(func(j : PropExtTypes.JantriRate) : PropExtTypes.JantriRate {
      if (j.area == area) {
        let u = { j with ratePerSqFt; effectiveFrom; updatedAt = Time.now() };
        updated := ?u;
        u
      } else { j }
    });
    let rate = switch (updated) {
      case (?r) { r };
      case null {
        let r : PropExtTypes.JantriRate = {
          area; ratePerSqFt; effectiveFrom; updatedAt = Time.now();
        };
        jantriRates.add(r);
        r
      };
    };
    #ok(rate)
  };

  public query func getJantriRate(area : Text) : async ?PropExtTypes.JantriRate {
    jantriRates.find(func(j : PropExtTypes.JantriRate) : Bool { j.area == area })
  };

  public query func listJantriRates() : async [PropExtTypes.JantriRate] {
    jantriRates.toArray()
  };

  // ─── Property Intelligence ────────────────────────────────────────────────────

  public shared ({ caller }) func upsertPropertyIntelligence(
    propertyId : Text,
    reraNumber : Text,
    builderId : Text,
    amenities : [Text],
    investmentGrade : PropExtTypes.InvestmentGrade,
    negotiationMin : Nat,
    negotiationMax : Nat,
    builderTrustScore : Nat,
    latitude : Float,
    longitude : Float
  ) : async { #ok : PropExtTypes.PropertyIntelligence; #err : Text } {
    ignore caller;
    var updated : ?PropExtTypes.PropertyIntelligence = null;
    propertyIntelligence.mapInPlace(func(p : PropExtTypes.PropertyIntelligence) : PropExtTypes.PropertyIntelligence {
      if (p.propertyId == propertyId) {
        let u = { p with reraNumber; builderId; amenities; investmentGrade;
          negotiationMin; negotiationMax; builderTrustScore; latitude; longitude;
          updatedAt = Time.now() };
        updated := ?u;
        u
      } else { p }
    });
    let intel = switch (updated) {
      case (?r) { r };
      case null {
        let r : PropExtTypes.PropertyIntelligence = {
          propertyId; reraNumber; builderId; amenities; investmentGrade;
          negotiationMin; negotiationMax; builderTrustScore; latitude; longitude;
          updatedAt = Time.now();
        };
        propertyIntelligence.add(r);
        r
      };
    };
    #ok(intel)
  };

  public query func getPropertyIntelligence(propertyId : Text) : async ?PropExtTypes.PropertyIntelligence {
    propertyIntelligence.find(func(p : PropExtTypes.PropertyIntelligence) : Bool {
      p.propertyId == propertyId
    })
  };

  public query func listPropertyIntelligence() : async [PropExtTypes.PropertyIntelligence] {
    propertyIntelligence.toArray()
  };
};
