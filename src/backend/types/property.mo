// Property, Lead, and Client domain types
module {
  public type PropertyStatus = {
    #available;
    #sold;
    #rented;
  };

  // Enriched Property type with full listing details
  public type Property = {
    id : Text;
    title : Text;
    location : Text;
    price : Text;          // display string e.g. "₹55 Lakh"
    area : Text;           // display string e.g. "1050 sq ft"
    type_ : Text;          // Apartment / Villa / Plot / Commercial
    status : Text;         // available / sold / rented
    images : [Text];
    description : Text;
    amenities : [Text];
    reraNumber : ?Text;
    builderName : Text;
    listingDate : Int;
    views : Nat;
    enquiries : Nat;
    tags : [Text];
    // keep legacy fields for backward compat
    propertyType : Text;
    priceRaw : Nat;        // raw numeric price for sorting
    areaRaw : Nat;         // raw numeric area
    createdAt : Int;
  };

  // Enriched Lead type with full CRM fields
  public type Lead = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    source : Text;         // WhatsApp / Website / Referral / Walk-in / 99acres
    stage : Text;          // New Lead / Contacted / Site Visit / Negotiation / Closed Won / Closed Lost
    heatScore : Nat;       // 0-100
    budget : Text;         // display string e.g. "50L-1Cr"
    propertyType : Text;
    location : Text;
    notes : Text;
    assignedTo : Text;
    createdAt : Int;
    lastContact : ?Int;
    followUpDate : ?Int;
    tags : [Text];
    // legacy compatibility
    interest : Text;
    score : Nat;           // alias for heatScore
    status : Text;         // alias for stage
  };

  // Enriched Client type with full CRM fields
  public type Client = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    type_ : Text;          // Buyer / Seller / Tenant / Investor
    totalDeals : Nat;
    totalValue : Text;
    status : Text;         // Active / Inactive / VIP
    joinedAt : Int;
    lastInteraction : ?Int;
    lifetimeValue : Nat;
    buyingReadiness : Text; // Hot / Warm / Cold
    notes : Text;
    // legacy compatibility
    address : Text;
    createdAt : Int;
    lastUpdated : Int;
  };
};
