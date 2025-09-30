"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Phone,
  Mail,
  Calendar,
  Search,
  Clock,
} from "lucide-react";

interface Order {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  user_id: string;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const isOrderExpired = (order: Order) => {
    const pickupDateTime = new Date(`${order.date}T${order.time}:00`);
    const now = new Date();
    const diffInHours =
      (now.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60);
    return diffInHours > 12;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter((order) => !isOrderExpired(order));
  const completedOrders = orders.filter((order) => isOrderExpired(order));

  const filterOrders = (orderList: Order[]) => {
    return orderList.filter(
      (order) =>
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredActiveOrders = filterOrders(activeOrders);
  const filteredCompletedOrders = filterOrders(completedOrders);

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="border-orange-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{order.name}</h3>
                <Badge variant="outline" className="text-xs">
                  #{order.id}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {order.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {order.phone}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{order.date}</span>
              <Clock className="w-3 h-3" />
              <span>{order.time}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer pickup orders
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-orange-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer pickup orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Orders
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {activeOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {completedOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-orange-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Orders ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {filteredActiveOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {filteredActiveOrders.length === 0 && (
            <Card className="border-orange-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No active orders found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "No active orders match your search criteria"
                    : "No active orders at the moment"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {filteredCompletedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {filteredCompletedOrders.length === 0 && (
            <Card className="border-orange-200 dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No completed orders found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "No completed orders match your search criteria"
                    : "No completed orders yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
