"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ui/button";
import { useRouter } from "next/navigation";

const NON_INDEX_SEGMENTS = new Set(["edit"]);

// Define the shape of a breadcrumb item
type BreadcrumbData = {
  href: string;
  label: string;
  isLast: boolean;
  isClickable: boolean;
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb data (not JSX yet)
  const breadcrumbData: BreadcrumbData[] = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    const hasNextSegment = idx < segments.length - 1;

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const isNonIndex =
      NON_INDEX_SEGMENTS.has(segment.toLowerCase()) && hasNextSegment;

    return {
      href,
      label,
      isLast,
      isClickable: !isLast && !isNonIndex,
    };
  });

  const MAX_VISIBLE = 5;
  const shouldEllipsis = breadcrumbData.length > MAX_VISIBLE;

  // Helper to render a single breadcrumb item
  const renderBreadcrumbItem = (item: BreadcrumbData, key: string) => {
    if (item.isLast) {
      return (
        <BreadcrumbItem key={key}>
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    if (!item.isClickable) {
      return (
        <BreadcrumbItem key={key}>
          <span className="text-muted-foreground">{item.label}</span>
        </BreadcrumbItem>
      );
    }

    return (
      <BreadcrumbItem key={key}>
        <BreadcrumbLink asChild>
          <Link href={item.href}>{item.label}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  };

  // Generate visible breadcrumbs
  let visibleItems: BreadcrumbData[] = breadcrumbData;
  let hiddenItems: BreadcrumbData[] = [];

  if (shouldEllipsis) {
    visibleItems = [
      breadcrumbData[0],
      ...breadcrumbData.slice(-1), // Keep first and last
    ];
    hiddenItems = breadcrumbData.slice(1, -1); // Middle items go to dropdown
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        <span>Back</span>
      </Button>

      <Breadcrumb>
        <BreadcrumbList>
          {shouldEllipsis ? (
            <>
              {renderBreadcrumbItem(breadcrumbData[0], "first")}
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {hiddenItems.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        asChild={item.isClickable}
                      >
                        {item.isClickable ? (
                          <Link href={item.href}>{item.label}</Link>
                        ) : (
                          <span className="text-muted-foreground cursor-default">
                            {item.label}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              {renderBreadcrumbItem(
                breadcrumbData[breadcrumbData.length - 1],
                "last",
              )}
            </>
          ) : (
            breadcrumbData.map((item, idx) => (
              <React.Fragment key={item.href}>
                {renderBreadcrumbItem(item, item.href)}
                {idx < breadcrumbData.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
