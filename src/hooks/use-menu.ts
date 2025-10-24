import { MenuItem } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchMenuItems() {
  const res = await fetch("/api/menu-items", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  const result = await res.json();

  if (!result.success) throw new Error(result.message || "Server error");
  return result.data as MenuItem[];
}

export function useMenuQuery() {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 5, // 1 minute caching
  });
}

export function useDeleteMenuMutation() {
  return async (id: string) => {
    try {
      const res = await fetch(`/api/menu-items?id=${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to delete");
      toast.success("Menu item deleted successfully");
    } catch {
      toast.error("Failed to delete menu item");
    }
  };
}
