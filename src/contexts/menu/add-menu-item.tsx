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
import { useCreateMenuItemMutation } from "@/hooks/use-menu";
import { useBranch } from "@/components/providers/branch-provider";

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

  const {branchId} = useBranch();
  
  const localStorageKey = "add-menu-item-form-data";

  // ✅ Use typed mutation
  const { mutate, isPending } = useCreateMenuItemMutation();
  const [suspendPersist, setSuspendPersist] = useState(false);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null);
  const [availabilityInfo, setAvailabilityInfo] =
    useState<AvailabilityFormData | null>(null);
  const [choices, setChoices] = useState<ChoiceFormData[]>([]);
  const [editingChoice, setEditingChoice] = useState<ChoiceFormData | null>(
    null
  );

  // Load persisted data
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

  // Persist data
  useEffect(() => {
    if (suspendPersist) return;
    let timeout: NodeJS.Timeout;
    const persist = async () => {
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
      }, 500);
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

  const resetFormState = () => {
    setImageInfo(null);
    setBasicInfo(null);
    setAvailabilityInfo(null);
    setChoices([]);
    setEditingChoice(null);
    localStorage.removeItem(localStorageKey);
  };

  const submitForm = async () => {
    if (!basicInfo) return toast.error("Please fill in the basic info first.");
    if (!availabilityInfo)
      return toast.error("Please fill in the availability info first.");

    setSuspendPersist(true);

    try {
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

      const validated = menuItemSchema.parse(data);

      const formData = new FormData();
      Object.entries(validated).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // ✅ Send via typed mutation
      mutate({formData, branchId}, {
        onSuccess: () => {
          resetFormState();
        },
        onError: (err) => {
          console.error("Menu item creation failed", err);
        },
      });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        err.errors.forEach((issue) =>
          toast.error(`${issue.path.join(".")}: ${issue.message}`)
        );
      } else {
        toast.error("Something went wrong during submission.");
        console.error(err);
      }
    } finally {
      setSuspendPersist(false);
    }
  };

  const addChoice = (choice: ChoiceFormData) =>
    setChoices((prev) => [...prev, { ...choice, id: crypto.randomUUID() }]);

  const removeChoice = (id: string) =>
    setChoices((prev) => prev.filter((choice) => choice.id !== id));

  const onEditChoice = (choice: ChoiceFormData) => {
    setEditingChoice(choice);
    removeChoice(choice.id!);
  };

  return (
    <MenuItemFormContext.Provider
      value={{
        imageInfo,
        setImageInfo,
        basicInfo,
        setBasicInfo,
        availabilityInfo,
        setAvailabilityInfo,
        choices,
        setChoices,
        addChoice,
        removeChoice,
        onEditChoice,
        editingChoice,
        setEditingChoice,
        isSubmitting: isPending,
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
