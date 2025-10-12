"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
export type Order = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  pickup_date: string;
  pickup_time: string;
  user_id: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <Badge variant="outline">#{row.getValue("id")}</Badge>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "pickup_date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.pickup_date;
      try {
        return format(new Date(date), "MMM dd, yyyy");
      } catch {
        return date;
      }
    },
  },
  {
    accessorKey: "pickup_time",
    header: "Time",
    cell: ({ row }) => row.original.pickup_time,
  },
];
