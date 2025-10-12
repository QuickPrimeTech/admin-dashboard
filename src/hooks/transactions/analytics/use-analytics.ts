import { AnalyticsData } from "@/types/transactions/analytics";

export function useTransformAnalytics(raw: any): AnalyticsData {
  const { payments = [], orders = [] } = raw;

  //calculating the total payments
  const totalPayments = payments.length;

  //determining the success rates for the payments
  const successPayments = payments.filter((p: any) => p.status === "success");
  const failedPayments = payments.filter((p: any) => p.status === "failed");
  const pendingPayments = payments.filter((p: any) => p.status === "pending");

  //Calculating the rates of success, pending and failed
  const successRate = totalPayments
    ? (successPayments.length / totalPayments) * 100
    : 0;
  const failRate = totalPayments
    ? (failedPayments.length / totalPayments) * 100
    : 0;
  const pendingRate = totalPayments
    ? (pendingPayments.length / totalPayments) * 100
    : 0;

  const totalRevenue = successPayments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );

  const totalOrders = orders.length;
  const successfulOrders = orders.filter(
    (o: any) => o.status === "success"
  ).length;
  const pendingOrders = orders.filter(
    (o: any) => o.status === "pending"
  ).length;
  const failedOrders = orders.filter((o: any) => o.status === "failed").length;

  //Calculating the avgOrderValue
  const avgOrderValue = totalOrders ? totalRevenue / successfulOrders : 0;

  const now = new Date();
  const revenue24h = successPayments
    .filter(
      (p: any) =>
        now.getTime() - new Date(p.created_at).getTime() <= 24 * 60 * 60 * 1000
    )
    .reduce((sum: number, p: any) => sum + p.amount, 0);
  const revenue7d = successPayments
    .filter(
      (p: any) =>
        now.getTime() - new Date(p.created_at).getTime() <=
        7 * 24 * 60 * 60 * 1000
    )
    .reduce((sum: number, p: any) => sum + p.amount, 0);
  const revenue30d = successPayments
    .filter(
      (p: any) =>
        now.getTime() - new Date(p.created_at).getTime() <=
        30 * 24 * 60 * 60 * 1000
    )
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  // Trends
  const revenueByDay: Array<{ date: string; revenue: number; orders: number }> =
    [];
  const groupedByDate: Record<string, { revenue: number; orders: number }> = {};

  successPayments.forEach((p: any) => {
    const date = new Date(p.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    if (!groupedByDate[date]) groupedByDate[date] = { revenue: 0, orders: 0 };
    groupedByDate[date].revenue += p.amount;
    groupedByDate[date].orders += 1;
  });

  for (const [date, stats] of Object.entries(groupedByDate)) {
    revenueByDay.push({ date, ...stats });
  }

  // Hourly orders
  const hourlyOrders: Array<{ hour: string; orders: number }> = [];
  const hourlyStats: Record<string, number> = {};

  orders.forEach((o: any) => {
    const hour = new Date(o.created_at).getHours();
    hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
  });
  for (const [hour, count] of Object.entries(hourlyStats)) {
    hourlyOrders.push({ hour: `${hour}:00`, orders: count });
  }

  // Popular items
  const itemStats: Record<string, { quantity: number; revenue: number }> = {};
  orders.forEach((o: any) => {
    o.items.forEach((item: any) => {
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
    const count = orders.filter((o: any) => o.status === status).length;
    const percentage = totalOrders ? (count / totalOrders) * 100 : 0;
    return { status, count, percentage };
  });

  // Payment methods
  const paymentMethodsMap: Record<string, { count: number; revenue: number }> =
    {};
  orders.forEach((o: any) => {
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
  orders.forEach((o: any) => {
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
      trends: {
        revenueByDay,
        hourlyOrders,
        pickupTimes: [], // optional if you later add this logic
      },
      items: {
        popularItems,
      },
      orders: {
        ordersByStatus,
      },
      payments: {
        paymentMethods,
      },
      customers: {
        topCustomers,
      },
    },
  };
}
