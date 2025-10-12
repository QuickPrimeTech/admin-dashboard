"use client";
import { TrendingUp, DollarSign, ShoppingBag, Percent } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsData } from "@/types/transactions/analytics";

type RevenueSectionProps = {
  data?: AnalyticsData["data"];
  isLoading: boolean;
};

export function RevenueSection({ data, isLoading }: RevenueSectionProps) {
  const totals = data?.totals;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions (30d)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                <CountingNumber
                  number={totals?.totalPayments || 0}
                  inView={true}
                  transition={{ stiffness: 100, damping: 30 }}
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (30d)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  KES{" "}
                  <CountingNumber
                    number={totals?.totalRevenue || 0}
                    inView={true}
                    transition={{ stiffness: 100, damping: 30 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 7d: KES {totals?.revenue7d.toLocaleString()}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  <CountingNumber
                    number={totals?.totalOrders || 0}
                    inView={true}
                    transition={{ stiffness: 100, damping: 30 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totals?.successfulOrders} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  KES{" "}
                  <CountingNumber
                    number={totals?.avgOrderValue || 0}
                    inView={true}
                    transition={{ stiffness: 100, damping: 30 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per successful order
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Success Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totals?.successRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Order completion rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Daily revenue and order volume over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue (KES)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart data={data?.trends.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="orders">
                <ChartContainer
                  config={{
                    orders: {
                      label: "Orders",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart data={data?.trends.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--color-orders)"
                      fill="var(--color-orders)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
