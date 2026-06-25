import Types "common";

module {
  public type AuctionStatus = Text; // upcoming | live | ended | cancelled

  public type Bid = {
    id : Text;
    auctionId : Text;
    bidderId : Text;
    amount : Float;
    timestamp : Types.Timestamp;
    isWinning : Bool;
  };

  public type Auction = {
    id : Text;
    propertyId : Text;
    title : Text;
    description : Text;
    startPrice : Float;
    currentBid : Float;
    bidIncrement : Float;
    startTime : Types.Timestamp;
    endTime : Types.Timestamp;
    status : AuctionStatus;
    winnerId : ?Text;
    bids : [Bid];
  };
};
