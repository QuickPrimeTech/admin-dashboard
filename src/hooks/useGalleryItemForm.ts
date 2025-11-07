import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormData as FormDataProps,
} from "@/schemas/galllery-item-schema";
import { ServerGalleryItem } from "@/types/gallery"; // assume you have a type for existing item
import { updateGalleryItem } from "@/helpers/galleryHelpers";
import { useCreateGalleryItemMutation } from "./use-gallery";
import { toast } from "sonner";
import { generateBlurDataURL } from "@/helpers/file-helpers";

export function useGalleryItemForm(
  item: ServerGalleryItem | null | undefined,
  onOpenChange: (open: boolean) => void
) {
  //Mutation function for adding a gallery Item
  const addMutation = useCreateGalleryItemMutation();

  //setting the states that change the UI
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  const form = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      is_published: true,
      image_url: "", // default to empty
      category: "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title || "",
        description: item.description || "",
        is_published: item.is_published,
        image_url: item.image_url,
        category: item.category || "",
      });
      setExistingImageUrl(item.image_url || null); // ADD THIS
    } else {
      form.reset({
        title: "",
        description: "",
        is_published: true,
        image_url: "",
        category: "",
      });
      setSelectedFile(null);
      setExistingImageUrl(null); // ADD THIS
    }
  }, [item, form]);

  const onSubmit = async (data: FormDataProps) => {
    if (item) {
      // If editing existing gallery item
      const payload = { ...data, id: item.id };
      updateGalleryItem(payload, selectedFile);
    } else {
      console.log("About to add gallery photo with mutation");
      if (!selectedFile) {
        toast.error("Please select an image to upload");
        return;
      }

      // Prepare the FormData to send with the mutation
      const formData = new FormData();
      formData.append("title", data.title ?? "");
      formData.append("description", data.description ?? "");
      formData.append("is_published", String(data.is_published));
      formData.append("category", data.category);
      formData.append("file", selectedFile);
      formData.append("lqip", await generateBlurDataURL(selectedFile));

      onOpenChange(false);
      //Running the tanstack mutation query
      addMutation.mutate(formData, {
        onSuccess: () => {
          form.reset(); // clear form
          setSelectedFile(null);
          setExistingImageUrl(null);
        },
        onError: () => {
          onOpenChange(true);
        },
      });
    }
  };

  return {
    form,
    setSelectedFile,
    onSubmit,
    existingImageUrl, // ADD THIS
  };
}
