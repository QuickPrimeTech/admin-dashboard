"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import { GalleryDialog } from "@/sections/gallery/gallery-dialog";
import { GalleryHeader } from "@/sections/gallery/gallery-header";
import { GalleryFilters } from "@/sections/gallery/gallery-filters";
import { GalleryGrid } from "@/sections/gallery/gallery-grid";
import { GalleryEmptyState } from "@/sections/gallery/gallery-empty-state";
import { GallerySkeletonGrid } from "@/sections/gallery/gallery-skeleton-grid";
import { GalleryItem } from "@/types/gallery";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublished, setShowPublished] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const data = await mockAPI.getGalleryItems();
      setGalleryItems(data);
    } catch {
      toast.error("Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteGalleryItem(id);
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Gallery item deleted successfully");
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
    fetchGalleryItems();
    handleDialogClose();
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      await mockAPI.updateGalleryItem(id, { is_published: !isPublished });
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_published: !isPublished } : item
        )
      );
      toast.success(
        `Gallery item ${
          !isPublished ? "published" : "unpublished"
        } successfully`
      );
    } catch {
      toast.error("Failed to update gallery item status");
    }
  };

  if (loading) return <GallerySkeletonGrid />;

  return (
    <div className="space-y-6">
      <GalleryHeader onAdd={() => setIsDialogOpen(true)} />
      <GalleryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showPublished={showPublished}
        setShowPublished={setShowPublished}
      />
      {filteredItems.length === 0 ? (
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
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
}
