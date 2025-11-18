export type OfferStatus =
  | "active"
  | "upcoming"
  | "expired"
  | "scheduled"
  | "recurring";

export type Offer = {
  id: string;
  title: string;
  description: string;
  image: string; // This now strictly refers to an image
  status: OfferStatus;
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 for Mon-Sun (for recurring)
  customName?: string; // e.g., "Monday Special", "New Year Deal"
};
