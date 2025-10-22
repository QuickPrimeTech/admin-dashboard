"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import OptionItem from "./choice-option-item";
import {
  choiceSchema,
  type ChoiceFormData,
  type ChoiceOptionFormData,
} from "@/schemas/menu";

interface ChoiceBuilderProps {
  onAddChoice: (choice: ChoiceFormData) => void;
}

export function ChoiceBuilder({ onAddChoice }: ChoiceBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ChoiceOptionFormData[]>([]);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ChoiceFormData>({
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
    const finalData = { ...data, options };
    console.log("✅ Submitted:", finalData);
    onAddChoice(finalData);
    reset();
    setOptions([]);
    setIsOpen(false);
  };

  const submitManually = async () => {
    // first trigger validation manually
    const valid = await trigger();
    if (valid) {
      const values = getValues();
      onSubmit(values);
    } else {
      console.warn("❌ Validation failed");
    }
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 border-border"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Choice
      </Button>
    );
  }

  return (
    <Card className="p-6 space-y-5">
      {/* Choice Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Choice Title</label>
        <Input
          placeholder="e.g., Choice of Flavor, Size, Dressing"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium mb-2">Options</label>
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

        <div className="flex gap-2">
          <Input
            placeholder="Option name (e.g., Small, Medium, Large)"
            value={optionLabel}
            onChange={(e) => setOptionLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
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
          <Button type="button" variant="secondary" onClick={handleAddOption}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          <Checkbox {...register("required")} />
          <label className="text-sm font-medium cursor-pointer">Required</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max Selectable
          </label>
          <Input
            type="number"
            placeholder="Unlimited"
            min="1"
            {...register("maxSelectable", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setOptions([]);
            setIsOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={options.length === 0}
          onClick={submitManually}
        >
          Add Choice
        </Button>
      </div>
    </Card>
  );
}
