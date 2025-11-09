"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Input } from "@ui/input";
import { Checkbox } from "@ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@ui/form";
import { choiceSchema, type ChoiceFormData } from "@/schemas/menu";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { ChoiceOptionItem } from "./choice-option-item";
import { useUpdateMenuItemMutation } from "@/hooks/use-menu";
import { Spinner } from "@ui/spinner";

export function ChoiceBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [optionError, setOptionError] = useState("");
  //Getting the mutation function that updates the menu item
  const { mutateAsync, isPending } = useUpdateMenuItemMutation();

  const {
    choices,
    addChoice,
    editingChoice,
    setEditingChoice,
    data: serverData,
  } = useMenuItemForm(); // ✅ from context

  const form = useForm<ChoiceFormData>({
    resolver: zodResolver(choiceSchema),
    defaultValues: {
      title: editingChoice ? editingChoice.title : "",
      required: editingChoice ? editingChoice.required : false,
      maxSelectable: editingChoice ? editingChoice.maxSelectable : undefined,
      options: editingChoice ? editingChoice.options : [],
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (editingChoice) {
      reset(editingChoice);
    }
  }, [editingChoice, reset]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "options",
  });

  const handleAddOption = () => {
    if (!optionLabel.trim()) {
      setOptionError("Option name is required");
      return;
    }

    setOptionError("");
    append({
      label: optionLabel.trim(),
      price: optionPrice ? Number.parseFloat(optionPrice) : 0,
    });

    setOptionLabel("");
    setOptionPrice("");
  };

  const resetForm = () => {
    reset({
      title: "",
      required: false,
      maxSelectable: undefined,
      options: [],
    });
  };

  const onSubmit = async (data: ChoiceFormData) => {
    if (data.options.length === 0) {
      setOptionError("You must add at least one option");
      return;
    }
    const combinedChoices = [...choices, data];

    const formData = new FormData();
    //Making sure the id exists
    if (!serverData?.id) return;

    formData.append("id", serverData.id);
    formData.append("choices", JSON.stringify(combinedChoices));
    await mutateAsync({ formData });

    //checking if the choice is being edited or added new
    if (editingChoice) {
      // Update existing choice
      addChoice(data); // ✅ Send to context
      setEditingChoice(null);
    } else {
      // Add new choice
      addChoice(data); // ✅ Send to context
    }
    // merge existing choices + new choice data

    resetForm();
    setIsOpen(false);
    setOptionError("");
  };

  if (!isOpen && !editingChoice) {
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
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Choice Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choice Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Choice of Flavor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Options */}
          <div>
            <FormLabel>Options</FormLabel>
            <div className="space-y-2 mb-3">
              {fields.map((option, idx) => (
                <ChoiceOptionItem
                  key={option.id}
                  option={option}
                  onUpdate={(updated) => update(idx, updated)}
                  onRemove={() => remove(idx)}
                  isEditing
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Option name (e.g., Small, Medium, Large)"
                value={optionLabel}
                onChange={(e) => setOptionLabel(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddOption())
                }
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
                variant="secondary"
                onClick={handleAddOption}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {optionError && (
              <p className="text-sm text-destructive mt-1">{optionError}</p>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <FormField
              control={control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Required
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="maxSelectable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Selectable</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Unlimited"
                      min="1"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                if (editingChoice) {
                  addChoice(editingChoice);
                }
                // Reset to editing choice or empty
                setEditingChoice(null);
                setIsOpen(false);
                setOptionError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                fields.length === 0 || !form.formState.isDirty || isPending
              }
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2" />
                  {editingChoice ? "Updating Choice..." : "Adding Choice..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2" />
                  {editingChoice ? "Update Choice" : "Add Choice"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
