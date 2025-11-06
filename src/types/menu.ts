import {
  AvailabilityFormData,
  BasicInfoFormData,
  ChoiceFormData,
} from "@/schemas/menu";

export interface ChoiceOption {
  label: string;
  price?: number;
}

export interface Choice {
  id?: string;
  title: string;
  required?: boolean;
  maxSelectable?: number;
  options: ChoiceOption[];
}

export interface MenuItem extends AvailabilityFormData, BasicInfoFormData {
  choices: ChoiceFormData[];
  image_url: string;
  lqip: string;
  id: string;
}

export type FormDataFields = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: string | boolean;
  dietary_preference?: string[];
  image_url?: string;
};
