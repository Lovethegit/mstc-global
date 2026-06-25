import PropertyTypes "types/property";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  // ── Old type definitions (from previous deployed version) ──────────────────

  type OldPropertyStatus = {
    #available;
    #sold;
    #rented;
  };

  type OldProperty = {
    id : Text;
    title : Text;
    propertyType : Text;
    location : Text;
    price : Nat;
    area : Nat;
    status : OldPropertyStatus;
    description : Text;
    createdAt : Int;
  };

  type OldLead = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    interest : Text;
    budget : Nat;
    status : Text;
    score : Nat;
    assignedTo : Text;
    createdAt : Int;
    lastContact : Int;
  };

  type OldClient = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    notes : Text;
    createdAt : Int;
    lastUpdated : Int;
  };

  // ── Migration actor state types ────────────────────────────────────────────

  type OldActor = {
    newProperties_ : List.List<OldProperty>;
    newLeads_ : List.List<OldLead>;
    newClients_ : List.List<OldClient>;
  };

  type NewActor = {
    newProperties_ : List.List<PropertyTypes.Property>;
    newLeads_ : List.List<PropertyTypes.Lead>;
    newClients_ : List.List<PropertyTypes.Client>;
  };

  // ── Helper: convert OldPropertyStatus to Text ─────────────────────────────

  func statusToText(s : OldPropertyStatus) : Text {
    switch s {
      case (#available) "available";
      case (#sold) "sold";
      case (#rented) "rented";
    };
  };

  // ── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate properties: add all new fields with safe defaults
    let newProperties_ = old.newProperties_.map<OldProperty, PropertyTypes.Property>(
      func(p) {
        {
          id = p.id;
          title = p.title;
          location = p.location;
          price = p.price.toText();       // Nat -> Text display string
          area = p.area.toText() # " sq ft"; // Nat -> Text display string
          type_ = p.propertyType;
          status = statusToText(p.status);
          images = [];
          description = p.description;
          amenities = [];
          reraNumber = null;
          builderName = "";
          listingDate = p.createdAt;
          views = 0;
          enquiries = 0;
          tags = [];
          propertyType = p.propertyType;
          priceRaw = p.price;
          areaRaw = p.area;
          createdAt = p.createdAt;
        };
      }
    );

    // Migrate leads: convert budget Nat -> Text, add new fields with defaults
    let newLeads_ = old.newLeads_.map<OldLead, PropertyTypes.Lead>(
      func(l) {
        {
          id = l.id;
          name = l.name;
          phone = l.phone;
          email = l.email;
          source = "";
          stage = l.status;
          heatScore = l.score;
          budget = l.budget.toText();    // Nat -> Text
          propertyType = "";
          location = "";
          notes = "";
          assignedTo = l.assignedTo;
          createdAt = l.createdAt;
          lastContact = ?(l.lastContact);
          followUpDate = null;
          tags = [];
          interest = l.interest;
          score = l.score;
          status = l.status;
        };
      }
    );

    // Migrate clients: add all new fields with safe defaults
    let newClients_ = old.newClients_.map<OldClient, PropertyTypes.Client>(
      func(c) {
        {
          id = c.id;
          name = c.name;
          phone = c.phone;
          email = c.email;
          type_ = "Buyer";
          totalDeals = 0;
          totalValue = "";
          status = "Active";
          joinedAt = c.createdAt;
          lastInteraction = ?(c.lastUpdated);
          lifetimeValue = 0;
          buyingReadiness = "Warm";
          notes = c.notes;
          address = c.address;
          createdAt = c.createdAt;
          lastUpdated = c.lastUpdated;
        };
      }
    );

    { newProperties_; newLeads_; newClients_ };
  };
};
