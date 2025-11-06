import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { ChoiceItemSkeleton } from "./choice-item-skeleton";

export function ChoicesListSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Customization Options</CardTitle>
        <CardDescription>Your added choices and options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <ChoiceItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}
