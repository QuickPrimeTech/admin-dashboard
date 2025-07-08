import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuIcon, Calendar, Camera, Users } from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      title: "Menu Items",
      value: "24",
      description: "Active menu items",
      icon: MenuIcon,
    },
    {
      title: "Reservations",
      value: "12",
      description: "Active Reservations",
      icon: Calendar,
    },
    {
      title: "Private Events",
      value: "3",
      description: "Requests for private-events",
      icon: Users,
    },
    {
      title: "Gallery Photos",
      value: "48",
      description: "Total photos",
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
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
