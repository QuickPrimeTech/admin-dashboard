import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  formSchema,
  FormData as FormDataProps,
} from "@/schemas/galllery-item-schema";
import { GalleryItem } from "@/types/gallery"; // assume you have a type for existing item

export function useGalleryItemForm(
  item: GalleryItem | null | undefined,
  onSaved: () => void
) {
  const [uploading, setUploading] = useState<boolean>(false);

  const form = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      is_published: true,
      file: undefined as unknown as File, // default to empty
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title || "",
        description: item.description || "",
        is_published: item.is_published,
        file: undefined as unknown as File,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        is_published: true,
        file: undefined as unknown as File,
      });
    }
  }, [item, form]);

  const onSubmit = async (data: FormDataProps) => {
    setUploading(true);
    try {
      const formData = new FormData();
      //Adding all the data to the form item
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("is_published", String(data.is_published));
      formData.append("file", data.file);

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        toast.error(errorData.error || "Failed to upload");
        setUploading(false);
        return;
      }

      const savedItem = await res.json();
      console.log(savedItem);
      setUploading(false);
      toast.success(savedItem.message);
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return {
    form,
    uploading,
    onSubmit,
  };
}
