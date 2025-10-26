// src/context/menu-item-form-context.tsx
"use client";
import { useMenuItemQuery } from "@/hooks/use-menu";
import { MenuItemFormData } from "@/schemas/menu";
import { EditErrorState } from "@/sections/menu/edit/error-state";
import { MenuItem } from "@/types/menu";
import React, { createContext, useContext, useEffect, useState } from "react";

type formSections = "image" | "basicInfo" | "availability" | "choices";

type MenuItemFormContext = {
  data: MenuItem | null;
  status: "error" | "success" | "pending";
  //To save the form data that has changed and cosolidated
  formData: Partial<MenuItemFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<MenuItemFormData>>>;
  //To save the form data taht has changed
  updateFormData: (values: Partial<MenuItemFormData>) => void;
  unsavedChanges: Record<formSections, boolean>;
  setUnsavedChanges: React.Dispatch<
    React.SetStateAction<Record<formSections, boolean>>
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
  const [formData, setFormData] = useState<Partial<MenuItemFormData>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<formSections, boolean>
  >({
    image: false,
    basicInfo: false,
    availability: false,
    choices: false,
  });

  // function to update the specific data in the form data
  const updateFormData = React.useCallback(
    (values: Partial<MenuItemFormData>) => {
      setFormData((prev) => ({
        ...prev,
        ...values,
      }));
    },
    []
  );

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

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
