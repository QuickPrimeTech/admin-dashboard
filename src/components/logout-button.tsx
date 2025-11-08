"use client";

import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "./logout-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function LogOutButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  async function handleLogout() {
    //clearing all the queries
    queryClient.clear();
    setDialogOpen(true); // show the dialog
    // Wait a short moment to show the spinner, then log out
    await logout();
  }
  return (
    <>
      <Button variant={"outline"} onClick={handleLogout} className="w-fit">
        <LogOutIcon />
        Log out
      </Button>
      <LogOutDialog open={dialogOpen} />
    </>
  );
}
