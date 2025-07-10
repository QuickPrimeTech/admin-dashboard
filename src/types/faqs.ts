export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  user_id: string;
}

export type FAQEmptyStateProps = {
  setIsDialogOpen: (open: boolean) => void;
};

export type FAQDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
  onSaved: () => void;
};
