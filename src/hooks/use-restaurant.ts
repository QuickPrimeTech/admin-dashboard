import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useRestaurantQuery() {
  return useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("restaurants")
        .select("name")
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });
}
