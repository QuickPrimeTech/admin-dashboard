"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { PlusCircle, Plus } from "lucide-react";

export function AddBranchCard({ ...props }) {
  return (
    <>
      <Card className="border-border shadow-md hover:cursor-pointer" {...props}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="size-5 text-primary" />
            Add Branch
          </CardTitle>
          <CardDescription className="text-start">
            Start creating branches and managing your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full hover:cursor-pointer" size="sm">
            <Plus />
            Add Branch
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
