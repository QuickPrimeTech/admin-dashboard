"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
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

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Edit, Trash2, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";
import Link from "next/link";
import { UseMutationResult } from "@tanstack/react-query";

interface MenuGridProps {
  items: MenuItem[];
  onDelete: UseMutationResult<{ id: number }, Error, number, unknown>;
}

export function MenuGrid({ items, onDelete }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first menu item
            </p>
            <Button asChild>
              <Link href={"/dashboard/menu/add"}>
                <Plus />
                Add Menu Item
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Card key={index} className="py-0 pb-5 overflow-hidden">
          <div className="relative h-48">
           {item.image_url ? (
  <Image
    src={item.image_url}
    alt={item.name}
    fill
    className="object-cover"
    {...(item.lqip && {
      placeholder: "blur",
      blurDataURL: item.lqip,
    })}
  />
) : (
  <div
    role="img"
    aria-label={`${item.name} image not available`}
    className="flex gap-2 h-full w-full items-center justify-center bg-muted text-muted-foreground dark:bg-muted/50"
  >
    <ImageIcon className="size-6"/>
    <span className="text-sm font-medium">No image</span>
  </div>
)}

          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <Badge
                variant={item.is_available ? "secondary" : "outline"}
                className="ml-2"
              >
                {item.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold">Ksh{" "}{item.price}</span>
              <Badge variant="outline" className="capitalize">
                {item.category}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                aria-label={`edit ${item.name}`}
                asChild
              >
                <Link href={`/dashboard/menu/edit/${item.id}`}>
                  <Edit />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    aria-label={`delete ${item.name}`}
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      <span className="font-medium">{item.name}</span> from your
                      menu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90 text-white"
                      onClick={() => onDelete.mutate(Number(item.id))}
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
