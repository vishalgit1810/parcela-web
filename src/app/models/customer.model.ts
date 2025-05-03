export interface Customer {
    custId: number; // Matches Long in Java backend
    name: string;
    email: string;
    mobileNumber: string;
    address: string;

     // Include these if you need them for relationships
//   bookings?: Booking[];
//   feedbacks?: Feedback[];
//   payments?: Payment[];
}
  
