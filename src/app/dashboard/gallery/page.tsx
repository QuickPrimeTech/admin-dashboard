"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { GalleryDialog } from "@/sections/gallery/gallery-dialog";
import { GalleryHeader } from "@/sections/gallery/gallery-header";
import { GalleryFilters } from "@/sections/gallery/gallery-filters";
import { GalleryGrid } from "@/sections/gallery/gallery-grid";
import { GalleryEmptyState } from "@/sections/gallery/gallery-empty-state";
import { GallerySkeletonGrid } from "@/sections/gallery/gallery-skeleton-grid";
import { GalleryItem } from "@/types/gallery";
import { deleteGalleryItem } from "@/helpers/galleryHelpers";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublished, setShowPublished] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch the gallery items from your /api/gallery route

  const categories = Array.from(
    new Set(galleryItems.map((item) => item.category).filter(Boolean))
  );

  const filterItems = useCallback(() => {
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

    setFilteredItems(filtered);
  }, [galleryItems, searchTerm, showPublished]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const handleDelete = async (id: number) => {
    try {
      await deleteGalleryItem(id);
    } catch {
      toast.error("Failed to delete gallery item");
    }
  };

  const handleEdit = (item: GalleryItem) => {
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
    } catch (error) {
      toast.error("Failed to update publish status");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <GalleryHeader onAdd={() => setIsDialogOpen(true)} />
      <GalleryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showPublished={showPublished}
        setShowPublished={setShowPublished}
      />

      {loading ? (
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
        onOpenChange={handleDialogClose}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
}
