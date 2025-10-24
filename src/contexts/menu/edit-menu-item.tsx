// src/context/menu-item-form-context.tsx
"use client";
import React, { createContext, useContext } from "react";

type MenuItemFormContext = {
  data: "loading";
};
const MenuItemFormContext = createContext<MenuItemFormContext | null>(null);

export function EditMenuItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MenuItemFormContext.Provider value={{ data: "loading" }}>
      {children}
    </MenuItemFormContext.Provider>
  );
}

export function useMenuItemForm() {
  const context = useContext(MenuItemFormContext);
  if (!context) {
    throw new Error(
      "update useMenuItemForm must be used within a MenuItemFormProvider"
    );
  }
  return context;
}
