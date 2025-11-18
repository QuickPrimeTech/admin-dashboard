import { ApiResponse } from "@/helpers/api-responses";
import { OfferFormValues } from "@/schemas/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

function getOfferKey(branchId: string) {
  return ["offers", branchId];
}

export function useOffersQuery(branchId: string) {
  return useQuery<
    ApiResponse<OfferFormValues[]>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: getOfferKey(branchId),
    queryFn: async () => {
      const res = await axios.get<ApiResponse<OfferFormValues[]>>(
        `/offers/branch/${branchId}`
      );
      return res.data;
    },
  });
}

export function useCreateOfferMutation() {
  return useMutation<
    ApiResponse<OfferFormValues>,
    AxiosError<ApiResponse<null>>,
    { formData: OfferFormValues; branchId: string }
  >({
    mutationFn: async () => {
      const res = await axios.post<ApiResponse<OfferFormValues>>("/offers");
      return res.data;
    },
    onError: (err, { formData }) => {
      const message =
        err.response?.data?.message ||
        `An error occurred while creating the offer ${formData.title} .`;
      console.error("Create Offer Error:", message);

      toast.error(message);
    },
    onSuccess: (res, { formData, branchId }) => {
      const message =
        res.message || `Offer ${formData.title} created successfully.`;
      const newOffer = res.data as OfferFormValues;

      toast.success(message);
      //Generating the query key
      const queryKey = getOfferKey(branchId);

      //Updating the cache
      const queryClient = useQueryClient();

      //Check first if there are already offers in the cache
      const previousOffers =
        queryClient.getQueryData<OfferFormValues[]>(queryKey) || [];

      //Determine if there are previous offers and update accordingly
      if (previousOffers.length === 0) return;

      queryClient.setQueryData<OfferFormValues[]>(queryKey, () => [
        newOffer,
        ...previousOffers,
      ]);
    },
  });
}
