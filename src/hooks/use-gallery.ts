// @/hooks/use-gallery.ts

import { ApiResponse } from "@/types/api";
import { OverviewStats } from "@/types/dashboard";
import { GalleryItem } from "@/types/gallery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

//This is where all the tanstack queries are stored for the gallery page
const getGalleryKey = (branchId: string) => {
  return ["gallery-items", branchId];
};

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
export function useGalleryQuery(branchId: string) {
  //Creating the queryKey from the branchId
  const queryKey = getGalleryKey(branchId);

  return useQuery<GalleryItem[]>({
    queryKey: queryKey,
    queryFn: fetchGalleryItems,
  });
}

export function useCreateGalleryItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GalleryItem>, // Success type
    AxiosError<ApiResponse<null>>, // Error type
    { formData: FormData; branchId: string }, // Variables
    { prevGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (data) => {
      const res = await axios.post<ApiResponse<GalleryItem>>(
        "/api/gallery",
        data.formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    //  Optimistic update: instantly show the new image
    onMutate: async (data) => {
      const queryKey = getGalleryKey(data.branchId);

      await queryClient.cancelQueries({ queryKey });

      const prevGalleryItems =
        queryClient.getQueryData<GalleryItem[]>(queryKey);

      // Create a temporary preview item (optimistic)
      const previewUrl = data.formData.get("file")
        ? URL.createObjectURL(data.formData.get("file") as File)
        : "";
      const tempItem: GalleryItem = {
        id: Math.random(), // temporary unique ID
        title: data.formData.get("title") as string,
        description: data.formData.get("description") as string,
        category: data.formData.get("category") as string,
        is_published: data.formData.get("is_published") === "true",
        image_url: previewUrl,
        lqip: "aldfjdfad",
      };

      //Optimistically updating the temporary item so that the use sees instant results
      queryClient.setQueryData(queryKey, [
        tempItem,
        ...(prevGalleryItems ?? []),
      ]);

      return { prevGalleryItems };
    },
    onSuccess: (res, data, onMutateResult) => {
      const queryKey = getGalleryKey(data.branchId);

      //Gettting the gallery image from the server
      const newItem = res.data;

      if (!newItem) return;

      toast.success(res.message || "Gallery image added successfully!");

      queryClient.setQueryData(queryKey, [
        newItem,
        ...(onMutateResult.prevGalleryItems ?? []),
      ]);
    },
    onError: (err, data, onMutateResult) => {
      //Get the key to use for the specific branch
      const queryKey = getGalleryKey(data.branchId);

      const message =
        err.response?.data?.message || "Failed to create gallery image";
      toast.error(message);

      //Rollback the changes by removing the gallery temporary gallery item from the cache
      if (onMutateResult?.prevGalleryItems) {
        queryClient.setQueryData(queryKey, onMutateResult.prevGalleryItems);
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
    { formData: FormData; updatedItem: GalleryItem; branchId: string },
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async ({ formData }) => {
      const res = await axios.patch(`/api/gallery`, formData);
      return res.data;
    },
    onMutate: async ({ updatedItem, branchId }) => {
      //Creating the queryKey from the branchId
      const queryKey = getGalleryKey(branchId);

      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems =
        queryClient.getQueryData<GalleryItem[]>(queryKey);

      //Getting the id from the formData
      const id = updatedItem.id;

      //Updating  the gallery item from the cache for the user to get immediate feedback
      queryClient.setQueryData<GalleryItem[]>(queryKey, (old) => {
        return old?.map((galleryItem) =>
          galleryItem.id === id ? updatedItem : galleryItem
        );
      });

      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, { branchId }, onMutateResult) => {
      const queryKey = getGalleryKey(branchId); //Creating the queryKey from the branchId

      const message =
        err.response?.data.message ||
        "An error occurred while updating your gallery photo";
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(queryKey, onMutateResult.previousGalleryItems);
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
    { id: number; branchId: string },
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (data) => {
      const res = await axios.delete(`/api/gallery?id=${data.id}`);
      return res.data;
    },
    onMutate: async (data) => {
      const queryKey = getGalleryKey(data.branchId);

      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems =
        queryClient.getQueryData<GalleryItem[]>(queryKey);

      //Removing the gallery item from the cache for the user to get immediate feedback
      queryClient.setQueryData<GalleryItem[]>(queryKey, (old) => {
        return old?.filter((galleryItem) => galleryItem.id !== data.id);
      });

      //Updating the overview stats from the homepage to have the reduced value
      queryClient.setQueryData<OverviewStats>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, gallery: old.gallery - 1 };
      });
      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, data, onMutateResult) => {
      const queryKey = getGalleryKey(data.branchId);

      const message =
        err.response?.data.message ||
        "An error occurred while deleting your gallery photo";
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(queryKey, onMutateResult.previousGalleryItems);
      }
      //Rolling back the overview stats gallery count
      queryClient.setQueryData<OverviewStats>(["overview-stats"], (old) => {
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
    { id: number; is_published: boolean; branchId: string },
    { previousGalleryItems?: GalleryItem[] }
  >({
    mutationFn: async (updatedItem) => {
      const res = await axios.patch(
        `/api/gallery/publish-toggle`,
        JSON.stringify(updatedItem)
      );
      return res.data;
    },
    onMutate: async ({ id, is_published, branchId }) => {
      //Query Key to be used
      const queryKey = getGalleryKey(branchId);

      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey });

      //Taking a snapshot of the previous gallery items in order to have a smooth rollback
      const previousGalleryItems =
        queryClient.getQueryData<GalleryItem[]>(queryKey);

      //Updating the is_published to the one passed from the form
      queryClient.setQueryData<GalleryItem[]>(queryKey, (old) => {
        return old?.map((galleryItem) =>
          galleryItem.id === id ? { ...galleryItem, is_published } : galleryItem
        );
      });

      //Returning the previous items for rollback on error
      return { previousGalleryItems };
    },
    onError: (err, { branchId }, onMutateResult) => {
      const queryKey = getGalleryKey(branchId);
      const message =
        err.response?.data.message ||
        "An error occurred while deleting your gallery photo";
      //Rolling back to the previous galleryItems
      if (onMutateResult?.previousGalleryItems) {
        queryClient.setQueryData(queryKey, onMutateResult.previousGalleryItems);
      }

      //Giving the user feedback that the request didn't go through
      toast.error(message);
    },
    onSuccess: (response, updatedItem) => {
      toast.success(
        response.message ||
          `Gallery Photo was ${
            updatedItem.is_published ? "published" : "unpublished"
          } successfully`
      );
    },
  });
}
