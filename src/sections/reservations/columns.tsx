"use client";

import { Reservation } from "@/types/reservations";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date booked",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "guests",
    header: "Guest No",
  },
  {
    accessorKey: "phone",
    header: "Phone No",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
