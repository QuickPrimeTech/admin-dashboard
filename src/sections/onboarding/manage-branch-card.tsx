import { Branch } from "@/types/onboarding";
import { Card, CardContent } from "@ui/card";
import { ArrowRight, MapPin } from "lucide-react";

type ManageBranchCardProps = {
  branch: Branch;
};

export function ManageBranchCard({ branch }: ManageBranchCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]">
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
