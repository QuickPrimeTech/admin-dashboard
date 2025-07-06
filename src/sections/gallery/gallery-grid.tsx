"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";

interface Props {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, published: boolean) => void;
}

export function GalleryGrid({
  items,
  onEdit,
  onDelete,
  onTogglePublished,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden group">
          <div className="relative aspect-square">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.title || "Gallery image"}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute top-2 right-2">
              <Badge variant={item.is_published ? "default" : "secondary"}>
                {item.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onTogglePublished(item.id, item.is_published)}
              >
                {item.is_published ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onDelete(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {(item.title || item.description) && (
            <CardContent className="p-4">
              {item.title && (
                <CardTitle className="text-sm font-medium truncate">
                  {item.title}
                </CardTitle>
              )}
              {item.description && (
                <CardDescription className="text-xs mt-1 line-clamp-2">
                  {item.description}
                </CardDescription>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
