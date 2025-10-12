"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsData } from "@/types/transactions/analytics";

type TimePatternsProps = {
  data?: AnalyticsData["data"];
  isLoading: boolean;
};

export function TimePatterns({ data, isLoading }: TimePatternsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Hourly Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Order Volume</CardTitle>
          <CardDescription>Orders by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={data?.trends.hourlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Pickup Time Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Pickup Times</CardTitle>
          <CardDescription>Most popular pickup time slots</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer
              config={{
                count: {
                  label: "Orders",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={data?.trends.pickupTimes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="time" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
