"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";

export default function ConnectionStatus() {
  const isMutating = useIsMutating(); // Active mutations count
  const queryClient = useQueryClient();
  const isWatching = useRef(false);

  useEffect(() => {
    // Start watching for connection changes only when a mutation is happening
    if (isMutating > 0 && !isWatching.current) {
      isWatching.current = true;

      const handleOffline = () => {
        toast.loading("You’re offline. Trying to reconnect...", {
          id: "connection-toast",
          duration: Infinity,
        });
      };

      const handleOnline = () => {
        toast.success("Connection restored", {
          id: "connection-toast",
        });

        // Re-fetch after reconnection
        queryClient.invalidateQueries();

        // Dismiss the toast after 2 seconds
        setTimeout(() => toast.dismiss("connection-toast"), 2000);
      };

      // Add listeners
      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);

      // If user is already offline when mutation starts
      if (!navigator.onLine) handleOffline();

      // Cleanup
      return () => {
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("online", handleOnline);
        isWatching.current = false;
        toast.dismiss("connection-toast");
      };
    }
  }, [isMutating, queryClient]);

  return null;
}
