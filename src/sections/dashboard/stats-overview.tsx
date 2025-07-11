"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuIcon, Calendar, Camera, Users } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsOverview() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    menu: 0,
    reservations: 0,
    events: 0,
    gallery: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch stats");
        }
        setStatsData(json.data);
      } catch (err) {
        toast.error("Failed to load stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Menu Items",
      value: statsData.menu,
      description: "Active menu items",
      icon: MenuIcon,
    },
    {
      title: "Reservations",
      value: statsData.reservations,
      description: "Pending reservations",
      icon: Calendar,
    },
    {
      title: "Private Events",
      value: statsData.events,
      description: "Requests for private events",
      icon: Users,
    },
    {
      title: "Gallery Photos",
      value: statsData.gallery,
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
              {loading ? (
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
