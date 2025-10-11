import { TransactionsTable } from "@/sections/transactions/transactions-table";

type Props = {
  params: { phone: string };
};

export default async function UserTransactionsPage({ params }: Props) {
  const { phone } = await params;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions for {phone}</h1>
      <TransactionsTable phone={phone} />
    </div>
  );
}
