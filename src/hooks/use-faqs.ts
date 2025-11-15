import { FAQ } from "@/types/faqs";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/helpers/api-responses";
import axios from "axios";

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

export function useCreateFaqMutation() {}

export function useUpdateFaqMutation() {}

export function useDeleteFaqMutation() {}
