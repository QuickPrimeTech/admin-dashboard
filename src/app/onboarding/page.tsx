"use client";
import { useState } from "react";
import { BranchCard } from "@/sections/onboarding/branch-card";
import { Branch } from "@/types/onboarding";

export default function OnboardingFlow() {
  const [branches, setBranches] = useState<Branch[] | null>([
    {
      id: "sdfdfad",
      name: "Nairobi Branch",
      location: "West Avenue",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");

  const handleCreateBranch = () => {
    console.log("About to create a location");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Welcome to Your Restaurant Dashboard
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
            Let's get your restaurant set up in minutes. Start by creating your
            first branch location.
          </p>
        </div>

        {/* Branches Grid */}
        {branches && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {branches.map((branch) => (
              <BranchCard branch={branch} />
            ))}
          </div>
        )}

        {/* Footer Help Text */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Need help getting started?{" "}
            <button className="text-primary hover:underline font-medium underline-offset-4">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
