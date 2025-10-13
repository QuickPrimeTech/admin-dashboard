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
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  // Split path into segments
  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");

    // Make last segment the page
    const isLast = idx === segments.length - 1;

    // Capitalize first letter and replace dashes with spaces
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return isLast ? (
      <BreadcrumbItem key={href}>
        <BreadcrumbPage>{label}</BreadcrumbPage>
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={href}>
        <BreadcrumbLink asChild>
          <Link href={href}>{label}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  });

  // Optionally add ellipsis if too many items
  const MAX_VISIBLE = 5;
  const shouldEllipsis = breadcrumbs.length > MAX_VISIBLE;
  const visibleBreadcrumbs = shouldEllipsis
    ? [
        breadcrumbs[0],
        <BreadcrumbItem key="ellipsis">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {breadcrumbs.slice(1, -1).map((item, i) => (
                <DropdownMenuItem key={i}>
                  {item.props.children.props.children}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>,
        breadcrumbs[breadcrumbs.length - 1],
      ]
    : breadcrumbs;

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        <span>Back</span>
      </Button>

      <Breadcrumb>
        <BreadcrumbList>
          {visibleBreadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {crumb}
              {i < visibleBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
