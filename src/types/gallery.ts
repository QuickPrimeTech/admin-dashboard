export type GalleryItem = {
  id: number;
  title?: string;
  description?: string;
  image_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  file: File;
  user_id: string;
  category: string;
};

export type GalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: GalleryItem | null;
  onSaved: () => void;
  categories: string[];
};

export type GalleryItemInsert = {
  title: string | null;
  description: string | null;
  is_published: boolean;
  image_url: string;
  category: string;
  public_id: string;
  user_id: string;
};
