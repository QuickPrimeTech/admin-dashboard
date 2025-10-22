"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { Input } from "@ui/input";
import type { ChoiceOptionFormData } from "@/schemas/menu";

interface OptionItemProps {
  option: ChoiceOptionFormData;
  onUpdate: (option: ChoiceOptionFormData) => void;
  onRemove: () => void;
  isEditing?: boolean;
}

export default function OptionItem({
  option,
  onUpdate,
  onRemove,
  isEditing = false,
}: OptionItemProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedLabel, setEditedLabel] = useState(option.label);
  const [editedPrice, setEditedPrice] = useState(
    option.price?.toString() || ""
  );

  const handleSave = () => {
    if (editedLabel.trim()) {
      onUpdate({
        label: editedLabel,
        price: editedPrice ? Number.parseFloat(editedPrice) : undefined,
      });
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditedLabel(option.label);
    setEditedPrice(option.price?.toString() || "");
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <div className="flex gap-2 items-end bg-card p-3 rounded-lg border border-border">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Option Name</label>
          <Input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            placeholder="e.g., Small"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Price
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!editedLabel.trim()}
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
      <div className="flex-1">
        <p className="font-medium ">{option.label}</p>
        {option.price && option.price > 0 && (
          <p className="text-sm text-muted-foreground">
            +${option.price.toFixed(2)}
          </p>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-1 ml-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsEditMode(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
