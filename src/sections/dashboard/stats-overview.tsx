"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuIcon, Calendar, Camera, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsOverview() {
  const fetchStats = async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to fetch stats");
    }

    return json.data;
  };

  const { data: statsData, isLoading } = useQuery<
    {
      menu: number;
      gallery: number;
      reservations: number;
      events: number;
    },
    Error
  >({
    queryKey: ["overview-stats"],
    queryFn: fetchStats,
    // onError: () => toast.error("Something went wrong while getting the stats")
  });

  const stats = [
    {
      title: "Menu Items",
      value: statsData?.menu ?? 0,
      description: "Active menu items",
      icon: MenuIcon,
    },
    {
      title: "Reservations",
      value: statsData?.reservations ?? 0,
      description: "Pending reservations",
      icon: Calendar,
    },
    {
      title: "Private Events",
      value: statsData?.events ?? 0,
      description: "Requests for private events",
      icon: Users,
    },
    {
      title: "Gallery Photos",
      value: statsData?.gallery ?? 0,
      description: "Total uploaded photos",
      icon: Camera,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20 rounded-md" />
              ) : (
                stat.value
              )}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
