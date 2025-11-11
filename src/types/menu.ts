import {
  AvailabilityFormData,
  BasicInfoFormData,
  ChoiceFormData,
} from "@/schemas/menu";

export interface MenuItem extends AvailabilityFormData, BasicInfoFormData {
  choices: ChoiceFormData[];
  image_url: string;
  lqip: string;
  id: string;
}
