"use client"; // Required for App Router; omit for Pages Router

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default caching: Data is fresh for 5 minutes
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Refetch when window regains focus (optional)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
