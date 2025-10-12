"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRightIcon, ChevronLeft, CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-[100vh] flex justify-center items-center px-4">
      <Empty className="border border-border max-w-lg">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleX className="text-destructive h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>This page doesn't exist</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
