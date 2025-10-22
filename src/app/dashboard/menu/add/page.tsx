"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import ImageSection from "@/sections/menu/add/image-section";
import MenuForm from "@/sections/menu/add/menu-form";
import ChoicesList from "@/sections/menu/add/choices-list";
import ChoiceBuilder from "@/sections/menu/add/choice-builder";
import {
  menuItemSchema,
  type MenuItemFormData,
  type ChoiceFormData,
} from "@/schemas/menu";

export default function AddMenuItemPage() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [choices, setChoices] = useState<ChoiceFormData[]>([]);

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image_url: undefined,
      is_available: true,
      start_time: "00:00",
      end_time: "23:59",
      choices: [],
    },
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      form.setValue("image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    form.setValue("image", undefined);
  };

  const handleAddChoice = (choice: ChoiceFormData) => {
    const newChoice = { ...choice, id: Date.now().toString() };
    setChoices([...choices, newChoice]);
  };

  const handleUpdateChoice = (id: string, updatedChoice: ChoiceFormData) => {
    setChoices(
      choices.map((c) => (c.id === id ? { ...updatedChoice, id } : c))
    );
  };

  const handleRemoveChoice = (id: string) => {
    setChoices(choices.filter((c) => c.id !== id));
  };

  const onSubmit = (data: MenuItemFormData) => {
    const menuItem = {
      ...data,
      choices,
    };
    console.log("Submitting menu item:", menuItem);
    // TODO: Send to API
  };

  return (
    <div className="rounded-xl min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Add Menu Item</h1>
          <p className="text-muted-foreground">
            Create a new dish with customizable options for your restaurant
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image */}
            <div className="lg:col-span-1">
              <ImageSection
                imagePreview={imagePreview}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <MenuForm form={form} />

              {/* Choices Section */}
              <ChoicesList
                choices={choices}
                onUpdateChoice={handleUpdateChoice}
                onRemoveChoice={handleRemoveChoice}
              />

              <ChoiceBuilder onAddChoice={handleAddChoice} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
