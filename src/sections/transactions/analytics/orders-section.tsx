"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsData } from "@/types/transactions/analytics";

type OrdersSectionProps = {
  data?: AnalyticsData["data"];
  isLoading: boolean;
};

const STATUS_COLORS = {
  completed: "hsl(var(--chart-1))",
  pending: "hsl(var(--chart-4))",
  cancelled: "hsl(var(--chart-5))",
  preparing: "hsl(var(--chart-2))",
};

export function OrdersSection({ data, isLoading }: OrdersSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
          <CardDescription>
            Breakdown of orders by current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: STATUS_COLORS.completed,
                },
                pending: {
                  label: "Pending",
                  color: STATUS_COLORS.pending,
                },
                cancelled: {
                  label: "Cancelled",
                  color: STATUS_COLORS.cancelled,
                },
                preparing: {
                  label: "Preparing",
                  color: STATUS_COLORS.preparing,
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={data?.orders.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.percentage}%`}
                >
                  {data?.orders.ordersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={
                        STATUS_COLORS[
                          entry.status as keyof typeof STATUS_COLORS
                        ]
                      }
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Revenue by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue (KES)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={data?.payments.paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
