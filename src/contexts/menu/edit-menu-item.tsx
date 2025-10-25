// src/context/menu-item-form-context.tsx
"use client";
import { useMenuItemQuery } from "@/hooks/use-menu";
import { EditErrorState } from "@/sections/menu/edit/error-state";
import { MenuItem } from "@/types/menu";
import React, { createContext, useContext, useState } from "react";

type MenuItemFormContext = {
  data: MenuItem | null;
  status: "error" | "success" | "pending";
  //To save the form data that has changed and cosolidated
  formData: Record<string, any>;
  setFormData: (values: Record<string, any>) => void;
  //To save the form data taht has changed
  updateFormData: (section: string, values: any) => void;
  unsavedChanges: Record<string, boolean>;
  setUnsavedChanges: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
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
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>(
    {}
  );

  // function to update the specific data in the form data
  function updateFormData(section: string, values: any) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  }

  //Detecting if the data was fetched unsuccessfully
  console.log(isError);
  if (isError) {
    return <EditErrorState refetch={() => refetch()} />;
  }
  return (
    <MenuItemFormContext.Provider
      value={{
        data: data || null,
        status,
        formData,
        setFormData,
        updateFormData,
        unsavedChanges,
        setUnsavedChanges,
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
      "update useMenuItemForm must be used within a MenuItemFormProvider"
    );
  }
  return context;
}
