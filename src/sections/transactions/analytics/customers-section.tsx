import * as React from "react";
import { User, Phone, ShoppingBag, DollarSign } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/types/transactions/analytics";

type CustomersSectionProps = {
  data?: AnalyticsData["data"];
  isLoading: boolean;
};

export function CustomersSection({ data, isLoading }: CustomersSectionProps) {
  const customers = data?.customers.topCustomers || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>
          Your most valuable customers by total revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-sm" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <User className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No customers yet</EmptyTitle>
              <EmptyDescription>
                Customer data will appear here once you start receiving orders.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup>
            {customers.map((customer, index) => (
              <React.Fragment key={customer.phone}>
                {index > 0 && <ItemSeparator />}
                <Item>
                  <ItemMedia variant="icon">
                    <User className="h-4 w-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{customer.name}</ItemTitle>
                    <ItemDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        {customer.orders} orders
                      </span>
                    </ItemDescription>
                  </ItemContent>
                  <Badge variant="outline" className="ml-auto">
                    <DollarSign className="mr-1 h-3 w-3" />
                    KES {customer.revenue.toLocaleString()}
                  </Badge>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
