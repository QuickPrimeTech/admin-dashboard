// src/context/menu-item-form-context.tsx
"use client";
import { useMenuItemQuery } from "@/hooks/use-menu";
import { EditErrorState } from "@/sections/menu/edit/error-state";
import { MenuItem } from "@/types/menu";
import React, { createContext, useContext } from "react";

type MenuItemFormContext = {
  data: MenuItem | null;
  status: "error" | "success" | "pending";
};
const MenuItemFormContext = createContext<MenuItemFormContext | null>(null);

export function EditMenuItemProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: number;
}) {
  const { data, status, refetch, isError } = useMenuItemQuery(id);
  //Detecting if the data was fetched unsuccessfully
  console.log(isError);
  if (isError) {
    return <EditErrorState refetch={() => refetch()} />;
  }
  return (
    <MenuItemFormContext.Provider value={{ data: data || null, status }}>
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
