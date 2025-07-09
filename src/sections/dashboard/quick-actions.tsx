import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Utensils,
  Calendar,
  ImagePlus,
  HelpCircle,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Optional helper for className composition

const actions = [
  {
    name: "View today's reservations",
    link: "/admin/reservations",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    name: "View private events inquiry",
    link: "/admin/events",
    icon: UsersRound,
    color: "text-yellow-500",
  },
  {
    name: "Add new menu item",
    link: "/admin/menu",
    icon: Utensils,
    color: "text-red-500",
  },
  {
    name: "Upload gallery photos",
    link: "/admin/gallery",
    icon: ImagePlus,
    color: "text-purple-500",
  },
  {
    name: "Update FAQ section",
    link: "/admin/faqs",
    icon: HelpCircle,
    color: "text-emerald-500",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks you might want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 flex flex-col">
          {actions.map((action, index) => (
            <Link
              href={action.link}
              key={index}
              className="w-full flex items-center gap-3 text-left p-3 rounded-md hover:bg-muted transition-colors border"
            >
              <action.icon className={cn("h-5 w-5", action.color)} />
              <span className="font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
