"use client";
import OrdersLoading from "./loading";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { DataTable } from "./data-table";
import { columns, Order } from "./columns";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();
  return data.data || [];
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"], // Unique key for caching
    queryFn: fetchOrders, // Fetch function
    staleTime: 5 * 60 * 1000, // Cache data as fresh for 5 minutes
  });

  const isOrderExpired = (order: Order) => {
    const pickupDateTime = dayjs(
      `${order.pickup_date} ${order.pickup_time}`,
      "D MMMM YYYY HH:mm"
    );
    return dayjs().isAfter(pickupDateTime); // true if expired
  };
  dayjs.extend(customParseFormat);
  const isOrderToday = (order: Order) => {
    // Parse pickup_date using the exact format
    const pickupDate = dayjs(order.pickup_date, "D MMMM YYYY");

    // Compare with today's date (day-level comparison)
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

  const filteredActive = filterOrders(activeOrders);
  const filteredCompleted = filterOrders(completedOrders);
  const filteredToday = filterOrders(todayOrders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage customer pickup orders
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
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

      <Tabs defaultValue="active">
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
        </TabsList>``

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            <DataTable columns={columns} data={filteredActive} />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            <DataTable columns={columns} data={filteredCompleted} />
          )}
        </TabsContent>
        <TabsContent value="Today" className="mt-6">
          {isLoading ? (
            <OrdersLoading />
          ) : (
            <DataTable columns={columns} data={filteredToday} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
