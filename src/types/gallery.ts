export type GalleryItem = {
  id: number;
  title?: string;
  description?: string;
  image_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  file: File;
};

export type GalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: GalleryItem | null;
  onSaved: () => void;
};

export type GalleryItemInsert = {
  title: string | null;
  description: string | null;
  is_published: boolean;
  image_url: string;
  public_id: string;
};

export type CloudinaryUploadResult = {
  secure_url: string;
};
