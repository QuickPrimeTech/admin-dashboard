import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import { menuItemSchema, MenuItemFormData } from "@/schemas/menu-item-schema";
import { MenuItem } from "@/types/menu";

export function useMenuItemForm(
  item: MenuItem | null | undefined,
  onSaved: () => void
) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      type: [],
      is_available: true,
      image_url: "",
    },
  });

  // When item changes, reset form values
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        type: item.type || [],
        is_available: item.is_available,
        image_url: item.image_url || "",
      });
      setSelectedTypes(item.type || []);
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
    form.setValue("type", newTypes);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await mockAPI.uploadFile(
        file,
        `menu-items/${file.name}`
      );
      form.setValue("image_url", imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: MenuItemFormData) => {
    try {
      const menuItemData = {
        ...data,
        type: selectedTypes,
      };

      if (item) {
        await mockAPI.updateMenuItem(item.id, menuItemData);
        toast.success("Menu item updated successfully");
      } else {
        await mockAPI.createMenuItem(menuItemData);
        toast.success("Menu item created successfully");
      }

      onSaved();
    } catch (error) {
      toast.error(`Failed to ${item ? "update" : "create"} menu item`);
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
