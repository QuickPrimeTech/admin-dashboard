"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@ui/select";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@ui/dialog";
import { Plus } from "lucide-react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type CategorySelectProps<TFieldValues extends FieldValues> = {
  field: ControllerRenderProps<TFieldValues>;
  categories: string[];
};

export function CategorySelect<TFieldValues extends FieldValues>({
  field,
  categories,
}: CategorySelectProps<TFieldValues>) {
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

    setLocalCategories((prev) =>
      prev.includes(newCategory) ? prev : [...prev, newCategory]
    );

    requestAnimationFrame(() => {
      field.onChange(newCategory);
    });

    setCustomCategory("");
    setOpenDialog(false);
  };

  return (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <Select value={field.value} onValueChange={handleSelectChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {localCategories
            .filter((c) => c !== "all")
            .map((category) => (
              <SelectItem key={category} value={category}>
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

      {/* Dialog for adding a custom category */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
            <DialogDescription>
              Enter a new category name to add it to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  handleAddCustom();
                }
              }}
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
