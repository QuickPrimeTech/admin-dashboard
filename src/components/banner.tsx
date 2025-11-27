"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, Link2, Plus } from "lucide-react";
import { useRestaurantQuery } from "@/hooks/use-restaurant";

export function Banner({ className }: { className?: string }) {
  const { data: restaurant, isPending } = useRestaurantQuery();
  const [visible, setVisible] = useState(true);

  if (!visible || isPending || restaurant?.website) return null;

  return (
    <div
      className={`mb-6 rounded-lg p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100 flex items-start gap-3 ${
        className ?? ""
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="shrink-0">
        <div className="rounded-md bg-amber-100 dark:bg-amber-900 p-2">
          <Link2 className="h-4 w-4" />
        </div>
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">Website not configured</p>
        <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-100">
          Your dashboard will not push instant updates to your website until you
          add your site URL. This is optional but recommended for immediate
          publishing.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" asChild className="h-7 text-xs">
            <Link href="/dashboard/profile" className="inline-block">
              <Plus className="h-3 w-3" /> Add website
            </Link>
          </Button>
        </div>
      </div>

      {/* Dismiss */}
      <Button
        size={"icon-sm"}
        variant={"ghost"}
        className="h-6 w-6"
        onClick={() => setVisible(() => false)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
