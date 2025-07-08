"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";

interface Props {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: number) => void;
  onTogglePublished: (id: number, published: boolean) => void;
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
        <Card key={item.id} className="py-0 pb-3 overflow-hidden group">
          <div className="relative aspect-square overflow-hidden">
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
          </div>
          {(item.title || item.description) && (
            <CardContent>
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
          <CardFooter className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onTogglePublished(item.id, !item.is_published)}
            >
              {item.is_published ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this gallery item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(item.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
