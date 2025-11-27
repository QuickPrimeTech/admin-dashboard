import { ApiResponse } from "@/types/api";
import { Reservation } from "@/types/reservations";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

function getReservationKey(branchId: string) {
  return ["reservations", branchId];
}

export function useReservationsQuery(branchId: string) {
  return useQuery<Reservation[], AxiosError<ApiResponse<null>>>({
    queryKey: getReservationKey(branchId),
    queryFn: async () => {
      const res = await axios.get("/api/reservations");
      return res.data.data;
    },
  });
}

export function useReservationQuery(id: string, branchId: string) {
  return useQuery<Reservation, AxiosError<ApiResponse<null>>>({
    queryKey: [...getReservationKey(branchId), id],
    queryFn: async () => {
      const res = await axios.get(`/api/reservations/${id}`);
      return res.data.data;
    },
  });
}

export function useUpdateReservationMutation() {}
