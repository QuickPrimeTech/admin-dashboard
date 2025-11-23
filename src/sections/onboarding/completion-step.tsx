"use client";
import { CheckCircle2 } from "lucide-react";
import { ConfettiEffect } from "@/components/confetti-effect";
import { useBranchesQuery } from "@/hooks/use-branches";
import { ManageBranchCard } from "./manage-branch-card";

interface CompletionStepProps {
  restaurantName: string;
}

export function CompletionStep({ restaurantName }: CompletionStepProps) {
  const { data } = useBranchesQuery();
  const branches = data || [];

  return (
    <div className="md:px-4 space-y-8">
      <ConfettiEffect trigger={true} duration={2000} />
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-success to-success/80 flex items-center justify-center shadow-lg animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-success-foreground" />
        </div>
        <h2 className="text-4xl font-bold">Setup Complete!</h2>
        <p className="text-muted-foreground text-lg">
          <span className="font-semibold text-foreground">
            {restaurantName}
          </span>{" "}
          is ready to go with {branches.length}{" "}
          {branches.length === 1 ? "branch" : "branches"}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">
          Select a branch to manage
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {branches.map((branch) => (
            <ManageBranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </div>
  );
}
