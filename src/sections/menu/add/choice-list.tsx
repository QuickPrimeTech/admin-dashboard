// src/components/menu/ChoicesList.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ChoiceItem from "./choice-item";
import { useMenuItemForm } from "@/contexts/add-menu-item";

export function ChoicesList() {
  const { choices, updateChoice, removeChoice, setEditingChoice } =
    useMenuItemForm();

  if (choices.length === 0) return null;

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
            onEdit={() => setEditingChoice(choice)}
            onRemove={() => removeChoice(choice.id!)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
