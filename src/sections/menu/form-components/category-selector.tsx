"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { MenuItemFormData } from "@/schemas/menu-item-schema";

export function CategorySelect({
  field,
  categories,
}: {
  field: ControllerRenderProps<MenuItemFormData, "category">; // ✅ precise type
  categories: string[];
}) {
  const [localCategories, setLocalCategories] = useState<string[]>(categories);
  const [openDialog, setOpenDialog] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleSelectChange = (value: string) => {
    if (value === "__custom") {
      setOpenDialog(true);
    } else {
      field.onChange(value);
    }
  };

  const handleAddCustom = () => {
    if (!customCategory.trim()) return;

    const newCategory = customCategory.trim();

    // ✅ Add to localCategories first, then update form value
    setLocalCategories((prev) => {
      if (!prev.includes(newCategory)) {
        return [...prev, newCategory];
      }
      return prev;
    });

    // Delay field update until after categories update
    requestAnimationFrame(() => {
      field.onChange(newCategory);
    });

    setCustomCategory("");
    setOpenDialog(false);
  };

  return (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <Select
        value={field.value.toLowerCase()}
        onValueChange={handleSelectChange}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {localCategories
            .filter((c) => c !== "all")
            .map((category) => (
              <SelectItem
                key={category}
                value={category.toLocaleLowerCase()}
                className="capitalize"
              >
                {category}
              </SelectItem>
            ))}
          <SelectItem value="__custom">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Custom
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Dialog for custom category */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
            <DialogDescription>
              Enter a new category name to add it to your menu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustom}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FormMessage />
    </FormItem>
  );
}
