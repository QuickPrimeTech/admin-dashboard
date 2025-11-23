"use client";
import { CheckCircle2 } from "lucide-react";
import { ConfettiEffect } from "@/components/confetti-effect";
import { useBranchesQuery } from "@/hooks/use-branches";
import { BranchCardError } from "@/sections/onboarding/error/branch-card-error";
import { ManageBranchSkeleton } from "@/sections/onboarding/skeletons/manage-branch-skeleton";
import { ManageBranchCard } from "@/sections/onboarding/manage-branch-card";
import { BranchesBackgroundPattern } from "@/components/background-patterns/branches-pattern";

export default function BranchesPage() {
  const { data: branches, isPending, isError, refetch } = useBranchesQuery();

  return (
    <div className="relative min-h-screen container px-4 md:px-8 lg:px-12 mx-auto space-y-10 py-10">
      <ConfettiEffect trigger duration={1000} />
      <BranchesBackgroundPattern />
      {/*Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg animate-bounce-in">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Welcome Back! 🎉</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Please choose a branch below to start managing it.
        </p>
      </div>

      {/*Branch Selection */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center">
          Select a Branch to Continue
        </h3>

        {/* Loading State */}
        {isPending && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ManageBranchSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && <BranchCardError refetch={refetch} />}

        {/*Loaded State */}
        {!isPending && !isError && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {branches?.length ? (
              branches.map((branch) => (
                <ManageBranchCard key={branch.id} branch={branch} />
              ))
            ) : (
              <div className="text-center text-muted-foreground col-span-full py-10">
                <p>No branches found. Please add a new one to continue.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
