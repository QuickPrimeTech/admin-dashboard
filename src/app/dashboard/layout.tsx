import type React from "react";
import { SidebarProvider, SidebarInset } from "@ui/sidebar";
import { AppSidebar } from "@/layouts/sidebar";
import { AppNavbar } from "@/layouts/navbar";
import { cookies } from "next/headers";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import ConnectionStatus from "@/components/connection-status";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Making the open state of the sidebar persistent
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppNavbar />
        <main className="flex-1 p-4 md:p-6 bg-muted/40">
          <AppBreadcrumb />
          {children}
          <ConnectionStatus />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
