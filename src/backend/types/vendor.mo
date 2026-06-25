import Types "common";

module {
  public type VendorJobStatus = Text; // assigned | in-progress | completed

  public type Vendor = {
    id : Text;
    name : Text;
    category : Text;
    contactName : Text;
    phone : Text;
    email : Text;
    rating : Float;
    totalJobs : Nat;
    isActive : Bool;
    notes : Text;
    createdAt : Types.Timestamp;
  };

  public type VendorJob = {
    id : Text;
    vendorId : Text;
    propertyId : Text;
    jobType : Text;
    amount : Float;
    status : VendorJobStatus;
    completedAt : ?Types.Timestamp;
    createdAt : Types.Timestamp;
  };
};
