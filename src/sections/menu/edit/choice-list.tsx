// src/sections/menu/edit/choices-list.tsx
"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/card";
import ChoiceItem from "./choice-item";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { ChoicesListSkeleton } from "../skeletons/choice-list-skeleton";

export function ChoicesList() {
  const { data, status } = useMenuItemForm();

  const { choices, onEditChoice } = useMenuItemForm();

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
        {choices.map((choice, index) => (
          <ChoiceItem
            key={index}
            choice={choice}
            onEdit={() => onEditChoice(choice)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
