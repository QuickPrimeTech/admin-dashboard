import { Button } from "@ui/button";
import { Plus } from "lucide-react";

export function GalleryHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <>
      <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant&apos;s photo gallery
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Photo
        </Button>
      </div>
    </>
  );
}
