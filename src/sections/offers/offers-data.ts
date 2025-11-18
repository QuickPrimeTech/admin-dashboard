export type OfferStatus =
  | "active"
  | "upcoming"
  | "expired"
  | "scheduled"
  | "recurring";

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount?: string;
  image: string;
  isVideo?: boolean;
  cta?: string;
  status: OfferStatus;
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 for Mon-Sun (for recurring)
  customName?: string; // e.g., "Monday Special", "New Year Deal"
}

export const ALL_OFFERS: Offer[] = [
  // Active Offers
  {
    id: "1",
    title: "Summer Special",
    description:
      "Enjoy 30% off on all beverages this summer season. Perfect for refreshing your dining experience.",
    discount: "30% OFF",
    image: "/appetizing-summer-drinks-with-ice-and-citrus.jpg",
    cta: "Order Now",
    status: "active",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31"),
    customName: "Summer Refresher",
  },
  {
    id: "2",
    title: "Happy Hour",
    description:
      "Join us every weekday from 4-6 PM for exclusive happy hour deals on appetizers and drinks.",
    discount: "HAPPY HOUR",
    image: "/elegant-happy-hour-cocktails-and-appetizers.jpg",
    cta: "Reserve Table",
    status: "recurring",
    startDate: new Date("2025-01-01"),
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    customName: "Weekday Happy Hour",
  },
  {
    id: "3",
    title: "Family Bundle",
    description:
      "Create unforgettable memories with our special family bundle meal. Perfect for gatherings.",
    discount: "FAMILY DEAL",
    image: "/family-style-restaurant-meal-sharing.jpg",
    cta: "Learn More",
    status: "recurring",
    startDate: new Date("2025-01-01"),
    daysOfWeek: [5, 6], // Friday and Saturday
    customName: "Weekend Family Deal",
  },
  // Upcoming Offers
  {
    id: "4",
    title: "Anniversary Celebration",
    description:
      "Celebrate our 10-year anniversary with special discounted menus and complimentary desserts.",
    discount: "25% OFF",
    image: "/appetizing-summer-drinks-with-ice-and-citrus.jpg",
    cta: "Book Now",
    status: "upcoming",
    startDate: new Date("2025-12-15"),
    endDate: new Date("2025-12-31"),
    customName: "Anniversary Bash",
  },
  {
    id: "5",
    title: "Holiday Feast",
    description:
      "Join us for a festive holiday menu featuring seasonal specialties and signature dishes.",
    discount: "20% OFF",
    image: "/elegant-happy-hour-cocktails-and-appetizers.jpg",
    cta: "Reserve",
    status: "upcoming",
    startDate: new Date("2025-12-20"),
    endDate: new Date("2026-01-02"),
    customName: "Holiday Special",
  },
  // Expired Offers
  {
    id: "6",
    title: "Spring Menu Launch",
    description:
      "Experience our fresh spring collection with farm-to-table ingredients.",
    discount: "15% OFF",
    image: "/family-style-restaurant-meal-sharing.jpg",
    cta: "Learn More",
    status: "expired",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-05-31"),
    customName: "Spring Fresh",
  },
  {
    id: "7",
    title: "Easter Brunch",
    description:
      "Join us for an elegant Easter brunch with traditional and contemporary dishes.",
    discount: "10% OFF",
    image: "/appetizing-summer-drinks-with-ice-and-citrus.jpg",
    cta: "View Menu",
    status: "expired",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-04-20"),
    customName: "Easter Celebration",
  },
  // Scheduled Offers
  {
    id: "8",
    title: "Monday Special",
    description:
      "Every Monday, enjoy buy-one-get-one offers on selected appetizers.",
    discount: "BOGO",
    image: "/elegant-happy-hour-cocktails-and-appetizers.jpg",
    cta: "Order",
    status: "scheduled",
    startDate: new Date("2025-01-01"),
    daysOfWeek: [1], // Mondays
    customName: "Meatless Monday",
  },
  {
    id: "9",
    title: "Wine Wednesday",
    description:
      "Every Wednesday, receive 20% off on all wines from our premium collection.",
    discount: "20% OFF WINES",
    image: "/family-style-restaurant-meal-sharing.jpg",
    cta: "Explore",
    status: "scheduled",
    startDate: new Date("2025-01-01"),
    daysOfWeek: [3], // Wednesdays
    customName: "Wine Wednesday",
  },
];
