import { ApiResponse } from "@/helpers/api-responses";
import { OverviewStats } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios"

export function useOverviewStats() {
  return useQuery<OverviewStats, AxiosError<ApiResponse<null>>>({
    queryKey: ["overview-stats"],
    queryFn: async () => {
  const res = await axios.get("/api/dashboard");

  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch stats");
  }

  return res.data.data; // return only the useful part
}
  });
}
