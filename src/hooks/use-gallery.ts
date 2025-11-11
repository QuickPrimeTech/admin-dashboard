// @/hooks/use-gallery.ts

import { ApiResponse } from "@/helpers/api-responses";
import { StatsOverviewData } from "@/sections/dashboard/stats-overview";
import { GalleryItem } from "@/types/gallery";
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

    return data.data; // Return the parsed response (TanStack will cache this)
  } catch (error) {
    console.error("Gallery fetch error:", error);
    if (error instanceof AxiosError) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch gallery items"
      );
    }
    throw error;
  }
};

//Query for getting all the gallery items
export function useGalleryQuery() {
  return useQuery<GalleryItem[]>({
    queryKey: GALLERY_ITEMS_QUERY_KEY,
    queryFn: fetchGalleryItems,
  });
}

export function useCreateGalleryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GalleryItem>, // Success type
    AxiosError<ApiResponse<null>>, // Error type
    FormData, // Variables
    { prevGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (formData) => {
      const res = await axios.post<ApiResponse<GalleryItem>>(
        "/api/gallery",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    //  Optimistic update: instantly show the new image
    onMutate: async (newFormData) => {
      await queryClient.cancelQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });

      const prevGalleryItems = queryClient.getQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY
      );

      // Create a temporary preview item (optimistic)
      const previewUrl = newFormData.get("file")
        ? URL.createObjectURL(newFormData.get("file") as File)
        : "";
      const tempItem: GalleryItem = {
        id: Math.random(), // temporary unique ID
        title: newFormData.get("title") as string,
        description: newFormData.get("description") as string,
        category: newFormData.get("category") as string,
        is_published: newFormData.get("is_published") === "true",
        image_url: previewUrl,
        lqip: "aldfjdfad",
      };

      //Optimistically updating the temporary item so that the use sees instant results
      queryClient.setQueryData(GALLERY_ITEMS_QUERY_KEY, [
        tempItem,
        ...(prevGalleryItems ?? []),
      ]);

      return { prevGalleryItems };
    },
    onSuccess: (res, _variables, onMutateResult) => {
      //Gettting the gallery image from the server
      const newItem = res.data;
      console.log(newItem);
      if (!newItem) return;

      toast.success(res.message || "Gallery image added successfully!");

      queryClient.setQueryData(GALLERY_ITEMS_QUERY_KEY, [
        newItem,
        ...(onMutateResult.prevGalleryItems ?? []),
      ]);
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
          const parsed =
            typeof errors === "string" ? JSON.parse(errors) : errors;
          Object.entries(parsed).forEach(([field, msgs]) => {
            (msgs as string[]).forEach((msg) =>
              toast.error(`${field}: ${msg}`)
            );
          });
        } catch (parseErr) {
          console.error("Error parsing validation messages:", parseErr);
        }
      }
    },
  });
}

export function useUpdateGalleryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GalleryItem>,
    AxiosError<ApiResponse<null>>,
    { formData: FormData; updatedItem: GalleryItem },
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async ({ formData }) => {
      const res = await axios.patch(`/api/gallery`, formData);
      return res.data;
    },
    onMutate: async ({ updatedItem }) => {
      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems = queryClient.getQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY
      );

      //Getting the id from the formData
      const id = updatedItem.id;

      //Updating  the gallery item from the cache for the user to get immediate feedback
      queryClient.setQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY,
        (old) => {
          return old?.map((galleryItem) =>
            galleryItem.id === id ? updatedItem : galleryItem
          );
        }
      );

      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, _id, onMutateResult) => {
      const message =
        err.response?.data.message ||
        "An error occurred while updating your gallery photo";
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(
          GALLERY_ITEMS_QUERY_KEY,
          onMutateResult.previousGalleryItems
        );
      }
      //Giving the user feedback that the request didn't go through
      toast.error(message);
    },
    onSuccess: (deletedItem) => {
      toast.success(
        deletedItem.message || "Gallery photo was updated successfully"
      );
    },
  });
}

export function useDeleteGalleryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GalleryItem>,
    AxiosError<ApiResponse<null>>,
    number,
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/gallery?id=${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems = queryClient.getQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY
      );

      //Removing the gallery item from the cache for the user to get immediate feedback
      queryClient.setQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY,
        (old) => {
          return old?.filter((galleryItem) => galleryItem.id !== id);
        }
      );

      //Updating the overview stats from the homepage to have the reduced value
      queryClient.setQueryData<StatsOverviewData>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, gallery: old.gallery - 1 };
      });
      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, _id, onMutateResult) => {
      const message =
        err.response?.data.message ||
        "An error occurred while deleting your gallery photo";
      console.log(err);
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(
          GALLERY_ITEMS_QUERY_KEY,
          onMutateResult.previousGalleryItems
        );
      }
      //Rolling back the overview stats gallery count
      queryClient.setQueryData<StatsOverviewData>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, gallery: old.gallery + 1 };
      });
      //Giving the user feedback that the request didn't go through
      toast.error(message);
    },
    onSuccess: (deletedItem) => {
      toast.success(
        deletedItem.message || "Gallery Item was deleted successfully"
      );
    },
  });
}

export function useTogglePublishedMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GalleryItem>,
    AxiosError<ApiResponse<null>>,
    { id: number; is_published: boolean },
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (updatedItem) => {
      const res = await axios.patch(
        `/api/gallery/publish-toggle`,
        JSON.stringify(updatedItem)
      );
      return res.data;
    },
    onMutate: async (updatedItem) => {
      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey: GALLERY_ITEMS_QUERY_KEY });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems = queryClient.getQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY
      );

      //Updating the is_published to the one passed from the form
      queryClient.setQueryData<GalleryItem[]>(
        GALLERY_ITEMS_QUERY_KEY,
        (old) => {
          return old?.map((galleryItem) =>
            galleryItem.id === updatedItem.id
              ? { ...galleryItem, is_published: updatedItem.is_published }
              : galleryItem
          );
        }
      );

      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, _id, onMutateResult) => {
      const message =
        err.response?.data.message ||
        "An error occurred while deleting your gallery photo";
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(
          GALLERY_ITEMS_QUERY_KEY,
          onMutateResult.previousGalleryItems
        );
      }

      //Giving the user feedback that the request didn't go through
      toast.error(message);
    },
    onSuccess: (deletedItem, updatedItem) => {
      toast.success(
        deletedItem.message ||
          `Gallery Photo was ${
            updatedItem.is_published ? "published" : "unpublished"
          } successfully`
      );
    },
  });
}
