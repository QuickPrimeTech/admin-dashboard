export type GalleryItem = {
  id: number;
  title?: string;
  description?: string;
  is_published: boolean;
  image_url: string;
  created_at: string;
  category: string;
  lqip: string | null;
  file: File;
  user_id: string;
};
export type ServerGalleryItem = {
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
  item?: ServerGalleryItem | null;
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
