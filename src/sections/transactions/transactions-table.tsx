"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  ShoppingBag,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDate, formatTime12Hour } from "@/utils/date-formatters";

export type Payment = {
  id: string;
  order_id: string;
  phone: string;
  amount: number;
  status: "pending" | "success" | "failed";
  created_at: string;
  user_id: string;
  order?: {
    name: string;
  };
};

type ApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: Payment[];
};
type TransactionsTableProps = {
  phone?: string;
};

export function TransactionsTable({ phone }: TransactionsTableProps) {
  const { data: response, isLoading } = useQuery<ApiResponse, Error>({
    queryKey: ["payments", phone],
    queryFn: async () => {
      let url = "/api/transactions";
      if (phone) url += `?phone=${phone}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  const payments = response?.data ?? [];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link
              href={`/dashboard/transactions/order/${row.original.order_id}`}
              className="font-medium hover:underline"
            >
              {row.getValue("order_id")}
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex justify-between gap-4">
              <span className="p-2 bg-accent rounded-full h-fit">
                <ShoppingBag className="size-6" />
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Order</h4>
                <p className="text-sm">See the order for this payment</p>
                <div className="text-muted-foreground text-xs">
                  Order made on {formatDate(row.original.created_at)} at{" "}
                  {formatTime12Hour(row.original.created_at)}
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      accessorKey: "order.name",
      header: "Customer",
      cell: ({ row }) => {
        const name = row.original.order?.name;
        return !phone ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/dashboard/transactions/user/${row.original.phone}`}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {name}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-accent rounded-full h-fit">
                    <User className="size-4" />
                  </span>
                  <h4 className="text-sm font-semibold">Customer</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">See the payments made by {name}</p>
                  <div className="text-muted-foreground text-xs">
                    Payment made on {formatDate(row.original.created_at)} at{" "}
                    {formatTime12Hour(row.original.created_at)}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <div className="font-mono text-sm">{name}</div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("phone")}</div>
      ),
    },

    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number(row.getValue("amount"));
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES",
            }).format(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "success"
                ? "default"
                : status === "pending"
                ? "secondary"
                : "destructive"
            }
            className={cn(
              status === "success" &&
                "bg-green-400 text-foreground dark:bg-green-700"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const formattedDate = formatDate(row.getValue("created_at"));
        return <div className="text-sm">{formattedDate}</div>;
      },
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const time = formatTime12Hour(row.getValue("created_at"));
        return <div className="text-sm">{time}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full animate-pulse-slow" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.order_id)
                }
              >
                <Copy />
                Copy request ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/transactions/order/${row.original.order_id}`}
                >
                  <ShoppingBag />
                  View Order
                </Link>
              </DropdownMenuItem>
              {!phone && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/transactions/user/${row.original.phone}`}
                  >
                    <User />
                    View customer
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
    },
  ];

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <div className="w-full">
      {/* Filter input */}
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by phone number..."
          value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("phone")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {isLoading ? (
          <Skeleton className="ml-auto w-20 h-6" />
        ) : (
          <div className="ml-auto text-sm text-muted-foreground">
            {payments.length} transaction(s) total
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 25 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  {columns.map((col, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-6 rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}
