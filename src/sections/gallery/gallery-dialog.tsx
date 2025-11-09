"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Button } from "@ui/button";
import { Switch } from "@ui/switch";
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@ui/scroll-area";
import { GalleryDialogProps } from "@/types/gallery";
import { useGalleryItemForm } from "@/hooks/useGalleryItemForm";
import { CategorySelect } from "../menu/form-components/category-selector";

export function GalleryDialog({
  open,
  onOpenChange,
  item,
  categories,
}: GalleryDialogProps) {
  // hook that handles all the logic
  const { form, onSubmit, existingImageUrl, setSelectedFile } =
    useGalleryItemForm(item, onOpenChange);

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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <label className="group relative mt-2 block cursor-pointer w-full h-32 rounded-md border border-dashed hover:border-primary transition">
                        {/* hidden file input */}
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              const url = URL.createObjectURL(file);
                              setSelectedFile(file);
                              form.setValue("image_url", url);
                            }
                          }}
                        />

                        {/* show preview if file is selected */}
                        {form.watch("image_url") ? (
                          <>
                            <Image
                              src={form.watch("image_url")}
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
                        ) : existingImageUrl ? (
                          <>
                            <Image
                              src={existingImageUrl}
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
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <CategorySelect field={field} categories={categories} />
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
              </div>
              {/* Published Toggle */}

              {/* Buttons */}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!form.formState.isDirty}>
                  {item ? "Update" : "Create"} Gallery Item
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
