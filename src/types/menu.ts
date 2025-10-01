export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary_preference: string[];
  image_url?: string;
  is_available: boolean;
  user_id: string;
  public_id?: string; // Add this line
};

export interface MenuItemForm {
  item?: MenuItem | null;
  onSaved: () => void;
  onOpenChange: (open: boolean) => void;
  categories: string[]; // 👈 add this
}

export type FormDataFields = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: string | boolean;
  dietary_preference?: string[];
  image_url?: string;
};
