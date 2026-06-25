import Types "common";

module {
  public type BookingType = Text; // site-visit | virtual-tour | call
  public type BookingStatus = Text; // pending | confirmed | completed | cancelled

  public type Booking = {
    id : Text;
    propertyId : Text;
    clientId : Text;
    agentId : Text;
    bookingType : BookingType;
    scheduledAt : Types.Timestamp;
    status : BookingStatus;
    notes : Text;
    createdAt : Types.Timestamp;
  };

  public type TimeSlot = {
    date : Text;
    slots : [Text];
    bookedSlots : [Text];
  };
};
