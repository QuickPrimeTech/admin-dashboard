import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Restaurant } from "@/types/onboarding";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";
import { RestaurantFormData } from "@/schemas/profile";

export function useRestaurantQuery() {
  return useQuery<RestaurantFormData>({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      // Return the restaurant name directly
      return data;
    },
  });
}

//Tanstack function for creating a restaurant name in the restaurant table
export function useCreateRestaurantMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Restaurant>,
    AxiosError<ApiResponse<null>>,
    { name: string; owner?: string; website?: string }
  >({
    mutationFn: async (restaurantInfo) => {
      const res = await axios.post<ApiResponse<Restaurant>>(
        "/api/onboarding/restaurant",
        restaurantInfo
      );

      return res.data;
    },
    onError: (err) => {
      toast.error(err.response?.data.message);
    },
    onSuccess: (createdRestaurant) => {
      //Changing the restaurant info to te updated one
      queryClient.setQueryData(["restaurant"], createdRestaurant.data);
      toast.success(createdRestaurant.message);
    },
  });
}
