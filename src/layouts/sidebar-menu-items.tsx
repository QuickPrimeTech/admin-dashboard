"use client";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Camera,
  HelpCircle,
  Settings,
  Utensils,
  QrCode,
  ShoppingBag,
  CreditCard,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/sidebar";

// Define all menu groups here in the client component
const menuGroups = {
  general: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  management: [
    { title: "Menu Items", url: "/dashboard/menu", icon: Utensils },
    { title: "Orders", url: "/dashboard/orders", icon: ShoppingBag },
    { title: "Reservations", url: "/dashboard/reservations", icon: Calendar },
    { title: "Private Events", url: "/dashboard/events", icon: Users },
    { title: "Gallery", url: "/dashboard/gallery", icon: Camera },
  ],
  finance: [
    { title: "Transactions", url: "/dashboard/transactions", icon: CreditCard },
  ],
  marketing: [
    { title: "Offers & Promos", url: "/dashboard/offers", icon: Gift },
    { title: "QR Code", url: "/dashboard/qrcode-generator", icon: QrCode },
    { title: "FAQs", url: "/dashboard/faqs", icon: HelpCircle },
  ],
  settings: [{ title: "Settings", url: "/dashboard/settings", icon: Settings }],
};

export function SidebarMenuGroups() {
  const pathname = usePathname();

  return (
    <>
      {Object.entries(menuGroups).map(([groupName, items]) => (
        <SidebarGroup key={groupName}>
          <SidebarGroupLabel>
            {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
