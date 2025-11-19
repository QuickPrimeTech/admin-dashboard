"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useBranchesQuery, useGetCurrentBranch } from "@/hooks/use-branches";
import { Skeleton } from "@ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import Link from "next/link";
import { RestaurantName } from "./restaurant-name";
import { ChefHat, ChevronDown, Building2, Settings } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/types/onboarding";
import { switchBranch } from "@/app/actions/branches";
import { useBranch } from "@providers/branch-provider";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

type CurrentBranchDropdownContent = {
  branches: Branch[] | null | undefined;
  selectedBranch: Branch | null | undefined;
  setSelectedBranch: Dispatch<SetStateAction<Branch | null | undefined>>;
};

function CurrentBranchDropdownContent({
  branches,
  selectedBranch,
  setSelectedBranch,
}: CurrentBranchDropdownContent) {
  const queryClient = useQueryClient();
  const { setBranchId } = useBranch();

  const handleSwitchBranch = async (branch: Branch) => {
    setSelectedBranch(branch);
    queryClient.setQueryData(["current-branch"], branch); // update cache
    await switchBranch(branch.id);
    setBranchId(branch.id);
  };

  return (
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-xs uppercase tracking-wide">
          Branch
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Building2 className="mr-2 size-4 text-muted-foreground" />
            Switch Branch
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {branches?.map((branch) => (
                <DropdownMenuCheckboxItem
                  key={branch.id}
                  checked={branch.id === selectedBranch?.id}
                  onCheckedChange={() => handleSwitchBranch(branch)}
                  className="cursor-pointer"
                  title={`Switch to ${branch.name} branch`}
                >
                  {branch.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <Link
            href="/branches/manage"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="size-4 text-muted-foreground" />
            Manage Branches
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

export function CurrentBranchDropdown() {
  const { state, openMobile } = useSidebar();
  //Getting the setBranchId from the context
  const { branchId } = useBranch();
  //Calling the QueryClient

  const { data: currentBranch, isLoading: isLoadingCurrent } =
    useGetCurrentBranch(branchId);

  const { data: branches, isLoading: isLoadingBranches } = useBranchesQuery();
  const [selectedBranch, setSelectedBranch] = useState(currentBranch);

  if (currentBranch && selectedBranch?.id !== currentBranch.id) {
    setSelectedBranch(currentBranch);
  }

  if (isLoadingCurrent || isLoadingBranches) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted w-56">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-4 rounded-md" />
      </div>
    );
  }

  if (!selectedBranch) {
    return <p className="truncate text-muted-foreground">No branch selected</p>;
  }
  if (state === "collapsed" && !openMobile) {
    // ICON-ONLY (fits 40×40 button)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"secondary"}
            size="icon"
            className="h-15.5 w-full"
            title={`${currentBranch?.name} (branch)`}
          >
            <ChefHat />
          </Button>
        </DropdownMenuTrigger>
        <CurrentBranchDropdownContent
          branches={branches}
          setSelectedBranch={setSelectedBranch}
          selectedBranch={selectedBranch}
        />
      </DropdownMenu>
    );
  }

  // FULL VERSION (text + chevron)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="
            flex items-center gap-2 px-3 py-2 rounded-md
            hover:bg-secondary transition-colors cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md
          "
        >
          <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-6 w-6">
            <ChefHat className="size-5" />
          </div>
          <div className="flex-1 flex flex-col text-sm leading-tight space-y-0.5">
            <RestaurantName />
            <p className="truncate text-xs text-muted-foreground">
              {selectedBranch.name} (branch)
            </p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <CurrentBranchDropdownContent
        branches={branches}
        setSelectedBranch={setSelectedBranch}
        selectedBranch={selectedBranch}
      />
    </DropdownMenu>
  );
}
