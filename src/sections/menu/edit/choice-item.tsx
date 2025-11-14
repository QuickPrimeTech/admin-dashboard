"use client";

import { useState } from "react";
import { Card, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { ChoiceFormData } from "@/schemas/menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import { useMenuItemForm } from "@/contexts/menu/edit-menu-item";
import { useUpdateMenuItemMutation } from "@/hooks/use-menu";
import { Spinner } from "@ui/spinner";
import { useBranch } from "@providers/branch-provider";

interface ChoiceItemProps {
  choice: ChoiceFormData;
  onEdit: () => void;
}

export default function ChoiceItem({ choice, onEdit }: ChoiceItemProps) {

   //Get the branch id from the context
    const {branchId} = useBranch();

  const [open, setOpen] = useState(false);
  const { choices, setChoices, data: serverData } = useMenuItemForm();
  const { mutateAsync, isPending } = useUpdateMenuItemMutation();

  const handleDelete = async () => {
    if (!serverData?.id) return;

    const updatedChoices = choices.filter((c) => c.id !== choice.id);

    const formData = new FormData();
    formData.append("id", serverData.id);
    formData.append("choices", JSON.stringify(updatedChoices));

    try {
      await mutateAsync({ formData, branchId });
      setChoices(updatedChoices);
      setOpen(false); // ✅ close dialog manually after success
    } catch (error) {
      console.error(error);
    }
  };

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

            <AlertDialog open={open} onOpenChange={setOpen}>
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
                    the <strong>{choice.title}</strong> choice option.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>

                  {/* Custom button instead of AlertDialogAction */}
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Spinner /> Deleting...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
