"use client";

import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBranchesQuery } from "@/hooks/use-branches";
import { BranchCardError } from "@/sections/onboarding/error/branch-card-error";
import { BranchesBackgroundPattern } from "@/components/background-patterns/branches-pattern";
import { BranchCard } from "@/sections/onboarding/branch-card";
import { BranchCardSkeleton } from "@/sections/onboarding/skeletons/branch-card-skeleton";
import { AddBranchCard } from "@/sections/onboarding/add-branch-card";

export default function ManageBranch() {
  const { data: branches, isPending, isError, refetch } = useBranchesQuery();

  return (
    <div className="relative min-h-screen container px-4 md:px-8 lg:px-12 mx-auto pb-10">
      <BranchesBackgroundPattern />
      {/*Top Navigation (semantic nav element) */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border shadow-sm mb-8 rounded-md"
        aria-label="Main navigation"
      >
        <div className="container flex items-center justify-between px-4 md:px-8 lg:px-12 py-3">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              <span className="text-sm md:text-base font-medium">
                Back to Dashboard
              </span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Header Section */}
        <header
          className="flex flex-col items-center text-center space-y-4 mb-10 animate-fade-in"
          aria-labelledby="manage-branches-title"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md animate-bounce-in">
            <Building2
              className="w-8 h-8 md:w-10 md:h-10 text-white"
              aria-hidden="true"
            />
          </div>

          <h1
            id="manage-branches-title"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Manage Branches
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            View, edit, and manage all your restaurant branches below. Keep your
            locations updated and organized with ease.
          </p>
        </header>

        {/* Branch Management Section */}
        <section
          aria-labelledby="active-branches-heading"
          className="space-y-6"
        >
          <h2
            id="active-branches-heading"
            className="text-lg md:text-xl font-semibold text-center"
          >
            Your Active Branches
          </h2>

          {/* Loading State */}
          {isPending && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-wrap justify-center gap-4"
            >
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
              {branches?.length
                ? branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="w-full md:w-64 lg:w-60 shrink-0"
                    >
                      <BranchCard branch={branch} />
                    </div>
                  ))
                : null}

              {/* Add Branch Card */}
              <div className="w-full md:w-64 lg:w-60 shrink-0">
                <AddBranchCard />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
