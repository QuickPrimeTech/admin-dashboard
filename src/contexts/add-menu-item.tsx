// src/context/menu-item-form-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  menuItemSchema,
  type AvailabilityFormData,
  type BasicInfoFormData,
  type ChoiceFormData,
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
  isSubmitting: boolean;

  editingChoice: ChoiceFormData | null;
  setEditingChoice: (choice: ChoiceFormData | null) => void;

  submitForm: () => void;
};

type ImageInfo = {
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

  const [suspendPersist, setSuspendPersist] = useState(false);
  //This is the state to show if the form is being submitted or not
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const resetFormState = () => {
    setImageInfo(null);
    setBasicInfo(null);
    setAvailabilityInfo(null);
    setChoices([]);
    setEditingChoice(null);
    localStorage.removeItem(localStorageKey);
  };

  // ✅ Persist data but skip if nothing important changed
  useEffect(() => {
    if (suspendPersist) return;
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
  }, [
    suspendPersist,
    imageInfo?.base64,
    basicInfo,
    availabilityInfo,
    choices,
    imageInfo,
  ]);

  const submitForm = async () => {
    try {
      setSuspendPersist(true);
      if (!basicInfo) {
        toast.error("Please fill in the basic info first.");
        return;
      }
      if (!availabilityInfo) {
        toast.error("Please fill in the availability info first.");
        return;
      }

      // Combine all form sections into one object
      const data = {
        ...basicInfo,
        image: imageInfo?.image || undefined,
        lqip: imageInfo
          ? await generateBlurDataURL(imageInfo.image)
          : undefined,
        is_available: availabilityInfo?.is_available ?? false,
        start_time: availabilityInfo?.start_time,
        end_time: availabilityInfo?.end_time,
        is_popular: availabilityInfo?.is_popular,
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
      setIsSubmitting(true);
      // ✅ Send to your backend
      const res = await axios.post("/api/menu-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);
      toast.success(res.data.message);
      // Optionally clear the data
      resetFormState();
    } catch (err: unknown) {
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
    setIsSubmitting(false);
    setSuspendPersist(false);
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
        isSubmitting,
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
