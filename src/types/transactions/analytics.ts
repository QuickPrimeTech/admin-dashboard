export type AnalyticsData = {
  success: boolean;
  data: {
    totals: {
      totalRevenue: number;
      totalOrders: number;
      avgOrderValue: number;
      successRate: number;
      revenue24h: number;
      revenue7d: number;
      revenue30d: number;
      completedOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
    };
    trends: {
      revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
      hourlyOrders: Array<{ hour: string; orders: number }>;
      pickupTimes: Array<{ time: string; count: number }>;
    };
    items: {
      popularItems: Array<{ name: string; quantity: number; revenue: number }>;
    };
    orders: {
      ordersByStatus: Array<{
        status: string;
        count: number;
        percentage: number;
      }>;
    };
    payments: {
      paymentMethods: Array<{ method: string; count: number; revenue: number }>;
    };
    customers: {
      topCustomers: Array<{
        phone: string;
        name: string;
        orders: number;
        revenue: number;
      }>;
    };
  };
};
