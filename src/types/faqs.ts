export type FAQ = {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  branch_id: string;
};

export type CreateFaqInput = Omit<
  FAQ,
  "id" | "order_index" | "created_at" | "branch_id"
>;

export type FAQEmptyStateProps = {
  setIsDialogOpen: (open: boolean) => void;
};

export type FAQDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
};
