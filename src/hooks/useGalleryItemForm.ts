import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormData as FormDataProps,
} from "@/schemas/galllery-item-schema";
import { GalleryItem } from "@/types/gallery"; // assume you have a type for existing item
import { addGalleryImage, updateGalleryItem } from "@/helpers/galleryHelpers";

export function useGalleryItemForm(
  item: GalleryItem | null | undefined,
  onSaved: () => void
) {
  //setting the states that change the UI
  const [uploading, setUploading] = useState<boolean>(false);
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
    setUploading(true);
    if (item) {
      const payload = { ...data, id: item.id };
      updateGalleryItem(payload, setUploading, selectedFile, onSaved);
    } else {
      //Call the function for uploading the menu item
      addGalleryImage(data, setUploading, selectedFile, onSaved);
    }
  };

  return {
    form,
    setSelectedFile,
    uploading,
    onSubmit,
    existingImageUrl, // ADD THIS
  };
}
