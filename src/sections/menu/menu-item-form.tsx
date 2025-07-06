"use client";

import { useState } from "react";
import { UploadCloud, UploadIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { useMenuItemForm } from "@/hooks/useMenuItemForm";
import { MenuItemForm as MenuItemFormProps } from "@/types/menu";
import { categories, dietaryTypes } from "@/constants/menu";
import { X } from "lucide-react";
import Image from "next/image";

export function MenuItemForm({
  item,
  onSaved,
  onOpenChange,
}: MenuItemFormProps) {
  const {
    form,
    selectedTypes,
    uploading,
    handleTypeToggle,
    handleImageUpload,
    onSubmit,
  } = useMenuItemForm(item, onSaved);
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Menu item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (Ksh)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter the price"
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : parseFloat(val));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the menu item..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category and Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="capitalize"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Available</FormLabel>
                  <FormDescription>
                    Is this item currently available?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Dietary Types */}
        <div>
          <FormLabel>Dietary Types</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {dietaryTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTypeToggle(type)}
              >
                {type}
                {selectedTypes.includes(type) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image_url"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <label className="group relative mt-2 block cursor-pointer w-full h-32 rounded-md border border-dashed hover:border-primary transition">
                  {/* The file input - hidden but still clickable via label */}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setShowSkeleton(true);
                        const url = URL.createObjectURL(e.target.files[0]);
                        form.setValue("image_url", url);
                        handleImageUpload(e);
                      }
                    }}
                    disabled={uploading}
                  />

                  {/* If there is an image URL, show preview */}
                  {form.watch("image_url") ? (
                    <>
                      <Image
                        src={form.watch("image_url") || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="absolute inset-0 object-cover rounded-md"
                        onLoad={() => setShowSkeleton(false)}
                      />
                      {showSkeleton && (
                        <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-sm font-medium">
                          Click to change
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <UploadIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploading || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <span className="mr-2 animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
            )}
            {item ? "Update" : "Create"} Menu Item
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
