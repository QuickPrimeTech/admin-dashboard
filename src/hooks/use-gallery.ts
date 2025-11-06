// @/hooks/use-gallery.ts

import { ApiResponse } from "@/helpers/api-responses";
import { GalleryItem, ServerGalleryItem } from "@/types/gallery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

//This is where all the tanstack queries are stored for the gallery page

//This is the name of the key to reuse
export const GALLERY_ITEMS_QUERY_KEY = ["gallery-items"];

//This is the function that runs for the fetch query
const fetchGalleryItems = async () => {
  try {
    const { data } = await axios.get("/api/gallery");

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch gallery items");
    }

    return data; // Return the parsed response (TanStack will cache this)
  } catch (error: any) {
    console.error("Gallery fetch error:", error);
    toast.error(
      error?.response?.data?.message || "Failed to fetch gallery items"
    );
    throw error;
  }
};

//Query for getting all the gallery items
export function useGalleryQuery() {
  return useQuery<ApiResponse<ServerGalleryItem[]>>({
    queryKey: GALLERY_ITEMS_QUERY_KEY,
    queryFn: fetchGalleryItems,
  });
}

export function useCreateGalleryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ServerGalleryItem>, // Success type
    AxiosError<ApiResponse<null>>, // Error type
    FormData, // Variables
    { prevGalleryItems?: ServerGalleryItem[] }
  >({
    mutationFn: async (formData) => {
      const res = await axios.post<ApiResponse<ServerGalleryItem>>(
        "/api/gallery",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    // 🚀 Optimistic update: instantly show the new image
    onMutate: async (newFormData) => {
      await queryClient.cancelQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });

      const prevGalleryItems = queryClient.getQueryData<ServerGalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY
      );

      // Create a temporary preview item (optimistic)
      const previewUrl = newFormData.get("file")
        ? URL.createObjectURL(newFormData.get("file") as File)
        : "";
      const tempItem: ServerGalleryItem = {
        id: Date.now(), // temporary unique ID
        title: newFormData.get("title") as string,
        description: newFormData.get("description") as string,
        category: newFormData.get("category") as string,
        is_published: newFormData.get("is_published") === "true",
        image_url: previewUrl,
        lqip: "aldfjdfad",
        created_at: new Date().toISOString(),
      };
      //Optimistically updating the temporary item so that the use sees instant results
      if (prevGalleryItems?.length && prevGalleryItems.length > 0) {
        queryClient.setQueryData(GALLERY_ITEMS_QUERY_KEY, [
          tempItem,
          ...prevGalleryItems,
        ]);
      }

      return { prevGalleryItems };
    },
    onSuccess: (res) => {
      //Gettting the gallery image from the server
      const newItem = res.data;
      if (!newItem) return;

      toast.success(res.message || "Gallery image added successfully!");
      // Correct query key usage
      const previousGalleryItems =
        queryClient.getQueryData<ServerGalleryItem[]>(
          GALLERY_ITEMS_QUERY_KEY
        ) || [];
      if (previousGalleryItems.length === 0) return;
      //if the cache already exists, I am going to proceed by adding the gallery item
      queryClient.setQueryData<ServerGalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY,
        () => [newItem, ...previousGalleryItems]
      );
    },
    onError: (err, _variables, onMutateResult) => {
      const message =
        err.response?.data?.message || "Failed to create gallery image";
      toast.error(message);

      //Rollback the changes by removing the gallery temporary gallery item from the cache
      if (onMutateResult?.prevGalleryItems) {
        queryClient.setQueryData(
          GALLERY_ITEMS_QUERY_KEY,
          onMutateResult.prevGalleryItems
        );
      }

      const errors = err.response?.data?.data;
      if (errors) {
        try {
          const parsed = JSON.parse(errors);
          Object.entries(parsed).forEach(([field, msgs]) => {
            (msgs as string[]).forEach((msg) =>
              toast.error(`${field}: ${msg}`)
            );
          });
        } catch {}
      }

      console.error("Create gallery item error:", err);
    },
  });
}
