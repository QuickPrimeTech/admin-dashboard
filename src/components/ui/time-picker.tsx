"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

interface TimePicker24hProps {
  value?: string; // e.g. "13:45"
  onChange: (value: string) => void;
}

export function TimePicker({ value = "00:00", onChange }: TimePicker24hProps) {
  // Split incoming value into hours/minutes
  const [hour, minute] = value.split(":");

  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minute || "00"}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour || "00"}:${newMinute}`);
  };

  // Generate dropdown options
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );

  return (
    <div className="flex gap-2">
      <FormControl>
        <Select value={hour} onValueChange={handleHourChange}>
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>

      <FormControl>
        <Select value={minute} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </div>
  );
}
