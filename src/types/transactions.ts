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

type OrderItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  description?: string;
  image_url?: string;
};

type OrderStatus = "success" | "pending" | "failed" | "completed" | "cancelled";

export type Order = {
  id: string;
  name: string;
  phone: string;
  email: string;
  items: OrderItem[];
  payment_method?: string;
  total: number;
  status: OrderStatus;
  pickup_date: string;
  pickup_time: string;
  special_instructions?: string;
  created_at: string;
  user_id: string;
};

export type RawAnalyticsResponse = {
  payments?: Payment[];
  orders?: Order[];
};
