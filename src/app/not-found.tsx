"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { Button } from "@ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/empty";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const isOldAdminPath = pathname === "/admin";

  return (
    <div className="h-[100vh] flex justify-center items-center px-4">
      <Empty className="border border-border max-w-lg">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleX className="text-destructive h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            {isOldAdminPath ? (
              <>
                We recently moved the admin dashboard from <code>/admin</code>{" "}
                to <code>/dashboard</code>. You can access all your tools and
                data there.
              </>
            ) : (
              <>
                The page you&apos;re looking for might have been moved, renamed,
                or never existed. Try going back or head to your dashboard.
              </>
            )}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard">
                <ChevronLeft />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
