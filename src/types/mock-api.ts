// Menu Item
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary_preference?: string[];
  is_available: boolean;
  image_url: string;
  created_at: string;
  type: string[]; // ✅ Add this line
}

// Reservation
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes: string;
  created_at: string;
}

// FAQ
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

// Private Event
export interface PrivateEvent {
  id: string;
  name: string;
  email: string;
  phone: string;
  time: string;
  event_date: string; // e.g. "2025-07-10"
  event_type: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export type SocialMediaPlatform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "youtube";
export type ContentType = "image" | "video" | "reel" | "short"; // Add or adjust as needed

export interface SocialMediaItem {
  id: string;
  platform: SocialMediaPlatform;
  content_type: ContentType;
  title: string;
  url: string;
  thumbnail_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

// Restaurant Settings
export interface RestaurantSettings {
  id: string;
  restaurant_name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  tiktok_url: string;
  opening_hours: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}
