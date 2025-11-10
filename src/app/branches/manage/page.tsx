"use client";
import { Building2, PlusCircle } from "lucide-react";
import { useBranchesQuery } from "@/hooks/use-branches";
import { BranchCardError } from "@/sections/onboarding/error/branch-card-error";
import { BranchesBackgroundPattern } from "@/components/background-patterns/branches-pattern";
import Link from "next/link";
import { BranchCard } from "@/sections/onboarding/branch-card";
import { BranchCardSkeleton } from "@/sections/onboarding/skeletons/branch-card-skeleton";

export default function ManageBranch() {
  const { data: branches, isPending, isError, refetch } = useBranchesQuery();

  return (
    <div className="relative min-h-screen container px-4 md:px-8 lg:px-12 mx-auto space-y-10 py-10">
      <BranchesBackgroundPattern />

      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md animate-bounce-in">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Manage Branches</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          View, edit, and manage all your restaurant branches below. Keep your
          locations updated and organized with ease.
        </p>
      </div>

      {/* Branch Management Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center">
          Your Active Branches
        </h3>

        {/* Loading State */}
        {isPending && (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full sm:w-72 md:w-64 lg:w-60">
                <BranchCardSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && <BranchCardError refetch={refetch} />}

        {/* Loaded State */}
        {!isPending && !isError && (
          <div className="flex flex-wrap justify-center gap-4">
            {branches?.length ? (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  className="w-full md:w-64 lg:w-60 shrink-0"
                >
                  <BranchCard branch={branch} />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10 space-y-2 w-full">
                <p>No branches found.</p>
                <Link
                  href="/branches/new"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  <PlusCircle className="size-4" />
                  Create your first branch
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
