// sections/orders/stats-bar.tsx
import { TrendingUp, Clock, DollarSign, Package } from "lucide-react";

interface StatsBarProps {
  totalOrders: number;
  avgPrepTime: number;
  totalRevenue: number;
  completedToday: number;
}

export function StatsBar({
  totalOrders,
  avgPrepTime,
  totalRevenue,
  completedToday,
}: StatsBarProps) {
  const stats = [
    {
      icon: Package,
      label: "Active Orders",
      value: totalOrders.toString(),
      color: "text-primary",
    },
    {
      icon: Clock,
      label: "Avg. Prep Time",
      value: `${avgPrepTime} min`,
      color: "text-warning",
    },
    {
      icon: DollarSign,
      label: "Today's Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Completed Today",
      value: completedToday.toString(),
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <div className={`rounded-lg bg-secondary p-2.5 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
