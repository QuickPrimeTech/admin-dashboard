"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChoiceItem from "./choice-item";
import type { ChoiceFormData } from "@/schemas/menu";

interface ChoicesListProps {
  choices: ChoiceFormData[];
  onUpdateChoice: (id: string, choice: ChoiceFormData) => void;
  onRemoveChoice: (id: string) => void;
}

export default function ChoicesList({
  choices,
  onUpdateChoice,
  onRemoveChoice,
}: ChoicesListProps) {
  if (choices.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Customization Options</CardTitle>
        <CardDescription>Your added choices and options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {choices.map((choice) => (
          <ChoiceItem
            key={choice.id}
            choice={choice}
            onUpdate={(updatedChoice) =>
              onUpdateChoice(choice.id!, updatedChoice)
            }
            onRemove={() => onRemoveChoice(choice.id!)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
