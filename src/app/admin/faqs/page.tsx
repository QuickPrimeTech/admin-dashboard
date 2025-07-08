"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { FAQDialog } from "@/components/admin/faq-dialog";
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

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);

  // creating the sensors for the drag and drop interface
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setFaqs((prev) => {
      const oldIndex = prev.findIndex((faq) => faq.id === active.id);
      const newIndex = prev.findIndex((faq) => faq.id === over.id);
      const newOrder = arrayMove(prev, oldIndex, newIndex);

      // Optional: Update order_index locally for display
      const updated = newOrder.map((faq, index) => ({
        ...faq,
        order_index: index,
      }));

      // Sync to DB
      updateFAQOrderInDB(updated);

      return updated;
    });
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

  const togglePublished = async (id: string, isPublished: boolean) => {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {loading ? (
        // Skeleton Cards while the data is being fetched
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FaqCardSkeleton key={index} />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first FAQ
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
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
              {faqs.map((faq) => (
                <SortableFAQCard key={faq.id} id={faq.id}>
                  <Card>
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                        <div className="flex items-center gap-2">
                          <Button
                            variant={faq.is_published ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              togglePublished(faq.id, faq.is_published)
                            }
                          >
                            {faq.is_published ? "Published" : "Draft"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(faq)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {faq.question}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {faq.answer}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
        <DialogContent>
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
