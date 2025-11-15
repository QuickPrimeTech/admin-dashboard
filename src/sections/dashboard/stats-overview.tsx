"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { MenuIcon, Calendar, Camera, Users } from "lucide-react";
import { Skeleton } from "@ui/skeleton";
import { useOverviewStats } from "@/hooks/use-dashboard";
import { useBranch } from "@/components/providers/branch-provider";


export function StatsOverview() {
  //Get the branchId from the context
  const {branchId} = useBranch();
  const {data: statsData, isLoading} = useOverviewStats(branchId);
 
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
