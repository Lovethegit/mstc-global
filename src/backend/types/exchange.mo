import Types "common";

module {
  public type ListingStatus = Text; // active | pending | sold

  public type ExchangeEnquiry = {
    id : Text;
    listingId : Text;
    buyerId : Text;
    message : Text;
    offerPrice : ?Float;
    timestamp : Types.Timestamp;
  };

  public type ExchangeListing = {
    id : Text;
    sellerId : Text;
    propertyId : Text;
    askPrice : Float;
    description : Text;
    status : ListingStatus;
    createdAt : Types.Timestamp;
    viewCount : Nat;
    enquiries : [ExchangeEnquiry];
  };
};
