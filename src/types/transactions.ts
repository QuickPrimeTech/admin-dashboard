export type ApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data?: Payment[];
};

export type Payment = {
  id: string;
  order_id: string;
  phone: string;
  amount: number;
  status: "pending" | "success" | "failed";
  created_at: string;
  user_id: string;
  order?: {
    name: string;
  };
};

/* --------------------ANALYTICS TYPES ---------------------- */
export type AnalyticsData = {
  success: boolean;
  data: {
    totals: {
      totalPayments: number;
      totalRevenue: number;
      totalOrders: number;
      avgOrderValue: number;
      successRate: number;
      failRate: number;
      pendingRate: number;
      revenue24h: number;
      revenue7d: number;
      revenue30d: number;
      successfulOrders: number;
      pendingOrders: number;
      failedOrders: number;
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

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  description: string;
  image?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: "success" | "pending" | "failed" | "completed" | "cancelled";
  payment_method?: string;
  pickup_time?: string;
  created_at: string;
  user_id: string;
  name: string;
  phone: string;
};

export type RawAnalyticsResponse = {
  payments?: Payment[];
  orders?: Order[];
};
