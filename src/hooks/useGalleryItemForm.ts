import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import { formSchema, FormData } from "@/schemas/galllery-item-schema";
import { GalleryItem } from "@/types/gallery"; // assume you have a type for existing item

export function useGalleryItemForm(
  item: GalleryItem | null | undefined,
  onSaved: () => void
) {
  const [uploading] = useState(false);
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

  return {
    form,
    uploading,
    selectedFile,
    setSelectedFile,
    onSubmit,
  };
}
