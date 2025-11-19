export type Offer = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  start_date: string | null;
  end_date: string | null;
  days_of_week: string[];
  branch_id: string;
  public_id: string;
  lqip: string | null;
};
