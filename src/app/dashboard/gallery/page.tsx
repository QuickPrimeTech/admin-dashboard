"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { GalleryDialog } from "@/sections/gallery/gallery-dialog";
import { GalleryHeader } from "@/sections/gallery/gallery-header";
import { GalleryFilters } from "@/sections/gallery/gallery-filters";
import { GalleryGrid } from "@/sections/gallery/gallery-grid";
import { GalleryEmptyState } from "@/sections/gallery/gallery-empty-state";
import { GallerySkeletonGrid } from "@/sections/gallery/gallery-skeleton-grid";

import { GalleryItem, ServerGalleryItem } from "@/types/gallery";
import { deleteGalleryItem } from "@/helpers/galleryHelpers";
import { GALLERY_ITEMS_QUERY_KEY, useGalleryQuery } from "@/hooks/use-gallery";

export default function GalleryPage() {
  // ✅ Fetch data with TanStack Query
  const { data: response, isError, isPending, refetch } = useGalleryQuery();

  const galleryItems = response ?? [];

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [showPublished, setShowPublished] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServerGalleryItem | null>(
    null
  );

  // ✅ Handle empty or loading states gracefully
  const categories = Array.from(
    new Set(galleryItems.map((item) => item.category).filter(Boolean))
  );

  const filteredItems = useMemo(() => {
    let filtered = galleryItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showPublished !== "all") {
      const isPublished = showPublished === "published";
      filtered = filtered.filter((item) => item.is_published === isPublished);
    }

    return filtered;
  }, [galleryItems, searchTerm, showPublished]);

  // ✅ Delete item and invalidate cache
  const handleDelete = async (id: number) => {
    try {
      await deleteGalleryItem(id);
      toast.success("Gallery item deleted");
      queryClient.invalidateQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });
    } catch {
      toast.error("Failed to delete gallery item");
    }
  };

  // ✅ Toggle publish status with revalidation
  const togglePublished = async (id: number, isPublished: boolean) => {
    try {
      const res = await fetch("/api/gallery/publish-toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: isPublished }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to toggle published status");
      }

      toast.success("Publish status updated");
      queryClient.invalidateQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });
    } catch (error) {
      toast.error("Failed to update publish status");
      console.error(error);
    }
  };

  // ✅ Dialog handlers
  const handleEdit = (item: ServerGalleryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = () => {
    handleDialogClose();
  };

  // Error boundary UI
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-2">
          Something went wrong fetching the gallery.
        </p>
        <button
          onClick={() => refetch()}
          className="text-primary underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  // ✅ UI Rendering
  return (
    <div className="space-y-6">
      <GalleryHeader onAdd={() => setIsDialogOpen(true)} />
      <GalleryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showPublished={showPublished}
        setShowPublished={setShowPublished}
      />

      {isPending ? (
        <GallerySkeletonGrid />
      ) : filteredItems.length === 0 ? (
        <GalleryEmptyState
          onAdd={() => setIsDialogOpen(true)}
          searchTerm={searchTerm}
          showPublished={showPublished}
        />
      ) : (
        <GalleryGrid
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublished={togglePublished}
        />
      )}

      <GalleryDialog
        categories={categories}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
}
