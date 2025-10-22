// src/context/menu-item-form-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { MenuItemFormData } from "@/schemas/menu";

interface MenuItemFormContextType {
  formData: Partial<MenuItemFormData>;
}

const MenuItemFormContext = createContext<MenuItemFormContextType | null>(null);

export function AddMenuItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormDataState] = useState<Partial<MenuItemFormData>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image_file: null,
    is_available: true,
    start_time: "00:00",
    end_time: "23:59",
    choices: [],
  });

  return (
    <MenuItemFormContext.Provider
      value={{
        formData,
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
