import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { ChoiceFormData } from "@/schemas/menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChoiceItemProps {
  choice: ChoiceFormData;
  onRemove: () => void;
  onEdit: () => void;
}

export default function ChoiceItem({
  choice,
  onRemove,
  onEdit,
}: ChoiceItemProps) {
  return (
    <Card className="bg-accent/10 border-accent/20 py-3">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
              <h4 className="font-semibold text-foreground">{choice.title}</h4>
              <div className="flex gap-2 items-center">
                <Badge variant="secondary">
                  {choice.required ? "Required" : "Optional"}
                </Badge>
                <Badge variant="outline">
                  Max:{" "}
                  {choice.maxSelectable ? choice.maxSelectable : "Unlimited"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              {choice.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <Badge variant={"outline"}>{option.label}</Badge>
                  {typeof option.price === "number" && (
                    <span className="text-muted-foreground text-sm">
                      {option.price === 0
                        ? "Free"
                        : `+Ksh ${option.price.toFixed(2)}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`edit ${choice.title}`}
            >
              <Pencil />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`delete ${choice.title}`}
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the <strong>{choice.title}</strong> choice option from the
                    menu item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onRemove}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
