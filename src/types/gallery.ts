export type GalleryItem = {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
};
