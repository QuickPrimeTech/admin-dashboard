export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: string[];
  image_url?: string;
  is_available: boolean;
};

export type MenuItemForm = {
  item?: MenuItem | null;
  onSaved: () => void;
  onOpenChange: (open: boolean) => void;
};
