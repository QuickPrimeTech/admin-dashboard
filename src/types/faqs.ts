import { Dispatch, SetStateAction } from "react";

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  branch_id: string;
};

export type FAQEmptyStateProps = {
  setIsDialogOpen: (open: boolean) => void;
};

export type FAQDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  faq: FAQ | null;
};
