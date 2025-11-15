import { cn } from "@/lib/utils";
import { Loader, LucideProps } from "lucide-react";

export function Spinner({ className, ...props }: React.ComponentProps<"svg"> & LucideProps) {
  return (
    <Loader
      role="status"
      aria-label="loading"
      className={cn("animate-spin size-4", className)}
      {...props}
    />
  );
}
