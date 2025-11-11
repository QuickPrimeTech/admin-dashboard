export type GalleryItem = {
  id: number;
  title: string | null;
  description: string | null;
  is_published: boolean;
  image_url: string;
  category: string;
  lqip: string | null;
};

export type GalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: GalleryItem | null;
  categories: string[];
};

export type GalleryItemInsert = {
  title: string | null;
  description: string | null;
  is_published: boolean;
  image_url: string;
  category: string;
  public_id: string;
  lqip: string;
  user_id: string;
};
