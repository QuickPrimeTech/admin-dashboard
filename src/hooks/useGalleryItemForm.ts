import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormData as FormDataProps,
} from "@/schemas/gallery-item-schema";
import { GalleryItem } from "@/types/gallery"; // assume you have a type for existing item
import { buildGalleryFormData } from "@/helpers/galleryHelpers";
import {
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
} from "./use-gallery";
import { toast } from "sonner";
import { generateBlurDataURL } from "@/helpers/file-helpers";
import { useBranch } from "@providers/branch-provider";

export function useGalleryItemForm(
  item: GalleryItem | null | undefined,
  onOpenChange: (open: boolean) => void
) {
  //Get the branchId from the context
  const {branchId} = useBranch();

  //Mutation function for adding a gallery Item
  const addMutation = useCreateGalleryItemMutation();
  //Mutation function for adding a gallery Item
  const updateMutation = useUpdateGalleryItemMutation();

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
      console.log(selectedFile);
      //Creating a lqip if the image changed
      let lqip;
      if (selectedFile) {
        lqip = await generateBlurDataURL(selectedFile);
      }

      const updatedItem = {
        ...item,
        ...data,
        ...(lqip && { lqip }), // spread conditionally
      };
      // Editing
      const formData = await buildGalleryFormData(
        { id: item.id, ...data },
        selectedFile
      );

      console.log("formData from update--->", formData);
      console.log("Incoming data --->", data);

      //close the edit diaog
      onOpenChange(false);
      //Running the tanstack mutation query
      updateMutation.mutate(
        { formData, updatedItem, branchId },
        {
          onSuccess: () => {
            form.reset(); // clear form
            setSelectedFile(null);
            setExistingImageUrl(null);
          },
        }
      );
    } else {
      // Creating
      if (!selectedFile) {
        toast.error("Please select an image to upload");
        return;
      }

      console.log("Adding new gallery item...");
      const formData = await buildGalleryFormData(data, selectedFile, true);
      console.log("formData from create--->", formData);

      onOpenChange(false);
      //Running the tanstack mutation query
      addMutation.mutate({formData, branchId}, {
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
