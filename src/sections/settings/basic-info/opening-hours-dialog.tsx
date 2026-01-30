// @/components/branch-settings/opening-hours-dialog.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Edit3 } from "lucide-react";
import { DaySchedule } from "@/schemas/branch-settings";

interface OpeningHoursDialogProps {
  value: DaySchedule[];
  onChange: (value: DaySchedule[]) => void;
}

const defaultSchedule: DaySchedule[] = [
  { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
  { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
  { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
  { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
  { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "23:00" },
  { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
  { day: "Sunday", isOpen: false, openTime: "10:00", closeTime: "20:00" },
];

export function OpeningHoursDialog({
  value,
  onChange,
}: OpeningHoursDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<DaySchedule[]>(
    value?.length ? value : defaultSchedule,
  );

  // Sync with external value when dialog opens
  useEffect(() => {
    if (open) {
      setTempSchedule(value?.length ? value : defaultSchedule);
    }
  }, [open, value]);

  const updateDay = (index: number, updates: Partial<DaySchedule>) => {
    setTempSchedule((prev) =>
      prev.map((day, i) => (i === index ? { ...day, ...updates } : day)),
    );
  };

  const handleSave = () => {
    onChange(tempSchedule);
    setOpen(false);
  };

  // Format display text for the button
  const getDisplayText = () => {
    if (!value || value.length === 0) return "Set opening hours";
    const openDays = value.filter((d) => d.isOpen).length;
    return `${openDays} days open • ${value.find((d) => d.isOpen)?.openTime || "09:00"} - ${value.find((d) => d.isOpen)?.closeTime || "22:00"}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Clock className="mr-2 h-4 w-4" />
          {getDisplayText()}
          <Edit3 className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Set Opening Hours</DialogTitle>
          <DialogDescription>
            Configure your weekly schedule. Toggle days off when closed.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] px-6 py-4">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-1 p-0">
              {tempSchedule.map((day, index) => (
                <div
                  key={day.day}
                  className={`flex items-center justify-between rounded-lg px-4 transition-colors ${
                    day.isOpen ? "bg-secondary/50" : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <Switch
                      id={day.day}
                      checked={day.isOpen}
                      onCheckedChange={(checked) =>
                        updateDay(index, { isOpen: checked })
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label
                      htmlFor={day.day}
                      className={`w-24 flex-1 font-medium pl-4 h-12 ${
                        day.isOpen ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {day.day}
                    </Label>
                  </div>

                  {day.isOpen ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) =>
                          updateDay(index, { openTime: e.target.value })
                        }
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      />
                      <span className="text-muted-foreground">—</span>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) =>
                          updateDay(index, { closeTime: e.target.value })
                        }
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      Closed
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
