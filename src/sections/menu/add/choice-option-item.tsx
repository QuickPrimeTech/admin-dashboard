"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ChoiceOptionFormData } from "@/schemas/menu";
import { Badge } from "@/components/ui/badge";

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
        price: editedPrice ? Number.parseFloat(editedPrice) : 0,
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
      <div className="flex gap-2 mt-2 items-end bg-card p-3 rounded-lg border border-secondary">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1.5">
            Option Name
          </label>
          <Input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            placeholder="e.g., Small"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs font-medium mb-1.5">Price</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value ?? 0)}
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleCancel}
            aria-label={`cancel edit ${option.label} option`}
          >
            <X />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            onClick={handleSave}
            aria-label={`save ${option.label} option`}
            disabled={!editedLabel.trim()}
          >
            <Check />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-2 justify-between bg-card p-3 rounded-lg border border-secondary">
      <div className="flex-1">
        <p className="font-medium">{option.label}</p>
        {option.price !== undefined && option.price === 0 && (
          <p className="text-sm text-muted-foreground">Free</p>
        )}
        {typeof option.price === "number" && option.price > 0 && (
          <p className="text-sm text-muted-foreground">
            +Ksh{option.price.toFixed(2)}
          </p>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-1 ml-4">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={() => setIsEditMode(true)}
            aria-label={`edit ${option.label} option`}
          >
            <Edit2 />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`delete ${option.label} option`}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
