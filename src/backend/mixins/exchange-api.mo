import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import ExchangeTypes "../types/exchange";

mixin (
  exchangeListings : List.List<ExchangeTypes.ExchangeListing>,
  exchangeState : { var nextListingCounter : Nat; var nextEnquiryCounter : Nat }
) {

  public shared ({ caller }) func createListing(
    sellerId : Text,
    propertyId : Text,
    askPrice : Float,
    description : Text
  ) : async { #ok : ExchangeTypes.ExchangeListing; #err : Text } {
    ignore caller;
    exchangeState.nextListingCounter += 1;
    let listing : ExchangeTypes.ExchangeListing = {
      id = "listing-" # exchangeState.nextListingCounter.toText();
      sellerId;
      propertyId;
      askPrice;
      description;
      status = "active";
      createdAt = Time.now();
      viewCount = 0;
      enquiries = [];
    };
    exchangeListings.add(listing);
    #ok(listing)
  };

  public query func listExchangeListings() : async [ExchangeTypes.ExchangeListing] {
    exchangeListings.toArray()
  };

  public query func getListing(listingId : Text) : async { #ok : ExchangeTypes.ExchangeListing; #err : Text } {
    switch (exchangeListings.find(func(l : ExchangeTypes.ExchangeListing) : Bool { l.id == listingId })) {
      case (?l) { #ok(l) };
      case null { #err("Listing not found") };
    }
  };

  public shared ({ caller }) func submitEnquiry(
    listingId : Text,
    buyerId : Text,
    message : Text,
    offerPrice : ?Float
  ) : async { #ok : ExchangeTypes.ExchangeEnquiry; #err : Text } {
    ignore caller;
    exchangeState.nextEnquiryCounter += 1;
    let enquiry : ExchangeTypes.ExchangeEnquiry = {
      id = "enq-" # exchangeState.nextEnquiryCounter.toText();
      listingId;
      buyerId;
      message;
      offerPrice;
      timestamp = Time.now();
    };
    var found = false;
    exchangeListings.mapInPlace(func(l : ExchangeTypes.ExchangeListing) : ExchangeTypes.ExchangeListing {
      if (l.id == listingId) {
        found := true;
        let newEnqs = l.enquiries.concat([enquiry]);
        { l with enquiries = newEnqs }
      } else { l }
    });
    if (not found) { return #err("Listing not found") };
    #ok(enquiry)
  };

  public shared ({ caller }) func updateListingStatus(
    listingId : Text,
    status : Text
  ) : async { #ok : ExchangeTypes.ExchangeListing; #err : Text } {
    ignore caller;
    var updated : ?ExchangeTypes.ExchangeListing = null;
    exchangeListings.mapInPlace(func(l : ExchangeTypes.ExchangeListing) : ExchangeTypes.ExchangeListing {
      if (l.id == listingId) {
        let u = { l with status };
        updated := ?u;
        u
      } else { l }
    });
    switch (updated) {
      case (?l) { #ok(l) };
      case null { #err("Listing not found") };
    }
  };

};
