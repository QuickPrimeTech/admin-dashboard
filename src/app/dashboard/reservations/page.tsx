"use client";

import { useBranch } from "@/components/providers/branch-provider";
import { useReservationsQuery } from "@/hooks/use-reservations";
import { columns } from "@/sections/reservations/columns";
import { DataTable } from "@/sections/reservations/data-table";

export default function ReservationsPage() {
  const { branchId } = useBranch();
  const { data, isPending } = useReservationsQuery(branchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Reservation History</h1>
        <p className="text-muted-foreground">
          Manage your restaurant&apos;s reservation info
        </p>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} isPending={isPending} />
      </div>
    </div>
  );
}
