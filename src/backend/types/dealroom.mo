import Types "common";

module {
  public type DealStage = Text; // negotiation | due-diligence | legal-review | closing | closed

  public type DealDocument = {
    id : Text;
    dealId : Text;
    name : Text;
    uploadedBy : Text;
    url : Text;
    timestamp : Types.Timestamp;
  };

  public type DealNote = {
    id : Text;
    dealId : Text;
    authorId : Text;
    content : Text;
    timestamp : Types.Timestamp;
  };

  public type Deal = {
    id : Text;
    title : Text;
    propertyId : Text;
    clientId : Text;
    agentId : Text;
    stage : DealStage;
    documents : [Text];
    notes : Text;
    expectedCloseDate : Types.Timestamp;
    actualCloseDate : ?Types.Timestamp;
    commissionAmount : Float;
    createdAt : Types.Timestamp;
  };
};
