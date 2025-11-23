import { ApiResponse } from "@/types/api";
import { Reservation } from "@/types/reservations";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

function getReservationKey(branchId: string) {
  return ["reservations", branchId];
}
export function useReservationQuery(branchId: string) {
  return useQuery<Reservation[], AxiosError<ApiResponse<null>>>({
    queryKey: getReservationKey(branchId),
    queryFn: async () => {
      const res = await axios.get("/api/reservations");
      return res.data.data;
    },
  });
}
