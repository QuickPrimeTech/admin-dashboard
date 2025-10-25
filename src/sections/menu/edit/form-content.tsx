import { Button } from "@ui/button";
import AvailabilitySection from "./availability-section";
import BasicInfoSection from "./basic-info-section";
import { ChoiceBuilder } from "./choice-builder";
import { ChoicesList } from "./choice-list";
import { ImageSection } from "./image-section";
import { Edit } from "lucide-react";

export function FormContent() {
  return (
    <>
      <div className="flex justify-end mb-6 sticky top-16 z-10 bg-background/70 py-2 backdrop-blur-sm">
        <Button type="submit">
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
          <div className="flex justify-end"></div>
        </div>
      </div>
    </>
  );
}
