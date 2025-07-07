"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GalleryDialogProps } from "@/types/gallery";
import { formSchema } from "@/schemas/galllery-item-schema";
import { FormData } from "@/schemas/galllery-item-schema";

export function GalleryDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: GalleryDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      is_published: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title || "",
        description: item.description || "",
        image_url: item.image_url,
        is_published: item.is_published,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        image_url: "",
        is_published: true,
      });
    }
    setSelectedFile(null);
  }, [item, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (item) {
        await mockAPI.updateGalleryItem(item.id, data);
        toast.success("Gallery item updated successfully");
      } else {
        await mockAPI.createGalleryItem({
          order_index: 0,
          image_url: data.image_url ?? "",
          is_published: data.is_published,
          title: data.title ?? "", // fallback to empty string
          description: data.description ?? "", // fallback to empty string
        });
        toast.success("Gallery item created successfully");
      }

      onSaved();
    } catch {
      toast.error(`Failed to ${item ? "update" : "create"} gallery item`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Gallery Item" : "Add New Gallery Item"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Update the gallery item details below."
              : "Upload a new photo to your gallery."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              const url = URL.createObjectURL(
                                e.target.files[0]
                              );
                              form.setValue("image_url", url);
                            }
                          }}
                          disabled={uploading}
                        />

                        {/* If there is an image URL, show preview */}
                        {form.watch("image_url") ? (
                          <>
                            <Image
                              src={
                                form.watch("image_url") || "/placeholder.svg"
                              }
                              alt="Preview"
                              fill
                              className="absolute inset-0 object-cover rounded-md"
                            />
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

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a title for this image..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Published Toggle */}
              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Make this image visible in the gallery
                      </div>
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

              {/* Buttons */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading
                    ? item
                      ? "Updating..."
                      : "Creating..."
                    : item
                    ? "Update"
                    : "Create"}{" "}
                  Gallery Item
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
