"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";

export function GalleryEmptyState({
  onAdd,
  searchTerm,
  showPublished,
}: {
  onAdd: () => void;
  searchTerm: string;
  showPublished: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No gallery items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || showPublished !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first photo"}
          </p>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Photo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
