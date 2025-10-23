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

export interface MenuItem
  extends ChoiceFormData,
    AvailabilityFormData,
    BasicInfoFormData {
  image_url: string;
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
