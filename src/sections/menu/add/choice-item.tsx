"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, X, Check, Plus } from "lucide-react";
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
import OptionItem from "./option-item";
import {
  choiceSchema,
  type ChoiceFormData,
  type ChoiceOptionFormData,
} from "@/schemas/menu";

interface ChoiceItemProps {
  choice: ChoiceFormData;
  onUpdate: (choice: ChoiceFormData) => void;
  onRemove: () => void;
}

export default function ChoiceItem({
  choice,
  onUpdate,
  onRemove,
}: ChoiceItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [options, setOptions] = useState<ChoiceOptionFormData[]>(
    choice.options
  );
  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  const form = useForm<ChoiceFormData>({
    resolver: zodResolver(choiceSchema),
    defaultValues: choice,
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
    onUpdate({
      ...data,
      options,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset(choice);
    setOptions(choice.options);
    setOptionLabel("");
    setOptionPrice("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
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
              <div className="flex gap-2">
                <Input
                  placeholder="Option name"
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

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200">
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
            <div className="flex gap-2 justify-end pt-4 border-t border-blue-200">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900 mb-2">{choice.title}</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {options.map((option, idx) => (
            <Badge key={idx} variant="secondary">
              {option.label}
              {option.price &&
                option.price > 0 &&
                ` (+$${option.price.toFixed(2)})`}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-slate-600">
          {choice.required && (
            <span className="font-medium text-orange-600">Required</span>
          )}
          {choice.maxSelectable && (
            <span>
              Max: {choice.maxSelectable} option
              {choice.maxSelectable !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
