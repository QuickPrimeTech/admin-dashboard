"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  showPublished: string;
  setShowPublished: (v: string) => void;
}

export function GalleryFilters({
  searchTerm,
  setSearchTerm,
  showPublished,
  setShowPublished,
}: Props) {
  const publishOptions = ["all", "published", "draft"];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search gallery items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        {publishOptions.map((option) => (
          <Button
            key={option}
            variant={showPublished === option ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPublished(option)}
            className="capitalize"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
