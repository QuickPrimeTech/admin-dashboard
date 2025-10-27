// src/sections/menu/edit/choices-list.tsx
"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ChoiceItem from "./choice-item";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { ChoicesListSkeleton } from "../skeletons/choice-list-skeleton";

export function ChoicesList() {
  const { data, status } = useMenuItemForm();

  const { choices, removeChoice, onEditChoice } = useMenuItemForm();

  //Handling the Loading state
  if (!data || status === "pending") {
    return <ChoicesListSkeleton />;
  }
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
            onEdit={() => onEditChoice(choice)}
            onRemove={() => removeChoice(choice.id!)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
