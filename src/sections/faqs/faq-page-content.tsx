"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { FAQDialog } from "@/sections/faqs/faq-dialog";
import { FaqCardSkeleton } from "@/components/skeletons/faq-skeleton";
import { FAQEmptyState } from "@/sections/faqs/faq-empty-state";
import { FAQCard } from "@/sections/faqs/faq-card";
import { useFaqsQuery } from "@/hooks/use-faqs";
import { useBranch } from "@/components/providers/branch-provider";
import { FAQ } from "@/types/faqs";

export function FAQsPageContent() {
  const { branchId } = useBranch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  //Fetching query
  const { data: faqs, isPending } = useFaqsQuery(branchId);

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
  };

  return (
    <div className="space-y-6">
      {/* ------- header ------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* ------- content ------- */}
      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <FaqCardSkeleton key={i} />
          ))}
        </div>
      ) : !faqs?.length ? (
        <FAQEmptyState setIsDialogOpen={setIsDialogOpen} />
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQCard key={faq.id} faq={faq} handleEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* ------- dialogs ------- */}
      <FAQDialog
        setIsDialogOpen={setIsDialogOpen}
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        faq={editingFaq}
      />
    </div>
  );
}
