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
  const itemRef = useRef<MenuItem | null | undefined>(item);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      category: "",
      dietary_preference: [],
      is_available: true,
      image_url: "",
    },
  });

  // When item changes, reset form values
  useEffect(() => {
    if (item) {
      itemRef.current = item;
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
    } else {
      form.reset();
      setSelectedTypes([]);
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

      // Important: Append using the key "dietary_preference"
      data.dietary_preference?.forEach((t) => {
        formData.append("dietary_preference", t);
      });

      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      if (itemRef.current) {
        formData.append("id", itemRef.current.id);
        const response = await fetch("/api/menu-items", {
          method: "PATCH",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(result.message || "Menu item updated successfully!");
          onSaved();
        } else {
          toast.error(result.message || "Failed to update menu item.");
        }
      } else {
        const response = await fetch("/api/menu-items", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(result.message || "Menu item submitted successfully!");
          onSaved();
        } else {
          toast.error(result.message || "Failed to submit menu item.");
        }
      }
    } catch {
      toast.error(
        "Failed to submit menu item. Please Check your internet connection"
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
