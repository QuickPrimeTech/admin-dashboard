// utils/transactions/analytics/use-analytics.ts
import { AnalyticsData, RawAnalyticsResponse } from "@/types/transactions";

export function transformAnalytics(
  raw: RawAnalyticsResponse,
  days: number
): AnalyticsData {
  const { payments = [], orders = [] } = raw;
  const now = new Date();

  // Filter data within the given day range
  const isWithinDays = (dateStr: string) => {
    const diff = now.getTime() - new Date(dateStr).getTime();
    return diff <= days * 24 * 60 * 60 * 1000;
  };

  const filteredPayments = payments.filter((p) => isWithinDays(p.created_at));
  const filteredOrders = orders.filter((o) => isWithinDays(o.created_at));

  const totalPayments = filteredPayments.length;

  const successPayments = filteredPayments.filter(
    (p) => p.status === "success"
  );
  const failedPayments = filteredPayments.filter((p) => p.status === "failed");
  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending"
  );

  const successRate = totalPayments
    ? (successPayments.length / totalPayments) * 100
    : 0;
  const failRate = totalPayments
    ? (failedPayments.length / totalPayments) * 100
    : 0;
  const pendingRate = totalPayments
    ? (pendingPayments.length / totalPayments) * 100
    : 0;

  const totalRevenue = successPayments.reduce((sum, p) => sum + p.amount, 0);

  const totalOrders = filteredOrders.length;
  const successfulOrders = filteredOrders.filter(
    (o) => o.status === "success"
  ).length;
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === "pending"
  ).length;
  const failedOrders = filteredOrders.filter(
    (o) => o.status === "failed"
  ).length;

  const avgOrderValue = successfulOrders ? totalRevenue / successfulOrders : 0;

  // Revenue breakdowns
  const getRevenueWithin = (d: number) =>
    successPayments
      .filter(
        (p) =>
          now.getTime() - new Date(p.created_at).getTime() <=
          d * 24 * 60 * 60 * 1000
      )
      .reduce((sum, p) => sum + p.amount, 0);

  const revenue24h = getRevenueWithin(1);
  const revenue7d = getRevenueWithin(7);
  const revenue30d = getRevenueWithin(30);

  // Revenue trends by day
  const groupedByDate: Record<string, { revenue: number; orders: number }> = {};
  successPayments.forEach((p) => {
    const date = new Date(p.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    if (!groupedByDate[date]) groupedByDate[date] = { revenue: 0, orders: 0 };
    groupedByDate[date].revenue += p.amount;
    groupedByDate[date].orders += 1;
  });

  const revenueByDay = Object.entries(groupedByDate).map(([date, stats]) => ({
    date,
    ...stats,
  }));

  // Hourly order stats
  const hourlyStats: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    const hour = new Date(o.created_at).getHours();
    hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
  });

  const hourlyOrders = Object.entries(hourlyStats).map(([hour, count]) => ({
    hour: `${hour}:00`,
    orders: count,
  }));

  // Popular items
  const itemStats: Record<string, { quantity: number; revenue: number }> = {};
  filteredOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemStats[item.name])
        itemStats[item.name] = { quantity: 0, revenue: 0 };
      itemStats[item.name].quantity += item.quantity;
      itemStats[item.name].revenue += item.quantity * item.price;
    });
  });

  const popularItems = Object.entries(itemStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Orders by status
  const ordersByStatus = ["pending", "completed", "cancelled"].map((status) => {
    const count = filteredOrders.filter((o) => o.status === status).length;
    const percentage = totalOrders ? (count / totalOrders) * 100 : 0;
    return { status, count, percentage };
  });

  // Payment methods
  const paymentMethodsMap: Record<string, { count: number; revenue: number }> =
    {};
  filteredOrders.forEach((o) => {
    const method = o.payment_method || "unknown";
    if (!paymentMethodsMap[method])
      paymentMethodsMap[method] = { count: 0, revenue: 0 };
    paymentMethodsMap[method].count += 1;
    paymentMethodsMap[method].revenue += o.total;
  });

  const paymentMethods = Object.entries(paymentMethodsMap).map(
    ([method, stats]) => ({
      method,
      ...stats,
    })
  );

  // Top customers
  const customersMap: Record<
    string,
    { name: string; phone: string; orders: number; revenue: number }
  > = {};
  filteredOrders.forEach((o) => {
    const key = o.phone || o.user_id;
    if (!customersMap[key])
      customersMap[key] = {
        name: o.name,
        phone: o.phone,
        orders: 0,
        revenue: 0,
      };
    customersMap[key].orders += 1;
    customersMap[key].revenue += o.total;
  });

  const topCustomers = Object.values(customersMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    success: true,
    data: {
      totals: {
        totalPayments,
        totalRevenue,
        totalOrders,
        avgOrderValue,
        successRate,
        failRate,
        pendingRate,
        revenue24h,
        revenue7d,
        revenue30d,
        successfulOrders,
        pendingOrders,
        failedOrders,
      },
      trends: { revenueByDay, hourlyOrders, pickupTimes: [] },
      items: { popularItems },
      orders: { ordersByStatus },
      payments: { paymentMethods },
      customers: { topCustomers },
    },
  };
}
