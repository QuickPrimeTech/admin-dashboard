"use client";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/types/reservations";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import Link from "next/link";

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
    id: "index",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>, // simple numbering starting from 1
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date booked",
    cell: ({ row }) => {
      const raw = row.getValue("date") as string; // "2025-11-20"
      const date = new Date(raw);

      return date.toLocaleDateString("en-GB"); // → "20/11/2025"
    },
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "guests",
    header: "Guest No",
    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("guests")}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone No",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions", // must have a unique id if no accessorKey
    header: "Actions",
    cell: ({ row }) => {
      const reservationId = row.original;
      return (
        <Button variant={"outline"} asChild size={"xs"}>
          <Link href={`/dashboard/reservations/${reservationId.id}`}>
            <Calendar />
            See Details
          </Link>
        </Button>
      );
    },
  },
];
