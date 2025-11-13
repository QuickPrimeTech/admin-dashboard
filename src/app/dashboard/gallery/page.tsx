"use client";

import { useState, useMemo } from "react";

import { GalleryDialog } from "@/sections/gallery/gallery-dialog";
import { GalleryHeader } from "@/sections/gallery/gallery-header";
import { GalleryFilters } from "@/sections/gallery/gallery-filters";
import { GalleryGrid } from "@/sections/gallery/gallery-grid";
import { GalleryEmptyState } from "@/sections/gallery/gallery-empty-state";
import { GallerySkeletonGrid } from "@/sections/gallery/gallery-skeleton-grid";

import { GalleryItem } from "@/types/gallery";
import { useGalleryQuery } from "@/hooks/use-gallery";
import { useBranch } from "@/components/providers/branch-provider";

export default function GalleryPage() {
  //using the branchId from the context
  const {branchId} = useBranch()
  
  //Fetch data with TanStack Query
  const { data: response, isError, isPending, refetch } = useGalleryQuery(branchId);

  const galleryItems = response ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [showPublished, setShowPublished] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

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

  // ✅ Dialog handlers
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
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

  //  UI Rendering
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
        <GalleryGrid items={filteredItems} onEdit={handleEdit} />
      )}

      <GalleryDialog
        categories={categories}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        item={editingItem}
      />
    </div>
  );
}
