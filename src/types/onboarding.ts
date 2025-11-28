export type Branch = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  opening_hours?: string;
  is_open?: true;
};

export type Restaurant = {
  id: string;
  name: string;
  owner: string | null;
  avatar_url: string | null;
  lqip: string | null;
  website: string | null;
  user_id: string;
};

export type RestaurantInfo = {
  name: string;
};

export type OnboardingStep = "restaurant-info" | "branches" | "complete";
