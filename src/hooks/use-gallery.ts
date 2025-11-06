// @/hooks/use-gallery.ts

import { ApiResponse } from "@/helpers/api-responses";
import { GalleryItem } from "@/types/gallery";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

//This is where all the tanstack queries are stored for the gallery page

//This is the name of the key to reuse
export const GALLERY_ITEMS_QUERY_KEY = ["gallery-items"];

//This is the function that runs for the fetch query
// API fetcher using Axios
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
  return useQuery<ApiResponse<GalleryItem[]>>({
    queryKey: GALLERY_ITEMS_QUERY_KEY,
    queryFn: fetchGalleryItems,
  });
}
