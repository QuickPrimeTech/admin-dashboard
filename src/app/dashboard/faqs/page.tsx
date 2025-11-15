"use client";

import { useState } from "react";
import { FaqFilterDropdown } from "@/sections/faqs/faq-filter-dropdown";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui/dialog";
import { Plus } from "lucide-react";
import { FAQDialog } from "@/sections/faqs/faq-dialog";
import { toast } from "sonner";
import { FaqCardSkeleton } from "@/components/skeletons/faq-skeleton";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableFAQCard } from "@/components/sortable-faq-card";
import { FAQ } from "@/types/faqs";
import { FAQEmptyState } from "@/sections/faqs/faq-empty-state";
import { FAQCard } from "@/sections/faqs/faq-card";
import { useFaqsQuery } from "@/hooks/use-faqs";
import { useBranch } from "@/components/providers/branch-provider";

export default function FAQsPage() {
  const { branchId } = useBranch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [filterValue, setFilterValue] = useState("Order");

  const { data: faqs, isPending } = useFaqsQuery(branchId);

  //sorting the faqs
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // optional: require moving 5px before dragging starts
      },
      // This cancels drag start when pointer down on these selectors
      cancel: [
        "button",
        "input",
        "textarea",
        "select",
        "svg",
        "path",
        "paragraph",
      ],
    })
  );

  // State for delete confirmation
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const confirmDelete = (faq: FAQ) => {
    setFaqToDelete(faq);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!faqToDelete) return;

    try {
      const res = await fetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faqToDelete.id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete FAQ");
      }

      toast.success("FAQ deleted successfully");
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
  };

  const handleFAQSaved = () => {
    handleDialogClose();
  };

  const togglePublished = async (id: number, isPublished: boolean) => {
    try {
      const res = await fetch("/api/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: !isPublished }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      toast.success(
        `FAQ ${!isPublished ? "published" : "unpublished"} successfully`
      );
    } catch {
      toast.error("Failed to update FAQ status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions
          </p>
        </div>

        <div className="flex gap-2">
          <FaqFilterDropdown value={filterValue} onChange={setFilterValue} />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus />
            Add FAQ
          </Button>
        </div>
      </div>

      {isPending ? (
        // Skeleton Cards while the data is being fetched
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FaqCardSkeleton key={index} />
          ))}
        </div>
      ) : faqs && faqs.length === 0 ? (
        <FAQEmptyState setIsDialogOpen={setIsDialogOpen} />
      ) : faqs && filterValue === "Order" ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter}>
          <SortableContext
            items={faqs.map((faq) => faq.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {faqs &&
                faqs.map((faq) => (
                  <SortableFAQCard key={faq.id} id={faq.id}>
                    <FAQCard
                      faq={faq}
                      handleEdit={handleEdit}
                      confirmDelete={confirmDelete}
                      togglePublished={togglePublished}
                    />
                  </SortableFAQCard>
                ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-4">
          {faqs &&
            faqs.map((faq) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                handleEdit={handleEdit}
                confirmDelete={confirmDelete}
                togglePublished={togglePublished}
              />
            ))}
        </div>
      )}

      <FAQDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        faq={editingFaq}
        onSaved={handleFAQSaved}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby="Delete the faq">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this FAQ?</p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
