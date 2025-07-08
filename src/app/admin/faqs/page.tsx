"use client";

import { useState, useEffect, useRef } from "react";
import { FaqFilterDropdown } from "@/sections/faqs/faq-filter-dropdown";
import { sortFaqs } from "@/helpers/faqsHelper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableFAQCard } from "@/components/sortable-faq-card";
import { FAQ } from "@/types/faqs";
import { updateFAQOrderInDB } from "@/helpers/faqsHelper";
import { FAQEmptyState } from "@/sections/faqs/faq-empty-state";
import { FAQCard } from "@/sections/faqs/faq-card";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("Latest");

  //sorting the faqs
  const filteredFaqs = faqs.length > 0 ? sortFaqs(faqs, filterValue) : [];
  // creating the sensors for the drag and drop interface
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

  // Inside your component
  const faqsRef = useRef<FAQ[]>(faqs);

  useEffect(() => {
    faqsRef.current = faqs;
  }, [faqs]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Get current FAQs from ref
    const oldIndex = faqsRef.current.findIndex((faq) => faq.id === active.id);
    const newIndex = faqsRef.current.findIndex((faq) => faq.id === over.id);

    // Create the new ordered array
    const newOrder = arrayMove(faqsRef.current, oldIndex, newIndex);

    // Update order_index for each item
    const updated = newOrder.map((faq, index) => ({
      ...faq,
      order_index: index,
    }));

    // Update React state once
    setFaqs(updated);

    // Sync to DB once
    updateFAQOrderInDB(updated);
  };

  // State for delete confirmation
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await fetch("/api/faqs", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        console.log(data.data);
        setFaqs(data.data);
      }
    } catch {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

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

      setFaqs((prev) => prev.filter((faq) => faq.id !== faqToDelete.id));
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
    fetchFAQs();
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

      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === id ? { ...faq, is_published: !isPublished } : faq
        )
      );

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
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>
      </div>

      {loading ? (
        // Skeleton Cards while the data is being fetched
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FaqCardSkeleton key={index} />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <FAQEmptyState setIsDialogOpen={setIsDialogOpen} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs.map((faq) => faq.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
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
