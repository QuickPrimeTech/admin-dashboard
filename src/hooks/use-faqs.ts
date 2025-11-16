import { FAQ } from "@/types/faqs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/helpers/api-responses";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { FaqFormData } from "@/schemas/faqs";

function getFaqKey(branchId: string) {
  return ["faqs", branchId];
}

export function useFaqsQuery(branchId: string) {
  return useQuery<FAQ[] | null>({
    queryKey: getFaqKey(branchId),
    queryFn: async () => {
      const res = await axios.get<ApiResponse<FAQ[]>>("/api/faqs");
      return res.data.data;
    },
  });
}

export function useCreateFaqMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<FAQ>, // because your POST does NOT return FAQ
    AxiosError<ApiResponse<null>>,
    { faq: FaqFormData; branchId: string },
    { previousFAQs: FAQ[] }
  >({
    mutationFn: async ({ faq }) => {
      const res = await axios.post("/api/faqs", faq);
      return res.data;
    },

    onMutate: async ({ faq, branchId }) => {
      const queryKey = getFaqKey(branchId);

      await queryClient.cancelQueries({ queryKey });

      const previousFAQs = queryClient.getQueryData<FAQ[]>(queryKey) ?? [];

      // create a temporary optimistic object
      const tempFaq: FAQ = {
        id: Math.random(), // temporary ID
        question: faq.question,
        answer: faq.answer,
        is_published: faq.is_published ?? true,
        order_index: previousFAQs.length, // optimistic guess
        branch_id: branchId,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<FAQ[]>(queryKey, [...previousFAQs, tempFaq]);

      return { previousFAQs };
    },

    onError: (error, { branchId }, context) => {
      //Rollback to the previous state of the faqs
      if (context?.previousFAQs) {
        const queryKey = getFaqKey(branchId);
        queryClient.setQueryData(queryKey, context.previousFAQs);
      }
      const errMessage = error.response?.data.message;
      toast.error(errMessage || "There was and error creating your faq!");
    },

    onSuccess: (res, { branchId }, { previousFAQs }) => {
      const newFaq = res.data;

      const queryKey = getFaqKey(branchId);
      if (newFaq) {
        //Removing the tempFAQ and replacing it with the new one
        queryClient.setQueryData<FAQ[]>(queryKey, [...previousFAQs, newFaq]);
      }

      toast.success(res.message || "Your faq has been created successfully");
    },
  });
}

export function useUpdateFaqMutation() {}

export function useDeleteFaqMutation() {}
