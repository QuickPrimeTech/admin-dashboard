"use client";

import { switchBranch } from "@/app/actions/branches";
import { useBranch } from "@/components/providers/branch-provider";
import { Branch } from "@/types/onboarding";
import { useQueryClient } from "@tanstack/react-query";

export function useSwitchBranch() {
  const { setBranchId } = useBranch();
  const queryClient = useQueryClient();

  const switchToBranch = async (branch: Branch) => {
    // update React Query cache
    queryClient.setQueryData(["current-branch"], branch);

    // update DB + cookie
    await switchBranch(branch.id);

    // update global state
    setBranchId(branch.id);
  };

  return { switchToBranch };
}
