import { ApiResponse } from "@/helpers/api-responses";
import { OfferFormValues } from "@/schemas/offers";
import { Offer } from "@/types/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

function getOfferKey(branchId: string) {
  return ["offers", branchId];
}

export function useOffersQuery(branchId: string) {
  return useQuery<Offer[], AxiosError<ApiResponse<null>>>({
    queryKey: getOfferKey(branchId),
    queryFn: async () => {
      const res = await axios.get<ApiResponse<Offer[]>>(`/api/offers`);
      return res.data.data || [];
    },
  });
}

export function useCreateOfferMutation() {
  //Get the query client
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<OfferFormValues>,
    AxiosError<ApiResponse<null>>,
    { formData: OfferFormValues; branchId: string }
  >({
    mutationFn: async ({ formData }) => {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("startTime", formData.startTime);
      formDataObj.append("endTime", formData.endTime);
      formDataObj.append("isRecurring", String(formData.isRecurring));
      formDataObj.append("startDate", formData.startDate?.toISOString() || "");
      formDataObj.append("endDate", formData.endDate?.toISOString() || "");
      formDataObj.append(
        "daysOfWeek",
        JSON.stringify(formData.daysOfWeek || [])
      );
      formDataObj.append("image", formData.image as File);

      const res = await axios.post<ApiResponse<OfferFormValues>>(
        "/api/offers",
        formDataObj
      );

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
      const newOffer = res.data;

      toast.success(message);
      //Generating the query key
      const queryKey = getOfferKey(branchId);

      //Check first if there are already offers in the cache
      const previousOffers =
        queryClient.getQueryData<OfferFormValues[]>(queryKey) || [];

      //Determine if there are previous offers and update accordingly
      if (previousOffers.length === 0 || !newOffer) return;

      queryClient.setQueryData<OfferFormValues[]>(queryKey, () => [
        newOffer,
        ...previousOffers,
      ]);
    },
  });
}
