// src/context/menu-item-form-context.tsx
"use client";

import { BasicInfoFormData } from "@/schemas/menu";
import React, { createContext, useContext, useState } from "react";

interface MenuItemFormContextType {
  setSelectedImage: (file: File | null) => void;
  setBasicInfo: (data: BasicInfoFormData) => void;
}

const MenuItemFormContext = createContext<MenuItemFormContextType | null>(null);

export function AddMenuItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  console.log("Selected image:", selectedImage);

  return (
    <MenuItemFormContext.Provider value={{ setSelectedImage, setBasicInfo }}>
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
