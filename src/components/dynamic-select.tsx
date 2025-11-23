"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@ui/select";
import { FormControl } from "@ui/form";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useCategoriesQuery } from "@/hooks/use-menu";
import { Skeleton } from "./ui/skeleton";
import { Plus } from "lucide-react";
import { useBranch } from "./providers/branch-provider";

type DynamicSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
};

export function DynamicSelect<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({ field }: DynamicSelectProps<TFieldValues, TName>) {
  const { branchId } = useBranch();
  //Getting the categories using the react query
  const {
    data: serverCategories,
    isPending,
    isError,
  } = useCategoriesQuery(branchId);

  //fallback categories for when the server doesn't fetch the categories
  const prefilledCat = ["Main Dishes", "Starters", "Desserts"];

  const [categories, setCategories] = useState<string[]>(prefilledCat);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  const add = () => {
    const txt = custom.trim();
    if (!txt) return;
    if (!categories.includes(txt)) setCategories((o) => [...o, txt]);
    field.onChange(txt);
    setCustom("");
    setOpen(false);
  };

  useEffect(() => {
    if (!serverCategories) return;

    let merged =
      serverCategories.length < 3
        ? Array.from(new Set([...serverCategories, ...prefilledCat]))
        : [...serverCategories];

    // ensure selected value is included once
    if (field.value && !merged.includes(field.value)) {
      merged = [...merged, field.value];
    }

    setCategories(merged);
  }, [serverCategories, field.value]);

  return (
    <>
      <Select
        key={field.value}
        onValueChange={(v) =>
          v === "__ADD__" ? setOpen(true) : field.onChange(v)
        }
        value={field.value || ""}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {isPending ? (
            // ✅ Loading skeletons when fetching
            <div className="p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <>
              {categories.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
              {isError && (
                <p className="text-sm text-destructive px-2">
                  Failed to load categories. You can still add a custom one.
                </p>
              )}

              <SelectItem value="__ADD__">+ Add custom</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add custom category</DialogTitle>
            <DialogDescription>
              Enter a custom category name exactly as you want it to appear on
              your menu. It won’t be automatically formatted or adjusted.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. Brunch"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add}>
              <Plus />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
