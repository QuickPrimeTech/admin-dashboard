"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@ui/tooltip";
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
} from "@ui/alert-dialog";

import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";
import {
  useDeleteGalleryItemMutation,
  useTogglePublishedMutation,
} from "@/hooks/use-gallery";

import { useBranch } from "@providers/branch-provider";

interface Props {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
}

export function GalleryGrid({ items, onEdit }: Props) {

  //Getting the branchId from the context
  const {branchId} = useBranch();
  //Delete mutation from TanstackQuery
  const deleteMutation = useDeleteGalleryItemMutation();

  //Toogle mutation
  const togglePublishMutation = useTogglePublishedMutation();

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
              placeholder={item.lqip ? "blur" : "empty"}
              blurDataURL={item.lqip || undefined}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute top-2 right-2">
              <Badge variant={item.is_published ? "default" : "secondary"}>
                {item.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>

          <CardContent>
            {item.title && (
              <CardTitle className="text-sm font-medium truncate">
                {item.title}
              </CardTitle>
            )}
            <CardDescription className="text-xs mt-1 line-clamp-2">
              {item.description && item.description}
            </CardDescription>
            <Badge variant="outline">{item.category}</Badge>
          </CardContent>

          <CardFooter className="flex gap-1">
            <TooltipProvider>
              {/* Publish / Unpublish */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: item.id,
                        is_published: !item.is_published,
                      })
                    }
                  >
                    {item.is_published ? <EyeOff /> : <Eye />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.is_published ? "Unpublish" : "Publish"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>

              {/* Delete */}
              <Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  </AlertDialogTrigger>

                  <TooltipContent
                    className="bg-destructive text-white border-none"
                    sideOffset={5}
                  >
                    <p>Delete</p>
                  </TooltipContent>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        {item?.title ? (
                          <strong>{item?.title}</strong>
                        ) : (
                          "this photo"
                        )}{" "}
                        from your gallery
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate({id: item.id, branchId})}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
