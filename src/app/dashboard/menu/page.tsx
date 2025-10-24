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
import axios from "axios";
import { useDeleteMenuMutation, useMenuQuery } from "@/hooks/use-menu";

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🚀 useQuery handles loading + error + caching
  const { data: menuItems = [], isLoading, refetch } = useMenuQuery();

  // CRUD Handlers
  const handleDelete = useDeleteMenuMutation();

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
