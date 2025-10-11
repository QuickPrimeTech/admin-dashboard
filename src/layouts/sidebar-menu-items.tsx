"use client";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Camera,
  HelpCircle,
  Video,
  Settings,
  Utensils,
  QrCode,
  ShoppingBag,
  DollarSign,
  CreditCard,
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
} from "@/components/ui/sidebar";

// Define all menu groups here in the client component
const menuGroups = {
  general: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  management: [
    { title: "Menu Items", url: "/admin/menu", icon: Utensils },
    { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
    { title: "Reservations", url: "/admin/reservations", icon: Calendar },
    { title: "Private Events", url: "/admin/events", icon: Users },
    { title: "Gallery", url: "/admin/gallery", icon: Camera },
  ],
  finance: [
    { title: "Transactions", url: "/admin/transactions", icon: CreditCard },
  ],
  marketing: [
    { title: "QR Code", url: "/admin/qrcode-generator", icon: QrCode },
    { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
    { title: "Follow Us", url: "/admin/follow-us", icon: Video },
  ],
  settings: [{ title: "Settings", url: "/admin/settings", icon: Settings }],
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
