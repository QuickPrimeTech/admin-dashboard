// @/hooks/use-settings.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchSettingsData } from "@/schemas/branch-settings";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { Branch } from "@/types/onboarding";
import { BRANCHES_QUERY_KEY, getCurrentBranchKey } from "./use-branches";

export const getBranchSettingsKey = (branchId: string) => [
  "branch-settings",
  branchId,
];

export function useUpdateSettings(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Branch>,
    AxiosError<ApiResponse<null>>,
    Partial<BranchSettingsData>,
    {
      previousBranches: Branch[] | undefined;
      previousCurrentBranch: Branch | undefined;
    }
  >({
    mutationFn: async (data) => {
      const response = await axios.patch(`/api/settings`, data);
      return response.data;
    },
    onMutate: async (newData) => {
      // Snapshot previous values to take
      const previousBranches =
        queryClient.getQueryData<Branch[]>(BRANCHES_QUERY_KEY);

      const previousCurrentBranch = queryClient.getQueryData<Branch>(
        getCurrentBranchKey(branchId),
      );

      // Optimistically update the branches list
      if (previousBranches) {
        queryClient.setQueryData<Branch[]>(BRANCHES_QUERY_KEY, (old) => {
          if (!old) return old;
          return old.map((branch) =>
            branch.id === branchId ? { ...branch, ...newData } : branch,
          );
        });
      }

      // Optimistically update the current branch specific cache
      if (previousCurrentBranch) {
        queryClient.setQueryData<Branch>(["current-branch", branchId], {
          ...previousCurrentBranch,
          ...newData,
        });
      }

      // Return context for rollback
      return { previousBranches, previousCurrentBranch };
    },
    onError: (error, _newData, context) => {
      // Rollback to previous values on error
      if (context?.previousBranches) {
        queryClient.setQueryData(BRANCHES_QUERY_KEY, context.previousBranches);
      }
      if (context?.previousCurrentBranch) {
        queryClient.setQueryData(
          ["current-branch", branchId],
          context.previousCurrentBranch,
        );
      }
      throw error.response?.data.message;
    },
  });
}
