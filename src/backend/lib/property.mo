import Types "../types/property";
import Time "mo:core/Time";

module {
  public type Property = Types.Property;
  public type Lead = Types.Lead;
  public type Client = Types.Client;

  // Create a new full-featured Property
  public func newProperty(
    id : Text,
    title : Text,
    propertyType : Text,
    location : Text,
    price : Nat,
    area : Nat,
    description : Text
  ) : Property {
    let priceText = if (price >= 10_000_000) {
      "₹" # natToDisplay(price / 10_000_000) # " Cr"
    } else if (price >= 100_000) {
      "₹" # natToDisplay(price / 100_000) # " Lakh"
    } else {
      "₹" # natToDisplay(price)
    };
    {
      id;
      title;
      location;
      price = priceText;
      area = natToDisplay(area) # " sq ft";
      type_ = propertyType;
      status = "available";
      images = [];
      description;
      amenities = [];
      reraNumber = null;
      builderName = "MSTC GLOBAL";
      listingDate = Time.now();
      views = 0;
      enquiries = 0;
      tags = [];
      propertyType;
      priceRaw = price;
      areaRaw = area;
      createdAt = Time.now();
    }
  };

  // Create a Property with full details
  public func newPropertyFull(
    id : Text,
    title : Text,
    propertyType : Text,
    location : Text,
    price : Nat,
    priceText : Text,
    area : Nat,
    areaText : Text,
    description : Text,
    amenities : [Text],
    reraNumber : ?Text,
    builderName : Text,
    tags : [Text],
    images : [Text]
  ) : Property {
    {
      id;
      title;
      location;
      price = priceText;
      area = areaText;
      type_ = propertyType;
      status = "available";
      images;
      description;
      amenities;
      reraNumber;
      builderName;
      listingDate = Time.now();
      views = 0;
      enquiries = 0;
      tags;
      propertyType;
      priceRaw = price;
      areaRaw = area;
      createdAt = Time.now();
    }
  };

  // Create a new full-featured Lead
  public func newLead(
    id : Text,
    name : Text,
    phone : Text,
    email : Text,
    source : Text,
    budget : Text,
    propertyType : Text,
    location : Text
  ) : Lead {
    {
      id;
      name;
      phone;
      email;
      source;
      stage = "New Lead";
      heatScore = 50;
      budget;
      propertyType;
      location;
      notes = "";
      assignedTo = "";
      createdAt = Time.now();
      lastContact = null;
      followUpDate = null;
      tags = [];
      interest = propertyType;
      score = 50;
      status = "New Lead";
    }
  };

  // Create a new full-featured Client
  public func newClient(
    id : Text,
    name : Text,
    phone : Text,
    email : Text,
    clientType : Text,
    notes : Text
  ) : Client {
    {
      id;
      name;
      phone;
      email;
      type_ = clientType;
      totalDeals = 0;
      totalValue = "₹0";
      status = "Active";
      joinedAt = Time.now();
      lastInteraction = null;
      lifetimeValue = 0;
      buyingReadiness = "Warm";
      notes;
      address = "";
      createdAt = Time.now();
      lastUpdated = Time.now();
    }
  };

  // Utility: Nat to display text
  public func natToDisplay(n : Nat) : Text {
    var result = "";
    var remaining = n;
    if (remaining == 0) { return "0" };
    while (remaining > 0) {
      let digit = remaining % 10;
      result := (switch digit {
        case 0 { "0" }; case 1 { "1" }; case 2 { "2" }; case 3 { "3" };
        case 4 { "4" }; case 5 { "5" }; case 6 { "6" }; case 7 { "7" };
        case 8 { "8" }; case 9 { "9" }; case _ { "" };
      }) # result;
      remaining := remaining / 10;
    };
    result
  };
};
