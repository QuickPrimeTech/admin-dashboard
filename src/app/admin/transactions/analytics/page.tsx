"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueSection } from "@/sections/transactions/analytics/revenue-section";
import { OrdersSection } from "@/sections/transactions/analytics/orders-section";
import { CustomersSection } from "@/sections/transactions/analytics/customers-section";
import { TimePatterns } from "@/sections/transactions/analytics/time-patterns";
import { PopularItems } from "@/sections/transactions/analytics/popular-items";

import { AnalyticsData } from "@/types/transactions/analytics";
import { useTransformAnalytics } from "@/hooks/transactions/analytics/use-analytics";

export default function AnalyticsPage() {
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["analytics-raw"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  // Transform raw payments + orders into full analytics structure
  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (!rawData?.data) return null;
    return useTransformAnalytics(rawData.data);
  }, [rawData]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Restaurant Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Actionable insights to help you improve performance and revenue
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/transactions">
            <ArrowLeft className="mr-2" />
            Back to Transactions
          </Link>
        </Button>
      </div>

      {/* Revenue Overview */}
      <RevenueSection data={analyticsData?.data} isLoading={isLoading} />

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="items">Popular Items</TabsTrigger>
          <TabsTrigger value="time">Time Patterns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersSection data={analyticsData?.data} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="items">
          <PopularItems data={analyticsData?.data} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="time">
          <TimePatterns data={analyticsData?.data} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersSection data={analyticsData?.data} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
