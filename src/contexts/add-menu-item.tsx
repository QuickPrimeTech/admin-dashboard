// src/context/menu-item-form-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  menuItemSchema,
  type AvailabilityFormData,
  type BasicInfoFormData,
  type ChoiceFormData,
  type MenuItemFormData,
} from "@/schemas/menu";
import {
  base64ToFile,
  fileToBase64,
  generateBlurDataURL,
} from "@/helpers/file-helpers";
import { toast } from "sonner";
import { ZodError } from "zod";
import axios from "axios";

type MenuItemFormContextType = {
  imageInfo: ImageInfo | null;
  setImageInfo: React.Dispatch<React.SetStateAction<ImageInfo | null>>;

  basicInfo: BasicInfoFormData | null;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoFormData | null>>;

  choices: ChoiceFormData[];
  setChoices: React.Dispatch<React.SetStateAction<ChoiceFormData[]>>;
  addChoice: (choice: ChoiceFormData) => void;
  removeChoice: (id: string) => void;

  onEditChoice: (choice: ChoiceFormData) => void;

  availabilityInfo: AvailabilityFormData | null;
  setAvailabilityInfo: React.Dispatch<
    React.SetStateAction<AvailabilityFormData | null>
  >;

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
  //  Key for localStorage for persisting form data
  const localStorageKey = "add-menu-item-form-data";

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
    const stored = localStorage.getItem(localStorageKey);
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
        localStorage.setItem(localStorageKey, JSON.stringify(data));
      }, 500); // only persist after 0.5s of no change
    };

    persist();
    return () => clearTimeout(timeout);
  }, [imageInfo?.base64, basicInfo, availabilityInfo, choices, imageInfo]);

  const submitForm = async () => {
    try {
      if (!basicInfo) {
        toast.error("Please fill in the basic info first.");
        return;
      }

      // Combine all form sections into one object
      const data: MenuItemFormData = {
        ...basicInfo,
        image: imageInfo?.image || null,
        lqip: imageInfo
          ? await generateBlurDataURL(imageInfo.image)
          : undefined,
        is_available: availabilityInfo?.is_available ?? false,
        start_time: availabilityInfo?.start_time ?? "00:00",
        end_time: availabilityInfo?.end_time ?? "23:59",
        is_popular: availabilityInfo?.is_popular ?? false,
        description: basicInfo?.description || undefined,
        choices,
      };

      // ✅ Validate with Zod
      const validated = menuItemSchema.parse(data);

      // ✅ Build FormData for multipart/form-data upload
      const formData = new FormData();
      Object.entries(validated).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else if (typeof value === "object") {
          // Convert nested objects/arrays (like choices) to JSON
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // ✅ Send to your backend
      const response = await axios.post("/api/menu-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Menu item created successfully!");
      console.log("Response:", response.data);

      // Optionally clear the localStorage
      localStorage.removeItem("add-menu-item-form-data");
    } catch (err: any) {
      if (err instanceof ZodError) {
        err.errors.forEach((issue) => {
          toast.error(`${issue.path.join(".")}: ${issue.message}`);
        });
      } else if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Server error occurred.");
        console.error("API Error:", err.response?.data);
      } else {
        toast.error("Something went wrong during submission.");
        console.error("Unexpected Error:", err);
      }
    }
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
        setChoices,
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
