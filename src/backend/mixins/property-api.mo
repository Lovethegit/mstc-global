import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import PropertyLib "../lib/property";
import Types "../types/property";

mixin (
  properties : List.List<Types.Property>,
  leads : List.List<Types.Lead>,
  clients : List.List<Types.Client>,
  propState : { var nextPropertyCounter : Nat; var nextLeadCounter : Nat; var nextClientCounter : Nat }
) {

  // ─── Seed on first use ─────────────────────────────────────────────────────
  // Insert realistic demo data if lists are empty (first deploy)
  func seedIfEmpty() {
    if (leads.size() == 0) {
      let now = Time.now();
      leads.add({ id = "lead-1"; name = "Rajesh Mehta"; phone = "+91 9825001001"; email = "rajesh.mehta@gmail.com"; source = "99acres"; stage = "Negotiation"; heatScore = 85; budget = "80L-1.2Cr"; propertyType = "3 BHK Apartment"; location = "Satellite, Ahmedabad"; notes = "Prefers east-facing, ready to move. RERA-registered only."; assignedTo = "staff-1"; createdAt = now; lastContact = ?(now - 86_400_000_000_000); followUpDate = ?(now + 172_800_000_000_000); tags = ["hot", "rera", "ready-to-move"]; interest = "3 BHK Apartment"; score = 85; status = "Negotiation" });
      leads.add({ id = "lead-2"; name = "Priya Shah"; phone = "+91 9825002002"; email = "priya.shah@outlook.com"; source = "Referral"; stage = "Site Visit"; heatScore = 70; budget = "40L-60L"; propertyType = "2 BHK Apartment"; location = "Bopal, Ahmedabad"; notes = "Referred by existing client. Interested in under-construction options."; assignedTo = "staff-1"; createdAt = now; lastContact = ?(now - 2 * 86_400_000_000_000); followUpDate = ?(now + 86_400_000_000_000); tags = ["referral", "under-construction"]; interest = "2 BHK Apartment"; score = 70; status = "Site Visit" });
      leads.add({ id = "lead-3"; name = "Suresh Patel"; phone = "+91 9825003003"; email = "suresh.patel@yahoo.com"; source = "Walk-in"; stage = "Contacted"; heatScore = 55; budget = "1Cr-2Cr"; propertyType = "Commercial Office"; location = "SG Highway, Ahmedabad"; notes = "Looking for 2000+ sq ft office space for IT company."; assignedTo = ""; createdAt = now; lastContact = ?(now - 3 * 86_400_000_000_000); followUpDate = null; tags = ["commercial", "it-company"]; interest = "Commercial Office"; score = 55; status = "Contacted" });
      leads.add({ id = "lead-4"; name = "Anita Desai"; phone = "+91 9825004004"; email = "anita.desai@gmail.com"; source = "Website"; stage = "New Lead"; heatScore = 40; budget = "20L-35L"; propertyType = "1 BHK Apartment"; location = "Maninagar, Ahmedabad"; notes = "First-time buyer. Needs home loan guidance."; assignedTo = ""; createdAt = now; lastContact = null; followUpDate = ?(now + 86_400_000_000_000); tags = ["first-time-buyer", "loan-required"]; interest = "1 BHK Apartment"; score = 40; status = "New Lead" });
      leads.add({ id = "lead-5"; name = "Vikram Joshi"; phone = "+91 9825005005"; email = "vikram.joshi@businessmail.com"; source = "WhatsApp"; stage = "New Lead"; heatScore = 62; budget = "2Cr-5Cr"; propertyType = "Villa / Bungalow"; location = "Prahlad Nagar, Ahmedabad"; notes = "NRI investor. Looking for luxury villa for investment and occasional stay."; assignedTo = ""; createdAt = now; lastContact = null; followUpDate = null; tags = ["nri", "investor", "luxury"]; interest = "Villa / Bungalow"; score = 62; status = "New Lead" });
      propState.nextLeadCounter := 5;
    };
    if (properties.size() == 0) {
      let now = Time.now();
      properties.add(PropertyLib.newPropertyFull("cprop-1", "3 BHK Premium Apartment in Satellite", "Apartment", "Satellite, Ahmedabad", 9500000, "₹95 Lakh", 1650, "1650 sq ft", "Spacious 3 BHK in a premium gated community in Satellite. Marble flooring, modular kitchen, 2 covered parking.", ["Covered Parking", "Lift", "24x7 Security", "Club House", "Swimming Pool", "Power Backup"], ?"GJ/RERA/123456", "Safal Infrastructure", ["ready-to-move", "gated-community", "luxury"], ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]));
      properties.add(PropertyLib.newPropertyFull("cprop-2", "Commercial Office on SG Highway", "Commercial", "SG Highway, Ahmedabad", 18500000, "₹1.85 Cr", 3200, "3200 sq ft", "Grade A furnished office space on SG Highway. Ideal for IT, consulting, or BFSI companies. Floor-to-ceiling windows.", ["Covered Parking", "Lift", "24x7 Security", "Conference Room", "Power Backup", "High-Speed Internet"], ?"GJ/RERA/789012", "Savvy Developers", ["commercial", "sg-highway", "grade-a"], ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]));
      properties.add(PropertyLib.newPropertyFull("cprop-3", "4 BHK Villa in Prahlad Nagar", "Villa", "Prahlad Nagar, Ahmedabad", 32000000, "₹3.2 Cr", 5500, "5500 sq ft", "Ultra-luxury 4 BHK standalone villa with private pool, landscaped garden, and home automation.", ["Private Pool", "Landscaped Garden", "4 Car Parking", "Home Automation", "CCTV", "Generator Backup", "Servant Quarters"], ?"GJ/RERA/345678", "MSTC GLOBAL", ["luxury", "villa", "investment", "prahlad-nagar"], ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"]));
      propState.nextPropertyCounter := 3;
    };
  };

  // ─── Properties CRUD ────────────────────────────────────────────────────────

  public query func getProperties() : async [Types.Property] {
    seedIfEmpty();
    properties.toArray()
  };

  public query func getProperty(id : Text) : async ?Types.Property {
    seedIfEmpty();
    properties.find(func(p : Types.Property) : Bool { p.id == id })
  };

  public shared ({ caller }) func createProperty(
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
  ) : async Text {
    ignore caller;
    seedIfEmpty();
    propState.nextPropertyCounter += 1;
    let id = "prop-" # propState.nextPropertyCounter.toText();
    properties.add(PropertyLib.newPropertyFull(id, title, propertyType, location, price, priceText, area, areaText, description, amenities, reraNumber, builderName, tags, images));
    id
  };

  // Legacy addProperty kept for backward compatibility
  public shared ({ caller }) func addProperty(
    title : Text,
    propertyType : Text,
    location : Text,
    price : Nat,
    area : Nat,
    description : Text
  ) : async Text {
    ignore caller;
    seedIfEmpty();
    propState.nextPropertyCounter += 1;
    let id = "prop-" # propState.nextPropertyCounter.toText();
    properties.add(PropertyLib.newProperty(id, title, propertyType, location, price, area, description));
    id
  };

  public shared ({ caller }) func updateProperty(
    id : Text,
    title : Text,
    status : Text,
    description : Text
  ) : async Bool {
    ignore caller;
    var found = false;
    properties.mapInPlace(func(p : Types.Property) : Types.Property {
      if (p.id == id) {
        found := true;
        { p with title; status; description }
      } else { p }
    });
    found
  };

  public shared ({ caller }) func deleteProperty(id : Text) : async Bool {
    ignore caller;
    let before = properties.size();
    properties.retain(func(p : Types.Property) : Bool { p.id != id });
    properties.size() < before
  };

  public query func searchProperties(searchQuery : Text) : async [Types.Property] {
    seedIfEmpty();
    let q = searchQuery.toLower();
    properties.toArray().filter<Types.Property>(func(p) {
      p.title.toLower().contains(#text q) or p.location.toLower().contains(#text q) or
      p.type_.toLower().contains(#text q) or p.description.toLower().contains(#text q)
    })
  };

  public shared ({ caller }) func incrementPropertyViews(id : Text) : async Bool {
    ignore caller;
    var found = false;
    properties.mapInPlace(func(p : Types.Property) : Types.Property {
      if (p.id == id) {
        found := true;
        { p with views = p.views + 1 }
      } else { p }
    });
    found
  };

  public shared ({ caller }) func recordPropertyEnquiry(id : Text) : async Bool {
    ignore caller;
    var found = false;
    properties.mapInPlace(func(p : Types.Property) : Types.Property {
      if (p.id == id) {
        found := true;
        { p with enquiries = p.enquiries + 1 }
      } else { p }
    });
    found
  };

  // ─── Leads CRUD ──────────────────────────────────────────────────────────────

  public query func getLeads() : async [Types.Lead] {
    seedIfEmpty();
    leads.toArray()
  };

  public query func getLead(id : Text) : async ?Types.Lead {
    seedIfEmpty();
    leads.find(func(l : Types.Lead) : Bool { l.id == id })
  };

  public shared ({ caller }) func createLead(
    name : Text,
    phone : Text,
    email : Text,
    source : Text,
    budget : Text,
    propertyType : Text,
    location : Text
  ) : async Text {
    ignore caller;
    seedIfEmpty();
    propState.nextLeadCounter += 1;
    let id = "lead-" # propState.nextLeadCounter.toText();
    leads.add(PropertyLib.newLead(id, name, phone, email, source, budget, propertyType, location));
    id
  };

  // Legacy addLead for backward compatibility
  public shared ({ caller }) func addLead(
    name : Text,
    phone : Text,
    email : Text,
    interest : Text,
    budget : Nat
  ) : async Text {
    ignore caller;
    seedIfEmpty();
    propState.nextLeadCounter += 1;
    let id = "lead-" # propState.nextLeadCounter.toText();
    leads.add(PropertyLib.newLead(id, name, phone, email, "Walk-in", PropertyLib.natToDisplay(budget), interest, ""));
    id
  };

  public shared ({ caller }) func updateLeadStage(id : Text, stage : Text) : async Bool {
    ignore caller;
    var found = false;
    leads.mapInPlace(func(l : Types.Lead) : Types.Lead {
      if (l.id == id) {
        found := true;
        { l with stage; status = stage; lastContact = ?Time.now() }
      } else { l }
    });
    found
  };

  public shared ({ caller }) func updateLeadScore(id : Text, score : Nat) : async Bool {
    ignore caller;
    var found = false;
    leads.mapInPlace(func(l : Types.Lead) : Types.Lead {
      if (l.id == id) {
        found := true;
        { l with heatScore = score; score }
      } else { l }
    });
    found
  };

  public shared ({ caller }) func addLeadNote(id : Text, note : Text) : async Bool {
    ignore caller;
    var found = false;
    leads.mapInPlace(func(l : Types.Lead) : Types.Lead {
      if (l.id == id) {
        found := true;
        let newNotes = if (l.notes == "") { note } else { l.notes # "\n" # note };
        { l with notes = newNotes; lastContact = ?Time.now() }
      } else { l }
    });
    found
  };

  public shared ({ caller }) func assignLead(id : Text, staffId : Text) : async Bool {
    ignore caller;
    var found = false;
    leads.mapInPlace(func(l : Types.Lead) : Types.Lead {
      if (l.id == id) {
        found := true;
        { l with assignedTo = staffId }
      } else { l }
    });
    found
  };

  public shared ({ caller }) func deleteLead(id : Text) : async Bool {
    ignore caller;
    let before = leads.size();
    leads.retain(func(l : Types.Lead) : Bool { l.id != id });
    leads.size() < before
  };

  public query func searchLeads(searchQuery : Text) : async [Types.Lead] {
    seedIfEmpty();
    let q = searchQuery.toLower();
    leads.toArray().filter<Types.Lead>(func(l) {
      l.name.toLower().contains(#text q) or l.phone.contains(#text q) or
      l.email.toLower().contains(#text q) or l.location.toLower().contains(#text q) or
      l.propertyType.toLower().contains(#text q) or l.stage.toLower().contains(#text q)
    })
  };

  // Legacy updateLead for backward compat
  public shared ({ caller }) func updateLead(
    id : Text,
    status : Text,
    score : Nat,
    assignedTo : Text,
    notes : Text
  ) : async Bool {
    ignore (caller, notes);
    var found = false;
    leads.mapInPlace(func(l : Types.Lead) : Types.Lead {
      if (l.id == id) {
        found := true;
        { l with stage = status; status; score; heatScore = score; assignedTo; lastContact = ?Time.now() }
      } else { l }
    });
    found
  };

  // ─── Clients CRUD ────────────────────────────────────────────────────────────

  public query func getClients() : async [Types.Client] {
    clients.toArray()
  };

  public query func getClient(id : Text) : async ?Types.Client {
    clients.find(func(c : Types.Client) : Bool { c.id == id })
  };

  public shared ({ caller }) func createClient(
    name : Text,
    phone : Text,
    email : Text,
    clientType : Text,
    notes : Text
  ) : async Text {
    ignore caller;
    propState.nextClientCounter += 1;
    let id = "client-" # propState.nextClientCounter.toText();
    clients.add(PropertyLib.newClient(id, name, phone, email, clientType, notes));
    id
  };

  // Legacy addClient for backward compat
  public shared ({ caller }) func addClient(
    name : Text,
    phone : Text,
    email : Text,
    address : Text,
    notes : Text
  ) : async Text {
    ignore caller;
    propState.nextClientCounter += 1;
    let id = "client-" # propState.nextClientCounter.toText();
    clients.add(PropertyLib.newClient(id, name, phone, email, "Buyer", notes));
    id
  };

  public shared ({ caller }) func updateClient(
    id : Text,
    name : Text,
    phone : Text,
    email : Text,
    notes : Text
  ) : async Bool {
    ignore caller;
    var found = false;
    clients.mapInPlace(func(c : Types.Client) : Types.Client {
      if (c.id == id) {
        found := true;
        { c with name; phone; email; notes; lastUpdated = Time.now() }
      } else { c }
    });
    found
  };

  public shared ({ caller }) func deleteClient(id : Text) : async Bool {
    ignore caller;
    let before = clients.size();
    clients.retain(func(c : Types.Client) : Bool { c.id != id });
    clients.size() < before
  };

  public query func getClientsByStage(stage : Text) : async [Types.Client] {
    clients.toArray().filter<Types.Client>(func(c) { c.status == stage })
  };

  public query func searchClients(searchQuery : Text) : async [Types.Client] {
    let q = searchQuery.toLower();
    clients.toArray().filter<Types.Client>(func(c) {
      c.name.toLower().contains(#text q) or c.phone.contains(#text q) or
      c.email.toLower().contains(#text q) or c.type_.toLower().contains(#text q)
    })
  };
};
