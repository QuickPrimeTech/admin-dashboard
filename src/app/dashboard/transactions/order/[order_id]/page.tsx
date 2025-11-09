"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@ui/skeleton";
import { Badge } from "@ui/badge";
import { Card, CardContent } from "@ui/card";
import { Separator } from "@ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PackageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@ui/button";

// --- Type Definitions ---

type Props = {
  params: Promise<{ order_id: string }>;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  description?: string;
  image_url?: string;
};

type Order = {
  id: string;
  name: string;
  phone: string;
  email: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  pickup_date: string;
  pickup_time: string;
  special_instructions?: string;
  status: string;
  created_at: string;
};

// --- Currency Formatter Utility ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
};

// --- Helper for Status Badge Styling ---

const getStatusConfig = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower === "success") {
    return {
      variant: "default" as const,
      icon: CheckCircle2,
      className:
        "bg-green-400 dark:bg-green-600 text-foreground border-green-200 dark:border-green-800",
    };
  }

  if (statusLower === "pending" || statusLower === "processing") {
    return {
      variant: "secondary" as const,
      icon: Clock,
      className:
        "bg-amber-400 dark:bg-amber-600 text-foreground border-amber-200 dark:border-amber-800",
    };
  }

  if (statusLower === "failed" || statusLower === "cancelled") {
    return {
      variant: "destructive" as const,
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/30",
    };
  }

  return {
    variant: "outline" as const,
    icon: Clock,
    className: "",
  };
};

// --- Main Component ---

export default function Page(props: Props) {
  const params = React.use(props.params);
  const order_id = params?.order_id;

  const { data: response, isLoading } = useQuery<{ data: Order[] }, Error>({
    queryKey: ["order", order_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/transactions/order?order_id=${order_id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
    enabled: !!order_id,
  });

  const order = response?.data?.[0];

  // --- Calculations ---
  const VAT = 0.16;
  const LEVY = 0.02;
  const subtotal =
    order?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ??
    0;
  const vatAmount = subtotal * VAT;
  const levyAmount = subtotal * LEVY;
  const totalAmount = subtotal + vatAmount + levyAmount;

  const statusConfig = order ? getStatusConfig(order.status) : null;
  const StatusIcon = statusConfig?.icon;

  // --- No Order Found State ---
  if (!isLoading && !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-12 border-2 border-dashed border-border">
          <XCircle className="size-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Order Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            We couldn&apos;t locate order{" "}
            <span className="font-semibold text-foreground">#{order_id}</span>.
            Please verify the order ID or contact our support team.
          </p>
          <Button asChild>
            <Link href={"/dashboard/transactions"}>Go to Transactions</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-64 mb-3" />
                  <Skeleton className="h-5 w-48" />
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
                    Order Confirmed
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Order ID:{" "}
                    <span className="font-semibold text-foreground">
                      {order?.id}
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* Status Badge */}
            {isLoading ? (
              <Skeleton className="h-12 w-40 rounded-full" />
            ) : (
              <Badge
                className={`text-base px-4 py-2 font-semibold tracking-wide flex items-center gap-2 ${statusConfig?.className}`}
              >
                {StatusIcon && <StatusIcon className="size-6" />}
                {order?.status.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Pickup Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <Card className="py-0 pb-4 overflow-hidden border-2 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  Customer Details
                </h2>
              </div>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-56" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <PhoneIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-foreground">
                          {order?.name}
                        </p>
                        <p className="text-muted-foreground">{order?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MailIcon className="size-5 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{order?.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pickup Information Card */}
            <Card className="overflow-hidden py-0 pb-4 border-2 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-accent/10 px-6 py-4 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  Pickup Schedule
                </h2>
              </div>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-accent/20 p-2 rounded-lg">
                        <CalendarIcon className="size-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Pickup Date
                        </p>
                        <p className="font-semibold text-lg text-foreground">
                          {order?.pickup_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-accent/20 p-2 rounded-lg">
                        <ClockIcon className="size-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Pickup Time
                        </p>
                        <p className="font-semibold text-lg text-foreground">
                          {order?.pickup_time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isLoading && order?.special_instructions && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Special Instructions
                      </p>
                      <p className="text-muted-foreground italic leading-relaxed">
                        &quot;{order.special_instructions}&quot;
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="py-0 pb-4 overflow-hidden border-2 shadow-sm">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Order Items
                  </h2>
                  {!isLoading && (
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {order?.items?.length || 0}{" "}
                      {order?.items?.length === 1 ? "item" : "items"}
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {isLoading ? (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="p-6 flex items-center gap-4"
                        >
                          <Skeleton className="size-20 rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <div className="text-right space-y-2">
                            <Skeleton className="h-5 w-20 ml-auto" />
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : order?.items?.length ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 hover:bg-accent/5 transition-colors flex items-center gap-4"
                      >
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url || "/placeholder.jpg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="size-20 object-cover rounded-lg border-2 border-border"
                            />
                          ) : (
                            <div className="size-20 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
                              <ImageIcon className="size-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                            {item.name}
                          </h3>
                          {item.category && (
                            <p className="text-sm text-muted-foreground">
                              {item.category}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty:{" "}
                            <span className="font-semibold text-foreground">
                              {item.quantity}
                            </span>
                          </p>
                        </div>

                        {/* Item Pricing */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-xl text-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <PackageIcon className="size-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No items in this order
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="py-0 pb-4 overflow-hidden border-2 shadow-lg">
                <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-5">
                  <h2 className="text-2xl font-bold text-primary-foreground">
                    Order Summary
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  {isLoading ? (
                    <>
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Separator className="my-4" />
                      <Skeleton className="h-8 w-full" />
                    </>
                  ) : (
                    <>
                      {/* Subtotal */}
                      <div className="flex justify-between items-center text-base">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      {/* Taxes and Fees */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            VAT (16%)
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(vatAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Catering Levy (2%)
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(levyAmount)}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xl font-bold text-foreground">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>

                      <Separator className="my-4" />

                      {/* Payment Method */}
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Payment Method
                        </p>
                        <p className="font-semibold text-foreground text-lg">
                          {order?.payment_method}
                        </p>
                      </div>

                      {/* Order Date */}
                      <div className="text-center pt-2">
                        <p className="text-xs text-muted-foreground">
                          Order placed on
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {order?.created_at &&
                            new Date(order.created_at).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
