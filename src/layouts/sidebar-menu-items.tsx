"use client";

import {
  LayoutDashboard,
  MenuIcon,
  Calendar,
  Users,
  Camera,
  HelpCircle,
  Video,
  Settings,
} from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Menu Items",
    url: "/admin/menu",
    icon: MenuIcon,
  },
  {
    title: "Reservations",
    url: "/admin/reservations",
    icon: Calendar,
  },
  {
    title: "Private Events",
    url: "/admin/events",
    icon: Users,
  },
  {
    title: "Gallery",
    url: "/admin/gallery",
    icon: Camera,
  },
  {
    title: "FAQs",
    url: "/admin/faqs",
    icon: HelpCircle,
  },
  {
    title: "Follow Us",
    url: "/admin/follow-us",
    icon: Video,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function SidebarItems() {
  const pathname = usePathname();

  return (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
              tooltip={item.title}
            >
              <Link href={item.url}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
