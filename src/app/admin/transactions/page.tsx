import { TransactionsTable } from "@/sections/transactions/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all payment transactions
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
