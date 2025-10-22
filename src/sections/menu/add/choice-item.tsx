import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { ChoiceFormData } from "@/schemas/menu";

interface ChoiceItemProps {
  choice: ChoiceFormData;
  onUpdate: (choice: ChoiceFormData) => void;
  onRemove: () => void;
}

export default function ChoiceItem({ choice, onRemove }: ChoiceItemProps) {
  return (
    <Card className="bg-accent/10 border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{choice.title}</h4>
              {choice.required && (
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              )}
              {choice.maxSelectable && (
                <Badge variant="outline" className="text-xs">
                  Max: {choice.maxSelectable}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {choice.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm text-muted-foreground"
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
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
