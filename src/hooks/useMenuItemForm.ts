import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { menuItemSchema, MenuItemFormData } from "@/schemas/menu-item-schema";
import { MenuItem } from "@/types/menu";

export function useMenuItemForm(
  item: MenuItem | null | undefined,
  onSaved: () => void
) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [uploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const prevId = useRef<string | undefined>(item?.id);

  // ✅ Initialize form with item values if provided
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          dietary_preference: item.dietary_preference || [],
          is_available: item.is_available,
          image_url: item.image_url || "",
        }
      : {
          name: "",
          description: "",
          price: undefined,
          category: "",
          dietary_preference: [],
          is_available: true,
          image_url: "",
        },
  });

  // ✅ Only reset when the item actually changes
  useEffect(() => {
    if (item && item.id !== prevId.current) {
      form.reset({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        dietary_preference: item.dietary_preference || [],
        is_available: item.is_available,
        image_url: item.image_url || "",
      });
      setSelectedTypes(item.dietary_preference || []);
      prevId.current = item.id;
    }
  }, [item, form]);

  // Handle dietary type toggle
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    form.setValue("dietary_preference", newTypes);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  // Handle form submission
  const onSubmit = async (data: MenuItemFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("category", data.category);
      formData.append("is_available", String(data.is_available));

      data.dietary_preference?.forEach((t) => {
        formData.append("dietary_preference", t);
      });

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const method = item ? "PATCH" : "POST";
      if (item) {
        formData.append("id", item.id);
      }

      const response = await fetch("/api/menu-items", {
        method,
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(
          result.message ||
            (item
              ? "Menu item updated successfully!"
              : "Menu item submitted successfully!")
        );
        onSaved();
      } else {
        toast.error(result.message || "Failed to save menu item.");
      }
    } catch {
      toast.error(
        "Failed to submit menu item. Please check your internet connection."
      );
    }
  };

  return {
    form,
    selectedTypes,
    uploading,
    handleTypeToggle,
    handleImageUpload,
    onSubmit,
  };
}
