import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/helpers/api-responses";
import { Branch } from "@/types/onboarding";
import { toast } from "sonner";

export const BRANCHES_QUERY_KEY = ["branches"];

export function useBranchesQuery() {
  return useQuery({
    queryKey: BRANCHES_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get<ApiResponse<Branch[]>>("/api/branches");
      return res.data.data;
    },
  });
}

export function createBranchMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Branch>,
    AxiosError<ApiResponse<null>>,
    { name: string },
    { previousBranches: Branch[] | undefined }
  >({
    mutationFn: async (values) => {
      const res = await axios.post<ApiResponse<Branch>>(
        "/api/branches",
        values
      );
      return res.data;
    },
    // Optimistic update
    onMutate: async (newBranch) => {
      await queryClient.cancelQueries({ queryKey: BRANCHES_QUERY_KEY });

      const previousBranches =
        queryClient.getQueryData<Branch[]>(BRANCHES_QUERY_KEY);

      queryClient.setQueryData<Branch[]>(BRANCHES_QUERY_KEY, (old) => {
        if (!old) return [{ id: "temp-" + Date.now(), ...newBranch }];
        return [...old, { id: "temp-" + Date.now(), ...newBranch }];
      });

      return { previousBranches };
    },
    // rollback if error
    onError: (err, _newBranch, onMutateResult) => {
      if (onMutateResult?.previousBranches) {
        queryClient.setQueryData(
          BRANCHES_QUERY_KEY,
          onMutateResult.previousBranches
        );
      }
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    },
    onSuccess: (newBranch, _variables, onMutateResult) => {
      toast.success(newBranch.message);
      queryClient.setQueryData(BRANCHES_QUERY_KEY, () => {
        if (!onMutateResult.previousBranches) return [newBranch.data];
        return [...onMutateResult.previousBranches, newBranch.data];
      });
    },
  });
}

export function deleteBranchMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Branch>,
    AxiosError<ApiResponse<null>>,
    string,
    { previousBranches: Branch[] | undefined }
  >({
    mutationFn: async (id) => {
      const res = await axios.delete<ApiResponse<Branch>>(
        `/api/branches?id=${id}`
      );
      return res.data;
    },
    // Optimistic update
    onMutate: async (id) => {
      //Cancelling all the queries that maybe fetching on the background
      await queryClient.cancelQueries({ queryKey: BRANCHES_QUERY_KEY });
      //Getting all the previous branches for rollback on error
      const previousBranches =
        queryClient.getQueryData<Branch[]>(BRANCHES_QUERY_KEY);
      //Removing the branch from the existing ones
      queryClient.setQueryData<Branch[]>(BRANCHES_QUERY_KEY, (branches) => {
        return branches?.filter((branch) => branch.id !== id);
      });

      return { previousBranches };
    },
    // rollback if error
    onError: (err, _newBranch, onMutateResult) => {
      if (onMutateResult?.previousBranches) {
        queryClient.setQueryData(
          BRANCHES_QUERY_KEY,
          onMutateResult.previousBranches
        );
      }
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    },
    onSuccess: (newBranch, _variables) => {
      toast.success(newBranch.message);
    },
  });
}
export function updateBranchMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Branch>,
    AxiosError<ApiResponse<null>>,
    Branch,
    { previousBranches: Branch[] | undefined }
  >({
    mutationFn: async (branch) => {
      const res = await axios.patch<ApiResponse<Branch>>(
        `/api/branches`,
        branch
      );
      return res.data;
    },
    // Optimistic update
    onMutate: async (branch) => {
      //Cancelling all the queries that maybe fetching on the background
      await queryClient.cancelQueries({ queryKey: BRANCHES_QUERY_KEY });
      //Getting all the previous branches for rollback on error
      const previousBranches =
        queryClient.getQueryData<Branch[]>(BRANCHES_QUERY_KEY);
      //Removing the branch from the existing ones
      queryClient.setQueryData<Branch[]>(BRANCHES_QUERY_KEY, (branches) => {
        if (!branches) return [branch];
        return branches.map((oldBranch) =>
          oldBranch.id !== branch.id ? oldBranch : branch
        );
      });

      return { previousBranches };
    },
    // rollback if error
    onError: (err, _newBranch, onMutateResult) => {
      if (onMutateResult?.previousBranches) {
        queryClient.setQueryData(
          BRANCHES_QUERY_KEY,
          onMutateResult.previousBranches
        );
      }
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    },
    onSuccess: (newBranch, _variables) => {
      toast.success(newBranch.message);
    },
  });
}
