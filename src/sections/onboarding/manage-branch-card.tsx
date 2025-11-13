"use client";

import { Branch } from "@/types/onboarding";
import { Card, CardContent } from "@ui/card";
import { ArrowRight, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type ManageBranchCardProps = {
  branch: Branch;
};

export function ManageBranchCard({ branch }: ManageBranchCardProps) {
  const handleSelectBranch = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { branch_id: branch.id },
    });


    if (error) {
      toast.error("Failed to select branch: ");
      return;
    }


    redirect("/dashboard");
  };

  return (
    <Card
      onClick={handleSelectBranch}
      className="hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]"
    >
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{branch.name}</h4>
            <p className="text-sm text-muted-foreground">
              {branch.location || "No location provided"}
            </p>
          </div>
        </div>
        <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </CardContent>
    </Card>
  );
}
