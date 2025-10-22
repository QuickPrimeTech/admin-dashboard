// @/sections/menu/add/choice-builder.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import OptionItem from "./option-item";
import {
  choiceSchema,
  type ChoiceFormData,
  type ChoiceOptionFormData,
} from "@/schemas/menu";

interface ChoiceBuilderProps {
  onAddChoice: (choice: ChoiceFormData) => void;
}

export default function ChoiceBuilder({ onAddChoice }: ChoiceBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ChoiceOptionFormData[]>([]);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  const form = useForm<ChoiceFormData>({
    resolver: zodResolver(choiceSchema),
    defaultValues: {
      title: "",
      required: false,
      maxSelectable: undefined,
      options: [],
    },
  });

  const handleAddOption = () => {
    if (optionLabel.trim()) {
      const newOption: ChoiceOptionFormData = {
        label: optionLabel,
        price: optionPrice ? Number.parseFloat(optionPrice) : undefined,
      };
      setOptions([...options, newOption]);
      setOptionLabel("");
      setOptionPrice("");
    }
  };

  const handleUpdateOption = (
    index: number,
    updatedOption: ChoiceOptionFormData
  ) => {
    const newOptions = [...options];
    newOptions[index] = updatedOption;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ChoiceFormData) => {
    onAddChoice({
      ...data,
      options,
    });
    // Reset form
    form.reset();
    setOptions([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-border"
        onClick={() => setIsOpen(true)}
      >
        <Plus />
        Add Choice
      </Button>
    );
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Choice Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choice Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Choice of Flavor, Size, Dressing"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Options */}
          <div>
            <FormLabel className="mb-2 block">Options</FormLabel>
            <div className="space-y-2 mb-3">
              {options.map((option, idx) => (
                <OptionItem
                  key={idx}
                  option={option}
                  onUpdate={(updated) => handleUpdateOption(idx, updated)}
                  onRemove={() => handleRemoveOption(idx)}
                  isEditing={true}
                />
              ))}
            </div>

            {/* Add Option Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Option name (e.g., Small, Medium, Large)"
                  value={optionLabel}
                  onChange={(e) => setOptionLabel(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  value={optionPrice}
                  onChange={(e) => setOptionPrice(e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  variant="secondary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Required
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSelectable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Selectable</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Unlimited"
                      min="1"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? Number.parseInt(e.target.value)
                            : undefined
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                form.reset();
                setOptions([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={options.length === 0}>
              Add Choice
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
