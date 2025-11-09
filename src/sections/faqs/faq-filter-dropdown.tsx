// components/faq-filter-dropdown.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@ui/dropdown-menu";
import { Button } from "@ui/button";
import { ChevronDown } from "lucide-react";

type FaqFilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FaqFilterDropdown({ value, onChange }: FaqFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filter: {value} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onChange("Order")}>
          Order
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Latest")}>
          Latest
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Oldest")}>
          Oldest
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Published")}>
          Published
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onChange("Draft")}>
          Draft
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
