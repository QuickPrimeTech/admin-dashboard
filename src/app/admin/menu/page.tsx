"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuItemDialog } from "@/sections/menu/menu-item-dialog";
import { MenuFilters } from "@/sections/menu/menu-filters";
import { MenuGrid } from "@/sections/menu/menu-grid";
import { toast } from "sonner";
import { MenuItem } from "@/types/menu";
import { MenuItemSkeleton } from "@/components/menu-item-skeleton";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  const filterItems = useCallback(() => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === selectedCategory
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu-items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        setMenuItems(result.data);
      } else {
        toast.error("Server error: " + result.message);
      }
    } catch {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/menu-items?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unknown error");
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Menu item deleted successfully");
    } catch {
      toast.error("Failed to delete menu item");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = () => {
    fetchMenuItems();
    handleDialogClose();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">
              Manage your restaurant&apos;s menu items
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>

        <MenuFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s menu items
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <MenuFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <MenuGrid
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
}
