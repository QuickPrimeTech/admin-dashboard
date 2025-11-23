"use client";
import { SidebarTrigger, useSidebar } from "@ui/sidebar";
import { Button } from "@ui/button";
import { Bell } from "lucide-react";
import { Separator } from "@ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { UserDropdown } from "@/components/navbar/user-dropdown";

export function AppNavbar() {
  const { state } = useSidebar();

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
          <Button
            variant="ghost"
            size="icon"
            aria-label="view notifications"
            title="See your notifications"
          >
            <Bell />
          </Button>
          <ModeToggle />
          <UserDropdown />
        </div>
      </header>
    </>
  );
}
