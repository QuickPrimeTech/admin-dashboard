"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { LogOut, Settings, UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/app/auth/actions/actions";
import { LogOutDialog } from "@/components/logout-dialog";
import { useRestaurantQuery } from "@/hooks/use-restaurant";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

//  Dynamic random gradient generator
function generateGradient(seed: string) {
  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-amber-500 to-orange-500",
    "from-fuchsia-500 to-pink-500",
  ];
  const index = Math.abs(seed?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

export function UserDropdown() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  // Get restaurant name
  const { data: restaurantName, isLoading: isLoadingRestaurant } =
    useRestaurantQuery();

  // Supabase client
  const supabase = createClient();

  // Fetch logged-in user details
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, [supabase]);

  const isLoadingUser = !user;

  // Derive initials from restaurant name
  const initials = useMemo(() => {
    if (!restaurantName) return "R";
    return restaurantName?.name
      .split(" ")
      .map((w: string) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [restaurantName]);

  // Dynamic gradient fallback
  const gradient = useMemo(
    () => generateGradient(restaurantName?.name || ""),
    [restaurantName]
  );

  async function handleLogout() {
    queryClient.clear();
    setDialogOpen(true);
    await logout();
  }

  // Show skeleton if either restaurant or user data is loading
  const isLoading = isLoadingRestaurant || isLoadingUser;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            {isLoading ? 
            (
                <Skeleton className="size-10 rounded-full" />
            ): (

          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-muted"
          >
              
              <Avatar>
                <AvatarImage src={user?.avatar_url ?? ""} alt={user?.name} />
                <AvatarFallback
                  className={`bg-linear-to-br ${gradient} text-white text-sm font-semibold`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
          </Button>
            )
        }
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="font-normal">
            {isLoading ? (
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm leading-none truncate">
                  {restaurantName?.name}
                </p>
                <p className="text-muted-foreground text-xs leading-none truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserIcon />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogOutDialog open={dialogOpen} />
    </>
  );
}
