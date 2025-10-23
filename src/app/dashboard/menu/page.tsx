"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { MenuFilters } from "@/sections/menu/menu-filters";
import { MenuGrid } from "@/sections/menu/menu-grid";
import { MenuItem } from "@/types/menu";
import { MenuFiltersSkeleton } from "@/components/skeletons/menu-filter-skeleton";
import { MenuItemSkeleton } from "@/components/skeletons/menu-item-skeleton";

async function fetchMenuItems() {
  const res = await fetch("/api/menu-items", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  const result = await res.json();

  if (!result.success) throw new Error(result.message || "Server error");
  return result.data as MenuItem[];
}

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🚀 useQuery handles loading + error + caching
  const {
    data: menuItems = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 5, // 1 minute caching
  });

  // Extract categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((i) => i.category)));
    return ["all", ...unique];
  }, [menuItems]);

  // Filter logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  // CRUD Handlers
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/menu-items?id=${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to delete");
      toast.success("Menu item deleted successfully");
      refetch(); //  Re-fetch updated data
    } catch {
      toast.error("Failed to delete menu item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s menu items
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={"/dashboard/menu/add"}>
              <Plus className="size-4" />
              Add Menu Item
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/qrcode-generator">
              <QrCode className="size-4" />
              Get QR Code
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {isLoading ? (
        <MenuFiltersSkeleton />
      ) : (
        <MenuFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      )}

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      ) : (
        <MenuGrid items={filteredItems} onDelete={handleDelete} />
      )}
    </div>
  );
}
