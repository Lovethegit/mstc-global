import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import AuctionTypes "../types/auction";

mixin (
  auctions : List.List<AuctionTypes.Auction>,
  auctionState : { var nextAuctionCounter : Nat }
) {

  public shared ({ caller }) func createAuction(
    propertyId : Text,
    title : Text,
    startPrice : Float,
    startTime : Int,
    endTime : Int
  ) : async { #ok : AuctionTypes.Auction; #err : Text } {
    ignore caller;
    auctionState.nextAuctionCounter += 1;
    let auction : AuctionTypes.Auction = {
      id = "auction-" # auctionState.nextAuctionCounter.toText();
      propertyId;
      title;
      description = "";
      startPrice;
      currentBid = startPrice;
      bidIncrement = startPrice * 0.01;
      startTime;
      endTime;
      status = "upcoming";
      winnerId = null;
      bids = [];
    };
    auctions.add(auction);
    #ok(auction)
  };

  public query func listAuctions() : async [AuctionTypes.Auction] {
    auctions.toArray()
  };

  public query func getAuction(auctionId : Text) : async { #ok : AuctionTypes.Auction; #err : Text } {
    switch (auctions.find(func(a : AuctionTypes.Auction) : Bool { a.id == auctionId })) {
      case (?a) { #ok(a) };
      case null { #err("Auction not found") };
    }
  };

  public shared ({ caller }) func placeBid(
    auctionId : Text,
    bidderId : Text,
    amount : Float
  ) : async { #ok : AuctionTypes.Bid; #err : Text } {
    ignore caller;
    let now = Time.now();
    switch (auctions.find(func(a : AuctionTypes.Auction) : Bool { a.id == auctionId })) {
      case null { return #err("Auction not found") };
      case (?a) {
        if (a.status != "live") { return #err("Auction is not live") };
        if (amount <= a.currentBid) { return #err("Bid must exceed current bid") };
        let bid : AuctionTypes.Bid = {
          id = "bid-" # auctionId # "-" # Nat.toText(a.bids.size() + 1);
          auctionId;
          bidderId;
          amount;
          timestamp = now;
          isWinning = true;
        };
        // Update all existing bids as not winning, then add new winning bid
        let oldBids = a.bids.map(
          func(b) { { b with isWinning = false } }
        );
        let newBids = oldBids.concat([bid]);
        let updated = { a with currentBid = amount; bids = newBids };
        auctions.mapInPlace(func(x : AuctionTypes.Auction) : AuctionTypes.Auction {
          if (x.id == auctionId) { updated } else { x }
        });
        #ok(bid)
      };
    }
  };

  public query func getAuctionBids(auctionId : Text) : async [AuctionTypes.Bid] {
    switch (auctions.find(func(a : AuctionTypes.Auction) : Bool { a.id == auctionId })) {
      case (?a) { a.bids };
      case null { [] };
    }
  };

};
