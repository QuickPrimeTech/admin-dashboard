import { useMutation, useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Restaurant } from "@/types/onboarding";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/helpers/api-responses";
import { toast } from "sonner";

export function useRestaurantQuery() {
  return useQuery<string>({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("restaurants")
        .select("name")
        .single();

      if (error) throw new Error(error.message);

      // Return the restaurant name directly
      return data?.name ?? "Restaurant Name";
    },
  });
}

//Tanstack function for creating a restaurant name in the restaurant table
export function useCreateRestaurantMutation() {
  return useMutation<
    ApiResponse<Restaurant>,
    AxiosError<ApiResponse<null>>,
    string
  >({
    mutationFn: async (restaurantName) => {
      const res = await axios.post<ApiResponse<Restaurant>>(
        "/api/onboarding/restaurant",
        restaurantName
      );

      return res.data;
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
    onSuccess: (createdRestaurant) => {
      toast.success(createdRestaurant.message);
    },
  });
}