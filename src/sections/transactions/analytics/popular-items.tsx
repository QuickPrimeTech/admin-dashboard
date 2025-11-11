"use client";

import * as React from "react";
import { Package, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@ui/item";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/empty";
import { Skeleton } from "@ui/skeleton";
import { Badge } from "@ui/badge";
import type { AnalyticsData } from "@/types/transactions";

type PopularItemsProps = {
  data?: AnalyticsData["data"];
  isLoading: boolean;
};

export function PopularItems({ data, isLoading }: PopularItemsProps) {
  const items = data?.items.popularItems || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Menu Items</CardTitle>
        <CardDescription>
          Top selling items by quantity and revenue
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
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No items found</EmptyTitle>
              <EmptyDescription>
                Start taking orders to see your most popular menu items here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup>
            {items.map((item, index) => (
              <React.Fragment key={item.name}>
                {index > 0 && <ItemSeparator />}
                <Item>
                  <ItemMedia variant="icon">
                    <Package className="h-4 w-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.name}</ItemTitle>
                    <ItemDescription>
                      {item.quantity} orders • KES{" "}
                      {item.revenue.toLocaleString()} revenue
                    </ItemDescription>
                  </ItemContent>
                  <Badge variant="secondary" className="ml-auto">
                    <TrendingUp className="mr-1 h-3 w-3" />#{index + 1}
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
