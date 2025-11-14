"use client";
import { useState } from "react";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@ui/sidebar";
import { Button} from "@ui/button";
import { Bell, LogOut, Settings, User, UserIcon } from "lucide-react";
import { Separator } from "@ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "@/components/logout-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";

export function AppNavbar() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { state } = useSidebar();

  async function handleLogout() {
    //Clearing the cache so that the next use can't see the other persons data
    queryClient.clear();
    setDialogOpen(true); // show the dialog
    // Wait a short moment to show the spinner, then log out
    await logout();
  }

  return (
    <>
      <header className="flex h-16 sticky top-0 z-50 shrink-0 items-center gap-2 border-b bg-background/70 backdrop-blur-lg px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="-ml-1" />
          </TooltipTrigger>
          <TooltipContent>
            {state === "collapsed" ? "Open Sidebar" : "Close Sidebar"}
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="view notifications">
            <Bell />
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="/avatar Image" alt="avatar image" />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="text-inherit" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Log out Dialog */}
      <LogOutDialog open={dialogOpen} />
    </>
  );
}
