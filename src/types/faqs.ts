export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export type FAQEmptyStateProps = {
  setIsDialogOpen: (open: boolean) => void;
};
