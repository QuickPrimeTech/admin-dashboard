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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import Image from "next/image";
import { ContentType, SocialMediaPlatform } from "@/types/mock-api";

const formSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  content_type: z.string().min(1, "Content type is required"),
  title: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface SocialMediaItem {
  id: string;
  platform: string;
  content_type: string;
  title?: string;
  url: string;
  thumbnail_url?: string;
  order_index: number;
  is_published: boolean;
}

interface SocialMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SocialMediaItem | null;
  onSaved: () => void;
}

const platforms = ["instagram", "tiktok", "youtube", "facebook", "twitter"];
const contentTypes = ["video", "image", "post"];

export function SocialMediaDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: SocialMediaDialogProps) {
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "",
      content_type: "",
      title: "",
      url: "",
      thumbnail_url: "",
      is_published: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        platform: item.platform,
        content_type: item.content_type,
        title: item.title || "",
        url: item.url,
        thumbnail_url: item.thumbnail_url || "",
        is_published: item.is_published,
      });
    } else {
      form.reset({
        platform: "",
        content_type: "",
        title: "",
        url: "",
        thumbnail_url: "",
        is_published: true,
      });
    }
  }, [item, form]);

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await mockAPI.uploadFile(file);
      form.setValue("thumbnail_url", imageUrl);
      toast.success("Thumbnail uploaded successfully");
    } catch {
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      platform: data.platform as SocialMediaPlatform,
      content_type: data.content_type as ContentType,
    };

    try {
      if (item) {
        await mockAPI.updateSocialMediaItem(item.id, payload);
        toast.success("Social media item updated successfully");
      }
      onSaved();
    } catch {
      toast.error(`Failed to ${item ? "update" : "create"} social media item`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {item
              ? "Edit Social Media Content"
              : "Add New Social Media Content"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Update the social media content details below."
              : "Add new social media content to your page."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem
                            key={platform}
                            value={platform}
                            className="capitalize"
                          >
                            {platform}
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
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Thumbnail (Optional)</FormLabel>
              <div className="mt-2 space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-muted-foreground">
                    Uploading thumbnail...
                  </p>
                )}
                {form.watch("thumbnail_url") && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={form.watch("thumbnail_url") || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {!form.watch("thumbnail_url") && !uploading && (
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Upload thumbnail
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this content visible on the follow us page
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
              <Button type="submit" disabled={uploading}>
                {item ? "Update" : "Create"} Content
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
