// Reservation
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Reservation = {
  id: number; // serial (int)
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  guests: number;
  status: ReservationStatus;
  dining_preference?: string | null;
  occasion?: string | null;
  requests?: string | null; // renamed from notes
  user_id: string;
  created_at?: string;
};
