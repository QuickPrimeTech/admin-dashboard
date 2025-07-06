"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/menu";

interface MenuGridProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function MenuGrid({ items, onEdit, onDelete, onAdd }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first menu item
            </p>
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="py-0 pb-5 overflow-hidden">
          {item.image_url && (
            <div className="relative h-48">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="mt-1">
                  {item.description}
                </CardDescription>
              </div>
              <Badge
                variant={item.is_available ? "default" : "secondary"}
                className="ml-2"
              >
                {item.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold">${item.price}</span>
              <Badge variant="outline" className="capitalize">
                {item.category}
              </Badge>
            </div>
            {item.type && item.type.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.type.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
