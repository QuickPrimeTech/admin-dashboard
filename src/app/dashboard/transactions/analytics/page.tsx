"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { RevenueSection } from "@/sections/transactions/analytics/revenue-section";
import { CustomersSection } from "@/sections/transactions/analytics/customers-section";
import { TimePatterns } from "@/sections/transactions/analytics/time-patterns";
import { PopularItems } from "@/sections/transactions/analytics/popular-items";
import { ButtonGroup } from "@ui/button-group";
import { AnalyticsData } from "@/types/transactions";
import { transformAnalytics } from "@/utils/transactions/analytics/use-analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

export default function AnalyticsPage() {
  const [days, setDays] = useState(3); // default: 3 days

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["analytics-raw"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (!rawData?.data) return null;
    return transformAnalytics(rawData.data, days);
  }, [rawData, days]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Restaurant Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights filtered by the last {days} day{days > 1 && "s"}.
          </p>
        </div>

        <ButtonGroup aria-label="back to transaction and timeline button">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/transactions">
              <ArrowLeft />
              Back to Transactions
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Last ({days}days)
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[3, 7, 14, 30].map((d) => (
                <DropdownMenuItem key={d} onClick={() => setDays(d)}>
                  Last {d} days
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      {/* Revenue Overview */}
      <RevenueSection data={analyticsData?.data} isLoading={isLoading} />

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="items">Popular Items</TabsTrigger>
          <TabsTrigger value="time">Time Patterns</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

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
