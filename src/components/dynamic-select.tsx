"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@ui/select";
import { FormControl } from "@ui/form";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

type DynamicSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
};

export function DynamicSelect<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({ field }: DynamicSelectProps<TFieldValues, TName>) {
  return (
    <Select
      key={field.value}
      onValueChange={field.onChange}
      value={field.value || ""}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="appetizers">Appetizers</SelectItem>
        <SelectItem value="mains">Main Courses</SelectItem>
        <SelectItem value="sides">Sides</SelectItem>
        <SelectItem value="desserts">Desserts</SelectItem>
        <SelectItem value="beverages">Beverages</SelectItem>
      </SelectContent>
    </Select>
  );
}
