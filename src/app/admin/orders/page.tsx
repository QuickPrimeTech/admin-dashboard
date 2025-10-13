"use client";
import OrdersLoading from "./loading";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns, Order } from "./columns";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();
  return data.data || [];
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
  });

  const isOrderExpired = (order: Order) => {
    const pickupDateTime = dayjs(
      `${order.pickup_date} ${order.pickup_time}`,
      "D MMMM YYYY HH:mm"
    );
    return dayjs().isAfter(pickupDateTime);
  };

  const isOrderToday = (order: Order) => {
    const pickupDate = dayjs(order.pickup_date, "D MMMM YYYY");
    return pickupDate.isSame(dayjs(), "day");
  };

  const activeOrders = orders?.filter((order) => !isOrderExpired(order)) || [];
  const completedOrders =
    orders?.filter((order) => isOrderExpired(order)) || [];
  const todayOrders = orders?.filter((order) => isOrderToday(order)) || [];

  const filterOrders = (list: Order[]) =>
    list.filter(
      (o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sorted = (list: Order[]) =>
    [...list].sort((a, b) =>
      dayjs(`${a.pickup_date} ${a.pickup_time}`, "D MMMM YYYY HH:mm").diff(
        dayjs(`${b.pickup_date} ${b.pickup_time}`, "D MMMM YYYY HH:mm")
      )
    );

  const filteredActive = sorted(filterOrders(activeOrders));
  const filteredCompleted = sorted(filterOrders(completedOrders));
  const filteredToday = sorted(filterOrders(todayOrders));

  // Pagination setup
  const itemsPerPage = 25;

  const getPaginatedData = (list: Order[]) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return list.slice(start, end);
  };

  const getTotalPages = (list: Order[]) =>
    Math.ceil(list.length / itemsPerPage) || 1;

  const handlePageChange = (direction: "next" | "prev", totalPages: number) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  const renderTableWithPagination = (data: Order[]) => {
    const totalPages = getTotalPages(data);
    const paginatedData = getPaginatedData(data);

    return (
      <>
        <DataTable columns={columns} data={paginatedData} />
        {data.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                variant="outline"
                onClick={() => handlePageChange("prev", totalPages)}
                disabled={currentPage === 1}
                className="mr-4"
              >
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={() => handlePageChange("next", totalPages)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-background-foreground">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage customer pickup orders
        </p>
      </div>

      <Card className="py-0 px-0 ">
        <CardContent className="px-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="Today">
            Today ({filteredToday.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Orders ({filteredActive.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Orders ({filteredCompleted.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            renderTableWithPagination(filteredActive)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            renderTableWithPagination(filteredCompleted)
          )}
        </TabsContent>

        <TabsContent value="Today" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            renderTableWithPagination(filteredToday)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
