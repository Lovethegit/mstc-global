// Extended property intelligence types
module {
  public type InvestmentGrade = {
    #buy;
    #hold;
    #avoid;
  };

  public type PriceHistoryEntry = {
    propertyId : Text;
    price : Nat;
    recordedAt : Int;
    recordedBy : Text;
    note : Text;
  };

  public type LocalityDemand = {
    locality : Text;
    viewCount : Nat;
    enquiryCount : Nat;
    lastUpdated : Int;
  };

  public type BuilderTrustRecord = {
    builderId : Text;
    builderName : Text;
    reraFilingCount : Nat;
    complaintCount : Nat;
    deliveryScore : Nat; // 0-100
    trustScore : Nat; // computed 0-100
    lastUpdated : Int;
  };

  public type JantriRate = {
    area : Text;
    ratePerSqFt : Nat; // in INR
    effectiveFrom : Text; // YYYY-MM-DD
    updatedAt : Int;
  };

  public type PropertyIntelligence = {
    propertyId : Text;
    reraNumber : Text;
    builderId : Text;
    amenities : [Text];
    investmentGrade : InvestmentGrade;
    negotiationMin : Nat;
    negotiationMax : Nat;
    builderTrustScore : Nat;
    latitude : Float;
    longitude : Float;
    updatedAt : Int;
  };
};
