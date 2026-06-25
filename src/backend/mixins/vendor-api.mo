import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import VendorTypes "../types/vendor";

mixin (
  vendors : List.List<VendorTypes.Vendor>,
  vendorJobs : List.List<VendorTypes.VendorJob>,
  vendorState : { var nextVendorCounter : Nat; var nextJobCounter : Nat }
) {

  public shared ({ caller }) func addVendor(
    name : Text,
    category : Text,
    contactName : Text,
    phone : Text,
    email : Text
  ) : async { #ok : VendorTypes.Vendor; #err : Text } {
    ignore caller;
    vendorState.nextVendorCounter += 1;
    let vendor : VendorTypes.Vendor = {
      id = "vendor-" # vendorState.nextVendorCounter.toText();
      name;
      category;
      contactName;
      phone;
      email;
      rating = 0.0;
      totalJobs = 0;
      isActive = true;
      notes = "";
      createdAt = Time.now();
    };
    vendors.add(vendor);
    #ok(vendor)
  };

  public query func listVendors() : async [VendorTypes.Vendor] {
    vendors.toArray()
  };

  public query func getVendor(vendorId : Text) : async { #ok : VendorTypes.Vendor; #err : Text } {
    switch (vendors.find(func(v : VendorTypes.Vendor) : Bool { v.id == vendorId })) {
      case (?v) { #ok(v) };
      case null { #err("Vendor not found") };
    }
  };

  public shared ({ caller }) func assignVendorJob(
    vendorId : Text,
    propertyId : Text,
    jobType : Text,
    amount : Float
  ) : async { #ok : VendorTypes.VendorJob; #err : Text } {
    ignore caller;
    switch (vendors.find(func(v : VendorTypes.Vendor) : Bool { v.id == vendorId })) {
      case null { return #err("Vendor not found") };
      case (?_) {};
    };
    vendorState.nextJobCounter += 1;
    let job : VendorTypes.VendorJob = {
      id = "job-" # vendorState.nextJobCounter.toText();
      vendorId;
      propertyId;
      jobType;
      amount;
      status = "assigned";
      completedAt = null;
      createdAt = Time.now();
    };
    vendorJobs.add(job);
    // Increment totalJobs on vendor
    vendors.mapInPlace(func(v : VendorTypes.Vendor) : VendorTypes.Vendor {
      if (v.id == vendorId) { { v with totalJobs = v.totalJobs + 1 } } else { v }
    });
    #ok(job)
  };

  public shared ({ caller }) func updateVendorJobStatus(
    jobId : Text,
    status : Text
  ) : async { #ok : VendorTypes.VendorJob; #err : Text } {
    ignore caller;
    var updated : ?VendorTypes.VendorJob = null;
    vendorJobs.mapInPlace(func(j : VendorTypes.VendorJob) : VendorTypes.VendorJob {
      if (j.id == jobId) {
        let completedAt = if (status == "completed") { ?Time.now() } else { j.completedAt };
        let u = { j with status; completedAt };
        updated := ?u;
        u
      } else { j }
    });
    switch (updated) {
      case (?j) { #ok(j) };
      case null { #err("Job not found") };
    }
  };

  public shared ({ caller }) func rateVendor(
    vendorId : Text,
    rating : Float
  ) : async { #ok : VendorTypes.Vendor; #err : Text } {
    ignore caller;
    var updated : ?VendorTypes.Vendor = null;
    vendors.mapInPlace(func(v : VendorTypes.Vendor) : VendorTypes.Vendor {
      if (v.id == vendorId) {
        // Running average: (oldRating * (totalJobs-1) + newRating) / totalJobs
        let jobs : Float = if (v.totalJobs == 0) { 1.0 } else { (v.totalJobs : Nat).toFloat() };
        let avg = (v.rating * (jobs - 1.0) + rating) / jobs;
        let u = { v with rating = avg };
        updated := ?u;
        u
      } else { v }
    });
    switch (updated) {
      case (?v) { #ok(v) };
      case null { #err("Vendor not found") };
    }
  };

};
