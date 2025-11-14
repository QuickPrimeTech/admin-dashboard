"use client";
import { useBranch } from "@/components/providers/branch-provider";
import { useMenuItemQuery } from "@/hooks/use-menu";
import { ChoiceFormData } from "@/schemas/menu";
import { EditErrorState } from "@/sections/menu/edit/error-state";
import { MenuItem } from "@/types/menu";
import React, { createContext, useContext, useEffect, useState } from "react";

type MenuItemFormContext = {
  data: MenuItem | null;
  status: "error" | "success" | "pending";

  choices: ChoiceFormData[];
  setChoices: React.Dispatch<React.SetStateAction<ChoiceFormData[]>>;
  addChoice: (choice: ChoiceFormData) => void;
  removeChoice: (id: string) => void;
  onEditChoice: (choice: ChoiceFormData) => void;

  editingChoice: ChoiceFormData | null;
  setEditingChoice: (choice: ChoiceFormData | null) => void;
};

const MenuItemFormContext = createContext<MenuItemFormContext | null>(null);

export function EditMenuItemProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: number;
}) {
  const {branchId} = useBranch();
  const { data, status, refetch, isError } = useMenuItemQuery(id, branchId);
  const [choices, setChoices] = useState<ChoiceFormData[]>([]);
  const [editingChoice, setEditingChoice] = useState<ChoiceFormData | null>(
    null
  );

  // ✅ Auto-set choices when data loads
  useEffect(() => {
    if (data?.choices && Array.isArray(data.choices)) {
      setChoices(data.choices);
    }
  }, [data]);

  const addChoice = (choice: ChoiceFormData) => {
    setChoices((prev) => [...prev, { ...choice, id: crypto.randomUUID() }]);
  };

  const removeChoice = (id: string) => {
    setChoices((prev) => prev.filter((choice) => choice.id !== id));
  };

  const onEditChoice = (choice: ChoiceFormData) => {
    // First set the editing choice to the choice to be edited
    setEditingChoice(choice);
    // Then remove it from the list to avoid duplication
    removeChoice(choice.id!);
  };

  if (isError) {
    return <EditErrorState refetch={() => refetch()} />;
  }

  return (
    <MenuItemFormContext.Provider
      value={{
        data: data || null,
        status,
        choices,
        setChoices,
        addChoice,
        onEditChoice,
        removeChoice,
        editingChoice,
        setEditingChoice,
      }}
    >
      {children}
    </MenuItemFormContext.Provider>
  );
}

export function useMenuItemForm() {
  const context = useContext(MenuItemFormContext);
  if (!context) {
    throw new Error(
      "useMenuItemForm must be used within a MenuItemFormProvider"
    );
  }
  return context;
}
