import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { ChoiceFormData } from "@/schemas/menu";

interface ChoiceItemProps {
  choice: ChoiceFormData;
  onEdit: () => void;
  onRemove: () => void;
}

export default function ChoiceItem({
  choice,
  onEdit,
  onRemove,
}: ChoiceItemProps) {
  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{choice.title}</h4>
              {choice.required && <Badge variant="secondary">Required</Badge>}
              {choice.maxSelectable && (
                <Badge variant="outline">Max: {choice.maxSelectable}</Badge>
              )}
            </div>
            <div className="space-y-1">
              {choice.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>{option.label}</span>
                  {option.price && (
                    <span className="text-foreground font-medium">
                      +Ksh{option.price.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
