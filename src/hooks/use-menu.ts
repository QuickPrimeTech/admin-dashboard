import { ApiResponse } from "@/helpers/api-responses";
import { StatsOverviewData } from "@/sections/dashboard/stats-overview";
import { MenuItem } from "@/types/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
//This is the name of the key to reuse
const MENU_ITEMS_QUERY_KEY = ["menu-items"];

//This is the fetch function to get all the menu items needed
async function fetchMenuItems() {
  const res = await fetch("/api/menu-items", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  const result = await res.json();
  if (!result.success) throw new Error(result.message || "Server error");
  return result.data as MenuItem[];
}

export function useMenuQuery() {
  return useQuery({
    queryKey: MENU_ITEMS_QUERY_KEY,
    queryFn: fetchMenuItems,
  });
}

export function useDeleteMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/menu-items?id=${id}`);
      return res.data;
    },
    onMutate: async (id: number) => {
      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey: MENU_ITEMS_QUERY_KEY });
      //Taking a snapshot of the previous queries in order to have a smooth rollback
      const previousMenuItems = queryClient.getQueryData<MenuItem[]>([
        "menu-items",
      ]);
      //Removing the menu item from the cache for the user to get immediate feedback

      queryClient.setQueryData<MenuItem[]>(MENU_ITEMS_QUERY_KEY, (old) => {
        return old?.filter((menuItem) => Number(menuItem.id) !== id);
      });
      //Updating the overview stats from the homepage to have the reduced value
      queryClient.setQueryData<StatsOverviewData>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, menu: old.menu - 1 };
      });
      //Returning the previous items for rollback on error
      return { previousMenuItems };
    },
    onError: (_err, _id, onMutateResult) => {
      //Rolling back to the previous menuItems
      if (onMutateResult?.previousMenuItems) {
        queryClient.setQueryData(
          MENU_ITEMS_QUERY_KEY,
          onMutateResult.previousMenuItems
        );
      }
      //Rolling back the overview stats menu count
      queryClient.setQueryData<StatsOverviewData>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, menu: old.menu + 1 };
      });
      //Giving the user feedback that the request didn't go through
      toast.error("There was an error deleting your menu item");
    },
    onSuccess: () => {
      toast.success("Menu Item was deleted successfully");
    },
  });
}

//Query to get a certain menu item
export function useMenuItemQuery(id?: number) {
  const queryClient = useQueryClient();

  return useQuery<MenuItem>({
    queryKey: ["menu-item", id],
    queryFn: async () => {
      if (!id) throw new Error("Menu item ID is required");

      // Step 1: Check if menu-items list is already cached
      const cachedMenuItems =
        queryClient.getQueryData<MenuItem[]>(MENU_ITEMS_QUERY_KEY);

      // Step 2: If cache exists, find the specific item
      if (cachedMenuItems && cachedMenuItems.length > 0) {
        const cachedItem = cachedMenuItems.find(
          (item) => Number(item.id) === Number(id)
        );
        if (cachedItem) {
          // ✅ Return cached version immediately (no network call)
          return cachedItem;
        }
      }

      // Step 3: Otherwise, fetch from API
      const res = await axios.get(`/api/menu-items`, { params: { id } });
      const result = res.data;

      if (!result.success) throw new Error(result.message || "Server error");

      return result.data as MenuItem;
    },
    enabled: !!id, // only run when id exists
  });
}

export function useCreateMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MenuItem>, // Success type
    AxiosError<ApiResponse<null>>, // Error type
    FormData // Variables
  >({
    mutationFn: async (formData) => {
      const res = await axios.post<ApiResponse<MenuItem>>(
        "/api/menu-items",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    onSuccess: (res) => {
      const newItem = res.data;
      if (!newItem) return;

      toast.success(res.message || "Menu item added successfully!");
      // ✅ Correct query key usage
      const previousMenuItems =
        queryClient.getQueryData<MenuItem[]>(MENU_ITEMS_QUERY_KEY) || [];
      if (previousMenuItems.length === 0) return;
      queryClient.setQueryData<MenuItem[]>(MENU_ITEMS_QUERY_KEY, () => [
        newItem,
        ...previousMenuItems,
      ]);
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || "Failed to create menu item";
      toast.error(message);

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

      console.error("Create menu item error:", err);
    },
  });
}
