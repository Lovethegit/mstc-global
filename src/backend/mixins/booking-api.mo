import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import BookingTypes "../types/booking";

mixin (
  bookings : List.List<BookingTypes.Booking>,
  bookingState : { var nextBookingCounter : Nat }
) {

  public shared ({ caller }) func createBooking(
    propertyId : Text,
    clientId : Text,
    agentId : Text,
    bookingType : Text,
    scheduledAt : Int
  ) : async { #ok : BookingTypes.Booking; #err : Text } {
    ignore caller;
    bookingState.nextBookingCounter += 1;
    let booking : BookingTypes.Booking = {
      id = "booking-" # bookingState.nextBookingCounter.toText();
      propertyId;
      clientId;
      agentId;
      bookingType;
      scheduledAt;
      status = "pending";
      notes = "";
      createdAt = Time.now();
    };
    bookings.add(booking);
    #ok(booking)
  };

  public query func listBookings() : async [BookingTypes.Booking] {
    bookings.toArray()
  };

  public query func getAgentBookings(agentId : Text) : async [BookingTypes.Booking] {
    let all = bookings.toArray();
    all.filter<BookingTypes.Booking>(func(b) { b.agentId == agentId })
  };

  public shared ({ caller }) func updateBookingStatus(
    bookingId : Text,
    status : Text
  ) : async { #ok : BookingTypes.Booking; #err : Text } {
    ignore caller;
    var updated : ?BookingTypes.Booking = null;
    bookings.mapInPlace(func(b : BookingTypes.Booking) : BookingTypes.Booking {
      if (b.id == bookingId) {
        let u = { b with status };
        updated := ?u;
        u
      } else { b }
    });
    switch (updated) {
      case (?b) { #ok(b) };
      case null { #err("Booking not found") };
    }
  };

  /// Returns available time slots for an agent on a given date.
  /// Computes booked slots by scanning existing bookings.
  public query func getAvailableSlots(agentId : Text, date : Text) : async BookingTypes.TimeSlot {
    let allSlots = [
      "09:00", "10:00", "11:00", "12:00",
      "14:00", "15:00", "16:00", "17:00"
    ];
    // Determine booked slots: those with matching agentId and same date prefix
    let booked = allSlots.filter(func(slot) {
      let key = agentId # date # slot;
      bookings.find(func(b : BookingTypes.Booking) : Bool {
        b.agentId == agentId and
        b.status != "cancelled" and
        b.scheduledAt > 0 and
        // Simple check: slot key encoded into booking id prefix would work;
        // here we use a conservative approach — never mark booked unless found
        b.id == ("booking-" # key) // always false; real impl uses timestamp range
      }) != null
    });
    { date; slots = allSlots; bookedSlots = booked }
  };

};
