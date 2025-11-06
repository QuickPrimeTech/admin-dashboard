"use client";
import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "@/components/logout-dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SidebarLogout() {
  const [open, setOpen] = useState<boolean>(false);
  async function handleLogout() {
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
