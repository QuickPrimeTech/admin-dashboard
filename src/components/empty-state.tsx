"use client";

import { Card, CardContent } from "@ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.HTMLAttributes<HTMLDivElement>;

export function EmptyState({ className, children, ...props }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)} {...props}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

export function EmptyStateTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function EmptyStateDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

export function EmptyStateAction({ className, ...props }: EmptyStateProps) {
  return <div className={cn("mt-4", className)} {...props} />;
}
