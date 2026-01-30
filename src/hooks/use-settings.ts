import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BasicInfoData } from "@/schemas/branch-settings";
import axios from "axios";

// Query key pattern for consistent cache management
export const getBranchSettingsKey = (branchId: string) => [
  "branch-settings",
  branchId,
];

export function useUpdateSettings(branchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BasicInfoData) => {
      const response = await axios.patch(`/api/settings`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the branch query to refetch latest data
      queryClient.invalidateQueries({
        queryKey: getBranchSettingsKey(branchId),
      });
      // Also invalidate the general branch query if different
      queryClient.invalidateQueries({ queryKey: ["branch", branchId] });
    },
    onError: (error) => {
      console.error("Failed to update settings:", error);
      throw error;
    },
  });
}
