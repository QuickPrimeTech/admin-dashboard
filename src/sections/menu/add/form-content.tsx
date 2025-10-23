import { Button } from "@/components/ui/button";
import AvailabilitySection from "./availability-section";
import BasicInfoSection from "./basic-info-section";
import { ChoiceBuilder } from "./choice-builder";
import { ChoicesList } from "./choice-list";
import { ImageSection } from "./image-section";
import { Save } from "lucide-react";

export function FormContent() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ImageSection />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection />
          <AvailabilitySection />
          <ChoicesList />
          <ChoiceBuilder />
          <div className="flex justify-end">
            <Button type="submit">
              <Save /> Save Menu Item
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
