import Types "common";

module {
  public type CommissionStatus = Text; // pending | approved | paid

  public type CommissionRecord = {
    id : Text;
    dealId : Text;
    agentId : Text;
    amount : Float;
    percentage : Float;
    status : CommissionStatus;
    approvedBy : ?Text;
    paidAt : ?Types.Timestamp;
    createdAt : Types.Timestamp;
  };
};
