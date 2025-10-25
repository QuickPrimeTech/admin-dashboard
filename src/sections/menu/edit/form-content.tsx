"use client";

import { Button } from "@ui/button";
import AvailabilitySection from "./availability-section";
import BasicInfoSection from "./basic-info-section";
import { ChoiceBuilder } from "./choice-builder";
import { ChoicesList } from "./choice-list";
import { ImageSection } from "./image-section";
import { Edit } from "lucide-react";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";

export function FormContent() {
  const { unsavedChanges } = useMenuItemForm();
  // Compute if any section has unsaved changes
  const disabled = !Object.values(unsavedChanges).some(Boolean);

  // The Save button should be disabled if *none* are true

  return (
    <>
      <div className="flex justify-end mb-6 sticky top-16 z-10 bg-background/70 py-2 backdrop-blur-sm rounded-lg px-4">
        <Button type="submit" disabled={disabled}>
          <Edit /> Save Changes
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ImageSection />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection />
          <AvailabilitySection />
          <ChoicesList />
          <ChoiceBuilder />
        </div>
      </div>
    </>
  );
}
