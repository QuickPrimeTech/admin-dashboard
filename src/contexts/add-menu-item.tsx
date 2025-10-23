// src/context/menu-item-form-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AvailabilityFormData,
  BasicInfoFormData,
  ChoiceFormData,
} from "@/schemas/menu";
import { base64ToFile, fileToBase64 } from "@/helpers/file-helpers";

type MenuItemFormContextType = {
  imageInfo: ImageInfo | null;
  setImageInfo: React.Dispatch<React.SetStateAction<ImageInfo | null>>;

  basicInfo: BasicInfoFormData | null;
  setBasicInfo: (data: BasicInfoFormData) => void;

  choices: ChoiceFormData[];
  addChoice: (choice: ChoiceFormData) => void;
  removeChoice: (id: string) => void;

  onEditChoice: (choice: ChoiceFormData) => void;

  availabilityInfo: AvailabilityFormData | null;
  setAvailabilityInfo: (data: AvailabilityFormData) => void;

  editingChoice: ChoiceFormData | null;
  setEditingChoice: (choice: ChoiceFormData | null) => void;

  submitForm: () => void;
};

type ImageInfo = {
  preview_url: string;
  image: File;
  base64: string;
};

const MenuItemFormContext = createContext<MenuItemFormContextType | null>(null);

export function AddMenuItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  const [availabilityInfo, setAvailabilityInfo] =
    useState<AvailabilityFormData | null>(null);
  const [choices, setChoices] = useState<ChoiceFormData[]>([]);
  const [editingChoice, setEditingChoice] = useState<ChoiceFormData | null>(
    null
  );

  // ✅ Load persisted data on mount
  useEffect(() => {
    const stored = localStorage.getItem("menu-item-form");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed.imageInfo?.base64) {
        parsed.imageInfo.image = base64ToFile(
          parsed.imageInfo.base64,
          "restored-image.png"
        );
      }
      setImageInfo(parsed.imageInfo || null);
      setBasicInfo(parsed.basicInfo || null);
      setAvailabilityInfo(parsed.availabilityInfo || null);
      setChoices(parsed.choices || []);
    } catch (err) {
      console.error("Failed to load persisted form data", err);
    }
  }, []);

  // ✅ Persist data but skip if nothing important changed
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const persist = async () => {
      // debounce writes to localStorage to avoid spam
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const data = {
          imageInfo: imageInfo
            ? {
                ...imageInfo,
                base64:
                  imageInfo.base64 ||
                  (imageInfo.image ? await fileToBase64(imageInfo.image) : ""),
              }
            : null,
          basicInfo,
          availabilityInfo,
          choices,
        };
        localStorage.setItem("menu-item-form", JSON.stringify(data));
      }, 500); // only persist after 0.5s of no change
    };

    persist();
    return () => clearTimeout(timeout);
  }, [imageInfo?.base64, basicInfo, availabilityInfo, choices, imageInfo]);

  const submitForm = () => {
    // Implement form submission logic here
    console.log("Submitting form with data:", {
      imageInfo,
      basicInfo,
      availabilityInfo,
      choices,
    });
  };
  const removeChoice = (id: string) => {
    setChoices((prev) => prev.filter((choice) => choice.id !== id));
  };

  const onEditChoice = (choice: ChoiceFormData) => {
    //First set the editing choice to the choice to be edited
    setEditingChoice(choice);
    //Then remove it from the choices list to avoid duplication
    removeChoice(choice.id!);
  };

  const addChoice = (choice: ChoiceFormData) => {
    setChoices((prev) => [...prev, { ...choice, id: crypto.randomUUID() }]);
  };

  return (
    <MenuItemFormContext.Provider
      value={{
        availabilityInfo,
        setAvailabilityInfo,
        onEditChoice,
        imageInfo,
        setImageInfo,
        basicInfo,
        setBasicInfo,
        choices,
        addChoice,
        removeChoice,
        editingChoice,
        setEditingChoice,
        submitForm,
      }}
    >
      {children}
    </MenuItemFormContext.Provider>
  );
}

export function useMenuItemForm(): MenuItemFormContextType {
  const context = useContext(MenuItemFormContext);
  if (!context) {
    throw new Error(
      "useMenuItemForm must be used within a MenuItemFormProvider"
    );
  }
  return context;
}
