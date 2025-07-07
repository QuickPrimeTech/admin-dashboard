"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, "Image is required"),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: GalleryItem | null;
  onSaved: () => void;
}

export function GalleryDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: GalleryDialogProps) {
  const [uploading, setUploading] = useState(false);

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
  }, [item, form]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await mockAPI.uploadFile(file);
      form.setValue("image_url", imageUrl);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image due to ");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (item) {
        await mockAPI.updateGalleryItem(item.id, data);
        toast.success("Gallery item updated successfully");
      } else {
        await mockAPI.createGalleryItem({
          order_index: 0,
          image_url: data.image_url,
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
      <DialogContent className="sm:max-w-[600px]">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel>Image</FormLabel>
              <div className="mt-2 space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-muted-foreground">
                    Uploading image...
                  </p>
                )}
                {form.watch("image_url") && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={form.watch("image_url") || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {!form.watch("image_url") && !uploading && (
                  <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Upload an image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                disabled={uploading || !form.watch("image_url")}
              >
                {item ? "Update" : "Create"} Gallery Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
