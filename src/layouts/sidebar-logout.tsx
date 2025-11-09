"use client";
import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "@/components/logout-dialog";
import { SidebarMenuButton } from "@ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SidebarLogout() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  async function handleLogout() {
    //Clearing the cache so that the next use can't see the other persons data
    queryClient.clear();
    setOpen(true); // show the dialog
    // Wait a short moment to show the spinner, then log out
    await logout();
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
