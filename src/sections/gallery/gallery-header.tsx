"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function GalleryHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant’s photo gallery
        </p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add Photo
      </Button>
    </div>
  );
}
