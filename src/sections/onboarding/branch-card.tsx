import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { MapPin, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Branch } from "@/types/onboarding";

type BranchCardProps = {
  branch: Branch;
};

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Card
      key={branch.id}
      className="border-border shadow-md hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {branch.name}
        </CardTitle>
        <CardDescription>{branch.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Visit Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
