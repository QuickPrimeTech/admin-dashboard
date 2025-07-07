export type GalleryItem = {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
};

export type GalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: GalleryItem | null;
  onSaved: () => void;
};
