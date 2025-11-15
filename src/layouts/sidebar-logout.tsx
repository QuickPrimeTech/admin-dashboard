"use client";

import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "@/components/logout-dialog";
import { SidebarMenuButton } from "@ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { redirect } from "next/navigation";

export function SidebarLogout() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  async function handleLogout() {
    setOpen(true); // show the dialog
    await logout();
    queryClient.clear();
    redirect("/login");
  }
  return (
    <>
      <SidebarMenuButton onClick={handleLogout} tooltip={"Sign out"}>
        <LogOut /> Sign Out
      </SidebarMenuButton>
      <LogOutDialog open={open} />
    </>
  );
}
