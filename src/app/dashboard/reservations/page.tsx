"use client";

import { useBranch } from "@/components/providers/branch-provider";
import { useReservationQuery } from "@/hooks/use-reservations";
import { columns } from "@/sections/reservations/columns";
import { DataTable } from "@/sections/reservations/data-table";

export default function ReservationsPage() {
  const { branchId } = useBranch();
  const { data, isPending } = useReservationQuery(branchId);
  return isPending ? (
    <div>Loading reservation table</div>
  ) : (
    data && (
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    )
  );
}
