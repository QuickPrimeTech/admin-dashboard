import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { isToday } from "date-fns";
import type { Reservation } from "@/types/reservations";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  reservations: Reservation[];
}

export function StatsCards({ reservations }: StatsCardsProps) {
  const todayReservations = reservations.filter(
    (r) => isToday(new Date(r.date)) && r.status !== "cancelled",
  );

  const pendingCount = reservations.filter(
    (r) => r.status === "pending",
  ).length;
  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const totalGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);

  const stats = [
    {
      label: "Today's Reservations",
      value: todayReservations.length,
      icon: Calendar,
      accent: "text-primary",
    },
    {
      label: "Pending Approval",
      value: pendingCount,
      icon: Clock,
      accent: "text-amber-600",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CheckCircle,
      accent: "text-emerald-600",
    },
    {
      label: "Expected Guests Today",
      value: totalGuests,
      icon: Users,
      accent: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="card-elegant rounded-lg p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <stat.icon className={`h-5 w-5 ${stat.accent}`} />
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
