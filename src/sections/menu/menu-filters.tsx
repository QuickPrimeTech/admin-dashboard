"use client";
import { Button } from "@ui/button";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@ui/scroll-area";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";

interface MenuFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function MenuFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: MenuFiltersProps) {
  return (
    <div className="flex w-full flex-col md:flex-row gap-4 items-center">
      {/* Search */}
      <div className="flex-none w-full md:w-[300px] lg:w-[400px]">
        <InputGroup>
          <InputGroupInput
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Scrollable categories */}
      <ScrollArea className="rounded-lg flex-1 max-sm:w-full w-0">
        <div className="flex gap-2 py-2 px-4 bg-accent">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
