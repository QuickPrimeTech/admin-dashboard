// src/context/menu-item-form-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { BasicInfoFormData, ChoiceFormData } from "@/schemas/menu";

interface MenuItemFormContextType {
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;

  basicInfo: BasicInfoFormData | null;
  setBasicInfo: (data: BasicInfoFormData) => void;

  choices: ChoiceFormData[];
  addChoice: (choice: ChoiceFormData) => void;
  updateChoice: (id: string, updated: ChoiceFormData) => void;
  removeChoice: (id: string) => void;

  editingChoice: ChoiceFormData | null;
  setEditingChoice: (choice: ChoiceFormData | null) => void;
}

const MenuItemFormContext = createContext<MenuItemFormContextType | null>(null);

export function AddMenuItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  const [choices, setChoices] = useState<ChoiceFormData[]>([]);
  const [editingChoice, setEditingChoice] = useState<ChoiceFormData | null>(
    null
  );

  const addChoice = (choice: ChoiceFormData) => {
    setChoices((prev) => [...prev, { ...choice, id: crypto.randomUUID() }]);
  };

  const updateChoice = (id: string, updated: ChoiceFormData) => {
    setChoices((prev) =>
      prev.map((choice) => (choice.id === id ? { ...updated, id } : choice))
    );
  };

  const removeChoice = (id: string) => {
    setChoices((prev) => prev.filter((choice) => choice.id !== id));
  };

  return (
    <MenuItemFormContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        basicInfo,
        setBasicInfo,
        choices,
        addChoice,
        updateChoice,
        removeChoice,
        editingChoice,
        setEditingChoice,
      }}
    >
      {children}
    </MenuItemFormContext.Provider>
  );
}

export const useMenuItemForm = () => {
  const context = useContext(MenuItemFormContext);
  if (!context) {
    throw new Error(
      "useMenuItemForm must be used within a MenuItemFormProvider"
    );
  }
  return context;
};
