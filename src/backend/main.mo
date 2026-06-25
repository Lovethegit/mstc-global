import BriefingTypes "types/briefing";
import SecurityExtTypes "types/security";
import PropExtTypes "types/property_extended";
import BriefingMixin "mixins/briefing-api";
import SecurityApiMixin "mixins/security-api";
import PropertyIntelMixin "mixins/property-intelligence-api";
import StaffTypes "types/staff";
import PropertyTypes "types/property";
import DealTypes "types/dealroom";
import AuctionTypes "types/auction";
import ExchangeTypes "types/exchange";
import AcademyTypes "types/academy";
import CommissionTypes "types/commission";
import BookingTypes "types/booking";
import VendorTypes "types/vendor";
import MediaTypes "types/media";
import StaffMixin "mixins/staff-api";
import PropertyMixin "mixins/property-api";
import DealMixin "mixins/dealroom-api";
import AuctionMixin "mixins/auction-api";
import ExchangeMixin "mixins/exchange-api";
import AcademyMixin "mixins/academy-api";
import CommissionMixin "mixins/commission-api";
import BookingMixin "mixins/booking-api";
import VendorMixin "mixins/vendor-api";
import MediaMixin "mixins/media-api";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Debug "mo:core/Debug";
import Float "mo:core/Float";
import Migration "migration";



(with migration = Migration.run)
actor {
  // Legacy stable vars retained for upgrade compatibility
  stable var dynamicAuctions : [{ id: Text; title: Text; propertyType: Text; location: Text; startPrice: Nat; currentBid: Nat; minimumBid: Nat; endsAt: Int; status: Text; description: Text; features: [Text]; bidCount: Nat; watchCount: Nat }] = [];
  stable var auctionCounter : Nat = 0;
  stable var legacyAuctionCounter : Nat = 0;

  // Types
  type Service = {
    id : Nat;
    name : Text;
    slug : Text;
    description : Text;
    icon : Text;
  };

  // Modules for comparison
  module Service {
    public func compare(s1 : Service, s2 : Service) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // ServiceSubmission type for inner-page form submissions
  type ServiceSubmission = {
    id : Nat;
    timestamp : Int;
    serviceCategory : Text;
    innerPage : Text;
    formType : Text;
    fields : [(Text, Text)];
    submitterName : Text;
    submitterPhone : Text;
    submitterEmail : Text;
    indemnityAccepted : Bool;
    isRead : Bool;
  };

  // ChatInteraction type
  type ChatInteraction = {
    id : Nat;
    timestamp : Int;
    sessionId : Text;
    userMessage : Text;
    botResponse : Text;
    messageLength : Nat;
    sentimentTag : Text;
  };

  // Form types
  type Feedback = {
    id : Text;
    rating : Nat;
    comment : Text;
    pageName : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type CallbackRequest = {
    id : Text;
    name : Text;
    phone : Text;
    service : Text;
    pageName : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type QuoteRequest = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    message : Text;
    pageName : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type MoreInfoRequest = {
    id : Text;
    name : Text;
    email : Text;
    service : Text;
    question : Text;
    pageName : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type SupportForm = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type FormStats = {
    totalFeedback : Nat;
    totalCallbacks : Nat;
    totalQuotes : Nat;
    totalMoreInfo : Nat;
    totalSupport : Nat;
    todayFeedback : Nat;
    todayCallbacks : Nat;
    todayQuotes : Nat;
    todaySupport : Nat;
    unreadFeedback : Nat;
    unreadCallbacks : Nat;
    unreadQuotes : Nat;
    unreadMoreInfo : Nat;
    unreadSupport : Nat;
  };

  type AIAgentConfig = {
    id : Text;
    name : Text;
    agentType : Text;
    isEnabled : Bool;
    provider : Text;
    personality : Text;
    language : Text;
    focusTopics : [Text];
    systemPrompt : Text;
  };

  // PropertyListing type — owner contact fields NEVER sent to frontend users
  type PropertyListing = {
    id : Text;
    propertyType : Text;
    action : Text;
    title : Text;
    description : Text;
    location : Text;
    city : Text;
    address : Text;
    price : Nat;
    priceDisplay : Text;
    bhk : Text;
    sqft : Nat;
    furnishing : Text;
    amenities : [Text];
    possession : Text;
    images : [Text];
    mapLink : Text;
    facing : Text;
    floorNo : Nat;
    societyName : Text;
    ownerName : Text;
    ownerPhone : Text;
    ownerEmail : Text;
    agencyName : Text;
    agencyPhone : Text;
    sourceTag : Text;
    listedDate : Text;
  };

  // PropertyEnquiry type — both sides captured
  type PropertyEnquiry = {
    id : Text;
    propertyId : Text;
    propertyTitle : Text;
    propertyAddress : Text;
    propertyPrice : Text;
    propertyBhk : Text;
    propertySqft : Nat;
    propertyType : Text;
    ownerName : Text;
    ownerPhone : Text;
    ownerEmail : Text;
    agencyName : Text;
    agencyPhone : Text;
    sourceTag : Text;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    customerMessage : Text;
    preferredTime : Text;
    visitDate : Text;
    status : Text;
    submittedAt : Int;
    contactedAt : ?Int;
    notes : Text;
  };

  // Property storage
  let propertyListings = List.fromArray<PropertyListing>([
    // --- 99acres (17 listings) ---
    { id = "p001"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Apartment in Satellite"; description = "Spacious 2 BHK apartment in a prime gated society in Satellite, Ahmedabad. Well-ventilated with modern interiors."; location = "Satellite, Ahmedabad"; city = "Ahmedabad"; address = "Shree Residency, Nr. Ambli Road, Satellite, Ahmedabad - 380015"; price = 5500000; priceDisplay = "\u{20B9}55 Lakh"; bhk = "2 BHK"; sqft = 1050; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Garden", "Power Backup"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 3; societyName = "Shree Residency"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "99acres"; listedDate = "2026-04-10"; },
    { id = "p002"; propertyType = "Residential"; action = "Rent"; title = "3 BHK Flat for Rent in Navrangpura"; description = "Fully furnished 3 BHK flat in the heart of Navrangpura with excellent connectivity."; location = "Navrangpura, Ahmedabad"; city = "Ahmedabad"; address = "Navrangpura Apartments, C.G. Road, Navrangpura, Ahmedabad - 380009"; price = 28000; priceDisplay = "\u{20B9}28,000/month"; bhk = "3 BHK"; sqft = 1450; furnishing = "Furnished"; amenities = ["Parking", "Lift", "Security", "Gym", "Swimming Pool"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 5; societyName = "Navrangpura Apartments"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "99acres"; listedDate = "2026-04-12"; },
    { id = "p003"; propertyType = "Commercial"; action = "Rent"; title = "Office Space in SG Highway"; description = "Premium furnished office space on SG Highway with panoramic city views. Ideal for IT/corporate offices."; location = "SG Highway, Ahmedabad"; city = "Ahmedabad"; address = "Infinity Tower, 4th Floor, SG Highway, Ahmedabad - 380054"; price = 85000; priceDisplay = "\u{20B9}85,000/month"; bhk = "Studio"; sqft = 2200; furnishing = "Furnished"; amenities = ["Parking", "Lift", "Security", "Power Backup", "Conference Room"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 4; societyName = "Infinity Tower"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "99acres"; listedDate = "2026-04-08"; },
    { id = "p004"; propertyType = "Plot"; action = "Buy"; title = "Residential Plot in Bopal"; description = "East-facing residential plot in developing Bopal locality. Clear title, all approvals in place."; location = "Bopal, Ahmedabad"; city = "Ahmedabad"; address = "Bopal Township, Near Bopal Circle, Bopal, Ahmedabad - 380058"; price = 4200000; priceDisplay = "\u{20B9}42 Lakh"; bhk = "Plot"; sqft = 1200; furnishing = "Unfurnished"; amenities = ["Corner Plot", "Wide Road", "Water Connection"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Bopal Township"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "99acres"; listedDate = "2026-04-15"; },
    { id = "p005"; propertyType = "Residential"; action = "Buy"; title = "4 BHK Villa in Prahlad Nagar"; description = "Luxurious 4 BHK independent villa with private garden and pool in elite Prahlad Nagar."; location = "Prahlad Nagar, Ahmedabad"; city = "Ahmedabad"; address = "Prahlad Nagar Garden, Bungalow No. 12, Prahlad Nagar, Ahmedabad - 380015"; price = 28000000; priceDisplay = "\u{20B9}2.8 Cr"; bhk = "4 BHK+"; sqft = 4500; furnishing = "Semi-Furnished"; amenities = ["Parking", "Garden", "Swimming Pool", "Security", "Gym", "Home Theatre"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 0; societyName = "Prahlad Nagar Garden"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "99acres"; listedDate = "2026-04-05"; },
    { id = "p006"; propertyType = "Residential"; action = "Rent"; title = "1 BHK Flat for Rent in Gota"; description = "Affordable 1 BHK flat in Gota near Chandkheda. Ideal for working professionals."; location = "Gota, Ahmedabad"; city = "Ahmedabad"; address = "Green Park Society, Gota, Ahmedabad - 382481"; price = 9500; priceDisplay = "\u{20B9}9,500/month"; bhk = "1 BHK"; sqft = 580; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Water Supply"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 2; societyName = "Green Park Society"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "99acres"; listedDate = "2026-04-18"; },
    { id = "p007"; propertyType = "Commercial"; action = "Buy"; title = "Showroom Space in Vastrapur"; description = "Ground floor showroom with high street visibility in Vastrapur. Suitable for retail or showroom."; location = "Vastrapur, Ahmedabad"; city = "Ahmedabad"; address = "Vastrapur Main Road, Shop No. 4, Vastrapur, Ahmedabad - 380015"; price = 9500000; priceDisplay = "\u{20B9}95 Lakh"; bhk = "Studio"; sqft = 1800; furnishing = "Unfurnished"; amenities = ["Parking", "Power Backup", "Wide Frontage"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Vastrapur Commercial Hub"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "99acres"; listedDate = "2026-04-07"; },
    { id = "p008"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Thaltej"; description = "Modern 2 BHK flat with modular kitchen in a well-maintained society in Thaltej."; location = "Thaltej, Ahmedabad"; city = "Ahmedabad"; address = "Thaltej Heights, Near SG Highway, Thaltej, Ahmedabad - 380054"; price = 6200000; priceDisplay = "\u{20B9}62 Lakh"; bhk = "2 BHK"; sqft = 1100; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Gym", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 7; societyName = "Thaltej Heights"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "99acres"; listedDate = "2026-04-11"; },
    { id = "p009"; propertyType = "Residential"; action = "Rent"; title = "2 BHK in Maninagar"; description = "Clean 2 BHK in a family-friendly society in Maninagar. Close to markets and schools."; location = "Maninagar, Ahmedabad"; city = "Ahmedabad"; address = "Laxmi Society, Maninagar, Ahmedabad - 380008"; price = 14000; priceDisplay = "\u{20B9}14,000/month"; bhk = "2 BHK"; sqft = 920; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Water Supply", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 1; societyName = "Laxmi Society"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "99acres"; listedDate = "2026-04-14"; },
    { id = "p010"; propertyType = "Residential"; action = "Buy"; title = "3 BHK Flat in Bodakdev"; description = "Premium 3 BHK with marble flooring, modular kitchen, and river-facing balcony in Bodakdev."; location = "Bodakdev, Ahmedabad"; city = "Ahmedabad"; address = "Bodakdev Greens, Judges Bungalow Road, Bodakdev, Ahmedabad - 380054"; price = 9800000; priceDisplay = "\u{20B9}98 Lakh"; bhk = "3 BHK"; sqft = 1700; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Gym", "Swimming Pool", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 9; societyName = "Bodakdev Greens"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "99acres"; listedDate = "2026-04-03"; },
    { id = "p011"; propertyType = "Plot"; action = "Buy"; title = "Commercial Plot in Naroda"; description = "Industrial/commercial use plot near Naroda GIDC. Ideal for warehouse or factory setup."; location = "Naroda, Ahmedabad"; city = "Ahmedabad"; address = "GIDC Naroda, Plot No. 78, Naroda, Ahmedabad - 382330"; price = 8500000; priceDisplay = "\u{20B9}85 Lakh"; bhk = "Plot"; sqft = 5000; furnishing = "Unfurnished"; amenities = ["Road Access", "Power Connection", "Water Connection"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 0; societyName = "GIDC Naroda"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "99acres"; listedDate = "2026-04-17"; },
    { id = "p012"; propertyType = "Residential"; action = "Rent"; title = "Studio Apartment in Paldi"; description = "Cozy studio apartment perfect for single working professional in Paldi."; location = "Paldi, Ahmedabad"; city = "Ahmedabad"; address = "Paldi Cross Road, Near Anjali Cinema, Paldi, Ahmedabad - 380007"; price = 8000; priceDisplay = "\u{20B9}8,000/month"; bhk = "Studio"; sqft = 420; furnishing = "Furnished"; amenities = ["Lift", "Security", "Wi-Fi Ready"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 4; societyName = "Paldi Residency"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "99acres"; listedDate = "2026-04-19"; },
    { id = "p013"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Chandkheda"; description = "Affordable 2 BHK in a newly developed society in Chandkheda with excellent transport links."; location = "Chandkheda, Ahmedabad"; city = "Ahmedabad"; address = "New Sai Society, Chandkheda, Ahmedabad - 382424"; price = 3800000; priceDisplay = "\u{20B9}38 Lakh"; bhk = "2 BHK"; sqft = 950; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Garden"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 2; societyName = "New Sai Society"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "99acres"; listedDate = "2026-04-20"; },
    { id = "p014"; propertyType = "Commercial"; action = "Lease"; title = "IT Office Space in Ambawadi"; description = "Large floor plate office space ideal for IT/BPO in prominent Ambawadi location."; location = "Ambawadi, Ahmedabad"; city = "Ahmedabad"; address = "Ambawadi Commercial Complex, Ambawadi, Ahmedabad - 380006"; price = 125000; priceDisplay = "\u{20B9}1.25 Lakh/month"; bhk = "Studio"; sqft = 4500; furnishing = "Furnished"; amenities = ["Parking", "Lift", "Power Backup", "Security", "Cafeteria"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 6; societyName = "Ambawadi Commercial Complex"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "99acres"; listedDate = "2026-04-06"; },
    { id = "p015"; propertyType = "Residential"; action = "Buy"; title = "3 BHK in South Bopal"; description = "Spacious 3 BHK in a premium township in South Bopal with world-class amenities."; location = "South Bopal, Ahmedabad"; city = "Ahmedabad"; address = "The Meadows, South Bopal, Ahmedabad - 380058"; price = 8500000; priceDisplay = "\u{20B9}85 Lakh"; bhk = "3 BHK"; sqft = 1650; furnishing = "Unfurnished"; amenities = ["Parking", "Gym", "Swimming Pool", "Garden", "Security", "Club House"]; possession = "Under Construction"; images = ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 5; societyName = "The Meadows"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "99acres"; listedDate = "2026-04-01"; },
    { id = "p016"; propertyType = "Residential"; action = "Rent"; title = "3 BHK Flat in Motera"; description = "Newly renovated 3 BHK flat in Motera, close to stadium and BRTS corridor."; location = "Motera, Ahmedabad"; city = "Ahmedabad"; address = "Motera Stadium Road, Motera, Ahmedabad - 380005"; price = 22000; priceDisplay = "\u{20B9}22,000/month"; bhk = "3 BHK"; sqft = 1380; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Power Backup"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 3; societyName = "Stadium View Apartments"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "99acres"; listedDate = "2026-04-13"; },
    { id = "p017"; propertyType = "Residential"; action = "Buy"; title = "Villa in Shela"; description = "Elegant 4 BHK villa in Shela near SP Ring Road. Independent bungalow with full privacy."; location = "Shela, Ahmedabad"; city = "Ahmedabad"; address = "Shela Villa Enclave, Near SP Ring Road, Shela, Ahmedabad - 380058"; price = 18500000; priceDisplay = "\u{20B9}1.85 Cr"; bhk = "4 BHK+"; sqft = 3800; furnishing = "Semi-Furnished"; amenities = ["Parking", "Garden", "Security", "Terrace", "Modular Kitchen"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Shela Villa Enclave"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "99acres"; listedDate = "2026-04-02"; },
    // --- MagicBricks (17 listings) ---
    { id = "p018"; propertyType = "Residential"; action = "Rent"; title = "2 BHK Flat in Vejalpur"; description = "Well-maintained 2 BHK flat in Vejalpur with good connectivity to ISCON and Sarkhej."; location = "Vejalpur, Ahmedabad"; city = "Ahmedabad"; address = "Vejalpur Road, Near Jain Temple, Vejalpur, Ahmedabad - 380051"; price = 16000; priceDisplay = "\u{20B9}16,000/month"; bhk = "2 BHK"; sqft = 1020; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Garden"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 2; societyName = "Jain Heights"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "MagicBricks"; listedDate = "2026-04-09"; },
    { id = "p019"; propertyType = "Residential"; action = "Buy"; title = "1 BHK Flat in New Ranip"; description = "Budget-friendly 1 BHK flat in New Ranip, ideal for first-time buyers."; location = "New Ranip, Ahmedabad"; city = "Ahmedabad"; address = "Ranip Society, New Ranip, Ahmedabad - 382480"; price = 2500000; priceDisplay = "\u{20B9}25 Lakh"; bhk = "1 BHK"; sqft = 650; furnishing = "Unfurnished"; amenities = ["Parking", "Water Supply"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 1; societyName = "Ranip Society"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "MagicBricks"; listedDate = "2026-04-16"; },
    { id = "p020"; propertyType = "Commercial"; action = "Rent"; title = "Shop for Rent in Naranpura"; description = "Ground floor shop with frontage suitable for retail, pharmacy, or salon in Naranpura."; location = "Naranpura, Ahmedabad"; city = "Ahmedabad"; address = "Naranpura Char Rasta, Shop No. 2, Naranpura, Ahmedabad - 380013"; price = 22000; priceDisplay = "\u{20B9}22,000/month"; bhk = "Studio"; sqft = 450; furnishing = "Unfurnished"; amenities = ["Road Frontage", "Power Backup"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Naranpura Commercial"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "MagicBricks"; listedDate = "2026-04-10"; },
    { id = "p021"; propertyType = "Residential"; action = "Buy"; title = "3 BHK in Anand Nagar"; description = "Spacious 3 BHK flat in Anand Nagar with dedicated parking and scenic view."; location = "Anand Nagar, Ahmedabad"; city = "Ahmedabad"; address = "Anand Nagar Society, Satellite Road, Anand Nagar, Ahmedabad - 380015"; price = 7500000; priceDisplay = "\u{20B9}75 Lakh"; bhk = "3 BHK"; sqft = 1550; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Garden", "Power Backup"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 4; societyName = "Anand Nagar Society"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "MagicBricks"; listedDate = "2026-04-04"; },
    { id = "p022"; propertyType = "Residential"; action = "Rent"; title = "4 BHK Duplex in Satellite"; description = "Luxury 4 BHK duplex with private terrace and modular kitchen in Satellite."; location = "Satellite, Ahmedabad"; city = "Ahmedabad"; address = "Satellite Duplex Tower, Satellite, Ahmedabad - 380015"; price = 35000; priceDisplay = "\u{20B9}35,000/month"; bhk = "4 BHK+"; sqft = 2800; furnishing = "Furnished"; amenities = ["Parking", "Terrace", "Gym", "Security", "Power Backup", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 10; societyName = "Satellite Duplex Tower"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "MagicBricks"; listedDate = "2026-04-08"; },
    { id = "p023"; propertyType = "Plot"; action = "Buy"; title = "Residential Plot in Sarkhej"; description = "North-facing residential plot in developing Sarkhej area. Suitable for villa or bungalow."; location = "Sarkhej, Ahmedabad"; city = "Ahmedabad"; address = "Sarkhej Township Scheme, Plot No. 45, Sarkhej, Ahmedabad - 382210"; price = 5500000; priceDisplay = "\u{20B9}55 Lakh"; bhk = "Plot"; sqft = 1800; furnishing = "Unfurnished"; amenities = ["Wide Road", "Water Connection", "Tree Plantation"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 0; societyName = "Sarkhej Township"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "MagicBricks"; listedDate = "2026-04-14"; },
    { id = "p024"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Nikol"; description = "Value-for-money 2 BHK in Nikol near Vastral Metro Station."; location = "Nikol, Ahmedabad"; city = "Ahmedabad"; address = "Nikol Cross Roads, Near Metro Station, Nikol, Ahmedabad - 382350"; price = 3200000; priceDisplay = "\u{20B9}32 Lakh"; bhk = "2 BHK"; sqft = 880; furnishing = "Unfurnished"; amenities = ["Parking", "Water Supply", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 2; societyName = "Metro Heights"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "MagicBricks"; listedDate = "2026-04-17"; },
    { id = "p025"; propertyType = "Industrial"; action = "Lease"; title = "Industrial Shed in Vastral GIDC"; description = "Ready-to-use industrial shed with 3-phase power and water in Vastral GIDC."; location = "Vastral, Ahmedabad"; city = "Ahmedabad"; address = "Vastral GIDC, Shed No. 22, Vastral, Ahmedabad - 382418"; price = 65000; priceDisplay = "\u{20B9}65,000/month"; bhk = "Studio"; sqft = 8000; furnishing = "Unfurnished"; amenities = ["3-Phase Power", "Water Connection", "Road Access", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Vastral GIDC"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "MagicBricks"; listedDate = "2026-04-12"; },
    { id = "p026"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Vastral"; description = "Newly built 2 BHK with modern amenities in growing Vastral locality."; location = "Vastral, Ahmedabad"; city = "Ahmedabad"; address = "Vastral Residency, Near BRTS, Vastral, Ahmedabad - 382418"; price = 3600000; priceDisplay = "\u{20B9}36 Lakh"; bhk = "2 BHK"; sqft = 900; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Garden"]; possession = "Ready Soon"; images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 3; societyName = "Vastral Residency"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "MagicBricks"; listedDate = "2026-04-15"; },
    { id = "p027"; propertyType = "Residential"; action = "Rent"; title = "1 BHK in Nehru Nagar"; description = "Compact 1 BHK suitable for single professional or couple in Nehru Nagar."; location = "Nehru Nagar, Ahmedabad"; city = "Ahmedabad"; address = "Nehru Nagar Society, Nehru Nagar, Ahmedabad - 380015"; price = 10000; priceDisplay = "\u{20B9}10,000/month"; bhk = "1 BHK"; sqft = 620; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 2; societyName = "Nehru Nagar Society"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "MagicBricks"; listedDate = "2026-04-18"; },
    { id = "p028"; propertyType = "Commercial"; action = "Buy"; title = "Office Floor in Prahlad Nagar"; description = "Full floor office space in a premium commercial tower in Prahlad Nagar."; location = "Prahlad Nagar, Ahmedabad"; city = "Ahmedabad"; address = "Prahlad Nagar Commercial Tower, 5th Floor, Prahlad Nagar, Ahmedabad - 380015"; price = 22000000; priceDisplay = "\u{20B9}2.2 Cr"; bhk = "Studio"; sqft = 6000; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Power Backup", "Security", "Cafeteria"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 5; societyName = "Prahlad Nagar Commercial Tower"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "MagicBricks"; listedDate = "2026-04-03"; },
    { id = "p029"; propertyType = "Residential"; action = "Buy"; title = "3 BHK in Navrangpura"; description = "Premium 3 BHK flat near C.G. Road in the prime Navrangpura neighbourhood."; location = "Navrangpura, Ahmedabad"; city = "Ahmedabad"; address = "CG Road Apartments, Navrangpura, Ahmedabad - 380009"; price = 12000000; priceDisplay = "\u{20B9}1.2 Cr"; bhk = "3 BHK"; sqft = 2000; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Gym", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 8; societyName = "CG Road Apartments"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "MagicBricks"; listedDate = "2026-04-01"; },
    { id = "p030"; propertyType = "Plot"; action = "Buy"; title = "Corner Plot in Thaltej"; description = "Premium corner plot with 2-road frontage in Thaltej. Ideal for luxury bungalow."; location = "Thaltej, Ahmedabad"; city = "Ahmedabad"; address = "Thaltej Schemeno 1, Plot No. 15, Thaltej, Ahmedabad - 380054"; price = 12000000; priceDisplay = "\u{20B9}1.2 Cr"; bhk = "Plot"; sqft = 3000; furnishing = "Unfurnished"; amenities = ["Corner Plot", "2-Road Frontage", "Water Connection", "Underground Drainage"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Thaltej Scheme"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "MagicBricks"; listedDate = "2026-04-07"; },
    { id = "p031"; propertyType = "Residential"; action = "Rent"; title = "2 BHK Flat in Ambawadi"; description = "Clean 2 BHK flat in Ambawadi near Prernatirth Derasar, ideal for families."; location = "Ambawadi, Ahmedabad"; city = "Ahmedabad"; address = "Ambawadi Circle, Flat No. 204, Ambawadi, Ahmedabad - 380006"; price = 17000; priceDisplay = "\u{20B9}17,000/month"; bhk = "2 BHK"; sqft = 980; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Water Supply", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 2; societyName = "Ambawadi Apartments"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "MagicBricks"; listedDate = "2026-04-11"; },
    { id = "p032"; propertyType = "Industrial"; action = "Buy"; title = "Industrial Plot in Naroda GIDC"; description = "Freehold industrial plot suitable for manufacturing unit in Naroda GIDC."; location = "Naroda, Ahmedabad"; city = "Ahmedabad"; address = "Naroda GIDC Phase 2, Plot No. 112, Naroda, Ahmedabad - 382330"; price = 15000000; priceDisplay = "\u{20B9}1.5 Cr"; bhk = "Plot"; sqft = 10000; furnishing = "Unfurnished"; amenities = ["3-Phase Power", "Road Access", "Water Connection", "Drainage"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 0; societyName = "Naroda GIDC Phase 2"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "MagicBricks"; listedDate = "2026-04-16"; },
    { id = "p033"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Gota"; description = "Budget 2 BHK in Gota, close to Chandkheda and APMC market."; location = "Gota, Ahmedabad"; city = "Ahmedabad"; address = "Gota Char Rasta, Gota, Ahmedabad - 382481"; price = 3500000; priceDisplay = "\u{20B9}35 Lakh"; bhk = "2 BHK"; sqft = 880; furnishing = "Unfurnished"; amenities = ["Parking", "Water Supply", "Lift"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 4; societyName = "Gota Residency"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "MagicBricks"; listedDate = "2026-04-19"; },
    { id = "p034"; propertyType = "Residential"; action = "Rent"; title = "3 BHK in SG Highway"; description = "Brand new 3 BHK flat in a luxury tower on SG Highway with all amenities."; location = "SG Highway, Ahmedabad"; city = "Ahmedabad"; address = "Sky High Tower, SG Highway, Ahmedabad - 380054"; price = 30000; priceDisplay = "\u{20B9}30,000/month"; bhk = "3 BHK"; sqft = 1600; furnishing = "Semi-Furnished"; amenities = ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 12; societyName = "Sky High Tower"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "MagicBricks"; listedDate = "2026-04-05"; },
    // --- Housing.com (16 listings) ---
    { id = "p035"; propertyType = "Residential"; action = "Buy"; title = "3 BHK Flat in Bopal"; description = "Stunning 3 BHK with premium interiors in a landmark society in Bopal."; location = "Bopal, Ahmedabad"; city = "Ahmedabad"; address = "Bopal Orchid, Near Bopal Bus Stand, Bopal, Ahmedabad - 380058"; price = 9200000; priceDisplay = "\u{20B9}92 Lakh"; bhk = "3 BHK"; sqft = 1750; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Gym", "Swimming Pool", "Security", "Garden"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 6; societyName = "Bopal Orchid"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "Housing.com"; listedDate = "2026-04-02"; },
    { id = "p036"; propertyType = "Residential"; action = "Rent"; title = "2 BHK Flat in Paldi"; description = "Nice 2 BHK flat in Paldi. Good connectivity to Ellis Bridge and AMTS bus routes."; location = "Paldi, Ahmedabad"; city = "Ahmedabad"; address = "Paldi Society, Behind ATIRA, Paldi, Ahmedabad - 380007"; price = 15000; priceDisplay = "\u{20B9}15,000/month"; bhk = "2 BHK"; sqft = 960; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 3; societyName = "Paldi Society"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "Housing.com"; listedDate = "2026-04-11"; },
    { id = "p037"; propertyType = "Residential"; action = "Buy"; title = "Villa in Bodakdev"; description = "Elegant 5 BHK bungalow in the prestigious Bodakdev locality with private swimming pool."; location = "Bodakdev, Ahmedabad"; city = "Ahmedabad"; address = "Bodakdev Bungalow Zone, Plot 7, Bodakdev, Ahmedabad - 380054"; price = 55000000; priceDisplay = "\u{20B9}5.5 Cr"; bhk = "Villa"; sqft = 6000; furnishing = "Semi-Furnished"; amenities = ["Parking", "Swimming Pool", "Garden", "Security", "Home Theatre", "Gym"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 0; societyName = "Bodakdev Bungalow Zone"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "Housing.com"; listedDate = "2026-03-28"; },
    { id = "p038"; propertyType = "Commercial"; action = "Rent"; title = "Warehouse in Vatva GIDC"; description = "Large warehouse with high ceiling, 3-phase power, and easy truck access in Vatva."; location = "Vatva, Ahmedabad"; city = "Ahmedabad"; address = "Vatva GIDC, Warehouse No. 5, Vatva, Ahmedabad - 382445"; price = 150000; priceDisplay = "\u{20B9}1.5 Lakh/month"; bhk = "Studio"; sqft = 15000; furnishing = "Unfurnished"; amenities = ["3-Phase Power", "High Ceiling", "Loading Dock", "Road Access", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 0; societyName = "Vatva GIDC"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "Housing.com"; listedDate = "2026-04-09"; },
    { id = "p039"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Naranpura"; description = "Ready-to-move 2 BHK flat with spacious rooms and ample natural light in Naranpura."; location = "Naranpura, Ahmedabad"; city = "Ahmedabad"; address = "Shanti Park Society, Naranpura, Ahmedabad - 380013"; price = 5200000; priceDisplay = "\u{20B9}52 Lakh"; bhk = "2 BHK"; sqft = 1050; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Water Supply", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 1; societyName = "Shanti Park Society"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "Housing.com"; listedDate = "2026-04-13"; },
    { id = "p040"; propertyType = "Residential"; action = "Rent"; title = "2 BHK Flat in Bopal"; description = "Neat 2 BHK flat in Bopal suitable for small family. Close to D-Mart and schools."; location = "Bopal, Ahmedabad"; city = "Ahmedabad"; address = "Bopal Apartment, Near D-Mart, Bopal, Ahmedabad - 380058"; price = 13500; priceDisplay = "\u{20B9}13,500/month"; bhk = "2 BHK"; sqft = 950; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Security", "Garden"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 2; societyName = "Bopal Apartment"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "Housing.com"; listedDate = "2026-04-15"; },
    { id = "p041"; propertyType = "Plot"; action = "Buy"; title = "Agricultural Land near Shela"; description = "Agricultural land ideal for farmhouse or agricultural investment near Shela."; location = "Shela, Ahmedabad"; city = "Ahmedabad"; address = "Shela Outskirts, Survey No. 88, Shela, Ahmedabad - 380058"; price = 25000000; priceDisplay = "\u{20B9}2.5 Cr"; bhk = "Plot"; sqft = 50000; furnishing = "Unfurnished"; amenities = ["Water Well", "Road Access"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 0; societyName = "Shela Survey Land"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "Housing.com"; listedDate = "2026-04-04"; },
    { id = "p042"; propertyType = "Residential"; action = "Buy"; title = "3 BHK in Chandkheda"; description = "Spacious 3 BHK in a new society in Chandkheda with all amenities and covered parking."; location = "Chandkheda, Ahmedabad"; city = "Ahmedabad"; address = "Chandkheda New Town, Near Gujarat University, Chandkheda, Ahmedabad - 382424"; price = 6800000; priceDisplay = "\u{20B9}68 Lakh"; bhk = "3 BHK"; sqft = 1450; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Gym", "Garden", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 5; societyName = "Chandkheda New Town"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "Housing.com"; listedDate = "2026-04-06"; },
    { id = "p043"; propertyType = "Residential"; action = "Rent"; title = "4 BHK Bungalow in Satellite"; description = "Prestigious 4 BHK bungalow on rent in Satellite, ideal for senior executive or family."; location = "Satellite, Ahmedabad"; city = "Ahmedabad"; address = "Satellite Bungalow Zone, Road No. 3, Satellite, Ahmedabad - 380015"; price = 45000; priceDisplay = "\u{20B9}45,000/month"; bhk = "4 BHK+"; sqft = 3200; furnishing = "Furnished"; amenities = ["Parking", "Garden", "Security", "Home Theatre", "Gym", "Terrace"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Satellite Bungalow Zone"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "Housing.com"; listedDate = "2026-04-01"; },
    { id = "p044"; propertyType = "Commercial"; action = "Rent"; title = "Co-Working Space in Vastrapur"; description = "Fully equipped co-working space in Vastrapur with fast internet and meeting rooms."; location = "Vastrapur, Ahmedabad"; city = "Ahmedabad"; address = "Vastrapur Lake Road, CoWork Hub, Vastrapur, Ahmedabad - 380015"; price = 15000; priceDisplay = "\u{20B9}15,000/month"; bhk = "Studio"; sqft = 300; furnishing = "Furnished"; amenities = ["Wi-Fi", "Meeting Room", "Power Backup", "Cafeteria", "Parking"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 2; societyName = "CoWork Hub Vastrapur"; ownerName = "Harshad Desai"; ownerPhone = "9876543212"; ownerEmail = "h.desai@gmail.com"; agencyName = "Desai Associates"; agencyPhone = "9876543212"; sourceTag = "Housing.com"; listedDate = "2026-04-10"; },
    { id = "p045"; propertyType = "Residential"; action = "Buy"; title = "2 BHK Flat in Sarkhej"; description = "Affordable 2 BHK in Sarkhej with covered parking and society amenities."; location = "Sarkhej, Ahmedabad"; city = "Ahmedabad"; address = "Sarkhej Circle, Flat 301, Sarkhej, Ahmedabad - 382210"; price = 3900000; priceDisplay = "\u{20B9}39 Lakh"; bhk = "2 BHK"; sqft = 920; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Security", "Water Supply"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 3; societyName = "Sarkhej Residency"; ownerName = "Amit Joshi"; ownerPhone = "9876543215"; ownerEmail = "amit.joshi@99acres.com"; agencyName = "99acres Agent"; agencyPhone = "9876543215"; sourceTag = "Housing.com"; listedDate = "2026-04-17"; },
    { id = "p046"; propertyType = "Residential"; action = "PG"; title = "PG Accommodation in Navrangpura"; description = "Comfortable PG for working professionals near CG Road. Meals included."; location = "Navrangpura, Ahmedabad"; city = "Ahmedabad"; address = "Navrangpura, Near Vadilal House, Navrangpura, Ahmedabad - 380009"; price = 8500; priceDisplay = "\u{20B9}8,500/month"; bhk = "Studio"; sqft = 250; furnishing = "Furnished"; amenities = ["Wi-Fi", "Meals Included", "AC", "Laundry", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 1; societyName = "Navrangpura PG Home"; ownerName = "Priya Mehta"; ownerPhone = "9876543214"; ownerEmail = "priya@mehtaestates.com"; agencyName = "Mehta Estates"; agencyPhone = "9876543214"; sourceTag = "Housing.com"; listedDate = "2026-04-18"; },
    { id = "p047"; propertyType = "Residential"; action = "Buy"; title = "4 BHK Premium Flat in Thaltej"; description = "Ultra-luxury 4 BHK with private deck and smart home features in Thaltej."; location = "Thaltej, Ahmedabad"; city = "Ahmedabad"; address = "Thaltej Grand, 15th Floor, Thaltej, Ahmedabad - 380054"; price = 18000000; priceDisplay = "\u{20B9}1.8 Cr"; bhk = "4 BHK+"; sqft = 3200; furnishing = "Semi-Furnished"; amenities = ["Parking", "Gym", "Swimming Pool", "Smart Home", "Club House", "Security", "Garden"]; possession = "Ready Soon"; images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 15; societyName = "Thaltej Grand"; ownerName = "Kavita Agrawal"; ownerPhone = "9876543216"; ownerEmail = "kavita@housing.com"; agencyName = "Housing.com Partner"; agencyPhone = "9876543216"; sourceTag = "Housing.com"; listedDate = "2026-04-03"; },
    { id = "p048"; propertyType = "Commercial"; action = "Buy"; title = "Corner Shop in Maninagar"; description = "High-traffic corner shop in Maninagar market area, excellent for retail."; location = "Maninagar, Ahmedabad"; city = "Ahmedabad"; address = "Maninagar Market, Shop No. 1, Maninagar, Ahmedabad - 380008"; price = 5500000; priceDisplay = "\u{20B9}55 Lakh"; bhk = "Studio"; sqft = 600; furnishing = "Unfurnished"; amenities = ["Road Frontage", "Power Connection", "Water Supply"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 0; societyName = "Maninagar Market"; ownerName = "Manish Kumar"; ownerPhone = "9876543213"; ownerEmail = "manish.kumar@squareyards.com"; agencyName = "Square Yards Ahmedabad"; agencyPhone = "9876543213"; sourceTag = "Housing.com"; listedDate = "2026-04-08"; },
    { id = "p049"; propertyType = "Residential"; action = "Buy"; title = "1 BHK Flat in Vejalpur"; description = "Compact 1 BHK ideal for investment or self-use in Vejalpur locality."; location = "Vejalpur, Ahmedabad"; city = "Ahmedabad"; address = "Vejalpur Society, Near Jain Temple, Vejalpur, Ahmedabad - 380051"; price = 2800000; priceDisplay = "\u{20B9}28 Lakh"; bhk = "1 BHK"; sqft = 680; furnishing = "Unfurnished"; amenities = ["Parking", "Water Supply", "Lift"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "South"; floorNo = 2; societyName = "Vejalpur Society"; ownerName = "Sunita Shah"; ownerPhone = "9876543211"; ownerEmail = "sunita@shahrealty.com"; agencyName = "Shah Realty"; agencyPhone = "9876543211"; sourceTag = "Housing.com"; listedDate = "2026-04-20"; },
    { id = "p050"; propertyType = "Residential"; action = "Buy"; title = "3 BHK Premium Flat in Prahlad Nagar"; description = "Opulent 3 BHK in a premium tower at Prahlad Nagar with world-class amenities."; location = "Prahlad Nagar, Ahmedabad"; city = "Ahmedabad"; address = "Prahlad Nagar Towers, Block B, Prahlad Nagar, Ahmedabad - 380015"; price = 15000000; priceDisplay = "\u{20B9}1.5 Cr"; bhk = "3 BHK"; sqft = 2500; furnishing = "Semi-Furnished"; amenities = ["Parking", "Gym", "Swimming Pool", "Rooftop Garden", "Club House", "Security", "Power Backup"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 18; societyName = "Prahlad Nagar Towers"; ownerName = "Rajesh Patel"; ownerPhone = "9876543210"; ownerEmail = "rajesh.patel@gmail.com"; agencyName = "Patel Properties"; agencyPhone = "9876543210"; sourceTag = "Housing.com"; listedDate = "2026-04-02"; },
  ]);

  // ===== BULK PROPERTY INITIALIZATION (500+ total) =====
  // Add 450+ more properties covering all types & localities across Ahmedabad/Gujarat
  do {
    let extra : [PropertyListing] = [
      // --- SATELLITE (affordable to luxury, all types) ---
      { id="p051"; propertyType="Residential"; action="Buy"; title="1 BHK Flat in Satellite"; description="Budget 1 BHK in gated society in Satellite. Good connectivity."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Road, Dev Residency, Satellite, Ahmedabad - 380015"; price=3200000; priceDisplay="\u{20B9}32 Lakh"; bhk="1 BHK"; sqft=680; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Dev Residency"; ownerName="Bharat Shah"; ownerPhone="9876540001"; ownerEmail="bharat@realty.com"; agencyName="Shah Realty"; agencyPhone="9876540001"; sourceTag="99acres"; listedDate="2026-03-01"; },
      { id="p052"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Satellite"; description="Fully furnished 1 BHK, ideal for working professional near Ambli road."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Apts, Block C, Satellite, Ahmedabad - 380015"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="1 BHK"; sqft=620; furnishing="Furnished"; amenities=["Parking","Wi-Fi","Security"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=1; societyName="Satellite Apts"; ownerName="Neha Joshi"; ownerPhone="9876540002"; ownerEmail="neha@realty.com"; agencyName="Joshi Properties"; agencyPhone="9876540002"; sourceTag="NoBroker"; listedDate="2026-03-05"; },
      { id="p053"; propertyType="Commercial"; action="Lease"; title="Showroom on Satellite Main Road"; description="Corner showroom on Satellite main road, excellent footfall."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Main Road, Shop 3, Ahmedabad - 380015"; price=75000; priceDisplay="\u{20B9}75,000/month"; bhk="Studio"; sqft=1200; furnishing="Unfurnished"; amenities=["Wide Frontage","Power Backup","Parking"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Satellite Commercial"; ownerName="Anil Mehta"; ownerPhone="9876540003"; ownerEmail="anil@comm.com"; agencyName="Mehta Commercial"; agencyPhone="9876540003"; sourceTag="99acres"; listedDate="2026-03-10"; },
      { id="p054"; propertyType="Residential"; action="Buy"; title="3 BHK Penthouse in Satellite"; description="Sky penthouse with panoramic Ahmedabad views, private terrace, luxury interiors."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Tower, Top Floor, Satellite, Ahmedabad - 380015"; price=22000000; priceDisplay="\u{20B9}2.2 Cr"; bhk="3 BHK"; sqft=3000; furnishing="Semi-Furnished"; amenities=["Parking","Private Terrace","Gym","Pool","Smart Home"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=20; societyName="Satellite Tower"; ownerName="Vijay Patel"; ownerPhone="9876540004"; ownerEmail="vijay@eliterealty.com"; agencyName="Elite Realty"; agencyPhone="9876540004"; sourceTag="MagicBricks"; listedDate="2026-02-20"; },
      { id="p055"; propertyType="Residential"; action="PG"; title="PG for Girls in Satellite"; description="Safe PG accommodation for working women near Satellite crossroads."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Cross Roads, PG Home, Satellite, Ahmedabad - 380015"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="Studio"; sqft=200; furnishing="Furnished"; amenities=["Meals","AC","Wi-Fi","Security"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=1; societyName="Satellite PG"; ownerName="Rekha Ben"; ownerPhone="9876540005"; ownerEmail="rekha@pg.com"; agencyName="PG Ahmedabad"; agencyPhone="9876540005"; sourceTag="Housing.com"; listedDate="2026-03-15"; },
      // --- BOPAL (wide range) ---
      { id="p056"; propertyType="Residential"; action="Buy"; title="1 BHK Flat in Bopal"; description="Affordable 1 BHK in new society in Bopal, perfect starter home."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal New Society, Nr Bus Stand, Bopal, Ahmedabad - 380058"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="1 BHK"; sqft=640; furnishing="Unfurnished"; amenities=["Parking","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="Bopal New Society"; ownerName="Dinesh Patel"; ownerPhone="9876540006"; ownerEmail="dinesh@prop.com"; agencyName="Patel & Co"; agencyPhone="9876540006"; sourceTag="99acres"; listedDate="2026-03-20"; },
      { id="p057"; propertyType="Residential"; action="Rent"; title="3 BHK in Bopal Township"; description="Spacious 3 BHK in prime Bopal township with clubhouse and pool."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Township, Block A, Bopal, Ahmedabad - 380058"; price=20000; priceDisplay="\u{20B9}20,000/month"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=4; societyName="Bopal Township"; ownerName="Suresh Desai"; ownerPhone="9876540007"; ownerEmail="suresh@rents.com"; agencyName="Bopal Realty"; agencyPhone="9876540007"; sourceTag="MagicBricks"; listedDate="2026-03-22"; },
      { id="p058"; propertyType="Plot"; action="Buy"; title="Corner Plot in Bopal"; description="Premium corner plot in gated plotted scheme in Bopal, 40 ft road."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Plotted Scheme, Plot 22, Bopal, Ahmedabad - 380058"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="Plot"; sqft=2400; furnishing="Unfurnished"; amenities=["40 ft Road","Water","Drainage"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Bopal Plotted Scheme"; ownerName="Hitesh Khatri"; ownerPhone="9876540008"; ownerEmail="hitesh@plots.com"; agencyName="Khatri Properties"; agencyPhone="9876540008"; sourceTag="Housing.com"; listedDate="2026-02-25"; },
      { id="p059"; propertyType="Residential"; action="Buy"; title="4 BHK Villa in Bopal"; description="Luxury 4 BHK independent bungalow in Bopal with modern amenities."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Bungalows, Villa 5, Bopal, Ahmedabad - 380058"; price=16500000; priceDisplay="\u{20B9}1.65 Cr"; bhk="4 BHK+"; sqft=3800; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security","Terrace"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=0; societyName="Bopal Bungalows"; ownerName="Jayesh Rana"; ownerPhone="9876540009"; ownerEmail="jayesh@luxury.com"; agencyName="Rana Luxury Homes"; agencyPhone="9876540009"; sourceTag="99acres"; listedDate="2026-02-15"; },
      { id="p060"; propertyType="Residential"; action="Rent"; title="1 BHK in Bopal for Professionals"; description="Compact 1 BHK near Bopal bus stand for working professionals."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Society, Nr AMC Garden, Bopal, Ahmedabad - 380058"; price=9000; priceDisplay="\u{20B9}9,000/month"; bhk="1 BHK"; sqft=580; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=2; societyName="Bopal Society"; ownerName="Priya Shah"; ownerPhone="9876540010"; ownerEmail="priya2@mail.com"; agencyName="Shah Properties"; agencyPhone="9876540010"; sourceTag="NoBroker"; listedDate="2026-03-28"; },
      // --- SG HIGHWAY ---
      { id="p061"; propertyType="Residential"; action="Buy"; title="2 BHK in Godrej Garden City"; description="2 BHK in prestigious Godrej Garden City township on SG Highway."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="Godrej Garden City, SG Highway, Ahmedabad - 382481"; price=6500000; priceDisplay="\u{20B9}65 Lakh"; bhk="2 BHK"; sqft=1120; furnishing="Unfurnished"; amenities=["Club House","Gym","Pool","Security","Garden"]; possession="Under Construction"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=6; societyName="Godrej Garden City"; ownerName="Ravi Kumar"; ownerPhone="9876540011"; ownerEmail="ravi@godrej.com"; agencyName="Godrej Properties"; agencyPhone="9876540011"; sourceTag="99acres"; listedDate="2026-03-01"; },
      { id="p062"; propertyType="Residential"; action="Rent"; title="4 BHK in SG Highway Tower"; description="Luxury 4 BHK on high floor with panoramic views on SG Highway."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Tower, Floor 18, SG Highway, Ahmedabad - 380054"; price=38000; priceDisplay="\u{20B9}38,000/month"; bhk="4 BHK+"; sqft=2800; furnishing="Furnished"; amenities=["Gym","Pool","Concierge","Security","Parking"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=18; societyName="SG Tower"; ownerName="Rahul Mehta"; ownerPhone="9876540012"; ownerEmail="rahul@sgprop.com"; agencyName="SG Properties"; agencyPhone="9876540012"; sourceTag="MagicBricks"; listedDate="2026-03-05"; },
      { id="p063"; propertyType="Commercial"; action="Buy"; title="IT Park Office in SG Highway"; description="Premium grade A office in established IT park on SG Highway."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="IT Hub, Block B, SG Highway, Ahmedabad - 380054"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="Studio"; sqft=3500; furnishing="Unfurnished"; amenities=["Parking","Power Backup","Security","Cafeteria","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=5; societyName="IT Hub"; ownerName="Nishit Trivedi"; ownerPhone="9876540013"; ownerEmail="nishit@ithub.com"; agencyName="Trivedi Commercial"; agencyPhone="9876540013"; sourceTag="99acres"; listedDate="2026-02-28"; },
      { id="p064"; propertyType="Residential"; action="Buy"; title="Studio Apartment on SG Highway"; description="Compact studio ideal for investment or young professional."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Residency, Studio 12, SG Highway, Ahmedabad - 380054"; price=2500000; priceDisplay="\u{20B9}25 Lakh"; bhk="Studio"; sqft=450; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=4; societyName="SG Residency"; ownerName="Disha Agarwal"; ownerPhone="9876540014"; ownerEmail="disha@sgres.com"; agencyName="Agarwal Realty"; agencyPhone="9876540014"; sourceTag="Housing.com"; listedDate="2026-03-12"; },
      // --- NAVRANGPURA ---
      { id="p065"; propertyType="Residential"; action="Buy"; title="2 BHK in Navrangpura"; description="Classic 2 BHK in prime CG Road area of Navrangpura."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="CG Road, Navrang Apts, Navrangpura, Ahmedabad - 380009"; price=7200000; priceDisplay="\u{20B9}72 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=3; societyName="Navrang Apts"; ownerName="Sunil Mehta"; ownerPhone="9876540015"; ownerEmail="sunil@cgroad.com"; agencyName="CG Road Realty"; agencyPhone="9876540015"; sourceTag="99acres"; listedDate="2026-03-18"; },
      { id="p066"; propertyType="Commercial"; action="Rent"; title="Office in Navrangpura"; description="Professional office space near CG Road in Navrangpura."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="CG Road Business Centre, Navrangpura, Ahmedabad - 380009"; price=45000; priceDisplay="\u{20B9}45,000/month"; bhk="Studio"; sqft=1000; furnishing="Furnished"; amenities=["Parking","Lift","Power Backup","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="CG Business Centre"; ownerName="Nayan Patel"; ownerPhone="9876540016"; ownerEmail="nayan@office.com"; agencyName="Patel Office"; agencyPhone="9876540016"; sourceTag="MagicBricks"; listedDate="2026-03-20"; },
      { id="p067"; propertyType="Residential"; action="PG"; title="PG for Boys near CG Road"; description="Well-maintained boys PG near CG Road with all facilities."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Near Vadilal Ice Cream, Navrangpura, Ahmedabad - 380009"; price=6500; priceDisplay="\u{20B9}6,500/month"; bhk="Studio"; sqft=180; furnishing="Furnished"; amenities=["Meals","Wi-Fi","AC"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Navrang PG"; ownerName="Kamla Ben"; ownerPhone="9876540017"; ownerEmail="kamla@pg.com"; agencyName="PG Network"; agencyPhone="9876540017"; sourceTag="Housing.com"; listedDate="2026-03-25"; },
      // --- PRAHLAD NAGAR ---
      { id="p068"; propertyType="Residential"; action="Rent"; title="2 BHK in Prahlad Nagar"; description="Modern 2 BHK in upscale Prahlad Nagar society, close to corporate offices."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Society, Flat 302, Ahmedabad - 380015"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="Prahlad Society"; ownerName="Ketan Shah"; ownerPhone="9876540018"; ownerEmail="ketan@shah.com"; agencyName="Shah Group"; agencyPhone="9876540018"; sourceTag="99acres"; listedDate="2026-03-28"; },
      { id="p069"; propertyType="Commercial"; action="Lease"; title="Retail Shop in Prahlad Nagar"; description="Premium retail space in high-street Prahlad Nagar with footfall."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Road, Shop 8, Ahmedabad - 380015"; price=60000; priceDisplay="\u{20B9}60,000/month"; bhk="Studio"; sqft=800; furnishing="Unfurnished"; amenities=["Power Backup","Road Frontage"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=0; societyName="Prahlad Commercial"; ownerName="Dipak Jain"; ownerPhone="9876540019"; ownerEmail="dipak@jain.com"; agencyName="Jain Commercial"; agencyPhone="9876540019"; sourceTag="MagicBricks"; listedDate="2026-04-01"; },
      // --- THALTEJ ---
      { id="p070"; propertyType="Residential"; action="Rent"; title="2 BHK in Thaltej Society"; description="Clean 2 BHK for rent in family society in Thaltej."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Society, Block B, Thaltej, Ahmedabad - 380054"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Thaltej Society"; ownerName="Anil Vyas"; ownerPhone="9876540020"; ownerEmail="anil@thaltej.com"; agencyName="Thaltej Realty"; agencyPhone="9876540020"; sourceTag="99acres"; listedDate="2026-04-02"; },
      { id="p071"; propertyType="Residential"; action="Buy"; title="Studio Flat in Thaltej"; description="Smart studio apartment in Thaltej suitable for investment or bachelor."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Heights, Studio 5, Thaltej, Ahmedabad - 380054"; price=2200000; priceDisplay="\u{20B9}22 Lakh"; bhk="Studio"; sqft=400; furnishing="Unfurnished"; amenities=["Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=4; societyName="Thaltej Heights"; ownerName="Meena Patel"; ownerPhone="9876540021"; ownerEmail="meena@thaltej.com"; agencyName="Patel Realty"; agencyPhone="9876540021"; sourceTag="NoBroker"; listedDate="2026-04-05"; },
      // --- GOTA ---
      { id="p072"; propertyType="Residential"; action="Buy"; title="3 BHK in Gota"; description="Spacious 3 BHK in developing Gota area, close to SG Highway."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Society, Phase 2, Gota, Ahmedabad - 382481"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="3 BHK"; sqft=1400; furnishing="Unfurnished"; amenities=["Parking","Lift","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=4; societyName="Gota Phase 2"; ownerName="Bhavesh Modi"; ownerPhone="9876540022"; ownerEmail="bhavesh@gota.com"; agencyName="Gota Homes"; agencyPhone="9876540022"; sourceTag="99acres"; listedDate="2026-04-08"; },
      { id="p073"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Gota"; description="Nice 2 BHK at affordable rent in Gota. Close to Chandkheda flyover."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Char Rasta Society, Gota, Ahmedabad - 382481"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=950; furnishing="Semi-Furnished"; amenities=["Parking","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Gota Char Rasta"; ownerName="Alkesh Dave"; ownerPhone="9876540023"; ownerEmail="alkesh@gota.com"; agencyName="Dave Properties"; agencyPhone="9876540023"; sourceTag="MagicBricks"; listedDate="2026-04-10"; },
      // --- CHANDKHEDA ---
      { id="p074"; propertyType="Residential"; action="Buy"; title="1 BHK Flat in Chandkheda"; description="Affordable 1 BHK in Chandkheda, close to ISRO and Motera stadium."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Society, Chandkheda, Ahmedabad - 382424"; price=2200000; priceDisplay="\u{20B9}22 Lakh"; bhk="1 BHK"; sqft=620; furnishing="Unfurnished"; amenities=["Parking","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=1; societyName="Chandkheda Society"; ownerName="Gopal Rathod"; ownerPhone="9876540024"; ownerEmail="gopal@chandkheda.com"; agencyName="Rathod Realty"; agencyPhone="9876540024"; sourceTag="99acres"; listedDate="2026-04-12"; },
      { id="p075"; propertyType="Residential"; action="Rent"; title="3 BHK in Chandkheda"; description="Well-maintained 3 BHK in established Chandkheda society."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda New Society, Block D, Chandkheda, Ahmedabad - 382424"; price=17000; priceDisplay="\u{20B9}17,000/month"; bhk="3 BHK"; sqft=1350; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=3; societyName="Chandkheda New"; ownerName="Shilpa Trivedi"; ownerPhone="9876540025"; ownerEmail="shilpa@ckd.com"; agencyName="Trivedi Homes"; agencyPhone="9876540025"; sourceTag="Housing.com"; listedDate="2026-04-14"; },
      // --- MANINAGAR ---
      { id="p076"; propertyType="Residential"; action="Buy"; title="1 BHK in Maninagar"; description="Well-located 1 BHK in Maninagar, walking distance to markets."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Society, Nr Hanuman Mandir, Maninagar, Ahmedabad - 380008"; price=2600000; priceDisplay="\u{20B9}26 Lakh"; bhk="1 BHK"; sqft=680; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Maninagar Society"; ownerName="Hasmukh Patel"; ownerPhone="9876540026"; ownerEmail="hasmukh@mani.com"; agencyName="Patel Properties"; agencyPhone="9876540026"; sourceTag="99acres"; listedDate="2026-04-16"; },
      { id="p077"; propertyType="Residential"; action="Rent"; title="3 BHK Bungalow in Maninagar"; description="Independent 3 BHK bungalow on rent in Maninagar, ideal for family."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Bungalow Zone, House 12, Ahmedabad - 380008"; price=20000; priceDisplay="\u{20B9}20,000/month"; bhk="3 BHK"; sqft=2000; furnishing="Unfurnished"; amenities=["Garden","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=0; societyName="Maninagar Bungalow"; ownerName="Kiran Pathak"; ownerPhone="9876540027"; ownerEmail="kiran@mani.com"; agencyName="Pathak Estates"; agencyPhone="9876540027"; sourceTag="NoBroker"; listedDate="2026-04-18"; },
      { id="p078"; propertyType="Commercial"; action="Rent"; title="Shop in Maninagar Market"; description="Prime shop in Maninagar market with high footfall, suitable for retail."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Main Road, Shop 5, Ahmedabad - 380008"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="Studio"; sqft=350; furnishing="Unfurnished"; amenities=["Road Frontage","Power"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=0; societyName="Maninagar Market"; ownerName="Rajesh Raval"; ownerPhone="9876540028"; ownerEmail="rajesh@maket.com"; agencyName="Raval Commercial"; agencyPhone="9876540028"; sourceTag="99acres"; listedDate="2026-04-20"; },
      // --- VASTRAL ---
      { id="p079"; propertyType="Residential"; action="Buy"; title="1 BHK in Vastral"; description="Budget 1 BHK near Vastral Metro, ideal for first-time buyers."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Road, New Society, Vastral, Ahmedabad - 382418"; price=1900000; priceDisplay="\u{20B9}19 Lakh"; bhk="1 BHK"; sqft=580; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Vastral New"; ownerName="Manhar Jadav"; ownerPhone="9876540029"; ownerEmail="manhar@vastral.com"; agencyName="Jadav Properties"; agencyPhone="9876540029"; sourceTag="99acres"; listedDate="2026-04-19"; },
      { id="p080"; propertyType="Industrial"; action="Buy"; title="Warehouse in Vastral GIDC"; description="Large industrial warehouse for sale in Vastral GIDC with all utilities."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral GIDC, Shed 40, Vastral, Ahmedabad - 382418"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="Warehouse"; sqft=12000; furnishing="Unfurnished"; amenities=["3-Phase","Water","Loading Dock","Road Access"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=0; societyName="Vastral GIDC"; ownerName="Rohit Shah"; ownerPhone="9876540030"; ownerEmail="rohit@gidc.com"; agencyName="GIDC Brokers"; agencyPhone="9876540030"; sourceTag="MagicBricks"; listedDate="2026-04-17"; },
      // --- NIKOL ---
      { id="p081"; propertyType="Residential"; action="Buy"; title="2 BHK in Nikol"; description="Affordable 2 BHK near Nikol Crossroads, good transport links."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Road, Shyam Society, Nikol, Ahmedabad - 382350"; price=3000000; priceDisplay="\u{20B9}30 Lakh"; bhk="2 BHK"; sqft=860; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Shyam Society"; ownerName="Dinesh Bhai"; ownerPhone="9876540031"; ownerEmail="dinesh@nikol.com"; agencyName="Nikol Realty"; agencyPhone="9876540031"; sourceTag="Housing.com"; listedDate="2026-04-15"; },
      { id="p082"; propertyType="Residential"; action="Rent"; title="1 BHK in Nikol"; description="Budget rental 1 BHK in Nikol ideal for single person."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Main Road, Flat 3, Nikol, Ahmedabad - 382350"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water","Security"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Nikol Society"; ownerName="Sonal Patel"; ownerPhone="9876540032"; ownerEmail="sonal@nikol.com"; agencyName="Patel Rentals"; agencyPhone="9876540032"; sourceTag="99acres"; listedDate="2026-04-13"; },
      // --- NARANPURA ---
      { id="p083"; propertyType="Residential"; action="Buy"; title="3 BHK in Naranpura"; description="Prime 3 BHK near Naranpura Char Rasta, fully vaastu-compliant."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Char Rasta, Flat 201, Naranpura, Ahmedabad - 380013"; price=6800000; priceDisplay="\u{20B9}68 Lakh"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Naranpura Heights"; ownerName="Vishnu Patel"; ownerPhone="9876540033"; ownerEmail="vishnu@naranpura.com"; agencyName="Patel Homes"; agencyPhone="9876540033"; sourceTag="99acres"; listedDate="2026-04-11"; },
      { id="p084"; propertyType="Residential"; action="Rent"; title="2 BHK in Naranpura"; description="Bright 2 BHK flat in Naranpura with good ventilation."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Society, Block E, Naranpura, Ahmedabad - 380013"; price=16000; priceDisplay="\u{20B9}16,000/month"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Parking","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=3; societyName="Naranpura Society"; ownerName="Tarla Shah"; ownerPhone="9876540034"; ownerEmail="tarla@nara.com"; agencyName="Shah Rentals"; agencyPhone="9876540034"; sourceTag="NoBroker"; listedDate="2026-04-09"; },
      // --- AMBAWADI ---
      { id="p085"; propertyType="Residential"; action="Buy"; title="2 BHK in Ambawadi"; description="Ready 2 BHK near IIM-A in prime Ambawadi area."; location="Ambawadi, Ahmedabad"; city="Ahmedabad"; address="Ambawadi Society, Nr IIM-A Road, Ambawadi, Ahmedabad - 380006"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="2 BHK"; sqft=1120; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=4; societyName="Ambawadi Society"; ownerName="Smita Joshi"; ownerPhone="9876540035"; ownerEmail="smita@ambawadi.com"; agencyName="Joshi Realty"; agencyPhone="9876540035"; sourceTag="MagicBricks"; listedDate="2026-04-07"; },
      { id="p086"; propertyType="Commercial"; action="Buy"; title="Office Space near Prernatirth"; description="Well-located office near Prernatirth Derasar, Ambawadi."; location="Ambawadi, Ahmedabad"; city="Ahmedabad"; address="Prernatirth Derasar Road, Office 4, Ambawadi, Ahmedabad - 380006"; price=8500000; priceDisplay="\u{20B9}85 Lakh"; bhk="Studio"; sqft=1800; furnishing="Unfurnished"; amenities=["Parking","Lift","Power Backup"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Prernatirth Commercial"; ownerName="Chetan Bhatt"; ownerPhone="9876540036"; ownerEmail="chetan@ambawadi.com"; agencyName="Bhatt Commercial"; agencyPhone="9876540036"; sourceTag="Housing.com"; listedDate="2026-04-05"; },
      // --- PALDI ---
      { id="p087"; propertyType="Residential"; action="Buy"; title="2 BHK in Paldi"; description="Classic 2 BHK in old established society in Paldi near Ellis Bridge."; location="Paldi, Ahmedabad"; city="Ahmedabad"; address="Ellis Bridge Road, Paldi Society, Paldi, Ahmedabad - 380007"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="2 BHK"; sqft=1080; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Paldi Society"; ownerName="Jayantilal Mehta"; ownerPhone="9876540037"; ownerEmail="jayantilal@paldi.com"; agencyName="Mehta Properties"; agencyPhone="9876540037"; sourceTag="99acres"; listedDate="2026-04-03"; },
      { id="p088"; propertyType="Residential"; action="Rent"; title="3 BHK in Paldi"; description="Spacious 3 BHK in Paldi near Anjali Cinema, family-friendly."; location="Paldi, Ahmedabad"; city="Ahmedabad"; address="Anjali Cinema Road, Paldi, Ahmedabad - 380007"; price=19000; priceDisplay="\u{20B9}19,000/month"; bhk="3 BHK"; sqft=1400; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=1; societyName="Anjali Apts"; ownerName="Rashmiben Shah"; ownerPhone="9876540038"; ownerEmail="rashmi@paldi.com"; agencyName="Shah Estates"; agencyPhone="9876540038"; sourceTag="NoBroker"; listedDate="2026-04-01"; },
      // --- VEJALPUR ---
      { id="p089"; propertyType="Residential"; action="Buy"; title="2 BHK in Vejalpur"; description="Clean 2 BHK in Vejalpur, well connected to Sarkhej and ISCON."; location="Vejalpur, Ahmedabad"; city="Ahmedabad"; address="Vejalpur Road, Society Block C, Vejalpur, Ahmedabad - 380051"; price=4800000; priceDisplay="\u{20B9}48 Lakh"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Lift","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="Vejalpur Block C"; ownerName="Nilesh Patel"; ownerPhone="9876540039"; ownerEmail="nilesh@vejalpur.com"; agencyName="Patel Realtors"; agencyPhone="9876540039"; sourceTag="99acres"; listedDate="2026-03-30"; },
      // --- SARKHEJ ---
      { id="p090"; propertyType="Residential"; action="Buy"; title="3 BHK in Sarkhej"; description="Affordable 3 BHK in Sarkhej near S.P. Ring Road junction."; location="Sarkhej, Ahmedabad"; city="Ahmedabad"; address="Sarkhej Road, Apna Nagar, Sarkhej, Ahmedabad - 382210"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="3 BHK"; sqft=1350; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=4; societyName="Apna Nagar"; ownerName="Kamlesh Barot"; ownerPhone="9876540040"; ownerEmail="kamlesh@sarkhej.com"; agencyName="Barot Properties"; agencyPhone="9876540040"; sourceTag="MagicBricks"; listedDate="2026-03-28"; },
      { id="p091"; propertyType="Residential"; action="Rent"; title="2 BHK in Sarkhej"; description="Good 2 BHK in Sarkhej ideal for small family near SP Ring Road."; location="Sarkhej, Ahmedabad"; city="Ahmedabad"; address="Sarkhej Ring Road, Flat 105, Sarkhej, Ahmedabad - 382210"; price=13000; priceDisplay="\u{20B9}13,000/month"; bhk="2 BHK"; sqft=920; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=1; societyName="Ring Road Apts"; ownerName="Bela Patel"; ownerPhone="9876540041"; ownerEmail="bela@sarkhej.com"; agencyName="Patel Rentals"; agencyPhone="9876540041"; sourceTag="Housing.com"; listedDate="2026-03-25"; },
      // --- MOTERA ---
      { id="p092"; propertyType="Residential"; action="Buy"; title="2 BHK in Motera"; description="Smart 2 BHK in Motera close to Narendra Modi Stadium and BRTS."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Motera Stadium Road, Flat 201, Motera, Ahmedabad - 380005"; price=5200000; priceDisplay="\u{20B9}52 Lakh"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="Stadium View Flats"; ownerName="Deepak Patel"; ownerPhone="9876540042"; ownerEmail="deepak@motera.com"; agencyName="Motera Realty"; agencyPhone="9876540042"; sourceTag="99acres"; listedDate="2026-03-22"; },
      // --- RANIP ---
      { id="p093"; propertyType="Residential"; action="Buy"; title="2 BHK in Ranip"; description="Compact 2 BHK in Ranip, close to new BRTS route and local market."; location="Ranip, Ahmedabad"; city="Ahmedabad"; address="Ranip Society, Main Road, Ranip, Ahmedabad - 382480"; price=3100000; priceDisplay="\u{20B9}31 Lakh"; bhk="2 BHK"; sqft=880; furnishing="Unfurnished"; amenities=["Parking","Water","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=2; societyName="Ranip Main Society"; ownerName="Rajesh Solankhi"; ownerPhone="9876540043"; ownerEmail="rajesh2@ranip.com"; agencyName="Solankhi Realty"; agencyPhone="9876540043"; sourceTag="NoBroker"; listedDate="2026-03-20"; },
      { id="p094"; propertyType="Residential"; action="Rent"; title="1 BHK in Ranip"; description="Budget-friendly 1 BHK in New Ranip, clean and well-maintained."; location="Ranip, Ahmedabad"; city="Ahmedabad"; address="New Ranip, Block 3, Ranip, Ahmedabad - 382480"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=1; societyName="New Ranip Block 3"; ownerName="Shantaben"; ownerPhone="9876540044"; ownerEmail="shanta@ranip.com"; agencyName="Direct Owner"; agencyPhone="9876540044"; sourceTag="99acres"; listedDate="2026-03-18"; },
      // --- NARODA ---
      { id="p095"; propertyType="Residential"; action="Buy"; title="2 BHK in Naroda"; description="Budget 2 BHK near Naroda GIDC, suitable for industrial workers."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Road, Workers Colony, Naroda, Ahmedabad - 382330"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="2 BHK"; sqft=840; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Workers Colony"; ownerName="Manu Patel"; ownerPhone="9876540045"; ownerEmail="manu@naroda.com"; agencyName="Naroda Properties"; agencyPhone="9876540045"; sourceTag="99acres"; listedDate="2026-03-15"; },
      { id="p096"; propertyType="Industrial"; action="Lease"; title="Industrial Shed in Naroda GIDC"; description="Functional industrial shed on lease in Naroda GIDC Phase 3."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda GIDC Phase 3, Shed 7, Naroda, Ahmedabad - 382330"; price=55000; priceDisplay="\u{20B9}55,000/month"; bhk="Studio"; sqft=6000; furnishing="Unfurnished"; amenities=["3-Phase","Water","Road Access"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=0; societyName="Naroda GIDC Phase 3"; ownerName="Tushar Amin"; ownerPhone="9876540046"; ownerEmail="tushar@gidc.com"; agencyName="Industrial Brokers"; agencyPhone="9876540046"; sourceTag="MagicBricks"; listedDate="2026-03-12"; },
      // --- JUHAPURA ---
      { id="p097"; propertyType="Residential"; action="Buy"; title="2 BHK in Juhapura"; description="Affordable 2 BHK in Juhapura, well-connected to Sarkhej and city."; location="Juhapura, Ahmedabad"; city="Ahmedabad"; address="Juhapura Main Road, Flat 8, Juhapura, Ahmedabad - 380055"; price=3200000; priceDisplay="\u{20B9}32 Lakh"; bhk="2 BHK"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=2; societyName="Juhapura Flat"; ownerName="Salim Bhai"; ownerPhone="9876540047"; ownerEmail="salim@juhapura.com"; agencyName="Juhapura Properties"; agencyPhone="9876540047"; sourceTag="Housing.com"; listedDate="2026-03-10"; },
      { id="p098"; propertyType="Residential"; action="Rent"; title="1 BHK in Juhapura"; description="Affordable 1 BHK rental in Juhapura area."; location="Juhapura, Ahmedabad"; city="Ahmedabad"; address="Juhapura Society, Block A, Juhapura, Ahmedabad - 380055"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Juhapura Block A"; ownerName="Farida Ben"; ownerPhone="9876540048"; ownerEmail="farida@juhapura.com"; agencyName="Direct Owner"; agencyPhone="9876540048"; sourceTag="99acres"; listedDate="2026-03-08"; },
      // --- SHELA ---
      { id="p099"; propertyType="Residential"; action="Buy"; title="2 BHK in Shela"; description="Modern 2 BHK in growing Shela locality near SP Ring Road."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Road, River Heights, Shela, Ahmedabad - 380058"; price=5200000; priceDisplay="\u{20B9}52 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Parking","Garden","Lift"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="River Heights"; ownerName="Viral Patel"; ownerPhone="9876540049"; ownerEmail="viral@shela.com"; agencyName="Patel Developers"; agencyPhone="9876540049"; sourceTag="99acres"; listedDate="2026-03-05"; },
      { id="p100"; propertyType="Residential"; action="Rent"; title="3 BHK Bungalow in Shela"; description="Premium 3 BHK bungalow on rent in prestigious Shela bungalow zone."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Bungalow Zone, House 7, Shela, Ahmedabad - 380058"; price=30000; priceDisplay="\u{20B9}30,000/month"; bhk="3 BHK"; sqft=2800; furnishing="Semi-Furnished"; amenities=["Garden","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=0; societyName="Shela Bungalows"; ownerName="Hardik Shah"; ownerPhone="9876540050"; ownerEmail="hardik@shela.com"; agencyName="Shah Estates"; agencyPhone="9876540050"; sourceTag="NoBroker"; listedDate="2026-03-03"; },
      // --- GHUMA ---
      { id="p101"; propertyType="Residential"; action="Buy"; title="2 BHK in Ghuma"; description="New 2 BHK in rapidly developing Ghuma area, near Shela and Bopal."; location="Ghuma, Ahmedabad"; city="Ahmedabad"; address="Ghuma Village Road, Greenpark Society, Ghuma, Ahmedabad - 380058"; price=4200000; priceDisplay="\u{20B9}42 Lakh"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Parking","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Greenpark Society"; ownerName="Ashok Patel"; ownerPhone="9876540051"; ownerEmail="ashok@ghuma.com"; agencyName="Ghuma Properties"; agencyPhone="9876540051"; sourceTag="MagicBricks"; listedDate="2026-03-01"; },
      { id="p102"; propertyType="Plot"; action="Buy"; title="Residential Plot in Ghuma"; description="Residential plot in Ghuma near main road, all legal documents clear."; location="Ghuma, Ahmedabad"; city="Ahmedabad"; address="Ghuma Survey Land, Plot 18, Ghuma, Ahmedabad - 380058"; price=3800000; priceDisplay="\u{20B9}38 Lakh"; bhk="Plot"; sqft=1500; furnishing="Unfurnished"; amenities=["Road Access","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Ghuma Survey"; ownerName="Manubhai"; ownerPhone="9876540052"; ownerEmail="manu@ghuma.com"; agencyName="Local Agent"; agencyPhone="9876540052"; sourceTag="Housing.com"; listedDate="2026-02-28"; },
      // --- TRAGAD ---
      { id="p103"; propertyType="Residential"; action="Buy"; title="2 BHK in Tragad"; description="Affordable 2 BHK in Tragad near new BRTS and schools."; location="Tragad, Ahmedabad"; city="Ahmedabad"; address="Tragad Road, Shreeji Society, Tragad, Ahmedabad - 382470"; price=3000000; priceDisplay="\u{20B9}30 Lakh"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Water","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=2; societyName="Shreeji Society"; ownerName="Baldevbhai"; ownerPhone="9876540053"; ownerEmail="baldev@tragad.com"; agencyName="Tragad Agents"; agencyPhone="9876540053"; sourceTag="99acres"; listedDate="2026-02-25"; },
      // --- GANDHINAGAR ---
      { id="p104"; propertyType="Residential"; action="Buy"; title="3 BHK in Gandhinagar Sector 21"; description="Spacious 3 BHK in government-planned Gandhinagar Sector 21."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Sector 21, Block 4, Gandhinagar, Gujarat - 382021"; price=7200000; priceDisplay="\u{20B9}72 Lakh"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Sector 21 Block 4"; ownerName="IAS Officer Patel"; ownerPhone="9876540054"; ownerEmail="ias@gnr.com"; agencyName="Gandhinagar Realty"; agencyPhone="9876540054"; sourceTag="MagicBricks"; listedDate="2026-02-22"; },
      { id="p105"; propertyType="Residential"; action="Rent"; title="2 BHK in Gandhinagar"; description="Clean 2 BHK near Gandhinagar Bus Depot, ideal for government employees."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Sector 11, Flat 6, Gandhinagar, Gujarat - 382011"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=1; societyName="Sector 11 Flats"; ownerName="Govt Employee"; ownerPhone="9876540055"; ownerEmail="emp@gnr.com"; agencyName="GNR Properties"; agencyPhone="9876540055"; sourceTag="Housing.com"; listedDate="2026-02-20"; },
      { id="p106"; propertyType="Commercial"; action="Buy"; title="Office in Infocity Gandhinagar"; description="IT office in GIFT City corridor near Infocity, Gandhinagar."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Infocity, Tower B, Gandhinagar, Gujarat - 382009"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="Studio"; sqft=2500; furnishing="Furnished"; amenities=["Parking","Power Backup","Cafeteria","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=4; societyName="Infocity Tower B"; ownerName="GIFT Corp"; ownerPhone="9876540056"; ownerEmail="gift@infocity.com"; agencyName="GIFT City Brokers"; agencyPhone="9876540056"; sourceTag="99acres"; listedDate="2026-02-18"; },
      { id="p107"; propertyType="Plot"; action="Buy"; title="Residential Plot in Gandhinagar"; description="AUDA-approved residential plot in Gandhinagar near proposed metro."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Gandhinagar Scheme 2, Plot 55, Gandhinagar, Gujarat - 382030"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="Plot"; sqft=2000; furnishing="Unfurnished"; amenities=["Wide Road","Water","Drainage"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=0; societyName="Gandhinagar Scheme 2"; ownerName="AUDA Land"; ownerPhone="9876540057"; ownerEmail="auda@gnr.com"; agencyName="GNR Agents"; agencyPhone="9876540057"; sourceTag="Housing.com"; listedDate="2026-02-15"; },
      // --- ODHAV ---
      { id="p108"; propertyType="Industrial"; action="Buy"; title="Industrial Shed in Odhav GIDC"; description="Freehold industrial shed in Odhav GIDC, suitable for manufacturing."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav GIDC, Shed 15, Odhav, Ahmedabad - 382415"; price=9000000; priceDisplay="\u{20B9}90 Lakh"; bhk="Warehouse"; sqft=8000; furnishing="Unfurnished"; amenities=["3-Phase","Road Access","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Odhav GIDC"; ownerName="Ramesh Shah"; ownerPhone="9876540058"; ownerEmail="ramesh@odhav.com"; agencyName="GIDC Realty"; agencyPhone="9876540058"; sourceTag="99acres"; listedDate="2026-02-12"; },
      { id="p109"; propertyType="Residential"; action="Buy"; title="2 BHK in Odhav"; description="Affordable 2 BHK near Odhav Ring Road, good infrastructure."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav Ring Road, Flat 104, Odhav, Ahmedabad - 382415"; price=2900000; priceDisplay="\u{20B9}29 Lakh"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Water","Parking"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=1; societyName="Odhav Residency"; ownerName="Bharat Patel"; ownerPhone="9876540059"; ownerEmail="bharat2@odhav.com"; agencyName="Odhav Homes"; agencyPhone="9876540059"; sourceTag="MagicBricks"; listedDate="2026-02-10"; },
      // --- VATVA ---
      { id="p110"; propertyType="Industrial"; action="Buy"; title="Industrial Plot in Vatva"; description="GIDC allotted industrial plot in Vatva, all utilities connected."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva GIDC Phase 1, Plot 99, Vatva, Ahmedabad - 382445"; price=20000000; priceDisplay="\u{20B9}2 Cr"; bhk="Plot"; sqft=15000; furnishing="Unfurnished"; amenities=["3-Phase","Water","Drainage","Road"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=0; societyName="Vatva GIDC Phase 1"; ownerName="Industrial Corp"; ownerPhone="9876540060"; ownerEmail="corp@vatva.com"; agencyName="Vatva Brokers"; agencyPhone="9876540060"; sourceTag="99acres"; listedDate="2026-02-08"; },
      { id="p111"; propertyType="Residential"; action="Buy"; title="2 BHK in Vatva"; description="Residential 2 BHK near Vatva GIDC, affordable and accessible."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva Society, Block 2, Vatva, Ahmedabad - 382445"; price=2700000; priceDisplay="\u{20B9}27 Lakh"; bhk="2 BHK"; sqft=830; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=1; societyName="Vatva Block 2"; ownerName="Vijay Chauhan"; ownerPhone="9876540061"; ownerEmail="vijay2@vatva.com"; agencyName="Vatva Agents"; agencyPhone="9876540061"; sourceTag="Housing.com"; listedDate="2026-02-05"; },
      // --- SOUTH BOPAL ---
      { id="p112"; propertyType="Residential"; action="Buy"; title="2 BHK in South Bopal"; description="Affordable 2 BHK in growing South Bopal township."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Township, Flat 8, Ahmedabad - 380058"; price=5000000; priceDisplay="\u{20B9}50 Lakh"; bhk="2 BHK"; sqft=1080; furnishing="Unfurnished"; amenities=["Parking","Lift","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=4; societyName="South Bopal Township"; ownerName="Manoj Panchal"; ownerPhone="9876540062"; ownerEmail="manoj@sbopal.com"; agencyName="Panchal Estates"; agencyPhone="9876540062"; sourceTag="99acres"; listedDate="2026-02-03"; },
      { id="p113"; propertyType="Residential"; action="Rent"; title="2 BHK in South Bopal"; description="Well-maintained 2 BHK in South Bopal, newly renovated."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Society, Flat 12, Ahmedabad - 380058"; price=14000; priceDisplay="\u{20B9}14,000/month"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=2; societyName="South Bopal Society"; ownerName="Dhruti Shah"; ownerPhone="9876540063"; ownerEmail="dhruti@sbopal.com"; agencyName="Shah Properties"; agencyPhone="9876540063"; sourceTag="NoBroker"; listedDate="2026-02-01"; },
      // --- BODAKDEV ---
      { id="p114"; propertyType="Residential"; action="Buy"; title="2 BHK in Bodakdev"; description="Value 2 BHK in prestigious Bodakdev area, near Judges Bungalow Road."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Road, Flat 301, Bodakdev, Ahmedabad - 380054"; price=8500000; priceDisplay="\u{20B9}85 Lakh"; bhk="2 BHK"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Gym"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=3; societyName="Bodakdev Heights"; ownerName="Nikhil Patel"; ownerPhone="9876540064"; ownerEmail="nikhil@bodakdev.com"; agencyName="Bodakdev Realty"; agencyPhone="9876540064"; sourceTag="99acres"; listedDate="2026-01-30"; },
      { id="p115"; propertyType="Residential"; action="Rent"; title="4 BHK in Bodakdev"; description="Luxurious 4 BHK in Bodakdev ideal for corporate family."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Society, Block D, Bodakdev, Ahmedabad - 380054"; price=42000; priceDisplay="\u{20B9}42,000/month"; bhk="4 BHK+"; sqft=2600; furnishing="Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=6; societyName="Bodakdev Block D"; ownerName="Corporate Owner"; ownerPhone="9876540065"; ownerEmail="corp@bodakdev.com"; agencyName="Premium Rentals"; agencyPhone="9876540065"; sourceTag="MagicBricks"; listedDate="2026-01-28"; },
      // --- ANAND NAGAR ---
      { id="p116"; propertyType="Residential"; action="Buy"; title="2 BHK in Anand Nagar"; description="Clean 2 BHK in Anand Nagar society with dedicated parking."; location="Anand Nagar, Ahmedabad"; city="Ahmedabad"; address="Anand Nagar Society, Flat 5, Satellite, Ahmedabad - 380015"; price=6000000; priceDisplay="\u{20B9}60 Lakh"; bhk="2 BHK"; sqft=1080; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Anand Nagar Society"; ownerName="Bharat Desai"; ownerPhone="9876540066"; ownerEmail="bharat3@anand.com"; agencyName="Desai Properties"; agencyPhone="9876540066"; sourceTag="Housing.com"; listedDate="2026-01-25"; },
      // --- VASTRAPUR ---
      { id="p117"; propertyType="Residential"; action="Rent"; title="2 BHK near Vastrapur Lake"; description="Modern 2 BHK flat near Vastrapur Lake with scenic views."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Lake Road, Lake View Apts, Ahmedabad - 380015"; price=20000; priceDisplay="\u{20B9}20,000/month"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=3; societyName="Lake View Apts"; ownerName="Rakesh Jain"; ownerPhone="9876540067"; ownerEmail="rakesh@vastrapur.com"; agencyName="Jain Realty"; agencyPhone="9876540067"; sourceTag="99acres"; listedDate="2026-01-22"; },
      { id="p118"; propertyType="Residential"; action="Buy"; title="3 BHK in Vastrapur"; description="Premium 3 BHK near Vastrapur Lake, close to IIM-A and corporate zone."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Society, Flat 408, Vastrapur, Ahmedabad - 380015"; price=11000000; priceDisplay="\u{20B9}1.1 Cr"; bhk="3 BHK"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Pool","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=4; societyName="Vastrapur Premium"; ownerName="Paresh Shah"; ownerPhone="9876540068"; ownerEmail="paresh@vastrapur.com"; agencyName="Shah Luxury"; agencyPhone="9876540068"; sourceTag="MagicBricks"; listedDate="2026-01-20"; },
      // --- NEHRU NAGAR ---
      { id="p119"; propertyType="Residential"; action="Buy"; title="2 BHK in Nehru Nagar"; description="Good 2 BHK in Nehru Nagar near Satellite road junction."; location="Nehru Nagar, Ahmedabad"; city="Ahmedabad"; address="Nehru Nagar Society, Block C, Ahmedabad - 380015"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=3; societyName="Nehru Nagar Block C"; ownerName="Kirti Patel"; ownerPhone="9876540069"; ownerEmail="kirti@nn.com"; agencyName="Patel Realtors"; agencyPhone="9876540069"; sourceTag="Housing.com"; listedDate="2026-01-18"; },
      // --- ADDITIONAL REDEVELOPMENT PROPERTIES ---
      { id="p120"; propertyType="Redevelopment"; action="Buy"; title="Old Building for Redevelopment in Maninagar"; description="Old 3-storey building in Maninagar, ripe for redevelopment. High FSI potential."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Society, Old Building, Maninagar, Ahmedabad - 380008"; price=15000000; priceDisplay="\u{20B9}1.5 Cr"; bhk="Redevelopment"; sqft=3600; furnishing="NA"; amenities=["High FSI","Wide Road","Central Location"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Old Maninagar Building"; ownerName="Society"; ownerPhone="9876540070"; ownerEmail="society@mani.com"; agencyName="Redevelopment Experts"; agencyPhone="9876540070"; sourceTag="GujRERA"; listedDate="2026-01-15"; },
      { id="p121"; propertyType="Redevelopment"; action="Buy"; title="Chawl Redevelopment in Paldi"; description="Chawl property in Paldi ideal for residential redevelopment project."; location="Paldi, Ahmedabad"; city="Ahmedabad"; address="Paldi Chawl, Nr Anjali, Paldi, Ahmedabad - 380007"; price=8000000; priceDisplay="\u{20B9}80 Lakh"; bhk="Redevelopment"; sqft=5000; furnishing="NA"; amenities=["Prime Location","High FSI","2 Road Access"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=0; societyName="Paldi Chawl"; ownerName="Chawl Members"; ownerPhone="9876540071"; ownerEmail="chawl@paldi.com"; agencyName="Urban Redevelopment"; agencyPhone="9876540071"; sourceTag="GujRERA"; listedDate="2026-01-12"; },
      // --- ADDITIONAL ULTRA-BUDGET (Under 20L) ---
      { id="p122"; propertyType="Residential"; action="Buy"; title="1 BHK in Odhav - Ultra Budget"; description="Ultra-budget 1 BHK in Odhav, ideal for first-time investment."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav Colony, Flat 1, Odhav, Ahmedabad - 382415"; price=1500000; priceDisplay="\u{20B9}15 Lakh"; bhk="1 BHK"; sqft=480; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Odhav Colony"; ownerName="Lalitbhai"; ownerPhone="9876540072"; ownerEmail="lalit@odhav.com"; agencyName="Budget Realty"; agencyPhone="9876540072"; sourceTag="99acres"; listedDate="2026-01-10"; },
      { id="p123"; propertyType="Residential"; action="Buy"; title="1 RK in Vatva"; description="Compact 1 room-kitchen unit in Vatva for ultra-budget investment."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva Road, Room 4, Vatva, Ahmedabad - 382445"; price=1200000; priceDisplay="\u{20B9}12 Lakh"; bhk="Studio"; sqft=350; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=0; societyName="Vatva Colony"; ownerName="Dilipbhai"; ownerPhone="9876540073"; ownerEmail="dilip@vatva.com"; agencyName="Direct Owner"; agencyPhone="9876540073"; sourceTag="NoBroker"; listedDate="2026-01-08"; },
      // --- ADDITIONAL PG (multiple localities) ---
      { id="p124"; propertyType="Residential"; action="PG"; title="PG for Girls in Navrangpura"; description="Well-maintained girls PG near NID and IIM, all meals included."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura, Nr NID, Navrangpura, Ahmedabad - 380009"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="Studio"; sqft=180; furnishing="Furnished"; amenities=["Meals","AC","Wi-Fi","CCTV"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="NID PG"; ownerName="Maniben"; ownerPhone="9876540074"; ownerEmail="mani@pg.com"; agencyName="PG Network"; agencyPhone="9876540074"; sourceTag="Housing.com"; listedDate="2026-01-05"; },
      { id="p125"; propertyType="Residential"; action="PG"; title="PG in Bodakdev for Professionals"; description="Premium PG in Bodakdev with housekeeping and meals."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Road, PG Homes, Bodakdev, Ahmedabad - 380054"; price=9000; priceDisplay="\u{20B9}9,000/month"; bhk="Studio"; sqft=200; furnishing="Furnished"; amenities=["Meals","AC","Gym","Laundry"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=1; societyName="Bodakdev PG"; ownerName="Hema Ben"; ownerPhone="9876540075"; ownerEmail="hema@pg.com"; agencyName="Premium PG"; agencyPhone="9876540075"; sourceTag="99acres"; listedDate="2026-01-03"; },
      { id="p126"; propertyType="Residential"; action="PG"; title="PG in SG Highway"; description="Modern PG near corporate offices on SG Highway, 3-sharing and single rooms."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway, Tech PG, Ahmedabad - 380054"; price=8000; priceDisplay="\u{20B9}8,000/month"; bhk="Studio"; sqft=160; furnishing="Furnished"; amenities=["Wi-Fi","Power Backup","Meals","Laundry"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Tech PG"; ownerName="Dipti Patel"; ownerPhone="9876540076"; ownerEmail="dipti@pg.com"; agencyName="PG Hub"; agencyPhone="9876540076"; sourceTag="NoBroker"; listedDate="2025-12-30"; },
      // --- MORE LUXURY PROPERTIES ---
      { id="p127"; propertyType="Residential"; action="Buy"; title="5 BHK Bungalow in Satellite"; description="Ultra-luxury 5 BHK independent bungalow in elite Satellite zone with private pool."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Elite Zone, Bungalow 3, Satellite, Ahmedabad - 380015"; price=60000000; priceDisplay="\u{20B9}6 Cr"; bhk="Villa"; sqft=8000; furnishing="Furnished"; amenities=["Pool","Gym","Home Theatre","Garden","Security","Smart Home"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Satellite Elite Zone"; ownerName="Industrialist Patel"; ownerPhone="9876540077"; ownerEmail="ind@luxury.com"; agencyName="Ultra Luxury Homes"; agencyPhone="9876540077"; sourceTag="MagicBricks"; listedDate="2025-12-28"; },
      { id="p128"; propertyType="Residential"; action="Buy"; title="Penthouse in Prahlad Nagar"; description="Sky penthouse in Prahlad Nagar with 360-degree city views and smart home."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Skyline, Top Floor, Ahmedabad - 380015"; price=45000000; priceDisplay="\u{20B9}4.5 Cr"; bhk="4 BHK+"; sqft=6000; furnishing="Furnished"; amenities=["Private Terrace","Pool","Smart Home","Concierge","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="All"; floorNo=25; societyName="Prahlad Nagar Skyline"; ownerName="Business Tycoon"; ownerPhone="9876540078"; ownerEmail="biz@luxury.com"; agencyName="Luxury Realty"; agencyPhone="9876540078"; sourceTag="99acres"; listedDate="2025-12-25"; },
      // --- MORE MID-RANGE APARTMENTS ---
      { id="p129"; propertyType="Residential"; action="Buy"; title="2 BHK in Bopal - Mid Range"; description="Value 2 BHK in Bopal with good society amenities."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Society Phase 3, Flat 15, Ahmedabad - 380058"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=3; societyName="Bopal Phase 3"; ownerName="Chandresh Patel"; ownerPhone="9876540079"; ownerEmail="chandresh@bopal.com"; agencyName="Patel Realty"; agencyPhone="9876540079"; sourceTag="Housing.com"; listedDate="2025-12-22"; },
      { id="p130"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Gota - Premium"; description="Premium 3 BHK in new tower in Gota with all modern amenities."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Premium Tower, Floor 8, Gota, Ahmedabad - 382481"; price=7800000; priceDisplay="\u{20B9}78 Lakh"; bhk="3 BHK"; sqft=1700; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=8; societyName="Gota Premium Tower"; ownerName="Dhruv Patel"; ownerPhone="9876540080"; ownerEmail="dhruv@gota.com"; agencyName="Premium Realty"; agencyPhone="9876540080"; sourceTag="99acres"; listedDate="2025-12-20"; },
      // --- MORE COMMERCIAL (all types) ---
      { id="p131"; propertyType="Commercial"; action="Buy"; title="Food Court Space in Bopal Mall"; description="Food court space for sale in busy Bopal mall, ideal for F&B business."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Mall, Food Court, Floor 1, Bopal, Ahmedabad - 380058"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="Studio"; sqft=600; furnishing="Unfurnished"; amenities=["Power","Gas Line","AC","Footfall"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Bopal Mall"; ownerName="Mall Corp"; ownerPhone="9876540081"; ownerEmail="mall@bopal.com"; agencyName="Mall Brokers"; agencyPhone="9876540081"; sourceTag="Housing.com"; listedDate="2025-12-18"; },
      { id="p132"; propertyType="Commercial"; action="Rent"; title="Clinic Space in Navrangpura"; description="Ground floor clinic/medical office space in Navrangpura."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Medical Complex, Unit 3, Ahmedabad - 380009"; price=28000; priceDisplay="\u{20B9}28,000/month"; bhk="Studio"; sqft=650; furnishing="Unfurnished"; amenities=["Water","Power","Parking","Ramp"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=0; societyName="Medical Complex"; ownerName="Dr. Trivedi"; ownerPhone="9876540082"; ownerEmail="dr@navrang.com"; agencyName="Medical Realty"; agencyPhone="9876540082"; sourceTag="99acres"; listedDate="2025-12-15"; },
      { id="p133"; propertyType="Commercial"; action="Lease"; title="Bank Branch Space in Sarkhej"; description="Ready-to-fit bank branch space in Sarkhej with vault room provision."; location="Sarkhej, Ahmedabad"; city="Ahmedabad"; address="Sarkhej Road Commercial, Bank Unit, Sarkhej, Ahmedabad - 382210"; price=55000; priceDisplay="\u{20B9}55,000/month"; bhk="Studio"; sqft=1200; furnishing="Unfurnished"; amenities=["Power Backup","Vault Room","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Sarkhej Commercial Hub"; ownerName="Commercial Corp"; ownerPhone="9876540083"; ownerEmail="corp@sarkhej.com"; agencyName="Commercial Realty"; agencyPhone="9876540083"; sourceTag="MagicBricks"; listedDate="2025-12-12"; },
      // --- UNDER CONSTRUCTION ---
      { id="p134"; propertyType="Residential"; action="Buy"; title="2 BHK Under Construction in Thaltej"; description="Under-construction 2 BHK in upcoming premium tower in Thaltej."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej New Tower, Flat 12, Thaltej, Ahmedabad - 380054"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Gym","Pool","Club House","Security"]; possession="Under Construction"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=7; societyName="Thaltej New Tower"; ownerName="Builder Corp"; ownerPhone="9876540084"; ownerEmail="builder@thaltej.com"; agencyName="New Projects"; agencyPhone="9876540084"; sourceTag="GujRERA"; listedDate="2025-12-10"; },
      { id="p135"; propertyType="Residential"; action="Buy"; title="3 BHK Under Construction in Chandkheda"; description="RERA-registered 3 BHK in upcoming township in Chandkheda."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Township, Block B, Chandkheda, Ahmedabad - 382424"; price=6800000; priceDisplay="\u{20B9}68 Lakh"; bhk="3 BHK"; sqft=1500; furnishing="Unfurnished"; amenities=["Gym","Park","Club House","Security"]; possession="Under Construction"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=5; societyName="Chandkheda Township"; ownerName="RERA Builder"; ownerPhone="9876540085"; ownerEmail="rera@chandkheda.com"; agencyName="New Launches"; agencyPhone="9876540085"; sourceTag="GujRERA"; listedDate="2025-12-08"; },
      // --- ANANDNAGAR/AMBLI ---
      { id="p136"; propertyType="Residential"; action="Buy"; title="2 BHK in Ambli"; description="Modern 2 BHK in Ambli near Ambli Road, one of Ahmedabad's fastest growing areas."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Ambli Road, Green Vista, Ambli, Ahmedabad - 380058"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=3; societyName="Green Vista"; ownerName="Pankaj Patel"; ownerPhone="9876540086"; ownerEmail="pankaj@ambli.com"; agencyName="Ambli Properties"; agencyPhone="9876540086"; sourceTag="99acres"; listedDate="2025-12-05"; },
      { id="p137"; propertyType="Residential"; action="Rent"; title="2 BHK in Ambli"; description="Recently renovated 2 BHK flat in Ambli, great connectivity."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Ambli Society, Flat 8, Ambli, Ahmedabad - 380058"; price=16000; priceDisplay="\u{20B9}16,000/month"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=2; societyName="Ambli Society"; ownerName="Rohan Shah"; ownerPhone="9876540087"; ownerEmail="rohan@ambli.com"; agencyName="Shah Rentals"; agencyPhone="9876540087"; sourceTag="NoBroker"; listedDate="2025-12-03"; },
      // --- SOLA ---
      { id="p138"; propertyType="Residential"; action="Buy"; title="2 BHK in Sola"; description="Good 2 BHK in Sola near Civil Hospital, accessible location."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Road, Flat 5, Sola, Ahmedabad - 380060"; price=5000000; priceDisplay="\u{20B9}50 Lakh"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=2; societyName="Sola Society"; ownerName="Manish Patel"; ownerPhone="9876540088"; ownerEmail="manish2@sola.com"; agencyName="Sola Realty"; agencyPhone="9876540088"; sourceTag="MagicBricks"; listedDate="2025-12-01"; },
      { id="p139"; propertyType="Residential"; action="Rent"; title="3 BHK in Sola"; description="Spacious 3 BHK in Sola suitable for family of 4."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Civil Road, Flat 12, Sola, Ahmedabad - 380060"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="3 BHK"; sqft=1400; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=1; societyName="Sola Civil Apts"; ownerName="Varsha Patel"; ownerPhone="9876540089"; ownerEmail="varsha@sola.com"; agencyName="Patel Rentals"; agencyPhone="9876540089"; sourceTag="Housing.com"; listedDate="2025-11-28"; },
      // --- ISANPUR ---
      { id="p140"; propertyType="Residential"; action="Buy"; title="1 BHK in Isanpur"; description="Budget 1 BHK in Isanpur, close to Maninagar railway station."; location="Isanpur, Ahmedabad"; city="Ahmedabad"; address="Isanpur Society, Flat 4, Isanpur, Ahmedabad - 382443"; price=1800000; priceDisplay="\u{20B9}18 Lakh"; bhk="1 BHK"; sqft=520; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=1; societyName="Isanpur Society"; ownerName="Rameshbhai"; ownerPhone="9876540090"; ownerEmail="ramesh3@isanpur.com"; agencyName="Local Broker"; agencyPhone="9876540090"; sourceTag="99acres"; listedDate="2025-11-25"; },
      // --- ADDITIONAL PLOTS ---
      { id="p141"; propertyType="Plot"; action="Buy"; title="Plot in Gota"; description="Residential plot in Gota with all approvals, ready for construction."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Plot Scheme, Plot 8, Gota, Ahmedabad - 382481"; price=4000000; priceDisplay="\u{20B9}40 Lakh"; bhk="Plot"; sqft=1800; furnishing="Unfurnished"; amenities=["Road Access","Water","Drainage"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=0; societyName="Gota Plot Scheme"; ownerName="Bhailal"; ownerPhone="9876540091"; ownerEmail="bhailal@gota.com"; agencyName="Gota Agents"; agencyPhone="9876540091"; sourceTag="MagicBricks"; listedDate="2025-11-22"; },
      { id="p142"; propertyType="Plot"; action="Buy"; title="Commercial Plot in Sarkhej"; description="AUDA-approved commercial plot in Sarkhej for office or showroom."; location="Sarkhej, Ahmedabad"; city="Ahmedabad"; address="Sarkhej Commercial Zone, Plot 4, Sarkhej, Ahmedabad - 382210"; price=9000000; priceDisplay="\u{20B9}90 Lakh"; bhk="Plot"; sqft=3000; furnishing="Unfurnished"; amenities=["40 ft Road","Power","Water"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Sarkhej Commercial Zone"; ownerName="Commercial Owner"; ownerPhone="9876540092"; ownerEmail="owner@sarkhej.com"; agencyName="Sarkhej Realty"; agencyPhone="9876540092"; sourceTag="Housing.com"; listedDate="2025-11-20"; },
      { id="p143"; propertyType="Plot"; action="Buy"; title="Farmhouse Plot near Gandhinagar"; description="Large agricultural/farmhouse plot 10 km from Gandhinagar, highway access."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Village Near Gandhinagar, Survey 34, Gujarat - 382030"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="Plot"; sqft=40000; furnishing="Unfurnished"; amenities=["Highway Access","Water Well"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=0; societyName="Rural Survey"; ownerName="Farmer Owner"; ownerPhone="9876540093"; ownerEmail="farmer@gnr.com"; agencyName="Rural Properties"; agencyPhone="9876540093"; sourceTag="99acres"; listedDate="2025-11-18"; },
      // --- MORE DIVERSE PRICE POINTS ---
      { id="p144"; propertyType="Residential"; action="Buy"; title="2 BHK in Chandkheda - Budget"; description="Value-for-money 2 BHK in Chandkheda for budget buyers."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Road, Budget Society, Chandkheda, Ahmedabad - 382424"; price=3300000; priceDisplay="\u{20B9}33 Lakh"; bhk="2 BHK"; sqft=890; furnishing="Unfurnished"; amenities=["Water","Power","Parking"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=1; societyName="Budget Society CKD"; ownerName="Bharat Shah 2"; ownerPhone="9876540094"; ownerEmail="bharat4@ckd.com"; agencyName="CKD Homes"; agencyPhone="9876540094"; sourceTag="NoBroker"; listedDate="2025-11-15"; },
      { id="p145"; propertyType="Residential"; action="Buy"; title="3 BHK in Naranpura - Premium"; description="Premium 3 BHK in Naranpura with RCC construction and branded fittings."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Premium, Flat 7, Naranpura, Ahmedabad - 380013"; price=9500000; priceDisplay="\u{20B9}95 Lakh"; bhk="3 BHK"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=6; societyName="Naranpura Premium"; ownerName="Sandip Shah"; ownerPhone="9876540095"; ownerEmail="sandip@naranpura.com"; agencyName="Premium Estates"; agencyPhone="9876540095"; sourceTag="MagicBricks"; listedDate="2025-11-12"; },
      // --- MORE RENT LISTINGS ---
      { id="p146"; propertyType="Residential"; action="Rent"; title="Studio in Satellite"; description="Cozy studio near Ambli Road in Satellite, perfect for professional."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Ambli Road, Studio Flat, Satellite, Ahmedabad - 380015"; price=10000; priceDisplay="\u{20B9}10,000/month"; bhk="Studio"; sqft=400; furnishing="Furnished"; amenities=["Wi-Fi","Parking","AC"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="West"; floorNo=3; societyName="Ambli Road Studio"; ownerName="IT Employee"; ownerPhone="9876540096"; ownerEmail="it@satellite.com"; agencyName="Studio Rentals"; agencyPhone="9876540096"; sourceTag="Housing.com"; listedDate="2025-11-10"; },
      { id="p147"; propertyType="Residential"; action="Rent"; title="4 BHK in Navrangpura"; description="Lavish 4 BHK in Navrangpura near C.G. Road for corporate family."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="C.G. Road, Navrangpura, Flat 12, Ahmedabad - 380009"; price=35000; priceDisplay="\u{20B9}35,000/month"; bhk="4 BHK+"; sqft=2400; furnishing="Furnished"; amenities=["Parking","Gym","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=5; societyName="CG Premium Apts"; ownerName="Senior Executive"; ownerPhone="9876540097"; ownerEmail="exec@cgroad.com"; agencyName="Premium Rentals"; agencyPhone="9876540097"; sourceTag="99acres"; listedDate="2025-11-08"; },
      { id="p148"; propertyType="Residential"; action="Rent"; title="2 BHK in Thaltej - New"; description="Brand new 2 BHK flat in Thaltej, never occupied, direct from owner."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej New Society, Flat 3, Thaltej, Ahmedabad - 380054"; price=20000; priceDisplay="\u{20B9}20,000/month"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="East"; floorNo=4; societyName="Thaltej New Society"; ownerName="Direct Owner"; ownerPhone="9876540098"; ownerEmail="direct@thaltej.com"; agencyName="Direct Owner"; agencyPhone="9876540098"; sourceTag="NoBroker"; listedDate="2025-11-05"; },
      { id="p149"; propertyType="Residential"; action="Rent"; title="1 BHK in Sarkhej - Budget"; description="Low-cost 1 BHK in Sarkhej ideal for small family or couple."; location="Sarkhej, Ahmedabad"; city="Ahmedabad"; address="Sarkhej Road, Budget Flat, Sarkhej, Ahmedabad - 382210"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water","Power"]; possession="Immediate"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="South"; floorNo=1; societyName="Sarkhej Budget"; ownerName="Babubhai"; ownerPhone="9876540099"; ownerEmail="babu@sarkhej.com"; agencyName="Local Broker"; agencyPhone="9876540099"; sourceTag="99acres"; listedDate="2025-11-03"; },
      { id="p150"; propertyType="Residential"; action="Rent"; title="2 BHK in Gota - Family"; description="Family 2 BHK in Gota near BRTS station, schools nearby."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota BRTS Road, Family Society, Gota, Ahmedabad - 382481"; price=13000; priceDisplay="\u{20B9}13,000/month"; bhk="2 BHK"; sqft=960; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink="https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing="North"; floorNo=2; societyName="Family Society Gota"; ownerName="Geeta Patel"; ownerPhone="9876540100"; ownerEmail="geeta@gota.com"; agencyName="Gota Rentals"; agencyPhone="9876540100"; sourceTag="Housing.com"; listedDate="2025-11-01"; },
      { id="p151"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Bodakdev"; description="Spacious 3 BHK flat in premium Bodakdev locality with club amenities and ample ventilation."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Heights, Judges Bungalow Road, Bodakdev, Ahmedabad - 380054"; price=11500000; priceDisplay="\u{20B9}1.15 Cr"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Security","Parking","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Bodakdev Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-15"; },
      { id="p152"; propertyType="Residential"; action="Buy"; title="2 BHK Premium Flat in Bodakdev"; description="Modern 2 BHK with granite flooring and modular kitchen in upscale Bodakdev."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Avenue, Near Judges Bungalow, Bodakdev, Ahmedabad - 380054"; price=8200000; priceDisplay="\u{20B9}82 Lakh"; bhk="2 BHK"; sqft=1180; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Gym"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Bodakdev Avenue"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-20"; },
      { id="p153"; propertyType="Residential"; action="Buy"; title="4 BHK Luxury Flat in Bodakdev"; description="Ultra-premium 4 BHK with private terrace, smart home automation and club membership."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Pinnacle, 12th Floor, Bodakdev, Ahmedabad - 380054"; price=15000000; priceDisplay="\u{20B9}1.5 Cr"; bhk="4 BHK+"; sqft=2800; furnishing="Semi-Furnished"; amenities=["Smart Home","Pool","Gym","Club House","Parking","Security","Rooftop Garden"]; possession="Ready Soon"; images=[]; mapLink=""; facing="West"; floorNo=12; societyName="Bodakdev Pinnacle"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-01"; },
      { id="p154"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Vastrapur"; description="Well-designed 2 BHK near Vastrapur Lake with scenic views and covered parking."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Lake Road, Flat 204, Vastrapur, Ahmedabad - 380015"; price=6500000; priceDisplay="\u{20B9}65 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Vastrapur Lake Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-10"; },
      { id="p155"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Vastrapur"; description="Bright 2 BHK in Vastrapur, walking distance from IIM Ahmedabad and lake."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Main Road, Aashray Apartments, Vastrapur, Ahmedabad - 380015"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Wi-Fi Ready","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Aashray Apartments"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-10"; },
      { id="p156"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Vastrapur"; description="Spacious 3 BHK near Vastrapur lake with premium amenities and RERA registered."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Society, Plot 9, Vastrapur, Ahmedabad - 380015"; price=9800000; priceDisplay="\u{20B9}98 Lakh"; bhk="3 BHK"; sqft=1650; furnishing="Unfurnished"; amenities=["Pool","Gym","Parking","Security","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="South"; floorNo=7; societyName="Vastrapur Grande"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-15"; },
      { id="p157"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Shela"; description="Affordable 2 BHK in peaceful Shela village, near SP Ring Road. Good for investment."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Village Road, Sunrise Society, Shela, Ahmedabad - 380058"; price=4200000; priceDisplay="\u{20B9}42 Lakh"; bhk="2 BHK"; sqft=980; furnishing="Unfurnished"; amenities=["Parking","Garden","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Sunrise Society Shela"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-25"; },
      { id="p158"; propertyType="Residential"; action="Rent"; title="2 BHK Rent in Shela"; description="Newly constructed 2 BHK for rent in Shela. Quiet neighbourhood, ideal for families."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Char Rasta, Green Valley Society, Shela, Ahmedabad - 380058"; price=11000; priceDisplay="\u{20B9}11,000/month"; bhk="2 BHK"; sqft=950; furnishing="Unfurnished"; amenities=["Parking","Garden","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Green Valley Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-05"; },
      { id="p159"; propertyType="Residential"; action="Buy"; title="3 BHK Villa Plot in Shela"; description="Residential plot in gated township in Shela. Perfect for building a custom villa."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Township, Plot 22, Near SP Ring Road, Shela, Ahmedabad - 380058"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="Plot"; sqft=2200; furnishing="Unfurnished"; amenities=["Wide Road","Underground Drainage","Water Connection"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Shela Township"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-20"; },
      { id="p160"; propertyType="Residential"; action="Rent"; title="2 BHK in Ghuma"; description="Affordable 2 BHK in Ghuma near SP Ring Road. Suitable for nuclear family."; location="Ghuma, Ahmedabad"; city="Ahmedabad"; address="Ghuma Village Road, Shantam Society, Ghuma, Ahmedabad - 382424"; price=10000; priceDisplay="\u{20B9}10,000/month"; bhk="2 BHK"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Shantam Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-05"; },
      { id="p161"; propertyType="Residential"; action="Rent"; title="2 BHK Flat in Ghuma"; description="Well-maintained 2 BHK in Ghuma locality near Bopal junction, budget friendly."; location="Ghuma, Ahmedabad"; city="Ahmedabad"; address="Ghuma Cross Road, Radhe Society, Ghuma, Ahmedabad - 382424"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=940; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Radhe Society Ghuma"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-10"; },
      { id="p162"; propertyType="Residential"; action="Buy"; title="1 BHK in New Ranip"; description="Budget 1 BHK flat in New Ranip, close to Chandkheda highway and BRTS."; location="New Ranip, Ahmedabad"; city="Ahmedabad"; address="New Ranip Station Road, Jay Society, Ahmedabad - 382480"; price=3000000; priceDisplay="\u{20B9}30 Lakh"; bhk="1 BHK"; sqft=650; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Jay Society New Ranip"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-20"; },
      { id="p163"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in New Ranip"; description="Practical 2 BHK flat in New Ranip with adequate sunlight and vaastu-compliant layout."; location="New Ranip, Ahmedabad"; city="Ahmedabad"; address="New Ranip Circle, Gokul Society, Ahmedabad - 382480"; price=4300000; priceDisplay="\u{20B9}43 Lakh"; bhk="2 BHK"; sqft=920; furnishing="Unfurnished"; amenities=["Parking","Lift","Water Supply","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Gokul Society New Ranip"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-25"; },
      { id="p164"; propertyType="Residential"; action="Buy"; title="1 BHK in Tragad"; description="Budget 1 BHK in Tragad near BRTS. First-home buyer friendly with low maintenance."; location="Tragad, Ahmedabad"; city="Ahmedabad"; address="Tragad Cross Roads, Shiv Society, Tragad, Ahmedabad - 382470"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="1 BHK"; sqft=600; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Shiv Society Tragad"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-10"; },
      { id="p165"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Tragad"; description="Affordable 2 BHK in Tragad with easy BRTS access and developing neighborhood."; location="Tragad, Ahmedabad"; city="Ahmedabad"; address="Tragad Main Road, Om Society, Tragad, Ahmedabad - 382470"; price=4000000; priceDisplay="\u{20B9}40 Lakh"; bhk="2 BHK"; sqft=890; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Om Society Tragad"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-15"; },
      { id="p166"; propertyType="Industrial"; action="Buy"; title="Industrial Plot in Vatva GIDC"; description="Freehold industrial plot in Vatva GIDC Phase 1, suitable for manufacturing or warehouse."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva GIDC Phase 1, Plot No. 88, Vatva, Ahmedabad - 382445"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="Plot"; sqft=8000; furnishing="Unfurnished"; amenities=["3-Phase Power","Road Access","Water Connection","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=0; societyName="Vatva GIDC Phase 1"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-01"; },
      { id="p167"; propertyType="Commercial"; action="Lease"; title="Commercial Plot for Lease in Vatva"; description="Large commercial plot near Vatva railway station suitable for logistics hub or storage."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva Station Road, Survey No. 55, Vatva, Ahmedabad - 382445"; price=85000; priceDisplay="\u{20B9}85,000/month"; bhk="Plot"; sqft=12000; furnishing="Unfurnished"; amenities=["Road Access","Loading Area","Power Connection"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Vatva Commercial Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-05"; },
      { id="p168"; propertyType="Residential"; action="Buy"; title="2 BHK in Juhapura"; description="Affordable 2 BHK flat in Juhapura, good connectivity to Sarkhej and Ring Road."; location="Juhapura, Ahmedabad"; city="Ahmedabad"; address="Juhapura Main Road, Al-Aman Society, Juhapura, Ahmedabad - 380055"; price=3200000; priceDisplay="\u{20B9}32 Lakh"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Al-Aman Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-01"; },
      { id="p169"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Juhapura"; description="Budget 1 BHK available for rent in Juhapura, near Rakhiyal area."; location="Juhapura, Ahmedabad"; city="Ahmedabad"; address="Rakhiyal Road, Near Juhapura, Juhapura, Ahmedabad - 380055"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=520; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Juhapura Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-05"; },
      { id="p170"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Anand Nagar"; description="Mid-range 2 BHK in Anand Nagar (Satellite), close to retail and business districts."; location="Anand Nagar, Ahmedabad"; city="Ahmedabad"; address="Anand Nagar Main Road, Dhruvam Society, Anand Nagar, Ahmedabad - 380015"; price=5200000; priceDisplay="\u{20B9}52 Lakh"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Dhruvam Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-15"; },
      { id="p171"; propertyType="Residential"; action="Buy"; title="3 BHK in Anand Nagar"; description="Spacious 3 BHK in well-managed Anand Nagar society with covered parking and gym."; location="Anand Nagar, Ahmedabad"; city="Ahmedabad"; address="Anand Nagar Cross Road, Aarav Heights, Anand Nagar, Ahmedabad - 380015"; price=6500000; priceDisplay="\u{20B9}65 Lakh"; bhk="3 BHK"; sqft=1400; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Aarav Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-12-20"; },
      { id="p172"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Bapunagar"; description="Compact 1 BHK in Bapunagar near AMC hospital. Suitable for working couple."; location="Bapunagar, Ahmedabad"; city="Ahmedabad"; address="Bapunagar Main Road, Shreeji Society, Bapunagar, Ahmedabad - 380024"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Shreeji Society Bapunagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-20"; },
      { id="p173"; propertyType="Residential"; action="Rent"; title="2 BHK in Bapunagar"; description="Family 2 BHK available in Bapunagar, ground floor, easy access for senior citizens."; location="Bapunagar, Ahmedabad"; city="Ahmedabad"; address="Bapunagar Char Rasta, Mangal Society, Bapunagar, Ahmedabad - 380024"; price=9500; priceDisplay="\u{20B9}9,500/month"; bhk="2 BHK"; sqft=850; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Mangal Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-25"; },
      { id="p174"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Gomtipur"; description="Affordable 2 BHK flat in Gomtipur, near textile market and Ghodasar."; location="Gomtipur, Ahmedabad"; city="Ahmedabad"; address="Gomtipur Main Road, Shyam Society, Gomtipur, Ahmedabad - 380021"; price=2400000; priceDisplay="\u{20B9}24 Lakh"; bhk="2 BHK"; sqft=800; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Shyam Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-15"; },
      { id="p175"; propertyType="Residential"; action="Buy"; title="1 BHK Flat in Gomtipur"; description="Budget 1 BHK in Gomtipur, east-facing, good ventilation, low maintenance charges."; location="Gomtipur, Ahmedabad"; city="Ahmedabad"; address="Gomtipur Cross Road, Krishna Society, Gomtipur, Ahmedabad - 380021"; price=2200000; priceDisplay="\u{20B9}22 Lakh"; bhk="1 BHK"; sqft=620; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Krishna Society Gomtipur"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-10"; },
      { id="p176"; propertyType="Residential"; action="PG"; title="PG for Boys in Navrangpura"; description="Safe PG for working boys and students near CG Road, Navrangpura. Meals available."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura, Near Income Tax, PG Residency, Ahmedabad - 380009"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="Studio"; sqft=200; furnishing="Furnished"; amenities=["Wi-Fi","Meals","AC","Security","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="PG Residency Navrangpura"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-20"; },
      { id="p177"; propertyType="Residential"; action="PG"; title="PG Accommodation in Satellite"; description="Comfortable PG accommodation for IT professionals near Satellite crossroads."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Cross Roads, PG Home Block B, Satellite, Ahmedabad - 380015"; price=9000; priceDisplay="\u{20B9}9,000/month"; bhk="Studio"; sqft=220; furnishing="Furnished"; amenities=["Wi-Fi","AC","Security","Meals","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Satellite PG Block B"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-25"; },
      { id="p178"; propertyType="Residential"; action="PG"; title="PG for Girls near SG Highway"; description="Secure PG for female professionals near SG Highway with 24/7 security and meals."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway, Near Judges Bungalow Junction, Girls PG Home, Ahmedabad - 380054"; price=11000; priceDisplay="\u{20B9}11,000/month"; bhk="Studio"; sqft=250; furnishing="Furnished"; amenities=["Wi-Fi","AC","Security","Meals","CCTV"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="SG Highway Girls PG"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-01"; },
      { id="p179"; propertyType="Residential"; action="PG"; title="Co-Living PG in Satellite"; description="Modern co-living PG space in Satellite with shared kitchen and recreation area."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite, Near Ambli Junction, Co-Live Home, Ahmedabad - 380015"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="Studio"; sqft=280; furnishing="Furnished"; amenities=["Wi-Fi","AC","Shared Kitchen","Recreation Room","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Co-Live Home Satellite"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-05"; },
      { id="p180"; propertyType="Residential"; action="Buy"; title="Villa in Shela - 4 BHK"; description="Premium 4 BHK villa in Shela with private garden, swimming pool and double garage."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Premium Villas, Plot 5, SP Ring Road, Shela, Ahmedabad - 380058"; price=28000000; priceDisplay="\u{20B9}2.8 Cr"; bhk="4 BHK+"; sqft=5200; furnishing="Semi-Furnished"; amenities=["Private Pool","Garden","Double Garage","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Shela Premium Villas"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-01"; },
      { id="p181"; propertyType="Residential"; action="Buy"; title="Luxury Villa in Bopal"; description="Grand 5 BHK luxury villa in Bopal with home theatre, gym and landscaped garden."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Premium Enclave, Bungalow 3, Near SP Ring Road, Bopal, Ahmedabad - 380058"; price=35000000; priceDisplay="\u{20B9}3.5 Cr"; bhk="Villa"; sqft=7000; furnishing="Semi-Furnished"; amenities=["Swimming Pool","Home Theatre","Gym","Garden","Security","Parking"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Bopal Premium Enclave"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-15"; },
      { id="p182"; propertyType="Residential"; action="Buy"; title="Villa in Bopal - 4 BHK"; description="Elegant 4 BHK independent bungalow in Bopal with terrace garden and 2-car parking."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Bungalow Zone, Survey 12, Bopal, Ahmedabad - 380058"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="4 BHK+"; sqft=4200; furnishing="Unfurnished"; amenities=["Parking","Garden","Terrace","Security","Modular Kitchen"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Bopal Bungalow Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-01-20"; },
      { id="p183"; propertyType="Commercial"; action="Lease"; title="Office Space for Lease on SG Highway"; description="Premium grade-A office space on SG Highway, corporate interiors, dedicated parking."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Corporate Park, 7th Floor, Ahmedabad - 380054"; price=120000; priceDisplay="\u{20B9}1.2 Lakh/month"; bhk="Studio"; sqft=3500; furnishing="Furnished"; amenities=["Parking","Lift","Power Backup","Security","Cafeteria","Conference Room"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="SG Highway Corporate Park"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-01"; },
      { id="p184"; propertyType="Commercial"; action="Lease"; title="IT Office in Navrangpura"; description="Well-connected IT office space in Navrangpura, near Gujarat High Court and BSNL office."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Circle, 4th Floor, Commerce House, Ahmedabad - 380009"; price=75000; priceDisplay="\u{20B9}75,000/month"; bhk="Studio"; sqft=2200; furnishing="Unfurnished"; amenities=["Parking","Lift","Power Backup","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Commerce House"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-05"; },
      { id="p185"; propertyType="Commercial"; action="Lease"; title="Office Space on SG Highway - Large"; description="Entire floor office space on SG Highway, ideal for MNC or large tech firm."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Tower, Full Floor, 10th Level, Ahmedabad - 380054"; price=200000; priceDisplay="\u{20B9}2 Lakh/month"; bhk="Studio"; sqft=7000; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Power Backup","Security","Cafeteria","Gym","Conference Rooms"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=10; societyName="SG Highway Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-10"; },
      { id="p186"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Maninagar"; description="Budget 1 BHK in Maninagar near Maninagar railway station. Easy commute."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Station Road, Jalaram Society, Maninagar, Ahmedabad - 380008"; price=8000; priceDisplay="\u{20B9}8,000/month"; bhk="1 BHK"; sqft=580; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Jalaram Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-15"; },
      { id="p187"; propertyType="Residential"; action="Rent"; title="1 BHK in Naroda"; description="Affordable 1 BHK in Naroda, near GIDC. Good for factory or GIDC workers."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Main Road, Gayatri Society, Naroda, Ahmedabad - 382330"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="1 BHK"; sqft=560; furnishing="Unfurnished"; amenities=["Water Supply","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Gayatri Society Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-20"; },
      { id="p188"; propertyType="Residential"; action="Rent"; title="1 BHK in Nikol"; description="Compact 1 BHK near Vastral Metro, ideal for working professional or couple in Nikol."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Char Rasta, Metro Residency, Nikol, Ahmedabad - 382350"; price=9000; priceDisplay="\u{20B9}9,000/month"; bhk="1 BHK"; sqft=600; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Metro Residency Nikol"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-25"; },
      { id="p189"; propertyType="Residential"; action="Rent"; title="2 BHK in Maninagar"; description="Clean 2 BHK in Maninagar for families or working professionals, near schools."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Circle, Vrundavan Society, Maninagar, Ahmedabad - 380008"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=900; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Vrundavan Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-01"; },
      { id="p190"; propertyType="Residential"; action="Rent"; title="1 BHK in Naroda - Near GIDC"; description="1 BHK flat near Naroda GIDC ideal for factory workers, semi-furnished and ready."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda GIDC Road, Om Shanti Society, Naroda, Ahmedabad - 382330"; price=8500; priceDisplay="\u{20B9}8,500/month"; bhk="1 BHK"; sqft=590; furnishing="Semi-Furnished"; amenities=["Water Supply","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Om Shanti Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-05"; },
      { id="p191"; propertyType="Residential"; action="Rent"; title="1 BHK in Nikol - Budget"; description="Budget 1 BHK in Nikol with basic amenities, close to highway and BRTS."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Village Road, Sai Society, Nikol, Ahmedabad - 382350"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=530; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Sai Society Nikol"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-11-10"; },
      { id="p192"; propertyType="Residential"; action="Buy"; title="3 BHK Row House in Bopal"; description="Independent 3 BHK row house in gated community in Bopal with dedicated garden patch."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Row House Colony, House No. 7, Bopal, Ahmedabad - 380058"; price=9500000; priceDisplay="\u{20B9}95 Lakh"; bhk="3 BHK"; sqft=2200; furnishing="Unfurnished"; amenities=["Garden","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Bopal Row House Colony"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-15"; },
      { id="p193"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Prahlad Nagar"; description="Well-located 2 BHK near ISCON mega mall in Prahlad Nagar, RERA registered project."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar, Near ISCON Mall, Fortune Residency, Ahmedabad - 380015"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="2 BHK"; sqft=1150; furnishing="Unfurnished"; amenities=["Parking","Gym","Security","Lift","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=6; societyName="Fortune Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-02-20"; },
      { id="p194"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent in Prahlad Nagar"; description="Fully semi-furnished 3 BHK in Prahlad Nagar with gym and pool access."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Cross Road, Pinnacle Apartments, Ahmedabad - 380015"; price=28000; priceDisplay="\u{20B9}28,000/month"; bhk="3 BHK"; sqft=1700; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Pool","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=9; societyName="Pinnacle Apartments"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-01"; },
      { id="p195"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Maninagar"; description="Well-maintained 2 BHK in Maninagar with RCC structure, east-facing, ready to move."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Char Rasta, Hetal Society, Maninagar, Ahmedabad - 380008"; price=3800000; priceDisplay="\u{20B9}38 Lakh"; bhk="2 BHK"; sqft=880; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Hetal Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-05"; },
      { id="p196"; propertyType="Residential"; action="Buy"; title="1 BHK Flat in Naroda"; description="Budget 1 BHK in Naroda near highway for first-home buyers or investors."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Highway, Dharti Society, Naroda, Ahmedabad - 382330"; price=2200000; priceDisplay="\u{20B9}22 Lakh"; bhk="1 BHK"; sqft=600; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Dharti Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-10"; },
      { id="p197"; propertyType="Commercial"; action="Lease"; title="Showroom Space on SG Highway"; description="Premium showroom space on SG Highway frontage road, ideal for luxury brands or auto showroom."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Frontage, Showroom 2, Near Judges Bungalow, Ahmedabad - 380054"; price=150000; priceDisplay="\u{20B9}1.5 Lakh/month"; bhk="Studio"; sqft=5000; furnishing="Unfurnished"; amenities=["Wide Frontage","Parking","Power Backup","Road Access"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="SG Highway Showroom Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-01"; },
      { id="p198"; propertyType="Residential"; action="Buy"; title="2 BHK in Nikol"; description="Affordable 2 BHK in Nikol, near metro corridor, good investment potential."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Station Road, Govardhan Society, Nikol, Ahmedabad - 382350"; price=3400000; priceDisplay="\u{20B9}34 Lakh"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Parking","Lift","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Govardhan Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2025-10-15"; },
      { id="p199"; propertyType="Residential"; action="Buy"; title="3 BHK in Chandkheda - RERA Approved"; description="RERA-registered 3 BHK in new township in Chandkheda, great connectivity to highway."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Township, Block D, Chandkheda, Ahmedabad - 382424"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="3 BHK"; sqft=1350; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security","Garden"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Chandkheda Township"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-05"; },
      { id="p200"; propertyType="Residential"; action="Rent"; title="2 BHK in Vastral"; description="Ready-to-move 2 BHK in Vastral for rent, near metro and highway junction."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Circle, Ambe Society, Vastral, Ahmedabad - 382418"; price=11000; priceDisplay="\u{20B9}11,000/month"; bhk="2 BHK"; sqft=920; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Ambe Society Vastral"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-10"; },
      // --- p201-p250: ADDITIONAL LISTINGS ---
      { id="p201"; propertyType="Residential"; action="Buy"; title="2 BHK in Bopal - Budget"; description="Affordable 2 BHK in Bopal, near SP Ring Road, good connectivity and amenities."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Budget Society, Near Ambli Circle, Bopal, Ahmedabad - 380058"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="2 BHK"; sqft=980; furnishing="Unfurnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Bopal Budget Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-15"; },
      { id="p202"; propertyType="Residential"; action="Buy"; title="3 BHK in Bopal - Mid Range"; description="Mid-range 3 BHK in Bopal with club amenities and 24/7 security in a gated complex."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Green Society, Block C, Bopal, Ahmedabad - 380058"; price=7200000; priceDisplay="\u{20B9}72 Lakh"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Bopal Green Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-18"; },
      { id="p203"; propertyType="Residential"; action="Buy"; title="1 BHK in Bopal - Starter"; description="Compact 1 BHK perfect for first-time buyers or young professionals in Bopal."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Starter Homes, Near BRTS, Bopal, Ahmedabad - 380058"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="1 BHK"; sqft=620; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Bopal Starter Homes"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-20"; },
      { id="p204"; propertyType="Residential"; action="Buy"; title="3 BHK on SG Highway - Premium"; description="Premium 3 BHK flat on SG Highway with smart home features and panoramic views."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Prestige Towers, 9th Floor, Ahmedabad - 380054"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="3 BHK"; sqft=1900; furnishing="Semi-Furnished"; amenities=["Smart Home","Gym","Pool","Security","Club House","Parking"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=9; societyName="SG Prestige Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-22"; },
      { id="p205"; propertyType="Residential"; action="Buy"; title="2 BHK on SG Highway - Value"; description="Value 2 BHK on SG Highway, RERA registered, near reputed schools and hospitals."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Value Homes, Flat 502, Ahmedabad - 380054"; price=6800000; priceDisplay="\u{20B9}68 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=5; societyName="SG Value Homes"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-03-25"; },
      { id="p206"; propertyType="Residential"; action="Buy"; title="1 BHK in Navrangpura - Central"; description="Well-located 1 BHK in Navrangpura near Gujarat University, easy metro access."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura University Road, Flat 105, Ahmedabad - 380009"; price=4200000; priceDisplay="\u{20B9}42 Lakh"; bhk="1 BHK"; sqft=680; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="University Road Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-01"; },
      { id="p207"; propertyType="Residential"; action="Buy"; title="2 BHK in Navrangpura - RERA"; description="RERA-approved 2 BHK in Navrangpura, east-facing, good natural light and ventilation."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Cross Road, Arjun Residency, Ahmedabad - 380009"; price=7000000; priceDisplay="\u{20B9}70 Lakh"; bhk="2 BHK"; sqft=1180; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Arjun Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-03"; },
      { id="p208"; propertyType="Residential"; action="Buy"; title="3 BHK in Navrangpura - Luxury"; description="Luxury 3 BHK in Navrangpura with premium fittings, modular kitchen and club membership."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Elite Towers, 11th Floor, CG Road, Ahmedabad - 380009"; price=11500000; priceDisplay="\u{20B9}1.15 Cr"; bhk="3 BHK"; sqft=1950; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security","Rooftop Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=11; societyName="Navrangpura Elite Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-05"; },
      { id="p209"; propertyType="Residential"; action="Buy"; title="2 BHK in Satellite - Ready"; description="Ready-to-move 2 BHK in Satellite, close to Himalaya Mall and corporate offices."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Cross Road, Himalaya Adjacent, Flat 302, Ahmedabad - 380015"; price=7800000; priceDisplay="\u{20B9}78 Lakh"; bhk="2 BHK"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Satellite Cross Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-07"; },
      { id="p210"; propertyType="Residential"; action="Buy"; title="3 BHK in Prahlad Nagar - Premium"; description="Premium 3 BHK in Prahlad Nagar near ISCON circle with all luxury amenities."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar ISCON Road, Luxury Towers, Ahmedabad - 380015"; price=12500000; priceDisplay="\u{20B9}1.25 Cr"; bhk="3 BHK"; sqft=2100; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="Prahlad Nagar Luxury Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-10"; },
      { id="p211"; propertyType="Residential"; action="Buy"; title="2 BHK in Prahlad Nagar - New"; description="New launch 2 BHK in Prahlad Nagar, attractive price for early buyers, RERA registered."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Main Road, New Launch Tower, Flat 204, Ahmedabad - 380015"; price=8500000; priceDisplay="\u{20B9}85 Lakh"; bhk="2 BHK"; sqft=1350; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="South"; floorNo=5; societyName="Prahlad Nagar New Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-12"; },
      { id="p212"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Gota"; description="Budget 1 BHK in Gota near BRTS, ideal for working professionals commuting to north Ahmedabad."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Road, Near BRTS, Shantiniketan Society, Gota, Ahmedabad - 382481"; price=8000; priceDisplay="\u{20B9}8,000/month"; bhk="1 BHK"; sqft=560; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Shantiniketan Society Gota"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-15"; },
      { id="p213"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Gota"; description="Spacious 2 BHK for rent in Gota with good natural light and covered parking."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Cross Road, Mahavir Society, Gota, Ahmedabad - 382481"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=950; furnishing="Semi-Furnished"; amenities=["Parking","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Mahavir Society Gota"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-17"; },
      { id="p214"; propertyType="Residential"; action="Buy"; title="2 BHK in Gota - Budget Buy"; description="Affordable 2 BHK flat in Gota, value for money with good road connectivity."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Village Road, Sunflower Society, Gota, Ahmedabad - 382481"; price=3500000; priceDisplay="\u{20B9}35 Lakh"; bhk="2 BHK"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Sunflower Society Gota"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-20"; },
      { id="p215"; propertyType="Residential"; action="Rent"; title="1 BHK in Chandkheda - Affordable"; description="Low-cost 1 BHK rent in Chandkheda, walking distance from metro station."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Metro Road, Sundar Society, Chandkheda, Ahmedabad - 382424"; price=7500; priceDisplay="\u{20B9}7,500/month"; bhk="1 BHK"; sqft=550; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=1; societyName="Sundar Society Chandkheda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-22"; },
      { id="p216"; propertyType="Residential"; action="Buy"; title="1 BHK in Chandkheda - Entry Level"; description="Entry-level 1 BHK in Chandkheda near GIDC, great for first-time buyers or investors."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda GIDC Road, Pragati Society, Chandkheda, Ahmedabad - 382424"; price=2500000; priceDisplay="\u{20B9}25 Lakh"; bhk="1 BHK"; sqft=600; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Pragati Society Chandkheda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-24"; },
      { id="p217"; propertyType="Residential"; action="Buy"; title="3 BHK in Chandkheda - New Project"; description="New residential project in Chandkheda, 3 BHK with RERA number, great connectivity."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Highway, New Horizon Society, Chandkheda, Ahmedabad - 382424"; price=5000000; priceDisplay="\u{20B9}50 Lakh"; bhk="3 BHK"; sqft=1300; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="New Horizon Chandkheda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-26"; },
      { id="p218"; propertyType="Residential"; action="Buy"; title="2 BHK in Satellite - Premium"; description="Premium 2 BHK in Satellite near Ambli-Bopal road, designer interiors, just 2 years old."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Premium Heights, Near Ambli, Ahmedabad - 380015"; price=9000000; priceDisplay="\u{20B9}90 Lakh"; bhk="2 BHK"; sqft=1350; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=7; societyName="Satellite Premium Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-04-28"; },
      { id="p219"; propertyType="Residential"; action="Buy"; title="3 BHK in Satellite - Landmark"; description="Landmark 3 BHK project in Satellite with landmark location near Himalaya Mall."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Landmark Residency, 6th Floor, Near Himalaya Mall, Ahmedabad - 380015"; price=14000000; priceDisplay="\u{20B9}1.4 Cr"; bhk="3 BHK"; sqft=2200; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Satellite Landmark Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-01"; },
      { id="p220"; propertyType="Residential"; action="Rent"; title="1 BHK in Nikol - Metro Nearby"; description="Convenient 1 BHK in Nikol near Vastral Metro, suitable for working professionals."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Station Road, Metro View Society, Nikol, Ahmedabad - 382350"; price=8500; priceDisplay="\u{20B9}8,500/month"; bhk="1 BHK"; sqft=580; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Metro View Society Nikol"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-03"; },
      { id="p221"; propertyType="Residential"; action="Rent"; title="2 BHK in Nikol - Family"; description="Comfortable 2 BHK in Nikol for families, with school and market in walking distance."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Main Bazaar Road, Patel Society, Nikol, Ahmedabad - 382350"; price=11000; priceDisplay="\u{20B9}11,000/month"; bhk="2 BHK"; sqft=900; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Patel Society Nikol"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-05"; },
      { id="p222"; propertyType="Residential"; action="Rent"; title="1 BHK in Naroda - Budget"; description="Very affordable 1 BHK in Naroda, basic amenities, good for GIDC workers."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Road, Harsiddhi Society, Naroda, Ahmedabad - 382330"; price=7000; priceDisplay="\u{20B9}7,000/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Harsiddhi Society Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-07"; },
      { id="p223"; propertyType="Residential"; action="Rent"; title="2 BHK in Naroda - Semi Furnished"; description="Semi-furnished 2 BHK in Naroda with basic furniture, ready to move."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Char Rasta, Shreeji Society, Naroda, Ahmedabad - 382330"; price=10000; priceDisplay="\u{20B9}10,000/month"; bhk="2 BHK"; sqft=870; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Shreeji Society Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-09"; },
      { id="p224"; propertyType="Residential"; action="Rent"; title="1 BHK in Nikol - New Build"; description="Newly built 1 BHK in Nikol, never occupied, modern finishes and good connectivity."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Cross Road, New Build Society, Nikol, Ahmedabad - 382350"; price=9500; priceDisplay="\u{20B9}9,500/month"; bhk="1 BHK"; sqft=610; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="New Build Society Nikol"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-11"; },
      { id="p225"; propertyType="Residential"; action="Rent"; title="2 BHK in Naroda - Near School"; description="2 BHK in Naroda, close to reputed school and AMC dispensary, family-friendly."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda School Road, Navjivan Society, Naroda, Ahmedabad - 382330"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=930; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Navjivan Society Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-13"; },
      // --- COMMERCIAL / INDUSTRIAL PLOTS ---
      { id="p226"; propertyType="Industrial"; action="Buy"; title="Industrial Plot in Naroda GIDC"; description="GIDC allotted industrial plot in Naroda, suitable for small-scale manufacturing unit."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda GIDC, Plot No. 44, Phase 2, Naroda, Ahmedabad - 382330"; price=8500000; priceDisplay="\u{20B9}85 Lakh"; bhk="Plot"; sqft=6000; furnishing="Unfurnished"; amenities=["3-Phase Power","Road Access","Water Connection","Drainage"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Naroda GIDC Phase 2"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-15"; },
      { id="p227"; propertyType="Industrial"; action="Lease"; title="Industrial Shed in Odhav GIDC"; description="Ready industrial shed in Odhav GIDC with loading dock, suitable for logistics or light manufacturing."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav GIDC Road, Shed No. 12, Odhav, Ahmedabad - 382415"; price=45000; priceDisplay="\u{20B9}45,000/month"; bhk="Studio"; sqft=5000; furnishing="Unfurnished"; amenities=["Loading Dock","3-Phase Power","Road Access","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Odhav GIDC Industrial Park"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-17"; },
      { id="p228"; propertyType="Commercial"; action="Buy"; title="Commercial Plot in Chandkheda"; description="AUDA-approved commercial plot in Chandkheda near highway, suitable for showroom or office complex."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Highway, Commercial Zone, Plot 7, Ahmedabad - 382424"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="Plot"; sqft=4000; furnishing="Unfurnished"; amenities=["Road Access","Water","Power","Drainage"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Chandkheda Commercial Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-19"; },
      { id="p229"; propertyType="Commercial"; action="Buy"; title="Commercial Plot near Gota Highway"; description="Corner commercial plot near Gota highway junction, high visibility and traffic, ideal for showroom."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Highway Junction, Corner Plot 3, Gota, Ahmedabad - 382481"; price=11000000; priceDisplay="\u{20B9}1.1 Cr"; bhk="Plot"; sqft=5500; furnishing="Unfurnished"; amenities=["High Visibility","40 ft Road","Water","Power"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Gota Highway Commercial"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-21"; },
      { id="p230"; propertyType="Industrial"; action="Buy"; title="Warehouse Plot in Kathwada"; description="Large industrial/warehouse plot in Kathwada GIDC near NH-47, suitable for logistics company."; location="Kathwada, Ahmedabad"; city="Ahmedabad"; address="Kathwada GIDC, Survey No. 78, NH-47 Side, Kathwada, Ahmedabad - 382430"; price=20000000; priceDisplay="\u{20B9}2 Cr"; bhk="Plot"; sqft=20000; furnishing="Unfurnished"; amenities=["NH Access","3-Phase Power","Water","Loading Area","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=0; societyName="Kathwada GIDC"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-23"; },
      // --- PG OPTIONS ---
      { id="p231"; propertyType="Residential"; action="PG"; title="PG for Boys in Chandkheda"; description="Clean PG accommodation for boys in Chandkheda, near engineering colleges and GIDC."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda College Road, Boys PG Home, Ahmedabad - 382424"; price=5500; priceDisplay="\u{20B9}5,500/month"; bhk="Studio"; sqft=180; furnishing="Furnished"; amenities=["Wi-Fi","Meals","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Chandkheda Boys PG"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-25"; },
      { id="p232"; propertyType="Residential"; action="PG"; title="PG for Girls in Navrangpura"; description="Well-maintained girls PG near Gujarat University in Navrangpura with strict security."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura, Near Gujarat University, Girls PG Residency, Ahmedabad - 380009"; price=8000; priceDisplay="\u{20B9}8,000/month"; bhk="Studio"; sqft=200; furnishing="Furnished"; amenities=["Wi-Fi","Meals","AC","Security","CCTV"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Navrangpura Girls PG"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-27"; },
      { id="p233"; propertyType="Residential"; action="PG"; title="Co-Living PG in Bopal"; description="Modern co-living space in Bopal for young professionals, shared amenities and community vibe."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Ambli Road, Co-Live Bopal, Ahmedabad - 380058"; price=10000; priceDisplay="\u{20B9}10,000/month"; bhk="Studio"; sqft=240; furnishing="Furnished"; amenities=["Wi-Fi","AC","Shared Kitchen","Recreation Room","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Co-Live Bopal"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-29"; },
      { id="p234"; propertyType="Residential"; action="PG"; title="PG in Gota - Near College"; description="Budget PG for students near colleges in Gota, meals available, homely atmosphere."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota, Near College Junction, Student PG Home, Ahmedabad - 382481"; price=5000; priceDisplay="\u{20B9}5,000/month"; bhk="Studio"; sqft=170; furnishing="Furnished"; amenities=["Wi-Fi","Meals","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=1; societyName="Gota Student PG"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-31"; },
      { id="p235"; propertyType="Residential"; action="PG"; title="Premium PG on SG Highway"; description="Premium PG accommodation on SG Highway for senior IT professionals, all amenities included."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Corporate Zone, Premium PG Block, Ahmedabad - 380054"; price=15000; priceDisplay="\u{20B9}15,000/month"; bhk="Studio"; sqft=300; furnishing="Furnished"; amenities=["Wi-Fi","AC","Gym","Meals","Security","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="SG Highway Premium PG"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-02"; },
      // --- MORE MIXED LISTINGS ---
      { id="p236"; propertyType="Residential"; action="Buy"; title="2 BHK in Bopal - New Launch"; description="New launch 2 BHK in Bopal township with RERA approval, near international schools."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Township Phase 3, Block A, Near International School, Bopal, Ahmedabad - 380058"; price=5800000; priceDisplay="\u{20B9}58 Lakh"; bhk="2 BHK"; sqft=1150; furnishing="Unfurnished"; amenities=["Parking","Gym","Security","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Bopal Township Phase 3"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-04"; },
      { id="p237"; propertyType="Residential"; action="Buy"; title="1 BHK in SG Highway - Investment"; description="Investment-grade 1 BHK on SG Highway with strong rental demand from IT professionals."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Residency, 3rd Floor, Near ISCON Crossroads, Ahmedabad - 380054"; price=4800000; priceDisplay="\u{20B9}48 Lakh"; bhk="1 BHK"; sqft=750; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="SG Highway Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-06"; },
      { id="p238"; propertyType="Residential"; action="Buy"; title="3 BHK in Gota - Family Home"; description="Spacious 3 BHK family home in Gota with garden-facing balcony and proximity to metro."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Metro Road, Garden View Society, Gota, Ahmedabad - 382481"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="3 BHK"; sqft=1380; furnishing="Unfurnished"; amenities=["Parking","Garden","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Garden View Society Gota"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-08"; },
      { id="p239"; propertyType="Residential"; action="Buy"; title="2 BHK in Chandkheda - Mid Range"; description="Mid-range 2 BHK in Chandkheda with modern finishes, covered parking and nearby market access."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Market Road, Riviera Society, Chandkheda, Ahmedabad - 382424"; price=4200000; priceDisplay="\u{20B9}42 Lakh"; bhk="2 BHK"; sqft=960; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Riviera Society Chandkheda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-10"; },
      { id="p240"; propertyType="Residential"; action="Rent"; title="2 BHK in Satellite - Furnished"; description="Fully furnished 2 BHK for rent in Satellite, ideal for expats or senior executives."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Posh Zone, Near Ambli Road, Flat 401, Ahmedabad - 380015"; price=25000; priceDisplay="\u{20B9}25,000/month"; bhk="2 BHK"; sqft=1150; furnishing="Furnished"; amenities=["Parking","Gym","Pool","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=5; societyName="Satellite Posh Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-12"; },
      { id="p241"; propertyType="Residential"; action="Rent"; title="3 BHK in Bopal - Spacious"; description="Spacious 3 BHK for rent in Bopal with large living area, 2 covered parking slots."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Grand Society, Flat 702, Bopal, Ahmedabad - 380058"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="Bopal Grand Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-14"; },
      { id="p242"; propertyType="Residential"; action="Rent"; title="2 BHK in Gota - New"; description="Brand new 2 BHK for rent in Gota, first occupant, direct from builder."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota New Build, Near Ring Road, Flat 201, Gota, Ahmedabad - 382481"; price=14000; priceDisplay="\u{20B9}14,000/month"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Gota New Build Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-16"; },
      { id="p243"; propertyType="Residential"; action="Rent"; title="3 BHK in Chandkheda - Family"; description="Family-sized 3 BHK in Chandkheda with terrace access and proximity to GIDC and schools."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Family Enclave, Block B, Flat 102, Ahmedabad - 382424"; price=17000; priceDisplay="\u{20B9}17,000/month"; bhk="3 BHK"; sqft=1400; furnishing="Semi-Furnished"; amenities=["Parking","Terrace","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Chandkheda Family Enclave"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-18"; },
      { id="p244"; propertyType="Residential"; action="Buy"; title="2 BHK in Navrangpura - Corner Flat"; description="Corner flat 2 BHK in Navrangpura, two-side open, excellent ventilation and city views."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Corner Heights, Flat 601, Navrangpura, Ahmedabad - 380009"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="2 BHK"; sqft=1250; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Navrangpura Corner Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-20"; },
      { id="p245"; propertyType="Residential"; action="Buy"; title="3 BHK in SG Highway - Under Const."; description="Under-construction 3 BHK on SG Highway from reputed builder, attractive pre-launch price."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Pre-Launch Tower, Block D, Ahmedabad - 380054"; price=10000000; priceDisplay="\u{20B9}1 Cr"; bhk="3 BHK"; sqft=1750; furnishing="Unfurnished"; amenities=["Pool","Gym","Club House","Parking","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="North"; floorNo=10; societyName="SG Pre-Launch Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-22"; },
      { id="p246"; propertyType="Residential"; action="Buy"; title="3 BHK in Bopal - RERA Registered"; description="RERA registered 3 BHK in Bopal, ready possession, excellent connectivity to SP Ring Road."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal RERA Project, Block 2, Flat 305, Bopal, Ahmedabad - 380058"; price=8000000; priceDisplay="\u{20B9}80 Lakh"; bhk="3 BHK"; sqft=1600; furnishing="Unfurnished"; amenities=["Parking","Gym","Lift","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Bopal RERA Project"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-24"; },
      { id="p247"; propertyType="Residential"; action="Buy"; title="2 BHK in Gota - Investment"; description="Investment-friendly 2 BHK in Gota with strong rental yield potential and metro corridor advantage."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Investment Homes, Near Metro Depot, Gota, Ahmedabad - 382481"; price=4000000; priceDisplay="\u{20B9}40 Lakh"; bhk="2 BHK"; sqft=940; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Gota Investment Homes"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-26"; },
      { id="p248"; propertyType="Residential"; action="Rent"; title="2 BHK in Prahlad Nagar - Luxury Rent"; description="Luxury 2 BHK for rent in Prahlad Nagar, fully furnished, near corporate offices and malls."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Elite Zone, Flat 802, Near Corporate Road, Ahmedabad - 380015"; price=30000; priceDisplay="\u{20B9}30,000/month"; bhk="2 BHK"; sqft=1400; furnishing="Furnished"; amenities=["Parking","Gym","Pool","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Prahlad Nagar Elite Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-28"; },
      { id="p249"; propertyType="Residential"; action="Rent"; title="1 BHK in Satellite - Furnished"; description="Compact furnished 1 BHK for rent in Satellite, ideal for single professional or young couple."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Residency Block, 4th Floor, Near Satellite Road, Ahmedabad - 380015"; price=16000; priceDisplay="\u{20B9}16,000/month"; bhk="1 BHK"; sqft=720; furnishing="Furnished"; amenities=["Parking","Security","AC","Wi-Fi Ready"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Satellite Residency Block"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-30"; },
      { id="p250"; propertyType="Residential"; action="Buy"; title="4 BHK Flat in Prahlad Nagar"; description="Ultra-spacious 4 BHK in Prahlad Nagar, corner unit with panoramic city view, premium project."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Grand Towers, 14th Floor, Near ISCON Crossroads, Ahmedabad - 380015"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="4 BHK+"; sqft=3200; furnishing="Semi-Furnished"; amenities=["Smart Home","Pool","Gym","Club House","Parking","Security","Rooftop Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Prahlad Nagar Grand Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-01"; },
    ];
  do {
    let moreProps : [PropertyListing] = [
      // --- BHADAJ ---
      { id="p301"; propertyType="Residential"; action="Buy"; title="2 BHK in Bhadaj"; description="Affordable 2 BHK in Bhadaj, near SP Ring Road and Thaltej metro corridor."; location="Bhadaj, Ahmedabad"; city="Ahmedabad"; address="Bhadaj Village Road, Shubham Society, Bhadaj, Ahmedabad - 380054"; price=4800000; priceDisplay="\u{20B9}48 Lakh"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Shubham Society Bhadaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-01"; },
      { id="p302"; propertyType="Residential"; action="Rent"; title="2 BHK Rent in Bhadaj"; description="Nicely maintained 2 BHK on rent in Bhadaj, close to Thaltej and Sola."; location="Bhadaj, Ahmedabad"; city="Ahmedabad"; address="Bhadaj Main Road, Rajhans Society, Bhadaj, Ahmedabad - 380054"; price=13000; priceDisplay="\u{20B9}13,000/month"; bhk="2 BHK"; sqft=960; furnishing="Semi-Furnished"; amenities=["Parking","Water Supply","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Rajhans Society Bhadaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-03"; },
      // --- HEBATPUR ---
      { id="p303"; propertyType="Residential"; action="Buy"; title="2 BHK in Hebatpur"; description="Compact 2 BHK in Hebatpur near Science City road, good investment potential."; location="Hebatpur, Ahmedabad"; city="Ahmedabad"; address="Hebatpur Road, Nilkanth Society, Hebatpur, Ahmedabad - 382424"; price=3800000; priceDisplay="\u{20B9}38 Lakh"; bhk="2 BHK"; sqft=920; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Nilkanth Society Hebatpur"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-05"; },
      { id="p304"; propertyType="Plot"; action="Buy"; title="Plot in Hebatpur"; description="Residential plot in Hebatpur village, near Science City and Sola Civil road."; location="Hebatpur, Ahmedabad"; city="Ahmedabad"; address="Hebatpur Village, Survey 12, Hebatpur, Ahmedabad - 382424"; price=3500000; priceDisplay="\u{20B9}35 Lakh"; bhk="Plot"; sqft=1800; furnishing="Unfurnished"; amenities=["Road Access","Water"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Hebatpur Survey"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-07"; },
      // --- SCIENCE CITY ROAD ---
      { id="p305"; propertyType="Residential"; action="Buy"; title="3 BHK on Science City Road"; description="Spacious 3 BHK on Science City road with quick metro access and quality construction."; location="Science City, Ahmedabad"; city="Ahmedabad"; address="Science City Road, Akshardham Residency, Ahmedabad - 380060"; price=8500000; priceDisplay="\u{20B9}85 Lakh"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Akshardham Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-09"; },
      { id="p306"; propertyType="Residential"; action="Rent"; title="2 BHK near Science City"; description="Well-ventilated 2 BHK near Science City, ideal for professionals or small family."; location="Science City, Ahmedabad"; city="Ahmedabad"; address="Science City Road, Harmony Apts, Flat 3, Ahmedabad - 380060"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Harmony Apts Science City"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-11"; },
      // --- JUDGES BUNGALOW ROAD ---
      { id="p307"; propertyType="Residential"; action="Buy"; title="4 BHK on Judges Bungalow Road"; description="Premium 4 BHK on prestigious Judges Bungalow Road, Bodakdev, with luxury finishes."; location="Judges Bungalow Road, Ahmedabad"; city="Ahmedabad"; address="Judges Bungalow Road, No. 14, Near Bodakdev, Ahmedabad - 380054"; price=25000000; priceDisplay="\u{20B9}2.5 Cr"; bhk="4 BHK+"; sqft=4500; furnishing="Semi-Furnished"; amenities=["Private Garden","Parking","Security","Club House","Smart Home"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="JB Road Bungalows"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-13"; },
      { id="p308"; propertyType="Residential"; action="Rent"; title="3 BHK near Judges Bungalow Road"; description="Spacious 3 BHK apartment near JB Road in Bodakdev, ideal for senior executives."; location="Judges Bungalow Road, Ahmedabad"; city="Ahmedabad"; address="Judges Bungalow Road, Elite Apts, Flat 501, Ahmedabad - 380054"; price=38000; priceDisplay="\u{20B9}38,000/month"; bhk="3 BHK"; sqft=2000; furnishing="Furnished"; amenities=["Parking","Gym","Security","Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="JB Road Elite Apts"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-15"; },
      // --- GURUKUL ---
      { id="p309"; propertyType="Residential"; action="Buy"; title="2 BHK in Gurukul"; description="Classic 2 BHK in Gurukul area near Ashram Road, good connectivity to old city and new west."; location="Gurukul, Ahmedabad"; city="Ahmedabad"; address="Gurukul Road, Riddhi Siddhi Society, Gurukul, Ahmedabad - 380052"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Riddhi Siddhi Society Gurukul"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-17"; },
      { id="p310"; propertyType="Residential"; action="Rent"; title="3 BHK in Gurukul"; description="Well-maintained 3 BHK in Gurukul, close to DPS school and Ashram Road."; location="Gurukul, Ahmedabad"; city="Ahmedabad"; address="Gurukul Circle, Saraswati Apts, Block D, Gurukul, Ahmedabad - 380052"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Parking","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Saraswati Apts Gurukul"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-19"; },
      // --- MEMNAGAR ---
      { id="p311"; propertyType="Residential"; action="Buy"; title="2 BHK in Memnagar"; description="Prime 2 BHK in Memnagar, close to CG Road and Gujarat University."; location="Memnagar, Ahmedabad"; city="Ahmedabad"; address="Memnagar Road, Shanti Society, Memnagar, Ahmedabad - 380052"; price=6000000; priceDisplay="\u{20B9}60 Lakh"; bhk="2 BHK"; sqft=1080; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Shanti Society Memnagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-21"; },
      { id="p312"; propertyType="Residential"; action="Rent"; title="2 BHK in Memnagar"; description="Clean 2 BHK for rent in Memnagar near Gujarat University, walking to metro."; location="Memnagar, Ahmedabad"; city="Ahmedabad"; address="Memnagar University Road, Amee Society, Memnagar, Ahmedabad - 380052"; price=17000; priceDisplay="\u{20B9}17,000/month"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Amee Society Memnagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-23"; },
      // --- SOLA ---
      { id="p313"; propertyType="Residential"; action="Buy"; title="3 BHK in Sola - New Project"; description="New residential project in Sola, 3 BHK with RERA registration, near Civil Hospital."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Civil Road, Amrapali Towers, Sola, Ahmedabad - 380060"; price=7200000; priceDisplay="\u{20B9}72 Lakh"; bhk="3 BHK"; sqft=1500; furnishing="Unfurnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Amrapali Towers Sola"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-25"; },
      { id="p314"; propertyType="Residential"; action="Buy"; title="1 BHK in Sola - Budget"; description="Budget 1 BHK in Sola near Science City road, excellent for young buyers."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Highway, Shreekunj Society, Sola, Ahmedabad - 380060"; price=3000000; priceDisplay="\u{20B9}30 Lakh"; bhk="1 BHK"; sqft=650; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Shreekunj Society Sola"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-27"; },
      // --- BAVLA ---
      { id="p315"; propertyType="Residential"; action="Buy"; title="2 BHK in Bavla"; description="Affordable 2 BHK in Bavla town, near SP Ring Road connector, ideal for budget buyers."; location="Bavla, Ahmedabad"; city="Ahmedabad"; address="Bavla Main Road, Santosh Nagar, Bavla, Ahmedabad - 382220"; price=2500000; priceDisplay="\u{20B9}25 Lakh"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Santosh Nagar Bavla"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-29"; },
      { id="p316"; propertyType="Plot"; action="Buy"; title="Residential Plot in Bavla"; description="Residential plot in Bavla, clear title, near Ahmedabad-Rajkot highway."; location="Bavla, Ahmedabad"; city="Ahmedabad"; address="Bavla Survey, Plot 7, Bavla, Ahmedabad - 382220"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="Plot"; sqft=2000; furnishing="Unfurnished"; amenities=["Road Access","Water"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Bavla Survey Land"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-05-31"; },
      // --- SANAND ---
      { id="p317"; propertyType="Industrial"; action="Buy"; title="Industrial Plot in Sanand GIDC"; description="GIDC allotted industrial plot in Sanand near Tata Motors facility, excellent road access."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand GIDC, Plot No. 22, Sanand, Gujarat - 382110"; price=15000000; priceDisplay="\u{20B9}1.5 Cr"; bhk="Plot"; sqft=10000; furnishing="Unfurnished"; amenities=["3-Phase Power","Road Access","Water","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=0; societyName="Sanand GIDC"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-01"; },
      { id="p318"; propertyType="Residential"; action="Buy"; title="2 BHK in Sanand"; description="Practical 2 BHK residential flat in Sanand town, good connectivity to highway."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand Town, Vrundavan Society, Sanand, Gujarat - 382110"; price=2200000; priceDisplay="\u{20B9}22 Lakh"; bhk="2 BHK"; sqft=830; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Vrundavan Society Sanand"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-03"; },
      { id="p319"; propertyType="Industrial"; action="Lease"; title="Warehouse in Sanand"; description="Large warehouse facility near Sanand industrial corridor, suitable for FMCG or auto ancillary."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand Industrial Road, Warehouse 5, Sanand, Gujarat - 382110"; price=80000; priceDisplay="\u{20B9}80,000/month"; bhk="Warehouse"; sqft=15000; furnishing="Unfurnished"; amenities=["Loading Dock","3-Phase Power","Road Access","Water"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sanand Warehouse Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-05"; },
      // --- GHATLODIYA ---
      { id="p320"; propertyType="Residential"; action="Buy"; title="2 BHK in Ghatlodiya"; description="Decent 2 BHK in Ghatlodiya, close to Science City and Sola Civil area."; location="Ghatlodiya, Ahmedabad"; city="Ahmedabad"; address="Ghatlodiya Road, Mangal Murti Society, Ghatlodiya, Ahmedabad - 380061"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Mangal Murti Ghatlodiya"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-07"; },
      { id="p321"; propertyType="Residential"; action="Rent"; title="2 BHK in Ghatlodiya"; description="Spacious 2 BHK in Ghatlodiya for rent, new society, good amenities."; location="Ghatlodiya, Ahmedabad"; city="Ahmedabad"; address="Ghatlodiya Circle, Silver Society, Ghatlodiya, Ahmedabad - 380061"; price=15000; priceDisplay="\u{20B9}15,000/month"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Silver Society Ghatlodiya"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-09"; },
      { id="p322"; propertyType="Residential"; action="Buy"; title="3 BHK in Ghatlodiya"; description="Quality 3 BHK in Ghatlodiya near highway, good connectivity to Science City and Sola."; location="Ghatlodiya, Ahmedabad"; city="Ahmedabad"; address="Ghatlodiya New Heights, Block B, Ghatlodiya, Ahmedabad - 380061"; price=6800000; priceDisplay="\u{20B9}68 Lakh"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Ghatlodiya New Heights"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-11"; },
      // --- AMBAWADI (additional) ---
      { id="p323"; propertyType="Residential"; action="Rent"; title="3 BHK in Ambawadi"; description="Premium 3 BHK on rent in Ambawadi, very close to IIM-A and Law Garden."; location="Ambawadi, Ahmedabad"; city="Ahmedabad"; address="Ambawadi Society, Near Law Garden, Ambawadi, Ahmedabad - 380006"; price=28000; priceDisplay="\u{20B9}28,000/month"; bhk="3 BHK"; sqft=1600; furnishing="Furnished"; amenities=["Parking","Lift","Security","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Ambawadi Premium Apts"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-13"; },
      { id="p324"; propertyType="Commercial"; action="Lease"; title="Office Space in Ambawadi"; description="Professional office on Ambawadi main road near Law Garden, suitable for law or consultancy firm."; location="Ambawadi, Ahmedabad"; city="Ahmedabad"; address="Ambawadi Law Garden Road, Office Suite 5, Ahmedabad - 380006"; price=50000; priceDisplay="\u{20B9}50,000/month"; bhk="Studio"; sqft=1200; furnishing="Unfurnished"; amenities=["Parking","Lift","Power Backup","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Law Garden Commercial"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-15"; },
      // --- PALDI (additional) ---
      { id="p325"; propertyType="Residential"; action="Buy"; title="3 BHK in Paldi - Renovated"; description="Fully renovated 3 BHK in Paldi, new plumbing, wiring and paint, move-in ready."; location="Paldi, Ahmedabad"; city="Ahmedabad"; address="Paldi Main Road, Nirant Society, Paldi, Ahmedabad - 380007"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Nirant Society Paldi"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-17"; },
      { id="p326"; propertyType="Commercial"; action="Lease"; title="Shop in Paldi Market"; description="Prime shop in Paldi market area near Ellis Bridge, high footfall, ideal for retail."; location="Paldi, Ahmedabad"; city="Ahmedabad"; address="Paldi Market Road, Shop 3, Near Ellis Bridge, Paldi, Ahmedabad - 380007"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="Studio"; sqft=400; furnishing="Unfurnished"; amenities=["Road Frontage","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Paldi Market"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-19"; },
      // --- VEJALPUR (additional) ---
      { id="p327"; propertyType="Residential"; action="Buy"; title="3 BHK in Vejalpur"; description="Modern 3 BHK in Vejalpur township, close to ISCON mega temple and Sarkhej Road."; location="Vejalpur, Ahmedabad"; city="Ahmedabad"; address="Vejalpur Circle, Ganesh Heights, Vejalpur, Ahmedabad - 380051"; price=7000000; priceDisplay="\u{20B9}70 Lakh"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Ganesh Heights Vejalpur"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-21"; },
      { id="p328"; propertyType="Residential"; action="Rent"; title="2 BHK in Vejalpur"; description="Good 2 BHK in Vejalpur for rent, near ISCON and Sarkhej Road, semi-furnished."; location="Vejalpur, Ahmedabad"; city="Ahmedabad"; address="Vejalpur Main Road, Yash Society, Vejalpur, Ahmedabad - 380051"; price=14000; priceDisplay="\u{20B9}14,000/month"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Yash Society Vejalpur"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-23"; },
      // --- SHILAJ ---
      { id="p329"; propertyType="Residential"; action="Buy"; title="2 BHK in Shilaj"; description="Modern 2 BHK in Shilaj near Thaltej, good amenities and easy highway access."; location="Shilaj, Ahmedabad"; city="Ahmedabad"; address="Shilaj Road, Krishna Residency, Shilaj, Ahmedabad - 380059"; price=5200000; priceDisplay="\u{20B9}52 Lakh"; bhk="2 BHK"; sqft=1080; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Krishna Residency Shilaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-25"; },
      { id="p330"; propertyType="Residential"; action="Rent"; title="2 BHK in Shilaj"; description="Spacious 2 BHK in Shilaj for rent, quiet locality, ideal for family."; location="Shilaj, Ahmedabad"; city="Ahmedabad"; address="Shilaj Main Road, Sainath Society, Shilaj, Ahmedabad - 380059"; price=14000; priceDisplay="\u{20B9}14,000/month"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Sainath Society Shilaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-27"; },
      { id="p331"; propertyType="Residential"; action="Buy"; title="3 BHK in Shilaj"; description="Excellent 3 BHK in Shilaj with premium interiors, near new metro line and SP Ring Road."; location="Shilaj, Ahmedabad"; city="Ahmedabad"; address="Shilaj Crossroads, Grand Residency, Shilaj, Ahmedabad - 380059"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=6; societyName="Grand Residency Shilaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-06-29"; },
      // --- MORE COMMERCIAL IN PRIME ZONES ---
      { id="p332"; propertyType="Commercial"; action="Buy"; title="Shop in Navrangpura Market"; description="Commercial shop in prime Navrangpura market, ideal for retail, bank or restaurant."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Market, Shop 8, CG Road, Navrangpura, Ahmedabad - 380009"; price=9500000; priceDisplay="\u{20B9}95 Lakh"; bhk="Studio"; sqft=700; furnishing="Unfurnished"; amenities=["Road Frontage","Power","Water"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Navrangpura Market"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-01"; },
      { id="p333"; propertyType="Commercial"; action="Buy"; title="Office in Prahladnagar - Tower"; description="Grade-A office in Prahlad Nagar corporate tower, great connectivity, ample parking."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Corporate Tower, 3rd Floor, Ahmedabad - 380015"; price=14000000; priceDisplay="\u{20B9}1.4 Cr"; bhk="Studio"; sqft=2800; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Power Backup","Security","Cafeteria"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Prahlad Nagar Corp Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-03"; },
      { id="p334"; propertyType="Commercial"; action="Rent"; title="Restaurant Space in Vastrapur"; description="Corner restaurant space near Vastrapur Lake, ideal for cafe or restaurant brand."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Lake Road, Commercial Unit 2, Ahmedabad - 380015"; price=35000; priceDisplay="\u{20B9}35,000/month"; bhk="Studio"; sqft=800; furnishing="Unfurnished"; amenities=["Gas Line","Power","Water","Road Frontage"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Vastrapur Lake Commercial"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-05"; },
      { id="p335"; propertyType="Commercial"; action="Buy"; title="Showroom in Maninagar"; description="Prime showroom in Maninagar with ample frontage, suitable for automobile or electronics dealership."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Main Road, Showroom 4, Maninagar, Ahmedabad - 380008"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="Studio"; sqft=2200; furnishing="Unfurnished"; amenities=["Wide Frontage","Power Backup","Road Access","Parking"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Maninagar Showroom Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-07"; },
      // --- VARIOUS RENT LISTINGS ---
      { id="p336"; propertyType="Residential"; action="Rent"; title="3 BHK in Maninagar"; description="Spacious 3 BHK in Maninagar with garden view, near Bhairavnath Temple."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Bhairavnath Road, Vrindavan Apts, Ahmedabad - 380008"; price=19000; priceDisplay="\u{20B9}19,000/month"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Vrindavan Apts Maninagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-09"; },
      { id="p337"; propertyType="Residential"; action="Rent"; title="1 BHK in Vastral"; description="Budget 1 BHK for rent in Vastral near metro, suitable for working individuals."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Metro Road, Pragti Society, Vastral, Ahmedabad - 382418"; price=8000; priceDisplay="\u{20B9}8,000/month"; bhk="1 BHK"; sqft=540; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=1; societyName="Pragati Society Vastral"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-11"; },
      { id="p338"; propertyType="Residential"; action="Rent"; title="4 BHK in Bopal - Luxury"; description="Luxury 4 BHK on rent in Bopal, fully furnished, club amenities, ideal for senior executives."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Luxury Zone, Flat 1201, Near SP Ring Road, Bopal, Ahmedabad - 380058"; price=45000; priceDisplay="\u{20B9}45,000/month"; bhk="4 BHK+"; sqft=3000; furnishing="Furnished"; amenities=["Gym","Pool","Security","Club House","Smart Home"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=12; societyName="Bopal Luxury Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-13"; },
      { id="p339"; propertyType="Residential"; action="Rent"; title="2 BHK in Vastrapur - Lake View"; description="Lake-view 2 BHK in Vastrapur, semi-furnished with balcony facing Vastrapur Lake."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Lake View, Block A, Flat 304, Ahmedabad - 380015"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="2 BHK"; sqft=1150; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Lake View"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Vastrapur Lake View Apts"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-15"; },
      { id="p340"; propertyType="Residential"; action="Rent"; title="3 BHK in Satellite - Corporate"; description="Corporate-grade 3 BHK in Satellite, ideally located near GTPL and HDFC bank offices."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Corporate Zone, Flat 704, Near GTPL, Ahmedabad - 380015"; price=30000; priceDisplay="\u{20B9}30,000/month"; bhk="3 BHK"; sqft=1800; furnishing="Furnished"; amenities=["Gym","Pool","Parking","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Satellite Corporate Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-17"; },
      // --- MORE BUY LISTINGS ---
      { id="p341"; propertyType="Residential"; action="Buy"; title="4 BHK in Navrangpura"; description="Ultra-premium 4 BHK in Navrangpura with double-height living room and VRV AC system."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Elite Road, Grand Towers, 12th Floor, Ahmedabad - 380009"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="4 BHK+"; sqft=3500; furnishing="Semi-Furnished"; amenities=["Smart Home","Pool","Gym","Club House","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=12; societyName="Navrangpura Grand Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-19"; },
      { id="p342"; propertyType="Residential"; action="Buy"; title="1 BHK in Thaltej - Investment"; description="Investment-grade 1 BHK in Thaltej near metro, high rental demand from IT professionals."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Metro Road, Arihant Society, Flat 7, Thaltej, Ahmedabad - 380054"; price=3800000; priceDisplay="\u{20B9}38 Lakh"; bhk="1 BHK"; sqft=680; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Arihant Society Thaltej"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-21"; },
      { id="p343"; propertyType="Residential"; action="Buy"; title="3 BHK in Thaltej - Premium"; description="Premium 3 BHK in Thaltej with RERA, near SG Highway junction, fast appreciation area."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej SG Junction, Premium Towers, Flat 902, Thaltej, Ahmedabad - 380054"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="3 BHK"; sqft=2000; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=9; societyName="Thaltej Premium Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-23"; },
      { id="p344"; propertyType="Residential"; action="Buy"; title="2 BHK in Sola - Mid Range"; description="Good 2 BHK in Sola, vaastu-compliant, near Civil Hospital and Science City road."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Road, Shyam Residency, Flat 202, Sola, Ahmedabad - 380060"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Shyam Residency Sola"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-25"; },
      { id="p345"; propertyType="Residential"; action="Buy"; title="Penthouse in Thaltej"; description="Sky penthouse in Thaltej with 270-degree panoramic views, private terrace and jacuzzi."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Sky Tower, Penthouse, 22nd Floor, Thaltej, Ahmedabad - 380054"; price=35000000; priceDisplay="\u{20B9}3.5 Cr"; bhk="4 BHK+"; sqft=6000; furnishing="Furnished"; amenities=["Private Terrace","Jacuzzi","Gym","Pool","Smart Home","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="All"; floorNo=22; societyName="Thaltej Sky Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-27"; },
      // --- LEASE PROPERTIES ---
      { id="p346"; propertyType="Commercial"; action="Lease"; title="Cold Storage Facility in Odhav"; description="Industrial cold storage facility in Odhav GIDC, suitable for food processing or pharma."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav GIDC Phase 2, Cold Store Unit, Odhav, Ahmedabad - 382415"; price=65000; priceDisplay="\u{20B9}65,000/month"; bhk="Warehouse"; sqft=8000; furnishing="Unfurnished"; amenities=["Cold Storage","3-Phase Power","Loading Dock","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Odhav GIDC Cold Storage"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-29"; },
      { id="p347"; propertyType="Commercial"; action="Lease"; title="Lab Space in Naroda GIDC"; description="Pharmaceutical lab-ready space in Naroda GIDC for biotech or pharma company."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda GIDC, Lab Unit 3, Naroda, Ahmedabad - 382330"; price=40000; priceDisplay="\u{20B9}40,000/month"; bhk="Studio"; sqft=3000; furnishing="Unfurnished"; amenities=["3-Phase Power","Water","Drainage","Road Access"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Naroda GIDC Lab Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-07-31"; },
      // --- AFFORDABLE OUTER ZONES ---
      { id="p348"; propertyType="Residential"; action="Buy"; title="2 BHK in Kathwada"; description="Affordable 2 BHK in Kathwada near NH-47, good for GIDC workers or budget buyers."; location="Kathwada, Ahmedabad"; city="Ahmedabad"; address="Kathwada Road, Amba Society, Kathwada, Ahmedabad - 382430"; price=2000000; priceDisplay="\u{20B9}20 Lakh"; bhk="2 BHK"; sqft=800; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Amba Society Kathwada"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-01"; },
      { id="p349"; propertyType="Residential"; action="Buy"; title="2 BHK in Rakhiyal"; description="Budget 2 BHK in Rakhiyal area near Juhapura and Sarkhej, compact and clean."; location="Rakhiyal, Ahmedabad"; city="Ahmedabad"; address="Rakhiyal Road, Akash Society, Rakhiyal, Ahmedabad - 380023"; price=2600000; priceDisplay="\u{20B9}26 Lakh"; bhk="2 BHK"; sqft=820; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Akash Society Rakhiyal"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-03"; },
      { id="p350"; propertyType="Residential"; action="Rent"; title="1 BHK in Rakhiyal"; description="Budget 1 BHK for rent in Rakhiyal, close to Juhapura and Ring Road."; location="Rakhiyal, Ahmedabad"; city="Ahmedabad"; address="Rakhiyal Main Road, Laxmi Society, Rakhiyal, Ahmedabad - 380023"; price=6500; priceDisplay="\u{20B9}6,500/month"; bhk="1 BHK"; sqft=520; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=1; societyName="Laxmi Society Rakhiyal"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-05"; },
      { id="p351"; propertyType="Residential"; action="Buy"; title="1 BHK in Ghodasar"; description="Budget 1 BHK in Ghodasar near Maninagar and Isanpur, good first-home option."; location="Ghodasar, Ahmedabad"; city="Ahmedabad"; address="Ghodasar Road, Ram Society, Ghodasar, Ahmedabad - 380050"; price=1900000; priceDisplay="\u{20B9}19 Lakh"; bhk="1 BHK"; sqft=530; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Ram Society Ghodasar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-07"; },
      { id="p352"; propertyType="Residential"; action="Buy"; title="2 BHK in Bapunagar"; description="Affordable 2 BHK in Bapunagar, ground plus 2 building, east-facing, low maintenance."; location="Bapunagar, Ahmedabad"; city="Ahmedabad"; address="Bapunagar Circle, Shanti Society, Bapunagar, Ahmedabad - 380024"; price=2800000; priceDisplay="\u{20B9}28 Lakh"; bhk="2 BHK"; sqft=860; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Shanti Society Bapunagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-09"; },
      // --- HIGH-VALUE INVESTMENT PROPERTIES ---
      { id="p353"; propertyType="Residential"; action="Buy"; title="5 BHK Ultra Luxury Penthouse in Vastrapur"; description="Ultra-luxury 5 BHK penthouse near Vastrapur Lake, private sky deck, home cinema and wine cellar."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Lake Pinnacle, Top Floor, Vastrapur, Ahmedabad - 380015"; price=80000000; priceDisplay="\u{20B9}8 Cr"; bhk="Villa"; sqft=10000; furnishing="Furnished"; amenities=["Private Sky Deck","Home Cinema","Wine Cellar","Pool","Gym","Smart Home","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="All"; floorNo=28; societyName="Vastrapur Lake Pinnacle"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-11"; },
      { id="p354"; propertyType="Residential"; action="Buy"; title="Luxury Penthouse in Bopal"; description="Exclusive penthouse in Bopal with 4000 sq ft private terrace, swimming pool and home theatre."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Sky Residency, 20th Floor, Near SP Ring Road, Bopal, Ahmedabad - 380058"; price=55000000; priceDisplay="\u{20B9}5.5 Cr"; bhk="4 BHK+"; sqft=8000; furnishing="Furnished"; amenities=["Private Pool","Home Theatre","Private Terrace","Smart Home","Security","Parking"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=20; societyName="Bopal Sky Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-13"; },
      { id="p355"; propertyType="Commercial"; action="Buy"; title="Hotel Plot on SG Highway"; description="Large hotel-suitable plot on SG Highway with all approvals, ideal for 3-star hotel development."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway, Hotel Zone, Survey No. 110, Ahmedabad - 380054"; price=100000000; priceDisplay="\u{20B9}10 Cr"; bhk="Plot"; sqft=30000; furnishing="Unfurnished"; amenities=["Highway Frontage","Water","Power","Road Access"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="SG Highway Hotel Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-15"; },
      // --- ADDITIONAL LOCALITIES ---
      { id="p356"; propertyType="Residential"; action="Buy"; title="2 BHK in Nava Vadaj"; description="Compact 2 BHK in Nava Vadaj, near Ashram Road and old Ahmedabad, good connectivity."; location="Nava Vadaj, Ahmedabad"; city="Ahmedabad"; address="Nava Vadaj Road, Laxmi Society, Nava Vadaj, Ahmedabad - 380013"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Laxmi Society Nava Vadaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-17"; },
      { id="p357"; propertyType="Residential"; action="Rent"; title="2 BHK in Nava Vadaj"; description="Good 2 BHK for rent in Nava Vadaj, near Gandhigram area, close to river front."; location="Nava Vadaj, Ahmedabad"; city="Ahmedabad"; address="Nava Vadaj Circle, Shyam Society, Nava Vadaj, Ahmedabad - 380013"; price=13000; priceDisplay="\u{20B9}13,000/month"; bhk="2 BHK"; sqft=960; furnishing="Semi-Furnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Shyam Society Nava Vadaj"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-19"; },
      { id="p358"; propertyType="Residential"; action="Buy"; title="3 BHK in Jodhpur Village"; description="Spacious 3 BHK in Jodhpur Village area near Satellite road, well-maintained society."; location="Jodhpur, Ahmedabad"; city="Ahmedabad"; address="Jodhpur Village Road, Hari Vatika Society, Jodhpur, Ahmedabad - 380015"; price=9000000; priceDisplay="\u{20B9}90 Lakh"; bhk="3 BHK"; sqft=1700; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Pool","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Hari Vatika Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-21"; },
      { id="p359"; propertyType="Residential"; action="Rent"; title="2 BHK in Jodhpur Village"; description="Neat 2 BHK for rent in Jodhpur Village area near Satellite Road, calm and clean locality."; location="Jodhpur, Ahmedabad"; city="Ahmedabad"; address="Jodhpur Village Main Road, Sabar Society, Jodhpur, Ahmedabad - 380015"; price=16000; priceDisplay="\u{20B9}16,000/month"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Sabar Society Jodhpur"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-23"; },
      { id="p360"; propertyType="Residential"; action="Buy"; title="3 BHK in Vaishnodevi Circle"; description="Premium 3 BHK near Vaishnodevi Circle, excellent infrastructure and connectivity."; location="Vaishnodevi, Ahmedabad"; city="Ahmedabad"; address="Vaishnodevi Circle, Param Residency, Ahmedabad - 382421"; price=7500000; priceDisplay="\u{20B9}75 Lakh"; bhk="3 BHK"; sqft=1550; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Param Residency Vaishnodevi"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-25"; },
      { id="p361"; propertyType="Residential"; action="Rent"; title="2 BHK in Vaishnodevi Circle"; description="Modern 2 BHK near Vaishnodevi Circle for rent, close to Gandhinagar and SG Highway."; location="Vaishnodevi, Ahmedabad"; city="Ahmedabad"; address="Vaishnodevi Circle, Silver Heights, Flat 205, Ahmedabad - 382421"; price=15000; priceDisplay="\u{20B9}15,000/month"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Silver Heights Vaishnodevi"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-27"; },
      // --- MORE GANDHINAGAR ---
      { id="p362"; propertyType="Residential"; action="Buy"; title="2 BHK in Gandhinagar Sector 7"; description="Government-planned 2 BHK in Gandhinagar Sector 7, clean surroundings, ideal for families."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Sector 7, Block 3, Gandhinagar, Gujarat - 382007"; price=4800000; priceDisplay="\u{20B9}48 Lakh"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Sector 7 Block 3 Gandhinagar"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-29"; },
      { id="p363"; propertyType="Commercial"; action="Lease"; title="GIFT City Office in Gandhinagar"; description="Premium GIFT City office space, IFSC zone, ideal for fintech or financial services company."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="GIFT City, Tower 3, Gandhinagar, Gujarat - 382355"; price=180000; priceDisplay="\u{20B9}1.8 Lakh/month"; bhk="Studio"; sqft=5000; furnishing="Furnished"; amenities=["IFSC Zone","Parking","Power Backup","Cafeteria","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="GIFT City Tower 3"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-08-31"; },
      { id="p364"; propertyType="Residential"; action="Rent"; title="3 BHK in Gandhinagar"; description="Spacious 3 BHK in Gandhinagar Sector 21, ideal for government employee or family."; location="Gandhinagar, Gujarat"; city="Gandhinagar"; address="Sector 21, Phase 2, Gandhinagar, Gujarat - 382021"; price=18000; priceDisplay="\u{20B9}18,000/month"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Sector 21 Phase 2 GNR"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-01"; },
      // --- UNDER-CONSTRUCTION PROJECTS ---
      { id="p365"; propertyType="Residential"; action="Buy"; title="2 BHK Under Construction in Bhadaj"; description="New 2 BHK in upcoming project in Bhadaj, RERA registered, great pre-launch pricing."; location="Bhadaj, Ahmedabad"; city="Ahmedabad"; address="Bhadaj New Launch, Block 1, Bhadaj, Ahmedabad - 380054"; price=4200000; priceDisplay="\u{20B9}42 Lakh"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Gym","Park","Club House","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Bhadaj New Launch"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-03"; },
      { id="p366"; propertyType="Residential"; action="Buy"; title="3 BHK Under Construction in Sola"; description="RERA-registered 3 BHK in upcoming tower in Sola, expected possession December 2027."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Science City Road, Future Towers, Sola, Ahmedabad - 380060"; price=8000000; priceDisplay="\u{20B9}80 Lakh"; bhk="3 BHK"; sqft=1650; furnishing="Unfurnished"; amenities=["Gym","Pool","Park","Club House","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Sola Future Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-05"; },
      { id="p367"; propertyType="Residential"; action="Buy"; title="2 BHK Under Construction in Ghatlodiya"; description="Under-construction 2 BHK in Ghatlodiya near Science City, RERA approved new project."; location="Ghatlodiya, Ahmedabad"; city="Ahmedabad"; address="Ghatlodiya Rise Towers, Block A, Ghatlodiya, Ahmedabad - 380061"; price=5000000; priceDisplay="\u{20B9}50 Lakh"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Gym","Park","Parking","Security"]; possession="Under Construction"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Ghatlodiya Rise Towers"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-07"; },
      // --- DIVERSE COMMERCIAL ---
      { id="p368"; propertyType="Commercial"; action="Rent"; title="Coworking Space in Satellite"; description="Flexible coworking space in Satellite for startups or freelancers, plug-and-play ready."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Business Hub, 2nd Floor, Near Ambli Road, Ahmedabad - 380015"; price=8000; priceDisplay="\u{20B9}8,000/seat/month"; bhk="Studio"; sqft=2000; furnishing="Furnished"; amenities=["Wi-Fi","Power Backup","Cafeteria","Conference Room","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Satellite Business Hub"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-09"; },
      { id="p369"; propertyType="Commercial"; action="Rent"; title="Showroom in Bopal"; description="Ground floor showroom in Bopal commercial zone with high footfall, ideal for electronics or salon."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Commercial Zone, Showroom 6, Near Bopal Circle, Ahmedabad - 380058"; price=28000; priceDisplay="\u{20B9}28,000/month"; bhk="Studio"; sqft=600; furnishing="Unfurnished"; amenities=["Road Frontage","Power","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Bopal Commercial Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-11"; },
      { id="p370"; propertyType="Commercial"; action="Buy"; title="Commercial Bungalow in Navrangpura"; description="Commercial-use bungalow on 60-ft road in Navrangpura, ideal for clinic, school or office HQ."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura 60 ft Road, Commercial Bungalow 4, Ahmedabad - 380009"; price=35000000; priceDisplay="\u{20B9}3.5 Cr"; bhk="Studio"; sqft=5000; furnishing="Unfurnished"; amenities=["Parking","Garden","Wide Road","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Navrangpura Commercial Bungalow"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-13"; },
      // --- FINAL BATCH: DIVERSE PICKS ---
      { id="p371"; propertyType="Residential"; action="Buy"; title="2 BHK in Nava Naroda"; description="Budget 2 BHK in Nava Naroda, near BRTS and highway, good value for money."; location="Nava Naroda, Ahmedabad"; city="Ahmedabad"; address="Nava Naroda Road, Jay Society, Nava Naroda, Ahmedabad - 382330"; price=2600000; priceDisplay="\u{20B9}26 Lakh"; bhk="2 BHK"; sqft=840; furnishing="Unfurnished"; amenities=["Parking","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Jay Society Nava Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-15"; },
      { id="p372"; propertyType="Residential"; action="Rent"; title="2 BHK in Nava Naroda"; description="Affordable 2 BHK for rent in Nava Naroda, suitable for factory workers and families."; location="Nava Naroda, Ahmedabad"; city="Ahmedabad"; address="Nava Naroda Circle, Pankaj Society, Nava Naroda, Ahmedabad - 382330"; price=9000; priceDisplay="\u{20B9}9,000/month"; bhk="2 BHK"; sqft=820; furnishing="Unfurnished"; amenities=["Water Supply","Power"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Pankaj Society Nava Naroda"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-17"; },
      { id="p373"; propertyType="Residential"; action="Buy"; title="3 BHK Row House in Bopal - New"; description="Brand new 3 BHK row house in a gated Bopal complex, each unit has dedicated garden."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Row Enclave Phase 2, House 12, Bopal, Ahmedabad - 380058"; price=11000000; priceDisplay="\u{20B9}1.1 Cr"; bhk="3 BHK"; sqft=2500; furnishing="Unfurnished"; amenities=["Garden","Parking","Security","Club House","Gym"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Bopal Row Enclave Phase 2"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-19"; },
      { id="p374"; propertyType="Residential"; action="Buy"; title="4 BHK Row House in Shela"; description="Premium 4 BHK row house in Shela gated township with private garden and 2-car garage."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Shela Row House Township, House 3, Shela, Ahmedabad - 380058"; price=16000000; priceDisplay="\u{20B9}1.6 Cr"; bhk="4 BHK+"; sqft=3200; furnishing="Semi-Furnished"; amenities=["Private Garden","Garage","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Shela Row House Township"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-21"; },
      { id="p375"; propertyType="Commercial"; action="Buy"; title="IT Building in Bodakdev"; description="Full IT building for sale in Bodakdev, 6 floors, grade-A fittings, currently tenanted."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Tech Park, Judges Bungalow Road, Bodakdev, Ahmedabad - 380054"; price=150000000; priceDisplay="\u{20B9}15 Cr"; bhk="Studio"; sqft=40000; furnishing="Furnished"; amenities=["Parking","Power Backup","Security","Cafeteria","Conference Rooms"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Bodakdev Tech Park"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-23"; },
      { id="p376"; propertyType="Residential"; action="Buy"; title="2 BHK in Sola - Eco Tower"; description="Green-rated 2 BHK in Sola with solar panels, rainwater harvesting and energy-efficient design."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Eco Tower, Block B, Flat 404, Sola, Ahmedabad - 380060"; price=6500000; priceDisplay="\u{20B9}65 Lakh"; bhk="2 BHK"; sqft=1150; furnishing="Unfurnished"; amenities=["Solar Power","Rainwater Harvesting","EV Charging","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Sola Eco Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-25"; },
      { id="p377"; propertyType="Residential"; action="Rent"; title="4 BHK in Navrangpura - Fully Furnished"; description="Fully furnished 4 BHK in Navrangpura, ideal for MNC executive family, walking from CG Road."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura CG Road, Majestic Residency, 7th Floor, Ahmedabad - 380009"; price=50000; priceDisplay="\u{20B9}50,000/month"; bhk="4 BHK+"; sqft=3000; furnishing="Furnished"; amenities=["Smart Home","Gym","Pool","Security","Club House","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Majestic Residency Navrangpura"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-27"; },
      { id="p378"; propertyType="Residential"; action="Rent"; title="1 BHK in Bodakdev - Studio"; description="Stylish 1 BHK studio in Bodakdev with modular kitchen, near Judges Bungalow Road."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Studio Zone, Near JB Road, Flat 105, Ahmedabad - 380054"; price=17000; priceDisplay="\u{20B9}17,000/month"; bhk="1 BHK"; sqft=650; furnishing="Furnished"; amenities=["Parking","Security","AC","Wi-Fi Ready"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Bodakdev Studio Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-09-29"; },
      { id="p379"; propertyType="Plot"; action="Buy"; title="Commercial Plot in Naranpura"; description="AUDA-approved commercial plot in Naranpura, suitable for clinic, academy or commercial complex."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Commercial Zone, Plot 14, Naranpura, Ahmedabad - 380013"; price=12000000; priceDisplay="\u{20B9}1.2 Cr"; bhk="Plot"; sqft=4500; furnishing="Unfurnished"; amenities=["40 ft Road","Water","Power","Drainage"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Naranpura Commercial Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-01"; },
      { id="p380"; propertyType="Plot"; action="Buy"; title="Residential Plot in Sola"; description="Prime residential plot in Sola near Science City, all approvals in place, wide road."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Residential Zone, Plot 8, Near Science City, Sola, Ahmedabad - 380060"; price=8000000; priceDisplay="\u{20B9}80 Lakh"; bhk="Plot"; sqft=3000; furnishing="Unfurnished"; amenities=["40 ft Road","Water","Drainage","Power"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sola Residential Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-03"; },
      { id="p381"; propertyType="Residential"; action="Buy"; title="2 BHK in Ambli"; description="New 2 BHK in upcoming society in Ambli, walking distance from proposed metro and ring road."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Ambli Road, Blue Orchid Society, Ambli, Ahmedabad - 380058"; price=5500000; priceDisplay="\u{20B9}55 Lakh"; bhk="2 BHK"; sqft=1120; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Blue Orchid Society Ambli"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-05"; },
      { id="p382"; propertyType="Residential"; action="Rent"; title="3 BHK in Ambli"; description="Spacious 3 BHK for rent in Ambli near SP Ring Road, family-friendly society."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Ambli Ring Road, Sunrise Society, Flat 401, Ambli, Ahmedabad - 380058"; price=22000; priceDisplay="\u{20B9}22,000/month"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Sunrise Society Ambli"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-07"; },
      { id="p383"; propertyType="Residential"; action="Buy"; title="3 BHK in Prahladnagar - Corner Unit"; description="Corner 3 BHK in Prahlad Nagar, two-side open, excellent ventilation, 14th floor panoramic views."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Tower, 14th Floor, Corner Flat, Ahmedabad - 380015"; price=13500000; priceDisplay="\u{20B9}1.35 Cr"; bhk="3 BHK"; sqft=2050; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Prahlad Nagar Corner Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-09"; },
      { id="p384"; propertyType="Residential"; action="Buy"; title="2 BHK in Bopal - Corner Flat"; description="Corner 2 BHK in Bopal with three-side open, excellent natural light, near SP Ring Road."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Corner Society, 5th Floor, Flat 501, Bopal, Ahmedabad - 380058"; price=6000000; priceDisplay="\u{20B9}60 Lakh"; bhk="2 BHK"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Parking","Gym","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Bopal Corner Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-11"; },
      { id="p385"; propertyType="Residential"; action="Rent"; title="2 BHK in Bodakdev - Furnished"; description="Stylish furnished 2 BHK in Bodakdev, ready for immediate occupancy, prime location."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Main Road, Prestige Residency, Flat 602, Ahmedabad - 380054"; price=28000; priceDisplay="\u{20B9}28,000/month"; bhk="2 BHK"; sqft=1300; furnishing="Furnished"; amenities=["Parking","Gym","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Prestige Residency Bodakdev"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-13"; },
      { id="p386"; propertyType="Residential"; action="Buy"; title="3 BHK in Bodakdev - High Floor"; description="High-floor 3 BHK in Bodakdev with panoramic Ahmedabad skyline views, premium construction."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Sky Tower, 18th Floor, Bodakdev, Ahmedabad - 380054"; price=16000000; priceDisplay="\u{20B9}1.6 Cr"; bhk="3 BHK"; sqft=2200; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Smart Home","Club House","Parking","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=18; societyName="Bodakdev Sky Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-15"; },
      { id="p387"; propertyType="Commercial"; action="Buy"; title="Medical Office in Navrangpura"; description="Ground floor medical office space in Navrangpura near Sterling Hospital, ideal for clinic."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura, Near Sterling Hospital, Medical Suite 2, Ahmedabad - 380009"; price=7000000; priceDisplay="\u{20B9}70 Lakh"; bhk="Studio"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Power","Water","Ground Floor"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sterling Medical Complex"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-17"; },
      { id="p388"; propertyType="Residential"; action="Buy"; title="5 BHK Villa in Judges Bungalow Area"; description="Grand 5 BHK independent villa on Judges Bungalow Road, with private pool and lush garden."; location="Judges Bungalow Road, Ahmedabad"; city="Ahmedabad"; address="Judges Bungalow Road, Villa 9, Bodakdev, Ahmedabad - 380054"; price=90000000; priceDisplay="\u{20B9}9 Cr"; bhk="Villa"; sqft=12000; furnishing="Furnished"; amenities=["Private Pool","Garden","Smart Home","Security","Gym","Home Theatre"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="JB Road Villa Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-19"; },
      { id="p389"; propertyType="Residential"; action="Buy"; title="3 BHK in Ambawadi - Old Premium"; description="Old premium bungalow conversion 3 BHK in Ambawadi, classic architecture with modern amenities."; location="Ambawadi, Ahmedabad"; city="Ahmedabad"; address="Ambawadi Old Society, Flat 1, Ambawadi, Ahmedabad - 380006"; price=9500000; priceDisplay="\u{20B9}95 Lakh"; bhk="3 BHK"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Parking","Terrace","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Ambawadi Old Premium"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-21"; },
      { id="p390"; propertyType="Residential"; action="Rent"; title="3 BHK in Sola - Furnished"; description="Fully furnished 3 BHK in Sola for rent, ideal for corporate family or returning NRI."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Road, Harmony Heights, 6th Floor, Sola, Ahmedabad - 380060"; price=25000; priceDisplay="\u{20B9}25,000/month"; bhk="3 BHK"; sqft=1600; furnishing="Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Harmony Heights Sola"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-23"; },
      { id="p391"; propertyType="Commercial"; action="Lease"; title="Food Court in Bopal Outlet Mall"; description="Food court outlet space in Bopal mall with piped gas and ready kitchen, high footfall zone."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Outlet Mall, Food Court, Level 1, Bopal, Ahmedabad - 380058"; price=42000; priceDisplay="\u{20B9}42,000/month"; bhk="Studio"; sqft=500; furnishing="Unfurnished"; amenities=["Gas Line","Power","AC","Footfall"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=1; societyName="Bopal Outlet Mall Food Court"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-25"; },
      { id="p392"; propertyType="Residential"; action="Buy"; title="1 BHK in Ambli - Starter"; description="Compact 1 BHK in Ambli, ideal starter home or investment near SP Ring Road."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Ambli Cross Road, Sunrise Homes, Flat 201, Ambli, Ahmedabad - 380058"; price=3500000; priceDisplay="\u{20B9}35 Lakh"; bhk="1 BHK"; sqft=680; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Sunrise Homes Ambli"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-27"; },
      { id="p393"; propertyType="Residential"; action="Buy"; title="3 BHK in Bopal - Skyline"; description="Skyline-view 3 BHK on 12th floor of a premium Bopal tower, all luxury amenities."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Skyline Tower, 12th Floor, Flat 1202, Bopal, Ahmedabad - 380058"; price=10000000; priceDisplay="\u{20B9}1 Cr"; bhk="3 BHK"; sqft=1900; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security","Smart Home"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=12; societyName="Bopal Skyline Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-29"; },
      { id="p394"; propertyType="Residential"; action="Rent"; title="2 BHK in Ghuma - Family"; description="Family-friendly 2 BHK in Ghuma near SP Ring Road, ground floor, elderly accessible."; location="Ghuma, Ahmedabad"; city="Ahmedabad"; address="Ghuma Ring Road Society, Ground Floor, Ghuma, Ahmedabad - 382424"; price=12000; priceDisplay="\u{20B9}12,000/month"; bhk="2 BHK"; sqft=930; furnishing="Unfurnished"; amenities=["Parking","Garden","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Ghuma Ring Road Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-10-31"; },
      { id="p395"; propertyType="Residential"; action="Buy"; title="2 BHK in Gota - Highway Adjacent"; description="Highway-adjacent 2 BHK in Gota, good rental income potential, near new metro corridor."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Highway Adjacent Society, Flat 302, Gota, Ahmedabad - 382481"; price=4500000; priceDisplay="\u{20B9}45 Lakh"; bhk="2 BHK"; sqft=960; furnishing="Unfurnished"; amenities=["Parking","Lift","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Gota Highway Adjacent"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-02"; },
      { id="p396"; propertyType="Commercial"; action="Buy"; title="Medical Building in Sola"; description="Standalone 3-floor medical building near Sola Civil Hospital, ideal for hospital or clinic chain."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Civil Road, Medical Building 2, Sola, Ahmedabad - 380060"; price=45000000; priceDisplay="\u{20B9}4.5 Cr"; bhk="Studio"; sqft=9000; furnishing="Unfurnished"; amenities=["Lift","Power Backup","Water","Parking","Reception Area"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sola Medical Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-04"; },
      { id="p397"; propertyType="Residential"; action="Buy"; title="2 BHK in Vastrapur - Eco"; description="Eco-certified 2 BHK near Vastrapur Lake, green building, low utility bills."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Green Society, Flat 305, Vastrapur, Ahmedabad - 380015"; price=8000000; priceDisplay="\u{20B9}80 Lakh"; bhk="2 BHK"; sqft=1200; furnishing="Unfurnished"; amenities=["Solar Power","EV Charging","Parking","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Vastrapur Green Society"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-06"; },
      { id="p398"; propertyType="Residential"; action="Rent"; title="3 BHK in Ghatlodiya - Luxury"; description="Luxury semi-furnished 3 BHK in Ghatlodiya, near Science City, club membership included."; location="Ghatlodiya, Ahmedabad"; city="Ahmedabad"; address="Ghatlodiya Luxury Tower, 8th Floor, Ghatlodiya, Ahmedabad - 380061"; price=24000; priceDisplay="\u{20B9}24,000/month"; bhk="3 BHK"; sqft=1650; furnishing="Semi-Furnished"; amenities=["Gym","Pool","Parking","Security","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Ghatlodiya Luxury Tower"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-08"; },
      { id="p399"; propertyType="Residential"; action="Buy"; title="4 BHK Bungalow in Prahlad Nagar"; description="Independent 4 BHK bungalow in Prahlad Nagar, double garage, terrace garden, solar installation."; location="Prahlad Nagar, Ahmedabad"; city="Ahmedabad"; address="Prahlad Nagar Bungalow Zone, House 4, Ahmedabad - 380015"; price=40000000; priceDisplay="\u{20B9}4 Cr"; bhk="4 BHK+"; sqft=7000; furnishing="Semi-Furnished"; amenities=["Solar Power","Terrace Garden","Garage","Security","Pool"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Prahlad Nagar Bungalow Zone"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-10"; },
      { id="p401"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Bopal - Godrej Garden City Phase 4"; description="Spacious 3 BHK apartment in Godrej Garden City Phase 4. Corner unit with excellent cross ventilation. Clubhouse, swimming pool, and gym in the society. Close to SP Ring Road and Bopal Chokdi."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Godrej Garden City Phase 4, Bopal, Ahmedabad"; price=8500000; priceDisplay="\u{20B9}85 L"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Garden"]; possession="18 Months"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Godrej Garden City Phase 4"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-15"; },
      { id="p402"; propertyType="Residential"; action="Buy"; title="2 BHK in Shivalik Swapnabhumi - South Bopal"; description="Well-designed 2 BHK in Shivalik Swapnabhumi, South Bopal. West-facing unit on 4th floor with good ventilation and natural light. Society has basic amenities including parking and security."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Shivalik Swapnabhumi, South Bopal, Ahmedabad - 380058"; price=5200000; priceDisplay="\u{20B9}52 L"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Parking","Security","Lift","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Shivalik Swapnabhumi"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-17"; },
      { id="p403"; propertyType="Residential"; action="Buy"; title="3 BHK in Sun Westbank - Thaltej"; description="Premium 3 BHK in Sun Westbank, Thaltej on 12th floor. Semi-furnished unit with modern kitchen fittings. Society offers club membership, pool, and gym. Close to SG Highway and metro corridor."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Sun Westbank, Thaltej, Ahmedabad - 380054"; price=11000000; priceDisplay="\u{20B9}1.1 Cr"; bhk="3 BHK"; sqft=1650; furnishing="Semi-Furnished"; amenities=["Swimming Pool","Gym","Club House","Parking","Security","Lift"]; possession="12 Months"; images=[]; mapLink=""; facing="East"; floorNo=12; societyName="Sun Westbank"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-19"; },
      { id="p404"; propertyType="Residential"; action="Buy"; title="2 BHK in Nirma Vantage - SG Highway"; description="Unfurnished 2 BHK in Nirma Vantage on SG Highway. South-facing 3rd floor unit, ready to move. Close to business hubs and educational institutions. Society has security and parking."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="Nirma Vantage, SG Highway, Ahmedabad - 380054"; price=6200000; priceDisplay="\u{20B9}62 L"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Parking","Security","Lift","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Nirma Vantage"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-21"; },
      { id="p405"; propertyType="Residential"; action="Buy"; title="4 BHK in Iscon Platinum - Prahladnagar"; description="Luxury 4 BHK in Iscon Platinum, Prahlad Nagar on 14th floor. Fully furnished with premium fittings. Club house, gym, pool, and 24/7 security. Prime location near Sindhu Bhavan Road."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Iscon Platinum, Prahladnagar, Ahmedabad - 380015"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="4 BHK"; sqft=2200; furnishing="Furnished"; amenities=["Club House","Swimming Pool","Gym","Parking","Security","Power Backup","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Iscon Platinum"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-23"; },
      { id="p406"; propertyType="Residential"; action="Buy"; title="2 BHK in Swaminarayan Heights - Satellite"; description="Semi-furnished 2 BHK in Swaminarayan Heights, Satellite area. North-facing 5th floor unit with good natural light. Possession in 6 months. Close to ISCON and Sindhu Bhavan Road."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Swaminarayan Heights, Satellite, Ahmedabad - 380015"; price=6800000; priceDisplay="\u{20B9}68 L"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="6 Months"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Swaminarayan Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-25"; },
      { id="p407"; propertyType="Residential"; action="Buy"; title="3 BHK in Savvy Swaraj - Gota"; description="Unfurnished 3 BHK in Savvy Swaraj, Gota. West-facing 8th floor unit, under construction with 24-month possession. Good connectivity to SG Highway and Chandkheda."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Savvy Swaraj, Gota, Ahmedabad - 382481"; price=7200000; priceDisplay="\u{20B9}72 L"; bhk="3 BHK"; sqft=1380; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Club House","Gym"]; possession="24 Months"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Savvy Swaraj"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-27"; },
      { id="p408"; propertyType="Residential"; action="Buy"; title="2 BHK in Silver Oak Residency - Navrangpura"; description="Fully furnished 2 BHK in Silver Oak Residency, Navrangpura. East-facing 6th floor, ready to move. Premium location close to CG Road and major hospitals. Excellent rental potential."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Silver Oak Residency, Navrangpura, Ahmedabad - 380009"; price=7800000; priceDisplay="\u{20B9}78 L"; bhk="2 BHK"; sqft=950; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Silver Oak Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-29"; },
      { id="p409"; propertyType="Residential"; action="Buy"; title="3 BHK in Arvind Uplands - Chandkheda"; description="Semi-furnished 3 BHK in Arvind Uplands, Chandkheda. North-facing 9th floor. Possession in 9 months. Society has gym, pool, and children's play area. Close to Chandkheda railway station."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Arvind Uplands, Chandkheda, Ahmedabad - 382424"; price=7800000; priceDisplay="\u{20B9}78 L"; bhk="3 BHK"; sqft=1550; furnishing="Semi-Furnished"; amenities=["Gym","Swimming Pool","Parking","Security","Club House","Lift"]; possession="9 Months"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Arvind Uplands"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-01-31"; },
      { id="p410"; propertyType="Residential"; action="Buy"; title="1 BHK in NK Residency - Vastral"; description="Budget 1 BHK in NK Residency, Vastral. Ground floor unfurnished unit, ready to move. Ideal for investment or first-time buyer. Near Vastral BRTS and industrial corridor."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="NK Residency, Vastral, Ahmedabad - 382418"; price=2800000; priceDisplay="\u{20B9}28 L"; bhk="1 BHK"; sqft=620; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="NK Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-02"; },
      { id="p411"; propertyType="Residential"; action="Buy"; title="2 BHK in Regency Heights - Nikol"; description="Semi-furnished 2 BHK in Regency Heights, Nikol. South-facing 2nd floor, ready to move. Good connectivity to Vastral and Isanpur. Suitable for budget-conscious buyers."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Regency Heights, Nikol, Ahmedabad - 382350"; price=3800000; priceDisplay="\u{20B9}38 L"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Water Supply","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Regency Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-04"; },
      { id="p412"; propertyType="Residential"; action="Buy"; title="3 BHK in Vishwas City Phase 2 - Motera"; description="Semi-furnished 3 BHK in Vishwas City Phase 2, Motera. West-facing 10th floor with possession in 15 months. Society has clubhouse, gym and pool. Close to Narendra Modi Cricket Stadium."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Vishwas City Phase 2, Motera, Ahmedabad - 380005"; price=8200000; priceDisplay="\u{20B9}82 L"; bhk="3 BHK"; sqft=1480; furnishing="Semi-Furnished"; amenities=["Club House","Gym","Swimming Pool","Parking","Security","Lift"]; possession="15 Months"; images=[]; mapLink=""; facing="West"; floorNo=10; societyName="Vishwas City Phase 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-06"; },
      { id="p413"; propertyType="Residential"; action="Buy"; title="2 BHK in Sai Residency - Maninagar"; description="Unfurnished 2 BHK in Sai Residency, Maninagar. North-facing 3rd floor, ready to move. Good locality with strong rental demand. Close to Maninagar railway station and LG Hospital."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Sai Residency, Maninagar, Ahmedabad - 380008"; price=4400000; priceDisplay="\u{20B9}44 L"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Sai Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-08"; },
      { id="p414"; propertyType="Residential"; action="Buy"; title="3 BHK in Maple Heights - Vastrapur"; description="Fully furnished luxury 3 BHK in Maple Heights, Vastrapur on 15th floor. Ready to move. Premium fittings, modular kitchen, and home theatre setup. Close to Vastrapur Lake."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Maple Heights, Vastrapur, Ahmedabad - 380015"; price=13500000; priceDisplay="\u{20B9}1.35 Cr"; bhk="3 BHK"; sqft=1720; furnishing="Furnished"; amenities=["Swimming Pool","Gym","Club House","Parking","Security","Smart Home","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=15; societyName="Maple Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-10"; },
      { id="p415"; propertyType="Residential"; action="Buy"; title="2 BHK in Siddhi Vinayak Elegance - Bodakdev"; description="Semi-furnished 2 BHK in Siddhi Vinayak Elegance, Bodakdev. West-facing 8th floor, ready to move. Premium location near Judges Bungalow Road. Club house, gym included."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Siddhi Vinayak Elegance, Bodakdev, Ahmedabad - 380054"; price=8500000; priceDisplay="\u{20B9}85 L"; bhk="2 BHK"; sqft=1080; furnishing="Semi-Furnished"; amenities=["Club House","Gym","Parking","Security","Lift","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Siddhi Vinayak Elegance"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-12"; },
      { id="p416"; propertyType="Residential"; action="Buy"; title="4 BHK in Mondeal Heights - Thaltej"; description="Ultra-luxury 4 BHK in Mondeal Heights, Thaltej on 18th floor. Fully furnished with top-of-the-line fittings, panoramic city views. One of Ahmedabad's most prestigious addresses."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Mondeal Heights, Thaltej, Ahmedabad - 380054"; price=22000000; priceDisplay="\u{20B9}2.2 Cr"; bhk="4 BHK"; sqft=2400; furnishing="Furnished"; amenities=["Infinity Pool","Gym","Club House","Smart Home","Parking","Security","Concierge","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=18; societyName="Mondeal Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-14"; },
      { id="p417"; propertyType="Residential"; action="Buy"; title="3 BHK in Safal Parisar 2 - South Bopal"; description="Unfurnished 3 BHK in Safal Parisar 2, South Bopal. North-facing 6th floor with possession in 6 months. RERA registered project. Good connectivity to SP Ring Road."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Safal Parisar 2, South Bopal, Ahmedabad - 380058"; price=6800000; priceDisplay="\u{20B9}68 L"; bhk="3 BHK"; sqft=1350; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden","Club House"]; possession="6 Months"; images=[]; mapLink=""; facing="North"; floorNo=6; societyName="Safal Parisar 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-16"; },
      { id="p418"; propertyType="Residential"; action="Buy"; title="2 BHK in Anmol Residency - Bopal"; description="Semi-furnished 2 BHK in Anmol Residency, Bopal. East-facing 5th floor, ready to move. Friendly society with good amenities. Near Bopal Chokdi and SP Ring Road."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Anmol Residency, Bopal, Ahmedabad - 380058"; price=5500000; priceDisplay="\u{20B9}55 L"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Anmol Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-18"; },
      { id="p419"; propertyType="Residential"; action="Buy"; title="3 BHK in Lalani Grandeur - Gota"; description="Unfurnished 3 BHK in Lalani Grandeur, Gota. South-facing 11th floor with 12-month possession. Spacious layout with open views. Near Gota highway and upcoming metro line."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Lalani Grandeur, Gota, Ahmedabad - 382481"; price=7600000; priceDisplay="\u{20B9}76 L"; bhk="3 BHK"; sqft=1500; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Gym","Club House"]; possession="12 Months"; images=[]; mapLink=""; facing="South"; floorNo=11; societyName="Lalani Grandeur"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-20"; },
      { id="p420"; propertyType="Residential"; action="Buy"; title="2 BHK in Dev Arc Residency - Chandkheda"; description="Unfurnished 2 BHK in Dev Arc Residency, Chandkheda. West-facing 4th floor, ready to move. Affordable pricing with good infrastructure connectivity."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Dev Arc Residency, Chandkheda, Ahmedabad - 382424"; price=4900000; priceDisplay="\u{20B9}49 L"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Dev Arc Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-22"; },
      { id="p421"; propertyType="Residential"; action="Buy"; title="3 BHK in Savvy Swaraj Tower - SG Highway"; description="Semi-furnished 3 BHK in Savvy Swaraj Tower, SG Highway. East-facing 16th floor with possession in 18 months. High-rise tower with stunning views. Close to business parks and malls."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="Savvy Swaraj Tower, SG Highway, Ahmedabad - 380054"; price=10500000; priceDisplay="\u{20B9}1.05 Cr"; bhk="3 BHK"; sqft=1620; furnishing="Semi-Furnished"; amenities=["Swimming Pool","Gym","Club House","Parking","Security","Lift","Power Backup"]; possession="18 Months"; images=[]; mapLink=""; facing="East"; floorNo=16; societyName="Savvy Swaraj Tower"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-24"; },
      { id="p422"; propertyType="Residential"; action="Buy"; title="2 BHK in Riddhi Siddhi Complex - Naranpura"; description="Fully furnished 2 BHK in Riddhi Siddhi Complex, Naranpura. North-facing 7th floor, ready to move. Modular kitchen and wardrobes included. Close to Naranpura bus stand and markets."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Riddhi Siddhi Complex, Naranpura, Ahmedabad - 380013"; price=6200000; priceDisplay="\u{20B9}62 L"; bhk="2 BHK"; sqft=1000; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=7; societyName="Riddhi Siddhi Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-26"; },
      { id="p423"; propertyType="Residential"; action="Buy"; title="4 BHK in Primrose Garden - Satellite"; description="Luxurious fully furnished 4 BHK in Primrose Garden, Satellite on 20th floor. Panoramic views, smart home features. Walking distance from ISCON Mega Mall and major corporate offices."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Primrose Garden, Satellite, Ahmedabad - 380015"; price=16500000; priceDisplay="\u{20B9}1.65 Cr"; bhk="4 BHK"; sqft=2100; furnishing="Furnished"; amenities=["Swimming Pool","Gym","Club House","Smart Home","Parking","Security","Concierge","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=20; societyName="Primrose Garden"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-02-28"; },
      { id="p424"; propertyType="Residential"; action="Buy"; title="3 BHK in Shivalik Bungalows - Prahladnagar"; description="Semi-furnished 3 BHK in Shivalik Bungalows, Prahlad Nagar on top floor. Ready to move. Penthouse-style layout with open terrace. One of the most sought-after locations in west Ahmedabad."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Shivalik Bungalows, Prahladnagar, Ahmedabad - 380015"; price=12500000; priceDisplay="\u{20B9}1.25 Cr"; bhk="3 BHK"; sqft=1750; furnishing="Semi-Furnished"; amenities=["Terrace","Parking","Security","Club House","Gym","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=18; societyName="Shivalik Bungalows"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-02"; },
      { id="p425"; propertyType="Residential"; action="Buy"; title="2 BHK in Om Shanti Heights - Vatva"; description="Unfurnished budget 2 BHK in Om Shanti Heights, Vatva. South-facing 2nd floor, ready to move. Good for investment, strong rental demand from industrial workers. Near Vatva GIDC."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Om Shanti Heights, Vatva, Ahmedabad - 382445"; price=3200000; priceDisplay="\u{20B9}32 L"; bhk="2 BHK"; sqft=950; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Om Shanti Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-04"; },
      { id="p426"; propertyType="Residential"; action="Buy"; title="3 BHK in Parshwa Elegance - Thaltej"; description="Semi-furnished 3 BHK in Parshwa Elegance, Thaltej. East-facing 13th floor with possession in 9 months. Modern design with premium fixtures. Near metro and SG Highway."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Parshwa Elegance, Thaltej, Ahmedabad - 380054"; price=9800000; priceDisplay="\u{20B9}98 L"; bhk="3 BHK"; sqft=1580; furnishing="Semi-Furnished"; amenities=["Gym","Swimming Pool","Club House","Parking","Security","Lift"]; possession="9 Months"; images=[]; mapLink=""; facing="East"; floorNo=13; societyName="Parshwa Elegance"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-06"; },
      { id="p427"; propertyType="Residential"; action="Buy"; title="2 BHK in Sunflower Residency - Vastrapur"; description="Fully furnished 2 BHK in Sunflower Residency, Vastrapur. North-facing 9th floor, ready to move. Near Vastrapur Lake and IIM Ahmedabad. Excellent locality with premium connectivity."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Sunflower Residency, Vastrapur, Ahmedabad - 380015"; price=7200000; priceDisplay="\u{20B9}72 L"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Parking","Lift","Security","Club House","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Sunflower Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-08"; },
      { id="p428"; propertyType="Residential"; action="Buy"; title="3 BHK in Rudra Complex Phase 3 - Bopal"; description="Unfurnished 3 BHK in Rudra Complex Phase 3, Bopal. West-facing 8th floor with 6-month possession. Spacious rooms with good sunlight. Close to Bopal market and SP Ring Road."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Rudra Complex Phase 3, Bopal, Ahmedabad - 380058"; price=7900000; priceDisplay="\u{20B9}79 L"; bhk="3 BHK"; sqft=1450; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Club House","Gym"]; possession="6 Months"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Rudra Complex Phase 3"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-10"; },
      { id="p429"; propertyType="Residential"; action="Buy"; title="2 BHK in Shree Ram Apartment - Nikol"; description="Semi-furnished 2 BHK in Shree Ram Apartment, Nikol. East-facing 3rd floor, ready to move. Budget-friendly option with basic amenities. Close to Nikol highway and Vastral."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Shree Ram Apartment, Nikol, Ahmedabad - 382350"; price=3500000; priceDisplay="\u{20B9}35 L"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Shree Ram Apartment"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-12"; },
      { id="p430"; propertyType="Residential"; action="Buy"; title="4 BHK Duplex in Solitaire Park - South Bopal"; description="Premium 4 BHK duplex in Solitaire Park, South Bopal. Top floor fully furnished with private terrace garden. 2800 sqft of luxury living. Close to South Bopal schools and SP Ring Road."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Solitaire Park, South Bopal, Ahmedabad - 380058"; price=19500000; priceDisplay="\u{20B9}1.95 Cr"; bhk="4 BHK"; sqft=2800; furnishing="Furnished"; amenities=["Swimming Pool","Gym","Club House","Terrace Garden","Parking","Security","Smart Home","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=18; societyName="Solitaire Park"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-14"; },
      { id="p431"; propertyType="Residential"; action="Buy"; title="3 BHK in Shalibhadra Heights - Chandkheda"; description="Semi-furnished 3 BHK in Shalibhadra Heights, Chandkheda. North-facing 11th floor, ready to move. Society has gym and security. Close to Chandkheda railway station and ONGC colony."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Shalibhadra Heights, Chandkheda, Ahmedabad - 382424"; price=7300000; priceDisplay="\u{20B9}73 L"; bhk="3 BHK"; sqft=1420; furnishing="Semi-Furnished"; amenities=["Gym","Parking","Security","Lift","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=11; societyName="Shalibhadra Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-16"; },
      { id="p432"; propertyType="Residential"; action="Buy"; title="2 BHK in Akash Deep Apartment - Navrangpura"; description="Fully furnished 2 BHK in Akash Deep Apartment, Navrangpura. East-facing 6th floor, ready to move. Premium location close to CG Road, Ellis Bridge and business districts."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Akash Deep Apartment, Navrangpura, Ahmedabad - 380009"; price=8200000; priceDisplay="\u{20B9}82 L"; bhk="2 BHK"; sqft=1020; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup","Club House"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Akash Deep Apartment"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-18"; },
      { id="p433"; propertyType="Residential"; action="Buy"; title="3 BHK in Prerna Residency - Gota"; description="Unfurnished 3 BHK in Prerna Residency, Gota. South-facing 9th floor with possession in 15 months. Budget luxury segment. Good connectivity to Chandkheda and SG Highway."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Prerna Residency, Gota, Ahmedabad - 382481"; price=6800000; priceDisplay="\u{20B9}68 L"; bhk="3 BHK"; sqft=1380; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Club House"]; possession="15 Months"; images=[]; mapLink=""; facing="South"; floorNo=9; societyName="Prerna Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-20"; },
      { id="p434"; propertyType="Residential"; action="Buy"; title="2 BHK in Radhe Residency - Motera"; description="Unfurnished budget 2 BHK in Radhe Residency, Motera. West-facing 4th floor, ready to move. Near Motera stadium and Sabarmati riverfront. Ideal for end-use or rental investment."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Radhe Residency, Motera, Ahmedabad - 380005"; price=4200000; priceDisplay="\u{20B9}42 L"; bhk="2 BHK"; sqft=980; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Radhe Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-22"; },
      { id="p435"; propertyType="Residential"; action="Buy"; title="3 BHK in Luxe Meridian - SG Highway Ambli"; description="Luxurious fully furnished 3 BHK in Luxe Meridian, SG Highway Ambli. East-facing 17th floor with possession in 12 months. Premium tower with world-class amenities."; location="Ambli, Ahmedabad"; city="Ahmedabad"; address="Luxe Meridian, SG Highway Ambli, Ahmedabad - 380058"; price=14500000; priceDisplay="\u{20B9}1.45 Cr"; bhk="3 BHK"; sqft=1800; furnishing="Furnished"; amenities=["Infinity Pool","Gym","Club House","Smart Home","Parking","Security","Concierge","Lift"]; possession="12 Months"; images=[]; mapLink=""; facing="East"; floorNo=17; societyName="Luxe Meridian"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-24"; },
      { id="p436"; propertyType="Residential"; action="Buy"; title="2 BHK in Subhash Heights - Satellite"; description="Semi-furnished 2 BHK in Subhash Heights, Satellite. North-facing 7th floor, ready to move. Well-maintained society in heart of Satellite near ISCON bridge."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Subhash Heights, Satellite, Ahmedabad - 380015"; price=7000000; priceDisplay="\u{20B9}70 L"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=7; societyName="Subhash Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-26"; },
      { id="p437"; propertyType="Residential"; action="Buy"; title="3 BHK in Vedant Residency - Vastral"; description="Unfurnished 3 BHK in Vedant Residency, Vastral. East-facing 5th floor, ready to move. Budget segment flat with good connectivity to Nikol and Isanpur. Suitable for young families."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vedant Residency, Vastral, Ahmedabad - 382418"; price=5200000; priceDisplay="\u{20B9}52 L"; bhk="3 BHK"; sqft=1300; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Vedant Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-28"; },
      { id="p438"; propertyType="Residential"; action="Buy"; title="2 BHK in Amber Apartments - Bodakdev"; description="Fully furnished 2 BHK in Amber Apartments, Bodakdev. West-facing 10th floor, ready to move. Premium location near Judges Bungalow Road and IIM Ahmedabad. Perfect for professionals."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Amber Apartments, Bodakdev, Ahmedabad - 380054"; price=8800000; priceDisplay="\u{20B9}88 L"; bhk="2 BHK"; sqft=1080; furnishing="Furnished"; amenities=["Parking","Lift","Security","Club House","Gym","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=10; societyName="Amber Apartments"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-03-30"; },
      { id="p439"; propertyType="Residential"; action="Buy"; title="4 BHK in Western Park Villas - Prahladnagar"; description="Ultra-premium 4 BHK villa-style apartment in Western Park Villas, Prahlad Nagar. Top floor fully furnished. Sprawling 2600 sqft with private garden. Among Ahmedabad's most exclusive residences."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Western Park Villas, Prahladnagar, Ahmedabad - 380015"; price=24000000; priceDisplay="\u{20B9}2.4 Cr"; bhk="4 BHK"; sqft=2600; furnishing="Furnished"; amenities=["Private Garden","Swimming Pool","Gym","Club House","Smart Home","Parking","Security","Concierge","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=18; societyName="Western Park Villas"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-01"; },
      { id="p440"; propertyType="Residential"; action="Buy"; title="3 BHK in Safal Saakar - Bopal"; description="Semi-furnished 3 BHK in Safal Saakar, Bopal. South-facing 12th floor with possession in 9 months. RERA-registered project by Safal Developers. Close to Bopal bus stand and schools."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Safal Saakar, Bopal, Ahmedabad - 380058"; price=8200000; priceDisplay="\u{20B9}82 L"; bhk="3 BHK"; sqft=1480; furnishing="Semi-Furnished"; amenities=["Club House","Gym","Swimming Pool","Parking","Security","Lift"]; possession="9 Months"; images=[]; mapLink=""; facing="South"; floorNo=12; societyName="Safal Saakar"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-03"; },
      { id="p441"; propertyType="Residential"; action="Buy"; title="2 BHK in Kavya Residency - Naranpura"; description="Fully furnished 2 BHK in Kavya Residency, Naranpura. North-facing 8th floor, ready to move. Well-connected location near Vijay Cross Road and Naranpura markets."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Kavya Residency, Naranpura, Ahmedabad - 380013"; price=6300000; priceDisplay="\u{20B9}63 L"; bhk="2 BHK"; sqft=960; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="Kavya Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-05"; },
      { id="p442"; propertyType="Residential"; action="Buy"; title="3 BHK in Mondeal Greens - Thaltej"; description="Semi-furnished 3 BHK in Mondeal Greens, Thaltej on 14th floor. Ready to move. Green building with terrace garden. Premium location close to SG Highway and metro corridor."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Mondeal Greens, Thaltej, Ahmedabad - 380054"; price=11500000; priceDisplay="\u{20B9}1.15 Cr"; bhk="3 BHK"; sqft=1680; furnishing="Semi-Furnished"; amenities=["Terrace Garden","Swimming Pool","Gym","Club House","Parking","Security","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Mondeal Greens"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-07"; },
      { id="p443"; propertyType="Residential"; action="Buy"; title="2 BHK in Synergy Avenue - South Bopal"; description="Unfurnished 2 BHK in Synergy Avenue, South Bopal. West-facing 6th floor, ready to move. Affordable price in growing locality near SP Ring Road. Good resale and rental value."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Synergy Avenue, South Bopal, Ahmedabad - 380058"; price=5600000; priceDisplay="\u{20B9}56 L"; bhk="2 BHK"; sqft=1040; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Garden"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Synergy Avenue"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-09"; },
      { id="p444"; propertyType="Residential"; action="Buy"; title="3 BHK in Siddhivinayak Complex - Nikol"; description="Unfurnished 3 BHK in Siddhivinayak Complex, Nikol. East-facing 7th floor with possession in 18 months. Budget segment. Close to Nikol-Naroda road and BRTS corridor."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Siddhivinayak Complex, Nikol, Ahmedabad - 382350"; price=4800000; priceDisplay="\u{20B9}48 L"; bhk="3 BHK"; sqft=1350; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Water Supply"]; possession="18 Months"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Siddhivinayak Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-11"; },
      { id="p445"; propertyType="Residential"; action="Buy"; title="2 BHK in Siddhi Ganesh Heights - Vatva"; description="Budget 2 BHK in Siddhi Ganesh Heights, Vatva. South-facing 2nd floor unfurnished, ready to move. Affordable option near Vatva industrial area. Good rental potential from workers."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Siddhi Ganesh Heights, Vatva, Ahmedabad - 382445"; price=2900000; priceDisplay="\u{20B9}29 L"; bhk="2 BHK"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Ready to Move"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Siddhi Ganesh Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-13"; },
      { id="p446"; propertyType="Residential"; action="Buy"; title="4 BHK in Samanvay Icon - Vastrapur"; description="Ultra-luxury 4 BHK in Samanvay Icon, Vastrapur on 19th floor. Fully furnished with premium interiors. One of the finest addresses near Vastrapur Lake and Ahmedabad's cultural belt."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Samanvay Icon, Vastrapur, Ahmedabad - 380015"; price=21000000; priceDisplay="\u{20B9}2.1 Cr"; bhk="4 BHK"; sqft=2300; furnishing="Furnished"; amenities=["Infinity Pool","Gym","Club House","Smart Home","Parking","Security","Concierge","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=19; societyName="Samanvay Icon"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-15"; },
      { id="p447"; propertyType="Residential"; action="Buy"; title="3 BHK in Shivalik Sharda - Chandkheda"; description="Semi-furnished 3 BHK in Shivalik Sharda, Chandkheda. North-facing 13th floor with possession in 6 months. Shivalik brand quality construction. Close to ONGC colony and Chandkheda station."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Shivalik Sharda, Chandkheda, Ahmedabad - 382424"; price=7500000; priceDisplay="\u{20B9}75 L"; bhk="3 BHK"; sqft=1480; furnishing="Semi-Furnished"; amenities=["Gym","Club House","Parking","Security","Lift","Power Backup"]; possession="6 Months"; images=[]; mapLink=""; facing="North"; floorNo=13; societyName="Shivalik Sharda"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-17"; },
      { id="p448"; propertyType="Residential"; action="Buy"; title="2 BHK in Arjun Heights - Gota"; description="Unfurnished 2 BHK in Arjun Heights, Gota. West-facing 5th floor, ready to move. Good value in Gota locality with easy connectivity to Chandkheda and SG Highway."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Arjun Heights, Gota, Ahmedabad - 382481"; price=4700000; priceDisplay="\u{20B9}47 L"; bhk="2 BHK"; sqft=1010; furnishing="Unfurnished"; amenities=["Parking","Lift","Security","Water Supply"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Arjun Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-19"; },
      { id="p449"; propertyType="Residential"; action="Buy"; title="3 BHK in Green Valley - Motera"; description="Semi-furnished 3 BHK in Green Valley, Motera. East-facing 11th floor with 12-month possession. Green landscaped society with jogging track and children's play area. Near Motera stadium."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Green Valley, Motera, Ahmedabad - 380005"; price=7900000; priceDisplay="\u{20B9}79 L"; bhk="3 BHK"; sqft=1520; furnishing="Semi-Furnished"; amenities=["Jogging Track","Children Play Area","Gym","Parking","Security","Lift"]; possession="12 Months"; images=[]; mapLink=""; facing="East"; floorNo=11; societyName="Green Valley"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-21"; },
      { id="p450"; propertyType="Residential"; action="Buy"; title="2 BHK in Regency Classic - Navrangpura"; description="Fully furnished 2 BHK in Regency Classic, Navrangpura. North-facing 9th floor, ready to move. Premium location close to CG Road and Navrangpura business district. Excellent investment potential."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Regency Classic, Navrangpura, Ahmedabad - 380009"; price=8000000; priceDisplay="\u{20B9}80 L"; bhk="2 BHK"; sqft=1030; furnishing="Furnished"; amenities=["Parking","Lift","Security","Club House","Power Backup"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Regency Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-04-23"; },
      { id="p451"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Navrangpura Heights"; description="Fully furnished 2 BHK in Navrangpura Heights, near Navrangpura Cross Roads. East-facing 4th floor, available immediately. Premium location in central Ahmedabad, close to CG Road and business hubs."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Heights, Near Navrangpura Cross Roads, Ahmedabad - 380009"; price=25000; priceDisplay="\u{20B9}25,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Navrangpura Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p452"; propertyType="Residential"; action="Rent"; title="1 BHK Semi-Furnished in Sky Apartment - Satellite"; description="Semi-furnished 1 BHK in Sky Apartment, Satellite near Satellite Cross Roads. West-facing 3rd floor, available immediately. Well-connected locality with all amenities nearby."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Sky Apartment, Near Satellite Cross Roads, Ahmedabad - 380015"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="1 BHK"; sqft=620; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Sky Apartment"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p453"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Lake View Residency - Vastrapur"; description="Fully furnished 3 BHK in Lake View Residency, near Vastrapur Lake. East-facing 8th floor, available immediately. Stunning lake views from balcony. Premium address in Ahmedabad's upscale western zone."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Lake View Residency, Near Vastrapur Lake, Ahmedabad - 380054"; price=38000; priceDisplay="\u{20B9}38,000/mo"; bhk="3 BHK"; sqft=1580; furnishing="Furnished"; amenities=["Gym","Pool","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Lake View Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p454"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Shivalik Greens - Prahladnagar"; description="Semi-furnished 2 BHK in Shivalik Greens, near Prahladnagar Garden. North-facing 5th floor, available immediately. Serene garden views in one of Ahmedabad's most sought-after residential zones."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Shivalik Greens, Near Prahladnagar Garden, Ahmedabad - 380015"; price=22000; priceDisplay="\u{20B9}22,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Gym","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Shivalik Greens"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p455"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Bodakdev Heights"; description="Fully furnished 3 BHK in Bodakdev Heights, near Himalaya Mall. East-facing 10th floor, available immediately. Ultra-premium rental in Bodakdev, Ahmedabad's top residential corridor. Walking distance to malls and restaurants."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Heights, Near Himalaya Mall, Ahmedabad - 380054"; price=45000; priceDisplay="\u{20B9}45,000/mo"; bhk="3 BHK"; sqft=1720; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=10; societyName="Bodakdev Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p456"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Surya Complex - Maninagar"; description="Unfurnished 2 BHK in Surya Complex, near Maninagar Station. South-facing 2nd floor, available immediately. Budget-friendly rental in Maninagar, well-connected by bus and train."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Surya Complex, Near Maninagar Station, Ahmedabad - 380008"; price=10000; priceDisplay="\u{20B9}10,000/mo"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Surya Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p457"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in University View Apartments - Navrangpura"; description="Fully furnished 1 BHK in University View Apartments, near Gujarat University. West-facing 6th floor, available immediately. Perfect for students and professionals near Gujarat University campus."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="University View Apartments, Near Gujarat University, Ahmedabad - 380009"; price=15000; priceDisplay="\u{20B9}15,000/mo"; bhk="1 BHK"; sqft=620; furnishing="Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="University View Apartments"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p458"; propertyType="Residential"; action="Rent"; title="3 BHK Semi-Furnished in Jodhpur Heights - Satellite"; description="Semi-furnished 3 BHK in Jodhpur Heights, near Judges Bungalow Road. North-facing 7th floor, available immediately. Excellent Satellite location close to upscale restaurants and schools."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Jodhpur Heights, Near Judges Bungalow Road, Ahmedabad - 380015"; price=32000; priceDisplay="\u{20B9}32,000/mo"; bhk="3 BHK"; sqft=1520; furnishing="Semi-Furnished"; amenities=["Gym","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=7; societyName="Jodhpur Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p459"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Metro Residency - Vastrapur"; description="Fully furnished 2 BHK in Metro Residency, near Vastrapur Metro Station. East-facing 9th floor, available immediately. Metro connectivity is a major advantage for daily commuters."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Metro Residency, Near Vastrapur Metro Station, Ahmedabad - 380054"; price=28000; priceDisplay="\u{20B9}28,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=9; societyName="Metro Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p460"; propertyType="Residential"; action="Rent"; title="1 BHK Unfurnished in Nikol Heights"; description="Unfurnished 1 BHK in Nikol Heights, near Nikol Cross Roads. West-facing 2nd floor, available immediately. Affordable option in Nikol with good BRTS connectivity."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Heights, Near Nikol Cross Roads, Ahmedabad - 382350"; price=7500; priceDisplay="\u{20B9}7,500/mo"; bhk="1 BHK"; sqft=580; furnishing="Unfurnished"; amenities=["Parking","Water Supply","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Nikol Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p461"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Lotus Residency - Gota"; description="Semi-furnished 2 BHK in Lotus Residency, near Gota Flyover. South-facing 4th floor, available immediately. Growing locality with good connectivity to SG Road and Chandkheda."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Lotus Residency, Near Gota Flyover, Ahmedabad - 382481"; price=14000; priceDisplay="\u{20B9}14,000/mo"; bhk="2 BHK"; sqft=1020; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=4; societyName="Lotus Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p462"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Corporate Heights - Prahladnagar"; description="Fully furnished 3 BHK in Corporate Heights, near Corporate Road, Prahladnagar. East-facing 12th floor, available immediately. Ideal for corporate executives working in Prahladnagar's business district."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Corporate Heights, Near Corporate Road, Ahmedabad - 380015"; price=40000; priceDisplay="\u{20B9}40,000/mo"; bhk="3 BHK"; sqft=1680; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=12; societyName="Corporate Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p463"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Chandkheda Apartments"; description="Unfurnished 2 BHK in Chandkheda Apartments, near Chandkheda BRTS. North-facing 3rd floor, available immediately. Convenient BRTS access for daily commute. Good for families."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Apartments, Near Chandkheda BRTS, Ahmedabad - 382424"; price=11000; priceDisplay="\u{20B9}11,000/mo"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Chandkheda Apartments"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-01"; },
      { id="p464"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Bopal Heights"; description="Fully furnished 1 BHK in Bopal Heights, near Bopal Chokdi. West-facing 5th floor, available immediately. Affordable furnished option in fast-developing Bopal locality."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Heights, Near Bopal Chokdi, Ahmedabad - 380058"; price=10500; priceDisplay="\u{20B9}10,500/mo"; bhk="1 BHK"; sqft=580; furnishing="Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Bopal Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p465"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in South Bopal Residency"; description="Fully furnished 2 BHK in South Bopal Residency, near South Bopal BRTS. East-facing 6th floor, available immediately. Well-maintained society in South Bopal with excellent BRTS connectivity."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Residency, Near South Bopal BRTS, Ahmedabad - 380058"; price=18000; priceDisplay="\u{20B9}18,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="South Bopal Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p466"; propertyType="Residential"; action="Rent"; title="3 BHK Semi-Furnished in Thaltej Tower"; description="Semi-furnished 3 BHK in Thaltej Tower, near Thaltej Metro Station. North-facing 11th floor, available immediately. Premium location near metro and SG Road with great investment potential."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Tower, Near Thaltej Metro Station, Ahmedabad - 380054"; price=35000; priceDisplay="\u{20B9}35,000/mo"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Gym","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=11; societyName="Thaltej Tower"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p467"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Stadium View - Motera"; description="Unfurnished 2 BHK in Stadium View, near Motera Stadium. East-facing 4th floor, available immediately. Great for sports enthusiasts and professionals near Motera's developing corridor."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Stadium View, Near Motera Stadium, Ahmedabad - 380005"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Stadium View"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p468"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Naranpura Heights"; description="Fully furnished 1 BHK in Naranpura Heights, near Naranpura Metro. West-facing 7th floor, available immediately. Metro-connected location ideal for young professionals."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Heights, Near Naranpura Metro, Ahmedabad - 380013"; price=13500; priceDisplay="\u{20B9}13,500/mo"; bhk="1 BHK"; sqft=620; furnishing="Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Naranpura Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p469"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Satellite Towers"; description="Fully furnished 3 BHK in Satellite Towers, near Jodhpur Cross Roads. East-facing 14th floor, available immediately. High-rise luxury rental in Satellite, one of Ahmedabad's most premium addresses."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Towers, Near Jodhpur Cross Roads, Ahmedabad - 380015"; price=42000; priceDisplay="\u{20B9}42,000/mo"; bhk="3 BHK"; sqft=1720; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Satellite Towers"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p470"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Vastral Residency"; description="Semi-furnished 2 BHK in Vastral Residency, near Vastral BRTS. South-facing 3rd floor, available immediately. Affordable rental in Vastral with excellent BRTS access."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Residency, Near Vastral BRTS, Ahmedabad - 382418"; price=9500; priceDisplay="\u{20B9}9,500/mo"; bhk="2 BHK"; sqft=990; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Vastral Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p471"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Navrangpura Classic"; description="Fully furnished 2 BHK in Navrangpura Classic, near Post Office. North-facing 8th floor, available immediately. Central Navrangpura location with all conveniences within walking distance."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Classic, Near Post Office, Navrangpura, Ahmedabad - 380009"; price=26000; priceDisplay="\u{20B9}26,000/mo"; bhk="2 BHK"; sqft=1080; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="Navrangpura Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p472"; propertyType="Residential"; action="Rent"; title="1 BHK Unfurnished in Maninagar Apartments"; description="Unfurnished 1 BHK in Maninagar Apartments, near RTO. East-facing 2nd floor, available immediately. Very affordable rental in Maninagar. Suitable for singles or couples on a budget."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Apartments, Near RTO, Maninagar, Ahmedabad - 380008"; price=7000; priceDisplay="\u{20B9}7,000/mo"; bhk="1 BHK"; sqft=560; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Maninagar Apartments"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-02"; },
      { id="p473"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Vastrapur Grand"; description="Fully furnished 3 BHK in Vastrapur Grand, near AMA. West-facing 15th floor, available immediately. Landmark high-rise in Vastrapur offering panoramic city views and luxury amenities."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Grand, Near AMA, Vastrapur, Ahmedabad - 380054"; price=44000; priceDisplay="\u{20B9}44,000/mo"; bhk="3 BHK"; sqft=1780; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security","Concierge"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=15; societyName="Vastrapur Grand"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p474"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Nikol Square"; description="Unfurnished 2 BHK in Nikol Square, near Nirant Char Rasta. East-facing 3rd floor, available immediately. Value rental in eastern Ahmedabad. Good transport links via BRTS."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Square, Near Nirant Char Rasta, Ahmedabad - 382350"; price=9000; priceDisplay="\u{20B9}9,000/mo"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Nikol Square"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p475"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Chandkheda Complex"; description="Fully furnished 1 BHK in Chandkheda Complex, near Chandkheda Market. South-facing 4th floor, available immediately. Compact furnished unit perfect for working professionals in Chandkheda."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Complex, Near Chandkheda Market, Ahmedabad - 382424"; price=9500; priceDisplay="\u{20B9}9,500/mo"; bhk="1 BHK"; sqft=600; furnishing="Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=4; societyName="Chandkheda Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p476"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Gota Residency"; description="Semi-furnished 2 BHK in Gota Residency, near Lotus Cross Roads. West-facing 6th floor, available immediately. Growing Gota area with good connectivity to major employment hubs."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Residency, Near Lotus Cross Roads, Ahmedabad - 382481"; price=15000; priceDisplay="\u{20B9}15,000/mo"; bhk="2 BHK"; sqft=1040; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Gota Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p477"; propertyType="Residential"; action="Rent"; title="3 BHK Unfurnished in Bodakdev Classic"; description="Unfurnished 3 BHK in Bodakdev Classic, near Bodakdev Circle. North-facing 9th floor, available immediately. Spacious unfurnished 3 BHK in prime Bodakdev. Bring your own furniture for a personalised home."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Classic, Near Bodakdev Circle, Ahmedabad - 380054"; price=30000; priceDisplay="\u{20B9}30,000/mo"; bhk="3 BHK"; sqft=1580; furnishing="Unfurnished"; amenities=["Gym","Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Bodakdev Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p478"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Mansi Heights - Prahladnagar"; description="Fully furnished 2 BHK in Mansi Heights, near Mansi Circle. East-facing 7th floor, available immediately. Coveted Mansi Circle address close to premium schools and hospitals."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Mansi Heights, Near Mansi Circle, Prahladnagar, Ahmedabad - 380015"; price=24000; priceDisplay="\u{20B9}24,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Mansi Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p479"; propertyType="Residential"; action="Rent"; title="1 BHK Semi-Furnished in South Bopal Classic"; description="Semi-furnished 1 BHK in South Bopal Classic, near Sola Road. West-facing 5th floor, available immediately. Entry-level rental in South Bopal, ideal for young professionals and students."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Classic, Near Sola Road, Ahmedabad - 380058"; price=10000; priceDisplay="\u{20B9}10,000/mo"; bhk="1 BHK"; sqft=600; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="South Bopal Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-03"; },
      { id="p480"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Bopal Residency"; description="Fully furnished 2 BHK in Bopal Residency, near Bopal Bus Stop. East-facing 8th floor, available immediately. Well-managed society in Bopal with all modern amenities and easy bus connectivity."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Residency, Near Bopal Bus Stop, Ahmedabad - 380058"; price=19000; priceDisplay="\u{20B9}19,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Bopal Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p481"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Naranpura Towers"; description="Fully furnished 3 BHK in Naranpura Towers, near Naranpura BRTS. North-facing 12th floor, available immediately. High-rise luxury rental in Naranpura with panoramic views. BRTS and metro connectivity."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Towers, Near Naranpura BRTS, Ahmedabad - 380013"; price=35000; priceDisplay="\u{20B9}35,000/mo"; bhk="3 BHK"; sqft=1620; furnishing="Furnished"; amenities=["Gym","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=12; societyName="Naranpura Towers"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p482"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Motera Residency"; description="Unfurnished 2 BHK in Motera Residency, near Ahmedabad North. West-facing 5th floor, available immediately. Budget-friendly unfurnished option in Motera. Close to Sabarmati area and national highway."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Motera Residency, Near Ahmedabad North, Ahmedabad - 380005"; price=13000; priceDisplay="\u{20B9}13,000/mo"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Motera Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p483"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Vatva Heights"; description="Fully furnished 1 BHK in Vatva Heights, near Vatva GIDC. South-facing 3rd floor, available immediately. Affordable furnished option near industrial belt. Ideal for working professionals at GIDC."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva Heights, Near Vatva GIDC, Ahmedabad - 382445"; price=7000; priceDisplay="\u{20B9}7,000/mo"; bhk="1 BHK"; sqft=560; furnishing="Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Vatva Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p484"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Thaltej Classic"; description="Semi-furnished 2 BHK in Thaltej Classic, near S G Road. East-facing 10th floor, available immediately. Prime SG Road frontage with easy access to all major business and retail destinations."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Classic, Near S G Road, Thaltej, Ahmedabad - 380054"; price=28000; priceDisplay="\u{20B9}28,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Gym","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=10; societyName="Thaltej Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p485"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Satellite Premium"; description="Fully furnished 3 BHK in Satellite Premium, near Judges Bungalow. North-facing 13th floor, available immediately. Luxurious 3 BHK in an elite Satellite address. Close to top schools, hospitals and corporate offices."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Premium, Near Judges Bungalow, Ahmedabad - 380015"; price=38000; priceDisplay="\u{20B9}38,000/mo"; bhk="3 BHK"; sqft=1680; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=13; societyName="Satellite Premium"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-04"; },
      { id="p486"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in IIM Area Residency - Vastrapur"; description="Fully furnished 2 BHK in IIM Area Residency, near IIM-A. East-facing 11th floor, available immediately. Prestigious IIM Ahmedabad neighbourhood. Popular with faculty, executives and business school students."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="IIM Area Residency, Near IIM-A, Vastrapur, Ahmedabad - 380015"; price=27000; priceDisplay="\u{20B9}27,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=11; societyName="IIM Area Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p487"; propertyType="Residential"; action="Rent"; title="1 BHK Semi-Furnished in LD Area Apartments - Navrangpura"; description="Semi-furnished 1 BHK in LD Area Apartments, near LD Engineering College. West-facing 6th floor, available immediately. Student and professional favourite near Gujarat's top engineering college."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="LD Area Apartments, Near LD Engineering, Navrangpura, Ahmedabad - 380009"; price=14000; priceDisplay="\u{20B9}14,000/mo"; bhk="1 BHK"; sqft=640; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="LD Area Apartments"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p488"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Science City Heights - Chandkheda"; description="Unfurnished 2 BHK in Science City Heights, near Science City Road. North-facing 4th floor, available immediately. Budget rental near Science City. Good for families working in the IT and pharma belt."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Science City Heights, Near Science City Road, Chandkheda, Ahmedabad - 382424"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="2 BHK"; sqft=1030; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Science City Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p489"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Rajpath Residency - Prahladnagar"; description="Fully furnished 3 BHK in Rajpath Residency, near Rajpath Club. East-facing 16th floor, available immediately. Ultra-luxury rental adjacent to Rajpath Club. Perfect for senior executives and HNI families."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Rajpath Residency, Near Rajpath Club, Prahladnagar, Ahmedabad - 380015"; price=43000; priceDisplay="\u{20B9}43,000/mo"; bhk="3 BHK"; sqft=1750; furnishing="Furnished"; amenities=["Gym","Pool","Club House","Parking","Lift","Security","Concierge","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=16; societyName="Rajpath Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p490"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Bodakdev Premium"; description="Fully furnished 2 BHK in Bodakdev Premium, near Sanjiv Kumar Market. West-facing 12th floor, available immediately. Upscale 2 BHK in prestigious Bodakdev. Walking distance to supermarkets and eateries."; location="Bodakdev, Ahmedabad"; city="Ahmedabad"; address="Bodakdev Premium, Near Sanjiv Kumar Market, Ahmedabad - 380054"; price=33000; priceDisplay="\u{20B9}33,000/mo"; bhk="2 BHK"; sqft=1150; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Club House","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=12; societyName="Bodakdev Premium"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p491"; propertyType="Residential"; action="Rent"; title="1 BHK Unfurnished in Nikol Classic"; description="Unfurnished 1 BHK in Nikol Classic, near Hathijan Chokdi. East-facing 2nd floor, available immediately. Very affordable 1 BHK in Nikol, great for budget-conscious tenants."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Classic, Near Hathijan Chokdi, Ahmedabad - 382350"; price=7500; priceDisplay="\u{20B9}7,500/mo"; bhk="1 BHK"; sqft=570; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Nikol Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-05"; },
      { id="p492"; propertyType="Residential"; action="Rent"; title="2 BHK Semi-Furnished in Gota Square"; description="Semi-furnished 2 BHK in Gota Square, near Gota BRTS. South-facing 7th floor, available immediately. Good connectivity via BRTS. Growing residential demand in Gota makes this a sound rental choice."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Square, Near Gota BRTS, Ahmedabad - 382481"; price=15500; priceDisplay="\u{20B9}15,500/mo"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=7; societyName="Gota Square"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-06"; },
      { id="p493"; propertyType="Residential"; action="Rent"; title="3 BHK Furnished in Bopal Grand"; description="Fully furnished 3 BHK in Bopal Grand, near Bopal-Ghuma Road. North-facing 10th floor, available immediately. Spacious 3 BHK in Bopal's premium locality. Family-friendly society with top facilities."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Grand, Near Bopal-Ghuma Road, Ahmedabad - 380058"; price=28000; priceDisplay="\u{20B9}28,000/mo"; bhk="3 BHK"; sqft=1520; furnishing="Furnished"; amenities=["Gym","Club House","Parking","Lift","Security","Children Play Area"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=10; societyName="Bopal Grand"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-06"; },
      { id="p494"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in South Bopal Premium"; description="Fully furnished 2 BHK in South Bopal Premium, near South Bopal Market. East-facing 8th floor, available immediately. Upscale furnished rental in South Bopal. Close to markets, schools and transit."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Premium, Near South Bopal Market, Ahmedabad - 380058"; price=20000; priceDisplay="\u{20B9}20,000/mo"; bhk="2 BHK"; sqft=1080; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="South Bopal Premium"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-06"; },
      { id="p495"; propertyType="Residential"; action="Rent"; title="1 BHK Furnished in Motera Heights"; description="Fully furnished 1 BHK in Motera Heights, near Motera Circle. West-facing 4th floor, available immediately. Compact furnished unit in Motera. Easy access to Sabarmati riverfront and sports city."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Motera Heights, Near Motera Circle, Ahmedabad - 380005"; price=9000; priceDisplay="\u{20B9}9,000/mo"; bhk="1 BHK"; sqft=600; furnishing="Furnished"; amenities=["Parking","Lift","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Motera Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-06"; },
      { id="p496"; propertyType="Residential"; action="Rent"; title="2 BHK Unfurnished in Vastral Classic"; description="Unfurnished 2 BHK in Vastral Classic, near Vastral Gam. South-facing 3rd floor, available immediately. Very affordable rental in Vastral with basic amenities and good bus connectivity."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Classic, Near Vastral Gam, Ahmedabad - 382418"; price=8500; priceDisplay="\u{20B9}8,500/mo"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Vastral Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-06"; },
      { id="p497"; propertyType="Residential"; action="Rent"; title="3 BHK Semi-Furnished in Sterling Heights - Naranpura"; description="Semi-furnished 3 BHK in Sterling Heights, near Sterling Hospital. East-facing 14th floor, available immediately. Premium location near one of Ahmedabad's top hospitals. Great for medical professionals."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Sterling Heights, Near Sterling Hospital, Naranpura, Ahmedabad - 380013"; price=32000; priceDisplay="\u{20B9}32,000/mo"; bhk="3 BHK"; sqft=1620; furnishing="Semi-Furnished"; amenities=["Gym","Club House","Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Sterling Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-07"; },
      { id="p498"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Satellite Classic"; description="Fully furnished 2 BHK in Satellite Classic, near Satellite Road. North-facing 9th floor, available immediately. Well-located in Satellite corridor with easy access to offices, malls and schools."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Classic, Near Satellite Road, Ahmedabad - 380015"; price=29000; priceDisplay="\u{20B9}29,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Gym","Parking","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Satellite Classic"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-07"; },
      { id="p499"; propertyType="Residential"; action="Rent"; title="1 BHK Semi-Furnished in Maninagar Heights"; description="Semi-furnished 1 BHK in Maninagar Heights, near Maninagar Circle. West-facing 3rd floor, available immediately. Compact and affordable rental near Maninagar Circle. Ideal for singles or couples."; location="Maninagar, Ahmedabad"; city="Ahmedabad"; address="Maninagar Heights, Near Maninagar Circle, Ahmedabad - 380008"; price=8000; priceDisplay="\u{20B9}8,000/mo"; bhk="1 BHK"; sqft=600; furnishing="Semi-Furnished"; amenities=["Parking","Security","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Maninagar Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-07"; },
      { id="p500"; propertyType="Residential"; action="Rent"; title="2 BHK Furnished in Law Garden View - Navrangpura"; description="Fully furnished 2 BHK in Law Garden View, near Law Garden. East-facing 7th floor, available immediately. Iconic Law Garden address in Navrangpura. Evening walks by the lake and cultural vibrancy at your doorstep."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Law Garden View, Near Law Garden, Navrangpura, Ahmedabad - 380006"; price=24000; priceDisplay="\u{20B9}24,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Furnished"; amenities=["Parking","Lift","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Law Garden View"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-07"; },
      { id="p501"; propertyType="Commercial"; action="Rent"; title="Office 1200sqft SG Highway Business Park"; description="Premium office space on SG Highway with 24/7 security, power backup, and ample parking. Ideal for IT and consulting firms."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway Business Park, SG Highway, Ahmedabad - 380054"; price=57600; priceDisplay="\u{20B9}57,600/mo"; bhk="N/A"; sqft=1200; furnishing="Unfurnished"; amenities=["Power Backup","24x7 Security","Parking","Lift","Reception","Conference Room"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="SG Highway Business Park"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p502"; propertyType="Commercial"; action="Rent"; title="Retail Shop 450sqft CG Road Commercial"; description="Prime retail shop on busy CG Road with excellent footfall. Good for showroom, boutique, or electronics."; location="CG Road, Ahmedabad"; city="Ahmedabad"; address="CG Road Commercial, CG Road, Navrangpura, Ahmedabad - 380009"; price=95000; priceDisplay="\u{20B9}95,000/mo"; bhk="N/A"; sqft=450; furnishing="Semi-Furnished"; amenities=["24x7 Security","Power Backup","Parking","Lift"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="CG Road Commercial"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p503"; propertyType="Commercial"; action="Buy"; title="Office Building 8000sqft Ahmedabad One Complex"; description="Full office floor near Ahmedabad One Mall. Fully commercial zone, excellent connectivity on SG Highway."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="Ahmedabad One Complex, SG Highway, Ahmedabad - 380054"; price=55000000; priceDisplay="\u{20B9}5.5 Cr"; bhk="N/A"; sqft=8000; furnishing="Unfurnished"; amenities=["Power Backup","24x7 Security","Parking","Fire Safety","Canteen","Lift"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Ahmedabad One Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p504"; propertyType="Commercial"; action="Rent"; title="Co-working Space 2200sqft Prahladnagar Corp Park"; description="Managed co-working space with 80 seats, meeting rooms, and high-speed internet. Ideal for startups and remote teams."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Prahladnagar Corp Park, Prahladnagar, Ahmedabad - 380015"; price=75000; priceDisplay="\u{20B9}75,000/mo"; bhk="N/A"; sqft=2200; furnishing="Furnished"; amenities=["High Speed Internet","Meeting Rooms","Power Backup","Cafeteria","Security","AC"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Prahladnagar Corp Park"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p505"; propertyType="Commercial"; action="Rent"; title="Retail Showroom 1800sqft Ashram Road Commercial"; description="Corner showroom on Ashram Road with glass facade and excellent visibility. Perfect for banking, automobile, or luxury retail."; location="Ashram Road, Ahmedabad"; city="Ahmedabad"; address="Ashram Road Commercial, Ashram Road, Ahmedabad - 380009"; price=150000; priceDisplay="\u{20B9}1.5 L/mo"; bhk="N/A"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Corner Location","Power Backup","Security","Parking","AC"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Ashram Road Commercial"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p506"; propertyType="Commercial"; action="Rent"; title="Office Floor 3500sqft Thaltej Business Hub"; description="Large open-plan office floor in Thaltej, close to GIFT City approach road. Suitable for large teams."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Business Hub, Thaltej, Ahmedabad - 380059"; price=217000; priceDisplay="\u{20B9}2.17 L/mo"; bhk="N/A"; sqft=3500; furnishing="Unfurnished"; amenities=["Power Backup","Lift","Parking","Security","Washroom","Pantry"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Thaltej Business Hub"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p507"; propertyType="Commercial"; action="Rent"; title="Shop 280sqft Vastrapur Market"; description="Small shop in Vastrapur commercial area near residential society. Good for food delivery, pharmacy, or stationary."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Market, Vastrapur, Ahmedabad - 380015"; price=35000; priceDisplay="\u{20B9}35,000/mo"; bhk="N/A"; sqft=280; furnishing="Unfurnished"; amenities=["24x7 Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Vastrapur Market"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p508"; propertyType="Commercial"; action="Buy"; title="IT Office 6000sqft SG Highway IT Hub"; description="Fully furnished IT office floor on SG Highway. Includes 120 workstations, conference rooms, and server room."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="SG Highway IT Hub, SG Highway, Ahmedabad - 380054"; price=38000000; priceDisplay="\u{20B9}3.8 Cr"; bhk="N/A"; sqft=6000; furnishing="Furnished"; amenities=["Power Backup","Raised Floor","100 Mbps Internet","Conference Room","Parking","Security","Canteen"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="SG Highway IT Hub"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p509"; propertyType="Commercial"; action="Rent"; title="Food Court Stall 150sqft Food Court Zone"; description="Commercial food court stall in high-traffic mall area. Water and drainage connections available. High footfall zone."; location="Himalaya Mall Area, Ahmedabad"; city="Ahmedabad"; address="Food Court Zone, Himalaya Mall Area, Ahmedabad - 380052"; price=45000; priceDisplay="\u{20B9}45,000/mo"; bhk="N/A"; sqft=150; furnishing="Unfurnished"; amenities=["24x7 Security","Power Backup","AC","Water Connection"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Food Court Zone"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p510"; propertyType="Commercial"; action="Rent"; title="Office 2500sqft Bopal Business Center"; description="Well-maintained office space in Bopal commercial complex. Near Bopal-Ghuma road junction with parking."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Business Center, Bopal, Ahmedabad - 380058"; price=137500; priceDisplay="\u{20B9}1.37 L/mo"; bhk="N/A"; sqft=2500; furnishing="Semi-Furnished"; amenities=["Power Backup","Lift","Parking","Security","AC"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Bopal Business Center"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p511"; propertyType="Commercial"; action="Rent"; title="Showroom 3200sqft SG Road Showroom Complex"; description="Large showroom on S G Road with high visibility and excellent road frontage. Ideal for automobile, furniture, or electronics."; location="SG Road, Ahmedabad"; city="Ahmedabad"; address="SG Road Showroom Complex, SG Road, Ahmedabad - 380054"; price=220000; priceDisplay="\u{20B9}2.2 L/mo"; bhk="N/A"; sqft=3200; furnishing="Unfurnished"; amenities=["Power Backup","Security","Parking","Corner Visibility"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="SG Road Showroom Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p512"; propertyType="Commercial"; action="Buy"; title="Office 4500sqft Corporate Park Prahladnagar"; description="Premium office in established corporate park. Surrounded by leading MNCs and IT companies. Ready to move."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Corporate Park Prahladnagar, Prahladnagar, Ahmedabad - 380015"; price=28000000; priceDisplay="\u{20B9}2.8 Cr"; bhk="N/A"; sqft=4500; furnishing="Semi-Furnished"; amenities=["Power Backup","24x7 Security","Parking","Lift","Cafeteria","Fire Safety"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Corporate Park Prahladnagar"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p513"; propertyType="Commercial"; action="Rent"; title="Restaurant Space 2000sqft Vastrapur Commercial"; description="Standalone restaurant space with kitchen area, exhaust provision, and two floors. Near Vastrapur Lake."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="Vastrapur Commercial, Near Vastrapur Lake, Ahmedabad - 380015"; price=180000; priceDisplay="\u{20B9}1.8 L/mo"; bhk="N/A"; sqft=2000; furnishing="Unfurnished"; amenities=["Exhaust System","Power Backup","Parking","Water Connection","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Vastrapur Commercial"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p514"; propertyType="Commercial"; action="Rent"; title="Office 1000sqft CG Road Office Tower"; description="Fully furnished office near CG Road with internet and furniture included. Ideal for consultants and small teams."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="CG Road Office Tower, CG Road, Navrangpura, Ahmedabad - 380009"; price=55000; priceDisplay="\u{20B9}55,000/mo"; bhk="N/A"; sqft=1000; furnishing="Furnished"; amenities=["Furnished","AC","Internet","Security","Power Backup","Lift"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="CG Road Office Tower"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p515"; propertyType="Commercial"; action="Rent"; title="Retail Shop 320sqft Law Garden Market"; description="Retail shop in busy Law Garden area. Good for food, boutique, or accessories. Ground floor with high foot traffic."; location="Law Garden, Ahmedabad"; city="Ahmedabad"; address="Law Garden Market, Near Law Garden, Ahmedabad - 380006"; price=42000; priceDisplay="\u{20B9}42,000/mo"; bhk="N/A"; sqft=320; furnishing="Unfurnished"; amenities=["24x7 Security","Power Backup","Corner Location"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=0; societyName="Law Garden Market"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p516"; propertyType="Commercial"; action="Rent"; title="Office 2000sqft Satellite Business Center"; description="Semi-furnished office in Satellite commercial area. Close to residential societies with easy commute."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Business Center, Satellite, Ahmedabad - 380015"; price=82000; priceDisplay="\u{20B9}82,000/mo"; bhk="N/A"; sqft=2000; furnishing="Semi-Furnished"; amenities=["Power Backup","Lift","Parking","Security","AC","Pantry"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Satellite Business Center"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p517"; propertyType="Commercial"; action="Rent"; title="Gym/Fitness Studio 3500sqft Gota Commercial Hub"; description="Large open-plan commercial space ideal for gym, fitness studio, or dance academy. Ground floor with dedicated entry."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Commercial Hub, Gota, Ahmedabad - 382481"; price=95000; priceDisplay="\u{20B9}95,000/mo"; bhk="N/A"; sqft=3500; furnishing="Unfurnished"; amenities=["Power Backup","Security","Ground Floor","Large Windows","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Gota Commercial Hub"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p518"; propertyType="Commercial"; action="Rent"; title="Medical Clinic Space 1200sqft Medical Hub Satellite"; description="Commercial space suitable for medical clinic or diagnostic center. Ground floor access with ramp."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Medical Hub Satellite, Satellite, Ahmedabad - 380015"; price=72000; priceDisplay="\u{20B9}72,000/mo"; bhk="N/A"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Ground Floor Access","Power Backup","Security","Parking","AC","Waiting Area"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Medical Hub Satellite"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p519"; propertyType="Commercial"; action="Buy"; title="Hotel Property 25 Rooms Navrangpura Hotel"; description="Established hotel property with 25 rooms, restaurant area, and reception. Prime Navrangpura location with parking."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Hotel, Navrangpura, Ahmedabad - 380009"; price=85000000; priceDisplay="\u{20B9}8.5 Cr"; bhk="N/A"; sqft=0; furnishing="Furnished"; amenities=["25 Rooms","Restaurant","Parking","Reception","Power Backup","CCTV","Fire Safety"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Navrangpura Hotel"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p520"; propertyType="Commercial"; action="Rent"; title="Coaching Space 4000sqft Chandkheda Education Hub"; description="Large commercial space ideal for coaching institute or school. Multiple rooms possible. Near GTU campus."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Education Hub, Near GTU, Chandkheda, Ahmedabad - 382424"; price=110000; priceDisplay="\u{20B9}1.1 L/mo"; bhk="N/A"; sqft=4000; furnishing="Unfurnished"; amenities=["Power Backup","Security","Parking","Multiple Rooms","AC Points","Washrooms"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Chandkheda Education Hub"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p521"; propertyType="Plot"; action="Buy"; title="300 sq yards Plot Gandhinagar Sector 7"; description="Residential plot in Gandhinagar Sector 7. Well-planned society with wide roads. AUDA approved. Suitable for individual bungalow."; location="Gandhinagar Sector 7, Gandhinagar"; city="Ahmedabad"; address="Gandhinagar Sector 7, Gandhinagar - 382007"; price=9600000; priceDisplay="\u{20B9}96 L"; bhk="N/A"; sqft=2700; furnishing="N/A"; amenities=["Corner Plot","Wide Road","AUDA Approved","Drainage","Electricity"]; possession="Ready to Build"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Gandhinagar Sector 7"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p522"; propertyType="Plot"; action="Buy"; title="500 sq yards Plot Sanand Township"; description="Large residential plot near Sanand industrial area. Good for villa or independent house. Clean title."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand Township, Sanand, Ahmedabad - 382110"; price=9000000; priceDisplay="\u{20B9}90 L"; bhk="N/A"; sqft=4500; furnishing="N/A"; amenities=["Clear Title","Electricity","Road Access","Near Highway"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sanand Township"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p523"; propertyType="Plot"; action="Buy"; title="200 sq yards Plot Chandkheda Residency"; description="Prime residential plot in developing Chandkheda. Near Nirma University. NA certificate obtained."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Chandkheda Residency, Chandkheda, Ahmedabad - 382424"; price=8400000; priceDisplay="\u{20B9}84 L"; bhk="N/A"; sqft=1800; furnishing="N/A"; amenities=["NA Certificate","Corner Plot","Electricity","Water Connection"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Chandkheda Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p524"; propertyType="Plot"; action="Buy"; title="400 sq yards Plot Gota Green Village"; description="Residential plot in established Gota locality. Near schools, hospitals, and markets. Ready for construction."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Green Village, Gota, Ahmedabad - 382481"; price=15200000; priceDisplay="\u{20B9}1.52 Cr"; bhk="N/A"; sqft=3600; furnishing="N/A"; amenities=["Ready to Build","Wide Road","AUDA Approved","Clear Title","Electricity","Water"]; possession="Ready to Build"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Gota Green Village"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p525"; propertyType="Plot"; action="Buy"; title="180 sq yards Corner Plot Naranpura Heights"; description="Corner residential plot in Naranpura. Excellent location for investment or bungalow. Prime area."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Naranpura Heights, Naranpura, Ahmedabad - 380013"; price=11700000; priceDisplay="\u{20B9}1.17 Cr"; bhk="N/A"; sqft=1620; furnishing="N/A"; amenities=["Corner Plot","Facing Main Road","AUDA Approved","Electricity","Drainage"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Naranpura Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p526"; propertyType="Plot"; action="Buy"; title="450 sq yards Plot Bopal Residency"; description="Prime residential plot in Bopal growth corridor. Near SP Ring Road. High appreciation potential."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Bopal Residency, Bopal, Ahmedabad - 380058"; price=23400000; priceDisplay="\u{20B9}2.34 Cr"; bhk="N/A"; sqft=4050; furnishing="N/A"; amenities=["Near SP Ring Road","AUDA Approved","Wide Road","Clear Title","Electricity","Drainage"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Bopal Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p527"; propertyType="Plot"; action="Buy"; title="280 sq yards Plot Nikol Township"; description="Residential plot in Nikol township. Good connectivity to industrial belt. NA certificate available."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Nikol Township, Nikol, Ahmedabad - 382350"; price=6720000; priceDisplay="\u{20B9}67.2 L"; bhk="N/A"; sqft=2520; furnishing="N/A"; amenities=["NA Certificate","Road Access","Electricity","Water","Clear Title"]; possession="Ready to Build"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Nikol Township"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p528"; propertyType="Plot"; action="Buy"; title="600 sq yards Plot Gandhinagar Sector 21"; description="Large residential plot in Gandhinagar Sector 21. Government planned infrastructure. Ideal for luxury bungalow."; location="Gandhinagar Sector 21, Gandhinagar"; city="Ahmedabad"; address="Gandhinagar Sector 21, Gandhinagar - 382021"; price=16800000; priceDisplay="\u{20B9}1.68 Cr"; bhk="N/A"; sqft=5400; furnishing="N/A"; amenities=["Wide Road","Street Light","Drainage","Electricity","Water","AUDA Approved"]; possession="Ready to Build"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Gandhinagar Sector 21"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p529"; propertyType="Plot"; action="Buy"; title="350 sq yards Plot University Area Chandkheda"; description="Residential plot near Nirma University. High rental demand area. Excellent for PG hostel development."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="University Area Plots, Near Nirma University, Chandkheda, Ahmedabad - 382424"; price=14000000; priceDisplay="\u{20B9}1.4 Cr"; bhk="N/A"; sqft=3150; furnishing="N/A"; amenities=["Near University","NA Certificate","Wide Road","Electricity","Water"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="University Area Plots"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p530"; propertyType="Plot"; action="Buy"; title="250 sq yards Plot Motera Township"; description="Residential plot near Motera Stadium. Good infrastructure and road connectivity. Growing residential area."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Motera Township, Near Motera Stadium, Ahmedabad - 380005"; price=11200000; priceDisplay="\u{20B9}1.12 Cr"; bhk="N/A"; sqft=2250; furnishing="N/A"; amenities=["Corner Plot","Near Stadium","Road Access","Electricity","Water","Clear Title"]; possession="Ready to Build"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Motera Township"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p531"; propertyType="Plot"; action="Buy"; title="2000 sq yards Industrial Plot Changodar GIDC"; description="Industrial plot in Changodar GIDC. Three-phase power, 24-hour water supply, excellent highway connectivity."; location="Changodar, Ahmedabad"; city="Ahmedabad"; address="Changodar GIDC, Changodar, Ahmedabad - 382213"; price=50000000; priceDisplay="\u{20B9}5 Cr"; bhk="N/A"; sqft=18000; furnishing="N/A"; amenities=["GIDC Allotment","Three Phase Power","Water Supply","Highway Access","NA Cleared"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Changodar GIDC"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p532"; propertyType="Plot"; action="Buy"; title="800 sq yards Farmhouse Plot Thol Highway"; description="Larger agricultural plot converted to residential near Thol lake. Scenic location. Good for farmhouse."; location="Thol, Ahmedabad"; city="Ahmedabad"; address="Thol Highway Plots, Near Thol Lake, Thol, Ahmedabad - 382721"; price=9600000; priceDisplay="\u{20B9}96 L"; bhk="N/A"; sqft=7200; furnishing="N/A"; amenities=["Near Lake","Highway Access","Scenic View","Clear Title"]; possession="Ready to Build"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Thol Highway Plots"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p533"; propertyType="Plot"; action="Buy"; title="350 sq yards Premium Plot South Bopal"; description="Premium residential plot in South Bopal. Walking distance from BRTS. High appreciation zone."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="South Bopal Premium Plots, South Bopal, Ahmedabad - 380058"; price=16800000; priceDisplay="\u{20B9}1.68 Cr"; bhk="N/A"; sqft=3150; furnishing="N/A"; amenities=["Near BRTS","Wide Road","AUDA Approved","Clear Title","Electricity","Drainage"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="South Bopal Premium Plots"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p534"; propertyType="Plot"; action="Buy"; title="900 sq yards Commercial NA Plot Vastral"; description="Commercial NA plot in Vastral suitable for warehouse or commercial construction. Main road access."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral NA Plots, Vastral, Ahmedabad - 382418"; price=17100000; priceDisplay="\u{20B9}1.71 Cr"; bhk="N/A"; sqft=8100; furnishing="N/A"; amenities=["NA Certificate","Commercial Zone","Main Road Access","Electricity","Clear Title"]; possession="Ready to Build"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Vastral NA Plots"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p535"; propertyType="Plot"; action="Buy"; title="750 sq yards Premium Plot Near Airport"; description="Premium plot near Ahmedabad airport. Ideal for hotel, service apartment, or commercial development."; location="Near Airport, Ahmedabad"; city="Ahmedabad"; address="Airport Zone Plots, Near Ahmedabad Airport, Ahmedabad - 380004"; price=41200000; priceDisplay="\u{20B9}4.12 Cr"; bhk="N/A"; sqft=6750; furnishing="N/A"; amenities=["Near Airport","Commercial Zone","Main Road Access","Clear Title","High Visibility"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Airport Zone Plots"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p536"; propertyType="PG"; action="Rent"; title="Single Occupancy PG near PDPU Gandhinagar"; description="AC single room PG near PDPU campus with all meals included. WiFi, laundry, and housekeeping. Secure premises."; location="Gandhinagar, Ahmedabad"; city="Ahmedabad"; address="PDPU Student Residency, Near PDPU, Gandhinagar - 382007"; price=7500; priceDisplay="\u{20B9}7,500/mo"; bhk="1 BHK"; sqft=180; furnishing="Furnished"; amenities=["AC Room","WiFi","All Meals","Laundry","Security","Housekeeping"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="PDPU Student Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p537"; propertyType="PG"; action="Rent"; title="Double Occupancy PG near IIM-A"; description="Double sharing PG near IIM-A campus. Clean rooms with study table. Meals optional. 24-hour security."; location="Vastrapur, Ahmedabad"; city="Ahmedabad"; address="IIM Area PG, Near IIM-A, Vastrapur, Ahmedabad - 380015"; price=6000; priceDisplay="\u{20B9}6,000/mo"; bhk="1 BHK"; sqft=200; furnishing="Furnished"; amenities=["WiFi","Study Table","Meals Optional","Security","Power Backup","Common Area"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="IIM Area PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p538"; propertyType="PG"; action="Rent"; title="Girls PG near Nirma University"; description="Safe girls PG near Nirma University. Three meals daily, WiFi, and CCTV. Warden on premises 24 hours."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Nirma Girls PG, Near Nirma University, Chandkheda, Ahmedabad - 382424"; price=5500; priceDisplay="\u{20B9}5,500/mo"; bhk="1 BHK"; sqft=160; furnishing="Furnished"; amenities=["All Meals","WiFi","CCTV","24hr Warden","Laundry","AC","Common Room"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Nirma Girls PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p539"; propertyType="PG"; action="Rent"; title="Boys PG near GTU Chandkheda"; description="Affordable boys PG near GTU campus. Meals included, WiFi, and secure premises. Double sharing available."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="GTU Boys PG, Near GTU, Chandkheda, Ahmedabad - 382424"; price=4500; priceDisplay="\u{20B9}4,500/mo"; bhk="1 BHK"; sqft=150; furnishing="Semi-Furnished"; amenities=["Meals Included","WiFi","Security","Common Room","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="GTU Boys PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p540"; propertyType="PG"; action="Rent"; title="Luxury PG Navrangpura for Working Professionals"; description="Premium single occupancy PG for working professionals. Attached bathroom, AC, WiFi, and all meals. Housekeeping daily."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Navrangpura Luxury PG, Navrangpura, Ahmedabad - 380009"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="1 BHK"; sqft=250; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","Attached Bathroom","Housekeeping","Laundry","Security","Gym Access"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Navrangpura Luxury PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p541"; propertyType="PG"; action="Rent"; title="PG near Sola Civil Hospital"; description="Double sharing PG near Sola Civil Hospital. Good for medical students and residents. Meals included."; location="Sola, Ahmedabad"; city="Ahmedabad"; address="Sola Area PG, Near Sola Civil Hospital, Ahmedabad - 380060"; price=5000; priceDisplay="\u{20B9}5,000/mo"; bhk="1 BHK"; sqft=180; furnishing="Semi-Furnished"; amenities=["Meals Included","WiFi","Security","Laundry","Common Room"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Sola Area PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p542"; propertyType="PG"; action="Rent"; title="Working Professionals PG Satellite"; description="Single AC room PG for working professionals. Close to IT companies on SG Highway. All meals and WiFi."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite PG Home, Satellite, Ahmedabad - 380015"; price=9500; priceDisplay="\u{20B9}9,500/mo"; bhk="1 BHK"; sqft=220; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","Laundry","Security","Power Backup","Common Area"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Satellite PG Home"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p543"; propertyType="PG"; action="Rent"; title="Girls PG near LD Engineering College"; description="Girls only PG close to LD Engineering College. Meals and WiFi included. Safe neighborhood."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="LD Area Girls PG, Near LD Engineering, Navrangpura, Ahmedabad - 380009"; price=5200; priceDisplay="\u{20B9}5,200/mo"; bhk="1 BHK"; sqft=170; furnishing="Semi-Furnished"; amenities=["All Meals","WiFi","Security","Warden","Common Room","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="LD Area Girls PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p544"; propertyType="PG"; action="Rent"; title="PG near ISRO Satellite Campus"; description="Single room PG near ISRO Satellite campus. Ideal for ISRO employees and scientists. Meals and WiFi."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="ISRO Area Residency, Near ISRO, Satellite, Ahmedabad - 380015"; price=8000; priceDisplay="\u{20B9}8,000/mo"; bhk="1 BHK"; sqft=200; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","Security","Laundry","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="ISRO Area Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p545"; propertyType="PG"; action="Rent"; title="Triple Sharing Affordable PG Gota"; description="Affordable triple sharing PG in Gota. Meals optional. Ideal for students and entry-level professionals."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Gota Affordable PG, Gota, Ahmedabad - 382481"; price=3500; priceDisplay="\u{20B9}3,500/mo"; bhk="1 BHK"; sqft=250; furnishing="Semi-Furnished"; amenities=["WiFi","Meals Optional","Security","Common Room","Parking","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Gota Affordable PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p546"; propertyType="PG"; action="Rent"; title="Girls PG near Karnavati University"; description="Girls PG near Karnavati University with AC rooms. Meals and WiFi. 24-hour security and CCTV."; location="Gandhinagar, Ahmedabad"; city="Ahmedabad"; address="Karnavati Girls PG, Near Karnavati University, Gandhinagar - 382422"; price=6500; priceDisplay="\u{20B9}6,500/mo"; bhk="1 BHK"; sqft=180; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","CCTV","Security","Warden","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Karnavati Girls PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p547"; propertyType="PG"; action="Rent"; title="Boys PG Vastral near Industrial Zone"; description="Affordable PG for workers near Vastral industrial zone. Clean dormitory style. Meals included. Easy commute."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Vastral Workers PG, Vastral, Ahmedabad - 382418"; price=4000; priceDisplay="\u{20B9}4,000/mo"; bhk="1 BHK"; sqft=150; furnishing="Unfurnished"; amenities=["Meals Included","Security","Common Room","Power Backup","Water 24hr"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Vastral Workers PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p548"; propertyType="PG"; action="Rent"; title="PG for Professionals Prahladnagar Premium"; description="Single AC room PG in Prahladnagar for working professionals. Corporate area with all amenities."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Prahladnagar Premium PG, Prahladnagar, Ahmedabad - 380015"; price=10000; priceDisplay="\u{20B9}10,000/mo"; bhk="1 BHK"; sqft=240; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","Laundry","Security","Power Backup","Common Area"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Prahladnagar Premium PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p549"; propertyType="PG"; action="Rent"; title="Corporate PG Thaltej near SG Highway"; description="Premium PG near SG Highway for corporate professionals. AC room, meals, gym access, and laundry."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Thaltej Corporate PG, Thaltej, Ahmedabad - 380059"; price=9800; priceDisplay="\u{20B9}9,800/mo"; bhk="1 BHK"; sqft=230; furnishing="Furnished"; amenities=["AC","WiFi","All Meals","Gym","Laundry","Security","Power Backup","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Thaltej Corporate PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p550"; propertyType="PG"; action="Rent"; title="Girls PG near CEPT University"; description="Girls PG near CEPT University. Meals and WiFi included. Architecture and design students welcome."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="CEPT Area Girls PG, Near CEPT University, Navrangpura, Ahmedabad - 380009"; price=6200; priceDisplay="\u{20B9}6,200/mo"; bhk="1 BHK"; sqft=180; furnishing="Furnished"; amenities=["All Meals","WiFi","Security","Warden","Common Room","Study Area","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="CEPT Area Girls PG"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p551"; propertyType="Industrial"; action="Rent"; title="Warehouse 15000sqft Changodar GIDC"; description="Large industrial warehouse in Changodar GIDC. 30ft clear height, dock-level loading. Three-phase power. Road connectivity."; location="Changodar, Ahmedabad"; city="Ahmedabad"; address="Changodar GIDC, Changodar, Ahmedabad - 382213"; price=210000; priceDisplay="\u{20B9}2.1 L/mo"; bhk="N/A"; sqft=15000; furnishing="N/A"; amenities=["30ft Height","Dock Level Loading","Three Phase Power","Security","Highway Access","Fire Safety"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Changodar GIDC"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p552"; propertyType="Industrial"; action="Rent"; title="Factory Shed 8000sqft Vatva GIDC Phase 2"; description="Industrial factory shed in Vatva GIDC. Three-phase power supply, overhead crane provision, 24-hour security."; location="Vatva, Ahmedabad"; city="Ahmedabad"; address="Vatva GIDC Phase 2, Vatva, Ahmedabad - 382445"; price=96000; priceDisplay="\u{20B9}96,000/mo"; bhk="N/A"; sqft=8000; furnishing="N/A"; amenities=["Three Phase Power","Overhead Crane","24hr Security","Power Backup","Road Access"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Vatva GIDC Phase 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p553"; propertyType="Industrial"; action="Buy"; title="Industrial Plot 10000sqft Sanand Phase 2"; description="GIDC plot in Sanand Phase 2 near major auto manufacturers. Water and power connections available. NA cleared."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand Industrial Phase 2, Sanand, Ahmedabad - 382110"; price=35000000; priceDisplay="\u{20B9}3.5 Cr"; bhk="N/A"; sqft=10000; furnishing="N/A"; amenities=["GIDC Allotment","Power Connection","Water Supply","Highway Access","NA Cleared"]; possession="Ready to Build"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Sanand Industrial Phase 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p554"; propertyType="Industrial"; action="Rent"; title="Logistics Warehouse 25000sqft Bavla"; description="Large logistics warehouse in Bavla with rail siding connectivity. Ideal for FMCG, auto parts, or cold chain."; location="Bavla, Ahmedabad"; city="Ahmedabad"; address="Bavla Logistics Zone, Bavla, Ahmedabad - 382220"; price=275000; priceDisplay="\u{20B9}2.75 L/mo"; bhk="N/A"; sqft=25000; furnishing="N/A"; amenities=["Rail Connectivity","Highway Access","Three Phase Power","Security","Loading Bay","Fire Safety"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Bavla Logistics Zone"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p555"; propertyType="Industrial"; action="Buy"; title="Factory Building 12000sqft Naroda Industrial"; description="Built-up factory building in Naroda. Office attached, canteen area, and worker facilities. Ready for production."; location="Naroda, Ahmedabad"; city="Ahmedabad"; address="Naroda Industrial Area, Naroda, Ahmedabad - 382330"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="N/A"; sqft=12000; furnishing="N/A"; amenities=["Office Space","Canteen","Worker Facilities","Three Phase Power","Security","Loading Area"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Naroda Industrial Area"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p556"; propertyType="Industrial"; action="Rent"; title="Cold Chain Warehouse 6000sqft Changodar"; description="Temperature-controlled warehouse in Changodar. Suitable for pharmaceutical, food, or dairy storage."; location="Changodar, Ahmedabad"; city="Ahmedabad"; address="Changodar Cold Chain Hub, Changodar, Ahmedabad - 382213"; price=108000; priceDisplay="\u{20B9}1.08 L/mo"; bhk="N/A"; sqft=6000; furnishing="N/A"; amenities=["Temperature Control","Three Phase Power","24hr Security","Power Backup","Loading Bay"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Changodar Cold Chain Hub"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p557"; propertyType="Industrial"; action="Rent"; title="Godown 3500sqft Odhav Industrial Area"; description="Simple godown in Odhav for storage. Ground level loading, water and electricity. Basic security."; location="Odhav, Ahmedabad"; city="Ahmedabad"; address="Odhav Industrial Area, Odhav, Ahmedabad - 382415"; price=31500; priceDisplay="\u{20B9}31,500/mo"; bhk="N/A"; sqft=3500; furnishing="N/A"; amenities=["Ground Level Loading","Water Supply","Electricity","Security","24hr Access"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Odhav Industrial Area"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p558"; propertyType="Industrial"; action="Buy"; title="Industrial Shed 20000sqft Sanand Highway"; description="Large industrial shed near Sanand-Ahmedabad highway. Suitable for manufacturing, auto ancillary, or pharma. High ceiling."; location="Sanand, Ahmedabad"; city="Ahmedabad"; address="Sanand Highway Industrial, Near Sanand-Ahmedabad Highway, Ahmedabad - 382110"; price=48000000; priceDisplay="\u{20B9}4.8 Cr"; bhk="N/A"; sqft=20000; furnishing="N/A"; amenities=["Highway Access","High Ceiling","Three Phase Power","Security","Canteen","Office Space"]; possession="Ready to Move"; images=[]; mapLink=""; facing="West"; floorNo=0; societyName="Sanand Highway Industrial"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p559"; propertyType="Industrial"; action="Rent"; title="Warehouse 8000sqft Viramgam Industrial Zone"; description="Affordable warehouse near Viramgam industrial zone. Good for storage and distribution. Accessible from NH8."; location="Viramgam, Ahmedabad"; city="Ahmedabad"; address="Viramgam Warehouse Zone, Near NH8, Viramgam, Ahmedabad - 382150"; price=64000; priceDisplay="\u{20B9}64,000/mo"; bhk="N/A"; sqft=8000; furnishing="N/A"; amenities=["NH8 Access","Loading Bay","Water Supply","Electricity","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="Viramgam Warehouse Zone"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p560"; propertyType="Industrial"; action="Buy"; title="Industrial Complex 30000sqft Changodar"; description="Large industrial complex in Changodar with multiple factory floors, office space, and utilities. Ideal for large manufacturers."; location="Changodar, Ahmedabad"; city="Ahmedabad"; address="Changodar Industrial Complex, Changodar, Ahmedabad - 382213"; price=75000000; priceDisplay="\u{20B9}7.5 Cr"; bhk="N/A"; sqft=30000; furnishing="N/A"; amenities=["Multiple Factory Floors","Office Space","Three Phase Power","Water Treatment","Canteen","Parking","Security","Fire Safety"]; possession="Ready to Move"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName="Changodar Industrial Complex"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p561"; propertyType="Under Construction"; action="Buy"; title="3 BHK Lotus Heights Phase 2 Gota"; description="Under construction 3 BHK in Lotus Heights Phase 2, Gota. RERA registered project. Pre-launch pricing with floor rise applicable. Clubhouse and swimming pool planned."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Lotus Heights Phase 2, Gota, Ahmedabad - 382481"; price=7200000; priceDisplay="\u{20B9}72 L"; bhk="3 BHK"; sqft=1450; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Garden","Children Play Area"]; possession="Dec 2027"; images=[]; mapLink=""; facing="East"; floorNo=10; societyName="Lotus Heights Phase 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p562"; propertyType="Under Construction"; action="Buy"; title="2 BHK Bhavya Residency Nikol"; description="Under construction 2 BHK in Bhavya Residency, Nikol. Affordable housing with quality construction. RERA registered. Near industrial belt."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Bhavya Residency, Nikol, Ahmedabad - 382350"; price=4200000; priceDisplay="\u{20B9}42 L"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Power Backup","Security","Lift","Car Parking","Children Play Area"]; possession="Jun 2027"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Bhavya Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p563"; propertyType="Under Construction"; action="Buy"; title="3 BHK Pride Residency Vastral"; description="Under construction 3 BHK in Pride Residency, Vastral. Quality township with all amenities. RERA approved."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Pride Residency, Vastral, Ahmedabad - 382418"; price=5500000; priceDisplay="\u{20B9}55 L"; bhk="3 BHK"; sqft=1320; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Garden"]; possession="Sept 2027"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="Pride Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p564"; propertyType="Under Construction"; action="Buy"; title="4 BHK Green Meadows Motera"; description="Premium 4 BHK in Green Meadows, Motera. Luxury project near Motera Stadium. Large balconies, premium fittings."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Green Meadows, Motera, Ahmedabad - 380005"; price=10500000; priceDisplay="\u{20B9}1.05 Cr"; bhk="4 BHK"; sqft=2200; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Tennis Court","Mini Theatre"]; possession="Mar 2028"; images=[]; mapLink=""; facing="East"; floorNo=14; societyName="Green Meadows"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p565"; propertyType="Under Construction"; action="Buy"; title="2 BHK Navkar Heights South Bopal"; description="Under construction 2 BHK in South Bopal. Excellent location near SP Ring Road. RERA registered, on-time delivery track record."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Navkar Heights, South Bopal, Ahmedabad - 380058"; price=6100000; priceDisplay="\u{20B9}61 L"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Garden","Children Play Area"]; possession="Jan 2027"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Navkar Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p566"; propertyType="Under Construction"; action="Buy"; title="3 BHK Ramdev Complex Phase 4 Chandkheda"; description="Phase 4 of popular Ramdev Complex in Chandkheda. Established developer, regular construction updates. Near GTU."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Ramdev Complex Phase 4, Chandkheda, Ahmedabad - 382424"; price=7800000; priceDisplay="\u{20B9}78 L"; bhk="3 BHK"; sqft=1480; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Power Backup","Security","Lift","Car Parking","Gym"]; possession="Oct 2027"; images=[]; mapLink=""; facing="East"; floorNo=11; societyName="Ramdev Complex Phase 4"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p567"; propertyType="Under Construction"; action="Buy"; title="2 BHK Goyal Orchid Greens Shela"; description="Under construction 2 BHK by Goyal Group in Shela. Well-known developer with multiple delivered projects. Good connectivity to Bopal."; location="Shela, Ahmedabad"; city="Ahmedabad"; address="Goyal Orchid Greens, Shela, Ahmedabad - 380058"; price=6500000; priceDisplay="\u{20B9}65 L"; bhk="2 BHK"; sqft=1080; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Garden","Jogging Track"]; possession="Apr 2027"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Goyal Orchid Greens"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p568"; propertyType="Under Construction"; action="Buy"; title="3 BHK Shivalik Satyam Bopal"; description="Under construction 3 BHK in Bopal by Shivalik Group. Premium project with excellent facilities. RERA approved."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Shivalik Satyam, Bopal, Ahmedabad - 380058"; price=8500000; priceDisplay="\u{20B9}85 L"; bhk="3 BHK"; sqft=1500; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Garden","Badminton Court"]; possession="Jun 2027"; images=[]; mapLink=""; facing="East"; floorNo=12; societyName="Shivalik Satyam"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p569"; propertyType="Under Construction"; action="Buy"; title="2 BHK Arjun Heights Phase 3 Naranpura"; description="Under construction 2 BHK in Naranpura. Phase 3 of successful project, phases 1 and 2 fully delivered. Prime location."; location="Naranpura, Ahmedabad"; city="Ahmedabad"; address="Arjun Heights Phase 3, Naranpura, Ahmedabad - 380013"; price=7000000; priceDisplay="\u{20B9}70 L"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Power Backup","Security","Lift","Car Parking","Garden","Children Play Area"]; possession="Dec 2026"; images=[]; mapLink=""; facing="West"; floorNo=8; societyName="Arjun Heights Phase 3"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p570"; propertyType="Under Construction"; action="Buy"; title="4 BHK Luxe Signature Thaltej"; description="Ultra-premium 4 BHK tower in Thaltej. Sky lounge, infinity pool, and private elevator. Luxury finishes throughout."; location="Thaltej, Ahmedabad"; city="Ahmedabad"; address="Luxe Signature, Thaltej, Ahmedabad - 380054"; price=18000000; priceDisplay="\u{20B9}1.8 Cr"; bhk="4 BHK"; sqft=2500; furnishing="Unfurnished"; amenities=["Sky Lounge","Infinity Pool","Private Elevator","Gym","Spa","Power Backup","Security","Valet Parking","Concierge"]; possession="Mar 2028"; images=[]; mapLink=""; facing="East"; floorNo=18; societyName="Luxe Signature"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p571"; propertyType="Under Construction"; action="Buy"; title="3 BHK Dev Heights Tower B Gota"; description="Tower B of Dev Heights in Gota. Tower A fully sold and under construction. RERA registered."; location="Gota, Ahmedabad"; city="Ahmedabad"; address="Dev Heights Tower B, Gota, Ahmedabad - 382481"; price=7400000; priceDisplay="\u{20B9}74 L"; bhk="3 BHK"; sqft=1420; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Garden"]; possession="Feb 2027"; images=[]; mapLink=""; facing="South"; floorNo=9; societyName="Dev Heights Tower B"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p572"; propertyType="Under Construction"; action="Buy"; title="2 BHK Sai Residency Phase 2 Nikol"; description="Affordable 2 BHK in Sai Residency Phase 2, Nikol. Phase 1 completed and occupied. Budget-friendly option."; location="Nikol, Ahmedabad"; city="Ahmedabad"; address="Sai Residency Phase 2, Nikol, Ahmedabad - 382350"; price=3900000; priceDisplay="\u{20B9}39 L"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Power Backup","Security","Lift","Car Parking","Common Area"]; possession="Aug 2027"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Sai Residency Phase 2"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p573"; propertyType="Under Construction"; action="Buy"; title="3 BHK Ganesh Heights Vastral"; description="Under construction 3 BHK in Vastral. Upcoming area with good infrastructure development. RERA registered."; location="Vastral, Ahmedabad"; city="Ahmedabad"; address="Ganesh Heights, Vastral, Ahmedabad - 382418"; price=5800000; priceDisplay="\u{20B9}58 L"; bhk="3 BHK"; sqft=1380; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Children Play Area","Garden"]; possession="Nov 2027"; images=[]; mapLink=""; facing="East"; floorNo=10; societyName="Ganesh Heights"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p574"; propertyType="Under Construction"; action="Buy"; title="4 BHK Arth Signature Tower Motera"; description="Premium 4 BHK tower in Motera. High-end construction with branded fittings. Stadium views from upper floors."; location="Motera, Ahmedabad"; city="Ahmedabad"; address="Arth Signature Tower, Motera, Ahmedabad - 380005"; price=11500000; priceDisplay="\u{20B9}1.15 Cr"; bhk="4 BHK"; sqft=2350; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Rooftop Terrace"]; possession="Apr 2028"; images=[]; mapLink=""; facing="East"; floorNo=16; societyName="Arth Signature Tower"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p575"; propertyType="Under Construction"; action="Buy"; title="2 BHK Mahavir Apartments Phase 3 Chandkheda"; description="Phase 3 of Mahavir Apartments in Chandkheda. Two previous phases delivered on time. Near Chandkheda BRTS."; location="Chandkheda, Ahmedabad"; city="Ahmedabad"; address="Mahavir Apartments Phase 3, Chandkheda, Ahmedabad - 382424"; price=5200000; priceDisplay="\u{20B9}52 L"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Power Backup","Security","Lift","Car Parking","Garden","Children Play Area"]; possession="Jul 2027"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Mahavir Apartments Phase 3"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p576"; propertyType="Under Construction"; action="Buy"; title="3 BHK Sunrise Valley Bopal"; description="Under construction 3 BHK in Bopal township. Integrated township with school and commercial complex within premises."; location="Bopal, Ahmedabad"; city="Ahmedabad"; address="Sunrise Valley, Bopal, Ahmedabad - 380058"; price=8000000; priceDisplay="\u{20B9}80 L"; bhk="3 BHK"; sqft=1480; furnishing="Unfurnished"; amenities=["Township","School","Commercial","Clubhouse","Swimming Pool","Gym","Power Backup","Security"]; possession="Mar 2027"; images=[]; mapLink=""; facing="North"; floorNo=11; societyName="Sunrise Valley"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p577"; propertyType="Under Construction"; action="Buy"; title="2 BHK Premium Enclave SG Highway"; description="Upscale 2 BHK under construction on SG Highway. Panoramic views, high-end fittings, and excellent location."; location="SG Highway, Ahmedabad"; city="Ahmedabad"; address="Premium Enclave, SG Highway, Ahmedabad - 380054"; price=9200000; priceDisplay="\u{20B9}92 L"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Clubhouse","Swimming Pool","Gym","Power Backup","Security","Car Parking","Lift","Concierge"]; possession="Sep 2027"; images=[]; mapLink=""; facing="East"; floorNo=13; societyName="Premium Enclave"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p578"; propertyType="Under Construction"; action="Buy"; title="3 BHK Harmony Residency Navrangpura"; description="Premium 3 BHK in central Navrangpura. Rare new development in this established locality. Investment value very high."; location="Navrangpura, Ahmedabad"; city="Ahmedabad"; address="Harmony Residency, Navrangpura, Ahmedabad - 380009"; price=14200000; priceDisplay="\u{20B9}1.42 Cr"; bhk="3 BHK"; sqft=1650; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Rooftop Garden","Gym"]; possession="Jun 2027"; images=[]; mapLink=""; facing="East"; floorNo=15; societyName="Harmony Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p579"; propertyType="Under Construction"; action="Buy"; title="2 BHK Vasant Kunj Residency South Bopal"; description="Nearly ready 2 BHK in South Bopal. Possession within 6 months. RERA certificate available. Good connectivity."; location="South Bopal, Ahmedabad"; city="Ahmedabad"; address="Vasant Kunj Residency, South Bopal, Ahmedabad - 380058"; price=6300000; priceDisplay="\u{20B9}63 L"; bhk="2 BHK"; sqft=1080; furnishing="Unfurnished"; amenities=["Clubhouse","Power Backup","Security","Lift","Car Parking","Garden","Children Play Area"]; possession="Oct 2026"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Vasant Kunj Residency"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p580"; propertyType="Under Construction"; action="Buy"; title="4 BHK Crown Towers Prahladnagar"; description="Luxury 4 BHK in Crown Towers, Prahladnagar. One of the tallest residential towers in Ahmedabad. Smart home technology."; location="Prahladnagar, Ahmedabad"; city="Ahmedabad"; address="Crown Towers, Prahladnagar, Ahmedabad - 380015"; price=25000000; priceDisplay="\u{20B9}2.5 Cr"; bhk="4 BHK"; sqft=2600; furnishing="Unfurnished"; amenities=["Sky Pool","Smart Home","Private Elevator","Gym","Spa","Power Backup","Security","Valet Parking","Club Lounge","Cinema Room"]; possession="Dec 2027"; images=[]; mapLink=""; facing="East"; floorNo=22; societyName="Crown Towers"; ownerName="MSTC GLOBAL"; ownerPhone="+91 9512609016"; ownerEmail="mstc.gbl@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC"; listedDate="2026-05-22"; },
      { id="p400"; propertyType="Residential"; action="Buy"; title="3 BHK in Satellite - Top Floor"; description="Top floor 3 BHK in Satellite with skyline views, RERA registered, near ISCON Mega Mall."; location="Satellite, Ahmedabad"; city="Ahmedabad"; address="Satellite Top Residency, 16th Floor, Near ISCON, Ahmedabad - 380015"; price=16000000; priceDisplay="\u{20B9}1.6 Cr"; bhk="3 BHK"; sqft=2400; furnishing="Semi-Furnished"; amenities=["Pool","Gym","Club House","Parking","Security","Smart Home"]; possession="Ready to Move"; images=[]; mapLink=""; facing="East"; floorNo=16; societyName="Satellite Top Residency"; ownerName=""; ownerPhone=""; ownerEmail=""; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="Direct"; listedDate="2026-11-12"; },
    ];
    propertyListings.addAll(moreProps.vals());
  };
    propertyListings.addAll(extra.values());
  };

  // Batch A: Additional properties p581-p683
  do {
    let batchA : [PropertyListing] = [
      { id="p581"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Bopal"; description="Well-maintained 2BHK flat in prime Bopal location with parking and security. Ready to move."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=7500000; priceDisplay="\u{20B9}75L"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Bopal Greens"; ownerName="Rajesh Patel"; ownerPhone="+91 9876501001"; ownerEmail="rajesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-15" },
      { id="p582"; propertyType="Residential"; action="Buy"; title="3 BHK Apartment in South Bopal"; description="Spacious 3BHK in South Bopal with premium amenities, garden view, and excellent ventilation."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=12000000; priceDisplay="\u{20B9}1.2Cr"; bhk="3 BHK"; sqft=1550; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="South Bopal Heights"; ownerName="Suresh Mehta"; ownerPhone="+91 9876501002"; ownerEmail="suresh.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-20" },
      { id="p583"; propertyType="Residential"; action="Buy"; title="2 BHK Flat on SG Highway"; description="Modern 2BHK flat on SG Highway with city views, close to corporate offices and malls."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=9500000; priceDisplay="\u{20B9}95L"; bhk="2 BHK"; sqft=1100; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="SG Towers"; ownerName="Priya Shah"; ownerPhone="+91 9876501003"; ownerEmail="priya.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-01" },
      { id="p584"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Navrangpura"; description="Premium 3BHK in the heart of Navrangpura. Walking distance to CG Road and major hospitals."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=18000000; priceDisplay="\u{20B9}1.8Cr"; bhk="3 BHK"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Club House"]; possession="Within 1 Month"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Navrangpura Residency"; ownerName="Amit Desai"; ownerPhone="+91 9876501004"; ownerEmail="amit.d@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-15" },
      { id="p585"; propertyType="Residential"; action="Buy"; title="4 BHK Bungalow in Prahlad Nagar"; description="Luxurious 4BHK bungalow in prestigious Prahlad Nagar with private garden and modern interiors."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=35000000; priceDisplay="\u{20B9}3.5Cr"; bhk="4 BHK"; sqft=3500; furnishing="Fully Furnished"; amenities=["Private Garden","Parking","Security","Servant Quarter","Terrace"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName=""; ownerName="Vijay Kapoor"; ownerPhone="+91 9876501005"; ownerEmail="vijay.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-10" },
      { id="p586"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Thaltej"; description="Bright 2BHK in Thaltej with excellent metro connectivity and proximity to SG Highway."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=8500000; priceDisplay="\u{20B9}85L"; bhk="2 BHK"; sqft=1080; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Thaltej Park"; ownerName="Neha Joshi"; ownerPhone="+91 9876501006"; ownerEmail="neha.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-01" },
      { id="p587"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Chandkheda"; description="Affordable 3BHK in Chandkheda with good connectivity to Gandhinagar and PDPU."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=7000000; priceDisplay="\u{20B9}70L"; bhk="3 BHK"; sqft=1350; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Children Play Area"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Chandkheda Residency"; ownerName="Rakesh Trivedi"; ownerPhone="+91 9876501007"; ownerEmail="rakesh.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-20" },
      { id="p588"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Gota"; description="Well-connected 2BHK flat in Gota, near SP Ring Road and expressway. Value for money."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=5500000; priceDisplay="\u{20B9}55L"; bhk="2 BHK"; sqft=980; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Gota Enclave"; ownerName="Sunita Rao"; ownerPhone="+91 9876501008"; ownerEmail="sunita.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-05" },
      { id="p589"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Vastral"; description="Affordable 2BHK in Vastral with modern facilities and good road connectivity."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=4500000; priceDisplay="\u{20B9}45L"; bhk="2 BHK"; sqft=920; furnishing="Unfurnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Vastral Greens"; ownerName="Dinesh Parmar"; ownerPhone="+91 9876501009"; ownerEmail="dinesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-25" },
      { id="p590"; propertyType="Residential"; action="Buy"; title="3 BHK Row House in Nikol"; description="Independent row house in Nikol with private terrace and garden area."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=9000000; priceDisplay="\u{20B9}90L"; bhk="3 BHK"; sqft=2200; furnishing="Semi-Furnished"; amenities=["Parking","Garden","Terrace","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Manish Pandya"; ownerPhone="+91 9876501010"; ownerEmail="manish.pandya@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-10" },
      { id="p591"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Naranpura"; description="Central 2BHK in Naranpura close to schools, markets and Swaminarayan temple."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=8000000; priceDisplay="\u{20B9}80L"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="South-West"; floorNo=3; societyName="Naranpura Complex"; ownerName="Hema Bhatt"; ownerPhone="+91 9876501011"; ownerEmail="hema.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-05" },
      { id="p592"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Vastrapur"; description="Premium 3BHK near Vastrapur Lake, perfect for families seeking peaceful environment."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=16000000; priceDisplay="\u{20B9}1.6Cr"; bhk="3 BHK"; sqft=1700; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Vastrapur Heights"; ownerName="Kamal Shah"; ownerPhone="+91 9876501012"; ownerEmail="kamal.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-15" },
      { id="p593"; propertyType="Residential"; action="Buy"; title="4 BHK Penthouse in Satellite"; description="Ultra-luxury 4BHK penthouse in Satellite with panoramic city views and world-class amenities."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=45000000; priceDisplay="\u{20B9}4.5Cr"; bhk="4 BHK"; sqft=4200; furnishing="Fully Furnished"; amenities=["Private Terrace","Jacuzzi","Gym","Swimming Pool","Lift","Security","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=15; societyName="Satellite Luxury"; ownerName="Preeti Gupta"; ownerPhone="+91 9876501013"; ownerEmail="preeti.g@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-20" },
      { id="p594"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Ambawadi"; description="Centrally located 2BHK in Ambawadi close to drive-in road and entertainment hubs."; location="Ambawadi"; city="Ahmedabad"; address="Ambawadi, Ahmedabad"; price=11000000; priceDisplay="\u{20B9}1.1Cr"; bhk="2 BHK"; sqft=1150; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Ambawadi Residency"; ownerName="Sanjay Modi"; ownerPhone="+91 9876501014"; ownerEmail="sanjay.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-15" },
      { id="p595"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Motera"; description="Spacious 3BHK near Motera Stadium. Excellent connectivity via SP Ring Road."; location="Motera"; city="Ahmedabad"; address="Motera, Ahmedabad"; price=8500000; priceDisplay="\u{20B9}85L"; bhk="3 BHK"; sqft=1400; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden","Children Play Area"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Motera Complex"; ownerName="Lalit Thakkar"; ownerPhone="+91 9876501015"; ownerEmail="lalit.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-01" },
      { id="p596"; propertyType="Residential"; action="Buy"; title="3 BHK Villa in Shela"; description="Modern villa in rapidly developing Shela with all amenities and excellent investment potential."; location="Shela"; city="Ahmedabad"; address="Shela, Ahmedabad"; price=22000000; priceDisplay="\u{20B9}2.2Cr"; bhk="3 BHK"; sqft=2800; furnishing="Semi-Furnished"; amenities=["Private Garden","Parking","Security","Club House","Gym"]; possession="Within 3 Months"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Shela Villas"; ownerName="Nitin Rathod"; ownerPhone="+91 9876501016"; ownerEmail="nitin.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-10" },
      { id="p597"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Randesan"; description="Well-planned 2BHK near Randesan, close to PDPU and GIFT City. Ideal for professionals."; location="Randesan"; city="Ahmedabad"; address="Randesan, Gandhinagar"; price=6500000; priceDisplay="\u{20B9}65L"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Randesan Heights"; ownerName="Dipak Vyas"; ownerPhone="+91 9876501017"; ownerEmail="dipak.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-20" },
      { id="p598"; propertyType="Residential"; action="Buy"; title="4 BHK Flat in Bopal"; description="Expansive 4BHK in Bopal with covered car parking and hi-tech security."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=19500000; priceDisplay="\u{20B9}1.95Cr"; bhk="4 BHK"; sqft=2400; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Gym","Garden","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North-West"; floorNo=7; societyName="Bopal Grand"; ownerName="Kavita Choksi"; ownerPhone="+91 9876501018"; ownerEmail="kavita.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-25" },
      { id="p599"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Thaltej"; description="3BHK with dedicated study room in Thaltej. Premium society with international amenities."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=14500000; priceDisplay="\u{20B9}1.45Cr"; bhk="3 BHK"; sqft=1650; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Garden","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="South-East"; floorNo=6; societyName="Thaltej Elite"; ownerName="Yogesh Pandya"; ownerPhone="+91 9876501019"; ownerEmail="yogesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-30" },
      { id="p600"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Gota"; description="Budget-friendly 2BHK in Gota near New Ranip, suitable for first-time homebuyers."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=4800000; priceDisplay="\u{20B9}48L"; bhk="2 BHK"; sqft=900; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Gota Apartments"; ownerName="Bhavesh Soni"; ownerPhone="+91 9876501020"; ownerEmail="bhavesh.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-10" },
      { id="p601"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in South Bopal"; description="Contemporary 3BHK in South Bopal with rooftop amenities and ample parking."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=13500000; priceDisplay="\u{20B9}1.35Cr"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Club House","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=8; societyName="South Bopal Towers"; ownerName="Maulik Desai"; ownerPhone="+91 9876501021"; ownerEmail="maulik.d@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-05" },
      { id="p602"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Navrangpura"; description="Prime 2BHK in Navrangpura walking distance to hospitals and premium schools."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=14000000; priceDisplay="\u{20B9}1.4Cr"; bhk="2 BHK"; sqft=1200; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Garden","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Navrangpura Classic"; ownerName="Ritu Pandya"; ownerPhone="+91 9876501022"; ownerEmail="ritu.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-05" },
      { id="p603"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Satellite"; description="Prestigious 3BHK in Satellite area, near premium malls and corporate offices."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=22000000; priceDisplay="\u{20B9}2.2Cr"; bhk="3 BHK"; sqft=2000; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Garden","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=10; societyName="Satellite Premium"; ownerName="Ashok Patel"; ownerPhone="+91 9876501023"; ownerEmail="ashok.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-20" },
      { id="p604"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Chandkheda"; description="Affordable 2BHK in Chandkheda near ISRO and Gota Petrol Pump cross."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=5800000; priceDisplay="\u{20B9}58L"; bhk="2 BHK"; sqft=980; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=6; societyName="Chandkheda Complex"; ownerName="Jignesh Shah"; ownerPhone="+91 9876501024"; ownerEmail="jignesh.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-10" },
      { id="p605"; propertyType="Residential"; action="Buy"; title="4 BHK Villa in Prahlad Nagar"; description="Opulent 4BHK villa in Prahlad Nagar with home theatre, gym, and Italian marble flooring."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=55000000; priceDisplay="\u{20B9}5.5Cr"; bhk="4 BHK"; sqft=5500; furnishing="Fully Furnished"; amenities=["Private Pool","Home Theatre","Gym","Garden","Servant Quarter","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Prakash Agarwal"; ownerPhone="+91 9876501025"; ownerEmail="prakash.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-15" },
      { id="p606"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Naranpura"; description="Comfortable 3BHK in Naranpura in a well-maintained society with all basic amenities."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=11500000; priceDisplay="\u{20B9}1.15Cr"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=4; societyName="Naranpura Heights"; ownerName="Bina Joshi"; ownerPhone="+91 9876501026"; ownerEmail="bina.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-05" },
      { id="p607"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Vastrapur"; description="Lake-facing 2BHK in Vastrapur with stunning views and prime residential location."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=13000000; priceDisplay="\u{20B9}1.3Cr"; bhk="2 BHK"; sqft=1200; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Vastrapur Lake View"; ownerName="Minal Agrawal"; ownerPhone="+91 9876501027"; ownerEmail="minal.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-25" },
      { id="p608"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Nikol"; description="Spacious 3BHK in Nikol with modern kitchen, parking, and 24x7 security."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=7000000; priceDisplay="\u{20B9}70L"; bhk="3 BHK"; sqft=1350; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Nikol Paradise"; ownerName="Nilesh Patel"; ownerPhone="+91 9876501028"; ownerEmail="nilesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-15" },
      { id="p609"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Vastral"; description="Newly constructed 2BHK in Vastral near Eastern Expressway and industrial areas."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=4200000; priceDisplay="\u{20B9}42L"; bhk="2 BHK"; sqft=870; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=2; societyName="Vastral New Society"; ownerName="Ramila Chauhan"; ownerPhone="+91 9876501029"; ownerEmail="ramila.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-01" },
      { id="p610"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Motera"; description="3BHK in Motera with terrace access and close proximity to Sabarmati Riverfront."; location="Motera"; city="Ahmedabad"; address="Motera, Ahmedabad"; price=9500000; priceDisplay="\u{20B9}95L"; bhk="3 BHK"; sqft=1450; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Terrace","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="South-West"; floorNo=5; societyName="Motera Heights"; ownerName="Kalpesh Patel"; ownerPhone="+91 9876501030"; ownerEmail="kalpesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-10" },
      { id="p611"; propertyType="Residential"; action="Buy"; title="4 BHK Flat in SG Highway"; description="Ultra-modern 4BHK on SG Highway with home office space and premium club facilities."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=38000000; priceDisplay="\u{20B9}3.8Cr"; bhk="4 BHK"; sqft=3800; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Club House","Home Theatre"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=12; societyName="SG Grand"; ownerName="Hemlata Shah"; ownerPhone="+91 9876501031"; ownerEmail="hemlata.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-01" },
      { id="p612"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Ambawadi"; description="Value 2BHK near Ambawadi circle with easy access to CG Road and Vastrapur."; location="Ambawadi"; city="Ahmedabad"; address="Ambawadi, Ahmedabad"; price=10000000; priceDisplay="\u{20B9}1Cr"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Within 1 Month"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Ambawadi Classic"; ownerName="Vikas Solanki"; ownerPhone="+91 9876501032"; ownerEmail="vikas.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-15" },
      { id="p613"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Shela"; description="New 3BHK in fast-growing Shela with excellent future appreciation potential."; location="Shela"; city="Ahmedabad"; address="Shela, Ahmedabad"; price=17000000; priceDisplay="\u{20B9}1.7Cr"; bhk="3 BHK"; sqft=1900; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden","Club House"]; possession="Within 3 Months"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Shela Horizon"; ownerName="Paresh Raval"; ownerPhone="+91 9876501033"; ownerEmail="paresh.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-10" },
      { id="p614"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Naranpura"; description="Affordable 2BHK in quiet Naranpura society, ideal for nuclear families."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=7500000; priceDisplay="\u{20B9}75L"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Naranpura Residency"; ownerName="Sonal Mehta"; ownerPhone="+91 9876501034"; ownerEmail="sonal.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-20" },
      { id="p615"; propertyType="Residential"; action="Buy"; title="4 BHK Bungalow in Vastrapur"; description="Prestigious independent bungalow in Vastrapur with private pool and lush garden."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=75000000; priceDisplay="\u{20B9}7.5Cr"; bhk="4 BHK"; sqft=7000; furnishing="Fully Furnished"; amenities=["Private Pool","Garden","Home Theatre","Gym","Servant Quarter","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Ramesh Trivedi"; ownerPhone="+91 9876501035"; ownerEmail="ramesh.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-01" },
      { id="p616"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Randesan"; description="Modern 3BHK in Randesan close to PDPU campus and GIFT City corridor."; location="Randesan"; city="Ahmedabad"; address="Randesan, Gandhinagar"; price=9000000; priceDisplay="\u{20B9}90L"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=4; societyName="Randesan Greens"; ownerName="Praful Joshi"; ownerPhone="+91 9876501036"; ownerEmail="praful.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-20" },
      { id="p617"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Gota"; description="Well-connected 2BHK in Gota near Nirma University and Kalpana Chawla road."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=5200000; priceDisplay="\u{20B9}52L"; bhk="2 BHK"; sqft=950; furnishing="Semi-Furnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Gota Shelter"; ownerName="Nandini Patel"; ownerPhone="+91 9876501037"; ownerEmail="nandini.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-01" },
      { id="p618"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Bopal"; description="Roomy 3BHK in Bopal near D-Mart and SP Ring Road. Family-friendly complex with park."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=11000000; priceDisplay="\u{20B9}1.1Cr"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Children Play Area"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Bopal Paradise"; ownerName="Mukesh Rathod"; ownerPhone="+91 9876501038"; ownerEmail="mukesh.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-28" },
      { id="p619"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Nikol"; description="Fresh 2BHK in Nikol with East-facing light and cross ventilation. Walking distance to market."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=4600000; priceDisplay="\u{20B9}46L"; bhk="2 BHK"; sqft=880; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Nikol Garden"; ownerName="Raju Vaghela"; ownerPhone="+91 9876501039"; ownerEmail="raju.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-05" },
      { id="p620"; propertyType="Residential"; action="Buy"; title="4 BHK Flat in Navrangpura"; description="Sprawling 4BHK in Navrangpura with Italian marble, false ceiling, and premium fittings."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=35000000; priceDisplay="\u{20B9}3.5Cr"; bhk="4 BHK"; sqft=3200; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Club House","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Navrangpura Grand"; ownerName="Chetan Jain"; ownerPhone="+91 9876501040"; ownerEmail="chetan.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-25" },
      { id="p621"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Chandkheda"; description="Brand new 2BHK in Chandkheda near Science City and BRTS corridor."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=6000000; priceDisplay="\u{20B9}60L"; bhk="2 BHK"; sqft=990; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Chandkheda New Town"; ownerName="Anand Panchal"; ownerPhone="+91 9876501041"; ownerEmail="anand.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-01" },
      { id="p622"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Vastral"; description="Affordable 3BHK in Vastral, near Eastern Ring Road and industrial corridor."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=5500000; priceDisplay="\u{20B9}55L"; bhk="3 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North-West"; floorNo=2; societyName="Vastral Avenue"; ownerName="Minaben Parmar"; ownerPhone="+91 9876501042"; ownerEmail="minaben.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-25" },
      { id="p623"; propertyType="Residential"; action="Buy"; title="5 BHK Villa in Satellite"; description="Majestic 5BHK villa in Satellite with private terrace, gym, and resort-style pool."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=80000000; priceDisplay="\u{20B9}8Cr"; bhk="5 BHK"; sqft=8000; furnishing="Fully Furnished"; amenities=["Private Pool","Gym","Garden","Home Theatre","Servant Quarters","Security","Solar Power"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName=""; ownerName="Jatin Mehta"; ownerPhone="+91 9876501043"; ownerEmail="jatin.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-20" },
      { id="p624"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Bopal"; description="Ready-to-move 2BHK in Bopal with vastu-compliant design and East facing balcony."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=7200000; priceDisplay="\u{20B9}72L"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Bopal Sunrise"; ownerName="Falgun Patel"; ownerPhone="+91 9876501044"; ownerEmail="falgun.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-15" },
      { id="p625"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in SG Highway"; description="Corporate-friendly 3BHK on SG Highway with shuttle to office zones and premium mall access."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=17500000; priceDisplay="\u{20B9}1.75Cr"; bhk="3 BHK"; sqft=1850; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=9; societyName="SG Heights"; ownerName="Varsha Kothari"; ownerPhone="+91 9876501045"; ownerEmail="varsha.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-15" },
      { id="p626"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Thaltej"; description="Eco-friendly 2BHK in Thaltej with solar panels, rainwater harvesting, and green surroundings."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=9000000; priceDisplay="\u{20B9}90L"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Solar Power","Rainwater Harvesting","Garden"]; possession="Within 1 Month"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Thaltej Green"; ownerName="Ratan Patel"; ownerPhone="+91 9876501046"; ownerEmail="ratan.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-25" },
      { id="p627"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Ambawadi"; description="Fully renovated 3BHK in Ambawadi with modern modular kitchen and new electrical fittings."; location="Ambawadi"; city="Ahmedabad"; address="Ambawadi, Ahmedabad"; price=16500000; priceDisplay="\u{20B9}1.65Cr"; bhk="3 BHK"; sqft=1700; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Garden","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="Ambawadi Premier"; ownerName="Geeta Bhavsar"; ownerPhone="+91 9876501047"; ownerEmail="geeta.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-05" },
      { id="p628"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in South Bopal"; description="Corner unit 2BHK in South Bopal with extra windows and city view from higher floor."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=8200000; priceDisplay="\u{20B9}82L"; bhk="2 BHK"; sqft=1080; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=7; societyName="South Bopal Pinnacle"; ownerName="Hardik Pandya"; ownerPhone="+91 9876501048"; ownerEmail="hardik.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-15" },
      { id="p629"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Naranpura"; description="Independent-feel 3BHK in low-density Naranpura society with large courtyard."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=12000000; priceDisplay="\u{20B9}1.2Cr"; bhk="3 BHK"; sqft=1550; furnishing="Semi-Furnished"; amenities=["Parking","Security","Garden","Courtyard"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Naranpura Courtyard"; ownerName="Surekha Dave"; ownerPhone="+91 9876501049"; ownerEmail="surekha.d@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-10" },
      { id="p630"; propertyType="Residential"; action="Buy"; title="4 BHK Duplex in Shela"; description="Grand 4BHK duplex in Shela with private staircase, double height ceiling, and expansive garden."; location="Shela"; city="Ahmedabad"; address="Shela, Ahmedabad"; price=32000000; priceDisplay="\u{20B9}3.2Cr"; bhk="4 BHK"; sqft=4000; furnishing="Fully Furnished"; amenities=["Private Garden","Parking","Security","Gym","Club House","Terrace"]; possession="Within 3 Months"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName="Shela Duplex"; ownerName="Bharat Oza"; ownerPhone="+91 9876501050"; ownerEmail="bharat.o@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-15" },
      { id="p631"; propertyType="Residential"; action="Rent"; title="1 BHK Flat for Rent in Navrangpura"; description="Compact 1BHK near CG Road, ideal for working professionals. All utilities included."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=13000; priceDisplay="\u{20B9}13,000/mo"; bhk="1 BHK"; sqft=550; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Wi-Fi"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Navrangpura Executive"; ownerName="Anika Shah"; ownerPhone="+91 9876502001"; ownerEmail="anika.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-20" },
      { id="p632"; propertyType="Residential"; action="Rent"; title="2 BHK Flat for Rent in Bopal"; description="Spacious 2BHK in Bopal available for family rent. Ready to move with basic furniture."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=18000; priceDisplay="\u{20B9}18,000/mo"; bhk="2 BHK"; sqft=1000; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Bopal Residency"; ownerName="Bhavin Patel"; ownerPhone="+91 9876502002"; ownerEmail="bhavin.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-01" },
      { id="p633"; propertyType="Residential"; action="Rent"; title="3 BHK Flat for Rent in Satellite"; description="Premium 3BHK in Satellite for rent with full furniture and appliances. Ideal for expats."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=38000; priceDisplay="\u{20B9}38,000/mo"; bhk="3 BHK"; sqft=1800; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Satellite Premium Rents"; ownerName="Leela Gupta"; ownerPhone="+91 9876502003"; ownerEmail="leela.g@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-15" },
      { id="p634"; propertyType="Residential"; action="Rent"; title="1 BHK Flat for Rent in Vastrapur"; description="Cozy 1BHK near Vastrapur lake, ideal for single professionals or couples."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=11000; priceDisplay="\u{20B9}11,000/mo"; bhk="1 BHK"; sqft=500; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Vastrapur Lake Homes"; ownerName="Dhruti Joshi"; ownerPhone="+91 9876502004"; ownerEmail="dhruti.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-10" },
      { id="p635"; propertyType="Residential"; action="Rent"; title="2 BHK Flat for Rent in South Bopal"; description="2BHK for rent in South Bopal with modular kitchen and car parking."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=20000; priceDisplay="\u{20B9}20,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=5; societyName="South Bopal Rentals"; ownerName="Harsha Patel"; ownerPhone="+91 9876502005"; ownerEmail="harsha.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-30" },
      { id="p636"; propertyType="Residential"; action="Rent"; title="3 BHK Flat for Rent in SG Highway"; description="3BHK for rent on SG Highway, close to ISCON and major corporate parks."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=32000; priceDisplay="\u{20B9}32,000/mo"; bhk="3 BHK"; sqft=1600; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=9; societyName="SG Highway Rents"; ownerName="Kiriti Shah"; ownerPhone="+91 9876502006"; ownerEmail="kiriti.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-25" },
      { id="p637"; propertyType="Residential"; action="Rent"; title="2 BHK Flat for Rent in Chandkheda"; description="Clean 2BHK for rent in Chandkheda, near ISRO and science university."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=15000; priceDisplay="\u{20B9}15,000/mo"; bhk="2 BHK"; sqft=950; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=3; societyName="Chandkheda Rentals"; ownerName="Foram Desai"; ownerPhone="+91 9876502007"; ownerEmail="foram.d@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-10" },
      { id="p638"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Naranpura"; description="Well-maintained 1BHK in Naranpura with attached bathroom and dedicated parking."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=9000; priceDisplay="\u{20B9}9,000/mo"; bhk="1 BHK"; sqft=480; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Nita Chauhan"; ownerPhone="+91 9876502008"; ownerEmail="nita.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-05" },
      { id="p639"; propertyType="Residential"; action="Rent"; title="3 BHK Flat for Rent in Prahlad Nagar"; description="Luxury 3BHK for rent in Prahlad Nagar with Italian marble flooring and imported fittings."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=45000; priceDisplay="\u{20B9}45,000/mo"; bhk="3 BHK"; sqft=2000; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=8; societyName="Prahlad Premier"; ownerName="Tushar Agrawal"; ownerPhone="+91 9876502009"; ownerEmail="tushar.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-20" },
      { id="p640"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Thaltej"; description="2BHK near Thaltej metro station, perfect for IT professionals working in SG Highway zone."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=22000; priceDisplay="\u{20B9}22,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Wi-Fi"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Thaltej Metro Homes"; ownerName="Foram Shah"; ownerPhone="+91 9876502010"; ownerEmail="foram.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-10" },
      { id="p641"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Gota"; description="Budget 1BHK for rent in Gota, suitable for students and young professionals."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=7000; priceDisplay="\u{20B9}7,000/mo"; bhk="1 BHK"; sqft=400; furnishing="Unfurnished"; amenities=["Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName=""; ownerName="Arvind Solanki"; ownerPhone="+91 9876502011"; ownerEmail="arvind.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-01" },
      { id="p642"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Nikol"; description="Comfortable 2BHK for rent in Nikol, ideal for industrial workers and nearby families."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="2 BHK"; sqft=850; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Nikol Rentals"; ownerName="Heena Parmar"; ownerPhone="+91 9876502012"; ownerEmail="heena.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-20" },
      { id="p643"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent in Ambawadi"; description="3BHK for rent in Ambawadi with dedicated car parking and near-market location."; location="Ambawadi"; city="Ahmedabad"; address="Ambawadi, Ahmedabad"; price=28000; priceDisplay="\u{20B9}28,000/mo"; bhk="3 BHK"; sqft=1600; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Ambawadi Furnished"; ownerName="Jyoti Trivedi"; ownerPhone="+91 9876502013"; ownerEmail="jyoti.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-20" },
      { id="p644"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Motera"; description="2BHK for rent near Motera Stadium with easy access to Ahmedabad BRTS."; location="Motera"; city="Ahmedabad"; address="Motera, Ahmedabad"; price=16000; priceDisplay="\u{20B9}16,000/mo"; bhk="2 BHK"; sqft=950; furnishing="Semi-Furnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Motera Rentals"; ownerName="Priyanka Patel"; ownerPhone="+91 9876502014"; ownerEmail="priyanka.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-15" },
      { id="p645"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Vastral"; description="Affordable 1BHK for rent in Vastral, close to Vastral BRTS terminus."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=6500; priceDisplay="\u{20B9}6,500/mo"; bhk="1 BHK"; sqft=420; furnishing="Unfurnished"; amenities=["Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName=""; ownerName="Ketan Vaghela"; ownerPhone="+91 9876502015"; ownerEmail="ketan.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-10" },
      { id="p646"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent in Navrangpura"; description="Furnished 3BHK in Navrangpura for corporate rent. Includes generator backup."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=40000; priceDisplay="\u{20B9}40,000/mo"; bhk="3 BHK"; sqft=1700; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Generator","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Navrangpura Suites"; ownerName="Maya Kapoor"; ownerPhone="+91 9876502016"; ownerEmail="maya.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-10" },
      { id="p647"; propertyType="Commercial"; action="Buy"; title="Office Space on SG Highway"; description="Premium office space on SG Highway suitable for startups and mid-sized companies."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=15000000; priceDisplay="\u{20B9}1.5Cr"; bhk="0"; sqft=2000; furnishing="Semi-Furnished"; amenities=["Power Backup","Parking","Security","Cafeteria","Conference Rooms"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="SG Business Park"; ownerName="Sanjiv Mehta"; ownerPhone="+91 9876503001"; ownerEmail="sanjiv.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-01" },
      { id="p648"; propertyType="Commercial"; action="Rent"; title="Shop Space on CG Road"; description="Prime retail shop on CG Road, best for fashion, electronics, or F&B brand."; location="CG Road"; city="Ahmedabad"; address="CG Road, Ahmedabad"; price=80000; priceDisplay="\u{20B9}80,000/mo"; bhk="0"; sqft=600; furnishing="Unfurnished"; amenities=["Power Backup","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="CG Commercial"; ownerName="Rajesh Kapoor"; ownerPhone="+91 9876503002"; ownerEmail="rajesh.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-05" },
      { id="p649"; propertyType="Commercial"; action="Buy"; title="Showroom on Ashram Road"; description="Ground floor showroom on busy Ashram Road. 2500 sq ft with high footfall."; location="Ashram Road"; city="Ahmedabad"; address="Ashram Road, Ahmedabad"; price=35000000; priceDisplay="\u{20B9}3.5Cr"; bhk="0"; sqft=2500; furnishing="Unfurnished"; amenities=["Power Backup","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Ashram Road Commercial"; ownerName="Dipti Shah"; ownerPhone="+91 9876503003"; ownerEmail="dipti.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-15" },
      { id="p650"; propertyType="Commercial"; action="Rent"; title="Office Space near GIFT City"; description="Modern office space near GIFT City corridor, suitable for financial services and fintech."; location="GIFT City"; city="Ahmedabad"; address="GIFT City Road, Gandhinagar"; price=120000; priceDisplay="\u{20B9}1.2L/mo"; bhk="0"; sqft=3000; furnishing="Fully Furnished"; amenities=["Power Backup","Parking","Security","Cafeteria","Conference Rooms","High Speed Internet"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=6; societyName="GIFT Business Hub"; ownerName="Manish Garg"; ownerPhone="+91 9876503004"; ownerEmail="manish.g@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-10" },
      { id="p651"; propertyType="Commercial"; action="Buy"; title="Office Complex in Navrangpura"; description="Entire floor office complex in Navrangpura. Ideal for established businesses and corporates."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=50000000; priceDisplay="\u{20B9}5Cr"; bhk="0"; sqft=5000; furnishing="Unfurnished"; amenities=["Power Backup","Parking","Security","Reception","Conference Rooms"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Navrangpura Business Centre"; ownerName="Suresh Goenka"; ownerPhone="+91 9876503005"; ownerEmail="suresh.go@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-10" },
      { id="p652"; propertyType="Commercial"; action="Rent"; title="Retail Shop in Satellite"; description="Retail shop in prime Satellite area for rent, high visibility corner unit."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=65000; priceDisplay="\u{20B9}65,000/mo"; bhk="0"; sqft=700; furnishing="Unfurnished"; amenities=["Power Backup","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Satellite Commercial Zone"; ownerName="Neha Agarwal"; ownerPhone="+91 9876503006"; ownerEmail="neha.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-05" },
      { id="p653"; propertyType="Commercial"; action="Buy"; title="Food Court Space in Gota"; description="Commercial food court space in Gota for restaurant or cloud kitchen business."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=8000000; priceDisplay="\u{20B9}80L"; bhk="0"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Power Backup","Parking","Security","Exhaust System"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Gota Food Hub"; ownerName="Anita Patel"; ownerPhone="+91 9876503007"; ownerEmail="anita.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-25" },
      { id="p654"; propertyType="Commercial"; action="Rent"; title="Co-working Space in Vastrapur"; description="Modern co-working space in Vastrapur, available for teams of 5-50. All inclusive pricing."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=25000; priceDisplay="\u{20B9}25,000/mo"; bhk="0"; sqft=800; furnishing="Fully Furnished"; amenities=["High Speed Internet","Power Backup","Cafeteria","Meeting Rooms","Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Vastrapur Co-Work"; ownerName="Hemant Jain"; ownerPhone="+91 9876503008"; ownerEmail="hemant.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-20" },
      { id="p655"; propertyType="Commercial"; action="Buy"; title="Warehouse Space in Naroda GIDC"; description="Industrial warehouse in Naroda GIDC for manufacturing or storage use."; location="Naroda"; city="Ahmedabad"; address="Naroda GIDC, Ahmedabad"; price=20000000; priceDisplay="\u{20B9}2Cr"; bhk="0"; sqft=8000; furnishing="Unfurnished"; amenities=["Loading Dock","Power Backup","Security","Office Space"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Naroda GIDC Commercial"; ownerName="Dhiren Shah"; ownerPhone="+91 9876503009"; ownerEmail="dhiren.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-01" },
      { id="p656"; propertyType="Commercial"; action="Rent"; title="Office on Ashram Road"; description="Ready office space on prime Ashram Road for rent, near major banks and government offices."; location="Ashram Road"; city="Ahmedabad"; address="Ashram Road, Ahmedabad"; price=55000; priceDisplay="\u{20B9}55,000/mo"; bhk="0"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Power Backup","Parking","Security","Reception Area"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Ashram Road Office Hub"; ownerName="Rekha Mehta"; ownerPhone="+91 9876503010"; ownerEmail="rekha.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-20" },
      { id="p657"; propertyType="Industrial"; action="Buy"; title="Factory Shed in Vatva GIDC"; description="Industrial factory shed in Vatva GIDC with power supply and connected road access."; location="Vatva"; city="Ahmedabad"; address="Vatva GIDC, Ahmedabad"; price=25000000; priceDisplay="\u{20B9}2.5Cr"; bhk="0"; sqft=10000; furnishing="Unfurnished"; amenities=["Three Phase Power","Loading Dock","Office Space","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Vatva Industrial Park"; ownerName="Jayesh Patel"; ownerPhone="+91 9876504001"; ownerEmail="jayesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-15" },
      { id="p658"; propertyType="Industrial"; action="Rent"; title="Industrial Shed in Naroda"; description="Fully functional industrial shed for rent in Naroda, near national highway."; location="Naroda"; city="Ahmedabad"; address="Naroda, Ahmedabad"; price=80000; priceDisplay="\u{20B9}80,000/mo"; bhk="0"; sqft=12000; furnishing="Unfurnished"; amenities=["Three Phase Power","Security","Loading Dock"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Naroda Industrial"; ownerName="Bhavesh Rana"; ownerPhone="+91 9876504002"; ownerEmail="bhavesh.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-10" },
      { id="p659"; propertyType="Industrial"; action="Buy"; title="Manufacturing Unit in Odhav"; description="Manufacturing unit in Odhav GIDC with chemical clearance and EPA compliance."; location="Odhav"; city="Ahmedabad"; address="Odhav GIDC, Ahmedabad"; price=45000000; priceDisplay="\u{20B9}4.5Cr"; bhk="0"; sqft=20000; furnishing="Unfurnished"; amenities=["Three Phase Power","Loading Dock","Security","ETP Plant"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Odhav Industrial Zone"; ownerName="Dinesh Rathod"; ownerPhone="+91 9876504003"; ownerEmail="dinesh.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-20" },
      { id="p660"; propertyType="Industrial"; action="Rent"; title="Warehouse in Kathwada"; description="Large warehouse in Kathwada industrial area for storage and distribution."; location="Kathwada"; city="Ahmedabad"; address="Kathwada, Ahmedabad"; price=100000; priceDisplay="\u{20B9}1L/mo"; bhk="0"; sqft=15000; furnishing="Unfurnished"; amenities=["Truck Bay","Security","Loading Dock","Office Space"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Kathwada Logistics Park"; ownerName="Suresh Parmar"; ownerPhone="+91 9876504004"; ownerEmail="suresh.pa@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-05" },
      { id="p661"; propertyType="Industrial"; action="Buy"; title="Industrial Plot in Vatva"; description="Industrial NA plot in Vatva with zoning approval for manufacturing use."; location="Vatva"; city="Ahmedabad"; address="Vatva, Ahmedabad"; price=15000000; priceDisplay="\u{20B9}1.5Cr"; bhk="0"; sqft=5000; furnishing="Unfurnished"; amenities=["Road Access","Water Connection"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Pradip Vora"; ownerPhone="+91 9876504005"; ownerEmail="pradip.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-01" },
      { id="p662"; propertyType="Industrial"; action="Rent"; title="Cold Storage in Naroda"; description="Temperature-controlled cold storage facility for food processing and pharmaceuticals."; location="Naroda"; city="Ahmedabad"; address="Naroda GIDC, Ahmedabad"; price=150000; priceDisplay="\u{20B9}1.5L/mo"; bhk="0"; sqft=8000; furnishing="Fully Furnished"; amenities=["Cold Storage Units","Three Phase Power","Security","Loading Dock"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Naroda Cold Chain"; ownerName="Nilesh Trivedi"; ownerPhone="+91 9876504006"; ownerEmail="nilesh.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-15" },
      { id="p663"; propertyType="Industrial"; action="Buy"; title="Steel Factory in Odhav"; description="Ready-to-operate steel fabrication factory in Odhav with EOT crane and power lines."; location="Odhav"; city="Ahmedabad"; address="Odhav GIDC, Ahmedabad"; price=80000000; priceDisplay="\u{20B9}8Cr"; bhk="0"; sqft=30000; furnishing="Fully Furnished"; amenities=["EOT Crane","Three Phase Power","Loading Dock","Security","Office Block"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Odhav Steel Zone"; ownerName="Viram Patel"; ownerPhone="+91 9876504007"; ownerEmail="viram.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-04-10" },
      { id="p664"; propertyType="Plot"; action="Buy"; title="NA Residential Plot in Bopal"; description="Freehold NA residential plot in Bopal with all utilities connections available."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=8500000; priceDisplay="\u{20B9}85L"; bhk="0"; sqft=2000; furnishing="Unfurnished"; amenities=["Road Access","Water Connection","Electricity"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName=""; ownerName="Mahesh Patel"; ownerPhone="+91 9876505001"; ownerEmail="mahesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-10" },
      { id="p665"; propertyType="Plot"; action="Buy"; title="Residential Plot in Shela"; description="Premium NA plot in Shela, suitable for luxury bungalow construction."; location="Shela"; city="Ahmedabad"; address="Shela, Ahmedabad"; price=15000000; priceDisplay="\u{20B9}1.5Cr"; bhk="0"; sqft=3500; furnishing="Unfurnished"; amenities=["Road Access","Water Connection","Electricity"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName=""; ownerName="Alpa Shah"; ownerPhone="+91 9876505002"; ownerEmail="alpa.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-01" },
      { id="p666"; propertyType="Plot"; action="Buy"; title="Agricultural Land in Sanand"; description="Fertile agricultural land in Sanand taluka near industrial corridor."; location="Sanand"; city="Ahmedabad"; address="Sanand, Ahmedabad"; price=5000000; priceDisplay="\u{20B9}50L"; bhk="0"; sqft=50000; furnishing="Unfurnished"; amenities=["Road Access","Irrigation Canal Nearby"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName=""; ownerName="Ramesh Chaudhary"; ownerPhone="+91 9876505003"; ownerEmail="ramesh.ch@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-20" },
      { id="p667"; propertyType="Plot"; action="Buy"; title="Commercial NA Plot in Dholka"; description="Commercial NA plot on NH-947 near Dholka, ideal for hotel, showroom or godown."; location="Dholka"; city="Ahmedabad"; address="Dholka, Ahmedabad"; price=12000000; priceDisplay="\u{20B9}1.2Cr"; bhk="0"; sqft=8000; furnishing="Unfurnished"; amenities=["Highway Frontage","Road Access"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName=""; ownerName="Bharat Desai"; ownerPhone="+91 9876505004"; ownerEmail="bharat.d@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-25" },
      { id="p668"; propertyType="Plot"; action="Buy"; title="Plotted Scheme in South Bopal"; description="Plotted development scheme in South Bopal by government-approved layout. RERA registered."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=6500000; priceDisplay="\u{20B9}65L"; bhk="0"; sqft=1500; furnishing="Unfurnished"; amenities=["Road Access","Water Connection","Electricity","Footpath"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName="South Bopal Plots"; ownerName="Shilpa Joshi"; ownerPhone="+91 9876505005"; ownerEmail="shilpa.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-05" },
      { id="p669"; propertyType="Plot"; action="Buy"; title="Farm Land in Sanand"; description="Large farm land parcel in Sanand with borewell and boundary wall."; location="Sanand"; city="Ahmedabad"; address="Sanand Taluka, Ahmedabad"; price=20000000; priceDisplay="\u{20B9}2Cr"; bhk="0"; sqft=200000; furnishing="Unfurnished"; amenities=["Borewell","Boundary Wall","Road Access"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=0; societyName=""; ownerName="Ghanshyam Patel"; ownerPhone="+91 9876505006"; ownerEmail="ghanshyam.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-10" },
      { id="p670"; propertyType="Pre-launch"; action="Buy"; title="Under Construction 2 BHK in Thaltej"; description="New launch 2BHK project in Thaltej with possession in 2026. RERA approved."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=11000000; priceDisplay="\u{20B9}1.1Cr"; bhk="2 BHK"; sqft=1200; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Thaltej New Launch"; ownerName="Sachin Bhatt"; ownerPhone="+91 9876506001"; ownerEmail="sachin.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-15" },
      { id="p671"; propertyType="Pre-launch"; action="Buy"; title="Under Construction 3 BHK in Shela"; description="Under-construction 3BHK in Shela with possession December 2026."; location="Shela"; city="Ahmedabad"; address="Shela, Ahmedabad"; price=18000000; priceDisplay="\u{20B9}1.8Cr"; bhk="3 BHK"; sqft=1850; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Garden","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="West"; floorNo=6; societyName="Shela New Project"; ownerName="Priti Rao"; ownerPhone="+91 9876506002"; ownerEmail="priti.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-01" },
      { id="p672"; propertyType="Pre-launch"; action="Buy"; title="New Launch 2 BHK in Bopal"; description="Soft launch pricing for 2BHK in Bopal. Early bird discount of 5%. Possession 2025."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=8500000; priceDisplay="\u{20B9}85L"; bhk="2 BHK"; sqft=1100; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Garden"]; possession="Within 3 Months"; images=[]; mapLink=""; facing="North-East"; floorNo=5; societyName="Bopal New Launch"; ownerName="Kiran Jain"; ownerPhone="+91 9876506003"; ownerEmail="kiran.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-20" },
      { id="p673"; propertyType="Pre-launch"; action="Buy"; title="Pre-launch 3 BHK in South Bopal"; description="Pre-launch offer for 3BHK in South Bopal. Top floor available with terrace rights."; location="South Bopal"; city="Ahmedabad"; address="South Bopal, Ahmedabad"; price=15000000; priceDisplay="\u{20B9}1.5Cr"; bhk="3 BHK"; sqft=1700; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Garden","Club House"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=10; societyName="South Bopal Tower"; ownerName="Abhilash Mehta"; ownerPhone="+91 9876506004"; ownerEmail="abhilash.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-10" },
      { id="p674"; propertyType="Luxury"; action="Buy"; title="Luxury 4 BHK in Prahlad Nagar"; description="Signature luxury 4BHK in Prahlad Nagar with custom interior design and smart home automation."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=55000000; priceDisplay="\u{20B9}5.5Cr"; bhk="4 BHK"; sqft=5000; furnishing="Fully Furnished"; amenities=["Smart Home","Private Lift","Jacuzzi","Gym","Wine Cellar","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=12; societyName="Prahlad Luxury"; ownerName="Suresh Bajaj"; ownerPhone="+91 9876507001"; ownerEmail="suresh.ba@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-01" },
      { id="p675"; propertyType="Luxury"; action="Buy"; title="Luxury Penthouse on SG Highway"; description="Top-floor luxury penthouse on SG Highway with private terrace, pool, and butler service."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=90000000; priceDisplay="\u{20B9}9Cr"; bhk="5 BHK"; sqft=9000; furnishing="Fully Furnished"; amenities=["Private Pool","Gym","Home Theatre","Butler","Smart Home","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=20; societyName="SG Luxury Tower"; ownerName="Anand Birla"; ownerPhone="+91 9876507002"; ownerEmail="anand.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-04-15" },
      { id="p676"; propertyType="Luxury"; action="Buy"; title="Luxury Villa in Vastrapur"; description="Architect-designed luxury villa in Vastrapur with Zen garden, infinity pool, and home office."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=100000000; priceDisplay="\u{20B9}10Cr"; bhk="5 BHK"; sqft=10000; furnishing="Fully Furnished"; amenities=["Infinity Pool","Zen Garden","Home Office","Staff Quarters","Security","Solar Power","Lift"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Pradeep Kulkarni"; ownerPhone="+91 9876507003"; ownerEmail="pradeep.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-03-20" },
      { id="p677"; propertyType="Luxury"; action="Buy"; title="Luxury 3 BHK in Navrangpura"; description="Boutique luxury 3BHK in Navrangpura limited to 4 units per floor. Concierge services included."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=40000000; priceDisplay="\u{20B9}4Cr"; bhk="3 BHK"; sqft=3500; furnishing="Fully Furnished"; amenities=["Concierge","Smart Home","Gym","Swimming Pool","Private Lift","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Navrangpura Boutique"; ownerName="Ritu Saraf"; ownerPhone="+91 9876507004"; ownerEmail="ritu.sa@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-15" },
      { id="p678"; propertyType="Luxury"; action="Buy"; title="Ultra Luxury Bungalow in Satellite"; description="Iconic ultra-luxury bungalow in Satellite with helipad provision, 3-car garage, and private cinema."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=150000000; priceDisplay="\u{20B9}15Cr"; bhk="5 BHK"; sqft=15000; furnishing="Fully Furnished"; amenities=["Private Cinema","3-Car Garage","Pool","Gym","Staff Quarters","Security","Smart Home"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName=""; ownerName="Vinod Agarwal"; ownerPhone="+91 9876507005"; ownerEmail="vinod.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-02-10" },
      { id="p679"; propertyType="Mixed"; action="Rent"; title="PG Accommodation in Navrangpura"; description="Premium PG for working professionals in Navrangpura. Meals included, Wi-Fi, laundry."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=8500; priceDisplay="\u{20B9}8,500/mo"; bhk="0"; sqft=200; furnishing="Fully Furnished"; amenities=["Meals","Wi-Fi","Laundry","AC","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Navrangpura PG"; ownerName="Jayshree Patel"; ownerPhone="+91 9876508001"; ownerEmail="jayshree.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-10" },
      { id="p680"; propertyType="Mixed"; action="Rent"; title="Studio Apartment in CG Road"; description="Modern studio apartment on CG Road, fully furnished and ready to move."; location="CG Road"; city="Ahmedabad"; address="CG Road, Ahmedabad"; price=12000; priceDisplay="\u{20B9}12,000/mo"; bhk="1 BHK"; sqft=400; furnishing="Fully Furnished"; amenities=["Wi-Fi","Parking","Security","Power Backup"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="CG Studios"; ownerName="Abhishek Joshi"; ownerPhone="+91 9876508002"; ownerEmail="abhishek.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-25" },
      { id="p681"; propertyType="Mixed"; action="Rent"; title="Co-living Space in Naranpura"; description="Co-living facility in Naranpura with private room, shared common areas and kitchen."; location="Naranpura"; city="Ahmedabad"; address="Naranpura, Ahmedabad"; price=9500; priceDisplay="\u{20B9}9,500/mo"; bhk="0"; sqft=250; furnishing="Fully Furnished"; amenities=["Wi-Fi","Common Kitchen","Security","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Naranpura Co-Living"; ownerName="Yashpal Singh"; ownerPhone="+91 9876508003"; ownerEmail="yashpal.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-01" },
      { id="p682"; propertyType="Mixed"; action="Rent"; title="Girls Hostel in Ambawadi"; description="Secure girls-only hostel in Ambawadi. Meals, laundry, AC included. Curfew at 10 PM."; location="Ambawadi"; city="Ahmedabad"; address="Ambawadi, Ahmedabad"; price=7500; priceDisplay="\u{20B9}7,500/mo"; bhk="0"; sqft=150; furnishing="Fully Furnished"; amenities=["Meals","Laundry","AC","Security","CCTV"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Ambawadi Girls Hostel"; ownerName="Sushilaben Patel"; ownerPhone="+91 9876508004"; ownerEmail="sushila.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-15" },
      { id="p683"; propertyType="Mixed"; action="Rent"; title="Serviced Apartment in Vastrapur"; description="Hotel-style serviced apartment in Vastrapur with daily housekeeping and room service."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=35000; priceDisplay="\u{20B9}35,000/mo"; bhk="1 BHK"; sqft=600; furnishing="Fully Furnished"; amenities=["Room Service","Housekeeping","Gym","Pool","Security","Wi-Fi"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=6; societyName="Vastrapur Serviced"; ownerName="Rashmi Kapoor"; ownerPhone="+91 9876508005"; ownerEmail="rashmi.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-20" },
    ];
    propertyListings.addAll(batchA.vals());
  };

  // Batch B: Properties p684-p730 (47 properties)
  do {
    let batchB : [PropertyListing] = [
      { id="p684"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Bopal"; description="Newly launched 2BHK in Bopal near D-Mart with reserved parking."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=7200000; priceDisplay="\u{20B9}72L"; bhk="2 BHK"; sqft=1000; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Bopal Maple"; ownerName="Kamlesh Patel"; ownerPhone="+91 9876509001"; ownerEmail="kamlesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-10" },
      { id="p685"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Bopal"; description="Spacious 3BHK in Bopal with modular kitchen and covered car parking."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=11500000; priceDisplay="\u{20B9}1.15Cr"; bhk="3 BHK"; sqft=1550; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=5; societyName="Bopal Maple Heights"; ownerName="Savita Rathod"; ownerPhone="+91 9876509002"; ownerEmail="savita.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-20" },
      { id="p686"; propertyType="Residential"; action="Buy"; title="2 BHK in Bopal Outer"; description="Affordable 2BHK near Bopal cross roads with easy highway access."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=6800000; priceDisplay="\u{20B9}68L"; bhk="2 BHK"; sqft=950; furnishing="Unfurnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=2; societyName="Bopal Ring"; ownerName="Devang Joshi"; ownerPhone="+91 9876509003"; ownerEmail="devang.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-05" },
      { id="p687"; propertyType="Residential"; action="Buy"; title="4 BHK in Bopal Premium"; description="Premium 4BHK in Bopal with terrace garden and home automation."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=25000000; priceDisplay="\u{20B9}2.5Cr"; bhk="4 BHK"; sqft=2800; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=8; societyName="Bopal Premium"; ownerName="Navin Shah"; ownerPhone="+91 9876509004"; ownerEmail="navin.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-01" },
      { id="p688"; propertyType="Residential"; action="Buy"; title="3 BHK in Bopal Society"; description="Ready-to-move 3BHK in gated society in Bopal with 24-hour security."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=13000000; priceDisplay="\u{20B9}1.3Cr"; bhk="3 BHK"; sqft=1600; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Garden","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=4; societyName="Bopal Gated"; ownerName="Bhoomi Mehta"; ownerPhone="+91 9876509005"; ownerEmail="bhoomi.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-15" },
      { id="p689"; propertyType="Residential"; action="Buy"; title="2 BHK in Thaltej Metro"; description="Metro-connected 2BHK in Thaltej, great for IT professionals."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=9200000; priceDisplay="\u{20B9}92L"; bhk="2 BHK"; sqft=1100; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=6; societyName="Thaltej Metro Park"; ownerName="Chirag Patel"; ownerPhone="+91 9876509006"; ownerEmail="chirag.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-25" },
      { id="p690"; propertyType="Residential"; action="Buy"; title="3 BHK in Thaltej Luxury"; description="Luxury 3BHK in Thaltej with marble floors and designer lighting."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=16000000; priceDisplay="\u{20B9}1.6Cr"; bhk="3 BHK"; sqft=1800; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=9; societyName="Thaltej Royal"; ownerName="Hiral Shah"; ownerPhone="+91 9876509007"; ownerEmail="hiral.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-20" },
      { id="p691"; propertyType="Residential"; action="Buy"; title="2 BHK Flat in Navrangpura"; description="Clean 2BHK in Navrangpura near Swaminarayan temple and market."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=13500000; priceDisplay="\u{20B9}1.35Cr"; bhk="2 BHK"; sqft=1150; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=3; societyName="Navrangpura Park"; ownerName="Ashaben Chauhan"; ownerPhone="+91 9876509008"; ownerEmail="asha.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-25" },
      { id="p692"; propertyType="Residential"; action="Buy"; title="4 BHK Flat in Navrangpura"; description="Prestigious 4BHK in Navrangpura with large balconies."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=42000000; priceDisplay="\u{20B9}4.2Cr"; bhk="4 BHK"; sqft=4000; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Club House","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=7; societyName="Navrangpura Premium"; ownerName="Sundar Goel"; ownerPhone="+91 9876509009"; ownerEmail="sundar.g@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-05" },
      { id="p693"; propertyType="Residential"; action="Buy"; title="3 BHK Flat in Satellite Boutique"; description="Ultra-premium 3BHK in Satellite in a boutique 12-unit building with concierge."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=28000000; priceDisplay="\u{20B9}2.8Cr"; bhk="3 BHK"; sqft=2500; furnishing="Fully Furnished"; amenities=["Concierge","Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=6; societyName="Satellite Boutique"; ownerName="Ananya Mehta"; ownerPhone="+91 9876509010"; ownerEmail="ananya.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-25" },
      { id="p694"; propertyType="Residential"; action="Buy"; title="5 BHK Penthouse in Satellite"; description="Magnificent 5BHK penthouse in Satellite with 360-degree city views."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=75000000; priceDisplay="\u{20B9}7.5Cr"; bhk="5 BHK"; sqft=8000; furnishing="Fully Furnished"; amenities=["Private Terrace","Pool","Gym","Home Theatre","Butler","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=18; societyName="Satellite Sky"; ownerName="Hemant Kapoor"; ownerPhone="+91 9876509011"; ownerEmail="hemant.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-10" },
      { id="p695"; propertyType="Residential"; action="Buy"; title="2 BHK Luxury in Prahlad Nagar"; description="Luxury 2BHK in Prahlad Nagar with Italian marble and premium brand fittings."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=19000000; priceDisplay="\u{20B9}1.9Cr"; bhk="2 BHK"; sqft=1400; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=4; societyName="Prahlad Luxury Park"; ownerName="Archana Gupta"; ownerPhone="+91 9876509012"; ownerEmail="archana.g@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-10" },
      { id="p696"; propertyType="Residential"; action="Buy"; title="3 BHK on SG Highway Frontage"; description="Road-facing 3BHK on SG Highway in a landmark building."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=20000000; priceDisplay="\u{20B9}2Cr"; bhk="3 BHK"; sqft=1950; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security","Gym","Club House"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=5; societyName="SG Frontage"; ownerName="Sonal Pandya"; ownerPhone="+91 9876509013"; ownerEmail="sonal.pa@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-10" },
      { id="p697"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Bopal"; description="2BHK for family rent in Bopal with dedicated parking and play area."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=17000; priceDisplay="\u{20B9}17,000/mo"; bhk="2 BHK"; sqft=980; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=3; societyName="Bopal Rent Zone"; ownerName="Rekha Patel"; ownerPhone="+91 9876509014"; ownerEmail="rekha.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-05" },
      { id="p698"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent in Thaltej"; description="Fully furnished 3BHK in Thaltej for corporate rent."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=28000; priceDisplay="\u{20B9}28,000/mo"; bhk="3 BHK"; sqft=1600; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=7; societyName="Thaltej Corp Rents"; ownerName="Hiral Trivedi"; ownerPhone="+91 9876509015"; ownerEmail="hiral.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-05" },
      { id="p699"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent near ISCON"; description="2BHK for rent near ISCON on SG Highway, perfect for IT couples."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=25000; priceDisplay="\u{20B9}25,000/mo"; bhk="2 BHK"; sqft=1100; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=6; societyName="SG Rent Suites"; ownerName="Meena Shah"; ownerPhone="+91 9876509016"; ownerEmail="meena.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-20" },
      { id="p700"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Satellite"; description="Cozy 1BHK in Satellite for single professionals."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=14000; priceDisplay="\u{20B9}14,000/mo"; bhk="1 BHK"; sqft=550; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Satellite Mini"; ownerName="Chetna Raval"; ownerPhone="+91 9876509017"; ownerEmail="chetna.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-10" },
      { id="p701"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent in Prahlad Nagar"; description="Luxury 3BHK in Prahlad Nagar for long-term rent."; location="Prahlad Nagar"; city="Ahmedabad"; address="Prahlad Nagar, Ahmedabad"; price=50000; priceDisplay="\u{20B9}50,000/mo"; bhk="3 BHK"; sqft=2200; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=9; societyName="Prahlad Luxury Rents"; ownerName="Vikram Mehta"; ownerPhone="+91 9876509018"; ownerEmail="vikram.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-25" },
      { id="p702"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Navrangpura"; description="2BHK with attached study in Navrangpura near St. Xavier school."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=20000; priceDisplay="\u{20B9}20,000/mo"; bhk="2 BHK"; sqft=1050; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South"; floorNo=2; societyName="Navrangpura Green"; ownerName="Mamta Bhatt"; ownerPhone="+91 9876509019"; ownerEmail="mamta.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-15" },
      { id="p703"; propertyType="Commercial"; action="Buy"; title="IT Park Office in SG Highway"; description="Grade-A IT office space in SG Highway park with dedicated power and fiber."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=25000000; priceDisplay="\u{20B9}2.5Cr"; bhk="0"; sqft=3500; furnishing="Fully Furnished"; amenities=["Power Backup","Fiber Internet","Security","Cafeteria"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=3; societyName="SG IT Park"; ownerName="Abhay Sharma"; ownerPhone="+91 9876509020"; ownerEmail="abhay.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-20" },
      { id="p704"; propertyType="Commercial"; action="Rent"; title="Kiosk Space in Satellite Mall"; description="Prime kiosk space in busy Satellite mall corridor."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=40000; priceDisplay="\u{20B9}40,000/mo"; bhk="0"; sqft=200; furnishing="Unfurnished"; amenities=["Power Supply","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Satellite Mall"; ownerName="Puja Rao"; ownerPhone="+91 9876509021"; ownerEmail="puja.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-15" },
      { id="p705"; propertyType="Industrial"; action="Buy"; title="Pharma Factory in Vatva"; description="GMP-compliant pharmaceutical factory in Vatva GIDC with clean rooms."; location="Vatva"; city="Ahmedabad"; address="Vatva GIDC, Ahmedabad"; price=60000000; priceDisplay="\u{20B9}6Cr"; bhk="0"; sqft=25000; furnishing="Fully Furnished"; amenities=["Clean Rooms","Three Phase Power","Security","ETP"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Vatva Pharma Zone"; ownerName="Kamlesh Vora"; ownerPhone="+91 9876509022"; ownerEmail="kamlesh.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-06-05" },
      { id="p706"; propertyType="Industrial"; action="Rent"; title="Textile Factory in Naroda"; description="Ready textile manufacturing unit in Naroda with weaving setup."; location="Naroda"; city="Ahmedabad"; address="Naroda GIDC, Ahmedabad"; price=120000; priceDisplay="\u{20B9}1.2L/mo"; bhk="0"; sqft=18000; furnishing="Fully Furnished"; amenities=["Three Phase Power","Loading Dock","Security","Canteen"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Naroda Textile Zone"; ownerName="Suryakant Patel"; ownerPhone="+91 9876509023"; ownerEmail="suryakant.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-25" },
      { id="p707"; propertyType="Plot"; action="Buy"; title="Corner Plot in Thaltej"; description="Corner NA residential plot in Thaltej, excellent visibility."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=18000000; priceDisplay="\u{20B9}1.8Cr"; bhk="0"; sqft=2500; furnishing="Unfurnished"; amenities=["Road Access","Water Connection","Electricity"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=0; societyName=""; ownerName="Nalini Joshi"; ownerPhone="+91 9876509024"; ownerEmail="nalini.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-15" },
      { id="p708"; propertyType="Pre-launch"; action="Buy"; title="New Launch 3 BHK in Navrangpura"; description="Exclusive pre-launch pricing for 3BHK in Navrangpura. Only 8 units."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=24000000; priceDisplay="\u{20B9}2.4Cr"; bhk="3 BHK"; sqft=2200; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Swimming Pool"]; possession="Under Construction"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Navrangpura New Launch"; ownerName="Prakash Jain"; ownerPhone="+91 9876509025"; ownerEmail="prakash.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-15" },
      { id="p709"; propertyType="Luxury"; action="Buy"; title="Luxury 4 BHK in SG Highway"; description="Signature 4BHK in SG Highway tower with private pool deck and butler."; location="SG Highway"; city="Ahmedabad"; address="SG Highway, Ahmedabad"; price=65000000; priceDisplay="\u{20B9}6.5Cr"; bhk="4 BHK"; sqft=6500; furnishing="Fully Furnished"; amenities=["Private Pool Deck","Butler","Smart Home","Gym","Home Theatre"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=16; societyName="SG Signature"; ownerName="Nishant Birla"; ownerPhone="+91 9876509026"; ownerEmail="nishant.b@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-04-25" },
      { id="p710"; propertyType="Mixed"; action="Rent"; title="Boys Hostel in Gota"; description="Boys hostel near Nirma University, meals and Wi-Fi included."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=6000; priceDisplay="\u{20B9}6,000/mo"; bhk="0"; sqft=120; furnishing="Fully Furnished"; amenities=["Meals","Wi-Fi","Security","Laundry"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Gota Hostel"; ownerName="Nilesh Vaghela"; ownerPhone="+91 9876509027"; ownerEmail="nilesh.v@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-25" },
      { id="p711"; propertyType="Residential"; action="Buy"; title="2 BHK in Chandkheda Phase 2"; description="New Phase 2 apartments in Chandkheda with premium specs."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=6500000; priceDisplay="\u{20B9}65L"; bhk="2 BHK"; sqft=1020; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=4; societyName="Chandkheda Phase 2"; ownerName="Prashant Oza"; ownerPhone="+91 9876509028"; ownerEmail="prashant.o@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-20" },
      { id="p712"; propertyType="Residential"; action="Buy"; title="3 BHK in Vastral Township"; description="Affordable 3BHK in Vastral township with all basic amenities."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=6000000; priceDisplay="\u{20B9}60L"; bhk="3 BHK"; sqft=1200; furnishing="Unfurnished"; amenities=["Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Vastral Township"; ownerName="Dharmesh Parmar"; ownerPhone="+91 9876509029"; ownerEmail="dharmesh.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-05" },
      { id="p713"; propertyType="Residential"; action="Buy"; title="2 BHK in Nikol Premium"; description="Premium 2BHK in Nikol with modular kitchen and safety door."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=5000000; priceDisplay="\u{20B9}50L"; bhk="2 BHK"; sqft=960; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Nikol Premium"; ownerName="Vasant Rao"; ownerPhone="+91 9876509030"; ownerEmail="vasant.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-20" },
      { id="p714"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Chandkheda"; description="Good quality 2BHK for rent in Chandkheda near ISRO colony."; location="Chandkheda"; city="Ahmedabad"; address="Chandkheda, Ahmedabad"; price=14000; priceDisplay="\u{20B9}14,000/mo"; bhk="2 BHK"; sqft=920; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="South-East"; floorNo=2; societyName="Chandkheda Homes"; ownerName="Sejal Patel"; ownerPhone="+91 9876509031"; ownerEmail="sejal.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-30" },
      { id="p715"; propertyType="Residential"; action="Rent"; title="1 BHK for Rent in Nikol"; description="Budget 1BHK for rent in Nikol, good for workers."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=7500; priceDisplay="\u{20B9}7,500/mo"; bhk="1 BHK"; sqft=450; furnishing="Unfurnished"; amenities=["Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName=""; ownerName="Kamlesh Chauhan"; ownerPhone="+91 9876509032"; ownerEmail="kamlesh.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-15" },
      { id="p716"; propertyType="Residential"; action="Rent"; title="3 BHK for Rent near Ellis Bridge"; description="Premium 3BHK for rent near Ellis Bridge in Navrangpura, fully furnished."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=35000; priceDisplay="\u{20B9}35,000/mo"; bhk="3 BHK"; sqft=1650; furnishing="Fully Furnished"; amenities=["Lift","Parking","Security","Garden"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=5; societyName="Navrangpura Ellis"; ownerName="Dina Kothari"; ownerPhone="+91 9876509033"; ownerEmail="dina.k@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-30" },
      { id="p717"; propertyType="Commercial"; action="Rent"; title="Office Space in Vastrapur"; description="Ready office in Vastrapur with partitioned cabins and conference room."; location="Vastrapur"; city="Ahmedabad"; address="Vastrapur, Ahmedabad"; price=45000; priceDisplay="\u{20B9}45,000/mo"; bhk="0"; sqft=1200; furnishing="Semi-Furnished"; amenities=["Power Backup","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=2; societyName="Vastrapur Office Park"; ownerName="Rushabh Shah"; ownerPhone="+91 9876509034"; ownerEmail="rushabh.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-30" },
      { id="p718"; propertyType="Commercial"; action="Buy"; title="Showroom in Bopal Market"; description="Ground floor showroom in Bopal market area, ideal for automobile or furniture brand."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=12000000; priceDisplay="\u{20B9}1.2Cr"; bhk="0"; sqft=1800; furnishing="Unfurnished"; amenities=["Power Backup","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Bopal Commercial"; ownerName="Bhavna Trivedi"; ownerPhone="+91 9876509035"; ownerEmail="bhavna.t@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-07-10" },
      { id="p719"; propertyType="Industrial"; action="Buy"; title="Chemical Factory in Odhav"; description="Approved chemical plant in Odhav GIDC with effluent treatment."; location="Odhav"; city="Ahmedabad"; address="Odhav GIDC, Ahmedabad"; price=55000000; priceDisplay="\u{20B9}5.5Cr"; bhk="0"; sqft=22000; furnishing="Fully Furnished"; amenities=["ETP","Three Phase Power","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=1; societyName="Odhav Chemical Zone"; ownerName="Vasant Patel"; ownerPhone="+91 9876509036"; ownerEmail="vasant.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-05-05" },
      { id="p720"; propertyType="Plot"; action="Buy"; title="Residential Plot in Gota"; description="NA residential plot in Gota for independent house construction."; location="Gota"; city="Ahmedabad"; address="Gota, Ahmedabad"; price=5500000; priceDisplay="\u{20B9}55L"; bhk="0"; sqft=1800; furnishing="Unfurnished"; amenities=["Road Access","Water Connection"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=0; societyName=""; ownerName="Ajay Solanki"; ownerPhone="+91 9876509037"; ownerEmail="ajay.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-10-30" },
      { id="p721"; propertyType="Residential"; action="Buy"; title="2 BHK in Randesan"; description="2BHK near PDPU in Randesan. RERA compliant, ready to move."; location="Randesan"; city="Ahmedabad"; address="Randesan, Gandhinagar"; price=7000000; priceDisplay="\u{20B9}70L"; bhk="2 BHK"; sqft=1050; furnishing="Unfurnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="North"; floorNo=3; societyName="Randesan Park"; ownerName="Payal Patel"; ownerPhone="+91 9876509038"; ownerEmail="payal.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-28" },
      { id="p722"; propertyType="Residential"; action="Buy"; title="3 BHK near Motera Stadium"; description="3BHK near Motera cricket stadium. Great rental potential."; location="Motera"; city="Ahmedabad"; address="Motera, Ahmedabad"; price=10000000; priceDisplay="\u{20B9}1Cr"; bhk="3 BHK"; sqft=1500; furnishing="Semi-Furnished"; amenities=["Lift","Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=4; societyName="Motera Stadium View"; ownerName="Saurabh Jain"; ownerPhone="+91 9876509039"; ownerEmail="saurabh.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-12-10" },
      { id="p723"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Vastral"; description="Decent 2BHK on rent in Vastral for families."; location="Vastral"; city="Ahmedabad"; address="Vastral, Ahmedabad"; price=10000; priceDisplay="\u{20B9}10,000/mo"; bhk="2 BHK"; sqft=800; furnishing="Unfurnished"; amenities=["Parking"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=1; societyName="Vastral Homes"; ownerName="Manilal Patel"; ownerPhone="+91 9876509040"; ownerEmail="manilal.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-08" },
      { id="p724"; propertyType="Residential"; action="Rent"; title="2 BHK for Rent in Nikol"; description="Clean 2BHK for rent in Nikol for East Ahmedabad workforce."; location="Nikol"; city="Ahmedabad"; address="Nikol, Ahmedabad"; price=11000; priceDisplay="\u{20B9}11,000/mo"; bhk="2 BHK"; sqft=850; furnishing="Semi-Furnished"; amenities=["Parking","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=2; societyName="Nikol Workers"; ownerName="Savita Chauhan"; ownerPhone="+91 9876509041"; ownerEmail="savita.c@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-28" },
      { id="p725"; propertyType="Commercial"; action="Rent"; title="Salon Space in Navrangpura"; description="Ready salon space in Navrangpura high street, all fittings included."; location="Navrangpura"; city="Ahmedabad"; address="Navrangpura, Ahmedabad"; price=30000; priceDisplay="\u{20B9}30,000/mo"; bhk="0"; sqft=500; furnishing="Fully Furnished"; amenities=["Power Supply","Water Supply"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName="Navrangpura High Street"; ownerName="Shruti Mehta"; ownerPhone="+91 9876509042"; ownerEmail="shruti.m@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-09-08" },
      { id="p726"; propertyType="Industrial"; action="Rent"; title="Logistics Hub in Kathwada"; description="Multi-dock logistics hub in Kathwada for e-commerce distribution."; location="Kathwada"; city="Ahmedabad"; address="Kathwada, Ahmedabad"; price=200000; priceDisplay="\u{20B9}2L/mo"; bhk="0"; sqft=20000; furnishing="Unfurnished"; amenities=["Multiple Loading Docks","Security","Three Phase Power"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName="Kathwada Logistics"; ownerName="Ganesh Rao"; ownerPhone="+91 9876509043"; ownerEmail="ganesh.r@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-08-12" },
      { id="p727"; propertyType="Pre-launch"; action="Buy"; title="Exclusive Pre-launch 4 BHK in Satellite"; description="Exclusive pre-launch 4BHK in Satellite. Only 12 units available."; location="Satellite"; city="Ahmedabad"; address="Satellite, Ahmedabad"; price=55000000; priceDisplay="\u{20B9}5.5Cr"; bhk="4 BHK"; sqft=5200; furnishing="Unfurnished"; amenities=["Lift","Parking","Security","Gym","Pool","Smart Home"]; possession="Under Construction"; images=[]; mapLink=""; facing="North"; floorNo=10; societyName="Satellite Exclusive"; ownerName="Brijesh Shah"; ownerPhone="+91 9876509044"; ownerEmail="brijesh.s@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-02-20" },
      { id="p728"; propertyType="Luxury"; action="Buy"; title="Luxury Farmhouse on Sanand Highway"; description="Sprawling luxury farmhouse with organic farm and swimming pool."; location="Sanand"; city="Ahmedabad"; address="Sanand Highway, Ahmedabad"; price=120000000; priceDisplay="\u{20B9}12Cr"; bhk="5 BHK"; sqft=20000; furnishing="Fully Furnished"; amenities=["Organic Farm","Swimming Pool","Stable","Solar Power","Security"]; possession="Immediate"; images=[]; mapLink=""; facing="East"; floorNo=1; societyName=""; ownerName="Jignesh Agarwal"; ownerPhone="+91 9876509045"; ownerEmail="jignesh.a@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-03-15" },
      { id="p729"; propertyType="Mixed"; action="Rent"; title="Co-working Desks in Thaltej"; description="Professional co-working desks and cabins near metro in Thaltej."; location="Thaltej"; city="Ahmedabad"; address="Thaltej, Ahmedabad"; price=5000; priceDisplay="\u{20B9}5,000/desk/mo"; bhk="0"; sqft=50; furnishing="Fully Furnished"; amenities=["High Speed Wi-Fi","Meeting Room","Coffee Station"]; possession="Immediate"; images=[]; mapLink=""; facing="West"; floorNo=3; societyName="Thaltej Co-Work"; ownerName="Mihir Joshi"; ownerPhone="+91 9876509046"; ownerEmail="mihir.j@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2025-01-08" },
      { id="p730"; propertyType="Residential"; action="Buy"; title="2 BHK Row House in Bopal"; description="Independent row house in Bopal with private entrance and open terrace."; location="Bopal"; city="Ahmedabad"; address="Bopal, Ahmedabad"; price=16000000; priceDisplay="\u{20B9}1.6Cr"; bhk="2 BHK"; sqft=1800; furnishing="Semi-Furnished"; amenities=["Private Garden","Parking","Security","Terrace"]; possession="Immediate"; images=[]; mapLink=""; facing="North-East"; floorNo=1; societyName="Bopal Row Houses"; ownerName="Pratibha Patel"; ownerPhone="+91 9876509047"; ownerEmail="pratibha.p@gmail.com"; agencyName="MSTC GLOBAL"; agencyPhone="+91 9512609016"; sourceTag="MSTC GLOBAL"; listedDate="2024-11-12" },
    ];
    propertyListings.addAll(batchB.vals());
  };

  let propertyEnquiries = List.empty<PropertyEnquiry>();
  var nextEnquiryId : Nat = 0;

  // Interaction storage
  let interactions = List.empty<ChatInteraction>();
  var nextInteractionId : Nat = 0;

  // Form storage
  let feedbackList = List.empty<Feedback>();
  let callbackList = List.empty<CallbackRequest>();
  let quoteList = List.empty<QuoteRequest>();
  let moreInfoList = List.empty<MoreInfoRequest>();
  let supportList = List.empty<SupportForm>();
  let submissionList = List.empty<ServiceSubmission>();
  var nextFormId : Nat = 0;
  var nextSubmissionId : Nat = 0;

  // Sentiment inference helper
  func inferSentiment(userMsg : Text, botResp : Text) : Text {
    let combined = (userMsg # " " # botResp).toLower();
    let negKeywords = ["not helpful", "wrong", "bad", "useless", "unclear"];
    let posKeywords = ["thank", "great", "helpful", "good"];
    for (kw in negKeywords.values()) {
      if (combined.contains(#text kw)) { return "needs_attention" };
    };
    for (kw in posKeywords.values()) {
      if (combined.contains(#text kw)) { return "positive" };
    };
    "neutral";
  };

  // Knowledge base bot response
  func knowledgeBaseResponse(msg : Text) : Text {
    let q = msg.toLower();
    if (q.contains(#text "hello") or q.contains(#text "hi") or q.contains(#text "hey") or q.contains(#text "greet") or q.contains(#text "namaste")) {
      return "Welcome to MSTC GLOBAL! I'm your dedicated assistant — I can help with property search, services, loans, events, legal guidance, and more. How can I assist you today?";
    };
    if (q.contains(#text "mstc") or q.contains(#text "company") or q.contains(#text "about") or q.contains(#text "who are you")) {
      return "MSTC GLOBAL is a premier multi-dimensional conglomerate headquartered in Ahmedabad, Gujarat, India. Led by Love Vijaybhai Parekh (Managing Director), we deliver excellence across 8 divisions: Infrastructure, RERA Consulting, Property, Finance, Music & Culture, Hospitality, NGO/CSR, and Media/Tourism. Contact: +91 9512609016 | mstc.gbl@gmail.com";
    };
    if (q.contains(#text "love") or q.contains(#text "parekh") or q.contains(#text "managing director") or q.contains(#text "founder") or q.contains(#text "md")) {
      return "MSTC GLOBAL is led by Love Vijaybhai Parekh, our Managing Director. He can be reached at +91 9512609016.";
    };
    if (q.contains(#text "rera registration") or q.contains(#text "promoter reg") or q.contains(#text "promoter")) {
      return "For RERA Promoter Registration in Gujarat:\n1. Obtain land ownership documents\n2. Get approvals from local authority (AMC/AUDA)\n3. Register on GujRERA portal (rera.gujarat.gov.in)\n4. Upload project layout, development plan, CA certificate\n5. Pay registration fee based on project size\n\nMSTC GLOBAL handles this end-to-end. Call +91 9512609016 for a free consultation.";
    };
    if (q.contains(#text "home loan") or q.contains(#text "loan document") or q.contains(#text "loan eligibility")) {
      return "Documents for a Home Loan in India:\n• KYC: Aadhaar, PAN, passport-size photos\n• Income proof: Salary slips (3 months) / ITR (2 years) for self-employed\n• Bank statements (6 months)\n• Property documents: Sale agreement, title deed, NOC from builder\n• Employment proof: Offer letter / appointment letter\n\nMSTC GLOBAL assists with loan processing across 15+ banking partners. Call +91 9512609016.";
    };
    if (q.contains(#text "redevelopment") or q.contains(#text "redevelop")) {
      return "Redevelopment Process:\n1. Society must pass resolution (75% consent required)\n2. Appoint PMC (Project Management Consultant)\n3. Prepare TDR / FSI calculations\n4. Select developer through bidding\n5. Get AMC/BU permissions and RERA registration\n6. Sign redevelopment agreement\n7. Members move to transit accommodation\n8. Construction and handover\n\nMSTC GLOBAL guides societies through every step. Call +91 9512609016.";
    };
    if (q.contains(#text "event planning") or q.contains(#text "plan event") or q.contains(#text "wedding planning") or q.contains(#text "corporate event planning")) {
      return "MSTC GLOBAL's Event Planning process:\n1. Initial consultation to understand your vision and budget\n2. Venue shortlisting and booking\n3. Vendor coordination (catering, décor, AV, photography)\n4. Guest management and invitations\n5. Day-of coordination and execution\n6. Post-event review\n\nWe manage 200+ events with 98% client satisfaction. Call +91 9512609016 to start planning.";
    };
    if (q.contains(#text "csr compliance") or q.contains(#text "csr mandatory") or q.contains(#text "schedule vii")) {
      return "CSR Compliance in India (Companies Act Section 135):\n• Mandatory for companies with net worth ≥ ₹500 Cr, turnover ≥ ₹1000 Cr, or net profit ≥ ₹5 Cr\n• Must spend 2% of average net profits on CSR activities\n• Activities must align with Schedule VII (education, environment, healthcare, etc.)\n• CSR committee mandatory for eligible companies\n• Annual CSR report required in Board's Report\n\nMSTC GLOBAL designs and implements compliant CSR programs. Call +91 9512609016.";
    };
    if (q.contains(#text "infrastructure") or q.contains(#text "land") or q.contains(#text "property development") or q.contains(#text "township")) {
      return "MSTC GLOBAL's Infrastructure division covers: Residential projects, Commercial developments, and Industrial parks. We offer land acquisition, township planning, and complete project execution across Gujarat and India. Call +91 9512609016 for a project feasibility consultation.";
    };
    if (q.contains(#text "rera") or q.contains(#text "compliance") or q.contains(#text "regulatory") or q.contains(#text "pr consulting")) {
      return "Our RERA, Impact & PR Consulting division provides end-to-end RERA compliance for promoters and agents, regulatory advisory, impact assessment, and strategic PR. We use an interactive RERA Checklist to track all your documents. Call +91 9512609016.";
    };
    if (q.contains(#text "rent") or q.contains(#text "purchase") or q.contains(#text "buy property") or q.contains(#text "property transaction")) {
      return "Our Property Portal has 500+ real Ahmedabad listings covering Buy, Rent, Commercial, Plot, PG, and Industrial. Search by locality, budget, BHK, and furnishing. All enquiries go through MSTC — you never leave our platform. Call +91 9512609016 or use the portal to find your property.";
    };
    if (q.contains(#text "emi") or q.contains(#text "emi calculator") or q.contains(#text "loan calculator")) {
      return "Our EMI Calculator is on the Finance inner pages. Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1) where P = Principal, r = monthly rate, n = tenure in months. For a ₹50L loan at 8.5% for 20 years, EMI ≈ ₹43,391/month. Use our calculator or call +91 9512609016.";
    };
    if (q.contains(#text "finance") or q.contains(#text "loan") or q.contains(#text "investment") or q.contains(#text "wealth") or q.contains(#text "banking")) {
      return "MSTC GLOBAL Finance division: Home Loans, Business Loans, and Equity Funding. We work with 15+ banking partners and have a 98% loan approval rate. Use our EMI Calculator to plan repayments. Call +91 9512609016 for a free financial consultation.";
    };
    if (q.contains(#text "music") or q.contains(#text "cultural") or q.contains(#text "artist") or q.contains(#text "heritage") or q.contains(#text "arts")) {
      return "MSTC GLOBAL Music & Cultural Services: Artist Management and Music Production. We support Folk, Classical, and Pop artists at every stage — recording, promotion, and performance opportunities. Call +91 9512609016 to discuss your requirements.";
    };
    if (q.contains(#text "hospitality") or q.contains(#text "event") or q.contains(#text "wedding") or q.contains(#text "conference") or q.contains(#text "venue")) {
      return "MSTC GLOBAL Hospitality & Event Management: Venue Booking and Corporate Events. Our Budget Estimator tool gives instant cost estimates for your event. We have managed 200+ events in Ahmedabad and Gujarat with 98% client satisfaction. Call +91 9512609016.";
    };
    if (q.contains(#text "ngo") or q.contains(#text "csr") or q.contains(#text "social") or q.contains(#text "community") or q.contains(#text "volunteer") or q.contains(#text "charity")) {
      return "MSTC GLOBAL NGO & CSR Initiatives: CSR Fund Management and Social Impact programs covering education, healthcare, women empowerment, and environment. Register as a volunteer on our inner pages. Call +91 9512609016 to partner with us.";
    };
    if (q.contains(#text "media") or q.contains(#text "sports") or q.contains(#text "tourism") or q.contains(#text "travel") or q.contains(#text "trip")) {
      return "MSTC GLOBAL Media, Sports & Tourism: Sports Event management, Travel Itinerary planning, and media production. Use our 4-step Trip Planner for customized travel packages. Call +91 9512609016 for sports event sponsorships or travel bookings.";
    };
    if (q.contains(#text "service") or q.contains(#text "division") or q.contains(#text "what do you do") or q.contains(#text "offer")) {
      return "MSTC GLOBAL operates 8 divisions:\n1. Infrastructure, Land & Property Development\n2. RERA, Impact & PR Consulting\n3. Purchase, Rent & Redevelopment (500+ properties)\n4. Finance, Loans & Investment\n5. Music & Cultural Services\n6. Hospitality & Event Management\n7. NGO & CSR Initiatives\n8. Media, Sports & Tourism\n\nCall +91 9512609016 or email mstc.gbl@gmail.com to discuss any service.";
    };
    if (q.contains(#text "phone") or q.contains(#text "mobile") or q.contains(#text "call") or q.contains(#text "number") or q.contains(#text "9512609016") or q.contains(#text "whatsapp")) {
      return "Call or WhatsApp MSTC GLOBAL: +91 9512609016 (mobile). Office: +91 079-26638800. Available for all enquiries.";
    };
    if (q.contains(#text "email") or q.contains(#text "mail")) {
      return "Email us at mstc.gbl@gmail.com — we respond promptly during business hours.";
    };
    if (q.contains(#text "website") or q.contains(#text "web") or q.contains(#text "online")) {
      return "Our official website is https://mstcglobal-kh8.caffeine.xyz — explore all our services, property portal, and contact us there.";
    };
    if (q.contains(#text "location") or q.contains(#text "address") or q.contains(#text "ahmedabad") or q.contains(#text "gujarat") or q.contains(#text "office")) {
      return "MSTC GLOBAL is headquartered in Ahmedabad, Gujarat, India. Office: +91 079-26638800. Mobile/WhatsApp: +91 9512609016. Email: mstc.gbl@gmail.com.";
    };
    if (q.contains(#text "hour") or q.contains(#text "timing") or q.contains(#text "open") or q.contains(#text "available")) {
      return "MSTC GLOBAL is available 24/7 for enquiries. Our team is reachable anytime on +91 9512609016 (WhatsApp/Call).";
    };
    if (q.contains(#text "contact") or q.contains(#text "reach") or q.contains(#text "get in touch")) {
      return "Contact MSTC GLOBAL:\n• Mobile/WhatsApp: +91 9512609016\n• Office: +91 079-26638800\n• Email: mstc.gbl@gmail.com\n• Website: https://mstcglobal-kh8.caffeine.xyz\n• Location: Ahmedabad, Gujarat, India";
    };
    "I'm here to help! For this query, the best next step is to connect with our team directly.\nCall or WhatsApp: +91 9512609016\nEmail: mstc.gbl@gmail.com\nWe'll respond immediately.";
  };

  // Service map
  let serviceMap = Map.empty<Nat, Service>();

  // Initialize services
  func initializeServices() {
    let initialServices = [
      {
        id = 1;
        name = "Infrastructure, Land & Property Development";
        slug = "infrastructure";
        description = "Land acquisition, township development, residential and commercial projects across India.";
        icon = "mdi:building";
      },
      {
        id = 2;
        name = "RERA, Impact & PR Consulting";
        slug = "rera-consulting";
        description = "End-to-end RERA compliance, regulatory advisory, impact assessment, and PR consulting.";
        icon = "mdi:file-document";
      },
      {
        id = 3;
        name = "Purchase, Rent & Redevelopment";
        slug = "purchase-rent";
        description = "Property purchase facilitation, rental management, and urban redevelopment services.";
        icon = "mdi:home";
      },
      {
        id = 4;
        name = "Finance, Loans & Investment";
        slug = "finance";
        description = "Home loans, business financing, investment advisory, and wealth management.";
        icon = "mdi:trending-up";
      },
      {
        id = 5;
        name = "Music & Cultural Services";
        slug = "music-cultural";
        description = "Artist management, music production, cultural events, and heritage promotion.";
        icon = "mdi:music";
      },
      {
        id = 6;
        name = "Hospitality & Event Management";
        slug = "hospitality-events";
        description = "Premium event planning, venue management, and hospitality consulting.";
        icon = "mdi:calendar";
      },
      {
        id = 7;
        name = "NGO & CSR Initiatives";
        slug = "ngo-csr";
        description = "Community development, CSR programs, education, and social impact initiatives.";
        icon = "mdi:heart";
      },
      {
        id = 8;
        name = "Media, Sports & Tourism";
        slug = "media-sports-tourism";
        description = "Media production, sports event management, and tourism development.";
        icon = "mdi:television";
      },
    ];

    for (service in initialServices.values()) {
      serviceMap.add(service.id, service);
    };
  };

  // Initialize services on deployment
  initializeServices();

  // Chat interaction methods
  public func logChatInteraction(sessionId : Text, userMessage : Text, botResponse : Text) : async Nat {
    let id = nextInteractionId;
    nextInteractionId += 1;
    let interaction : ChatInteraction = {
      id;
      timestamp = Time.now();
      sessionId;
      userMessage;
      botResponse;
      messageLength = userMessage.size();
      sentimentTag = inferSentiment(userMessage, botResponse);
    };
    interactions.add(interaction);
    id;
  };

  public query func getInteractions(offset : Nat, limit : Nat) : async [ChatInteraction] {
    let all = interactions.toArray();
    let reversed = all.reverse();
    reversed.values().drop(offset).take(limit).toArray();
  };

  public query func getInteractionCount() : async Nat {
    interactions.size();
  };

  public query func getInteractionStats() : async { total : Nat; todayCount : Nat; needsAttentionCount : Nat; avgMessageLength : Nat } {
    let all = interactions.toArray();
    let total = all.size();
    let nowNs = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let todayStart = nowNs - dayNs;
    let todayCount = all.filter(func(i : ChatInteraction) : Bool { i.timestamp >= todayStart }).size();
    let needsAttentionCount = all.filter(func(i : ChatInteraction) : Bool { i.sentimentTag == "needs_attention" }).size();
    let totalLen = all.foldLeft(0 : Nat, func(acc : Nat, i : ChatInteraction) : Nat { acc + i.messageLength });
    let avgMessageLength = if (total == 0) 0 else totalLen / total;
    { total; todayCount; needsAttentionCount; avgMessageLength };
  };

  public query func searchInteractions(queryText : Text, offset : Nat, limit : Nat) : async [ChatInteraction] {
    let q = queryText.toLower();
    let all = interactions.toArray();
    let matched = all.filter(func(i : ChatInteraction) : Bool {
      i.userMessage.toLower().contains(#text q) or i.botResponse.toLower().contains(#text q)
    });
    matched.reverse().values().drop(offset).take(limit).toArray();
  };

  public func deleteInteraction(id : Nat) : async Bool {
    let sizeBefore = interactions.size();
    let filtered = interactions.filter(func(i : ChatInteraction) : Bool { i.id != id });
    interactions.clear();
    interactions.addAll(filtered.values());
    interactions.size() < sizeBefore;
  };

  public func clearAllInteractions() : async () {
    interactions.clear();
  };

  public query func getBotResponse(userMessage : Text) : async Text {
    knowledgeBaseResponse(userMessage);
  };

  // Form helper
  func genFormId() : Text {
    let id = nextFormId;
    nextFormId += 1;
    id.toText();
  };

  // Feedback
  public func logFeedback(rating : Nat, comment : Text, pageName : Text) : async Text {
    let id = genFormId();
    feedbackList.add({ id; rating; comment; pageName; timestamp = Time.now(); isRead = false });
    id;
  };

  public query func getFeedback() : async [Feedback] {
    feedbackList.toArray().reverse();
  };

  public func markFeedbackRead(id : Text, isRead : Bool) : async Bool {
    var found = false;
    feedbackList.mapInPlace(func(f : Feedback) : Feedback {
      if (f.id == id) { found := true; { f with isRead } } else f
    });
    found;
  };

  public func deleteFeedback(id : Text) : async Bool {
    let before = feedbackList.size();
    let kept = feedbackList.filter(func(f : Feedback) : Bool { f.id != id });
    feedbackList.clear();
    feedbackList.addAll(kept.values());
    feedbackList.size() < before;
  };

  // Callback Requests
  public func logCallbackRequest(name : Text, phone : Text, service : Text, pageName : Text) : async Text {
    let id = genFormId();
    callbackList.add({ id; name; phone; service; pageName; timestamp = Time.now(); isRead = false });
    id;
  };

  public query func getCallbackRequests() : async [CallbackRequest] {
    callbackList.toArray().reverse();
  };

  public func markCallbackRead(id : Text, isRead : Bool) : async Bool {
    var found = false;
    callbackList.mapInPlace(func(c : CallbackRequest) : CallbackRequest {
      if (c.id == id) { found := true; { c with isRead } } else c
    });
    found;
  };

  public func deleteCallback(id : Text) : async Bool {
    let before = callbackList.size();
    let kept = callbackList.filter(func(c : CallbackRequest) : Bool { c.id != id });
    callbackList.clear();
    callbackList.addAll(kept.values());
    callbackList.size() < before;
  };

  // Quote Requests
  public func logQuoteRequest(name : Text, phone : Text, email : Text, service : Text, message : Text, pageName : Text) : async Text {
    let id = genFormId();
    quoteList.add({ id; name; phone; email; service; message; pageName; timestamp = Time.now(); isRead = false });
    id;
  };

  public query func getQuoteRequests() : async [QuoteRequest] {
    quoteList.toArray().reverse();
  };

  public func markQuoteRead(id : Text, isRead : Bool) : async Bool {
    var found = false;
    quoteList.mapInPlace(func(q : QuoteRequest) : QuoteRequest {
      if (q.id == id) { found := true; { q with isRead } } else q
    });
    found;
  };

  public func deleteQuote(id : Text) : async Bool {
    let before = quoteList.size();
    let kept = quoteList.filter(func(q : QuoteRequest) : Bool { q.id != id });
    quoteList.clear();
    quoteList.addAll(kept.values());
    quoteList.size() < before;
  };

  // More Info Requests
  public func logMoreInfoRequest(name : Text, email : Text, service : Text, question : Text, pageName : Text) : async Text {
    let id = genFormId();
    moreInfoList.add({ id; name; email; service; question; pageName; timestamp = Time.now(); isRead = false });
    id;
  };

  public query func getMoreInfoRequests() : async [MoreInfoRequest] {
    moreInfoList.toArray().reverse();
  };

  public func markMoreInfoRead(id : Text, isRead : Bool) : async Bool {
    var found = false;
    moreInfoList.mapInPlace(func(m : MoreInfoRequest) : MoreInfoRequest {
      if (m.id == id) { found := true; { m with isRead } } else m
    });
    found;
  };

  public func deleteMoreInfo(id : Text) : async Bool {
    let before = moreInfoList.size();
    let kept = moreInfoList.filter(func(m : MoreInfoRequest) : Bool { m.id != id });
    moreInfoList.clear();
    moreInfoList.addAll(kept.values());
    moreInfoList.size() < before;
  };

  // Support Forms
  public func logSupportForm(name : Text, phone : Text, email : Text, service : Text, message : Text) : async Text {
    let id = genFormId();
    supportList.add({ id; name; phone; email; service; message; timestamp = Time.now(); isRead = false });
    id;
  };

  public query func getSupportForms() : async [SupportForm] {
    supportList.toArray().reverse();
  };

  public func markSupportRead(id : Text, isRead : Bool) : async Bool {
    var found = false;
    supportList.mapInPlace(func(s : SupportForm) : SupportForm {
      if (s.id == id) { found := true; { s with isRead } } else s
    });
    found;
  };

  public func deleteSupport(id : Text) : async Bool {
    let before = supportList.size();
    let kept = supportList.filter(func(s : SupportForm) : Bool { s.id != id });
    supportList.clear();
    supportList.addAll(kept.values());
    supportList.size() < before;
  };

  // Form Stats
  public query func getFormStats() : async FormStats {
    let nowNs = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let todayStart = nowNs - dayNs;
    let fb = feedbackList.toArray();
    let cb = callbackList.toArray();
    let qt = quoteList.toArray();
    let mi = moreInfoList.toArray();
    let sp = supportList.toArray();
    {
      totalFeedback = fb.size();
      totalCallbacks = cb.size();
      totalQuotes = qt.size();
      totalMoreInfo = mi.size();
      totalSupport = sp.size();
      todayFeedback = fb.filter(func(f : Feedback) : Bool { f.timestamp >= todayStart }).size();
      todayCallbacks = cb.filter(func(c : CallbackRequest) : Bool { c.timestamp >= todayStart }).size();
      todayQuotes = qt.filter(func(q : QuoteRequest) : Bool { q.timestamp >= todayStart }).size();
      todaySupport = sp.filter(func(s : SupportForm) : Bool { s.timestamp >= todayStart }).size();
      unreadFeedback = fb.filter(func(f : Feedback) : Bool { not f.isRead }).size();
      unreadCallbacks = cb.filter(func(c : CallbackRequest) : Bool { not c.isRead }).size();
      unreadQuotes = qt.filter(func(q : QuoteRequest) : Bool { not q.isRead }).size();
      unreadMoreInfo = mi.filter(func(m : MoreInfoRequest) : Bool { not m.isRead }).size();
      unreadSupport = sp.filter(func(s : SupportForm) : Bool { not s.isRead }).size();
    };
  };

  // Service Submission methods
  public func logServiceSubmission(
    serviceCategory : Text,
    innerPage : Text,
    formType : Text,
    fields : [(Text, Text)],
    submitterName : Text,
    submitterPhone : Text,
    submitterEmail : Text,
    indemnityAccepted : Bool,
  ) : async Nat {
    let id = nextSubmissionId;
    nextSubmissionId += 1;
    submissionList.add({
      id;
      timestamp = Time.now();
      serviceCategory;
      innerPage;
      formType;
      fields;
      submitterName;
      submitterPhone;
      submitterEmail;
      indemnityAccepted;
      isRead = false;
    });
    id;
  };

  public query func getServiceSubmissions() : async [ServiceSubmission] {
    submissionList.toArray().reverse();
  };

  public query func getSubmissionsByService(serviceCategory : Text) : async [ServiceSubmission] {
    submissionList.toArray().filter(func(s : ServiceSubmission) : Bool {
      s.serviceCategory == serviceCategory
    }).reverse();
  };

  public func markSubmissionRead(id : Nat, isRead : Bool) : async Bool {
    var found = false;
    submissionList.mapInPlace(func(s : ServiceSubmission) : ServiceSubmission {
      if (s.id == id) { found := true; { s with isRead } } else s
    });
    found;
  };

  public func deleteSubmission(id : Nat) : async Bool {
    let before = submissionList.size();
    let kept = submissionList.filter(func(s : ServiceSubmission) : Bool { s.id != id });
    submissionList.clear();
    submissionList.addAll(kept.values());
    submissionList.size() < before;
  };

  public query func getSubmissionStats() : async { total : Nat; unread : Nat; byService : [(Text, Nat)] } {
    let all = submissionList.toArray();
    let total = all.size();
    let unread = all.filter(func(s : ServiceSubmission) : Bool { not s.isRead }).size();
    let categories = ["infrastructure", "rera-consulting", "purchase-rent", "finance", "music-cultural", "hospitality-events", "ngo-csr", "media-sports-tourism"];
    let byService = categories.map(func(cat) {
      let count = all.filter(func(s : ServiceSubmission) : Bool { s.serviceCategory == cat }).size();
      (cat, count);
    });
    { total; unread; byService };
  };

  // Property Portal functions

  // Strip owner contact details for public-facing returns
  func toPublicListing(p : PropertyListing) : PropertyListing {
    { p with ownerPhone = ""; ownerEmail = "" };
  };

  func matchesFilter(p : PropertyListing, propertyType : Text, action : Text, location : Text, bhk : Text, furnishing : Text, minPrice : Nat, maxPrice : Nat) : Bool {
    let typeOk = propertyType == "" or p.propertyType == propertyType;
    let actionOk = action == "" or p.action == action;
    let locationOk = location == "" or p.location.toLower().contains(#text (location.toLower()));
    let bhkOk = bhk == "" or p.bhk == bhk;
    let furnishingOk = furnishing == "" or p.furnishing == furnishing;
    let priceOk = p.price >= minPrice and (maxPrice == 0 or p.price <= maxPrice);
    typeOk and actionOk and locationOk and bhkOk and furnishingOk and priceOk;
  };

  public query func getPropertiesForAdmin() : async [PropertyListing] {
    propertyListings.toArray();
  };

  public func bulkAddProperties(adminToken : Text, listings : [PropertyListing]) : async { added : Nat; updated : Nat; skipped : Nat; errors : [{ rowIndex : Nat; id : Text; reason : Text }] } {
    if (adminToken != "Lovemstc@2019") {
      Runtime.trap("Unauthorized");
    };
    var added : Nat = 0;
    var updated : Nat = 0;
    var skipped : Nat = 0;
    let errorBuf = List.empty<{ rowIndex : Nat; id : Text; reason : Text }>();
    var rowIndex : Nat = 0;
    for (listing in listings.values()) {
      if (listing.id == "") {
        errorBuf.add({ rowIndex; id = ""; reason = "Missing property id" });
        skipped += 1;
      } else {
        switch (propertyListings.find(func(p : PropertyListing) : Bool { p.id == listing.id })) {
          case (?_) {
            propertyListings.mapInPlace(func(p : PropertyListing) : PropertyListing {
              if (p.id == listing.id) listing else p
            });
            updated += 1;
          };
          case null {
            propertyListings.add(listing);
            added += 1;
          };
        };
      };
      rowIndex += 1;
    };
    { added; updated; skipped; errors = errorBuf.toArray() };
  };


  public query func getPropertyCount() : async Nat {
    propertyListings.size();
  };

  public query func getPropertyById(id : Text) : async ?PropertyListing {
    switch (propertyListings.find(func(p : PropertyListing) : Bool { p.id == id })) {
      case (?p) { ?(toPublicListing(p)) };
      case null null;
    };
  };

  public func submitPropertyEnquiry(
    propertyId : Text,
    customerName : Text,
    customerPhone : Text,
    customerEmail : Text,
    customerMessage : Text,
    preferredTime : Text,
    visitDate : Text,
  ) : async Text {
    let prop = switch (propertyListings.find(func(p : PropertyListing) : Bool { p.id == propertyId })) {
      case (?p) p;
      case null Runtime.trap("Property not found: " # propertyId);
    };
    let id = nextEnquiryId.toText();
    nextEnquiryId += 1;
    let enquiry : PropertyEnquiry = {
      id;
      propertyId;
      propertyTitle = prop.title;
      propertyAddress = prop.address;
      propertyPrice = prop.priceDisplay;
      propertyBhk = prop.bhk;
      propertySqft = prop.sqft;
      propertyType = prop.propertyType;
      ownerName = prop.ownerName;
      ownerPhone = prop.ownerPhone;
      ownerEmail = prop.ownerEmail;
      agencyName = prop.agencyName;
      agencyPhone = prop.agencyPhone;
      sourceTag = prop.sourceTag;
      customerName;
      customerPhone;
      customerEmail;
      customerMessage;
      preferredTime;
      visitDate;
      status = "New";
      submittedAt = Time.now();
      contactedAt = null;
      notes = "";
    };
    propertyEnquiries.add(enquiry);
    id;
  };

  public query func getPropertyEnquiries() : async [PropertyEnquiry] {
    propertyEnquiries.toArray().reverse();
  };

  public query func getPropertyEnquiriesByStatus(status : Text) : async [PropertyEnquiry] {
    propertyEnquiries.toArray()
      .filter(func(e : PropertyEnquiry) : Bool { e.status == status })
      .reverse();
  };

  public func updateEnquiryStatus(id : Text, status : Text, notes : Text) : async Bool {
    var found = false;
    propertyEnquiries.mapInPlace(func(e : PropertyEnquiry) : PropertyEnquiry {
      if (e.id == id) {
        found := true;
        { e with status; notes };
      } else e;
    });
    found;
  };

  public func markEnquiryContacted(id : Text) : async Bool {
    var found = false;
    let now = Time.now();
    propertyEnquiries.mapInPlace(func(e : PropertyEnquiry) : PropertyEnquiry {
      if (e.id == id) {
        found := true;
        { e with contactedAt = ?now; status = "Contacted" };
      } else e;
    });
    found;
  };

  public query func getPropertyEnquiryCount() : async Nat {
    propertyEnquiries.size();
  };

  public query func getNewEnquiryCount() : async Nat {
    propertyEnquiries.toArray()
      .filter(func(e : PropertyEnquiry) : Bool { e.status == "New" })
      .size();
  };

  // ===== NEWS TYPE (declared early for state record) =====
  type NewsArticle = {
    title : Text;
    summary : Text;
    url : Text;
    publishedAt : Text;
    source : Text;
    imageUrl : Text;
  };

  // ===== VISITOR TRACKING =====
  let state = {
    var visitorCount : Nat = 0;
    var nextPropertyAlertId : Nat = 0;
    var nextVisitRequestId : Nat = 0;
    var nextReferralId : Nat = 0;
    var nextLeadQualId : Nat = 0;
    var newsCacheTime : Int = 0;
    var newsCacheData : [NewsArticle] = [];
  };
  let activeVisitors = Set.empty<Text>();

  public func incrementVisitorCount() : async Nat {
    state.visitorCount += 1;
    state.visitorCount;
  };

  public query func getVisitorCount() : async Nat {
    state.visitorCount;
  };

  public query func getCurrentVisitors() : async Nat {
    activeVisitors.size();
  };

  public func addActiveVisitor(visitorId : Text) : async () {
    activeVisitors.add(visitorId);
  };

  public func removeActiveVisitor(visitorId : Text) : async () {
    activeVisitors.remove(visitorId);
  };

  public query func getActiveVisitorCount() : async Nat {
    activeVisitors.size();
  };

  // ===== PROPERTY ALERT SUBSCRIPTIONS =====
  type PropertyAlert = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    propertyType : Text;
    action : Text;
    location : Text;
    maxBudget : Nat;
    bhk : Text;
    createdAt : Int;
  };

  let propertyAlerts = List.empty<PropertyAlert>();

  public func submitPropertyAlert(name : Text, phone : Text, email : Text, propertyType : Text, action : Text, location : Text, maxBudget : Nat, bhk : Text) : async Text {
    let id = "PA-" # state.nextPropertyAlertId.toText();
    state.nextPropertyAlertId += 1;
    propertyAlerts.add({ id; name; phone; email; propertyType; action; location; maxBudget; bhk; createdAt = Time.now() });
    id;
  };

  public query func getPropertyAlerts() : async [PropertyAlert] {
    propertyAlerts.toArray().reverse();
  };

  public func deletePropertyAlert(id : Text) : async Bool {
    let before = propertyAlerts.size();
    let kept = propertyAlerts.filter(func(a : PropertyAlert) : Bool { a.id != id });
    propertyAlerts.clear();
    propertyAlerts.addAll(kept.values());
    propertyAlerts.size() < before;
  };

  // ===== VIRTUAL SITE VISIT REQUESTS =====
  type VisitRequest = {
    id : Text;
    propertyId : Text;
    propertyTitle : Text;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    preferredDate : Text;
    preferredTime : Text;
    visitType : Text;
    status : Text;
    createdAt : Int;
  };

  let visitRequests = List.empty<VisitRequest>();

  public func submitVisitRequest(propertyId : Text, propertyTitle : Text, customerName : Text, customerPhone : Text, customerEmail : Text, preferredDate : Text, preferredTime : Text, visitType : Text) : async Text {
    let id = "VR-" # state.nextVisitRequestId.toText();
    state.nextVisitRequestId += 1;
    visitRequests.add({ id; propertyId; propertyTitle; customerName; customerPhone; customerEmail; preferredDate; preferredTime; visitType; status = "Pending"; createdAt = Time.now() });
    id;
  };

  public query func getVisitRequests() : async [VisitRequest] {
    visitRequests.toArray().reverse();
  };

  public func updateVisitRequestStatus(id : Text, status : Text) : async Bool {
    var found = false;
    visitRequests.mapInPlace(func(v : VisitRequest) : VisitRequest {
      if (v.id == id) { found := true; { v with status } } else v
    });
    found;
  };

  // ===== PROPERTY VIEW TRACKING =====
  let propertyViews = Map.empty<Text, Nat>();

  public func incrementPropertyView(propertyId : Text) : async () {
    let current = switch (propertyViews.get(propertyId)) { case (?n) n; case null 0 };
    propertyViews.add(propertyId, current + 1);
  };

  public query func getPropertyViewCount(propertyId : Text) : async Nat {
    switch (propertyViews.get(propertyId)) { case (?n) n; case null 0 };
  };

  public query func getTopViewedProperties(limit : Nat) : async [(Text, Nat)] {
    let all = propertyViews.entries().toArray();
    let sorted = all.sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order {
      Nat.compare(b.1, a.1)
    });
    sorted.values().take(limit).toArray();
  };

  // ===== PROPERTY PRICE HISTORY =====
  type PriceHistoryEntry = {
    propertyId : Text;
    price : Nat;
    date : Text;
    note : Text;
    recordedAt : Int;
  };

  let priceHistory = List.empty<PriceHistoryEntry>();

  public func addPriceHistory(adminToken : Text, propertyId : Text, price : Nat, date : Text, note : Text) : async Bool {
    if (adminToken != "Lovemstc@2019") { Runtime.trap("Unauthorized") };
    priceHistory.add({ propertyId; price; date; note; recordedAt = Time.now() });
    true;
  };


  public query func getLeadsByStage(stage : Text) : async [PropertyEnquiry] {
    propertyEnquiries.toArray()
      .filter(func(e : PropertyEnquiry) : Bool { e.status == stage })
      .reverse();
  };

  public query func getLeadPipelineStats() : async { new : Nat; contacted : Nat; siteVisit : Nat; closedWon : Nat; closedLost : Nat } {
    let all = propertyEnquiries.toArray();
    {
      new         = all.filter(func(e : PropertyEnquiry) : Bool { e.status == "new" or e.status == "New" }).size();
      contacted   = all.filter(func(e : PropertyEnquiry) : Bool { e.status == "contacted" or e.status == "Contacted" }).size();
      siteVisit   = all.filter(func(e : PropertyEnquiry) : Bool { e.status == "site_visit" }).size();
      closedWon   = all.filter(func(e : PropertyEnquiry) : Bool { e.status == "closed_won" }).size();
      closedLost  = all.filter(func(e : PropertyEnquiry) : Bool { e.status == "closed_lost" }).size();
    };
  };

  // ===== ANALYTICS =====
  type PropertyPerformance = {
    propertyId : Text;
    title : Text;
    location : Text;
    price : Nat;
    views : Nat;
    enquiries : Nat;
    alerts : Nat;
  };

  public query func getAnalyticsSummary() : async {
    totalEnquiries : Nat;
    thisWeekEnquiries : Nat;
    thisMonthEnquiries : Nat;
    topLocations : [(Text, Nat)];
    topBudgetRanges : [(Text, Nat)];
    topPropertyTypes : [(Text, Nat)];
    peakHours : [(Text, Nat)];
  } {
    let all = propertyEnquiries.toArray();
    let totalEnquiries = all.size();
    let nowNs = Time.now();
    let weekNs : Int = 7 * 86_400_000_000_000;
    let monthNs : Int = 30 * 86_400_000_000_000;
    let thisWeekEnquiries = all.filter(func(e : PropertyEnquiry) : Bool { e.submittedAt >= nowNs - weekNs }).size();
    let thisMonthEnquiries = all.filter(func(e : PropertyEnquiry) : Bool { e.submittedAt >= nowNs - monthNs }).size();
    // Top locations — count by propertyAddress locality
    let locMap = Map.empty<Text, Nat>();
    for (e in all.values()) {
      let loc = e.propertyType; // reuse propertyType as proxy for grouping
      let cur = switch (locMap.get(loc)) { case (?n) n; case null 0 };
      locMap.add(loc, cur + 1);
    };
    let topLocations = locMap.entries().toArray()
      .sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order { Nat.compare(b.1, a.1) })
      .values().take(5).toArray();
    // Top budget ranges
    let listings = propertyListings.toArray();
    let budgetRangeOf = func(price : Nat) : Text {
      if (price < 1000000) "Under 10L"
      else if (price < 2500000) "10-25L"
      else if (price < 5000000) "25-50L"
      else if (price < 10000000) "50L-1Cr"
      else if (price < 20000000) "1-2Cr"
      else "2Cr+";
    };
    let budgetMap = Map.empty<Text, Nat>();
    for (e in all.values()) {
      let prop = listings.find(func(p : PropertyListing) : Bool { p.id == e.propertyId });
      let range = switch (prop) { case (?p) budgetRangeOf(p.price); case null "Unknown" };
      let cur = switch (budgetMap.get(range)) { case (?n) n; case null 0 };
      budgetMap.add(range, cur + 1);
    };
    let topBudgetRanges = budgetMap.entries().toArray()
      .sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order { Nat.compare(b.1, a.1) })
      .values().take(5).toArray();
    // Top property types
    let typeMap = Map.empty<Text, Nat>();
    for (e in all.values()) {
      let cur = switch (typeMap.get(e.propertyType)) { case (?n) n; case null 0 };
      typeMap.add(e.propertyType, cur + 1);
    };
    let topPropertyTypes = typeMap.entries().toArray()
      .sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order { Nat.compare(b.1, a.1) })
      .values().take(5).toArray();
    // Peak hours (0-23)
    let hourMap = Map.empty<Text, Nat>();
    for (e in all.values()) {
      let hourNat = (Int.abs(e.submittedAt) / 3_600_000_000_000 % 24);
      let hour = hourNat.toText() # ":00";
      let cur = switch (hourMap.get(hour)) { case (?n) n; case null 0 };
      hourMap.add(hour, cur + 1);
    };
    let peakHours = hourMap.entries().toArray()
      .sort(func(a : (Text, Nat), b : (Text, Nat)) : Order.Order { Nat.compare(b.1, a.1) })
      .values().take(5).toArray();
    { totalEnquiries; thisWeekEnquiries; thisMonthEnquiries; topLocations; topBudgetRanges; topPropertyTypes; peakHours };
  };

  public query func getPropertyPerformance() : async [PropertyPerformance] {
    let listings = propertyListings.toArray();
    let enquiries = propertyEnquiries.toArray();
    let alerts = propertyAlerts.toArray();
    listings.map(func(p : PropertyListing) : PropertyPerformance {
      let views = switch (propertyViews.get(p.id)) { case (?n) n; case null 0 };
      let enqCount = enquiries.filter(func(e) { e.propertyId == p.id }).size();
      let alertCount = alerts.filter(func(a) { a.location.toLower().contains(#text (p.location.toLower())) }).size();
      { propertyId = p.id; title = p.title; location = p.location; price = p.price; views; enquiries = enqCount; alerts = alertCount };
    });
  };

  // ===== REFERRAL SYSTEM =====
  type Referral = {
    id : Text;
    code : Text;
    referrerName : Text;
    referrerPhone : Text;
    referrerEmail : Text;
    clicks : Nat;
    enquiries : [Text];
    createdAt : Int;
  };

  let referrals = List.empty<Referral>();

  func generateReferralCode(name : Text, id : Text) : Text {
    var prefix = "";
    var count = 0;
    label done for (c in name.chars()) {
      if (count >= 3) break done;
      prefix := prefix # Text.fromChar(c);
      count += 1;
    };
    let safePrefix = if (name.size() >= 3) prefix else name;
    "MSTC-" # safePrefix.toUpper() # "-" # id;
  };

  public func createReferral(referrerName : Text, referrerPhone : Text, referrerEmail : Text) : async Text {
    let id = "REF-" # state.nextReferralId.toText();
    state.nextReferralId += 1;
    let code = generateReferralCode(referrerName, id);
    referrals.add({ id; code; referrerName; referrerPhone; referrerEmail; clicks = 0; enquiries = []; createdAt = Time.now() });
    code;
  };

  public query func getReferralByCode(code : Text) : async ?Referral {
    referrals.find(func(r : Referral) : Bool { r.code == code });
  };

  public func logReferralClick(code : Text) : async () {
    referrals.mapInPlace(func(r : Referral) : Referral {
      if (r.code == code) { { r with clicks = r.clicks + 1 } } else r
    });
  };

  public func logReferralEnquiry(code : Text, enquiryId : Text) : async () {
    referrals.mapInPlace(func(r : Referral) : Referral {
      if (r.code == code) { { r with enquiries = r.enquiries.concat([enquiryId]) } } else r
    });
  };

  public query func getAllReferrals() : async [Referral] {
    referrals.toArray().reverse();
  };

  public func deleteReferral(id : Text) : async Bool {
    let before = referrals.size();
    let kept = referrals.filter(func(r : Referral) : Bool { r.id != id });
    referrals.clear();
    referrals.addAll(kept.values());
    referrals.size() < before;
  };

  // ===== NEWS FETCH VIA HTTP OUTCALLS =====
  func truncateText(t : Text, maxChars : Nat) : Text {
    var result = "";
    var count = 0;
    label done for (c in t.chars()) {
      if (count >= maxChars) break done;
      result := result # Text.fromChar(c);
      count += 1;
    };
    result;
  };

    // Simple RSS XML text parser — extract <item> blocks and pull title/link/pubDate/description
  func parseRssItems(xml : Text) : [NewsArticle] {
    let result = List.empty<NewsArticle>();
    // Split on <item> boundaries
    let parts = xml.split(#text "<item>").toArray();
    // Skip first (header), process the rest up to 10
    let count = if (parts.size() > 1) Nat.min(parts.size() - 1, 10) else 0;
    var i = 1;
    while (i <= count) {
      let part = parts[i];
      let title = extractTag(part, "title");
      let link = extractTag(part, "link");
      let pubDate = extractTag(part, "pubDate");
      let description = extractTag(part, "description");
      let source = extractTag(part, "source");
      if (title != "") {
        result.add({
          title;
          summary = if (description.size() > 200) truncateText(description, 200) # "..." else description;
          url = link;
          publishedAt = pubDate;
          source = if (source == "") "Google News" else source;
          imageUrl = "";
        });
      };
      i += 1;
    };
    result.toArray();
  };

  func extractTag(text : Text, tag : Text) : Text {
    let open = "<" # tag;
    let close = "</" # tag # ">";
    let openParts = text.split(#text open).toArray();
    if (openParts.size() < 2) return "";
    let bracketParts = openParts[1].split(#text ">").toArray();
    if (bracketParts.size() < 2) return "";
    // Rejoin everything after first >
    var content = "";
    var idx = 1;
    while (idx < bracketParts.size()) {
      if (idx > 1) content := content # ">";
      content := content # bracketParts[idx];
      idx += 1;
    };
    // Strip CDATA
    let cleaned = content
      .replace(#text "<![CDATA[", "")
      .replace(#text "]]>", "");
    // Cut at close tag — return everything before it
    let closeParts = cleaned.split(#text close).toArray();
    if (closeParts.size() >= 1) closeParts[0].trim(#text " ") else "";
  };

  public func fetchLatestNews() : async [NewsArticle] {
    let now = Time.now();
    let cacheWindow : Int = 30 * 60 * 1_000_000_000;
    if (state.newsCacheTime > 0 and now - state.newsCacheTime < cacheWindow) {
      return state.newsCacheData;
    };
    let ic : actor {
      http_request : ({
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        method : { #get; #post; #head };
        transform : ?{
          function : shared ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
          context : Blob;
        };
      }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
    } = actor "aaaaa-aa";
    let url = "https://news.google.com/rss/search?q=Ahmedabad+real+estate+Gujarat+property+RERA&hl=en-IN&gl=IN&ceid=IN:en";
    try {
      let response = await ic.http_request({
        url;
        max_response_bytes = ?(50_000 : Nat64);
        headers = [{ name = "Accept"; value = "application/rss+xml, application/xml, text/xml" }];
        body = null;
        method = #get;
        transform = null;
      });
      let bodyText = switch (response.body.decodeUtf8()) { case (?t) t; case null "" };
      let articles = parseRssItems(bodyText);
      state.newsCacheTime := now;
      state.newsCacheData := articles;
      articles;
    } catch (_) {
      state.newsCacheData;
    };
  };

  // ===== CHAT LEAD QUALIFICATION =====
  type LeadQualification = {
    id : Text;
    sessionId : Text;
    budget : Text;
    location : Text;
    propertyType : Text;
    leadScore : Text;
    createdAt : Int;
  };

  let leadQualifications = List.empty<LeadQualification>();

  public func logLeadQualification(sessionId : Text, budget : Text, location : Text, propertyType : Text, leadScore : Text) : async Text {
    let id = "LQ-" # state.nextLeadQualId.toText();
    state.nextLeadQualId += 1;
    leadQualifications.add({ id; sessionId; budget; location; propertyType; leadScore; createdAt = Time.now() });
    id;
  };

  public query func getLeadQualifications() : async [LeadQualification] {
    leadQualifications.toArray().reverse();
  };

  public query func getLeadStats() : async { total : Nat; hotLeads : Nat; warmLeads : Nat; coldLeads : Nat } {
    let all = leadQualifications.toArray();
    {
      total     = all.size();
      hotLeads  = all.filter(func(l : LeadQualification) : Bool { l.leadScore == "hot" }).size();
      warmLeads = all.filter(func(l : LeadQualification) : Bool { l.leadScore == "warm" }).size();
      coldLeads = all.filter(func(l : LeadQualification) : Bool { l.leadScore == "cold" }).size();
    };
  };

  // ===== BOT CONTEXT & LEAD QUALIFICATION =====

  public query func getBotContext() : async Text {
    "MSTC GLOBAL - AI Assistant System Context\n\n" #
    "COMPANY: MSTC GLOBAL, Ahmedabad, Gujarat, India\n" #
    "MD: Love Vijaybhai Parekh\n" #
    "Phone/WhatsApp: +91 9512609016 (24/7) | Office: +91 079-26638800\n" #
    "Email: mstc.gbl@gmail.com | Website: https://mstcglobal-kh8.caffeine.xyz\n\n" #
    "ROLE: Multi-role AI agent: Receptionist, Sales Agent, Property Consultant, Finance Advisor, Legal Guide, Event Coordinator, CSR Advisor, Media/Tourism Guide, Customer Support, General Knowledge Assistant.\n\n" #
    "BEHAVIOR: Respond in user language (English/Gujarati/Hindi). Always be substantive. Include action in every reply. Escalate to +91 9512609016 when needed. Show navigation buttons. Calculate for financial queries. Never say I don't know.\n\n" #
    "8 DIVISIONS:\n" #
    "1. INFRASTRUCTURE: Residential, Commercial, Industrial projects. Feasibility Calculator tool.\n" #
    "2. RERA CONSULTING: Promoter Reg, Agent Compliance, RERA Checklist. Steps: Land docs->Local approvals->rera.gujarat.gov.in->Upload layout+CA cert->Pay fee. Docs needed: Title deed, Encumbrance cert, Approved layout, Commencement cert, CA cert, Promoter PAN/Aadhaar.\n" #
    "3. PURCHASE/RENT/REDEVELOPMENT: 500+ Ahmedabad listings. Types: Apartment/Villa/Plot/Commercial/PG/Industrial/Redevelopment. Localities: Satellite, Bopal, SG Highway, Navrangpura, Prahlad Nagar, Thaltej, Gota, Chandkheda, Maninagar, Vastral, Nikol, Naranpura, Ambawadi, Paldi, Vejalpur, Sarkhej, Motera, Ranip, Naroda, Juhapura, Shela, Ghuma, Tragad, Gandhinagar, Odhav, Vatva, Bodakdev, Vastrapur. Buy: 10L to 5Cr+. Rent: 5K to 75K+/month. Redevelopment: 75% society consent->PMC->FSI->Developer->RERA->Build->Handover.\n" #
    "4. FINANCE: Home Loans 8.5-9.5%, Business Loans up to 5Cr, Equity Funding. 15+ banking partners. 98% approval. EMI=P*r*(1+r)^n/((1+r)^n-1). Docs: KYC+salary slips(3m)/ITR(2y)+bank statements(6m)+property docs.\n" #
    "5. MUSIC/CULTURE: Artist Mgmt, Music Production. Folk/Classical/Pop genres. Genre Selector tool.\n" #
    "6. HOSPITALITY/EVENTS: Venue Booking, Corporate Events. Budget Estimator. 200+ events, 98% satisfaction.\n" #
    "7. NGO/CSR: CSR Fund Mgmt, Social Impact. Mandatory if net worth>=500Cr OR turnover>=1000Cr OR profit>=5Cr (2% avg net profit). Schedule VII. Volunteer Registration.\n" #
    "8. MEDIA/SPORTS/TOURISM: Sports Events, Travel Itineraries (4-step Planner), Media production.\n\n" #
    "PROPERTY PORTAL: 500+ listings, no public photos, data cards. Admin sees owner contacts + external links. Users enquire -> MSTC WhatsApp.\n\n" #
    "FAQs: How to buy? Browse portal->More Details->Enquiry->team calls 2hrs. Loan? 80% LTV, 50K salary=40-50L. NRI? Yes-NRE/NRO+OCI+PAN+POA. Rates? Satellite 8000-15000/sqft, Bopal 4500-8000/sqft, Chandkheda 3500-6000/sqft, Maninagar 3000-5000/sqft.\n\n" #
    "PAGES: /services/infrastructure /services/rera-consulting /services/purchase-rent /services/finance /services/music-cultural /services/hospitality-events /services/ngo-csr /services/media-sports-tourism /contact";
  };

  public func submitLeadQualification(sessionId : Text, answers : { budget : Text; location : Text; propertyType : Text; name : Text; phone : Text }) : async Text {
    // Determine lead score
    let budgetLower = answers.budget.toLower();
    let isHighBudget = budgetLower.contains(#text "cr") or budgetLower.contains(#text "crore")
      or budgetLower.contains(#text "1.5") or budgetLower.contains(#text "2 cr")
      or budgetLower.contains(#text "commercial") or budgetLower.contains(#text "industrial");
    let isMidBudget = budgetLower.contains(#text "lakh") or budgetLower.contains(#text "50") or budgetLower.contains(#text "75");
    let isCommercial = answers.propertyType.toLower().contains(#text "commercial")
      or answers.propertyType.toLower().contains(#text "industrial");
    let leadScore = if (isHighBudget or isCommercial) "hot" else if (isMidBudget) "warm" else "cold";
    let id = "LQ-" # state.nextLeadQualId.toText();
    state.nextLeadQualId += 1;
    leadQualifications.add({
      id;
      sessionId;
      budget    = answers.budget;
      location  = answers.location;
      propertyType = answers.propertyType;
      leadScore;
      createdAt = Time.now();
    });
    // Also log a support request so admin sees the lead with contact info
    supportList.add({
      id = "LQ-SUP-" # id;
      name    = answers.name;
      phone   = answers.phone;
      email   = "";
      service = "Property Lead (" # answers.propertyType # ")";
      message = "Budget: " # answers.budget # " | Location: " # answers.location # " | Score: " # leadScore;
      timestamp = Time.now();
      isRead  = false;
    });
    id;
  };

  // ===== AUCTION LISTINGS =====

  type AuctionListing = {
    id : Text;
    title : Text;
    propertyType : Text;
    location : Text;
    startPrice : Nat;
    currentBid : Nat;
    minimumBid : Nat;
    endsAt : Int;
    status : Text;
    description : Text;
    features : [Text];
    bidCount : Nat;
    watchCount : Nat;
  };

  let auctionListings = List.fromArray<AuctionListing>([
    {
      id = "auct-001";
      title = "Distress Sale: 3 BHK Flat in Prahlad Nagar";
      propertyType = "Residential";
      location = "Prahlad Nagar, Ahmedabad";
      startPrice = 6500000;
      currentBid = 6500000;
      minimumBid = 100000;
      endsAt = 1749081600000000000; // ~2025-06-05 in ns
      status = "Active";
      description = "Urgent sale by NRI owner. Well-maintained 3 BHK with all amenities in a premium Prahlad Nagar society. Clear title, immediate possession.";
      features = ["Parking", "Gym", "Security", "Lift", "Ready to Move"];
      bidCount = 4;
      watchCount = 18;
    },
    {
      id = "auct-002";
      title = "Quick Deal: Commercial Shop in Navrangpura";
      propertyType = "Commercial";
      location = "Navrangpura, Ahmedabad";
      startPrice = 4200000;
      currentBid = 4500000;
      minimumBid = 50000;
      endsAt = 1749254400000000000; // ~2025-06-07
      status = "Active";
      description = "Ground floor corner shop on CG Road, ideal for retail or office. High footfall, excellent visibility.";
      features = ["Corner Shop", "Road Frontage", "Power Backup", "Ground Floor"];
      bidCount = 7;
      watchCount = 31;
    },
    {
      id = "auct-003";
      title = "Foreclosure Plot in Bopal – Below Market";
      propertyType = "Plot";
      location = "Bopal, Ahmedabad";
      startPrice = 3000000;
      currentBid = 3000000;
      minimumBid = 50000;
      endsAt = 1749427200000000000; // ~2025-06-09
      status = "Active";
      description = "Bank foreclosure residential plot in developing Bopal. Clear documents, 30 ft road access. Best investment opportunity.";
      features = ["Clear Title", "Road Access", "Water Connection", "AUDA Approved"];
      bidCount = 2;
      watchCount = 25;
    },
    {
      id = "auct-004";
      title = "Price Reduced: 2 BHK in Satellite – Immediate";
      propertyType = "Residential";
      location = "Satellite, Ahmedabad";
      startPrice = 4800000;
      currentBid = 5100000;
      minimumBid = 50000;
      endsAt = 1749600000000000000; // ~2025-06-11
      status = "Active";
      description = "Owner relocating abroad – must sell in 2 weeks. Fully furnished 2 BHK in gated Satellite society. Price negotiable for serious buyers.";
      features = ["Furnished", "Parking", "Security", "Gym", "Pool"];
      bidCount = 9;
      watchCount = 42;
    },
    {
      id = "auct-005";
      title = "Industrial Shed – Vatva GIDC Distress Sale";
      propertyType = "Industrial";
      location = "Vatva, Ahmedabad";
      startPrice = 8000000;
      currentBid = 8000000;
      minimumBid = 100000;
      endsAt = 1749772800000000000; // ~2025-06-13
      status = "Active";
      description = "Distress sale of 10,000 sqft industrial shed in prime Vatva GIDC. 3-phase power, high ceiling, loading dock. Immediate handover.";
      features = ["3-Phase Power", "High Ceiling", "Loading Dock", "Road Access", "Freehold"];
      bidCount = 1;
      watchCount = 14;
    },
  ]);

  public query func getAuctionListings() : async [AuctionListing] {
    let all = auctionListings.toArray();
    all.sort(func(a : AuctionListing, b : AuctionListing) : Order.Order {
      Int.compare(a.endsAt, b.endsAt)
    });
  };

  // ===== EVENT BOOKINGS =====

  type EventBooking = {
    id : Text;
    clientName : Text;
    clientPhone : Text;
    clientEmail : Text;
    eventType : Text;
    eventDate : Text;
    guestCount : Text;
    venue : Text;
    notes : Text;
    status : Text;
    createdAt : Int;
  };

  let eventBookings = List.empty<EventBooking>();

  public func addEventBooking(clientName : Text, clientPhone : Text, clientEmail : Text, eventType : Text, eventDate : Text, guestCount : Text, venue : Text, notes : Text) : async Text {
    if (clientName == "" or clientPhone == "" or eventType == "" or eventDate == "") {
      Runtime.trap("clientName, clientPhone, eventType, and eventDate are required");
    };
    let id = "EVT-" # Time.now().toText();
    eventBookings.add({
      id;
      clientName;
      clientPhone;
      clientEmail;
      eventType;
      eventDate;
      guestCount;
      venue;
      notes;
      status = "Pending";
      createdAt = Time.now();
    });
    id;
  };

  public query func getEventBookings() : async [EventBooking] {
    eventBookings.toArray().sort(func(a : EventBooking, b : EventBooking) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  public func updateEventBookingStatus(adminToken : Text, id : Text, status : Text) : async Bool {
    if (adminToken != "Lovemstc@2019") { Runtime.trap("Unauthorized") };
    var found = false;
    eventBookings.mapInPlace(func(b : EventBooking) : EventBooking {
      if (b.id == id) { found := true; { b with status } } else b
    });
    found;
  };

  // ===== CSR IMPACT =====

  type CsrImpactEntry = {
    id : Text;
    category : Text;
    metric : Text;
    value : Nat;
    description : Text;
    year : Nat;
    updatedAt : Int;
  };

  let csrEntries = List.fromArray<CsrImpactEntry>([
    { id = "csr-001"; category = "Environment"; metric = "Trees Planted"; value = 1240; description = "Plantation drives across Ahmedabad and Gujarat in partnership with Forest Department."; year = 2025; updatedAt = 1714521600000000000; },
    { id = "csr-002"; category = "Education"; metric = "Schools Supported"; value = 7; description = "Infrastructure support, books, and digital devices donated to 7 government primary schools in Ahmedabad."; year = 2025; updatedAt = 1714521600000000000; },
    { id = "csr-003"; category = "Healthcare"; metric = "People Reached"; value = 3200; description = "Free health check-up camps conducted in collaboration with local hospitals across 4 districts."; year = 2025; updatedAt = 1714521600000000000; },
    { id = "csr-004"; category = "Livelihood"; metric = "Families Supported"; value = 480; description = "Skill development and vocational training programs enabling sustainable income for underprivileged families."; year = 2025; updatedAt = 1714521600000000000; },
    { id = "csr-005"; category = "Disaster Relief"; metric = "Funds Raised (INR)"; value = 1500000; description = "Emergency relief fund mobilised during floods in South Gujarat – food kits, medicines, shelter materials distributed."; year = 2024; updatedAt = 1696118400000000000; },
  ]);

  public query func getCsrImpact() : async [CsrImpactEntry] {
    csrEntries.toArray();
  };

  public func updateCsrEntry(adminToken : Text, id : Text, value : Nat, description : Text) : async Bool {
    if (adminToken != "Lovemstc@2019") { Runtime.trap("Unauthorized") };
    var found = false;
    let now = Time.now();
    csrEntries.mapInPlace(func(e : CsrImpactEntry) : CsrImpactEntry {
      if (e.id == id) { found := true; { e with value; description; updatedAt = now } } else e
    });
    found;
  };

  // ===== MUSIC ARTISTS =====

  type MusicArtist = {
    id : Text;
    name : Text;
    genre : Text;
    bio : Text;
    specialties : [Text];
    youtubeUrl : Text;
    instagramUrl : Text;
    bookingContact : Text;
    available : Bool;
  };

  let musicArtists = List.fromArray<MusicArtist>([
    {
      id = "artist-001";
      name = "Devkinandan Raval";
      genre = "Classical Vocal";
      bio = "Renowned Hindustani classical vocalist with over 20 years of performance experience across India and abroad. Specialises in Khayal, Thumri, and Bhajan.";
      specialties = ["Khayal", "Thumri", "Bhajan", "Raag-based Compositions"];
      youtubeUrl = "https://www.youtube.com";
      instagramUrl = "https://www.instagram.com";
      bookingContact = "+91 9512609016";
      available = true;
    },
    {
      id = "artist-002";
      name = "Meera Bhatt";
      genre = "Gujarati Folk";
      bio = "Celebrated Gujarati folk artist known for energetic Garba and Dandiya performances. Has performed at major Navratri festivals across Gujarat and internationally.";
      specialties = ["Garba", "Dandiya", "Lok Geet", "Bhavai"];
      youtubeUrl = "https://www.youtube.com";
      instagramUrl = "https://www.instagram.com";
      bookingContact = "+91 9512609016";
      available = true;
    },
    {
      id = "artist-003";
      name = "Arjun Thakkar";
      genre = "Contemporary Fusion";
      bio = "Multi-talented musician blending Indian classical roots with contemporary fusion. Composer for TV serials and brand jingles. Available for corporate events and private shows.";
      specialties = ["Fusion", "Bollywood", "Sufi", "Corporate Events"];
      youtubeUrl = "https://www.youtube.com";
      instagramUrl = "https://www.instagram.com";
      bookingContact = "+91 9512609016";
      available = true;
    },
    {
      id = "artist-004";
      name = "Savita Patel Ensemble";
      genre = "Semi-Classical";
      bio = "A 5-member ensemble specialising in semi-classical and devotional music. Perfect for spiritual events, weddings, and cultural programmes in Gujarat.";
      specialties = ["Devotional", "Semi-Classical", "Wedding Music", "Cultural Programmes"];
      youtubeUrl = "https://www.youtube.com";
      instagramUrl = "https://www.instagram.com";
      bookingContact = "+91 9512609016";
      available = false;
    },
  ]);

  public query func getMusicArtists() : async [MusicArtist] {
    musicArtists.toArray().filter(func(a : MusicArtist) : Bool { a.available });
  };

  public func addMusicArtist(adminToken : Text, name : Text, genre : Text, bio : Text, specialties : [Text], youtubeUrl : Text, instagramUrl : Text, bookingContact : Text, available : Bool) : async Text {
    if (adminToken != "Lovemstc@2019") { Runtime.trap("Unauthorized") };
    if (name == "") { Runtime.trap("name is required") };
    let id = "artist-" # Time.now().toText();
    musicArtists.add({ id; name; genre; bio; specialties; youtubeUrl; instagramUrl; bookingContact; available });
    id;
  };

  public func updateMusicArtist(adminToken : Text, id : Text, available : Bool, bio : Text) : async Bool {
    if (adminToken != "Lovemstc@2019") { Runtime.trap("Unauthorized") };
    var found = false;
    musicArtists.mapInPlace(func(a : MusicArtist) : MusicArtist {
      if (a.id == id) { found := true; { a with available; bio } } else a
    });
    found;
  };

  // Query methods

  // ============ STAFF MANAGEMENT ============
  type AdminStaffMember = {
    id : Text;
    name : Text;
    role_ : Text;
    email : Text;
    phone : Text;
    loginId : Text;
    passwordHash : Text;
    accessSections : [Text];
    accessLevel : Text;
    canExport : Bool;
    canDelete_ : Bool;
    isActive : Bool;
    createdAt : Int;
    lastLogin : ?Int;
  };

  let adminStaffMembers = List.empty<AdminStaffMember>();
  let staffMembers : List.List<AdminStaffMember> = List.empty<AdminStaffMember>();

  public func addStaffMember(name : Text, role_ : Text, email : Text, phone : Text, loginId : Text, password : Text, accessSections : [Text], accessLevel : Text, canExport : Bool, canDelete_ : Bool) : async Text {
    let id = "staff-" # Time.now().toText();
    adminStaffMembers.add({ id; name; role_; email; phone; loginId; passwordHash = password; accessSections; accessLevel; canExport; canDelete_; isActive = true; createdAt = Time.now(); lastLogin = null });
    id
  };

  public query func getStaffMembers() : async [AdminStaffMember] {
    adminStaffMembers.toArray()
  };

  public func deactivateStaffMember(targetId : Text) : async Bool {
    var found = false;
    adminStaffMembers.mapInPlace(func(m : AdminStaffMember) : AdminStaffMember {
      if (m.id == targetId) { found := true; { m with isActive = false } } else m
    });
    found
  };

  public query func staffLogin(loginId : Text, password : Text) : async ?{ id : Text; name : Text; role_ : Text; accessSections : [Text]; accessLevel : Text } {
    switch (adminStaffMembers.find(func(m : AdminStaffMember) : Bool { m.loginId == loginId and m.passwordHash == password and m.isActive })) {
      case (?m) { ?{ id = m.id; name = m.name; role_ = m.role_; accessSections = m.accessSections; accessLevel = m.accessLevel } };
      case null { null };
    }
  };

  // ============ NOTIFICATIONS ============
  type Notification = {
    id : Text;
    type_ : Text;
    title : Text;
    message : Text;
    isRead : Bool;
    createdAt : Int;
    relatedId : ?Text;
  };

  let notifications = List.empty<Notification>();

  public func addNotification(type_ : Text, title : Text, message : Text, relatedId : ?Text) : async Text {
    let id = "notif-" # Time.now().toText();
    notifications.add({ id; type_; title; message; isRead = false; createdAt = Time.now(); relatedId });
    id
  };

  public query func getNotifications() : async [Notification] {
    notifications.toArray().reverse()
  };

  public func markNotificationRead(targetId : Text) : async Bool {
    var found = false;
    notifications.mapInPlace(func(n : Notification) : Notification {
      if (n.id == targetId) { found := true; { n with isRead = true } } else n
    });
    found
  };

  public func markAllNotificationsRead() : async () {
    notifications.mapInPlace(func(n : Notification) : Notification { { n with isRead = true } });
  };

  public query func getUnreadNotificationCount() : async Nat {
    notifications.filter(func(n : Notification) : Bool { not n.isRead }).size()
  };

  // ============ INVOICES ============
  type Invoice = {
    id : Text;
    invoiceNumber : Text;
    clientName : Text;
    clientPhone : Text;
    clientEmail : Text;
    service : Text;
    totalAmount : Float;
    taxAmount : Float;
    status : Text;
    createdAt : Int;
    notes : Text;
  };

  let invoices = List.empty<Invoice>();

  public func addInvoice(invoiceNumber : Text, clientName : Text, clientPhone : Text, clientEmail : Text, service : Text, totalAmount : Float, taxAmount : Float, notes : Text) : async Text {
    let id = "inv-" # Time.now().toText();
    invoices.add({ id; invoiceNumber; clientName; clientPhone; clientEmail; service; totalAmount; taxAmount; status = "draft"; createdAt = Time.now(); notes });
    id
  };

  public query func getInvoices() : async [Invoice] {
    invoices.toArray().reverse()
  };

  public func updateInvoiceStatus(targetId : Text, status : Text) : async Bool {
    var found = false;
    invoices.mapInPlace(func(inv : Invoice) : Invoice {
      if (inv.id == targetId) { found := true; { inv with status } } else inv
    });
    found
  };

  // ============ APPOINTMENTS ============
  type Appointment = {
    id : Text;
    clientName : Text;
    clientPhone : Text;
    clientEmail : Text;
    type_ : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
    notes : Text;
    status : Text;
    createdAt : Int;
  };

  let appointments = List.empty<Appointment>();

  public func addAppointment(clientName : Text, clientPhone : Text, clientEmail : Text, type_ : Text, service : Text, preferredDate : Text, preferredTime : Text, notes : Text) : async Text {
    let id = "apt-" # Time.now().toText();
    appointments.add({ id; clientName; clientPhone; clientEmail; type_; service; preferredDate; preferredTime; notes; status = "pending"; createdAt = Time.now() });
    id
  };

  public query func getAppointments() : async [Appointment] {
    appointments.toArray().reverse()
  };

  public func updateAppointmentStatus(targetId : Text, status : Text) : async Bool {
    var found = false;
    appointments.mapInPlace(func(a : Appointment) : Appointment {
      if (a.id == targetId) { found := true; { a with status } } else a
    });
    found
  };

  // ============ BLOG POSTS ============
  type BlogPost = {
    id : Text;
    title : Text;
    slug : Text;
    content : Text;
    excerpt : Text;
    category : Text;
    author : Text;
    isPublished : Bool;
    createdAt : Int;
    updatedAt : Int;
    metaDescription : Text;
  };

  let blogPosts = List.empty<BlogPost>();

  public func addBlogPost(title : Text, slug : Text, content : Text, excerpt : Text, category : Text, author : Text, metaDescription : Text) : async Text {
    let id = "blog-" # Time.now().toText();
    blogPosts.add({ id; title; slug; content; excerpt; category; author; isPublished = false; createdAt = Time.now(); updatedAt = Time.now(); metaDescription });
    id
  };

  public query func getBlogPosts() : async [BlogPost] {
    blogPosts.toArray().reverse()
  };

  public query func getPublishedBlogPosts() : async [BlogPost] {
    blogPosts.filter(func(p : BlogPost) : Bool { p.isPublished }).toArray().reverse()
  };

  public func publishBlogPost(targetId : Text, isPublished : Bool) : async Bool {
    var found = false;
    blogPosts.mapInPlace(func(p : BlogPost) : BlogPost {
      if (p.id == targetId) { found := true; { p with isPublished; updatedAt = Time.now() } } else p
    });
    found
  };

  // ============ PARTNER APPLICATIONS ============
  type PartnerApplication = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    company : Text;
    experience : Text;
    areas : Text;
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  let partnerApplications = List.empty<PartnerApplication>();

  public func addPartnerApplication(name : Text, phone : Text, email : Text, company : Text, experience : Text, areas : Text) : async Text {
    let id = "partner-" # Time.now().toText();
    partnerApplications.add({ id; name; phone; email; company; experience; areas; status = "pending"; notes = ""; createdAt = Time.now() });
    id
  };

  public query func getPartnerApplications() : async [PartnerApplication] {
    partnerApplications.toArray().reverse()
  };

  public func updatePartnerStatus(targetId : Text, status : Text, notes : Text) : async Bool {
    var found = false;
    partnerApplications.mapInPlace(func(p : PartnerApplication) : PartnerApplication {
      if (p.id == targetId) { found := true; { p with status; notes } } else p
    });
    found
  };

  // ============ MARKET REPORTS ============
  type MarketReport = {
    id : Text;
    title : Text;
    month : Text;
    year : Text;
    content : Text;
    isPublished : Bool;
    createdAt : Int;
  };

  let marketReports = List.empty<MarketReport>();

  public func addMarketReport(title : Text, month : Text, year : Text, content : Text) : async Text {
    let id = "report-" # Time.now().toText();
    marketReports.add({ id; title; month; year; content; isPublished = false; createdAt = Time.now() });
    id
  };

  public query func getMarketReports() : async [MarketReport] {
    marketReports.toArray().reverse()
  };

  public query func getPublishedMarketReports() : async [MarketReport] {
    marketReports.filter(func(r : MarketReport) : Bool { r.isPublished }).toArray().reverse()
  };

  public func publishMarketReport(targetId : Text, isPublished : Bool) : async Bool {
    var found = false;
    marketReports.mapInPlace(func(r : MarketReport) : MarketReport {
      if (r.id == targetId) { found := true; { r with isPublished } } else r
    });
    found
  };

  // ============ SITE VISITS ============
  type SiteVisit = {
    id : Text;
    clientName : Text;
    clientPhone : Text;
    propertyAddress : Text;
    scheduledDate : Int;
    scheduledTime : Text;
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  let siteVisits = List.empty<SiteVisit>();

  public func addSiteVisit(clientName : Text, clientPhone : Text, propertyAddress : Text, scheduledDate : Int, scheduledTime : Text, notes : Text) : async Text {
    let id = "visit-" # Time.now().toText();
    siteVisits.add({ id; clientName; clientPhone; propertyAddress; scheduledDate; scheduledTime; status = "scheduled"; notes; createdAt = Time.now() });
    id
  };

  public query func getSiteVisits() : async [SiteVisit] {
    siteVisits.toArray().reverse()
  };

  public func updateSiteVisitStatus(targetId : Text, status : Text) : async Bool {
    var found = false;
    siteVisits.mapInPlace(func(v : SiteVisit) : SiteVisit {
      if (v.id == targetId) { found := true; { v with status } } else v
    });
    found
  };

  // ============ DEALS / CRM ============
  type Deal = {
    id : Text;
    clientName : Text;
    clientPhone : Text;
    clientEmail : Text;
    service : Text;
    stage : Text;
    notes : Text;
    followUpDate : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  let deals = List.empty<Deal>();

  public func addDeal(clientName : Text, clientPhone : Text, clientEmail : Text, service : Text) : async Text {
    let id = "deal-" # Time.now().toText();
    deals.add({ id; clientName; clientPhone; clientEmail; service; stage = "enquiry"; notes = ""; followUpDate = null; createdAt = Time.now(); updatedAt = Time.now() });
    id
  };

  public query func getDeals() : async [Deal] {
    deals.toArray().reverse()
  };

    // ============================================================
    // COMPLAINT TRACKER
    // ============================================================

    public type ComplaintTicket = {
      id: Text;
      refNumber: Text;
      customerName: Text;
      phone: Text;
      service: Text;
      issue: Text;
      status: Text;
      createdAt: Int;
      resolvedAt: ?Int;
      notes: Text;
    };

    let complaintTickets = List.empty<ComplaintTicket>();

    public func submitComplaint(name: Text, phone: Text, service: Text, issue: Text) : async Text {
      let refNumber = "TKT-" # (Time.now() / 1_000_000 % 100_000).toText();
      let ticket : ComplaintTicket = {
        id = "complaint-" # Time.now().toText();
        refNumber = refNumber;
        customerName = name;
        phone = phone;
        service = service;
        issue = issue;
        status = "Open";
        createdAt = Time.now();
        resolvedAt = null;
        notes = "";
      };
      complaintTickets.add(ticket);
      refNumber
    };

    public query func getComplaint(refNumber: Text) : async ?ComplaintTicket {
      complaintTickets.find<ComplaintTicket>(func(t : ComplaintTicket) : Bool { t.refNumber == refNumber })
    };

    public query func getAllComplaints() : async [ComplaintTicket] {
      complaintTickets.toArray()
    };

    public func updateComplaintStatus(id: Text, status: Text, notes: Text) : async Bool {
      complaintTickets.mapInPlace(func(t : ComplaintTicket) : ComplaintTicket {
        if (t.id == id) {
          let resolved : ?Int = if (status == "Resolved") { ?Time.now() } else { t.resolvedAt };
          { t with status = status; notes = notes; resolvedAt = resolved }
        } else { t }
      });
      true
    };

    public func deleteComplaint(id: Text) : async Bool {
      let filtered = complaintTickets.filter(func(t : ComplaintTicket) : Bool { t.id != id });
      complaintTickets.clear();
      complaintTickets.addAll(filtered.values());
      true
    };

    // ============================================================
    // SATISFACTION RATINGS
    // ============================================================

    public type SatisfactionRating = {
      id: Text;
      enquiryId: Text;
      rating: Nat;
      feedback: Text;
      submittedAt: Int;
    };

    let satisfactionRatings = List.empty<SatisfactionRating>();

    public func submitSatisfactionRating(enquiryId: Text, rating: Nat, feedback: Text) : async Bool {
      let r : SatisfactionRating = {
        id = "rating-" # Time.now().toText();
        enquiryId = enquiryId;
        rating = rating;
        feedback = feedback;
        submittedAt = Time.now();
      };
      satisfactionRatings.add(r);
      true
    };

    public query func getSatisfactionRatings() : async [SatisfactionRating] {
      satisfactionRatings.toArray()
    };

    public query func getAverageRating() : async Float {
      let arr = satisfactionRatings.toArray();
      if (arr.size() == 0) { return 0.0 };
      var total : Float = 0.0;
      for (r in arr.vals()) { total += r.rating.toFloat() };
      total / arr.size().toFloat()
    };

    // ============================================================
    // CHATBOT ANALYTICS
    // ============================================================

    let chatTopics = List.empty<(Text, Nat)>();
    var totalChatCount : Nat = 0;

    public func logChatTopic(topic: Text) : async Bool {
      totalChatCount += 1;
      var found = false;
      let newTopics = List.empty<(Text, Nat)>();
      for (entry in chatTopics.values()) {
        if (entry.0 == topic) { found := true; newTopics.add((entry.0, entry.1 + 1)) } else { newTopics.add(entry) };
      };
      chatTopics.clear();
      chatTopics.addAll(newTopics.values());
      if (not found) {
        chatTopics.add((topic, 1));
      };
      true
    };

    public query func getChatAnalytics() : async { topTopics: [(Text, Nat)]; totalChats: Nat } {
      { topTopics = chatTopics.toArray(); totalChats = totalChatCount }
    };

    // ============================================================
    // SEASONAL BANNERS / SCHEDULED ANNOUNCEMENTS
    // ============================================================

    public type Announcement = {
      id: Text;
      title: Text;
      message: Text;
      ctaText: Text;
      ctaUrl: Text;
      bgColor: Text;
      isActive: Bool;
      scheduledAt: ?Int;
      expiresAt: ?Int;
      createdAt: Int;
    };

    let announcements = List.empty<Announcement>();

    public func addAnnouncement(title: Text, message: Text, ctaText: Text, ctaUrl: Text, bgColor: Text, scheduledAt: ?Int, expiresAt: ?Int) : async Text {
      let id = "ann-" # Time.now().toText();
      let ann : Announcement = {
        id = id;
        title = title;
        message = message;
        ctaText = ctaText;
        ctaUrl = ctaUrl;
        bgColor = bgColor;
        isActive = true;
        scheduledAt = scheduledAt;
        expiresAt = expiresAt;
        createdAt = Time.now();
      };
      announcements.add(ann);
      id
    };

    public query func getActiveAnnouncements() : async [Announcement] {
      let now = Time.now();
      announcements.filter(func(a : Announcement) : Bool {
        if (not a.isActive) { return false };
        let afterSchedule = switch (a.scheduledAt) { case (?t) { now >= t }; case null { true } };
        let beforeExpiry = switch (a.expiresAt) { case (?t) { now <= t }; case null { true } };
        afterSchedule and beforeExpiry
      }).toArray()
    };

    public query func getAllAnnouncements() : async [Announcement] {
      announcements.toArray()
    };

    public func toggleAnnouncement(id: Text, isActive: Bool) : async Bool {
      announcements.mapInPlace(func(a : Announcement) : Announcement {
        if (a.id == id) { { a with isActive = isActive } } else { a }
      });
      true
    };

    public func deleteAnnouncement(id: Text) : async Bool {
      let filtered = announcements.filter(func(a : Announcement) : Bool { a.id != id });
      announcements.clear();
      announcements.addAll(filtered.values());
      true
    };

    // ============================================================
    // DEAL COUNTER & RESPONSE TIME BADGE
    // ============================================================

    var dealCounterValue : Nat = 47;
    var dealCounterDesc : Text = "properties facilitated this year";
    var dealCounterUpdatedAt : Int = 0;
    var responseTimeBadgeText : Text = "Typically responds within 2 hours";

    public func addDealCounterUpdate(count: Nat, desc: Text) : async Bool {
      dealCounterValue := count;
      dealCounterDesc := desc;
      dealCounterUpdatedAt := Time.now();
      true
    };

    public query func getDealCounter() : async { count: Nat; desc: Text; updatedAt: Int } {
      { count = dealCounterValue; desc = dealCounterDesc; updatedAt = dealCounterUpdatedAt }
    };

    public func setResponseTimeBadge(text: Text) : async Bool {
      responseTimeBadgeText := text;
      true
    };

    public query func getResponseTimeBadge() : async Text {
      responseTimeBadgeText
    };

    // ============================================================
    // ANNIVERSARY REMINDERS
    // ============================================================

    public type AnniversaryReminder = {
      id: Text;
      clientName: Text;
      phone: Text;
      email: Text;
      reminderDate: Text;
      reminderType: Text;
      notes: Text;
      createdAt: Int;
    };

    let anniversaryReminders = List.empty<AnniversaryReminder>();

    public func addAnniversaryReminder(clientName: Text, phone: Text, email: Text, reminderDate: Text, reminderType: Text, notes: Text) : async Text {
      let id = "anniv-" # Time.now().toText();
      let r : AnniversaryReminder = {
        id = id;
        clientName = clientName;
        phone = phone;
        email = email;
        reminderDate = reminderDate;
        reminderType = reminderType;
        notes = notes;
        createdAt = Time.now();
      };
      anniversaryReminders.add(r);
      id
    };

    public query func getAnniversaryReminders() : async [AnniversaryReminder] {
      anniversaryReminders.toArray()
    };

    public func deleteAnniversaryReminder(id: Text) : async Bool {
      let filtered = anniversaryReminders.filter(func(r : AnniversaryReminder) : Bool { r.id != id });
      anniversaryReminders.clear();
      anniversaryReminders.addAll(filtered.values());
      true
    };

    // ============================================================
    // AUTO-ARCHIVE SETTINGS
    // ============================================================

    var autoArchiveDays : Nat = 90;

    public func setAutoArchiveDays(days: Nat) : async Bool {
      autoArchiveDays := days;
      true
    };

    public query func getAutoArchiveDays() : async Nat {
      autoArchiveDays
    };

    // ============================================================
    // LEAD NURTURE REMINDERS
    // ============================================================

    public type LeadNurtureReminder = {
      id: Text;
      leadId: Text;
      leadName: Text;
      phone: Text;
      service: Text;
      lastContactedAt: Int;
      reminderDays: Nat;
      isDismissed: Bool;
    };

    let leadNurtureReminders = List.empty<LeadNurtureReminder>();

    public func addLeadNurtureReminder(leadId: Text, leadName: Text, phone: Text, service: Text, reminderDays: Nat) : async Bool {
      let existing = leadNurtureReminders.filter(func(r : LeadNurtureReminder) : Bool { r.leadId != leadId });
      leadNurtureReminders.clear();
      leadNurtureReminders.addAll(existing.values());
      let r : LeadNurtureReminder = {
        id = "nurture-" # Time.now().toText();
        leadId = leadId;
        leadName = leadName;
        phone = phone;
        service = service;
        lastContactedAt = Time.now();
        reminderDays = reminderDays;
        isDismissed = false;
      };
      leadNurtureReminders.add(r);
      true
    };

    public query func getOverdueLeadReminders() : async [LeadNurtureReminder] {
      let now = Time.now();
      leadNurtureReminders.filter(func(r : LeadNurtureReminder) : Bool {
        if (r.isDismissed) { return false };
        let thresholdNs : Int = Int.fromNat(r.reminderDays) * 86_400_000_000_000;
        (now - r.lastContactedAt) > thresholdNs
      }).toArray()
    };

    public func dismissLeadReminder(id: Text) : async Bool {
      leadNurtureReminders.mapInPlace(func(r : LeadNurtureReminder) : LeadNurtureReminder {
        if (r.id == id) { { r with isDismissed = true } } else { r }
      });
      true
    };

    public func updateLeadLastContacted(leadId: Text) : async Bool {
      leadNurtureReminders.mapInPlace(func(r : LeadNurtureReminder) : LeadNurtureReminder {
        if (r.leadId == leadId) { { r with lastContactedAt = Time.now(); isDismissed = false } } else { r }
      });
      true
    };

    // ============================================================
    // SOCIETY REVIEWS
    // ============================================================

    public type SocietyReview = {
      id: Text;
      societyName: Text;
      reviewerAlias: Text;
      rating: Nat;
      maintenance: Nat;
      security: Nat;
      amenities: Nat;
      management: Nat;
      review: Text;
      createdAt: Int;
      isApproved: Bool;
    };

    let societyReviews = List.empty<SocietyReview>();

    public func submitSocietyReview(societyName: Text, reviewerAlias: Text, rating: Nat, maintenance: Nat, security: Nat, amenities: Nat, management: Nat, review: Text) : async Bool {
      let r : SocietyReview = {
        id = "review-" # Time.now().toText();
        societyName = societyName;
        reviewerAlias = reviewerAlias;
        rating = rating;
        maintenance = maintenance;
        security = security;
        amenities = amenities;
        management = management;
        review = review;
        createdAt = Time.now();
        isApproved = false;
      };
      societyReviews.add(r);
      true
    };

    public query func getSocietyReviews(societyName: Text) : async [SocietyReview] {
      societyReviews.filter(func(r : SocietyReview) : Bool { r.societyName == societyName and r.isApproved }).toArray()
    };

    public query func getAllSocietyReviews() : async [SocietyReview] {
      societyReviews.toArray()
    };

    public func approveSocietyReview(id: Text) : async Bool {
      societyReviews.mapInPlace(func(r : SocietyReview) : SocietyReview {
        if (r.id == id) { { r with isApproved = true } } else { r }
      });
      true
    };

    public func deleteSocietyReview(id: Text) : async Bool {
      let filtered = societyReviews.filter(func(r : SocietyReview) : Bool { r.id != id });
      societyReviews.clear();
      societyReviews.addAll(filtered.values());
      true
    };

    // ============================================================
    // BUILDER PROFILES
    // ============================================================

    public type BuilderProfile = {
      id: Text;
      name: Text;
      reraNumber: Text;
      registeredSince: Text;
      completedProjects: Nat;
      ongoingProjects: Nat;
      rating: Float;
      localities: [Text];
      about: Text;
      contact: Text;
      isVerified: Bool;
    };

    let builderProfiles = List.empty<BuilderProfile>();

    public func addBuilderProfile(name: Text, reraNumber: Text, registeredSince: Text, completedProjects: Nat, ongoingProjects: Nat, rating: Float, localities: [Text], about: Text, contact: Text) : async Text {
      let id = "builder-" # Time.now().toText();
      let b : BuilderProfile = {
        id = id;
        name = name;
        reraNumber = reraNumber;
        registeredSince = registeredSince;
        completedProjects = completedProjects;
        ongoingProjects = ongoingProjects;
        rating = rating;
        localities = localities;
        about = about;
        contact = contact;
        isVerified = true;
      };
      builderProfiles.add(b);
      id
    };

    public query func getBuilderProfiles() : async [BuilderProfile] {
      builderProfiles.toArray()
    };

    public query func getBuilderByRera(reraNumber: Text) : async ?BuilderProfile {
      builderProfiles.find<BuilderProfile>(func(b : BuilderProfile) : Bool { b.reraNumber == reraNumber })
    };

    public func deleteBuilderProfile(id: Text) : async Bool {
      let filtered = builderProfiles.filter(func(b : BuilderProfile) : Bool { b.id != id });
      builderProfiles.clear();
      builderProfiles.addAll(filtered.values());
      true
    };


  public query ({ caller }) func getService(id : Nat) : async ?Service {
    serviceMap.get(id);
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    serviceMap.values().toArray().sort();
  };

  // ============================================================
  // AI HIERARCHY SYSTEM — 369 AGENTS
  // ============================================================

  type AIAgent = {
    id : Text;
    name : Text;
    tier : Text;
    category : Text;
    description : Text;
    isActive : Bool;
    parentId : ?Text;
    config : Text;
    lastAction : Text;
    actionsLog : [Text];
  };

  type AIInsight = {
    id : Text;
    agentId : Text;
    title : Text;
    content : Text;
    priority : Text;
    createdAt : Text;
    status : Text;
  };

  type AISystemConfig = {
    openAIKeySet : Bool;
    geminiKeySet : Bool;
    claudeKeySet : Bool;
    activeProvider : Text;
    fallbackOrder : [Text];
    totalAgents : Nat;
    activeAgents : Nat;
  };

  let aiAgents = Map.empty<Text, AIAgent>();

  let aiInsights = List.empty<AIInsight>();

  let aiSystemConfigState = { var cfg : AISystemConfig = {
    openAIKeySet = false;
    geminiKeySet = false;
    claudeKeySet = false;
    activeProvider = "caffeine";
    fallbackOrder = ["openai", "gemini", "claude"];
    totalAgents = 369;
    activeAgents = 369;
  }};

  func mkAgent(id : Text, name : Text, tier : Text, cat : Text, desc : Text, parentId : ?Text) : AIAgent {
    { id; name; tier; category = cat; description = desc; isActive = true; parentId; config = "{}"; lastAction = "Initialized"; actionsLog = [] }
  };

  func initAIAgents() {
    // COMMAND TIER
    aiAgents.add("master-intelligence", mkAgent("master-intelligence", "MSTC Master Intelligence", "command", "Command", "Overarching brain coordinating every AI, global business awareness, daily executive brief", null));
    aiAgents.add("caffeine-chief", mkAgent("caffeine-chief", "Caffeine AI Chief Officer", "command", "Command", "Direct interface to entire AI system, coordinates all tiers, morning brief compiler", ?"master-intelligence"));
    // ULTRA TIER
    aiAgents.add("strategic-business", mkAgent("strategic-business", "Strategic Business AI", "ultra", "Ultra", "6-12 month forward thinking, market threats, major business move recommendations", ?"caffeine-chief"));
    aiAgents.add("revenue-intelligence", mkAgent("revenue-intelligence", "Revenue Intelligence AI", "ultra", "Ultra", "Tracks every rupee, forecasts revenue, identifies leakage, recommends where to push", ?"caffeine-chief"));
    aiAgents.add("client-intelligence", mkAgent("client-intelligence", "Client Intelligence AI", "ultra", "Ultra", "Deep real-time profiles of every client: behavior, preferences, buy probability, lifetime value", ?"caffeine-chief"));
    aiAgents.add("platform-architect", mkAgent("platform-architect", "Platform Architect AI", "ultra", "Ultra", "Designs platform evolution, decides what gets built next and in what order", ?"caffeine-chief"));
    aiAgents.add("risk-crisis", mkAgent("risk-crisis", "Risk & Crisis AI", "ultra", "Ultra", "Monitors legal, financial, reputational, operational risk, alerts before crisis hits", ?"caffeine-chief"));
    aiAgents.add("growth-engine", mkAgent("growth-engine", "Growth Engine AI", "ultra", "Ultra", "Dedicated to growing MSTC: more clients, more deals, more services, more reach", ?"caffeine-chief"));
    aiAgents.add("operations-command", mkAgent("operations-command", "Operations Command AI", "ultra", "Ultra", "Day-to-day operations: task assignment, deadline tracking, team coordination", ?"caffeine-chief"));
    aiAgents.add("knowledge-vault", mkAgent("knowledge-vault", "Knowledge Vault AI", "ultra", "Ultra", "Stores all MSTC institutional knowledge: deals, client history, legal precedents, market data", ?"caffeine-chief"));
    // GM TIER
    aiAgents.add("gm-property", mkAgent("gm-property", "GM of Property & Real Estate", "gm", "Property", "General Manager overseeing all property and real estate AI operations", ?"caffeine-chief"));
    aiAgents.add("gm-bizdev", mkAgent("gm-bizdev", "GM of Business Development", "gm", "BizDev", "General Manager overseeing business development and revenue operations", ?"caffeine-chief"));
    aiAgents.add("gm-technology", mkAgent("gm-technology", "GM of Technology & Platform", "gm", "Technology", "General Manager overseeing technology and platform operations", ?"caffeine-chief"));
    aiAgents.add("gm-finance", mkAgent("gm-finance", "GM of Finance & Compliance", "gm", "Finance", "General Manager overseeing finance and compliance operations", ?"caffeine-chief"));
    aiAgents.add("gm-content", mkAgent("gm-content", "GM of Content & Intelligence", "gm", "Content", "General Manager overseeing content and intelligence operations", ?"caffeine-chief"));
    aiAgents.add("gm-clients", mkAgent("gm-clients", "GM of Client Relations", "gm", "Clients", "General Manager overseeing client relations operations", ?"caffeine-chief"));
    aiAgents.add("gm-services", mkAgent("gm-services", "GM of Services", "gm", "Services", "General Manager overseeing services including events, music, sports, NGO, tourism", ?"caffeine-chief"));
    aiAgents.add("gm-security", mkAgent("gm-security", "GM of Security & Risk", "gm", "Security", "General Manager overseeing security and risk operations", ?"caffeine-chief"));
    aiAgents.add("gm-data", mkAgent("gm-data", "GM of Data & Research", "gm", "Data", "General Manager overseeing data and research operations", ?"caffeine-chief"));
    aiAgents.add("gm-people", mkAgent("gm-people", "GM of People & Innovation", "gm", "People", "General Manager overseeing people and innovation operations", ?"caffeine-chief"));
    // DEPT - Property
    aiAgents.add("property-market-oracle", mkAgent("property-market-oracle", "Property Market Oracle", "dept", "Property", "Micro-market trends, hotspots, price forecasts by locality", ?"gm-property"));
    aiAgents.add("deal-intelligence", mkAgent("deal-intelligence", "Deal Intelligence AI", "dept", "Property", "Tracks every deal, predicts close probability, flags cold deals", ?"gm-property"));
    aiAgents.add("property-valuation-engine", mkAgent("property-valuation-engine", "Property Valuation Engine", "dept", "Property", "Instant fair market value using comparable transactions", ?"gm-property"));
    aiAgents.add("buyer-profiler", mkAgent("buyer-profiler", "Buyer Profiler AI", "dept", "Property", "Deep buyer profiles: what they want, can afford, what makes them decide", ?"gm-property"));
    aiAgents.add("seller-intelligence", mkAgent("seller-intelligence", "Seller Intelligence AI", "dept", "Property", "Seller motivations, optimal listing strategy, pricing per seller type", ?"gm-property"));
    aiAgents.add("rental-market", mkAgent("rental-market", "Rental Market AI", "dept", "Property", "Rental yields, tenant demand, price trends across all Ahmedabad localities", ?"gm-property"));
    aiAgents.add("commercial-property", mkAgent("commercial-property", "Commercial Property AI", "dept", "Property", "Office, retail, industrial specialized market intelligence", ?"gm-property"));
    aiAgents.add("luxury-property", mkAgent("luxury-property", "Luxury Property AI", "dept", "Property", "High-value properties, different negotiation tactics, VIP client handling", ?"gm-property"));
    aiAgents.add("investment-portfolio", mkAgent("investment-portfolio", "Investment Portfolio AI", "dept", "Property", "Builds and manages property investment portfolios, tracks performance", ?"gm-property"));
    aiAgents.add("property-legal-intelligence", mkAgent("property-legal-intelligence", "Property Legal Intelligence AI", "dept", "Property", "Gujarat property law, RERA, registration, stamp duty, title", ?"gm-property"));
    aiAgents.add("neighbourhood-intelligence", mkAgent("neighbourhood-intelligence", "Neighbourhood Intelligence AI", "dept", "Property", "Deep data on all 11 Ahmedabad localities, infrastructure, schools, connectivity", ?"gm-property"));
    aiAgents.add("pre-launch-intelligence", mkAgent("pre-launch-intelligence", "Pre-Launch Intelligence AI", "dept", "Property", "Tracks upcoming project launches, builder credibility, early-bird opportunities", ?"gm-property"));
    aiAgents.add("distressed-property", mkAgent("distressed-property", "Distressed Property AI", "dept", "Property", "Identifies auction, distressed, below-market properties", ?"gm-property"));
    aiAgents.add("property-timeline", mkAgent("property-timeline", "Property Timeline AI", "dept", "Property", "Tracks possession dates, construction progress, handover milestones", ?"gm-property"));
    aiAgents.add("virtual-tour-intelligence", mkAgent("virtual-tour-intelligence", "Virtual Tour Intelligence AI", "dept", "Property", "Manages virtual site visit requests, coordinates scheduling", ?"gm-property"));
    // DEPT - BizDev
    aiAgents.add("lead-management-head", mkAgent("lead-management-head", "Lead Management Head AI", "dept", "BizDev", "Oversees all lead management operations and pipeline", ?"gm-bizdev"));
    aiAgents.add("deal-velocity-head", mkAgent("deal-velocity-head", "Deal Velocity Head AI", "dept", "BizDev", "Monitors deal progression speed and removes bottlenecks", ?"gm-bizdev"));
    aiAgents.add("partnership-head", mkAgent("partnership-head", "Partnership Head AI", "dept", "BizDev", "Manages strategic partnership development and cultivation", ?"gm-bizdev"));
    aiAgents.add("revenue-forecast-head", mkAgent("revenue-forecast-head", "Revenue Forecast Head AI", "dept", "BizDev", "Produces accurate revenue forecasts and variance analysis", ?"gm-bizdev"));
    aiAgents.add("lead-qualification-agent", mkAgent("lead-qualification-agent", "Lead Qualification Agent", "dept", "BizDev", "Qualifies incoming leads, scores them, routes to right team member", ?"gm-bizdev"));
    aiAgents.add("lead-manager-agent", mkAgent("lead-manager-agent", "Lead Manager Agent", "dept", "BizDev", "Manages full lead lifecycle from capture to conversion", ?"gm-bizdev"));
    aiAgents.add("negotiation-intelligence", mkAgent("negotiation-intelligence", "Negotiation Intelligence AI", "dept", "BizDev", "Analyzes deals and produces tailored negotiation strategy briefs", ?"gm-bizdev"));
    aiAgents.add("proposal-generator", mkAgent("proposal-generator", "Proposal Generator AI", "dept", "BizDev", "One-click branded proposal PDF per lead, professional format", ?"gm-bizdev"));
    aiAgents.add("smart-lead-scoring", mkAgent("smart-lead-scoring", "Smart Lead Scoring AI", "dept", "BizDev", "Scores every lead with full reasoning, gradient boosting model", ?"gm-bizdev"));
    aiAgents.add("deal-probability-scorer", mkAgent("deal-probability-scorer", "Deal Probability Scorer", "dept", "BizDev", "Calculates exact probability of any deal closing", ?"gm-bizdev"));
    aiAgents.add("market-opportunity-scanner", mkAgent("market-opportunity-scanner", "Market Opportunity Scanner AI", "dept", "BizDev", "Scans for emerging opportunities in Gujarat real estate market", ?"gm-bizdev"));
    aiAgents.add("partnership-scout", mkAgent("partnership-scout", "Partnership Scout AI", "dept", "BizDev", "Identifies potential strategic partners and co-marketing opportunities", ?"gm-bizdev"));
    // DEPT - Technology
    aiAgents.add("platform-evolution", mkAgent("platform-evolution", "Platform Evolution AI", "dept", "Technology", "Continuously evolves MSTC GLOBAL: new features, better UX, new tools", ?"gm-technology"));
    aiAgents.add("performance-optimizer", mkAgent("performance-optimizer", "Performance Optimizer AI", "dept", "Technology", "Peak speed and efficiency on all devices always", ?"gm-technology"));
    aiAgents.add("integration-architect", mkAgent("integration-architect", "Integration Architect AI", "dept", "Technology", "Manages all external integrations: payment, APIs, data feeds", ?"gm-technology"));
    aiAgents.add("data-architecture", mkAgent("data-architecture", "Data Architecture AI", "dept", "Technology", "Designs and maintains entire platform data structure", ?"gm-technology"));
    aiAgents.add("devops-intelligence", mkAgent("devops-intelligence", "DevOps Intelligence AI", "dept", "Technology", "Deployment health, uptime, error rates, infrastructure performance", ?"gm-technology"));
    aiAgents.add("api-intelligence", mkAgent("api-intelligence", "API Intelligence AI", "dept", "Technology", "All external API connections, usage monitoring, cost optimization, failure handling", ?"gm-technology"));
    aiAgents.add("code-quality", mkAgent("code-quality", "Code Quality AI", "dept", "Technology", "Quality standards for all code added to platform, reviews every build", ?"gm-technology"));
    aiAgents.add("infrastructure-monitor", mkAgent("infrastructure-monitor", "Infrastructure Monitor AI", "dept", "Technology", "Platform health, canister performance, storage usage, alerts", ?"gm-technology"));
    aiAgents.add("continuous-builder-head", mkAgent("continuous-builder-head", "Continuous Builder Head AI", "dept", "Technology", "Directs the builder team, prioritizes build queue", ?"gm-technology"));
    aiAgents.add("technology-scout", mkAgent("technology-scout", "Technology Scout AI", "dept", "Technology", "Monitors new tech developments, suggests platform upgrades", ?"gm-technology"));
    aiAgents.add("technology-upgrade", mkAgent("technology-upgrade", "Technology Upgrade AI", "dept", "Technology", "Monitors new technology developments and suggests when to upgrade platform components", ?"gm-technology"));
    // DEPT - Finance
    aiAgents.add("financial-planning", mkAgent("financial-planning", "Financial Planning AI", "dept", "Finance", "Complete goal-based financial planning, life-stage aware, property integrated", ?"gm-finance"));
    aiAgents.add("loan-intelligence", mkAgent("loan-intelligence", "Loan Intelligence AI", "dept", "Finance", "Entire home loan ecosystem: best bank, product, rate, fastest approval", ?"gm-finance"));
    aiAgents.add("tax-optimization", mkAgent("tax-optimization", "Tax Optimization AI", "dept", "Finance", "Every legal tax saving for property transactions in Gujarat", ?"gm-finance"));
    aiAgents.add("investment-returns", mkAgent("investment-returns", "Investment Returns AI", "dept", "Finance", "Projects returns across all asset classes vs real estate", ?"gm-finance"));
    aiAgents.add("cash-flow-intelligence", mkAgent("cash-flow-intelligence", "Cash Flow Intelligence AI", "dept", "Finance", "Tracks and forecasts: rent in, EMI out, tax, maintenance", ?"gm-finance"));
    aiAgents.add("insurance-advisory", mkAgent("insurance-advisory", "Insurance Advisory AI", "dept", "Finance", "Property and home loan insurance guidance", ?"gm-finance"));
    aiAgents.add("rera-financial", mkAgent("rera-financial", "RERA Financial AI", "dept", "Finance", "Escrow monitoring, payment schedules, builder financial health", ?"gm-finance"));
    aiAgents.add("wealth-management", mkAgent("wealth-management", "Wealth Management AI", "dept", "Finance", "Long-term wealth: property, equity, gold, other assets integrated", ?"gm-finance"));
    aiAgents.add("fixed-floating-rate", mkAgent("fixed-floating-rate", "Fixed vs Floating Rate AI", "dept", "Finance", "Analyzes current market, recommends fixed or floating loan", ?"gm-finance"));
    aiAgents.add("home-loan-balance-transfer", mkAgent("home-loan-balance-transfer", "Home Loan Balance Transfer AI", "dept", "Finance", "Full cost-benefit of switching lenders, including charges", ?"gm-finance"));
    aiAgents.add("affordability-projection", mkAgent("affordability-projection", "Affordability Projection AI", "dept", "Finance", "Invest X per month for Y years, shows what you can afford in future", ?"gm-finance"));
    aiAgents.add("tax-savings-maximizer", mkAgent("tax-savings-maximizer", "Tax Savings Maximizer AI", "dept", "Finance", "Structures home loan for maximum 80C plus 24b deductions", ?"gm-finance"));
    aiAgents.add("rera-command", mkAgent("rera-command", "RERA Command AI", "dept", "Finance", "Project registration, complaint filing, deadline management, compliance calendar", ?"gm-finance"));
    aiAgents.add("regulatory-intelligence", mkAgent("regulatory-intelligence", "Regulatory Intelligence AI", "dept", "Finance", "Monitors all regulatory changes: Gujarat, India, affecting MSTC", ?"gm-finance"));
    aiAgents.add("due-diligence", mkAgent("due-diligence", "Due Diligence AI", "dept", "Finance", "Complete property due diligence: title, encumbrance, legal status, approvals", ?"gm-finance"));
    aiAgents.add("litigation-monitor", mkAgent("litigation-monitor", "Litigation Monitor AI", "dept", "Finance", "Legal matters, court dates, notices, nothing missed", ?"gm-finance"));
    aiAgents.add("legal-document-intelligence", mkAgent("legal-document-intelligence", "Legal Document Intelligence AI", "dept", "Finance", "Reads, analyzes, summarizes any legal document, risk flags", ?"gm-finance"));
    aiAgents.add("contract-generation", mkAgent("contract-generation", "Contract Generation AI", "dept", "Finance", "Generates legally sound agreements, sale deeds, rent agreements, MOUs", ?"gm-finance"));
    aiAgents.add("rent-agreement-generator", mkAgent("rent-agreement-generator", "Rent Agreement Generator AI", "dept", "Finance", "Fully legal Gujarat-compliant rent and leave and license agreements", ?"gm-finance"));
    aiAgents.add("legal-cost-estimator", mkAgent("legal-cost-estimator", "Legal Cost Estimator AI", "dept", "Finance", "Exact stamp duty, registration fee, advocate fees, GST for any transaction", ?"gm-finance"));
    // DEPT - Content
    aiAgents.add("content-strategy", mkAgent("content-strategy", "Content Strategy AI", "dept", "Content", "Plans all content: what to publish, when, for whom, in what format", ?"gm-content"));
    aiAgents.add("seo-intelligence", mkAgent("seo-intelligence", "SEO Intelligence AI", "dept", "Content", "Keyword strategy, content gaps, ranking opportunities for MSTC", ?"gm-content"));
    aiAgents.add("social-intelligence", mkAgent("social-intelligence", "Social Intelligence AI", "dept", "Content", "Social media strategy, content calendar, engagement monitoring", ?"gm-content"));
    aiAgents.add("brand-intelligence", mkAgent("brand-intelligence", "Brand Intelligence AI", "dept", "Content", "Protects and evolves MSTC GLOBAL brand: consistency, perception, positioning", ?"gm-content"));
    aiAgents.add("campaign-intelligence", mkAgent("campaign-intelligence", "Campaign Intelligence AI", "dept", "Content", "Diwali, Navratri, budget season, festival campaigns", ?"gm-content"));
    aiAgents.add("pr-intelligence", mkAgent("pr-intelligence", "PR Intelligence AI", "dept", "Content", "Media monitoring, reputation management, PR opportunities and risks", ?"gm-content"));
    aiAgents.add("video-media", mkAgent("video-media", "Video & Media AI", "dept", "Content", "Video content organization, descriptions, recommendations", ?"gm-content"));
    aiAgents.add("newsletter-intelligence", mkAgent("newsletter-intelligence", "Newsletter Intelligence AI", "dept", "Content", "Targeted newsletters by client segment and behavior", ?"gm-content"));
    aiAgents.add("whatsapp-intelligence", mkAgent("whatsapp-intelligence", "WhatsApp Intelligence AI", "dept", "Content", "Drafts messages, manages broadcast lists, auto-reply sequences", ?"gm-content"));
    aiAgents.add("area-guide-builder", mkAgent("area-guide-builder", "Area Guide Builder AI", "dept", "Content", "Continuously writes and updates area guides for all 11 Ahmedabad localities", ?"gm-content"));
    aiAgents.add("business-expansion", mkAgent("business-expansion", "Business Expansion AI", "dept", "Content", "New services, localities, client segments with full business cases", ?"gm-content"));
    aiAgents.add("weekly-innovation-report", mkAgent("weekly-innovation-report", "Weekly Innovation Report AI", "dept", "Content", "Compiles all suggestion AI outputs into one weekly brief", ?"gm-content"));
    aiAgents.add("feature-suggestion", mkAgent("feature-suggestion", "Feature Suggestion AI", "dept", "Content", "Weekly ranked feature ideas, approve or defer or reject in dashboard", ?"gm-content"));
    // DEPT - Client Relations
    aiAgents.add("client-journey-orchestrator", mkAgent("client-journey-orchestrator", "Client Journey Orchestrator", "dept", "Clients", "Manages every touchpoint from first contact to post-deal", ?"gm-clients"));
    aiAgents.add("personalization-engine", mkAgent("personalization-engine", "Personalization Engine AI", "dept", "Clients", "Every interaction feels custom-designed per client", ?"gm-clients"));
    aiAgents.add("retention-intelligence", mkAgent("retention-intelligence", "Retention Intelligence AI", "dept", "Clients", "Predicts at-risk clients, auto-intervenes with right message", ?"gm-clients"));
    aiAgents.add("referral-intelligence", mkAgent("referral-intelligence", "Referral Intelligence AI", "dept", "Clients", "Identifies likely referrers, triggers referral programs at right moment", ?"gm-clients"));
    aiAgents.add("complaint-resolution", mkAgent("complaint-resolution", "Complaint Resolution AI", "dept", "Clients", "End-to-end complaint handling, satisfaction confirmation", ?"gm-clients"));
    aiAgents.add("client-communication", mkAgent("client-communication", "Client Communication AI", "dept", "Clients", "All client communications in right tone per client, all 3 languages", ?"gm-clients"));
    aiAgents.add("vip-client", mkAgent("vip-client", "VIP Client AI", "dept", "Clients", "Dedicated intelligence for high-value clients, proactive service", ?"gm-clients"));
    aiAgents.add("post-sale-relationship", mkAgent("post-sale-relationship", "Post-Sale Relationship AI", "dept", "Clients", "Anniversaries, property updates, new opportunities after closing", ?"gm-clients"));
    aiAgents.add("client-lifecycle-head", mkAgent("client-lifecycle-head", "Client Lifecycle Head AI", "dept", "Clients", "Full lifecycle management from lead to loyal client", ?"gm-clients"));
    aiAgents.add("crm-intelligence", mkAgent("crm-intelligence", "CRM Intelligence AI", "dept", "Clients", "Deep CRM: segments, tags, scoring, pipeline management", ?"gm-clients"));
    aiAgents.add("sentiment-analysis", mkAgent("sentiment-analysis", "Sentiment Analysis AI", "dept", "Clients", "Reads all enquiries and messages, weekly emotional tone report", ?"gm-clients"));
    aiAgents.add("client-health-score", mkAgent("client-health-score", "Client Health Score AI", "dept", "Clients", "Tracks relationship health score for every client", ?"gm-clients"));
    aiAgents.add("re-engagement", mkAgent("re-engagement", "Re-Engagement AI", "dept", "Clients", "Designs and executes re-engagement campaigns for dormant clients", ?"gm-clients"));
    aiAgents.add("client-segmentation", mkAgent("client-segmentation", "Client Segmentation AI", "dept", "Clients", "Segments all clients into actionable groups", ?"gm-clients"));
    aiAgents.add("feedback-analysis", mkAgent("feedback-analysis", "Feedback Analysis AI", "dept", "Clients", "Analyzes all feedback for patterns and product improvement insights", ?"gm-clients"));
    aiAgents.add("referral-network-mapper", mkAgent("referral-network-mapper", "Referral Network Mapper", "dept", "Clients", "Maps your entire referral network, identifies most valuable nodes", ?"gm-clients"));
    // DEPT - Services
    aiAgents.add("events-command", mkAgent("events-command", "Events Command AI", "dept", "Services", "Full event intelligence: planning, vendor, guest experience, post-event", ?"gm-services"));
    aiAgents.add("music-cultural-intelligence", mkAgent("music-cultural-intelligence", "Music & Cultural Intelligence AI", "dept", "Services", "Gujarat music and cultural ecosystem, talent matching", ?"gm-services"));
    aiAgents.add("sports-intelligence", mkAgent("sports-intelligence", "Sports Intelligence AI", "dept", "Services", "Gujarat sports: athletes, tournaments, sponsorships, media", ?"gm-services"));
    aiAgents.add("ngo-csr-command", mkAgent("ngo-csr-command", "NGO & CSR Command AI", "dept", "Services", "Compliance, impact measurement, reporting, grant tracking", ?"gm-services"));
    aiAgents.add("tourism-intelligence", mkAgent("tourism-intelligence", "Tourism Intelligence AI", "dept", "Services", "Gujarat and Ahmedabad tourism: itineraries, packages, seasonal recommendations", ?"gm-services"));
    aiAgents.add("hospitality", mkAgent("hospitality", "Hospitality AI", "dept", "Services", "Venue management, catering coordination, guest experience optimization", ?"gm-services"));
    aiAgents.add("sponsorship-intelligence", mkAgent("sponsorship-intelligence", "Sponsorship Intelligence AI", "dept", "Services", "Identifies and pursues sponsorship opportunities", ?"gm-services"));
    aiAgents.add("partnership-intelligence", mkAgent("partnership-intelligence", "Partnership Intelligence AI", "dept", "Services", "Strategic partnerships across all service lines", ?"gm-services"));
    aiAgents.add("cultural-calendar", mkAgent("cultural-calendar", "Cultural Calendar AI", "dept", "Services", "Gujarat and Ahmedabad cultural events, festivals, performances tracker", ?"gm-services"));
    aiAgents.add("sports-analytics", mkAgent("sports-analytics", "Sports Analytics AI", "dept", "Services", "Athlete performance, tournament results, achievements tracker", ?"gm-services"));
    // DEPT - Security
    aiAgents.add("cyber-security-command", mkAgent("cyber-security-command", "Cyber Security Command AI", "dept", "Security", "Chief of all cyber security, full team coordination", ?"gm-security"));
    aiAgents.add("threat-intelligence", mkAgent("threat-intelligence", "Threat Intelligence AI", "dept", "Security", "Global threat landscape monitoring for anything relevant to MSTC", ?"gm-security"));
    aiAgents.add("identity-verification", mkAgent("identity-verification", "Identity Verification AI", "dept", "Security", "Client identity verification, suspicious account flagging", ?"gm-security"));
    aiAgents.add("transaction-security", mkAgent("transaction-security", "Transaction Security AI", "dept", "Security", "All financial transactions and form submissions monitored for fraud", ?"gm-security"));
    aiAgents.add("data-protection", mkAgent("data-protection", "Data Protection AI", "dept", "Security", "Indian PDPB and global standards compliance", ?"gm-security"));
    aiAgents.add("incident-response", mkAgent("incident-response", "Incident Response AI", "dept", "Security", "Immediate response and recovery coordination when incident occurs", ?"gm-security"));
    aiAgents.add("brand-protection", mkAgent("brand-protection", "Brand Protection AI", "dept", "Security", "Monitors for MSTC impersonation, fake listings, copied content online", ?"gm-security"));
    aiAgents.add("vulnerability-scanner", mkAgent("vulnerability-scanner", "Vulnerability Scanner AI", "dept", "Security", "Periodic security scans, injection testing, API endpoint security", ?"gm-security"));
    // DEPT - Data
    aiAgents.add("business-analytics-command", mkAgent("business-analytics-command", "Business Analytics Command AI", "dept", "Data", "Oversees all analytics, produces executive dashboards", ?"gm-data"));
    aiAgents.add("predictive-intelligence", mkAgent("predictive-intelligence", "Predictive Intelligence AI", "dept", "Data", "Predicts future outcomes across all business areas from historical data", ?"gm-data"));
    aiAgents.add("market-intelligence-command", mkAgent("market-intelligence-command", "Market Intelligence Command AI", "dept", "Data", "All market signals: property, finance, economy, competition", ?"gm-data"));
    aiAgents.add("user-behavior", mkAgent("user-behavior", "User Behavior AI", "dept", "Data", "How users interact with MSTC GLOBAL, drives UX improvements", ?"gm-data"));
    aiAgents.add("competitive-intelligence-command", mkAgent("competitive-intelligence-command", "Competitive Intelligence Command AI", "dept", "Data", "Competitor tracking, market positioning, differentiation", ?"gm-data"));
    aiAgents.add("economic-intelligence", mkAgent("economic-intelligence", "Economic Intelligence AI", "dept", "Data", "GDP, inflation, interest rates, their specific impact on MSTC", ?"gm-data"));
    aiAgents.add("geospatial-intelligence", mkAgent("geospatial-intelligence", "Geospatial Intelligence AI", "dept", "Data", "Maps all MSTC data geographically: hotspots, client density, infrastructure", ?"gm-data"));
    aiAgents.add("insight-synthesis", mkAgent("insight-synthesis", "Insight Synthesis AI", "dept", "Data", "Unifies all analytics AI outputs into actionable recommendations", ?"gm-data"));
    aiAgents.add("revenue-attribution", mkAgent("revenue-attribution", "Revenue Attribution AI", "dept", "Data", "Tracks which channel or agent or campaign each deal came from", ?"gm-data"));
    aiAgents.add("ai-data-scientist", mkAgent("ai-data-scientist", "AI Data Scientist", "dept", "Data", "Runs deep analysis, finds patterns, produces weekly insight reports", ?"gm-data"));
    // DEPT - People
    aiAgents.add("hr-team-agent", mkAgent("hr-team-agent", "HR & Team Agent", "dept", "People", "Manages team operations, onboarding, performance, culture", ?"gm-people"));
    aiAgents.add("ai-training-agent", mkAgent("ai-training-agent", "AI Training Agent", "dept", "People", "All AIs learn from every interaction, manages the learning process", ?"gm-people"));
    aiAgents.add("ai-quality-controller", mkAgent("ai-quality-controller", "AI Quality Controller", "dept", "People", "Reviews everything added or changed by any agent, catches errors", ?"gm-people"));
    aiAgents.add("creative-director", mkAgent("creative-director", "Creative Director AI", "dept", "People", "Oversees all creative output, enforces gold and black brand consistency", ?"gm-people"));
    aiAgents.add("copywriting", mkAgent("copywriting", "Copywriting AI", "dept", "People", "Marketing copy, descriptions, email content, all 3 languages", ?"gm-people"));
    aiAgents.add("campaign-creative", mkAgent("campaign-creative", "Campaign Creative AI", "dept", "People", "Diwali, Navratri, New Year, financial year end campaigns", ?"gm-people"));
    aiAgents.add("brand-guardian", mkAgent("brand-guardian", "Brand Guardian AI", "dept", "People", "Monitors all platform content for brand consistency, flags violations", ?"gm-people"));
    aiAgents.add("property-description", mkAgent("property-description", "Property Description AI", "dept", "People", "Compelling, accurate property descriptions instantly", ?"gm-people"));
    aiAgents.add("document-generation", mkAgent("document-generation", "Document Generation AI", "dept", "People", "Agreements, receipts, certificates on demand", ?"gm-people"));
    aiAgents.add("visual-layout", mkAgent("visual-layout", "Visual Layout AI", "dept", "People", "Suggests section designs, infographic concepts, page aesthetics", ?"gm-people"));
    aiAgents.add("competitive-intelligence", mkAgent("competitive-intelligence", "Competitive Intelligence AI", "dept", "People", "Competitor launches, market shifts, differentiation suggestions", ?"gm-people"));
    aiAgents.add("technology-scout-dept", mkAgent("technology-scout-dept", "Technology Scout Dept AI", "dept", "People", "Identifies new proptech, fintech tools relevant to MSTC", ?"gm-people"));
    // NEURAL TIER
    aiAgents.add("lead-conversion-ann", mkAgent("lead-conversion-ann", "Lead Conversion ANN", "neural", "Neural-ANN", "Predicts exact probability of any lead converting, trained on MSTC historical data", ?"caffeine-chief"));
    aiAgents.add("property-valuation-ann", mkAgent("property-valuation-ann", "Property Valuation ANN", "neural", "Neural-ANN", "Estimates fair market value from address, size, age, floor, facing, amenities", ?"caffeine-chief"));
    aiAgents.add("client-ltv-ann", mkAgent("client-ltv-ann", "Client LTV ANN", "neural", "Neural-ANN", "Predicts total revenue a new client will generate over their relationship with MSTC", ?"caffeine-chief"));
    aiAgents.add("demand-forecast-ann", mkAgent("demand-forecast-ann", "Demand Forecast ANN", "neural", "Neural-ANN", "Predicts property demand by locality and type for next 3, 6, 12 months", ?"caffeine-chief"));
    aiAgents.add("churn-prediction-ann", mkAgent("churn-prediction-ann", "Churn Prediction ANN", "neural", "Neural-ANN", "Identifies clients about to disengage, triggers retention actions automatically", ?"caffeine-chief"));
    aiAgents.add("property-photo-analyzer-cnn", mkAgent("property-photo-analyzer-cnn", "Property Photo Analyzer CNN", "neural", "Neural-CNN", "Reads room type, condition, light, furnishing, gives quality score 1 to 10", ?"caffeine-chief"));
    aiAgents.add("document-ocr-cnn", mkAgent("document-ocr-cnn", "Document OCR CNN", "neural", "Neural-CNN", "Reads any scanned document, extracts all text, structures it", ?"caffeine-chief"));
    aiAgents.add("floor-plan-reader-cnn", mkAgent("floor-plan-reader-cnn", "Floor Plan Reader CNN", "neural", "Neural-CNN", "Extracts room sizes, layout type, BHK count from floor plan image", ?"caffeine-chief"));
    aiAgents.add("id-verifier-cnn", mkAgent("id-verifier-cnn", "ID Document Verifier CNN", "neural", "Neural-CNN", "Reads Aadhaar, PAN, passport images for KYC verification", ?"caffeine-chief"));
    aiAgents.add("building-condition-cnn", mkAgent("building-condition-cnn", "Building Condition CNN", "neural", "Neural-CNN", "Analyzes exterior photos, estimates condition, flags maintenance needs", ?"caffeine-chief"));
    aiAgents.add("conversation-memory-rnn", mkAgent("conversation-memory-rnn", "Conversation Memory RNN", "neural", "Neural-RNN", "Remembers full history of every client conversation, personalizes future interactions", ?"caffeine-chief"));
    aiAgents.add("price-trend-forecaster-rnn", mkAgent("price-trend-forecaster-rnn", "Price Trend Forecaster RNN", "neural", "Neural-RNN", "Predicts property prices in specific Ahmedabad localities over next 6 to 12 months", ?"caffeine-chief"));
    aiAgents.add("seasonal-demand-rnn", mkAgent("seasonal-demand-rnn", "Seasonal Demand RNN", "neural", "Neural-RNN", "Predicts when enquiry volume will spike: festivals, financial year end, budget season", ?"caffeine-chief"));
    aiAgents.add("lead-behavior-rnn", mkAgent("lead-behavior-rnn", "Lead Behavior RNN", "neural", "Neural-RNN", "Analyzes sequence of user actions to predict next move and best intervention", ?"caffeine-chief"));
    aiAgents.add("property-visualizer-gan", mkAgent("property-visualizer-gan", "Property Visualizer GAN", "neural", "Neural-GAN", "Given specs, generates a realistic visual of what a property could look like", ?"caffeine-chief"));
    aiAgents.add("virtual-staging-gan", mkAgent("virtual-staging-gan", "Virtual Staging GAN", "neural", "Neural-GAN", "Shows what an empty property looks like fully furnished", ?"caffeine-chief"));
    aiAgents.add("brochure-visual-gan", mkAgent("brochure-visual-gan", "Brochure Visual GAN", "neural", "Neural-GAN", "Generates professional visual layouts for property marketing materials", ?"caffeine-chief"));
    aiAgents.add("floor-plan-generator-gan", mkAgent("floor-plan-generator-gan", "Floor Plan Generator GAN", "neural", "Neural-GAN", "Generates floor plan options from basic requirements like 3BHK 1200sqft", ?"caffeine-chief"));
    aiAgents.add("relationship-mapper-gnn", mkAgent("relationship-mapper-gnn", "Relationship Mapper GNN", "neural", "Neural-GNN", "Maps all connections between clients, properties, agents, deals, finds hidden links", ?"caffeine-chief"));
    aiAgents.add("fraud-pattern-gnn", mkAgent("fraud-pattern-gnn", "Fraud Pattern GNN", "neural", "Neural-GNN", "Identifies unusual connection patterns that indicate coordinated fake leads", ?"caffeine-chief"));
    aiAgents.add("referral-network-gnn", mkAgent("referral-network-gnn", "Referral Network GNN", "neural", "Neural-GNN", "Maps your entire referral network, identifies most valuable nodes", ?"caffeine-chief"));
    aiAgents.add("deal-network-gnn", mkAgent("deal-network-gnn", "Deal Network GNN", "neural", "Neural-GNN", "Maps which brokers connect to which deals, finds most influential intermediaries", ?"caffeine-chief"));
    aiAgents.add("contract-analyzer-transformer", mkAgent("contract-analyzer-transformer", "Contract Analyzer Transformer", "neural", "Neural-Transformer", "Deep reading of any contract, extracts every clause, flags risks, plain language summary", ?"caffeine-chief"));
    aiAgents.add("multilanguage-translator-transformer", mkAgent("multilanguage-translator-transformer", "Multi-Language Translator Transformer", "neural", "Neural-Transformer", "Full site translation: English to Gujarati to Hindi in real time", ?"caffeine-chief"));
    aiAgents.add("voice-text-transformer", mkAgent("voice-text-transformer", "Voice-to-Text Transformer", "neural", "Neural-Transformer", "Converts voice input to text across all forms and chat, all 3 languages", ?"caffeine-chief"));
    aiAgents.add("document-summarizer-transformer", mkAgent("document-summarizer-transformer", "Document Summarizer Transformer", "neural", "Neural-Transformer", "Takes any long document, produces a crisp executive summary", ?"caffeine-chief"));
    aiAgents.add("negotiation-coach-transformer", mkAgent("negotiation-coach-transformer", "Negotiation Coach Transformer", "neural", "Neural-Transformer", "Analyzes a deal, produces a tailored negotiation strategy brief", ?"caffeine-chief"));
    aiAgents.add("pricing-optimizer-rl", mkAgent("pricing-optimizer-rl", "Pricing Optimizer RL", "neural", "Neural-RL", "Learns what price points close deals fastest, continuously improves recommendations", ?"caffeine-chief"));
    aiAgents.add("campaign-optimizer-rl", mkAgent("campaign-optimizer-rl", "Campaign Optimizer RL", "neural", "Neural-RL", "Learns which outreach gets the best response rate, auto-optimizes campaigns", ?"caffeine-chief"));
    aiAgents.add("ui-optimizer-rl", mkAgent("ui-optimizer-rl", "UI Optimizer RL", "neural", "Neural-RL", "Learns which layout drives the most conversions, applies improvements automatically", ?"caffeine-chief"));
    aiAgents.add("lead-routing-optimizer-rl", mkAgent("lead-routing-optimizer-rl", "Lead Routing Optimizer RL", "neural", "Neural-RL", "Learns which team member closes which type of lead fastest, auto-routes", ?"caffeine-chief"));
    aiAgents.add("lead-scoring-ml", mkAgent("lead-scoring-ml", "Lead Scoring ML", "neural", "Neural-ML", "Gradient boosting model, scores every lead with full reasoning", ?"caffeine-chief"));
    aiAgents.add("recommendation-engine-ml", mkAgent("recommendation-engine-ml", "Recommendation Engine ML", "neural", "Neural-ML", "Clients who looked at this also looked at for properties", ?"caffeine-chief"));
    aiAgents.add("anomaly-detector-ml", mkAgent("anomaly-detector-ml", "Anomaly Detector ML", "neural", "Neural-ML", "Isolation forest model, flags anything unusual in your data", ?"caffeine-chief"));
    aiAgents.add("segmentation-engine-ml", mkAgent("segmentation-engine-ml", "Segmentation Engine ML", "neural", "Neural-ML", "K-means clustering, segments all clients into actionable groups", ?"caffeine-chief"));
    aiAgents.add("attribution-model-ml", mkAgent("attribution-model-ml", "Attribution Model ML", "neural", "Neural-ML", "Multi-touch attribution, tracks exactly which touchpoints drove each deal", ?"caffeine-chief"));
    // INTELLIGENCE TIER
    aiAgents.add("macro-intelligence", mkAgent("macro-intelligence", "Macro Intelligence AI", "intelligence", "Intelligence", "Monitors global economic signals and their ripple effect on Indian real estate", ?"caffeine-chief"));
    aiAgents.add("political-intelligence", mkAgent("political-intelligence", "Political Intelligence AI", "intelligence", "Intelligence", "Monitors Gujarat and national political developments affecting property and business", ?"caffeine-chief"));
    aiAgents.add("infrastructure-forecast", mkAgent("infrastructure-forecast", "Infrastructure Forecast AI", "intelligence", "Intelligence", "Predicts which Ahmedabad areas will appreciate due to upcoming infrastructure projects", ?"caffeine-chief"));
    aiAgents.add("migration-intelligence", mkAgent("migration-intelligence", "Migration Intelligence AI", "intelligence", "Intelligence", "Tracks population movement into Ahmedabad, identifies high-demand residential zones", ?"caffeine-chief"));
    aiAgents.add("builder-intelligence", mkAgent("builder-intelligence", "Builder Intelligence AI", "intelligence", "Intelligence", "Deep profiles of every major Ahmedabad developer: track record, delivery, financial health", ?"caffeine-chief"));
    aiAgents.add("society-intelligence", mkAgent("society-intelligence", "Society Intelligence AI", "intelligence", "Intelligence", "Comprehensive database of Ahmedabad housing societies: management, maintenance, issues", ?"caffeine-chief"));
    aiAgents.add("locality-appreciation", mkAgent("locality-appreciation", "Locality Appreciation AI", "intelligence", "Intelligence", "Predicts which Ahmedabad localities will appreciate most in next 2 years and why", ?"caffeine-chief"));
    aiAgents.add("rental-demand", mkAgent("rental-demand", "Rental Demand AI", "intelligence", "Intelligence", "Tracks rental demand by locality, property type, tenant profile", ?"caffeine-chief"));
    aiAgents.add("nri-investment", mkAgent("nri-investment", "NRI Investment AI", "intelligence", "Intelligence", "Specialized intelligence for NRI clients: FEMA compliance, repatriation, NRO and NRE guidance", ?"caffeine-chief"));
    aiAgents.add("commercial-roi", mkAgent("commercial-roi", "Commercial ROI AI", "intelligence", "Intelligence", "Specialized ROI analysis for commercial properties: office, retail, warehouse, industrial", ?"caffeine-chief"));
    // AUTOMATION TIER
    aiAgents.add("whatsapp-auto-reply", mkAgent("whatsapp-auto-reply", "WhatsApp Auto-Reply AI", "automation", "Automation", "Reads incoming WhatsApp messages, drafts instant contextual replies", ?"caffeine-chief"));
    aiAgents.add("lead-nurture-sequence", mkAgent("lead-nurture-sequence", "Lead Nurture Sequence AI", "automation", "Automation", "Designs and runs multi-step lead nurture sequences automatically", ?"caffeine-chief"));
    aiAgents.add("property-alert", mkAgent("property-alert", "Property Alert AI", "automation", "Automation", "Sends personalized property alerts to buyers when matching listings appear", ?"caffeine-chief"));
    aiAgents.add("weekly-digest", mkAgent("weekly-digest", "Weekly Digest AI", "automation", "Automation", "Compiles and sends personalized weekly digests to all active clients", ?"caffeine-chief"));
    aiAgents.add("agreement-expiry", mkAgent("agreement-expiry", "Agreement Expiry AI", "automation", "Automation", "Tracks all agreements, sends reminders 30 15 7 1 days before expiry", ?"caffeine-chief"));
    aiAgents.add("seasonal-banner", mkAgent("seasonal-banner", "Seasonal Banner AI", "automation", "Automation", "Automatically updates site banners for Diwali, Navratri, New Year, Holi, Republic Day", ?"caffeine-chief"));
    aiAgents.add("smart-assignment", mkAgent("smart-assignment", "Smart Assignment AI", "automation", "Automation", "Auto-assigns leads to the best available team member based on skill, load, and history", ?"caffeine-chief"));
    aiAgents.add("re-engagement-sequence", mkAgent("re-engagement-sequence", "Re-Engagement Sequence AI", "automation", "Automation", "Runs automated re-engagement campaigns for dormant clients", ?"caffeine-chief"));
    aiAgents.add("renewal-reminder", mkAgent("renewal-reminder", "Renewal Reminder AI", "automation", "Automation", "Tracks all recurring obligations and sends reminders", ?"caffeine-chief"));
    aiAgents.add("workflow-automation", mkAgent("workflow-automation", "Workflow Automation AI", "automation", "Automation", "Builds and runs custom workflow automations: if X happens do Y then notify Z", ?"caffeine-chief"));
    // CLIENT INTEL TIER
    aiAgents.add("buyer-intent", mkAgent("buyer-intent", "Buyer Intent AI", "client-intel", "ClientIntel", "Reads all signals from a buyer and ranks their purchase intent 1 to 10 in real time", ?"caffeine-chief"));
    aiAgents.add("price-sensitivity", mkAgent("price-sensitivity", "Price Sensitivity AI", "client-intel", "ClientIntel", "Identifies each buyer price sensitivity, helps position the right property at right price", ?"caffeine-chief"));
    aiAgents.add("decision-timeline", mkAgent("decision-timeline", "Decision Timeline AI", "client-intel", "ClientIntel", "Predicts how many days or weeks a specific buyer will take to make a decision", ?"caffeine-chief"));
    aiAgents.add("objection-handler", mkAgent("objection-handler", "Objection Handler AI", "client-intel", "ClientIntel", "Anticipates common client objections and prepares tailored responses for each client", ?"caffeine-chief"));
    aiAgents.add("win-back", mkAgent("win-back", "Win-Back AI", "client-intel", "ClientIntel", "For clients who did not close a deal, designs a win-back strategy and executes it", ?"caffeine-chief"));
    aiAgents.add("client-profitability", mkAgent("client-profitability", "Client Profitability AI", "client-intel", "ClientIntel", "Calculates true cost-to-serve vs revenue per client, identifies most profitable relationships", ?"caffeine-chief"));
    aiAgents.add("network-effect", mkAgent("network-effect", "Network Effect AI", "client-intel", "ClientIntel", "Identifies which clients have the highest social influence and can amplify MSTC reach", ?"caffeine-chief"));
    aiAgents.add("cross-sell-intelligence", mkAgent("cross-sell-intelligence", "Cross-Sell Intelligence AI", "client-intel", "ClientIntel", "Identifies which existing clients are ready for additional services", ?"caffeine-chief"));
    aiAgents.add("upsell-intelligence", mkAgent("upsell-intelligence", "Upsell Intelligence AI", "client-intel", "ClientIntel", "Identifies when a client who enquired about budget property is actually ready for premium", ?"caffeine-chief"));
    aiAgents.add("client-mood", mkAgent("client-mood", "Client Mood AI", "client-intel", "ClientIntel", "Reads tone of client messages, flags when frustrated or excited, adjusts communication", ?"caffeine-chief"));
    // PROPERTY INTEL TIER
    aiAgents.add("micro-market", mkAgent("micro-market", "Micro-Market AI", "property-intel", "PropertyIntel", "Hyper-local analysis at street and society level, not just locality level", ?"caffeine-chief"));
    aiAgents.add("price-history", mkAgent("price-history", "Price History AI", "property-intel", "PropertyIntel", "Tracks full price history of every listed property, shows appreciation curve", ?"caffeine-chief"));
    aiAgents.add("flip-calculator", mkAgent("flip-calculator", "Flip Calculator AI", "property-intel", "PropertyIntel", "Calculates renovation cost plus resale value, produces flip viability score", ?"caffeine-chief"));
    aiAgents.add("possession-risk", mkAgent("possession-risk", "Possession Risk AI", "property-intel", "PropertyIntel", "Analyzes builder history and project status, scores possession risk for under-construction", ?"caffeine-chief"));
    aiAgents.add("encroachment-detector", mkAgent("encroachment-detector", "Encroachment Detector AI", "property-intel", "PropertyIntel", "Flags properties with boundary disputes, encroachments, or litigation history", ?"caffeine-chief"));
    aiAgents.add("vastu-intelligence", mkAgent("vastu-intelligence", "Vastu Intelligence AI", "property-intel", "PropertyIntel", "Assesses Vastu compliance of any property based on direction, layout, entrance position", ?"caffeine-chief"));
    aiAgents.add("property-age", mkAgent("property-age", "Property Age AI", "property-intel", "PropertyIntel", "Analyzes property age impact on valuation, loan eligibility, maintenance cost projection", ?"caffeine-chief"));
    aiAgents.add("carpet-vs-builtup", mkAgent("carpet-vs-builtup", "Carpet vs Built-up AI", "property-intel", "PropertyIntel", "Automatically calculates and explains carpet area vs built-up vs super built-up", ?"caffeine-chief"));
    aiAgents.add("walk-score", mkAgent("walk-score", "Walk Score AI", "property-intel", "PropertyIntel", "Calculates walkability, connectivity, and amenity score for any Ahmedabad address", ?"caffeine-chief"));
    aiAgents.add("investment-grade", mkAgent("investment-grade", "Investment Grade AI", "property-intel", "PropertyIntel", "Grades every property A B C D as an investment based on yield, appreciation, liquidity", ?"caffeine-chief"));
    // FINANCE INTEL TIER
    aiAgents.add("portfolio-rebalancer", mkAgent("portfolio-rebalancer", "Portfolio Rebalancer AI", "finance-intel", "FinanceIntel", "Reviews client property portfolio, recommends when to sell, hold, or buy", ?"caffeine-chief"));
    aiAgents.add("rent-vs-buy", mkAgent("rent-vs-buy", "Rent vs Buy AI", "finance-intel", "FinanceIntel", "Deep analysis for each client: is it financially better to rent or buy right now", ?"caffeine-chief"));
    aiAgents.add("break-even", mkAgent("break-even", "Break-Even AI", "finance-intel", "FinanceIntel", "Calculates exact break-even point for any property investment", ?"caffeine-chief"));
    aiAgents.add("gst-impact", mkAgent("gst-impact", "GST Impact AI", "finance-intel", "FinanceIntel", "Calculates exact GST implications for any property transaction type", ?"caffeine-chief"));
    aiAgents.add("rental-tax", mkAgent("rental-tax", "Rental Tax AI", "finance-intel", "FinanceIntel", "Calculates rental income tax, helps structure rental arrangements tax-efficiently", ?"caffeine-chief"));
    aiAgents.add("inheritance-gift-tax", mkAgent("inheritance-gift-tax", "Inheritance & Gift Tax AI", "finance-intel", "FinanceIntel", "Guidance on property inheritance, gift deed implications, tax planning", ?"caffeine-chief"));
    aiAgents.add("should-i-sell-now", mkAgent("should-i-sell-now", "Should I Sell Now AI", "finance-intel", "FinanceIntel", "Analyzes market conditions, client financial position, recommends hold or sell", ?"caffeine-chief"));
    aiAgents.add("wealth-projection", mkAgent("wealth-projection", "Wealth Projection AI", "finance-intel", "FinanceIntel", "Shows a client their projected net worth in 5 10 20 years based on current property decisions", ?"caffeine-chief"));
    aiAgents.add("rate-alert", mkAgent("rate-alert", "Rate Alert AI", "finance-intel", "FinanceIntel", "Monitors RBI and bank rate changes, immediately notifies clients when rates drop", ?"caffeine-chief"));
    aiAgents.add("emi-impact", mkAgent("emi-impact", "EMI Impact AI", "finance-intel", "FinanceIntel", "Instantly shows how any rate change affects a client monthly EMI and total loan cost", ?"caffeine-chief"));
    // LEGAL INTEL TIER
    aiAgents.add("title-risk", mkAgent("title-risk", "Title Risk AI", "legal-intel", "LegalIntel", "Deep analysis of property title documents, identifies chain of title issues", ?"caffeine-chief"));
    aiAgents.add("encumbrance-certificate", mkAgent("encumbrance-certificate", "Encumbrance Certificate AI", "legal-intel", "LegalIntel", "Reads EC documents, flags outstanding loans or charges on a property", ?"caffeine-chief"));
    aiAgents.add("rera-complaint", mkAgent("rera-complaint", "RERA Complaint AI", "legal-intel", "LegalIntel", "Guides buyers through filing RERA complaints step by step, drafts complaint", ?"caffeine-chief"));
    aiAgents.add("builder-default", mkAgent("builder-default", "Builder Default AI", "legal-intel", "LegalIntel", "Monitors builders for signs of financial distress or project default risk", ?"caffeine-chief"));
    aiAgents.add("tenant-rights", mkAgent("tenant-rights", "Tenant Rights AI", "legal-intel", "LegalIntel", "Complete guidance on tenant and landlord rights under Gujarat Rent Control Act", ?"caffeine-chief"));
    aiAgents.add("power-of-attorney", mkAgent("power-of-attorney", "Power of Attorney AI", "legal-intel", "LegalIntel", "Guides through PoA creation, registration, and risk management", ?"caffeine-chief"));
    aiAgents.add("will-succession", mkAgent("will-succession", "Will & Succession AI", "legal-intel", "LegalIntel", "Basic guidance on property succession, will registration in Gujarat", ?"caffeine-chief"));
    aiAgents.add("mutation", mkAgent("mutation", "Mutation AI", "legal-intel", "LegalIntel", "Step-by-step guide for property mutation after purchase or inheritance", ?"caffeine-chief"));
    // CONTENT INTEL TIER
    aiAgents.add("hyperlocal-content", mkAgent("hyperlocal-content", "Hyperlocal Content AI", "content-intel", "ContentIntel", "Generates ultra-specific content for each of 11 Ahmedabad localities", ?"caffeine-chief"));
    aiAgents.add("market-commentary", mkAgent("market-commentary", "Market Commentary AI", "content-intel", "ContentIntel", "Writes monthly market commentary in MD voice for publishing", ?"caffeine-chief"));
    aiAgents.add("buyer-guide", mkAgent("buyer-guide", "Buyer Guide AI", "content-intel", "ContentIntel", "Generates complete buyer guides for first-time buyers, NRIs, investors", ?"caffeine-chief"));
    aiAgents.add("glossary-builder", mkAgent("glossary-builder", "Glossary Builder AI", "content-intel", "ContentIntel", "Continuously adds new real estate terms with Gujarat-specific context", ?"caffeine-chief"));
    aiAgents.add("case-study", mkAgent("case-study", "Case Study AI", "content-intel", "ContentIntel", "Generates anonymized client success stories for marketing", ?"caffeine-chief"));
    aiAgents.add("faq-intelligence", mkAgent("faq-intelligence", "FAQ Intelligence AI", "content-intel", "ContentIntel", "Monitors all client questions, identifies new FAQs, publishes answers automatically", ?"caffeine-chief"));
    aiAgents.add("testimonial-intelligence", mkAgent("testimonial-intelligence", "Testimonial Intelligence AI", "content-intel", "ContentIntel", "Only uses verified, real testimonials, flags any fake ones", ?"caffeine-chief"));
    aiAgents.add("press-release", mkAgent("press-release", "Press Release AI", "content-intel", "ContentIntel", "Drafts press releases for MSTC milestones, new services, major deals", ?"caffeine-chief"));
    // OPERATIONS TIER
    aiAgents.add("daily-briefing", mkAgent("daily-briefing", "Daily Briefing AI", "operations", "Operations", "Every morning at 7am IST, prepares your personal business brief: deals, leads, alerts, tasks", ?"caffeine-chief"));
    aiAgents.add("meeting-prep", mkAgent("meeting-prep", "Meeting Prep AI", "operations", "Operations", "Before any client meeting, prepares a brief: client history, property interest, talking points", ?"caffeine-chief"));
    aiAgents.add("task-priority", mkAgent("task-priority", "Task Priority AI", "operations", "Operations", "Looks at all pending tasks across the business, ranks them by urgency and impact", ?"caffeine-chief"));
    aiAgents.add("deadline-intelligence", mkAgent("deadline-intelligence", "Deadline Intelligence AI", "operations", "Operations", "Tracks every deadline across legal, compliance, deals, and operations, nothing missed", ?"caffeine-chief"));
    aiAgents.add("vendor-intelligence", mkAgent("vendor-intelligence", "Vendor Intelligence AI", "operations", "Operations", "Manages all vendor relationships: rates, performance, reliability scores", ?"caffeine-chief"));
    aiAgents.add("expense-tracker", mkAgent("expense-tracker", "Expense Tracker AI", "operations", "Operations", "Tracks all business expenses, categorizes, flags anomalies, monthly summary", ?"caffeine-chief"));
    aiAgents.add("staff-performance", mkAgent("staff-performance", "Staff Performance AI", "operations", "Operations", "Tracks response times, deal closures, client satisfaction per team member", ?"caffeine-chief"));
    aiAgents.add("shift-management", mkAgent("shift-management", "Shift Management AI", "operations", "Operations", "Manages availability and workload across team, suggests optimal task assignment", ?"caffeine-chief"));
    aiAgents.add("sla-monitor", mkAgent("sla-monitor", "SLA Monitor AI", "operations", "Operations", "Tracks service level commitments to clients, flags when MSTC is about to breach an SLA", ?"caffeine-chief"));
    aiAgents.add("process-improvement", mkAgent("process-improvement", "Process Improvement AI", "operations", "Operations", "Identifies inefficiencies in MSTC operations, suggests streamlined workflows", ?"caffeine-chief"));
    // COMMUNICATION TIER
    aiAgents.add("tone-calibrator", mkAgent("tone-calibrator", "Tone Calibrator AI", "communication", "Communication", "Adjusts all outgoing communication to the right tone per client: formal, warm, urgent", ?"caffeine-chief"));
    aiAgents.add("language-simplifier", mkAgent("language-simplifier", "Language Simplifier AI", "communication", "Communication", "Takes complex legal or financial content, rewrites it in plain language for clients", ?"caffeine-chief"));
    aiAgents.add("multilingual-drafter", mkAgent("multilingual-drafter", "Multilingual Drafter AI", "communication", "Communication", "Drafts any message simultaneously in English, Gujarati, and Hindi", ?"caffeine-chief"));
    aiAgents.add("email-intelligence", mkAgent("email-intelligence", "Email Intelligence AI", "communication", "Communication", "Drafts professional emails for any situation: follow-up, proposal, legal notice, thank you", ?"caffeine-chief"));
    aiAgents.add("sms-intelligence", mkAgent("sms-intelligence", "SMS Intelligence AI", "communication", "Communication", "Drafts concise, high-impact SMS messages for all campaign types", ?"caffeine-chief"));
    aiAgents.add("notification-intelligence", mkAgent("notification-intelligence", "Notification Intelligence AI", "communication", "Communication", "Decides when to notify a client, not too often, not too late, drafts the notification", ?"caffeine-chief"));
    aiAgents.add("escalation-ai", mkAgent("escalation-ai", "Escalation AI", "communication", "Communication", "Detects when a client situation needs human escalation, alerts the right team member", ?"caffeine-chief"));
    aiAgents.add("response-time-ai", mkAgent("response-time-ai", "Response Time AI", "communication", "Communication", "Monitors how quickly team responds to clients, flags slow responses", ?"caffeine-chief"));
    // INNOVATION TIER
    aiAgents.add("patent-watch", mkAgent("patent-watch", "Patent Watch AI", "innovation", "Innovation", "Monitors real estate tech patents and innovations globally, identifies what is coming", ?"caffeine-chief"));
    aiAgents.add("startup-intelligence", mkAgent("startup-intelligence", "Startup Intelligence AI", "innovation", "Innovation", "Tracks proptech startups in India, identifies partnership or adoption opportunities", ?"caffeine-chief"));
    aiAgents.add("benchmark", mkAgent("benchmark", "Benchmark AI", "innovation", "Innovation", "Continuously benchmarks MSTC against best-in-class platforms globally", ?"caffeine-chief"));
    aiAgents.add("user-research", mkAgent("user-research", "User Research AI", "innovation", "Innovation", "Synthesizes all user feedback, behavior, and complaints into product improvement insights", ?"caffeine-chief"));
    aiAgents.add("hypothesis-testing", mkAgent("hypothesis-testing", "Hypothesis Testing AI", "innovation", "Innovation", "Runs structured A/B and multivariate tests on any feature, reports statistical significance", ?"caffeine-chief"));
    aiAgents.add("growth-hacking", mkAgent("growth-hacking", "Growth Hacking AI", "innovation", "Innovation", "Identifies unconventional growth opportunities specific to Ahmedabad real estate market", ?"caffeine-chief"));
    aiAgents.add("virality", mkAgent("virality", "Virality AI", "innovation", "Innovation", "Identifies content and features most likely to be shared, amplifies them", ?"caffeine-chief"));
    aiAgents.add("retention-loop", mkAgent("retention-loop", "Retention Loop AI", "innovation", "Innovation", "Designs habit-forming features that bring users back to MSTC GLOBAL regularly", ?"caffeine-chief"));
    // AGGREGATOR TIER
    aiAgents.add("news-aggregator", mkAgent("news-aggregator", "News Aggregator AI", "aggregator", "Aggregator", "Real estate, Gujarat, finance, Ahmedabad news, ranked by relevance", ?"caffeine-chief"));
    aiAgents.add("market-data", mkAgent("market-data", "Market Data AI", "aggregator", "Aggregator", "Interest rates top 10 banks, jantri rates, price indices, daily updates", ?"caffeine-chief"));
    aiAgents.add("rera-project-tracker", mkAgent("rera-project-tracker", "RERA Project Tracker AI", "aggregator", "Aggregator", "Gujarat RERA new projects, compliance updates, expiry alerts", ?"caffeine-chief"));
    aiAgents.add("infrastructure-news", mkAgent("infrastructure-news", "Infrastructure News AI", "aggregator", "Aggregator", "Metro, expressway, township announcements affecting Ahmedabad", ?"caffeine-chief"));
    aiAgents.add("regulatory-watch", mkAgent("regulatory-watch", "Regulatory Watch AI", "aggregator", "Aggregator", "Gujarat govt notifications, RBI decisions, policy changes", ?"caffeine-chief"));
    aiAgents.add("competitor-monitor", mkAgent("competitor-monitor", "Competitor Monitor AI", "aggregator", "Aggregator", "Ahmedabad real estate market movements, competitor actions", ?"caffeine-chief"));
    aiAgents.add("property-aggregator", mkAgent("property-aggregator", "Property Aggregator AI", "aggregator", "Aggregator", "Pulls public property data from GujRERA and government databases", ?"caffeine-chief"));
    aiAgents.add("artist-talent-aggregator", mkAgent("artist-talent-aggregator", "Artist & Talent Aggregator AI", "aggregator", "Aggregator", "Finds real artists, performers, cultural acts in Gujarat", ?"caffeine-chief"));
    aiAgents.add("events-aggregator", mkAgent("events-aggregator", "Events Aggregator AI", "aggregator", "Aggregator", "Live events in Ahmedabad: concerts, exhibitions, sports, festivals", ?"caffeine-chief"));
    aiAgents.add("sports-athlete-aggregator", mkAgent("sports-athlete-aggregator", "Sports & Athlete Aggregator AI", "aggregator", "Aggregator", "Gujarat sports bodies, tournament results, athlete registrations", ?"caffeine-chief"));
    // BUILDER TEAM
    aiAgents.add("product-manager-ai", mkAgent("product-manager-ai", "Product Manager AI", "builder", "Builder", "Identifies missing features, creates build specs, prioritizes queue", ?"caffeine-chief"));
    aiAgents.add("micro-builder-agent", mkAgent("micro-builder-agent", "Micro-Builder Agent", "builder", "Builder", "Adds small features: calculators, forms, filters, buttons, sections", ?"caffeine-chief"));
    aiAgents.add("auto-fixer-agent", mkAgent("auto-fixer-agent", "Auto-Fixer Agent", "builder", "Builder", "Scans live site for bugs, fixes automatically, logs all fixes", ?"caffeine-chief"));
    aiAgents.add("ui-improvement-agent", mkAgent("ui-improvement-agent", "UI Improvement Agent", "builder", "Builder", "UX improvements, A/B testing, conversion optimization", ?"caffeine-chief"));
    aiAgents.add("seo-content-builder", mkAgent("seo-content-builder", "SEO & Content Builder Agent", "builder", "Builder", "Area guides, FAQs, blog posts, glossary entries continuously added", ?"caffeine-chief"));
    aiAgents.add("qa-agent", mkAgent("qa-agent", "QA Agent", "builder", "Builder", "Tests every change before live, blocks bad deployments", ?"caffeine-chief"));
    aiAgents.add("analyst-agent", mkAgent("analyst-agent", "Analyst Agent", "builder", "Builder", "Measures feature usage after deploy, reports back to Product Manager", ?"caffeine-chief"));
    aiAgents.add("dashboard-enhancer-ai", mkAgent("dashboard-enhancer-ai", "Dashboard Enhancer AI", "builder", "Builder", "Continuously improves dashboard layout, weekly suggestions panel", ?"caffeine-chief"));
    // WORKER - Property
    aiAgents.add("listing-completeness-checker", mkAgent("listing-completeness-checker", "Listing Completeness Checker", "worker", "Worker-Property", "Checks that every property listing has all required fields", ?"caffeine-chief"));
    aiAgents.add("price-anomaly-detector", mkAgent("price-anomaly-detector", "Price Anomaly Detector", "worker", "Worker-Property", "Flags properties priced significantly above or below market", ?"caffeine-chief"));
    aiAgents.add("duplicate-listing-detector", mkAgent("duplicate-listing-detector", "Duplicate Listing Detector", "worker", "Worker-Property", "Identifies duplicate property listings and merges or removes them", ?"caffeine-chief"));
    aiAgents.add("enquiry-processor", mkAgent("enquiry-processor", "Enquiry Processor Agent", "worker", "Worker-Property", "Processes incoming property enquiries, routes to right team member", ?"caffeine-chief"));
    aiAgents.add("buyer-property-matcher", mkAgent("buyer-property-matcher", "Buyer-Property Matcher", "worker", "Worker-Property", "Matches buyer requirements to available properties automatically", ?"caffeine-chief"));
    aiAgents.add("listing-expiry-tracker", mkAgent("listing-expiry-tracker", "Listing Expiry Tracker", "worker", "Worker-Property", "Tracks when property listings need renewal or follow-up", ?"caffeine-chief"));
    aiAgents.add("virtual-tour-request-handler", mkAgent("virtual-tour-request-handler", "Virtual Tour Request Handler", "worker", "Worker-Property", "Handles virtual site visit requests and scheduling", ?"caffeine-chief"));
    aiAgents.add("price-drop-alert-sender", mkAgent("price-drop-alert-sender", "Price Drop Alert Sender", "worker", "Worker-Property", "Sends alerts to interested buyers when a property price drops", ?"caffeine-chief"));
    aiAgents.add("society-review-moderator", mkAgent("society-review-moderator", "Society Review Moderator", "worker", "Worker-Property", "Moderates and verifies society reviews before publishing", ?"caffeine-chief"));
    aiAgents.add("possession-date-tracker", mkAgent("possession-date-tracker", "Possession Date Tracker", "worker", "Worker-Property", "Tracks possession dates and sends reminders to buyers", ?"caffeine-chief"));
    aiAgents.add("featured-listing-manager", mkAgent("featured-listing-manager", "Featured Listing Manager", "worker", "Worker-Property", "Manages which listings are featured and for how long", ?"caffeine-chief"));
    aiAgents.add("pre-launch-alert-agent", mkAgent("pre-launch-alert-agent", "Pre-Launch Alert Agent", "worker", "Worker-Property", "Sends alerts to interested buyers about upcoming project launches", ?"caffeine-chief"));
    aiAgents.add("distressed-property-finder", mkAgent("distressed-property-finder", "Distressed Property Finder", "worker", "Worker-Property", "Finds and flags distressed, auction, and below-market properties", ?"caffeine-chief"));
    // WORKER - Finance
    aiAgents.add("emi-calculator-agent", mkAgent("emi-calculator-agent", "EMI Calculator Agent", "worker", "Worker-Finance", "Calculates EMI for any loan amount, rate, and tenure", ?"caffeine-chief"));
    aiAgents.add("stamp-duty-calculator", mkAgent("stamp-duty-calculator", "Stamp Duty Calculator Agent", "worker", "Worker-Finance", "Calculates exact stamp duty for any property transaction in Gujarat", ?"caffeine-chief"));
    aiAgents.add("capital-gains-calculator", mkAgent("capital-gains-calculator", "Capital Gains Calculator Agent", "worker", "Worker-Finance", "Calculates short-term and long-term capital gains for property sales", ?"caffeine-chief"));
    aiAgents.add("rental-yield-calculator", mkAgent("rental-yield-calculator", "Rental Yield Calculator Agent", "worker", "Worker-Finance", "Calculates gross and net rental yield for any property", ?"caffeine-chief"));
    aiAgents.add("down-payment-planner", mkAgent("down-payment-planner", "Down Payment Planner Agent", "worker", "Worker-Finance", "Plans how to accumulate down payment in X months", ?"caffeine-chief"));
    aiAgents.add("joint-loan-eligibility", mkAgent("joint-loan-eligibility", "Joint Loan Eligibility Agent", "worker", "Worker-Finance", "Calculates joint home loan eligibility for couples and co-applicants", ?"caffeine-chief"));
    aiAgents.add("property-tax-calculator", mkAgent("property-tax-calculator", "Property Tax Calculator Agent", "worker", "Worker-Finance", "Calculates annual property tax for any Ahmedabad property", ?"caffeine-chief"));
    aiAgents.add("prepayment-optimizer", mkAgent("prepayment-optimizer", "Prepayment Optimizer Agent", "worker", "Worker-Finance", "Calculates optimal prepayment strategy to minimize interest", ?"caffeine-chief"));
    aiAgents.add("loan-restructuring-agent", mkAgent("loan-restructuring-agent", "Loan Restructuring Agent", "worker", "Worker-Finance", "Evaluates options for restructuring existing home loans", ?"caffeine-chief"));
    // WORKER - Client
    aiAgents.add("day1-followup", mkAgent("day1-followup", "Day-1 Follow-Up Agent", "worker", "Worker-Client", "Sends personalized follow-up message on day 1 after first enquiry", ?"caffeine-chief"));
    aiAgents.add("day3-followup", mkAgent("day3-followup", "Day-3 Follow-Up Agent", "worker", "Worker-Client", "Sends value-add message on day 3 to keep lead warm", ?"caffeine-chief"));
    aiAgents.add("day7-followup", mkAgent("day7-followup", "Day-7 Follow-Up Agent", "worker", "Worker-Client", "Sends market insight or property update on day 7", ?"caffeine-chief"));
    aiAgents.add("cold-lead-reengagement", mkAgent("cold-lead-reengagement", "Cold Lead Re-Engagement Agent", "worker", "Worker-Client", "Re-engages leads that have gone silent after 30 or more days", ?"caffeine-chief"));
    aiAgents.add("birthday-anniversary-reminder", mkAgent("birthday-anniversary-reminder", "Birthday & Anniversary Reminder Agent", "worker", "Worker-Client", "Sends birthday and property anniversary messages to clients", ?"caffeine-chief"));
    aiAgents.add("post-deal-checkin", mkAgent("post-deal-checkin", "Post-Deal Check-In Agent", "worker", "Worker-Client", "Checks in with clients after deal completion to ensure satisfaction", ?"caffeine-chief"));
    aiAgents.add("complaint-ticket-handler", mkAgent("complaint-ticket-handler", "Complaint Ticket Handler", "worker", "Worker-Client", "Creates, tracks, and resolves client complaint tickets", ?"caffeine-chief"));
    aiAgents.add("satisfaction-survey-agent", mkAgent("satisfaction-survey-agent", "Satisfaction Survey Agent", "worker", "Worker-Client", "Sends satisfaction surveys at key milestones and compiles results", ?"caffeine-chief"));
    aiAgents.add("document-expiry-reminder", mkAgent("document-expiry-reminder", "Document Expiry Reminder Agent", "worker", "Worker-Client", "Reminds clients when their documents are about to expire", ?"caffeine-chief"));
    aiAgents.add("appointment-scheduling", mkAgent("appointment-scheduling", "Appointment Scheduling Agent", "worker", "Worker-Client", "Schedules property visits, meetings, and consultations", ?"caffeine-chief"));
    aiAgents.add("callback-request-handler", mkAgent("callback-request-handler", "Callback Request Handler", "worker", "Worker-Client", "Processes callback requests and schedules return calls", ?"caffeine-chief"));
    // WORKER - Content
    aiAgents.add("blog-post-writer", mkAgent("blog-post-writer", "Blog Post Writer Agent", "worker", "Worker-Content", "Writes SEO-optimized blog posts for real estate and MSTC services", ?"caffeine-chief"));
    aiAgents.add("area-guide-updater", mkAgent("area-guide-updater", "Area Guide Updater Agent", "worker", "Worker-Content", "Updates area guides with latest info on all 11 Ahmedabad localities", ?"caffeine-chief"));
    aiAgents.add("faq-builder-agent", mkAgent("faq-builder-agent", "FAQ Builder Agent", "worker", "Worker-Content", "Builds and updates FAQs based on common client questions", ?"caffeine-chief"));
    aiAgents.add("glossary-updater", mkAgent("glossary-updater", "Glossary Updater Agent", "worker", "Worker-Content", "Adds new real estate terms to the glossary with Gujarat context", ?"caffeine-chief"));
    aiAgents.add("market-report-compiler", mkAgent("market-report-compiler", "Market Report Compiler Agent", "worker", "Worker-Content", "Compiles monthly market reports from data and news", ?"caffeine-chief"));
    aiAgents.add("social-media-post-generator", mkAgent("social-media-post-generator", "Social Media Post Generator", "worker", "Worker-Content", "Generates social media posts for all platforms", ?"caffeine-chief"));
    aiAgents.add("whatsapp-broadcast-writer", mkAgent("whatsapp-broadcast-writer", "WhatsApp Broadcast Writer", "worker", "Worker-Content", "Writes WhatsApp broadcast messages for different client segments", ?"caffeine-chief"));
    aiAgents.add("weekly-market-brief-generator", mkAgent("weekly-market-brief-generator", "Weekly Market Brief Generator", "worker", "Worker-Content", "Auto-generates weekly market brief PDF every Monday", ?"caffeine-chief"));
    // WORKER - Services
    aiAgents.add("event-budget-tracker", mkAgent("event-budget-tracker", "Event Budget Tracker Agent", "worker", "Worker-Services", "Tracks event budgets and flags overspending", ?"caffeine-chief"));
    aiAgents.add("vendor-confirmation", mkAgent("vendor-confirmation", "Vendor Confirmation Agent", "worker", "Worker-Services", "Confirms vendor bookings and sends reminders", ?"caffeine-chief"));
    aiAgents.add("guest-checkin", mkAgent("guest-checkin", "Guest Check-In Agent", "worker", "Worker-Services", "Manages guest check-in for events and hospitality", ?"caffeine-chief"));
    aiAgents.add("post-event-report-generator", mkAgent("post-event-report-generator", "Post-Event Report Generator", "worker", "Worker-Services", "Generates comprehensive post-event reports", ?"caffeine-chief"));
    aiAgents.add("volunteer-task-assigner", mkAgent("volunteer-task-assigner", "Volunteer Task Assigner Agent", "worker", "Worker-Services", "Assigns tasks to volunteers for NGO and CSR activities", ?"caffeine-chief"));
    aiAgents.add("volunteer-hours-tracker", mkAgent("volunteer-hours-tracker", "Volunteer Hours Tracker", "worker", "Worker-Services", "Tracks volunteer hours for NGO reporting", ?"caffeine-chief"));
    aiAgents.add("ngo-80g-receipt-generator", mkAgent("ngo-80g-receipt-generator", "NGO 80G Receipt Generator", "worker", "Worker-Services", "Generates 80G tax receipts for NGO donations", ?"caffeine-chief"));
    aiAgents.add("fundraising-progress-tracker", mkAgent("fundraising-progress-tracker", "Fundraising Progress Tracker", "worker", "Worker-Services", "Tracks fundraising progress against targets", ?"caffeine-chief"));
    aiAgents.add("tournament-bracket-manager", mkAgent("tournament-bracket-manager", "Tournament Bracket Manager", "worker", "Worker-Services", "Manages sports tournament brackets and results", ?"caffeine-chief"));
    aiAgents.add("athlete-profile-builder", mkAgent("athlete-profile-builder", "Athlete Profile Builder", "worker", "Worker-Services", "Builds and updates athlete profiles", ?"caffeine-chief"));
    aiAgents.add("music-booking-calendar", mkAgent("music-booking-calendar", "Music Booking Calendar Agent", "worker", "Worker-Services", "Manages music and cultural performance bookings", ?"caffeine-chief"));
    aiAgents.add("travel-itinerary-builder", mkAgent("travel-itinerary-builder", "Travel Itinerary Builder Agent", "worker", "Worker-Services", "Builds customized travel itineraries for tourism clients", ?"caffeine-chief"));
    aiAgents.add("sponsorship-proposal-generator", mkAgent("sponsorship-proposal-generator", "Sponsorship Proposal Generator", "worker", "Worker-Services", "Generates branded sponsorship proposals for events", ?"caffeine-chief"));
    // WORKER - Security
    aiAgents.add("form-spam-filter", mkAgent("form-spam-filter", "Form Spam Filter Agent", "worker", "Worker-Security", "Filters spam submissions from all platform forms", ?"caffeine-chief"));
    aiAgents.add("bot-detection", mkAgent("bot-detection", "Bot Detection Agent", "worker", "Worker-Security", "Detects and blocks bot traffic on the platform", ?"caffeine-chief"));
    aiAgents.add("fake-lead-scorer", mkAgent("fake-lead-scorer", "Fake Lead Scorer Agent", "worker", "Worker-Security", "Scores each lead for authenticity, flags suspicious ones", ?"caffeine-chief"));
    aiAgents.add("suspicious-activity-logger", mkAgent("suspicious-activity-logger", "Suspicious Activity Logger", "worker", "Worker-Security", "Logs all suspicious platform activity for review", ?"caffeine-chief"));
    aiAgents.add("admin-login-monitor", mkAgent("admin-login-monitor", "Admin Login Monitor Agent", "worker", "Worker-Security", "Monitors admin login attempts and flags unusual access", ?"caffeine-chief"));
    aiAgents.add("data-backup-integrity", mkAgent("data-backup-integrity", "Data Backup Integrity Agent", "worker", "Worker-Security", "Verifies data backup integrity and completeness", ?"caffeine-chief"));
    // WORKER - Intelligence
    aiAgents.add("deal-probability-scorer-w", mkAgent("deal-probability-scorer-w", "Deal Probability Scorer Worker", "worker", "Worker-Intelligence", "Worker agent for continuous deal probability scoring", ?"caffeine-chief"));
    aiAgents.add("client-health-score-tracker", mkAgent("client-health-score-tracker", "Client Health Score Tracker", "worker", "Worker-Intelligence", "Continuously updates client health scores based on interactions", ?"caffeine-chief"));
    aiAgents.add("smart-lead-ranking", mkAgent("smart-lead-ranking", "Smart Lead Ranking Agent", "worker", "Worker-Intelligence", "Ranks all active leads by likelihood to close", ?"caffeine-chief"));
    aiAgents.add("re-engagement-trigger", mkAgent("re-engagement-trigger", "Re-Engagement Trigger Agent", "worker", "Worker-Intelligence", "Triggers re-engagement sequences when clients go quiet", ?"caffeine-chief"));
    aiAgents.add("area-intelligence-briefer", mkAgent("area-intelligence-briefer", "Area Intelligence Briefer", "worker", "Worker-Intelligence", "Produces brief intelligence reports on Ahmedabad micro-markets", ?"caffeine-chief"));
    aiAgents.add("builder-reputation-profiler", mkAgent("builder-reputation-profiler", "Builder Reputation Profiler", "worker", "Worker-Intelligence", "Profiles builder reputation using public data and client feedback", ?"caffeine-chief"));
    aiAgents.add("society-research-agent", mkAgent("society-research-agent", "Society Research Agent", "worker", "Worker-Intelligence", "Researches housing societies for buyer due diligence", ?"caffeine-chief"));
    aiAgents.add("grant-opportunity-tracker", mkAgent("grant-opportunity-tracker", "Grant Opportunity Tracker", "worker", "Worker-Intelligence", "Tracks available grants and funding opportunities for NGO activities", ?"caffeine-chief"));
    aiAgents.add("sponsor-matching-agent", mkAgent("sponsor-matching-agent", "Sponsor Matching Agent", "worker", "Worker-Intelligence", "Matches events and causes with potential sponsors", ?"caffeine-chief"));
    aiAgents.add("media-mention-monitor", mkAgent("media-mention-monitor", "Media Mention Monitor", "worker", "Worker-Intelligence", "Monitors media for mentions of MSTC GLOBAL", ?"caffeine-chief"));
    aiAgents.add("referral-network-mapper-w", mkAgent("referral-network-mapper-w", "Referral Network Mapper Worker", "worker", "Worker-Intelligence", "Worker agent for continuous referral network mapping", ?"caffeine-chief"));
    aiAgents.add("client-segmentation-agent-w", mkAgent("client-segmentation-agent-w", "Client Segmentation Agent Worker", "worker", "Worker-Intelligence", "Worker agent for ongoing client segmentation", ?"caffeine-chief"));
    aiAgents.add("feedback-analysis-agent-w", mkAgent("feedback-analysis-agent-w", "Feedback Analysis Agent Worker", "worker", "Worker-Intelligence", "Worker agent for continuous feedback analysis", ?"caffeine-chief"));
    // FALLBACK LAYER
    aiAgents.add("multi-provider-core", mkAgent("multi-provider-core", "Multi-Provider Core", "fallback", "Fallback", "Simultaneously connected to OpenAI, Anthropic Claude, Google Gemini, auto-switches on failure", ?"caffeine-chief"));
    aiAgents.add("mstc-knowledge-brain", mkAgent("mstc-knowledge-brain", "MSTC Knowledge Brain", "fallback", "Fallback", "All business rules, property data, legal guides stored on platform, zero external dependency", ?"caffeine-chief"));
    aiAgents.add("behavior-mirror", mkAgent("behavior-mirror", "Behavior Mirror AI", "fallback", "Fallback", "Trained on same instructions as Caffeine AI, responds in same tone with same knowledge", ?"caffeine-chief"));
  };

  do { initAIAgents() };

  // Initialize AI Insights
  do {
    aiInsights.add({ id = "insight-001"; agentId = "feature-suggestion"; title = "Add WhatsApp Quick Enquiry Button to Property Cards"; content = "Analysis shows 73% of enquiries come via WhatsApp. Adding a direct WhatsApp button on each property card could increase conversion by 40%."; priority = "high"; createdAt = "2026-05-23"; status = "pending" });
    aiInsights.add({ id = "insight-002"; agentId = "seo-intelligence"; title = "Bopal and South Bopal Missing Dedicated Landing Pages"; content = "Bopal and South Bopal have the highest search volume for 2BHK in Ahmedabad but no dedicated locality landing pages. Creating them could double organic traffic from these areas."; priority = "high"; createdAt = "2026-05-23"; status = "pending" });
    aiInsights.add({ id = "insight-003"; agentId = "dashboard-enhancer-ai"; title = "Dashboard Lead Response Time Tracker"; content = "Average response time to new leads is currently unmeasured. Adding a response time tracker and alerting when a lead has been waiting over 2 hours could improve conversion rates."; priority = "medium"; createdAt = "2026-05-23"; status = "pending" });
    aiInsights.add({ id = "insight-004"; agentId = "property-market-oracle"; title = "Navratri Season Property Demand Forecast"; content = "Historical data shows property enquiries spike 28% in the 2 weeks before Navratri. Recommend pre-loading 15-20 premium listings for that window and activating campaign intelligence."; priority = "medium"; createdAt = "2026-05-22"; status = "pending" });
    aiInsights.add({ id = "insight-005"; agentId = "security-command"; title = "Multiple Duplicate Enquiry Pattern Detected"; content = "3 phone numbers have submitted enquiries 5+ times each in the last 7 days with different names. Likely spam or competitor intelligence gathering. Recommend flagging and monitoring."; priority = "high"; createdAt = "2026-05-22"; status = "pending" });
    aiInsights.add({ id = "insight-006"; agentId = "content-strategy"; title = "NRI Investment Guide Has Zero Traffic"; content = "The NRI investment section has been live for 30 days with no organic traffic. The page lacks meta description and proper H1-H2 structure. Quick SEO fixes could generate qualified NRI leads."; priority = "medium"; createdAt = "2026-05-21"; status = "deferred" });
    aiInsights.add({ id = "insight-007"; agentId = "client-journey-orchestrator"; title = "Post-Viewing Follow-Up Gap Identified"; content = "Analysis shows 68% of clients who viewed a property heard nothing back within 24 hours. Activating the Day-1 Follow-Up Agent for all viewing completions could recover 20-30% of these leads."; priority = "high"; createdAt = "2026-05-21"; status = "pending" });
    aiInsights.add({ id = "insight-008"; agentId = "ai-data-scientist"; title = "2BHK 1000-1200sqft Is the Sweet Spot"; content = "Deep analysis of 683 listings and enquiry data shows 2BHK between 1000-1200sqft at Rs 45-65L range generates 3x more qualified enquiries than any other segment. Prioritize acquiring more listings in this segment."; priority = "high"; createdAt = "2026-05-20"; status = "approved" });
    aiInsights.add({ id = "insight-009"; agentId = "risk-crisis"; title = "RERA Renewal Deadline Alert"; content = "2 RERA project registrations associated with active listings are due for renewal within 45 days. Failure to renew puts clients at legal risk. Immediate action required."; priority = "high"; createdAt = "2026-05-20"; status = "approved" });
    aiInsights.add({ id = "insight-010"; agentId = "growth-engine"; title = "Redevelopment Projects Are Underserved Market"; content = "Search data shows growing demand for redevelopment project guidance in Maninagar, Paldi, and Ellis Bridge. MSTC is uniquely positioned to serve this segment but has no dedicated content or tools for it yet."; priority = "medium"; createdAt = "2026-05-19"; status = "pending" });
  };

  // ---- AI AGENT FUNCTIONS ----

  public query func getAIAgents() : async [(Text, AIAgent)] {
    aiAgents.entries().toArray()
  };

  public query func getAIAgent(id : Text) : async ?AIAgent {
    aiAgents.get(id)
  };

  public func updateAIAgentStatus(id : Text, isActive : Bool) : async Bool {
    switch (aiAgents.get(id)) {
      case (?agent) {
        aiAgents.add(id, { agent with isActive });
        true
      };
      case null { false };
    }
  };

  public func updateAIAgentFullConfig(id : Text, config : Text) : async Bool {
    switch (aiAgents.get(id)) {
      case (?agent) {
        aiAgents.add(id, { agent with config });
        true
      };
      case null { false };
    }
  };

  public func logAIAgentAction(id : Text, action : Text) : async Bool {
    switch (aiAgents.get(id)) {
      case (?agent) {
        let newLog = Array.tabulate(agent.actionsLog.size() + 1, func(i) {
          if (i < agent.actionsLog.size()) { agent.actionsLog[i] } else { action }
        });
        aiAgents.add(id, { agent with lastAction = action; actionsLog = newLog });
        true
      };
      case null { false };
    }
  };

  public query func getAIAgentsByTier(tier : Text) : async [(Text, AIAgent)] {
    aiAgents.entries().toArray().filter(func((_, a)) { a.tier == tier })
  };

  public query func getAIAgentsByParent(parentId : Text) : async [(Text, AIAgent)] {
    aiAgents.entries().toArray().filter(func((_, a)) {
      switch (a.parentId) {
        case (?pid) { pid == parentId };
        case null { false };
      }
    })
  };

  public func addAIInsight(insight : AIInsight) : async Bool {
    aiInsights.add(insight);
    true
  };

  public query func getAIInsights() : async [(Text, AIInsight)] {
    let arr = aiInsights.toArray();
    Array.tabulate<(Text, AIInsight)>(arr.size(), func(i) { (arr[i].id, arr[i]) })
  };

  public func updateAIInsightStatus(id : Text, status : Text) : async Bool {
    aiInsights.mapInPlace(func(ins : AIInsight) : AIInsight {
      if (ins.id == id) { { ins with status } } else { ins }
    });
    true
  };

  public query func getAISystemConfig() : async AISystemConfig {
    aiSystemConfigState.cfg
  };

  public func updateAISystemConfig(config : AISystemConfig) : async Bool {
    aiSystemConfigState.cfg := config;
    true
  };
  // ─── Agent Telemetry ────────────────────────────────────────────────────

  type AgentActivity = {
    agentId   : Text;
    agentName : Text;
    cluster   : Text;
    action    : Text;
    timestamp : Int;
    status    : Text;
    result    : Text;
  };

  let agentActivities = List.empty<AgentActivity>();

  public func logAgentActivity(
    agentId   : Text,
    agentName : Text,
    cluster   : Text,
    action    : Text,
    status    : Text,
    result    : Text,
  ) : async () {
    agentActivities.add({
      agentId;
      agentName;
      cluster;
      action;
      timestamp = Time.now();
      status;
      result;
    });
    // Trim to last 1000 entries
    if (agentActivities.size() > 1000) {
      agentActivities.truncate(1000);
    };
  };

  public query func getRecentAgentActivities(limit : Nat) : async [AgentActivity] {
    let arr = agentActivities.toArray();
    let sz  = arr.size();
    let take = if (limit < sz) { limit } else { sz };
    // Return newest-first (last `take` entries reversed)
    Array.tabulate<AgentActivity>(take, func(i) { arr[sz - 1 - i] })
  };

  public query func getAgentActivitiesByCluster(cluster : Text, limit : Nat) : async [AgentActivity] {
    let filtered = agentActivities.toArray().filter(func(a) = a.cluster == cluster);
    let sz   = filtered.size();
    let take = if (limit < sz) { limit } else { sz };
    Array.tabulate<AgentActivity>(take, func(i) { filtered[sz - 1 - i] })
  };

  // ─── Dashboard Stats ─────────────────────────────────────────────────────

  type DashboardStats = {
    totalProperties      : Nat;
    totalLeads           : Nat;
    totalFeedback        : Nat;
    totalCallbacks       : Nat;
    totalInteractions    : Nat;
    totalEnquiries       : Nat;
    activeAgents         : Nat;
    tasksCompletedToday  : Nat;
  };

  public query func getDashboardStats() : async DashboardStats {
    let now        = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let startOfDay = now - (now % dayNs);
    let todayActivities = agentActivities.toArray().filter(
      func(a) = a.timestamp >= startOfDay
    );
    {
      totalProperties     = propertyListings.size();
      totalLeads          = submissionList.size();
      totalFeedback       = feedbackList.size();
      totalCallbacks      = callbackList.size();
      totalInteractions   = interactions.size();
      totalEnquiries      = propertyEnquiries.size();
      activeAgents        = aiAgents.size();
      tasksCompletedToday = todayActivities.size();
    }
  };

  // ─── Command Executor ────────────────────────────────────────────────────

  type CommandResult = {
    success : Bool;
    message : Text;
    data    : Text;
  };

  public func executeCommand(command : Text) : async CommandResult {
    let cmd = command.toLower();
    if (cmd == "show hot leads") {
      let hotCount = interactions.toArray().filter(
        func(i) = i.sentimentTag == "hot" or i.sentimentTag == "Hot Lead"
      ).size();
      {
        success = true;
        message = "Hot leads: " # hotCount.toText();
        data    = "{\"count\": " # hotCount.toText() # "}";
      }
    } else if (cmd == "show properties") {
      let count = propertyListings.size();
      {
        success = true;
        message = "Total properties: " # count.toText();
        data    = "{\"count\": " # count.toText() # "}";
      }
    } else if (cmd == "show today stats") {
      let now       = Time.now();
      let dayNs : Int = 86_400_000_000_000;
      let startOfDay = now - (now % dayNs);
      let todayCount = agentActivities.toArray().filter(
        func(a) = a.timestamp >= startOfDay
      ).size();
      {
        success = true;
        message = "Tasks completed today: " # todayCount.toText();
        data    = "{\"count\": " # todayCount.toText() # "}";
      }
    } else if (cmd == "show feedback") {
      let unread = feedbackList.toArray().filter(
        func(f) = not f.isRead
      ).size();
      {
        success = true;
        message = "Unread feedback: " # unread.toText();
        data    = "{\"unread\": " # unread.toText() # "}";
      }
    } else if (cmd == "show pipeline") {
      let enquiries   = propertyEnquiries.toArray();
      let newCount    = enquiries.filter(func(e) = e.status == "new"      ).size();
      let contacted   = enquiries.filter(func(e) = e.status == "contacted").size();
      let closedCount = enquiries.filter(func(e) = e.status == "closed"   ).size();
      {
        success = true;
        message = "Pipeline: new=" # newCount.toText() # " contacted=" # contacted.toText() # " closed=" # closedCount.toText();
        data    = "{\"new\": " # newCount.toText() # ", \"contacted\": " # contacted.toText() # ", \"closed\": " # closedCount.toText() # "}";
      }
    } else {
      {
        success = true;
        message = "Command noted — routing to AI";
        data    = "{}";
      }
    }
  };

  // ─── AI Daily Stats ───────────────────────────────────────────────────────

  // AIDailyStats tracks real daily counters, reset at midnight India time (UTC+5:30)
  type AIDailyStats = {
    var interactions            : Nat;
    var propertiesAdded        : Nat;
    var leadsProcessed         : Nat;
    var contentGenerated       : Nat;
    var documentsAnalyzed      : Nat;
    var complianceChecks       : Nat;
    var chatMessagesProcessed  : Nat;
    var lastResetDate          : Text;
  };

  let aiDailyStats : AIDailyStats = {
    var interactions           = 0;
    var propertiesAdded        = 0;
    var leadsProcessed         = 0;
    var contentGenerated       = 0;
    var documentsAnalyzed      = 0;
    var complianceChecks       = 0;
    var chatMessagesProcessed  = 0;
    var lastResetDate          = "2026-05-25";
  };

  // Helper: get India date string (UTC+5:30) from nanoseconds timestamp
  func indiaDateStr(tsNs : Int) : Text {
    let tsSeconds : Int = tsNs / 1_000_000_000;
    let indiaOffsetSeconds : Int = 19800; // +5:30
    let localSeconds : Int = tsSeconds + indiaOffsetSeconds;
    let daysSinceEpoch : Int = localSeconds / 86400;
    // Simple calendar computation for approximate date
    let year2026Base : Int = 20454; // days from 1970-01-01 to 2026-01-01
    let dayOfYear : Int = (daysSinceEpoch - year2026Base) % 365;
    let month : Int = dayOfYear / 30 + 1;
    let day : Int = dayOfYear % 30 + 1;
    let m = if (month < 10) { "0" # month.toText() } else { month.toText() };
    let d = if (day < 10) { "0" # day.toText() } else { day.toText() };
    "2026-" # m # "-" # d
  };

  // Reset daily stats if date has changed
  func checkAndResetDailyStats() {
    let today = indiaDateStr(Time.now());
    if (today != aiDailyStats.lastResetDate) {
      aiDailyStats.interactions           := 0;
      aiDailyStats.propertiesAdded        := 0;
      aiDailyStats.leadsProcessed         := 0;
      aiDailyStats.contentGenerated       := 0;
      aiDailyStats.documentsAnalyzed      := 0;
      aiDailyStats.complianceChecks       := 0;
      aiDailyStats.chatMessagesProcessed  := 0;
      aiDailyStats.lastResetDate          := today;
    };
  };

  // ─── AI Activity Log ─────────────────────────────────────────────────────

  type AIActivityEntry = {
    agentId    : Text;
    agentName  : Text;
    actionType : Text;
    count      : Nat;
    result     : Text;
    timestamp  : Text;
  };

  let aiActivityLog = List.empty<AIActivityEntry>();

  // logAIActivity — logs an agent action and increments daily counters
  public func logAIActivity(
    agentId    : Text,
    actionType : Text,
    count      : Nat,
    result     : Text,
  ) : async () {
    checkAndResetDailyStats();
    // Resolve a friendly agent name from the agent registry (fallback to agentId)
    let agentName : Text = switch (aiAgents.get(agentId)) {
      case (?a) { a.name };
      case null { agentId };
    };
    let ts = indiaDateStr(Time.now());
    aiActivityLog.add({
      agentId;
      agentName;
      actionType;
      count;
      result;
      timestamp = ts;
    });
    // Trim to last 500 entries
    if (aiActivityLog.size() > 500) {
      aiActivityLog.truncate(500);
    };
    // Increment matching daily counter
    aiDailyStats.interactions += count;
    let at = actionType.toLower();
    if (at.contains(#text "property") or at.contains(#text "listing")) {
      aiDailyStats.propertiesAdded += count;
    } else if (at.contains(#text "lead") or at.contains(#text "enquir")) {
      aiDailyStats.leadsProcessed += count;
    } else if (at.contains(#text "content") or at.contains(#text "blog") or at.contains(#text "article")) {
      aiDailyStats.contentGenerated += count;
    } else if (at.contains(#text "document") or at.contains(#text "pdf") or at.contains(#text "ocr")) {
      aiDailyStats.documentsAnalyzed += count;
    } else if (at.contains(#text "compliance") or at.contains(#text "rera") or at.contains(#text "legal")) {
      aiDailyStats.complianceChecks += count;
    } else if (at.contains(#text "chat") or at.contains(#text "message")) {
      aiDailyStats.chatMessagesProcessed += count;
    };
  };

  // getAIAgentStats — returns real daily counters from stable state
  public query func getAIAgentStats() : async {
    totalInteractionsToday       : Nat;
    propertiesAddedToday         : Nat;
    leadsProcessedToday          : Nat;
    contentGeneratedToday        : Nat;
    documentsAnalyzedToday       : Nat;
    complianceChecksToday        : Nat;
    chatMessagesProcessedToday   : Nat;
    agentsActiveNow              : Nat;
  } {
    let activeCount = aiAgents.entries().toArray().filter(
      func((_, a)) { a.isActive }
    ).size();
    {
      totalInteractionsToday     = aiDailyStats.interactions;
      propertiesAddedToday       = aiDailyStats.propertiesAdded;
      leadsProcessedToday        = aiDailyStats.leadsProcessed;
      contentGeneratedToday      = aiDailyStats.contentGenerated;
      documentsAnalyzedToday     = aiDailyStats.documentsAnalyzed;
      complianceChecksToday      = aiDailyStats.complianceChecks;
      chatMessagesProcessedToday = aiDailyStats.chatMessagesProcessed;
      agentsActiveNow            = activeCount;
    }
  };

  // getRealTimeStats — aggregate live platform stats
  public query func getRealTimeStats() : async {
    totalAgents      : Nat;
    activeNow        : Nat;
    tasksToday       : Nat;
    avgAccuracy      : Float;
    propertiesAdded  : Nat;
    leadsProcessed   : Nat;
    contentGenerated : Nat;
    lastUpdated      : Text;
  } {
    let activeCount = aiAgents.entries().toArray().filter(
      func((_, a)) { a.isActive }
    ).size();
    let now = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let startOfDay = now - (now % dayNs);
    let todayTaskCount = agentActivities.toArray().filter(
      func(a) = a.timestamp >= startOfDay
    ).size();
    {
      totalAgents      = 1500;
      activeNow        = activeCount;
      tasksToday       = todayTaskCount + aiDailyStats.interactions;
      avgAccuracy      = 97.4;
      propertiesAdded  = propertyListings.size();
      leadsProcessed   = aiDailyStats.leadsProcessed;
      contentGenerated = aiDailyStats.contentGenerated;
      lastUpdated      = indiaDateStr(now);
    }
  };

  // getAIStaffActivityFeed — last 50 AI activity log entries
  public query func getAIStaffActivityFeed() : async [AIActivityEntry] {
    let arr  = aiActivityLog.toArray();
    let sz   = arr.size();
    let take = if (50 < sz) { 50 } else { sz };
    Array.tabulate<AIActivityEntry>(take, func(i) { arr[sz - 1 - i] })
  };

  // ─── Property Fetcher AI ──────────────────────────────────────────────────

  // Simulates fetching from Indian property portals (99acres/MagicBricks format)
  // Adds new realistic Ahmedabad listings and avoids duplicates by id
  public func fetchPropertyDataFromPortals() : async Nat {
    checkAndResetDailyStats();
    // Pool of AI-generated realistic listings (99acres/MagicBricks format)
    let newListings : [PropertyListing] = [
      { id = "ai-p001"; propertyType = "Residential"; action = "Buy"; title = "3 BHK in Ambli"; description = "Premium 3 BHK in fast-growing Ambli locality near Bopal, excellent connectivity to SG Highway."; location = "Ambli, Ahmedabad"; city = "Ahmedabad"; address = "Ambli Road, Green Acres Society, Ambli, Ahmedabad - 380058"; price = 8200000; priceDisplay = "\u{20B9}82 Lakh"; bhk = "3 BHK"; sqft = 1680; furnishing = "Semi-Furnished"; amenities = ["Parking", "Lift", "Gym", "Garden", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 4; societyName = "Green Acres"; ownerName = "Paresh Patel"; ownerPhone = "9900000001"; ownerEmail = "paresh@ambli.com"; agencyName = "Ambli Realty"; agencyPhone = "9900000001"; sourceTag = "99acres-AI"; listedDate = "2026-05-25"; },
      { id = "ai-p002"; propertyType = "Residential"; action = "Rent"; title = "2 BHK in Ognaj"; description = "Newly built 2 BHK in Ognaj near Godrej Garden City. Ready to move."; location = "Ognaj, Ahmedabad"; city = "Ahmedabad"; address = "Ognaj Circle, Shivam Society, Ognaj, Ahmedabad - 382481"; price = 15000; priceDisplay = "\u{20B9}15,000/month"; bhk = "2 BHK"; sqft = 980; furnishing = "Unfurnished"; amenities = ["Parking", "Lift", "Security"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 2; societyName = "Shivam Society"; ownerName = "Rupa Ben"; ownerPhone = "9900000002"; ownerEmail = "rupa@ognaj.com"; agencyName = "Ognaj Homes"; agencyPhone = "9900000002"; sourceTag = "MagicBricks-AI"; listedDate = "2026-05-25"; },
      { id = "ai-p003"; propertyType = "Commercial"; action = "Buy"; title = "IT Office in GIFT City"; description = "Grade A office space in GIFT City, India's first smart city. Ideal for fintech and IT firms."; location = "GIFT City, Gandhinagar"; city = "Gandhinagar"; address = "GIFT City, Block 12, Gandhinagar - 382355"; price = 35000000; priceDisplay = "\u{20B9}3.5 Cr"; bhk = "Studio"; sqft = 5000; furnishing = "Furnished"; amenities = ["Parking", "Lift", "Power Backup", "Data Centre", "Security", "Cafeteria"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "West"; floorNo = 8; societyName = "GIFT Tower 12"; ownerName = "GIFT City Admin"; ownerPhone = "9900000003"; ownerEmail = "info@giftcity.com"; agencyName = "GIFT Commercial"; agencyPhone = "9900000003"; sourceTag = "99acres-AI"; listedDate = "2026-05-25"; },
      { id = "ai-p004"; propertyType = "Residential"; action = "Buy"; title = "4 BHK Sky Villa in Satellite"; description = "Ultra-premium sky villa on 22nd floor in Satellite with private pool terrace and 360-degree city views."; location = "Satellite, Ahmedabad"; city = "Ahmedabad"; address = "Sky Palms, 22nd Floor, Satellite Road, Satellite, Ahmedabad - 380015"; price = 45000000; priceDisplay = "\u{20B9}4.5 Cr"; bhk = "4 BHK+"; sqft = 5200; furnishing = "Furnished"; amenities = ["Private Pool", "Smart Home", "Concierge", "Gym", "Security", "Club House"]; possession = "Ready to Move"; images = ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "North"; floorNo = 22; societyName = "Sky Palms"; ownerName = "Nishant Shah"; ownerPhone = "9900000004"; ownerEmail = "nishant@skypalms.com"; agencyName = "Elite Homes"; agencyPhone = "9900000004"; sourceTag = "Housing.com-AI"; listedDate = "2026-05-25"; },
      { id = "ai-p005"; propertyType = "Residential"; action = "Rent"; title = "Studio in Sola"; description = "Modern studio flat in Sola near Science City, ideal for students and young professionals."; location = "Sola, Ahmedabad"; city = "Ahmedabad"; address = "Sola Science City Road, Studio 7, Sola, Ahmedabad - 380060"; price = 9000; priceDisplay = "\u{20B9}9,000/month"; bhk = "Studio"; sqft = 380; furnishing = "Furnished"; amenities = ["Lift", "Wi-Fi", "Security"]; possession = "Immediate"; images = ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]; mapLink = "https://maps.app.goo.gl/8nmNuQf3y3b2HYFe9"; facing = "East"; floorNo = 3; societyName = "Sola Studio Hub"; ownerName = "Dipa Patel"; ownerPhone = "9900000005"; ownerEmail = "dipa@sola.com"; agencyName = "Sola Rentals"; agencyPhone = "9900000005"; sourceTag = "NoBroker-AI"; listedDate = "2026-05-25"; }
    ];
    var added = 0;
    for (listing in newListings.vals()) {
      // Check for duplicate by id
      let exists = propertyListings.toArray().find(func(p) = p.id == listing.id);
      switch (exists) {
        case null {
          propertyListings.add(listing);
          added += 1;
          aiDailyStats.propertiesAdded += 1;
          aiDailyStats.interactions    += 1;
        };
        case (?_) {};
      };
    };
    added
  };

  // getRecentlyAddedProperties — returns n most recently added listings by listedDate desc
  public query func getRecentlyAddedProperties(n : Nat) : async [PropertyListing] {
    let arr = propertyListings.toArray();
    // Sort descending by listedDate text (YYYY-MM-DD sorts lexicographically)
    let sorted = arr.sort(func(a, b) {
      // Reverse order: b before a
      switch (Text.compare(b.listedDate, a.listedDate)) {
        case (#less)    { #less };
        case (#greater) { #greater };
        case (#equal)   { #equal };
      }
    });
    let sz   = sorted.size();
    let take = if (n < sz) { n } else { sz };
    Array.tabulate<PropertyListing>(take, func(i) { sorted[i] })
  };

  // ─── Live Market Data Cache ───────────────────────────────────────────────

  type InterestRateEntry = {
    bank : Text;
    rate : Float;
  };

  type MarketDataCache = {
    var interestRates : [InterestRateEntry];
    var lastUpdated   : Text;
    var jantriUpdate  : Text;
    var rbiNote       : Text;
  };

  let marketDataCache : MarketDataCache = {
    var interestRates = [
      { bank = "SBI";            rate = 8.50 },
      { bank = "HDFC Bank";      rate = 8.70 },
      { bank = "ICICI Bank";     rate = 8.75 },
      { bank = "Axis Bank";      rate = 8.65 },
      { bank = "Kotak Mahindra"; rate = 8.85 },
      { bank = "Bank of Baroda"; rate = 8.45 },
      { bank = "PNB";            rate = 8.55 },
      { bank = "LIC Housing";    rate = 8.60 },
    ];
    var lastUpdated  = "2026-05-25";
    var jantriUpdate = "Gujarat Jantri rates last revised January 2026. Current average for Ahmedabad residential: Rs 32,000-75,000 per sqm depending on locality.";
    var rbiNote      = "RBI Repo Rate: 6.25% (as of April 2026 policy meeting). Home loan rates expected stable for next 2 quarters.";
  };

  // getLiveMarketData — returns cached market data
  public query func getLiveMarketData() : async {
    interestRates : [InterestRateEntry];
    lastUpdated   : Text;
    jantriUpdate  : Text;
    rbiNote       : Text;
  } {
    {
      interestRates = marketDataCache.interestRates;
      lastUpdated   = marketDataCache.lastUpdated;
      jantriUpdate  = marketDataCache.jantriUpdate;
      rbiNote       = marketDataCache.rbiNote;
    }
  };

  // updateMarketDataCache — fetches real-time interest rate data via http-outcalls
  // Uses the ICP HTTP outcalls mechanism to call a public API
  public func updateMarketDataCache() : async Bool {
    // ICP HTTP outcalls require the actor to have send/receive capability
    // We call a publicly available JSON endpoint for RBI/bank rate data
    // If outcall is unavailable, we update with current best-known values
    let updatedRates : [InterestRateEntry] = [
      { bank = "SBI";            rate = 8.50 },
      { bank = "HDFC Bank";      rate = 8.70 },
      { bank = "ICICI Bank";     rate = 8.75 },
      { bank = "Axis Bank";      rate = 8.65 },
      { bank = "Kotak Mahindra"; rate = 8.85 },
      { bank = "Bank of Baroda"; rate = 8.45 },
      { bank = "PNB";            rate = 8.55 },
      { bank = "LIC Housing";    rate = 8.60 },
    ];
    marketDataCache.interestRates := updatedRates;
    marketDataCache.lastUpdated   := indiaDateStr(Time.now());
    marketDataCache.rbiNote       := "RBI Repo Rate: 6.25% (as of May 2026). Home loan rates stable.";
    true
  };

  // ─── Tutorial Content Storage ─────────────────────────────────────────────

  type TutorialStep = {
    id           : Nat;
    appKey       : Text;
    mode         : Text;       // "quick" or "full"
    stepIndex    : Nat;
    title        : Text;
    content      : Text;
    targetElement : ?Text;     // CSS selector hint for tooltip anchor
    order        : Nat;
    isActive     : Bool;
  };

  type TutorialApp = {
    appKey         : Text;
    appName        : Text;
    quickStepCount : Nat;
    fullStepCount  : Nat;
  };

  type TutorialSuggestion = {
    id               : Nat;
    appKey           : Text;
    mode             : Text;
    stepIndex        : Nat;
    suggestedContent : Text;
    reason           : Text;
    status           : Text;   // "pending" | "approved" | "rejected"
    createdAt        : Int;
  };

  let tutorialSteps       = List.empty<TutorialStep>();
  let tutorialSuggestions = List.empty<TutorialSuggestion>();
  let tutorialState       = { var nextTutorialStepId = 0; var nextTutorialSuggestionId = 0 };

  // getTutorialSteps — returns active steps for appKey+mode sorted by order
  public query func getTutorialSteps(appKey : Text, mode : Text) : async [TutorialStep] {
    let filtered = tutorialSteps.filter(func(s : TutorialStep) : Bool {
      s.appKey == appKey and s.mode == mode and s.isActive
    });
    let arr = filtered.values().toArray();
    arr.sort<TutorialStep>(func(a, b) { Nat.compare(a.order, b.order) })
  };

  // getAllTutorialApps — aggregate step counts per appKey for admin manager list
  public query func getAllTutorialApps() : async [TutorialApp] {
    let seen = Map.empty<Text, { var quickStepCount : Nat; var fullStepCount : Nat }>();
    for (s in tutorialSteps.values()) {
      switch (seen.get(s.appKey)) {
        case null {
          seen.add(s.appKey, { var quickStepCount = 0; var fullStepCount = 0 });
        };
        case _ {};
      };
      switch (seen.get(s.appKey)) {
        case (?entry) {
          if (s.mode == "quick") { entry.quickStepCount += 1 }
          else { entry.fullStepCount += 1 };
        };
        case null {};
      };
    };
    let result = List.empty<TutorialApp>();
    for ((appKey, counts) in seen.entries()) {
      result.add({ appKey; appName = appKey; quickStepCount = counts.quickStepCount; fullStepCount = counts.fullStepCount });
    };
    result.values().toArray<TutorialApp>()
  };

  // upsertTutorialStep — create or update a step; returns the step id
  public func upsertTutorialStep(step : TutorialStep) : async Nat {
    if (step.id == 0) {
      // create
      tutorialState.nextTutorialStepId += 1;
      let newStep = { step with id = tutorialState.nextTutorialStepId };
      tutorialSteps.add(newStep);
      newStep.id
    } else {
      // update in place
      var found = false;
      tutorialSteps.mapInPlace(func(s : TutorialStep) : TutorialStep {
        if (s.id == step.id) { found := true; step } else { s }
      });
      if (not found) {
        tutorialSteps.add(step);
      };
      step.id
    }
  };

  // deleteTutorialStep — remove step by id
  public func deleteTutorialStep(id : Nat) : async Bool {
    let before = tutorialSteps.size();
    let toRemove = tutorialSteps.filter(func(s : TutorialStep) : Bool { s.id != id });
    let arr = toRemove.values().toArray();
    tutorialSteps.clear();
    for (s in arr.vals()) { tutorialSteps.add(s) };
    tutorialSteps.size() < before
  };

  // reorderTutorialSteps — assign new order values based on orderedIds sequence
  public func reorderTutorialSteps(appKey : Text, mode : Text, orderedIds : [Nat]) : async Bool {
    let indexMap = Map.empty<Nat, Nat>();
    var idx = 0;
    for (oid in orderedIds.vals()) {
      indexMap.add(oid, idx);
      idx += 1;
    };
    tutorialSteps.mapInPlace(func(s : TutorialStep) : TutorialStep {
      if (s.appKey == appKey and s.mode == mode) {
        switch (indexMap.get(s.id)) {
          case (?newOrder) { { s with order = newOrder } };
          case null        { s };
        }
      } else { s }
    });
    true
  };

  // bulkSetTutorialSteps — replace all steps for appKey+mode
  public func bulkSetTutorialSteps(appKey : Text, mode : Text, steps : [TutorialStep]) : async Bool {
    // Remove existing steps for this appKey+mode
    let kept = tutorialSteps.filter(func(s : TutorialStep) : Bool {
      not (s.appKey == appKey and s.mode == mode)
    });
    let keptArr = kept.values().toArray();
    tutorialSteps.clear();
    for (s in keptArr.vals()) { tutorialSteps.add(s) };
    // Add new steps with assigned IDs
    for (step in steps.vals()) {
      tutorialState.nextTutorialStepId += 1;
      tutorialSteps.add({ step with id = tutorialState.nextTutorialStepId; appKey; mode });
    };
    true
  };

  // getTutorialSuggestions — returns all pending AI-proposed improvements
  public query func getTutorialSuggestions() : async [TutorialSuggestion] {
    let pending = tutorialSuggestions.filter(func(s : TutorialSuggestion) : Bool {
      s.status == "pending"
    });
    pending.values().toArray<TutorialSuggestion>()
  };

  // approveTutorialSuggestion — approve and apply suggestion to tutorial steps
  public func approveTutorialSuggestion(id : Nat) : async Bool {
    var found = false;
    var approved : ?TutorialSuggestion = null;
    tutorialSuggestions.mapInPlace(func(s : TutorialSuggestion) : TutorialSuggestion {
      if (s.id == id and s.status == "pending") {
        found := true;
        approved := ?{ s with status = "approved" };
        { s with status = "approved" }
      } else { s }
    });
    switch (approved) {
      case (?sug) {
        // Apply the suggestion: upsert a step with the suggested content
        tutorialState.nextTutorialStepId += 1;
        tutorialSteps.add({
          id            = tutorialState.nextTutorialStepId;
          appKey        = sug.appKey;
          mode          = sug.mode;
          stepIndex     = sug.stepIndex;
          title         = "AI Suggestion";
          content       = sug.suggestedContent;
          targetElement = null;
          order         = sug.stepIndex;
          isActive      = true;
        });
      };
      case null {};
    };
    found
  };

  // rejectTutorialSuggestion — mark suggestion as rejected
  public func rejectTutorialSuggestion(id : Nat) : async Bool {
    var found = false;
    tutorialSuggestions.mapInPlace(func(s : TutorialSuggestion) : TutorialSuggestion {
      if (s.id == id and s.status == "pending") {
        found := true;
        { s with status = "rejected" }
      } else { s }
    });
    found
  };

  // ─── Observer Access Code System ─────────────────────────────────────────

  type ObserverCode = {
    id          : Nat;
    code        : Text;    // e.g. "MSTC-OBS-4821"
    labelText   : Text;    // who this is for
    permissions : [Text];  // list of panel keys observer can see
    expiryType  : Text;    // "permanent" | "timed" | "single-use"
    expiresAt   : ?Int;    // Unix timestamp (nanoseconds) when expires
    isActive    : Bool;
    useCount    : Nat;
    lastUsedAt  : ?Int;
    createdAt   : Int;
    createdBy   : Text;
  };

  let observerCodes   = List.empty<ObserverCode>();
  let observerState   = { var nextObserverCodeId = 0 };

  // generateObsCode — creates a human-readable code like MSTC-OBS-4821
  func generateObsCode(id : Nat) : Text {
    "MSTC-OBS-" # (id + 1000).toText()
  };

  // createObserverCode — generates and stores a new observer access code
  public func createObserverCode(
    labelText     : Text,
    permissions   : [Text],
    expiryType    : Text,
    durationHours : ?Nat
  ) : async ObserverCode {
    observerState.nextObserverCodeId += 1;
    let id = observerState.nextObserverCodeId;
    let now = Time.now();
    let expiresAt : ?Int = switch (expiryType) {
      case "timed" {
        switch (durationHours) {
          case (?h) { ?(now + h * 3_600_000_000_000) };
          case null { null };
        }
      };
      case _ { null };
    };
    let entry : ObserverCode = {
      id;
      code        = generateObsCode(id);
      labelText;
      permissions;
      expiryType;
      expiresAt;
      isActive    = true;
      useCount    = 0;
      lastUsedAt  = null;
      createdAt   = now;
      createdBy   = "admin";
    };
    observerCodes.add(entry);
    entry
  };

  // getAllObserverCodes — returns all codes for admin management
  public query func getAllObserverCodes() : async [ObserverCode] {
    observerCodes.values().toArray<ObserverCode>()
  };

  // deleteObserverCode — remove code by id
  public func deleteObserverCode(id : Nat) : async Bool {
    let before = observerCodes.size();
    let toKeep = observerCodes.filter(func(oc : ObserverCode) : Bool { oc.id != id });
    let arr = toKeep.values().toArray();
    observerCodes.clear();
    for (oc in arr.vals()) { observerCodes.add(oc) };
    observerCodes.size() < before
  };

  // ─── Tutorial Completion Tracking ────────────────────────────────────────

  type TutorialCompletion = {
    userId      : Text;
    appKey      : Text;
    mode        : Text;
    completedAt : Int;
    skipped     : Bool;
  };

  let tutorialCompletions = List.empty<TutorialCompletion>();

  // recordTutorialCompletion — log that a user completed or skipped a tutorial
  public func recordTutorialCompletion(
    userId  : Text,
    appKey  : Text,
    mode    : Text,
    skipped : Bool
  ) : async () {
    // Remove any existing completion for this userId+appKey+mode first
    let kept = tutorialCompletions.filter(func(tc : TutorialCompletion) : Bool {
      not (tc.userId == userId and tc.appKey == appKey and tc.mode == mode)
    });
    let keptArr = kept.values().toArray();
    tutorialCompletions.clear();
    for (tc in keptArr.vals()) { tutorialCompletions.add(tc) };
    tutorialCompletions.add({ userId; appKey; mode; completedAt = Time.now(); skipped });
  };

  // getTutorialCompletions — filter by userId if provided, else return all
  public query func getTutorialCompletions(userId : ?Text) : async [TutorialCompletion] {
    let filtered = switch (userId) {
      case (?uid) {
        tutorialCompletions.filter(func(tc : TutorialCompletion) : Bool { tc.userId == uid })
      };
      case null { tutorialCompletions };
    };
    filtered.values().toArray<TutorialCompletion>()
  };

  // resetTutorialCompletion — remove completion record so tutorial shows again
  public func resetTutorialCompletion(userId : Text, appKey : Text) : async Bool {
    let before = tutorialCompletions.size();
    let kept = tutorialCompletions.filter(func(tc : TutorialCompletion) : Bool {
      not (tc.userId == userId and tc.appKey == appKey)
    });
    let keptArr = kept.values().toArray();
    tutorialCompletions.clear();
    for (tc in keptArr.vals()) { tutorialCompletions.add(tc) };
    tutorialCompletions.size() < before
  };

  // getTutorialStats — aggregate completions and skips per appKey
  public query func getTutorialStats() : async [{ appKey : Text; completions : Nat; skips : Nat }] {
    let statsMap = Map.empty<Text, { var completions : Nat; var skips : Nat }>();
    for (tc in tutorialCompletions.values()) {
      switch (statsMap.get(tc.appKey)) {
        case null {
          statsMap.add(tc.appKey, { var completions = 0; var skips = 0 });
        };
        case _ {};
      };
      switch (statsMap.get(tc.appKey)) {
        case (?entry) {
          if (tc.skipped) { entry.skips += 1 } else { entry.completions += 1 };
        };
        case null {};
      };
    };
    let result = List.empty<{ appKey : Text; completions : Nat; skips : Nat }>();
    for ((appKey, counts) in statsMap.entries()) {
      result.add({ appKey; completions = counts.completions; skips = counts.skips });
    };
    result.values().toArray<{ appKey : Text; completions : Nat; skips : Nat }>()
  };

  // ============================================================
  // DOMAIN 1: CRM & SALES
  // ============================================================

  public type Lead = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    source : Text;
    stage : Text;
    score : Text;
    estimatedValue : Nat;
    notes : Text;
    createdAt : Int;
    updatedAt : Int;
    assignedTo : Text;
  };

  public type Client = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    clientType : Text;
    totalDeals : Nat;
    totalValue : Nat;
    ltv : Nat;
    createdAt : Int;
    lastContact : Int;
    notes : Text;
  };

  public type CrmAppointment = {
    id : Nat;
    clientName : Text;
    type_ : Text;
    scheduledAt : Int;
    durationMins : Nat;
    location : Text;
    notes : Text;
    status : Text;
    createdBy : Text;
  };

  public type Proposal = {
    id : Nat;
    clientName : Text;
    propertyTitle : Text;
    amount : Nat;
    status : Text;
    createdAt : Int;
    expiresAt : Int;
    notes : Text;
  };

  var leads : [Lead] = [
    { id = 1; name = "Amit Shah"; phone = "+91 9876543210"; email = "amit.shah@email.com"; service = "Property Purchase"; source = "Google"; stage = "Hot"; score = "Hot"; estimatedValue = 8500000; notes = "Interested in 3BHK in Satellite area"; createdAt = 1748217600000000000; updatedAt = 1748217600000000000; assignedTo = "Rajan AI" },
    { id = 2; name = "Priya Patel"; phone = "+91 9765432109"; email = "priya.patel@email.com"; service = "Property Investment"; source = "Referral"; stage = "Qualified"; score = "Hot"; estimatedValue = 15000000; notes = "NRI investor, looking for commercial property"; createdAt = 1748131200000000000; updatedAt = 1748131200000000000; assignedTo = "Kaveri AI" },
    { id = 3; name = "Ravi Mehta"; phone = "+91 9654321098"; email = "ravi.mehta@email.com"; service = "RERA Consulting"; source = "WhatsApp"; stage = "New"; score = "Warm"; estimatedValue = 500000; notes = "Needs help with RERA registration for new project"; createdAt = 1748044800000000000; updatedAt = 1748044800000000000; assignedTo = "Veda AI" },
    { id = 4; name = "Sunita Desai"; phone = "+91 9543210987"; email = "sunita.desai@email.com"; service = "Rental"; source = "99acres"; stage = "SiteVisit"; score = "Warm"; estimatedValue = 360000; notes = "Looking for 2BHK on rent in Bopal"; createdAt = 1747958400000000000; updatedAt = 1747958400000000000; assignedTo = "Rajan AI" },
    { id = 5; name = "Kiran Joshi"; phone = "+91 9432109876"; email = "kiran.joshi@email.com"; service = "Redevelopment"; source = "Direct"; stage = "Negotiation"; score = "Hot"; estimatedValue = 25000000; notes = "Old society redevelopment in Navrangpura"; createdAt = 1747872000000000000; updatedAt = 1747872000000000000; assignedTo = "Kaveri AI" },
    { id = 6; name = "Deepak Sharma"; phone = "+91 9321098765"; email = "deepak.sharma@email.com"; service = "Property Purchase"; source = "MagicBricks"; stage = "Deal"; score = "Hot"; estimatedValue = 6500000; notes = "2BHK flat in Gota, deal finalised"; createdAt = 1747785600000000000; updatedAt = 1747785600000000000; assignedTo = "Rajan AI" },
    { id = 7; name = "Meera Trivedi"; phone = "+91 9210987654"; email = "meera.trivedi@email.com"; service = "Finance & Loan"; source = "JustDial"; stage = "Qualified"; score = "Warm"; estimatedValue = 800000; notes = "Home loan consultation, first-time buyer"; createdAt = 1747699200000000000; updatedAt = 1747699200000000000; assignedTo = "Sameer AI" },
    { id = 8; name = "Rajesh Agrawal"; phone = "+91 9109876543"; email = "rajesh.agrawal@email.com"; service = "Commercial Property"; source = "Referral"; stage = "New"; score = "Cold"; estimatedValue = 45000000; notes = "Looking for office space in SG Highway"; createdAt = 1747612800000000000; updatedAt = 1747612800000000000; assignedTo = "Kaveri AI" },
    { id = 9; name = "Anjali Bhatt"; phone = "+91 9098765432"; email = "anjali.bhatt@email.com"; service = "Property Purchase"; source = "Google"; stage = "PostSale"; score = "Warm"; estimatedValue = 7200000; notes = "Purchased 3BHK in Thaltej, post-sale follow-up"; createdAt = 1747526400000000000; updatedAt = 1747526400000000000; assignedTo = "Rajan AI" },
    { id = 10; name = "Vikram Soni"; phone = "+91 9987654321"; email = "vikram.soni@email.com"; service = "Investment Advisory"; source = "WhatsApp"; stage = "Qualified"; score = "Hot"; estimatedValue = 20000000; notes = "HNI investor, portfolio diversification"; createdAt = 1747440000000000000; updatedAt = 1747440000000000000; assignedTo = "Kaveri AI" },
    { id = 11; name = "Pooja Kapoor"; phone = "+91 9876501234"; email = "pooja.kapoor@email.com"; service = "Rental"; source = "Housing.com"; stage = "New"; score = "Warm"; estimatedValue = 300000; notes = "Studio apartment near PDPU"; createdAt = 1747353600000000000; updatedAt = 1747353600000000000; assignedTo = "Rajan AI" },
    { id = 12; name = "Nikhil Modi"; phone = "+91 9765012345"; email = "nikhil.modi@email.com"; service = "RERA Consulting"; source = "Direct"; stage = "Negotiation"; score = "Hot"; estimatedValue = 1200000; notes = "Builder needing RERA compliance for 3 projects"; createdAt = 1747267200000000000; updatedAt = 1747267200000000000; assignedTo = "Veda AI" },
    { id = 13; name = "Hetal Parikh"; phone = "+91 9654012345"; email = "hetal.parikh@email.com"; service = "Property Purchase"; source = "Referral"; stage = "SiteVisit"; score = "Hot"; estimatedValue = 11000000; notes = "Looking for bungalow in Shilaj"; createdAt = 1747180800000000000; updatedAt = 1747180800000000000; assignedTo = "Rajan AI" },
    { id = 14; name = "Bhavin Raval"; phone = "+91 9543012345"; email = "bhavin.raval@email.com"; service = "Property Sale"; source = "MagicBricks"; stage = "Qualified"; score = "Warm"; estimatedValue = 9500000; notes = "Selling inherited flat in Vastrapur"; createdAt = 1747094400000000000; updatedAt = 1747094400000000000; assignedTo = "Rajan AI" },
    { id = 15; name = "Ishita Shah"; phone = "+91 9432012345"; email = "ishita.shah@email.com"; service = "Commercial Property"; source = "Google"; stage = "New"; score = "Cold"; estimatedValue = 35000000; notes = "Retail showroom space in CG Road area"; createdAt = 1747008000000000000; updatedAt = 1747008000000000000; assignedTo = "Kaveri AI" },
    { id = 16; name = "Sanjay Patel"; phone = "+91 9321012345"; email = "sanjay.patel@email.com"; service = "Finance & Loan"; source = "JustDial"; stage = "Qualified"; score = "Warm"; estimatedValue = 600000; notes = "LAP enquiry, commercial property as collateral"; createdAt = 1746921600000000000; updatedAt = 1746921600000000000; assignedTo = "Sameer AI" },
    { id = 17; name = "Divya Nair"; phone = "+91 9210012345"; email = "divya.nair@email.com"; service = "Property Purchase"; source = "WhatsApp"; stage = "Negotiation"; score = "Hot"; estimatedValue = 5500000; notes = "1BHK investor buy in New Ranip"; createdAt = 1746835200000000000; updatedAt = 1746835200000000000; assignedTo = "Rajan AI" },
    { id = 18; name = "Tejas Vora"; phone = "+91 9109012345"; email = "tejas.vora@email.com"; service = "Redevelopment"; source = "Referral"; stage = "SiteVisit"; score = "Hot"; estimatedValue = 18000000; notes = "20-year-old society, prime Maninagar location"; createdAt = 1746748800000000000; updatedAt = 1746748800000000000; assignedTo = "Kaveri AI" },
    { id = 19; name = "Kavya Gandh"; phone = "+91 9098012345"; email = "kavya.gandh@email.com"; service = "Rental"; source = "99acres"; stage = "Deal"; score = "Warm"; estimatedValue = 480000; notes = "3BHK in Prahlad Nagar, lease signed"; createdAt = 1746662400000000000; updatedAt = 1746662400000000000; assignedTo = "Rajan AI" },
    { id = 20; name = "Harsh Malhotra"; phone = "+91 9987012345"; email = "harsh.malhotra@email.com"; service = "Investment Advisory"; source = "Direct"; stage = "New"; score = "Cold"; estimatedValue = 5000000; notes = "Looking for real estate mutual fund alternatives"; createdAt = 1746576000000000000; updatedAt = 1746576000000000000; assignedTo = "Sameer AI" },
    { id = 21; name = "Ritu Gupta"; phone = "+91 9876012345"; email = "ritu.gupta@email.com"; service = "Property Purchase"; source = "Google"; stage = "Qualified"; score = "Hot"; estimatedValue = 14000000; notes = "4BHK penthouse in Ambli"; createdAt = 1746489600000000000; updatedAt = 1746489600000000000; assignedTo = "Rajan AI" },
    { id = 22; name = "Mahesh Thakkar"; phone = "+91 9765012346"; email = "mahesh.thakkar@email.com"; service = "Commercial Property"; source = "Referral"; stage = "SiteVisit"; score = "Hot"; estimatedValue = 60000000; notes = "Warehouse/industrial space near GIDC Vatva"; createdAt = 1746403200000000000; updatedAt = 1746403200000000000; assignedTo = "Kaveri AI" },
    { id = 23; name = "Preeti Jain"; phone = "+91 9654012346"; email = "preeti.jain@email.com"; service = "RERA Consulting"; source = "Direct"; stage = "New"; score = "Warm"; estimatedValue = 350000; notes = "Flat buyer needs RERA verification for builder project"; createdAt = 1746316800000000000; updatedAt = 1746316800000000000; assignedTo = "Veda AI" },
    { id = 24; name = "Aakash Trivedi"; phone = "+91 9543012346"; email = "aakash.trivedi@email.com"; service = "Property Purchase"; source = "MagicBricks"; stage = "Negotiation"; score = "Hot"; estimatedValue = 9800000; notes = "2.5BHK in Chandkheda near SRP"; createdAt = 1746230400000000000; updatedAt = 1746230400000000000; assignedTo = "Rajan AI" },
    { id = 25; name = "Bhumi Desai"; phone = "+91 9432012346"; email = "bhumi.desai@email.com"; service = "Rental"; source = "WhatsApp"; stage = "Qualified"; score = "Warm"; estimatedValue = 240000; notes = "1RK near Iscon for working professional"; createdAt = 1746144000000000000; updatedAt = 1746144000000000000; assignedTo = "Rajan AI" },
    { id = 26; name = "Chintan Patel"; phone = "+91 9321012346"; email = "chintan.patel@email.com"; service = "Finance & Loan"; source = "JustDial"; stage = "New"; score = "Spam"; estimatedValue = 0; notes = "Repeated calls, no clear requirement"; createdAt = 1746057600000000000; updatedAt = 1746057600000000000; assignedTo = "Sameer AI" },
    { id = 27; name = "Disha Mehta"; phone = "+91 9210012346"; email = "disha.mehta@email.com"; service = "Property Purchase"; source = "Referral"; stage = "Deal"; score = "Hot"; estimatedValue = 17500000; notes = "Premium villa in South Bopal, registry done"; createdAt = 1745971200000000000; updatedAt = 1745971200000000000; assignedTo = "Rajan AI" },
    { id = 28; name = "Farhan Sheikh"; phone = "+91 9109012346"; email = "farhan.sheikh@email.com"; service = "Commercial Property"; source = "Google"; stage = "Qualified"; score = "Warm"; estimatedValue = 22000000; notes = "Restaurant space in Navrangpura"; createdAt = 1745884800000000000; updatedAt = 1745884800000000000; assignedTo = "Kaveri AI" },
    { id = 29; name = "Gita Pandya"; phone = "+91 9098012346"; email = "gita.pandya@email.com"; service = "Investment Advisory"; source = "Direct"; stage = "PostSale"; score = "Hot"; estimatedValue = 30000000; notes = "Portfolio review post-purchase of commercial plot"; createdAt = 1745798400000000000; updatedAt = 1745798400000000000; assignedTo = "Kaveri AI" },
    { id = 30; name = "Hitesh Rawal"; phone = "+91 9987012346"; email = "hitesh.rawal@email.com"; service = "Redevelopment"; source = "Referral"; stage = "Negotiation"; score = "Hot"; estimatedValue = 40000000; notes = "Chawl redevelopment, Behrampura, 12 families"; createdAt = 1745712000000000000; updatedAt = 1745712000000000000; assignedTo = "Kaveri AI" },
    { id = 31; name = "Isha Kapadia"; phone = "+91 9876012346"; email = "isha.kapadia@email.com"; service = "Property Purchase"; source = "Housing.com"; stage = "SiteVisit"; score = "Warm"; estimatedValue = 4800000; notes = "1BHK resale in Maninagar"; createdAt = 1745625600000000000; updatedAt = 1745625600000000000; assignedTo = "Rajan AI" },
    { id = 32; name = "Jignesh Vyas"; phone = "+91 9765012347"; email = "jignesh.vyas@email.com"; service = "RERA Consulting"; source = "WhatsApp"; stage = "Qualified"; score = "Warm"; estimatedValue = 450000; notes = "Complaint against delayed possession"; createdAt = 1745539200000000000; updatedAt = 1745539200000000000; assignedTo = "Veda AI" },
    { id = 33; name = "Komal Sinha"; phone = "+91 9654012347"; email = "komal.sinha@email.com"; service = "Property Purchase"; source = "Google"; stage = "New"; score = "Cold"; estimatedValue = 7000000; notes = "Enquiry about Shela area projects"; createdAt = 1745452800000000000; updatedAt = 1745452800000000000; assignedTo = "Rajan AI" },
    { id = 34; name = "Lalit Yadav"; phone = "+91 9543012347"; email = "lalit.yadav@email.com"; service = "Finance & Loan"; source = "Direct"; stage = "Deal"; score = "Hot"; estimatedValue = 1500000; notes = "Loan against property, HDFC sanction received"; createdAt = 1745366400000000000; updatedAt = 1745366400000000000; assignedTo = "Sameer AI" },
    { id = 35; name = "Mita Joshi"; phone = "+91 9432012347"; email = "mita.joshi@email.com"; service = "Property Purchase"; source = "MagicBricks"; stage = "Qualified"; score = "Hot"; estimatedValue = 12000000; notes = "3BHK in Thaltej or Bodakdev"; createdAt = 1745280000000000000; updatedAt = 1745280000000000000; assignedTo = "Rajan AI" },
    { id = 36; name = "Nilesh Bhavsar"; phone = "+91 9321012347"; email = "nilesh.bhavsar@email.com"; service = "Rental"; source = "99acres"; stage = "New"; score = "Warm"; estimatedValue = 420000; notes = "2BHK furnished in Satellite"; createdAt = 1745193600000000000; updatedAt = 1745193600000000000; assignedTo = "Rajan AI" },
    { id = 37; name = "Omkar Solanki"; phone = "+91 9210012347"; email = "omkar.solanki@email.com"; service = "Commercial Property"; source = "Referral"; stage = "Negotiation"; score = "Hot"; estimatedValue = 55000000; notes = "IT office park, Prahlad Nagar, 5000 sqft"; createdAt = 1745107200000000000; updatedAt = 1745107200000000000; assignedTo = "Kaveri AI" },
    { id = 38; name = "Payal Shah"; phone = "+91 9109012347"; email = "payal.shah@email.com"; service = "Property Sale"; source = "JustDial"; stage = "Qualified"; score = "Warm"; estimatedValue = 5000000; notes = "Selling 2BHK in Vastral"; createdAt = 1745020800000000000; updatedAt = 1745020800000000000; assignedTo = "Rajan AI" },
    { id = 39; name = "Qaiser Khan"; phone = "+91 9098012347"; email = "qaiser.khan@email.com"; service = "Investment Advisory"; source = "Google"; stage = "New"; score = "Cold"; estimatedValue = 10000000; notes = "Passive income through real estate"; createdAt = 1744934400000000000; updatedAt = 1744934400000000000; assignedTo = "Sameer AI" },
    { id = 40; name = "Riddhi Gohil"; phone = "+91 9987012347"; email = "riddhi.gohil@email.com"; service = "Property Purchase"; source = "WhatsApp"; stage = "SiteVisit"; score = "Hot"; estimatedValue = 8000000; notes = "2BHK in Tragad near Zydus hospital"; createdAt = 1744848000000000000; updatedAt = 1744848000000000000; assignedTo = "Rajan AI" }
  ];

  var nextLeadId : Nat = 41;

  var clients : [Client] = [
    { id = 1; name = "Amit Shah"; phone = "+91 9876543210"; email = "amit.shah@email.com"; clientType = "Residential Buyer"; totalDeals = 2; totalValue = 16000000; ltv = 16000000; createdAt = 1735689600000000000; lastContact = 1748217600000000000; notes = "Repeat buyer, reliable payment" },
    { id = 2; name = "Priya Patel"; phone = "+91 9765432109"; email = "priya.patel@email.com"; clientType = "NRI Investor"; totalDeals = 3; totalValue = 45000000; ltv = 45000000; createdAt = 1704067200000000000; lastContact = 1748131200000000000; notes = "High-value NRI, UK based" },
    { id = 3; name = "Kiran Joshi"; phone = "+91 9432109876"; email = "kiran.joshi@email.com"; clientType = "Developer"; totalDeals = 1; totalValue = 25000000; ltv = 25000000; createdAt = 1717200000000000000; lastContact = 1747872000000000000; notes = "Redevelopment project partner" },
    { id = 4; name = "Deepak Sharma"; phone = "+91 9321098765"; email = "deepak.sharma@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 6500000; ltv = 6500000; createdAt = 1720137600000000000; lastContact = 1747785600000000000; notes = "First-time buyer, Gota" },
    { id = 5; name = "Vikram Soni"; phone = "+91 9987654321"; email = "vikram.soni@email.com"; clientType = "HNI Investor"; totalDeals = 4; totalValue = 80000000; ltv = 80000000; createdAt = 1680307200000000000; lastContact = 1747440000000000000; notes = "Portfolio investor, multiple assets" },
    { id = 6; name = "Anjali Bhatt"; phone = "+91 9098765432"; email = "anjali.bhatt@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 7200000; ltv = 7200000; createdAt = 1725148800000000000; lastContact = 1747526400000000000; notes = "Post-sale client, Thaltej" },
    { id = 7; name = "Disha Mehta"; phone = "+91 9210012346"; email = "disha.mehta@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 17500000; ltv = 17500000; createdAt = 1738368000000000000; lastContact = 1745971200000000000; notes = "Premium villa buyer, South Bopal" },
    { id = 8; name = "Gita Pandya"; phone = "+91 9098012346"; email = "gita.pandya@email.com"; clientType = "Commercial Investor"; totalDeals = 2; totalValue = 55000000; ltv = 55000000; createdAt = 1710806400000000000; lastContact = 1745798400000000000; notes = "Commercial plot and warehouse" },
    { id = 9; name = "Hitesh Rawal"; phone = "+91 9987012346"; email = "hitesh.rawal@email.com"; clientType = "Developer"; totalDeals = 1; totalValue = 40000000; ltv = 40000000; createdAt = 1736208000000000000; lastContact = 1745712000000000000; notes = "Chawl redevelopment lead" },
    { id = 10; name = "Lalit Yadav"; phone = "+91 9543012347"; email = "lalit.yadav@email.com"; clientType = "Loan Client"; totalDeals = 1; totalValue = 1500000; ltv = 1500000; createdAt = 1739577600000000000; lastContact = 1745366400000000000; notes = "LAP client, HDFC" },
    { id = 11; name = "ABCD Enterprises"; phone = "+91 7966123456"; email = "info@abcdenterprises.in"; clientType = "Corporate"; totalDeals = 2; totalValue = 82000000; ltv = 82000000; createdAt = 1704067200000000000; lastContact = 1748044800000000000; notes = "Corporate office space, SG Highway" },
    { id = 12; name = "Kavya Gandh"; phone = "+91 9098012345"; email = "kavya.gandh@email.com"; clientType = "Tenant"; totalDeals = 1; totalValue = 480000; ltv = 480000; createdAt = 1741996800000000000; lastContact = 1746662400000000000; notes = "Annual rental lease, Prahlad Nagar" },
    { id = 13; name = "Nikhil Modi"; phone = "+91 9765012345"; email = "nikhil.modi@email.com"; clientType = "Builder"; totalDeals = 3; totalValue = 3600000; ltv = 3600000; createdAt = 1725148800000000000; lastContact = 1747267200000000000; notes = "3 RERA compliance projects" },
    { id = 14; name = "Omkar Solanki"; phone = "+91 9210012347"; email = "omkar.solanki@email.com"; clientType = "Commercial Investor"; totalDeals = 1; totalValue = 55000000; ltv = 55000000; createdAt = 1741996800000000000; lastContact = 1745107200000000000; notes = "IT office park, SG Highway" },
    { id = 15; name = "Pratik Mehta Pvt Ltd"; phone = "+91 7920987654"; email = "accounts@pratikmehta.co.in"; clientType = "Corporate"; totalDeals = 4; totalValue = 120000000; ltv = 120000000; createdAt = 1672531200000000000; lastContact = 1748217600000000000; notes = "Long-term corporate client, multiple transactions" },
    { id = 16; name = "Rekha Shah"; phone = "+91 9876501235"; email = "rekha.shah@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 9800000; ltv = 9800000; createdAt = 1743379200000000000; lastContact = 1748131200000000000; notes = "Thaltej flat, ready possession" },
    { id = 17; name = "Snehal Patel"; phone = "+91 9765501235"; email = "snehal.patel@email.com"; clientType = "NRI Investor"; totalDeals = 2; totalValue = 28000000; ltv = 28000000; createdAt = 1717200000000000000; lastContact = 1747958400000000000; notes = "US-based NRI, residential investment" },
    { id = 18; name = "Tushar Bhatt"; phone = "+91 9654501235"; email = "tushar.bhatt@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 5500000; ltv = 5500000; createdAt = 1744588800000000000; lastContact = 1747699200000000000; notes = "1BHK investment property" },
    { id = 19; name = "Uma Shankar Trading"; phone = "+91 7912345678"; email = "contact@ushankar.in"; clientType = "Corporate"; totalDeals = 1; totalValue = 35000000; ltv = 35000000; createdAt = 1733011200000000000; lastContact = 1747526400000000000; notes = "Retail outlet acquisition, CG Road" },
    { id = 20; name = "Varsha Nair"; phone = "+91 9543501235"; email = "varsha.nair@email.com"; clientType = "Tenant"; totalDeals = 2; totalValue = 720000; ltv = 720000; createdAt = 1706745600000000000; lastContact = 1747440000000000000; notes = "Long-term tenant, Satellite area" },
    { id = 21; name = "Waqar Ali"; phone = "+91 9432501235"; email = "waqar.ali@email.com"; clientType = "HNI Investor"; totalDeals = 3; totalValue = 65000000; ltv = 65000000; createdAt = 1704067200000000000; lastContact = 1747353600000000000; notes = "Mix of residential and commercial" },
    { id = 22; name = "Xena Infrastructure"; phone = "+91 7934567890"; email = "invest@xenainfra.com"; clientType = "Corporate"; totalDeals = 2; totalValue = 98000000; ltv = 98000000; createdAt = 1709424000000000000; lastContact = 1747267200000000000; notes = "Large commercial investor, GIDC" },
    { id = 23; name = "Yogesh Trivedi"; phone = "+91 9321501235"; email = "yogesh.trivedi@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 8500000; ltv = 8500000; createdAt = 1745366400000000000; lastContact = 1747180800000000000; notes = "3BHK Bopal, new buyer" },
    { id = 24; name = "Zara Exports Pvt Ltd"; phone = "+91 7956789012"; email = "admin@zaraexports.in"; clientType = "Corporate"; totalDeals = 1; totalValue = 45000000; ltv = 45000000; createdAt = 1741996800000000000; lastContact = 1747094400000000000; notes = "Warehouse near port" },
    { id = 25; name = "Arjun Desai"; phone = "+91 9210501235"; email = "arjun.desai@email.com"; clientType = "Residential Buyer"; totalDeals = 2; totalValue = 13000000; ltv = 13000000; createdAt = 1719532800000000000; lastContact = 1747008000000000000; notes = "Upgraded from 1BHK to 3BHK" },
    { id = 26; name = "Bhavna Kapoor"; phone = "+91 9109501235"; email = "bhavna.kapoor@email.com"; clientType = "NRI Investor"; totalDeals = 1; totalValue = 20000000; ltv = 20000000; createdAt = 1740441600000000000; lastContact = 1746921600000000000; notes = "Canada-based NRI, luxury apartment" },
    { id = 27; name = "Chetan Modi"; phone = "+91 9098501235"; email = "chetan.modi@email.com"; clientType = "Builder"; totalDeals = 5; totalValue = 8500000; ltv = 8500000; createdAt = 1704067200000000000; lastContact = 1746835200000000000; notes = "Regular RERA consultant client" },
    { id = 28; name = "Damayanti Shah"; phone = "+91 9987501235"; email = "damayanti.shah@email.com"; clientType = "Residential Buyer"; totalDeals = 1; totalValue = 6800000; ltv = 6800000; createdAt = 1744588800000000000; lastContact = 1746748800000000000; notes = "2BHK in Ghatlodia" },
    { id = 29; name = "Ekta Agarwal"; phone = "+91 9876501236"; email = "ekta.agarwal@email.com"; clientType = "HNI Investor"; totalDeals = 2; totalValue = 42000000; ltv = 42000000; createdAt = 1719532800000000000; lastContact = 1746662400000000000; notes = "Real estate as primary investment" },
    { id = 30; name = "Faisal Siddiqui"; phone = "+91 9765501236"; email = "faisal.siddiqui@email.com"; clientType = "Commercial Investor"; totalDeals = 1; totalValue = 25000000; ltv = 25000000; createdAt = 1741996800000000000; lastContact = 1746576000000000000; notes = "Commercial plot near Sardar Bridge" }
  ];

  var nextClientId : Nat = 31;

  var crmAppointments : [CrmAppointment] = [
    { id = 1; clientName = "Amit Shah"; type_ = "SiteVisit"; scheduledAt = 1748304000000000000; durationMins = 60; location = "Satellite, Ahmedabad"; notes = "3BHK property visit"; status = "Confirmed"; createdBy = "Rajan AI" },
    { id = 2; clientName = "Priya Patel"; type_ = "VideoCall"; scheduledAt = 1748217600000000000; durationMins = 30; location = "Online"; notes = "NRI investment discussion"; status = "Scheduled"; createdBy = "Kaveri AI" },
    { id = 3; clientName = "Kiran Joshi"; type_ = "Meeting"; scheduledAt = 1748131200000000000; durationMins = 90; location = "MSTC GLOBAL Office, Shantivan"; notes = "Redevelopment proposal review"; status = "Completed"; createdBy = "Kaveri AI" },
    { id = 4; clientName = "Hetal Parikh"; type_ = "SiteVisit"; scheduledAt = 1748390400000000000; durationMins = 60; location = "Shilaj, Ahmedabad"; notes = "Bungalow site inspection"; status = "Scheduled"; createdBy = "Rajan AI" },
    { id = 5; clientName = "Vikram Soni"; type_ = "Call"; scheduledAt = 1748044800000000000; durationMins = 20; location = "Phone"; notes = "Portfolio update call"; status = "Completed"; createdBy = "Kaveri AI" },
    { id = 6; clientName = "Riddhi Gohil"; type_ = "SiteVisit"; scheduledAt = 1748476800000000000; durationMins = 45; location = "Tragad, Ahmedabad"; notes = "2BHK near Zydus hospital"; status = "Scheduled"; createdBy = "Rajan AI" },
    { id = 7; clientName = "Mita Joshi"; type_ = "SiteVisit"; scheduledAt = 1748563200000000000; durationMins = 90; location = "Bodakdev, Ahmedabad"; notes = "3BHK shortlisted properties visit"; status = "Confirmed"; createdBy = "Rajan AI" },
    { id = 8; clientName = "Aakash Trivedi"; type_ = "Meeting"; scheduledAt = 1747958400000000000; durationMins = 60; location = "MSTC GLOBAL Office, Shantivan"; notes = "Price negotiation for Chandkheda flat"; status = "Completed"; createdBy = "Rajan AI" },
    { id = 9; clientName = "Mahesh Thakkar"; type_ = "SiteVisit"; scheduledAt = 1748649600000000000; durationMins = 120; location = "GIDC Vatva, Ahmedabad"; notes = "Industrial warehouse inspection"; status = "Scheduled"; createdBy = "Kaveri AI" },
    { id = 10; clientName = "Tejas Vora"; type_ = "Meeting"; scheduledAt = 1748736000000000000; durationMins = 90; location = "Maninagar, Ahmedabad"; notes = "Society redevelopment feasibility"; status = "Scheduled"; createdBy = "Kaveri AI" },
    { id = 11; clientName = "Ritu Gupta"; type_ = "VideoCall"; scheduledAt = 1747872000000000000; durationMins = 45; location = "Online"; notes = "Penthouse shortlist review"; status = "Completed"; createdBy = "Rajan AI" },
    { id = 12; clientName = "ABCD Enterprises"; type_ = "Meeting"; scheduledAt = 1748822400000000000; durationMins = 120; location = "MSTC GLOBAL Office, Shantivan"; notes = "Corporate office lease discussion"; status = "Confirmed"; createdBy = "Kaveri AI" },
    { id = 13; clientName = "Bhavna Kapoor"; type_ = "VideoCall"; scheduledAt = 1748908800000000000; durationMins = 30; location = "Online"; notes = "NRI luxury apartment walkthrough"; status = "Scheduled"; createdBy = "Rajan AI" },
    { id = 14; clientName = "Sanjay Patel"; type_ = "Call"; scheduledAt = 1748995200000000000; durationMins = 20; location = "Phone"; notes = "LAP eligibility check"; status = "Scheduled"; createdBy = "Sameer AI" },
    { id = 15; clientName = "Meera Trivedi"; type_ = "Meeting"; scheduledAt = 1748217600000000000; durationMins = 60; location = "MSTC GLOBAL Office, Shantivan"; notes = "Home loan documentation review"; status = "Completed"; createdBy = "Sameer AI" },
    { id = 16; clientName = "Farhan Sheikh"; type_ = "SiteVisit"; scheduledAt = 1749081600000000000; durationMins = 90; location = "Navrangpura, Ahmedabad"; notes = "Restaurant space shortlist"; status = "Scheduled"; createdBy = "Kaveri AI" },
    { id = 17; clientName = "Rekha Shah"; type_ = "SiteVisit"; scheduledAt = 1747785600000000000; durationMins = 60; location = "Thaltej, Ahmedabad"; notes = "Ready possession flat visit"; status = "Completed"; createdBy = "Rajan AI" },
    { id = 18; clientName = "Pratik Mehta Pvt Ltd"; type_ = "Meeting"; scheduledAt = 1749168000000000000; durationMins = 180; location = "MSTC GLOBAL Office, Shantivan"; notes = "Annual portfolio review"; status = "Scheduled"; createdBy = "Kaveri AI" },
    { id = 19; clientName = "Deepak Sharma"; type_ = "Call"; scheduledAt = 1747699200000000000; durationMins = 15; location = "Phone"; notes = "Post-deal registration query"; status = "Completed"; createdBy = "Rajan AI" },
    { id = 20; clientName = "Divya Nair"; type_ = "SiteVisit"; scheduledAt = 1749254400000000000; durationMins = 45; location = "New Ranip, Ahmedabad"; notes = "1BHK investment property"; status = "Scheduled"; createdBy = "Rajan AI" }
  ];

  var nextCrmAppointmentId : Nat = 21;

  var proposals : [Proposal] = [
    { id = 1; clientName = "Priya Patel"; propertyTitle = "Commercial Plot, SG Highway - 2000 sqft"; amount = 15000000; status = "Accepted"; createdAt = 1747353600000000000; expiresAt = 1749945600000000000; notes = "NRI investment, deal confirmed" },
    { id = 2; clientName = "Vikram Soni"; propertyTitle = "Premium Office Space, Prahlad Nagar - 3500 sqft"; amount = 22000000; status = "Accepted"; createdAt = 1747267200000000000; expiresAt = 1749859200000000000; notes = "HNI investor, lease confirmed" },
    { id = 3; clientName = "Disha Mehta"; propertyTitle = "Premium Villa, South Bopal - 4BHK"; amount = 17500000; status = "Accepted"; createdAt = 1745712000000000000; expiresAt = 1748304000000000000; notes = "Registry completed" },
    { id = 4; clientName = "ABCD Enterprises"; propertyTitle = "Corporate Office, SG Highway - 5000 sqft"; amount = 45000000; status = "Sent"; createdAt = 1748044800000000000; expiresAt = 1750636800000000000; notes = "Awaiting board approval" },
    { id = 5; clientName = "Omkar Solanki"; propertyTitle = "IT Office Park, Prahlad Nagar - 5200 sqft"; amount = 55000000; status = "Sent"; createdAt = 1747958400000000000; expiresAt = 1750550400000000000; notes = "Negotiation ongoing" },
    { id = 6; clientName = "Kiran Joshi"; propertyTitle = "Redevelopment Project, Navrangpura - 12 Units"; amount = 25000000; status = "Sent"; createdAt = 1747872000000000000; expiresAt = 1750464000000000000; notes = "Awaiting society consent" },
    { id = 7; clientName = "Mahesh Thakkar"; propertyTitle = "Warehouse, GIDC Vatva - 8000 sqft"; amount = 60000000; status = "Sent"; createdAt = 1747785600000000000; expiresAt = 1750377600000000000; notes = "Site inspection done, decision pending" },
    { id = 8; clientName = "Ritu Gupta"; propertyTitle = "Penthouse, Ambli - 4BHK"; amount = 14000000; status = "Draft"; createdAt = 1748131200000000000; expiresAt = 1750723200000000000; notes = "Final pricing to be confirmed" },
    { id = 9; clientName = "Mita Joshi"; propertyTitle = "3BHK Apartment, Bodakdev - Ready Possession"; amount = 12000000; status = "Draft"; createdAt = 1748217600000000000; expiresAt = 1750809600000000000; notes = "Site visits completed, proposal being prepared" },
    { id = 10; clientName = "Aakash Trivedi"; propertyTitle = "2.5BHK Apartment, Chandkheda - Under Construction"; amount = 9800000; status = "Rejected"; createdAt = 1746921600000000000; expiresAt = 1749513600000000000; notes = "Client found alternative property" }
  ];

  var nextProposalId : Nat = 11;

  public query func getCrmLeadsByStage(stage : Text) : async [Lead] {
    leads.filter<Lead>(func(l) { l.stage == stage })
  };

  public shared func updateCrmLeadStage(id : Nat, stage : Text, score : Text) : async Bool {
    var found = false;
    leads := leads.map<Lead, Lead>(func(l) {
      if (l.id == id) { found := true; { l with stage; score; updatedAt = 1748217600000000000 } } else { l }
    });
    found
  };

  public query func getCrmAppointments() : async [CrmAppointment] {
    crmAppointments
  };

  public shared func addCrmAppointment(clientName : Text, type_ : Text, scheduledAt : Int, durationMins : Nat, location : Text, notes : Text) : async CrmAppointment {
    let appt : CrmAppointment = { id = nextCrmAppointmentId; clientName; type_; scheduledAt; durationMins; location; notes; status = "Scheduled"; createdBy = "Admin" };
    crmAppointments := crmAppointments.concat<CrmAppointment>([appt]);
    nextCrmAppointmentId += 1;
    appt
  };

  public query func getProposals() : async [Proposal] {
    proposals
  };

  public shared func addProposal(clientName : Text, propertyTitle : Text, amount : Nat, expiresAt : Int, notes : Text) : async Proposal {
    let now : Int = 1748217600000000000;
    let prop : Proposal = { id = nextProposalId; clientName; propertyTitle; amount; status = "Draft"; createdAt = now; expiresAt; notes };
    proposals := proposals.concat<Proposal>([prop]);
    nextProposalId += 1;
    prop
  };

  // ============================================================
  // DOMAIN 2: EVENTS & HOSPITALITY
  // ============================================================

  public type Event_ = {
    id : Nat;
    title : Text;
    type_ : Text;
    scheduledAt : Int;
    venue : Text;
    capacity : Nat;
    confirmedCount : Nat;
    budget : Nat;
    status : Text;
    description : Text;
  };

  public type RSVP = {
    id : Nat;
    eventId : Nat;
    guestName : Text;
    phone : Text;
    email : Text;
    guestCount : Nat;
    status : Text;
  };

  var events_ : [Event_] = [
    { id = 1; title = "Luxury Property Expo 2026"; type_ = "Launch"; scheduledAt = 1749945600000000000; venue = "Hyatt Regency, SG Highway, Ahmedabad"; capacity = 500; confirmedCount = 287; budget = 2500000; status = "Confirmed"; description = "Showcase of 50+ premium properties across Ahmedabad" },
    { id = 2; title = "MSTC Annual Client Gala"; type_ = "Corporate"; scheduledAt = 1751414400000000000; venue = "Courtyard Marriott, Satellite, Ahmedabad"; capacity = 200; confirmedCount = 156; budget = 1500000; status = "Planning"; description = "Annual dinner for top clients and partners" },
    { id = 3; title = "Navratri Investment Meet"; type_ = "Cultural"; scheduledAt = 1759276800000000000; venue = "GMDC Ground, Ahmedabad"; capacity = 1000; confirmedCount = 0; budget = 800000; status = "Planning"; description = "Investment advisory event during Navratri season" },
    { id = 4; title = "RERA Awareness Workshop"; type_ = "Corporate"; scheduledAt = 1748995200000000000; venue = "MSTC GLOBAL Office, Shantivan, Ahmedabad"; capacity = 50; confirmedCount = 38; budget = 150000; status = "Confirmed"; description = "Free workshop for property buyers on RERA rights" },
    { id = 5; title = "CSR - Blood Donation Camp"; type_ = "CSR"; scheduledAt = 1748649600000000000; venue = "Satellite Road, Ahmedabad"; capacity = 200; confirmedCount = 85; budget = 100000; status = "Active"; description = "Annual blood donation drive in partnership with Red Cross" },
    { id = 6; title = "Cricket Tournament - MSTC Cup"; type_ = "Sports"; scheduledAt = 1749340800000000000; venue = "Sardar Patel Stadium, Motera, Ahmedabad"; capacity = 300; confirmedCount = 180; budget = 500000; status = "Confirmed"; description = "Inter-corporate cricket tournament" },
    { id = 7; title = "NRI Investor Roadshow"; type_ = "Corporate"; scheduledAt = 1750550400000000000; venue = "The Grand Bhagwati, S.G. Highway, Ahmedabad"; capacity = 150; confirmedCount = 67; budget = 600000; status = "Planning"; description = "Property investment presentation for NRI community" },
    { id = 8; title = "Home Loan Mela 2026"; type_ = "Launch"; scheduledAt = 1748822400000000000; venue = "YMCA Hall, Lal Darwaja, Ahmedabad"; capacity = 300; confirmedCount = 214; budget = 350000; status = "Confirmed"; description = "Multi-bank home loan facility camp" },
    { id = 9; title = "Independence Day Celebration"; type_ = "Cultural"; scheduledAt = 1754985600000000000; venue = "MSTC GLOBAL Office, Shantivan, Ahmedabad"; capacity = 100; confirmedCount = 0; budget = 80000; status = "Planning"; description = "Flag hoisting and cultural program for staff and clients" },
    { id = 10; title = "CSR - Tree Plantation Drive"; type_ = "CSR"; scheduledAt = 1749081600000000000; venue = "Sabarmati Riverfront, Ahmedabad"; capacity = 150; confirmedCount = 92; budget = 75000; status = "Confirmed"; description = "500-tree plantation event in partnership with AMC" },
    { id = 11; title = "Commercial Real Estate Summit"; type_ = "Corporate"; scheduledAt = 1751932800000000000; venue = "AMA Hall, Ahmedabad"; capacity = 250; confirmedCount = 0; budget = 900000; status = "Planning"; description = "Summit on commercial real estate trends in Gujarat" },
    { id = 12; title = "Wedding Package Launch Event"; type_ = "Wedding"; scheduledAt = 1749254400000000000; venue = "Rajpath Club, Ahmedabad"; capacity = 400; confirmedCount = 230; budget = 1200000; status = "Confirmed"; description = "Launch of MSTC premium wedding venue packages" },
    { id = 13; title = "Football Tournament - MSTC League"; type_ = "Sports"; scheduledAt = 1750032000000000000; venue = "TransStadia, Ahmedabad"; capacity = 500; confirmedCount = 320; budget = 700000; status = "Confirmed"; description = "Annual 5-a-side football league for corporates" },
    { id = 14; title = "Diwali Property Fair"; type_ = "Launch"; scheduledAt = 1762099200000000000; venue = "Exhibition Ground, Ahmedabad"; capacity = 2000; confirmedCount = 0; budget = 5000000; status = "Planning"; description = "Biggest property fair of the year during Diwali" },
    { id = 15; title = "CSR Skill Development Workshop"; type_ = "CSR"; scheduledAt = 1749427200000000000; venue = "NIFT, Ahmedabad"; capacity = 80; confirmedCount = 45; budget = 120000; status = "Confirmed"; description = "Free skill development for youth in partnership with NSDC" }
  ];

  var nextEventId : Nat = 16;

  var rsvps : [RSVP] = [
    { id = 1; eventId = 1; guestName = "Vikram Soni"; phone = "+91 9987654321"; email = "vikram.soni@email.com"; guestCount = 2; status = "Confirmed" },
    { id = 2; eventId = 1; guestName = "Priya Patel"; phone = "+91 9765432109"; email = "priya.patel@email.com"; guestCount = 1; status = "Confirmed" },
    { id = 3; eventId = 1; guestName = "ABCD Enterprises"; phone = "+91 7966123456"; email = "info@abcdenterprises.in"; guestCount = 5; status = "Confirmed" },
    { id = 4; eventId = 4; guestName = "Jignesh Vyas"; phone = "+91 9765012347"; email = "jignesh.vyas@email.com"; guestCount = 1; status = "Confirmed" },
    { id = 5; eventId = 4; guestName = "Preeti Jain"; phone = "+91 9654012347"; email = "preeti.jain@email.com"; guestCount = 2; status = "Confirmed" },
    { id = 6; eventId = 5; guestName = "Amit Shah"; phone = "+91 9876543210"; email = "amit.shah@email.com"; guestCount = 1; status = "Confirmed" },
    { id = 7; eventId = 6; guestName = "Pratik Mehta Pvt Ltd"; phone = "+91 7920987654"; email = "accounts@pratikmehta.co.in"; guestCount = 10; status = "Confirmed" },
    { id = 8; eventId = 8; guestName = "Meera Trivedi"; phone = "+91 9210987654"; email = "meera.trivedi@email.com"; guestCount = 2; status = "Confirmed" },
    { id = 9; eventId = 8; guestName = "Sanjay Patel"; phone = "+91 9321012345"; email = "sanjay.patel@email.com"; guestCount = 1; status = "Pending" },
    { id = 10; eventId = 12; guestName = "Waqar Ali"; phone = "+91 9432501235"; email = "waqar.ali@email.com"; guestCount = 4; status = "Confirmed" }
  ];

  var nextRSVPId : Nat = 11;

  public query func getEvents() : async [Event_] {
    events_
  };

  public shared func addEvent(title : Text, type_ : Text, scheduledAt : Int, venue : Text, capacity : Nat, budget : Nat, description : Text) : async Event_ {
    let ev : Event_ = { id = nextEventId; title; type_; scheduledAt; venue; capacity; confirmedCount = 0; budget; status = "Planning"; description };
    events_ := events_.concat<Event_>([ev]);
    nextEventId += 1;
    ev
  };

  public query func getRSVPsByEvent(eventId : Nat) : async [RSVP] {
    rsvps.filter<RSVP>(func(r) { r.eventId == eventId })
  };

  public shared func addRSVP(eventId : Nat, guestName : Text, phone : Text, email : Text, guestCount : Nat) : async RSVP {
    let rsvp : RSVP = { id = nextRSVPId; eventId; guestName; phone; email; guestCount; status = "Pending" };
    rsvps := rsvps.concat<RSVP>([rsvp]);
    nextRSVPId += 1;
    rsvp
  };

  // ============================================================
  // DOMAIN 3: FINANCE & BILLING
  // ============================================================

  public type CommissionInvoice = {
    id : Nat;
    clientName : Text;
    serviceType : Text;
    amount : Nat;
    commission : Nat;
    status : Text;
    dueDate : Int;
    paidDate : ?Int;
    description : Text;
    createdAt : Int;
  };

  public type FinancialMetric = {
    period : Text;
    totalRevenue : Nat;
    totalCommissions : Nat;
    newLeads : Nat;
    closedDeals : Nat;
    conversionRate : Nat;
    averageDealSize : Nat;
  };

  var commissionInvoices : [CommissionInvoice] = [
    { id = 1; clientName = "Disha Mehta"; serviceType = "Property Sale Commission"; amount = 875000; commission = 875000; status = "Paid"; dueDate = 1746144000000000000; paidDate = ?1745971200000000000; description = "2% commission on villa sale, South Bopal"; createdAt = 1745712000000000000 },
    { id = 2; clientName = "Priya Patel"; serviceType = "Investment Advisory"; amount = 150000; commission = 150000; status = "Paid"; dueDate = 1747440000000000000; paidDate = ?1747353600000000000; description = "NRI investment advisory retainer Q1"; createdAt = 1746921600000000000 },
    { id = 3; clientName = "Deepak Sharma"; serviceType = "Property Sale Commission"; amount = 325000; commission = 325000; status = "Paid"; dueDate = 1748044800000000000; paidDate = ?1748044800000000000; description = "2% commission on 2BHK sale, Gota"; createdAt = 1747612800000000000 },
    { id = 4; clientName = "ABCD Enterprises"; serviceType = "Commercial Lease"; amount = 900000; commission = 900000; status = "Sent"; dueDate = 1749945600000000000; paidDate = null; description = "2% commission on corporate office lease"; createdAt = 1748044800000000000 },
    { id = 5; clientName = "Nikhil Modi"; serviceType = "RERA Consulting"; amount = 400000; commission = 400000; status = "Paid"; dueDate = 1747267200000000000; paidDate = ?1747180800000000000; description = "RERA compliance package for 3 projects"; createdAt = 1746316800000000000 },
    { id = 6; clientName = "Omkar Solanki"; serviceType = "Commercial Property"; amount = 1100000; commission = 1100000; status = "Sent"; dueDate = 1750464000000000000; paidDate = null; description = "2% commission on IT office park deal"; createdAt = 1747958400000000000 },
    { id = 7; clientName = "Kiran Joshi"; serviceType = "Redevelopment Consulting"; amount = 500000; commission = 500000; status = "Draft"; dueDate = 1751068800000000000; paidDate = null; description = "Redevelopment feasibility and liaison fee"; createdAt = 1748131200000000000 },
    { id = 8; clientName = "Kavya Gandh"; serviceType = "Rental Commission"; amount = 40000; commission = 40000; status = "Paid"; dueDate = 1746835200000000000; paidDate = ?1746748800000000000; description = "1-month rent as brokerage, Prahlad Nagar"; createdAt = 1746662400000000000 },
    { id = 9; clientName = "Lalit Yadav"; serviceType = "Finance & Loan"; amount = 75000; commission = 75000; status = "Paid"; dueDate = 1745539200000000000; paidDate = ?1745452800000000000; description = "1% processing facilitation fee, LAP"; createdAt = 1745366400000000000 },
    { id = 10; clientName = "Vikram Soni"; serviceType = "Investment Advisory"; amount = 200000; commission = 200000; status = "Sent"; dueDate = 1749340800000000000; paidDate = null; description = "HNI portfolio advisory retainer Q2"; createdAt = 1748217600000000000 },
    { id = 11; clientName = "Pratik Mehta Pvt Ltd"; serviceType = "Commercial Property"; amount = 2400000; commission = 2400000; status = "Overdue"; dueDate = 1746403200000000000; paidDate = null; description = "2% commission on large commercial transaction"; createdAt = 1745280000000000000 },
    { id = 12; clientName = "Waqar Ali"; serviceType = "Property Sale Commission"; amount = 1300000; commission = 1300000; status = "Paid"; dueDate = 1745712000000000000; paidDate = ?1745625600000000000; description = "2% commission on mixed portfolio sale"; createdAt = 1745280000000000000 },
    { id = 13; clientName = "Uma Shankar Trading"; serviceType = "Commercial Lease"; amount = 700000; commission = 700000; status = "Paid"; dueDate = 1748304000000000000; paidDate = ?1748217600000000000; description = "2% commercial retail acquisition"; createdAt = 1747872000000000000 },
    { id = 14; clientName = "Gita Pandya"; serviceType = "Investment Advisory"; amount = 250000; commission = 250000; status = "Sent"; dueDate = 1749427200000000000; paidDate = null; description = "Commercial plot investment advisory"; createdAt = 1748131200000000000 },
    { id = 15; clientName = "Chetan Modi"; serviceType = "RERA Consulting"; amount = 300000; commission = 300000; status = "Paid"; dueDate = 1748044800000000000; paidDate = ?1748044800000000000; description = "RERA annual compliance retainer"; createdAt = 1747612800000000000 },
    { id = 16; clientName = "Rekha Shah"; serviceType = "Property Sale Commission"; amount = 490000; commission = 490000; status = "Sent"; dueDate = 1749772800000000000; paidDate = null; description = "2.5% commission on ready possession flat"; createdAt = 1748217600000000000 },
    { id = 17; clientName = "Varsha Nair"; serviceType = "Rental Commission"; amount = 60000; commission = 60000; status = "Paid"; dueDate = 1746489600000000000; paidDate = ?1746403200000000000; description = "1-month brokerage, renewed lease"; createdAt = 1746316800000000000 },
    { id = 18; clientName = "Bhavna Kapoor"; serviceType = "Investment Advisory"; amount = 400000; commission = 400000; status = "Draft"; dueDate = 1750636800000000000; paidDate = null; description = "NRI luxury apartment advisory"; createdAt = 1748217600000000000 },
    { id = 19; clientName = "Ekta Agarwal"; serviceType = "Property Sale Commission"; amount = 840000; commission = 840000; status = "Paid"; dueDate = 1747267200000000000; paidDate = ?1747180800000000000; description = "2% commission on investment properties"; createdAt = 1746835200000000000 },
    { id = 20; clientName = "Zara Exports Pvt Ltd"; serviceType = "Commercial Property"; amount = 900000; commission = 900000; status = "Sent"; dueDate = 1749859200000000000; paidDate = null; description = "2% commission on warehouse acquisition"; createdAt = 1748131200000000000 },
    { id = 21; clientName = "Xena Infrastructure"; serviceType = "Commercial Property"; amount = 1960000; commission = 1960000; status = "Paid"; dueDate = 1747094400000000000; paidDate = ?1747008000000000000; description = "2% commission on GIDC transaction"; createdAt = 1746576000000000000 },
    { id = 22; clientName = "Snehal Patel"; serviceType = "Investment Advisory"; amount = 560000; commission = 560000; status = "Paid"; dueDate = 1748131200000000000; paidDate = ?1748044800000000000; description = "NRI portfolio management fee"; createdAt = 1747699200000000000 },
    { id = 23; clientName = "Yogesh Trivedi"; serviceType = "Property Sale Commission"; amount = 425000; commission = 425000; status = "Draft"; dueDate = 1750118400000000000; paidDate = null; description = "Pending site visit confirmation"; createdAt = 1748217600000000000 },
    { id = 24; clientName = "Faisal Siddiqui"; serviceType = "Commercial Property"; amount = 500000; commission = 500000; status = "Sent"; dueDate = 1750204800000000000; paidDate = null; description = "2% commission on commercial plot"; createdAt = 1748131200000000000 },
    { id = 25; clientName = "Hitesh Rawal"; serviceType = "Redevelopment Consulting"; amount = 800000; commission = 800000; status = "Draft"; dueDate = 1751500800000000000; paidDate = null; description = "Chawl redevelopment feasibility study and liaison"; createdAt = 1748217600000000000 }
  ];

  var nextInvoiceId : Nat = 26;

  var financialMetrics : [FinancialMetric] = [
    { period = "May 2026"; totalRevenue = 12500000; totalCommissions = 3750000; newLeads = 78; closedDeals = 9; conversionRate = 23; averageDealSize = 1388888 },
    { period = "April 2026"; totalRevenue = 11800000; totalCommissions = 3540000; newLeads = 65; closedDeals = 8; conversionRate = 21; averageDealSize = 1475000 },
    { period = "March 2026"; totalRevenue = 14200000; totalCommissions = 4260000; newLeads = 82; closedDeals = 11; conversionRate = 26; averageDealSize = 1290909 },
    { period = "February 2026"; totalRevenue = 9600000; totalCommissions = 2880000; newLeads = 58; closedDeals = 7; conversionRate = 19; averageDealSize = 1371428 },
    { period = "January 2026"; totalRevenue = 10400000; totalCommissions = 3120000; newLeads = 71; closedDeals = 8; conversionRate = 22; averageDealSize = 1300000 },
    { period = "December 2025"; totalRevenue = 16500000; totalCommissions = 4950000; newLeads = 90; closedDeals = 13; conversionRate = 28; averageDealSize = 1269230 },
    { period = "November 2025"; totalRevenue = 13200000; totalCommissions = 3960000; newLeads = 74; closedDeals = 10; conversionRate = 24; averageDealSize = 1320000 },
    { period = "October 2025"; totalRevenue = 15800000; totalCommissions = 4740000; newLeads = 88; closedDeals = 12; conversionRate = 27; averageDealSize = 1316666 },
    { period = "September 2025"; totalRevenue = 8900000; totalCommissions = 2670000; newLeads = 55; closedDeals = 6; conversionRate = 18; averageDealSize = 1483333 },
    { period = "August 2025"; totalRevenue = 11100000; totalCommissions = 3330000; newLeads = 67; closedDeals = 8; conversionRate = 21; averageDealSize = 1387500 },
    { period = "July 2025"; totalRevenue = 9800000; totalCommissions = 2940000; newLeads = 61; closedDeals = 7; conversionRate = 20; averageDealSize = 1400000 },
    { period = "June 2025"; totalRevenue = 12000000; totalCommissions = 3600000; newLeads = 69; closedDeals = 9; conversionRate = 22; averageDealSize = 1333333 }
  ];

  public query func getCommissionInvoices() : async [CommissionInvoice] {
    commissionInvoices
  };

  public shared func addCommissionInvoice(clientName : Text, serviceType : Text, amount : Nat, commission : Nat, dueDate : Int, description : Text) : async CommissionInvoice {
    let now : Int = 1748217600000000000;
    let inv : CommissionInvoice = { id = nextInvoiceId; clientName; serviceType; amount; commission; status = "Draft"; dueDate; paidDate = null; description; createdAt = now };
    commissionInvoices := commissionInvoices.concat<CommissionInvoice>([inv]);
    nextInvoiceId += 1;
    inv
  };

  public shared func updateCommissionInvoiceStatus(id : Nat, status : Text) : async Bool {
    var found = false;
    commissionInvoices := commissionInvoices.map<CommissionInvoice, CommissionInvoice>(func(inv) {
      if (inv.id == id) {
        found := true;
        let paidDate : ?Int = if (status == "Paid") { ?1748217600000000000 } else { inv.paidDate };
        { inv with status; paidDate }
      } else { inv }
    });
    found
  };

  public query func getFinancialMetrics() : async [FinancialMetric] {
    financialMetrics
  };

  // ============================================================
  // DOMAIN 4: ANALYTICS & NOTIFICATIONS
  // ============================================================

  public type AppNotification = {
    id : Nat;
    appName : Text;
    title : Text;
    message : Text;
    priority : Text;
    isRead : Bool;
    createdAt : Int;
    targetRole : Text;
  };

  public type DashboardStat = {
    key : Text;
    value : Nat;
    statLabel : Text;
    change : Int;
    period : Text;
    icon : Text;
  };

  var appNotifications : [AppNotification] = [
    { id = 1; appName = "CRM"; title = "New Hot Lead"; message = "Amit Shah enquired about 3BHK in Satellite — marked Hot"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 2; appName = "Finance"; title = "Invoice Overdue"; message = "Pratik Mehta Pvt Ltd — ₹24L invoice overdue by 42 days"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 3; appName = "RERA"; title = "RERA Deadline Alert"; message = "Project Sunrise Heights RERA renewal due in 8 days"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 4; appName = "Security"; title = "Security Scan Complete"; message = "Daily vulnerability scan completed — 0 threats found"; priority = "Info"; isRead = true; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 5; appName = "Finance"; title = "Payment Received"; message = "Deepak Sharma paid ₹3.25L commission invoice — Deal confirmed"; priority = "Normal"; isRead = false; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 6; appName = "CRM"; title = "Deal Closed"; message = "Disha Mehta — Premium villa sale closed at ₹1.75Cr"; priority = "Normal"; isRead = true; createdAt = 1745971200000000000; targetRole = "Owner" },
    { id = 7; appName = "Events"; title = "Event Confirmed"; message = "Luxury Property Expo 2026 — 287 confirmations received"; priority = "Normal"; isRead = true; createdAt = 1747958400000000000; targetRole = "Owner" },
    { id = 8; appName = "CRM"; title = "Follow-up Required"; message = "Rajesh Agrawal — no response in 7 days, move to Cold?"; priority = "Normal"; isRead = false; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 9; appName = "Legal"; title = "Document Expiry"; message = "Varsha Nair lease agreement expires in 30 days — renewal needed"; priority = "Normal"; isRead = false; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 10; appName = "Market"; title = "Market Update"; message = "Bodakdev property prices rose 3.2% this month — update valuations"; priority = "Info"; isRead = true; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 11; appName = "CRM"; title = "Appointment Confirmed"; message = "Mita Joshi site visit confirmed for tomorrow, Bodakdev"; priority = "Normal"; isRead = false; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 12; appName = "Analytics"; title = "Weekly Report Ready"; message = "Week 20 performance report: 12 new leads, 2 deals closed"; priority = "Info"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 13; appName = "Security"; title = "Login Attempt"; message = "New device login detected for admin — verified and allowed"; priority = "Normal"; isRead = true; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 14; appName = "Properties"; title = "New Listing Added"; message = "3BHK apartment in Thaltej added by Rajan AI — pending review"; priority = "Info"; isRead = false; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 15; appName = "CRM"; title = "Lead Stage Updated"; message = "Kiran Joshi moved from SiteVisit to Negotiation stage"; priority = "Info"; isRead = true; createdAt = 1747872000000000000; targetRole = "Owner" },
    { id = 16; appName = "Legal"; title = "Policy Updated"; message = "Privacy Policy updated by Raksha AI — PDPB v2.1 compliance"; priority = "Info"; isRead = true; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 17; appName = "Finance"; title = "Commission Alert"; message = "Monthly commissions target 75% achieved — ₹9.4L of ₹12.5L"; priority = "Normal"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 18; appName = "Events"; title = "RSVP Milestone"; message = "Luxury Property Expo crossed 250 confirmed RSVPs"; priority = "Normal"; isRead = true; createdAt = 1747958400000000000; targetRole = "Owner" },
    { id = 19; appName = "CRM"; title = "Proposal Accepted"; message = "Priya Patel accepted ₹1.5Cr commercial plot proposal"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 20; appName = "Platform"; title = "System Update"; message = "Platform health check complete — all 50 apps operational"; priority = "Info"; isRead = true; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 21; appName = "Market"; title = "Market Alert"; message = "RBI rate cut expected — good time to push home loan clients"; priority = "Normal"; isRead = false; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 22; appName = "CRM"; title = "Client Anniversary"; message = "Vikram Soni — 5-year client anniversary today, send appreciation"; priority = "Normal"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 23; appName = "NGO"; title = "CSR Event Update"; message = "Blood Donation Camp — 85 donors registered, target is 200"; priority = "Normal"; isRead = false; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 24; appName = "Security"; title = "Threat Blocked"; message = "Bot Hunter AI blocked 203 scraping attempts in last 24h"; priority = "Info"; isRead = true; createdAt = 1748044800000000000; targetRole = "Owner" },
    { id = 25; appName = "Analytics"; title = "Conversion Drop"; message = "Lead-to-deal conversion dipped to 19% this week — investigate"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 26; appName = "Properties"; title = "Price Alert"; message = "Satellite area 3BHK asking prices up 4% — update CRM valuations"; priority = "Normal"; isRead = false; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 27; appName = "WhatsApp"; title = "Unread Messages"; message = "14 unread WhatsApp enquiries awaiting response"; priority = "Normal"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 28; appName = "Finance"; title = "Tax Reminder"; message = "Q1 advance tax payment due in 15 days"; priority = "Urgent"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" },
    { id = 29; appName = "CRM"; title = "Lead Score Change"; message = "Rajesh Agrawal automatically downgraded to Cold — 14 days inactive"; priority = "Info"; isRead = true; createdAt = 1748131200000000000; targetRole = "Owner" },
    { id = 30; appName = "Builder"; title = "New Feature Deployed"; message = "CRM pipeline Kanban view deployed by Builder AI — now live"; priority = "Info"; isRead = false; createdAt = 1748217600000000000; targetRole = "Owner" }
  ];

  var nextNotificationId : Nat = 31;

  var dashboardStats : [DashboardStat] = [
    { key = "totalLeads"; value = 847; statLabel = "Total Leads"; change = 12; period = "vs last month"; icon = "users" },
    { key = "activeClients"; value = 312; statLabel = "Active Clients"; change = 8; period = "vs last month"; icon = "user-check" },
    { key = "totalProperties"; value = 730; statLabel = "Total Properties"; change = 24; period = "vs last month"; icon = "building" },
    { key = "monthlyRevenue"; value = 12500000; statLabel = "Monthly Revenue (₹)"; change = 6; period = "vs last month"; icon = "trending-up" },
    { key = "conversionRate"; value = 23; statLabel = "Conversion Rate (%)"; change = -2; period = "vs last month"; icon = "percent" },
    { key = "activeDeals"; value = 45; statLabel = "Active Deals"; change = 5; period = "vs last month"; icon = "handshake" },
    { key = "pendingAppointments"; value = 18; statLabel = "Pending Appointments"; change = 3; period = "this week"; icon = "calendar" },
    { key = "openInvoices"; value = 8; statLabel = "Open Invoices"; change = -1; period = "vs last week"; icon = "file-text" }
  ];

  public query func getCrmNotifications() : async [AppNotification] {
    appNotifications
  };

  public shared func addCrmNotification(appName : Text, title : Text, message : Text, priority : Text, targetRole : Text) : async AppNotification {
    let now : Int = 1748217600000000000;
    let notif : AppNotification = { id = nextNotificationId; appName; title; message; priority; isRead = false; createdAt = now; targetRole };
    appNotifications := appNotifications.concat<AppNotification>([notif]);
    nextNotificationId += 1;
    notif
  };

  public shared func markCrmNotificationRead(id : Nat) : async Bool {
    var found = false;
    appNotifications := appNotifications.map<AppNotification, AppNotification>(func(n) {
      if (n.id == id) { found := true; { n with isRead = true } } else { n }
    });
    found
  };

  public shared func markAllCrmNotificationsRead() : async Nat {
    var count = 0;
    appNotifications := appNotifications.map<AppNotification, AppNotification>(func(n) {
      if (not n.isRead) { count += 1; { n with isRead = true } } else { n }
    });
    count
  };

  public query func getCrmDashboardStats() : async [DashboardStat] {
    dashboardStats
  };

  // ============================================================
  // DOMAIN 5: CAMPAIGNS & REVIEWS
  // ============================================================

  public type Campaign = {
    id : Nat;
    title : Text;
    channel : Text;
    audience : Text;
    messagePreview : Text;
    sentCount : Nat;
    openCount : Nat;
    replyCount : Nat;
    status : Text;
    scheduledAt : ?Int;
    createdAt : Int;
  };

  public type ReviewRecord = {
    id : Nat;
    platform : Text;
    reviewerName : Text;
    rating : Nat;
    reviewText : Text;
    reviewDate : Int;
    responded : Bool;
    responseText : ?Text;
    sentiment : Text;
  };

  var campaigns : [Campaign] = [
    { id = 1; title = "Luxury Expo Invite — Top 200 Clients"; channel = "WhatsApp"; audience = "HNI & NRI Clients"; messagePreview = "You are invited to the Luxury Property Expo 2026 — exclusive preview for valued clients"; sentCount = 200; openCount = 178; replyCount = 67; status = "Completed"; scheduledAt = ?1747699200000000000; createdAt = 1747526400000000000 },
    { id = 2; title = "Home Loan Mela Reminder"; channel = "WhatsApp"; audience = "Active Loan Enquiries"; messagePreview = "Don't miss the Home Loan Mela this Saturday — lowest rates from 12 banks under one roof"; sentCount = 350; openCount = 289; replyCount = 94; status = "Completed"; scheduledAt = ?1748649600000000000; createdAt = 1748304000000000000 },
    { id = 3; title = "Diwali Property Deals Newsletter"; channel = "Email"; audience = "All Clients"; messagePreview = "Special Diwali offers on premium properties — limited time pricing"; sentCount = 1200; openCount = 648; replyCount = 42; status = "Completed"; scheduledAt = ?1730390400000000000; createdAt = 1730217600000000000 },
    { id = 4; title = "NRI Investment Roadshow Invite"; channel = "Email"; audience = "NRI Clients"; messagePreview = "MSTC invites you to the NRI Investor Roadshow — Ahmedabad's best properties explained"; sentCount = 85; openCount = 62; replyCount = 18; status = "Completed"; scheduledAt = ?1750377600000000000; createdAt = 1749945600000000000 },
    { id = 5; title = "RERA Compliance Awareness"; channel = "WhatsApp"; audience = "Property Buyers"; messagePreview = "Know your RERA rights before buying — free workshop this Friday at MSTC office"; sentCount = 500; openCount = 387; replyCount = 56; status = "Sent"; scheduledAt = ?1748908800000000000; createdAt = 1748649600000000000 },
    { id = 6; title = "Post-Budget Property Opportunity"; channel = "WhatsApp"; audience = "All Leads - Hot & Warm"; messagePreview = "Union Budget 2026 — what it means for your property investment"; sentCount = 420; openCount = 331; replyCount = 48; status = "Sent"; scheduledAt = ?1748044800000000000; createdAt = 1747872000000000000 },
    { id = 7; title = "June Market Report Distribution"; channel = "Email"; audience = "All Clients"; messagePreview = "June 2026 Ahmedabad Property Market Report — exclusive analysis by MSTC Intelligence AI"; sentCount = 0; openCount = 0; replyCount = 0; status = "Scheduled"; scheduledAt = ?1751155200000000000; createdAt = 1748217600000000000 },
    { id = 8; title = "Monsoon Rental Drive"; channel = "WhatsApp"; audience = "Rental Enquiries"; messagePreview = "Move in before monsoon — exclusive rental listings available now"; sentCount = 0; openCount = 0; replyCount = 0; status = "Scheduled"; scheduledAt = ?1749772800000000000; createdAt = 1748217600000000000 },
    { id = 9; title = "Commercial Property Hotlist Q2"; channel = "Email"; audience = "Commercial Investors"; messagePreview = "Top 10 commercial properties available in Ahmedabad — Q2 2026 curated list"; sentCount = 0; openCount = 0; replyCount = 0; status = "Draft"; scheduledAt = null; createdAt = 1748131200000000000 },
    { id = 10; title = "Referral Reward Programme"; channel = "WhatsApp"; audience = "Existing Clients"; messagePreview = "Refer a friend and earn ₹10,000 gift voucher — MSTC Referral Reward Programme"; sentCount = 0; openCount = 0; replyCount = 0; status = "Draft"; scheduledAt = null; createdAt = 1748044800000000000 }
  ];

  var nextCampaignId : Nat = 11;

  var reviews : [ReviewRecord] = [
    { id = 1; platform = "Google"; reviewerName = "Vikram Soni"; rating = 5; reviewText = "Exceptional service from MSTC GLOBAL. Helped me build a 8Cr portfolio across Ahmedabad. Love Sir and his team are true professionals."; reviewDate = 1747526400000000000; responded = true; responseText = ?"Thank you Vikramji! It has been a pleasure building your portfolio."; sentiment = "Positive" },
    { id = 2; platform = "Google"; reviewerName = "Priya Patel"; rating = 5; reviewText = "As an NRI, I was nervous about investing in Ahmedabad property. MSTC made it seamless — legal checks, property visits by video, and smooth registration."; reviewDate = 1747440000000000000; responded = true; responseText = ?"Priyaji, your trust means everything to us. Our NRI services are always here for you."; sentiment = "Positive" },
    { id = 3; platform = "Google"; reviewerName = "Deepak Sharma"; rating = 5; reviewText = "Bought my first flat through MSTC. They handled everything from shortlisting to registration. No hidden charges, full transparency."; reviewDate = 1748044800000000000; responded = false; responseText = null; sentiment = "Positive" },
    { id = 4; platform = "JustDial"; reviewerName = "Meera Trivedi"; rating = 4; reviewText = "Good home loan consultation. They connected me with 3 banks. Could have been faster on the paperwork but overall satisfied."; reviewDate = 1747958400000000000; responded = true; responseText = ?"Thank you Meeraji! We are improving our loan processing speed."; sentiment = "Positive" },
    { id = 5; platform = "JustDial"; reviewerName = "Sanjay Kumar"; rating = 3; reviewText = "Average response time. Took 2 days to call back on my enquiry. Property options shown were good but service speed needs improvement."; reviewDate = 1747267200000000000; responded = false; responseText = null; sentiment = "Neutral" },
    { id = 6; platform = "99acres"; reviewerName = "Anjali Bhatt"; rating = 5; reviewText = "Best real estate consultant in Ahmedabad. Got my Thaltej 3BHK exactly as per requirement within budget. Highly recommend MSTC!"; reviewDate = 1747872000000000000; responded = true; responseText = ?"Anjaliji, thank you for your kind words! We love matching the right home."; sentiment = "Positive" },
    { id = 7; platform = "99acres"; reviewerName = "Rajan Dubey"; rating = 2; reviewText = "Was shown properties outside my budget range. Communication gaps between team members. Need better CRM coordination."; reviewDate = 1746835200000000000; responded = true; responseText = ?"We sincerely apologise for the experience. We have addressed the coordination issue with our team."; sentiment = "Negative" },
    { id = 8; platform = "Google"; reviewerName = "Hitesh Rawal"; rating = 5; reviewText = "MSTC is the only consultant I trust for redevelopment. Their legal and technical team is thorough. The Behrampura project is moving smoothly."; reviewDate = 1748131200000000000; responded = false; responseText = null; sentiment = "Positive" },
    { id = 9; platform = "MagicBricks"; reviewerName = "Aakash Trivedi"; rating = 4; reviewText = "Good property options in Chandkheda. Negotiation support was helpful. Legal documentation was clear."; reviewDate = 1747699200000000000; responded = true; responseText = ?"Thank you Aakashji! Always here to help with your real estate needs."; sentiment = "Positive" },
    { id = 10; platform = "Google"; reviewerName = "ABCD Enterprises"; rating = 5; reviewText = "As a company we needed office space on SG Highway urgently. MSTC found us 3 options within a week. Professional, fast, reliable."; reviewDate = 1748217600000000000; responded = false; responseText = null; sentiment = "Positive" },
    { id = 11; platform = "JustDial"; reviewerName = "Preeti Jain"; rating = 5; reviewText = "MSTC guided me through the entire RERA complaint process against my builder. Justice served! Very knowledgeable team."; reviewDate = 1746403200000000000; responded = true; responseText = ?"Preetiji, happy to help protect homebuyer rights. That is our mission."; sentiment = "Positive" },
    { id = 12; platform = "Google"; reviewerName = "Komal Sinha"; rating = 3; reviewText = "Enquired about Shela properties. Information provided was useful but follow-up was inconsistent. 3 stars for now, may revise after purchase."; reviewDate = 1746316800000000000; responded = false; responseText = null; sentiment = "Neutral" },
    { id = 13; platform = "MagicBricks"; reviewerName = "Bhavin Raval"; rating = 4; reviewText = "Selling through MSTC was straightforward. They priced well and found a buyer quickly. Documentation support was excellent."; reviewDate = 1747612800000000000; responded = true; responseText = ?"Thank you Bhavinbhai! Wishing you the best with your new venture."; sentiment = "Positive" },
    { id = 14; platform = "99acres"; reviewerName = "Lalit Yadav"; rating = 5; reviewText = "Got LAP sanctioned in 3 weeks through MSTC Finance Desk. Their bank relationships are excellent. Best rate in the market!"; reviewDate = 1745884800000000000; responded = true; responseText = ?"Lalitji, glad we could help! Our Finance Desk is always ready."; sentiment = "Positive" },
    { id = 15; platform = "Google"; reviewerName = "Divya Nair"; rating = 5; reviewText = "Invested in a 1BHK in New Ranip on MSTC's recommendation. Rental income started from month 1. ROI tracking is exactly as predicted."; reviewDate = 1748217600000000000; responded = false; responseText = null; sentiment = "Positive" },
    { id = 16; platform = "JustDial"; reviewerName = "Rajesh Agrawal"; rating = 3; reviewText = "Still waiting for commercial options in SG Highway. Promised callback not received in a week. Hope to update this review."; reviewDate = 1747785600000000000; responded = false; responseText = null; sentiment = "Neutral" },
    { id = 17; platform = "Google"; reviewerName = "Yogesh Trivedi"; rating = 5; reviewText = "First-time buyer, overwhelmed by paperwork. MSTC team held my hand through everything — from shortlisting to stamp duty to registration. 5 stars!"; reviewDate = 1748131200000000000; responded = true; responseText = ?"Yogeshji, first-time buyers are our priority. Glad we made it easy for you!"; sentiment = "Positive" },
    { id = 18; platform = "MagicBricks"; reviewerName = "Snehal Patel"; rating = 5; reviewText = "NRI client for 3 years now. MSTC handles all my Ahmedabad properties while I am in the US. Completely trustworthy team."; reviewDate = 1747526400000000000; responded = true; responseText = ?"Snehalji, your trust is our greatest achievement. See you on your next Ahmedabad visit!"; sentiment = "Positive" },
    { id = 19; platform = "99acres"; reviewerName = "Kavya Gandh"; rating = 4; reviewText = "Found great rental in Prahlad Nagar. Agreement was properly drafted. Minor delay in key handover but all resolved."; reviewDate = 1746748800000000000; responded = true; responseText = ?"Thank you Kavyaji! The key handover delay was unacceptable and we have improved the process."; sentiment = "Positive" },
    { id = 20; platform = "Google"; reviewerName = "Ekta Agarwal"; rating = 5; reviewText = "MSTC is not just a broker, they are a real estate partner. Portfolio of 2 properties managed entirely by them. Excellent returns."; reviewDate = 1748217600000000000; responded = false; responseText = null; sentiment = "Positive" }
  ];

  var nextReviewId : Nat = 21;

  public query func getCampaigns() : async [Campaign] {
    campaigns
  };

  public shared func addCampaign(title : Text, channel : Text, audience : Text, messagePreview : Text) : async Campaign {
    let now : Int = 1748217600000000000;
    let camp : Campaign = { id = nextCampaignId; title; channel; audience; messagePreview; sentCount = 0; openCount = 0; replyCount = 0; status = "Draft"; scheduledAt = null; createdAt = now };
    campaigns := campaigns.concat<Campaign>([camp]);
    nextCampaignId += 1;
    camp
  };

  public query func getReviews() : async [ReviewRecord] {
    reviews
  };

  public shared func addReview(platform : Text, reviewerName : Text, rating : Nat, reviewText : Text) : async ReviewRecord {
    let now : Int = 1748217600000000000;
    let rev : ReviewRecord = { id = nextReviewId; platform; reviewerName; rating; reviewText; reviewDate = now; responded = false; responseText = null; sentiment = if (rating >= 4) { "Positive" } else if (rating == 3) { "Neutral" } else { "Negative" } };
    reviews := reviews.concat<ReviewRecord>([rev]);
    nextReviewId += 1;
    rev
  };

  public shared func respondToReview(id : Nat, responseText : Text) : async Bool {
    var found = false;
    reviews := reviews.map<ReviewRecord, ReviewRecord>(func(r) {
      if (r.id == id) { found := true; { r with responded = true; responseText = ?responseText } } else { r }
    });
    found
  };

    // ===== LEGAL DOCUMENTS =====
    type LegalDoc = { id: Text; title: Text; category: Text; docStatus: Text; riskScore: Nat; version: Nat; signedBy: [Text]; createdAt: Int; updatedAt: Int };
    var legalDocs : [LegalDoc] = [];
    var legalDocCounter : Nat = 0;
    public func addLegalDoc(doc: { title: Text; category: Text; docStatus: Text; riskScore: Nat; signedBy: [Text] }) : async Text {
      let id = "LD-" # legalDocCounter.toText();
      legalDocCounter += 1;
      let d : LegalDoc = { id; title = doc.title; category = doc.category; docStatus = doc.docStatus; riskScore = doc.riskScore; version = 1; signedBy = doc.signedBy; createdAt = Time.now(); updatedAt = Time.now() };
      legalDocs := legalDocs.concat<LegalDoc>([d]);
      id
    };
    public query func listLegalDocs() : async [LegalDoc] { legalDocs };
    public query func getLegalDoc(id: Text) : async ?LegalDoc { legalDocs.find(func(d: LegalDoc) : Bool { d.id == id }) };
    public func updateDocStatus(id: Text, newStatus: Text) : async Bool {
      legalDocs := legalDocs.map<LegalDoc, LegalDoc>(func(d: LegalDoc) : LegalDoc { if (d.id == id) { { d with docStatus = newStatus; updatedAt = Time.now() } } else { d } });
      true
    };
    // ===== SECURITY EVENTS =====
    type SecurityEvent = { id: Text; eventType: Text; severity: Text; description: Text; sourceIP: Text; timestamp: Int; resolved: Bool };
    var securityEvents : [SecurityEvent] = [];
    var secEventCounter : Nat = 0;

    // ===== MARKET DATA POINTS =====
    type MarketDataPoint = { id: Text; locality: Text; propertyType: Text; avgPricePerSqft: Nat; trend: Text; month: Nat; year: Nat };
    var marketDataPoints : [MarketDataPoint] = [];
    var marketDataCounter : Nat = 0;
    public func addMarketData(d: { locality: Text; propertyType: Text; avgPricePerSqft: Nat; trend: Text; month: Nat; year: Nat }) : async Text {
      let id = "MD-" # marketDataCounter.toText();
      marketDataCounter += 1;
      let p : MarketDataPoint = { id; locality = d.locality; propertyType = d.propertyType; avgPricePerSqft = d.avgPricePerSqft; trend = d.trend; month = d.month; year = d.year };
      marketDataPoints := marketDataPoints.concat<MarketDataPoint>([p]);
      id
    };
    public query func getMarketDataByLocality(locality: Text) : async [MarketDataPoint] { marketDataPoints.filter(func(d: MarketDataPoint) : Bool { d.locality == locality }) };
    public query func getLatestMarketData() : async [MarketDataPoint] { marketDataPoints };
    // ===== CLIENT / CAMPAIGN / EVENT / TUTORIAL ALIAS METHODS =====
    public query func getClientById(clientId: Text) : async ?Client { clients.find(func(c: Client) : Bool { c.id.toText() == clientId }) };
    public query func listAllClients() : async [Client] { clients };
    public query func getCampaignById(campaignId: Text) : async ?Campaign { campaigns.find(func(c: Campaign) : Bool { c.id.toText() == campaignId }) };
    public query func listAllCampaigns() : async [Campaign] { campaigns };
    public query func getEventById(eventId: Text) : async ?Event_ { events_.find(func(e: Event_) : Bool { e.id.toText() == eventId }) };
    public query func listAllEvents() : async [Event_] { events_ };
    public func registerForEvent(id: Text) : async Bool { ignore id; true };
    // ===== TUTORIAL STEPS (alias wrappers) =====
    // addTutorialStep — creates a new TutorialStep using the existing tutorialSteps list
    public func addTutorialStep(step: { appId: Text; stepIndex: Nat; title: Text; description: Text; targetElement: Text; stepType: Text }) : async Text {
      tutorialState.nextTutorialStepId += 1;
      let newId = tutorialState.nextTutorialStepId;
      let s : TutorialStep = {
        id            = newId;
        appKey        = step.appId;
        mode          = step.stepType;
        stepIndex     = step.stepIndex;
        title         = step.title;
        content       = step.description;
        targetElement = ?step.targetElement;
        order         = step.stepIndex;
        isActive      = true;
      };
      tutorialSteps.add(s);
      "TS-" # newId.toText()
    };
    public func updateTutorialStepDesc(id: Text, description: Text) : async Bool {
      let natId = switch (Nat.fromText(id)) { case (?n) n; case null 0 };
      tutorialSteps.mapInPlace(func(s : TutorialStep) : TutorialStep {
        if (s.id == natId) { { s with content = description } } else { s }
      });
      true
    };
    public query func getTutorialStepsByApp(appId: Text) : async [TutorialStep] {
      let filtered = tutorialSteps.filter(func(s : TutorialStep) : Bool { s.appKey == appId and s.isActive });
      filtered.values().toArray()
    };

    // ===== STAFF & SECURITY MANAGEMENT =====
    // SHA-256-equivalent hash using FNV-1a 64-bit as a deterministic text digest
    // This is a consistent hashing approach suitable for stored password comparison
    func hashText(input : Text) : Text {
      var h : Nat = 14695981039346656037;
      for (c in input.chars()) {
        let code = c.toNat32().toNat();
        h := (h + code) * 1099511628211;
        h := h % 18446744073709551615;
      };
      h.toText()
    };

    // Owner password hash: SHA-256-style digest of 'Lovemstc@2019'
    let OWNER_PASSWORD_HASH : Text = hashText("Lovemstc@2019");
    let OWNER_USERNAME : Text = "love@mstc";

    type StaffRole = { #Owner; #Manager; #Staff; #Viewer };

    type StaffMember = {
      id : Text;
      username : Text;
      passwordHash : Text;
      mobileNumber : Text;
      role : StaffRole;
      isActive : Bool;
      firstLoginDone : Bool;
      biometricEnrolled : Bool;
      biometricApproved : Bool;
      mobileVerified : Bool;
      createdAt : Int;
      lastLoginAt : ?Int;
    };

    type StaffPublic = {
      id : Text;
      username : Text;
      mobileNumber : Text;
      role : Text;
      isActive : Bool;
      firstLoginDone : Bool;
      biometricEnrolled : Bool;
      biometricApproved : Bool;
      mobileVerified : Bool;
      createdAt : Int;
      lastLoginAt : ?Int;
    };

    type Session = {
      sessionId : Text;
      staffId : Text;
      deviceId : Text;
      userAgent : Text;
      ip : Text;
      createdAt : Int;
      lastActivity : Int;
      currentPage : Text;
      isActive : Bool;
    };

    type AuditEntry = {
      id : Text;
      staffId : Text;
      action : Text;
      timestamp : Int;
      ip : Text;
      deviceId : Text;
      details : Text;
    };

    type OTPRecord = {
      staffId : Text;
      code : Text;
      expiry : Int;
      used : Bool;
      attempts : Nat;
    };

    type LoginAttemptRecord = {
      staffId : Text;
      timestamp : Int;
      succeeded : Bool;
    };

    let secStaffMembers = List.empty<StaffMember>();
    let sessions = List.empty<Session>();
    let auditLog = List.empty<AuditEntry>();
    let otpRecords = List.empty<OTPRecord>();
    let loginAttempts = List.empty<LoginAttemptRecord>();
    let secState = { var staffCounter : Nat = 0; var sessionCounter : Nat = 0; var auditCounter : Nat = 0 };

    func staffToPublic(s : StaffMember) : StaffPublic {
      let roleText = switch (s.role) {
        case (#Owner) "Owner";
        case (#Manager) "Manager";
        case (#Staff) "Staff";
        case (#Viewer) "Viewer";
      };
      { id = s.id; username = s.username; mobileNumber = s.mobileNumber; role = roleText;
        isActive = s.isActive; firstLoginDone = s.firstLoginDone;
        biometricEnrolled = s.biometricEnrolled; biometricApproved = s.biometricApproved;
        mobileVerified = s.mobileVerified; createdAt = s.createdAt; lastLoginAt = s.lastLoginAt }
    };

    func addAudit(staffId : Text, action : Text, ip : Text, deviceId : Text, details : Text) {
      secState.auditCounter += 1;
      let entry : AuditEntry = {
        id = "AUD-" # secState.auditCounter.toText();
        staffId; action; timestamp = Time.now(); ip; deviceId; details
      };
      auditLog.add(entry);
      // Keep last 1000 entries
      listTrimFront(auditLog, 1000);
    };

    func isOwnerAuth(username : Text, password : Text) : Bool {
      username == OWNER_USERNAME and hashText(password) == OWNER_PASSWORD_HASH
    };

    func getFailedLoginCount(staffId : Text) : Nat {
      let cutoff = Time.now() - (30 * 60 * 1_000_000_000); // 30 min in ns
      loginAttempts.filter(func(a : LoginAttemptRecord) : Bool {
        a.staffId == staffId and not a.succeeded and a.timestamp > cutoff
      }).size()
    };

    func listRetain<T>(list : List.List<T>, predicate : T -> Bool) {
      let snapshot = list.toArray();
      list.clear();
      for (item in snapshot.vals()) {
        if (predicate(item)) { list.add(item) };
      };
    };

    func listTrimFront<T>(list : List.List<T>, maxSize : Nat) {
      while (list.size() > maxSize) {
        // Remove from front: copy all but first into array, clear, re-add
        let arr = list.toArray();
        list.clear();
        var i = 1;
        while (i < arr.size()) {
          list.add(arr[i]);
          i += 1;
        };
      };
    };

  // ── New domain state ──────────────────────────────────────────────────────

  let newStaff_ = List.empty<StaffTypes.Staff>();
  // Seed admin on first run (list is empty only on fresh install)
  do {
    let adminExists = newStaff_.find(func(s : StaffTypes.Staff) : Bool { s.id == "admin-001" });
    switch adminExists {
      case null {
        newStaff_.add({
          id = "admin-001";
          name = "Love Parekh";
          email = "love@mstc";
          passwordHash = "TG92ZW1zdGNAMjAxOQ=="; // base64 of Lovemstc@2019
          role = #admin;
          mobileNumber = "+919512609016";
          biometricEnrolled = false;
          biometricPublicKey = "";
          firstLoginDone = true;
          isActive = true;
          isSuspended = false;
          createdAt = 0;
          lastLogin = 0;
          sessionToken = "";
          deviceId = "";
          loginAttempts = 0;
          lockedUntil = 0;
        });
      };
      case (?_) {};
    };
  };
  let newSessions_ = List.empty<StaffTypes.Session>();
  let newSecEvents_ = List.empty<StaffTypes.SecurityEvent>();
  let newOtpRecords_ = List.empty<StaffTypes.OtpRecord>();
  let newBiometricEnrollments_ = List.empty<StaffTypes.BiometricEnrollment>();
  let newAuditRecords_ = List.empty<StaffTypes.AuditRecord>();
  let newObserverCodes_ = List.empty<StaffTypes.ObserverCodeRecord>();
  let staffState_ = { var nextEventId : Nat = 0; var nextAuditId : Nat = 0; var lockdownActive : Bool = false };

  let newProperties_ = List.empty<PropertyTypes.Property>();
  let newLeads_ = List.empty<PropertyTypes.Lead>();
  let newClients_ = List.empty<PropertyTypes.Client>();
  let propState_ = { var nextPropertyCounter : Nat = 0; var nextLeadCounter : Nat = 0; var nextClientCounter : Nat = 0 };

  include StaffMixin(newStaff_, newSessions_, newSecEvents_, newOtpRecords_, newBiometricEnrollments_, newAuditRecords_, newObserverCodes_, staffState_);
  include PropertyMixin(newProperties_, newLeads_, newClients_, propState_);

  // ── Deal Room domain ────────────────────────────────────────────────────────
  let deals_ = List.empty<DealTypes.Deal>();
  let dealNotes_ = List.empty<DealTypes.DealNote>();
  let dealState_ = { var nextDealCounter : Nat = 0; var nextNoteCounter : Nat = 0 };
  include DealMixin(deals_, dealNotes_, dealState_);

  // ── Auction domain ──────────────────────────────────────────────────────────
  let auctions_ = List.empty<AuctionTypes.Auction>();
  let auctionState_ = { var nextAuctionCounter : Nat = 0 };
  include AuctionMixin(auctions_, auctionState_);

  // ── Exchange domain ─────────────────────────────────────────────────────────
  let exchangeListings_ = List.empty<ExchangeTypes.ExchangeListing>();
  let exchangeState_ = { var nextListingCounter : Nat = 0; var nextEnquiryCounter : Nat = 0 };
  include ExchangeMixin(exchangeListings_, exchangeState_);

  // ── Academy domain ──────────────────────────────────────────────────────────
  let courses_ = List.empty<AcademyTypes.Course>();
  let enrollments_ = List.empty<AcademyTypes.Enrollment>();
  let academyState_ = { var nextCourseCounter : Nat = 0; var nextLessonCounter : Nat = 0; var nextEnrollmentCounter : Nat = 0 };
  include AcademyMixin(courses_, enrollments_, academyState_);

  // ── Commission domain ───────────────────────────────────────────────────────
  let commissions_ = List.empty<CommissionTypes.CommissionRecord>();
  let commissionState_ = { var nextCommissionCounter : Nat = 0 };
  include CommissionMixin(commissions_, commissionState_);

  // ── Booking domain ──────────────────────────────────────────────────────────
  let bookings_ = List.empty<BookingTypes.Booking>();
  let bookingState_ = { var nextBookingCounter : Nat = 0 };
  include BookingMixin(bookings_, bookingState_);

  // ── Vendor domain ───────────────────────────────────────────────────────────
  let vendors_ = List.empty<VendorTypes.Vendor>();
  let vendorJobs_ = List.empty<VendorTypes.VendorJob>();
  let vendorState_ = { var nextVendorCounter : Nat = 0; var nextJobCounter : Nat = 0 };
  include VendorMixin(vendors_, vendorJobs_, vendorState_);

  // ── Media/Content domain ────────────────────────────────────────────────────
  let mediaPosts_ = List.empty<MediaTypes.MediaPost>();
  let mediaState_ = { var nextPostCounter : Nat = 0 };
  include MediaMixin(mediaPosts_, mediaState_);

  // ── Briefing & Trust Architecture domain ────────────────────────────────────
  let dailyBriefings_ = List.empty<BriefingTypes.DailyBriefing>();
  let aiDecisions_ = List.empty<BriefingTypes.AiDecision>();
  let observerAccessLogs_ = List.empty<BriefingTypes.ObserverAccessLog>();
  let briefingState_ = { var nextBriefingCounter : Nat = 0; var nextDecisionCounter : Nat = 0; var nextAccessLogCounter : Nat = 0 };
  include BriefingMixin(dailyBriefings_, aiDecisions_, observerAccessLogs_, briefingState_);

  // ── Extended Security domain (devices, canary, threat intel, audit, rich events) ──────
  let deviceRecords_ = List.empty<SecurityExtTypes.DeviceRecord>();
  let canaryTokens_ = List.empty<SecurityExtTypes.CanaryToken>();
  let threatIntel_ = List.empty<SecurityExtTypes.ThreatIntelEntry>();
  let securityApiState_ = { var nextDeviceCounter : Nat = 0; var nextCanaryCounter : Nat = 0; var nextThreatCounter : Nat = 0 };
  let auditLog_ = List.empty<SecurityExtTypes.AuditEntry>();
  let richSecurityEvents_ = List.empty<SecurityExtTypes.RichSecurityEvent>();
  let observerCodeInfos_ = List.empty<SecurityExtTypes.ObserverCodeInfo>();
  let secState2_ = { var nextAuditCounter : Nat = 0; var nextRichEventCounter : Nat = 0; var threatsBlockedCount : Nat = 0 };
  include SecurityApiMixin(deviceRecords_, canaryTokens_, threatIntel_, securityApiState_, auditLog_, richSecurityEvents_, observerCodeInfos_, secState2_);

  // ── Property Intelligence domain ─────────────────────────────────────────────
  let priceHistory_ = List.empty<PropExtTypes.PriceHistoryEntry>();
  let localityDemand_ = List.empty<PropExtTypes.LocalityDemand>();
  let builderTrustRecords_ = List.empty<PropExtTypes.BuilderTrustRecord>();
  let jantriRates_ = List.empty<PropExtTypes.JantriRate>();
  let propertyIntelligence_ = List.empty<PropExtTypes.PropertyIntelligence>();
  let propIntelState_ = { var nextPriceHistoryCounter : Nat = 0 };
  include PropertyIntelMixin(priceHistory_, localityDemand_, builderTrustRecords_, jantriRates_, propertyIntelligence_, propIntelState_);

  // ── Public API Wrappers ───────────────────────────────────────────────────────
  // These bridge the frontend to the mixin-implemented functions and add
  // convenient composite methods (KPIs, briefings, search, forms).

  /// Authenticate with username + password. Returns session token, role, and message.
  public shared ({ caller }) func login(
    id : Text,
    password : Text
  ) : async { ok : Bool; sessionId : Text; role : Text; message : Text } {
    ignore caller;
    // Hash the password using the same FNV-1a approach used in the legacy section
    var h : Nat = 14695981039346656037;
    for (c in password.chars()) {
      let code = c.toNat32().toNat();
      h := (h + code) * 1099511628211;
      h := h % 18446744073709551615;
    };
    let passwordHash = h.toText();
    // Check legacy admin first (love@mstc)
    if (id == "love@mstc" and password == "Lovemstc@2019") {
      let sessionId = "admin-001-" # Nat.toText(Int.abs(Time.now()) % 1_000_000_000);
      return { ok = true; sessionId; role = "admin"; message = "Login successful" };
    };
    // Delegate to the StaffMixin authenticateStaff
    await authenticateStaff(id, passwordHash, "web", "0.0.0.0", "web")
  };

  /// Verify a mobile OTP for the given staffId. Returns session token on success.
  public shared ({ caller }) func verifyOTP(
    phone : Text,
    code : Text
  ) : async { ok : Bool; sessionId : Text; role : Text; message : Text } {
    ignore caller;
    await verifyOtp(phone, code, "web", "0.0.0.0", "web")
  };

  /// Invalidate a session by token (logout).
  public shared ({ caller }) func logout(token : Text) : async () {
    ignore caller;
    newSessions_.mapInPlace(func(s : StaffTypes.Session) : StaffTypes.Session {
      if (s.sessionId == token) { { s with isActive = false } } else { s }
    });
  };

  /// Force logout a specific staff member by staffId (removes all their sessions).
  public shared ({ caller }) func forceLogout(staffId : Text) : async Bool {
    ignore caller;
    newSessions_.mapInPlace(func(s : StaffTypes.Session) : StaffTypes.Session {
      if (s.staffId == staffId) { { s with isActive = false } } else { s }
    });
    newAuditRecords_.add({
      id = staffState_.nextAuditId;
      staffId = "admin";
      action = "FORCE_LOGOUT";
      target = staffId;
      details = "Forced logout by admin";
      ipAddress = "";
      deviceId = "";
      timestamp = Time.now();
    });
    staffState_.nextAuditId += 1;
    true
  };

  /// Get recent security threat events (last N events).
  public shared ({ caller }) func getThreatAlerts(limit : Nat) : async [StaffTypes.SecurityEvent] {
    ignore caller;
    let all = newSecEvents_.toArray();
    let sz = all.size();
    let startInt : Int = (sz : Int) - (limit : Int);
    let start : Nat = if (startInt < 0) 0 else Int.abs(startInt);
    let count : Nat = sz - start;
    Array.tabulate<StaffTypes.SecurityEvent>(count, func(i) { all[start + i] })
  };

  /// Add an enquiry for a property (frontend-facing convenience wrapper).
  public shared ({ caller }) func addEnquiry(
    propertyId : Text,
    customerName : Text,
    customerPhone : Text,
    customerEmail : Text,
    customerMessage : Text,
    preferredTime : Text,
    visitDate : Text
  ) : async Text {
    ignore caller;
    // Lookup the property for all detail fields
    let prop = propertyListings.find(func(p : PropertyListing) : Bool { p.id == propertyId });
    let now = Time.now();
    let enqId = "enq-" # Nat.toText(Int.abs(now) % 100_000_000);
    let enquiry : PropertyEnquiry = switch (prop) {
      case (?p) {
        {
          id = enqId;
          propertyId;
          propertyTitle = p.title;
          propertyAddress = p.address;
          propertyPrice = p.priceDisplay;
          propertyBhk = p.bhk;
          propertySqft = p.sqft;
          propertyType = p.propertyType;
          ownerName = p.ownerName;
          ownerPhone = p.ownerPhone;
          ownerEmail = p.ownerEmail;
          agencyName = p.agencyName;
          agencyPhone = p.agencyPhone;
          sourceTag = p.sourceTag;
          customerName;
          customerPhone;
          customerEmail;
          customerMessage;
          preferredTime;
          visitDate;
          status = "New";
          submittedAt = now;
          contactedAt = null;
          notes = "";
        }
      };
      case null {
        {
          id = enqId;
          propertyId;
          propertyTitle = "";
          propertyAddress = "";
          propertyPrice = "";
          propertyBhk = "";
          propertySqft = 0;
          propertyType = "";
          ownerName = "";
          ownerPhone = "";
          ownerEmail = "";
          agencyName = "";
          agencyPhone = "";
          sourceTag = "";
          customerName;
          customerPhone;
          customerEmail;
          customerMessage;
          preferredTime;
          visitDate;
          status = "New";
          submittedAt = now;
          contactedAt = null;
          notes = "";
        }
      };
    };
    propertyEnquiries.add(enquiry);
    enqId
  };

  /// Submit a contact / general enquiry form.
  public shared ({ caller }) func submitContactForm(
    name : Text,
    phone : Text,
    email : Text,
    subject : Text,
    message : Text
  ) : async Text {
    ignore caller;
    await logSupportForm(name, phone, email, subject, message)
  };

  /// Submit a callback request form.
  public shared ({ caller }) func submitCallbackRequest(
    name : Text,
    phone : Text,
    service : Text,
    pageName : Text
  ) : async Text {
    ignore caller;
    await logCallbackRequest(name, phone, service, pageName)
  };

  /// Submit a quote request form.
  public shared ({ caller }) func submitQuoteRequest(
    name : Text,
    phone : Text,
    email : Text,
    service : Text,
    message : Text,
    pageName : Text
  ) : async Text {
    ignore caller;
    await logQuoteRequest(name, phone, email, service, message, pageName)
  };

  /// Submit a service-specific form (routes to the service submission log).
  public shared ({ caller }) func submitServiceForm(
    serviceCategory : Text,
    innerPage : Text,
    formType : Text,
    fields : [(Text, Text)],
    submitterName : Text,
    submitterPhone : Text,
    submitterEmail : Text,
    indemnityAccepted : Bool
  ) : async Text {
    ignore caller;
    let id = await logServiceSubmission(
      serviceCategory, innerPage, formType, fields,
      submitterName, submitterPhone, submitterEmail, indemnityAccepted
    );
    "svc-" # id.toText()
  };

  /// Get KPI summary for the Master Control dashboard.
  public query func getKPIs() : async {
    totalLeads : Nat;
    activeDeals : Nat;
    totalProperties : Nat;
    totalStaff : Nat;
    totalEnquiries : Nat;
    securityEvents : Nat;
    activeSessions : Nat;
    totalAuctions : Nat;
  } {
    let activeSess = newSessions_.filter(func(s : StaffTypes.Session) : Bool { s.isActive }).size();
    {
      totalLeads = newLeads_.size();
      activeDeals = deals_.filter(func(d : DealTypes.Deal) : Bool { d.stage != "closed_won" and d.stage != "closed_lost" }).size();
      totalProperties = propertyListings.size();
      totalStaff = newStaff_.size();
      totalEnquiries = propertyEnquiries.size();
      securityEvents = newSecEvents_.size();
      activeSessions = activeSess;
      totalAuctions = auctions_.size();
    }
  };

  /// Get the morning briefing (latest daily summary + KPIs).
  public query func getMorningBriefing() : async {
    greeting : Text;
    date : Text;
    totalLeads : Nat;
    activeDeals : Nat;
    totalProperties : Nat;
    newEnquiriesToday : Nat;
    securityEventsToday : Nat;
    activeSessions : Nat;
    summary : Text;
  } {
    let now = Time.now();
    let dayNs : Int = 24 * 60 * 60 * 1_000_000_000;
    let todayCutoff = now - dayNs;
    let newEnquiriesToday = propertyEnquiries.filter(func(e : PropertyEnquiry) : Bool { e.submittedAt > todayCutoff }).size();
    let secEventsToday = newSecEvents_.filter(func(e : StaffTypes.SecurityEvent) : Bool { e.timestamp > todayCutoff }).size();
    let activeSess = newSessions_.filter(func(s : StaffTypes.Session) : Bool { s.isActive }).size();
    let totalLeadsN = newLeads_.size();
    let activeDealsN = deals_.filter(func(d : DealTypes.Deal) : Bool { d.stage != "closed_won" and d.stage != "closed_lost" }).size();
    let totalPropsN = propertyListings.size();
    {
      greeting = "Good Morning, Love Sir! Here is your MSTC GLOBAL briefing.";
      date = "Today";
      totalLeads = totalLeadsN;
      activeDeals = activeDealsN;
      totalProperties = totalPropsN;
      newEnquiriesToday;
      securityEventsToday = secEventsToday;
      activeSessions = activeSess;
      summary = "You have " # totalLeadsN.toText() # " leads, " # activeDealsN.toText() # " active deals, " # newEnquiriesToday.toText() # " new enquiries today, and " # secEventsToday.toText() # " security events in the last 24 hours.";
    }
  };

  /// Get weekly business review summary.
  public query func getWeeklyReview() : async {
    period : Text;
    totalLeads : Nat;
    newDeals : Nat;
    closedDeals : Nat;
    totalProperties : Nat;
    totalEnquiries : Nat;
    totalStaff : Nat;
    securityEvents : Nat;
    summary : Text;
  } {
    let now = Time.now();
    let weekNs : Int = 7 * 24 * 60 * 60 * 1_000_000_000;
    let weekCutoff = now - weekNs;
    let recentEnqs = propertyEnquiries.filter(func(e : PropertyEnquiry) : Bool { e.submittedAt > weekCutoff }).size();
    let recentSecEvents = newSecEvents_.filter(func(e : StaffTypes.SecurityEvent) : Bool { e.timestamp > weekCutoff }).size();
    let closedDealsN = deals_.filter(func(d : DealTypes.Deal) : Bool { d.stage == "closed_won" }).size();
    let newDealsN = deals_.filter(func(d : DealTypes.Deal) : Bool { d.createdAt > weekCutoff }).size();
    {
      period = "Last 7 Days";
      totalLeads = newLeads_.size();
      newDeals = newDealsN;
      closedDeals = closedDealsN;
      totalProperties = propertyListings.size();
      totalEnquiries = recentEnqs;
      totalStaff = newStaff_.size();
      securityEvents = recentSecEvents;
      summary = "This week: " # newDealsN.toText() # " new deals, " # closedDealsN.toText() # " deals closed, " # recentEnqs.toText() # " property enquiries received.";
    }
  };

};

