import { TransactionsTable } from "@/sections/transactions/transactions-table";
import Link from "next/link";
import { BarChart } from "lucide-react";
import { Button } from "@ui/button";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all payment transactions
          </p>
        </div>
        <Button className="flex items-center gap-2" asChild>
          <Link href="/dashboard/transactions/analytics">
            <BarChart />
            View Analytics
          </Link>
        </Button>
      </div>

      <TransactionsTable />
    </div>
  );
}
