// hooks/use-menu.ts

import { ApiResponse } from "@/helpers/api-responses";
import { createClient } from "@/utils/supabase/client";
import { OverviewStats } from "@/types/dashboard";
import { MenuItem } from "@/types/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const getMenuKey = (branchId: string) => {
  return ["menu-items", branchId];
};

//This is the fetch function to get all the menu items needed
async function fetchMenuItems() {
  const res = await fetch("/api/menu-items", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  const result = await res.json();
  if (!result.success) throw new Error(result.message || "Server error");
  return result.data as MenuItem[];
}

export function useMenuQuery(branchId: string) {
  return useQuery({
    queryKey: getMenuKey(branchId),
    queryFn: fetchMenuItems,
  });
}

export function useCreateMenuItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MenuItem>, // Success type
    AxiosError<ApiResponse<null>>, // Error type
    { formData: FormData; branchId: string } // Variables
  >({
    mutationFn: async ({ formData }) => {
      const res = await axios.post<ApiResponse<MenuItem>>(
        "/api/menu-items",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    onSuccess: (res, { branchId }) => {
      const newItem = res.data;
      if (!newItem) return;

      //Get queryKey for menu items
      const queryKey = getMenuKey(branchId);

      toast.success(res.message || "Menu item added successfully!");

      //  Correct query key usage
      const previousMenuItems =
        queryClient.getQueryData<MenuItem[]>(queryKey) || [];

      //prevent a scenario where the menu items are not cached and then adding the item making it seem like that is the only item in the database
      if (previousMenuItems.length === 0) return;

      queryClient.setQueryData<MenuItem[]>(queryKey, () => [
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

export function useUpdateMenuItemMutation() {
  //Gettin the context
  const queryClient = useQueryClient();
  // returning the mutation so that the user can access the methods
  return useMutation<
    ApiResponse<MenuItem>,
    AxiosError<ApiResponse<null>>,
    { formData: FormData; branchId: string }
  >({
    mutationFn: async ({ formData }) => {
      const { data } = await axios.patch<ApiResponse<MenuItem>>(
        "/api/menu-items",
        formData
      );
      return data;
    },
    onSuccess: (data, { branchId }) => {
      //Get queryKey
      const queryKey = getMenuKey(branchId);

      const updatedItem = data.data;

      if (!updatedItem) return;

      const id = Number(updatedItem.id);

      //Check if "menu-items" cache exists before updating
      const cachedMenuItems = queryClient.getQueryData<MenuItem[]>(queryKey);

      if (cachedMenuItems && cachedMenuItems.length > 0) {
        // Replace the old item in the cache
        const newMenuItems = cachedMenuItems.map((item) =>
          Number(item.id) === id ? updatedItem : item
        );

        queryClient.setQueryData<MenuItem[]>(queryKey, newMenuItems);
      }

      // ✅ Also update the single [menu-item, id] cache if it exists
      const cachedMenuItem = queryClient.getQueryData<MenuItem>([
        ...queryKey,
        id,
      ]);

      if (cachedMenuItem) {
        queryClient.setQueryData<MenuItem>(["menu-item", id], updatedItem);
      }

      toast.success(data.message ?? "Menu item updated successfully");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ??
        "There was an error updating the menu item";
      toast.error(message);

      const fieldErrors = error.response?.data?.data;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          (messages as string[]).forEach((msg) =>
            toast.error(`${field}: ${msg}`)
          );
        });
      }
    },
  });
}

export function useDeleteMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MenuItem>,
    AxiosError<ApiResponse<null>>,
    { id: number; branchId: string },
    { previousMenuItems: MenuItem[] | undefined }
  >({
    mutationFn: async ({ id }) => {
      const res = await axios.delete(`/api/menu-items?id=${id}`);
      return res.data;
    },
    onMutate: async ({ id, branchId }) => {
      //Get queryKey
      const queryKey = getMenuKey(branchId);

      //Canceling all the query request that are taking place to prevent intefering with the optimistic update
      await queryClient.cancelQueries({ queryKey });

      //Taking a snapshot of the previous queries in order to have a smooth rollback
      const previousMenuItems = queryClient.getQueryData<MenuItem[]>(queryKey);

      //Removing the menu item from the cache for the user to get immediate feedback
      queryClient.setQueryData<MenuItem[]>(queryKey, (old) => {
        return old?.filter((menuItem) => Number(menuItem.id) !== id);
      });

      //Updating the overview stats from the homepage to have the reduced value
      queryClient.setQueryData<OverviewStats>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, menu: old.menu - 1 };
      });

      //Returning the previous items for rollback on error
      return { previousMenuItems };
    },
    onError: (res, { branchId }, onMutateResult) => {
      //Get queryKey
      const queryKey = getMenuKey(branchId);

      //Rolling back to the previous menuItems
      if (onMutateResult?.previousMenuItems) {
        queryClient.setQueryData(queryKey, onMutateResult.previousMenuItems);
      }

      //Rolling back the overview stats menu count
      queryClient.setQueryData<OverviewStats>(["overview-stats"], (old) => {
        if (!old) return;
        return { ...old, menu: old.menu + 1 };
      });

      //Giving the user feedback that the request didn't go through
      toast.error(
        res.response?.data.message ||
          "There was an error deleting your menu item"
      );
    },
    onSuccess: (response) => {
      toast.success(response.message || "Menu Item was deleted successfully");
    },
  });
}

//Query to get a certain menu item
export function useMenuItemQuery(id: number, branchId: string) {
  const queryClient = useQueryClient();
  //Get MenuQueryKey
  const menuQueryKey = getMenuKey(branchId);
  //The specific key for this query
  const queryKey = [...menuQueryKey, id];

  return useQuery<MenuItem>({
    queryKey,
    queryFn: async () => {
      if (!id) throw new Error("Menu item ID is required");

      // Step 1: Check if menu-items list is already cached
      const cachedMenuItems =
        queryClient.getQueryData<MenuItem[]>(menuQueryKey);

      // Step 2: If cache exists, find the specific item
      if (cachedMenuItems && cachedMenuItems.length > 0) {
        const cachedItem = cachedMenuItems.find(
          (item) => Number(item.id) === Number(id)
        );

        if (cachedItem) {
          // Return cached version immediately (no network call)
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

export function useCategoriesQuery(branchId: string) {
  const queryClient = useQueryClient();
  const menuQueryKey = getMenuKey(branchId);

  return useQuery<string[]>({
    queryKey: ["categories", branchId],
    queryFn: async (): Promise<string[]> => {
      const supabase = createClient();

      //Try to get cached menu items
      const cachedMenuItems =
        queryClient.getQueryData<MenuItem[]>(menuQueryKey);

      if (cachedMenuItems && cachedMenuItems.length > 0) {
        // Extract categories from cache
        const uniqueCategories = Array.from(
          new Set(cachedMenuItems.map((item) => item.category).filter(Boolean))
        );
        return uniqueCategories;
      }

      // Otherwise, fall back to fetching from Supabase
      const { data, error } = await supabase
        .from("menu_items")
        .select("category")
        .eq("branch_id", branchId);

      if (error) throw error;

      // 3️⃣ Deduplicate and clean categories
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category).filter(Boolean))
      );

      return uniqueCategories;
    },
    retry: false, // prevent retry spam for auth errors
  });
}
