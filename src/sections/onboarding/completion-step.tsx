import { useEffect } from "react";
import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { celebrateSuccess } from "@/components/confetti-effect";

interface Branch {
  id: string;
  name: string;
  location: string;
}

interface CompletionStepProps {
  restaurantName: string;
  branches: Branch[];
  onSelectBranch: (branchId: string) => void;
}

export function CompletionStep({
  restaurantName,
  branches,
  onSelectBranch,
}: CompletionStepProps) {
  useEffect(() => {
    celebrateSuccess();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg animate-scale-in">
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
        <div className="grid md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              onClick={() => onSelectBranch(branch.id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{branch.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {branch.location}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
