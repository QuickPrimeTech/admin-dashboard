"use client";

import { useState, useEffect, useCallback } from "react";
import { ReservationsFilters } from "@/sections/reservations/reservations-filters";
import { ReservationsList } from "@/sections/reservations/reservations-list";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ReservationStatus } from "@/types/mock-api";
import { supabase } from "@/lib/server/supabase";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  notes?: string;
  created_at: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel("realtime:reservations")
      .on(
        "postgres_changes",
        {
          event: "*", // listen for INSERT, UPDATE, DELETE
          schema: "public",
          table: "reservations",
        },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          setReservations((prev) => {
            switch (eventType) {
              case "INSERT":
                return [newRow as Reservation, ...prev];
              case "UPDATE":
                return prev.map((r) =>
                  r.id === newRow.id ? (newRow as Reservation) : r
                );
              case "DELETE":
                return prev.filter((r) => r.id !== oldRow.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations", { method: "GET" });
      const result = await res.json();

      if (res.ok && result.success) {
        setReservations(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch reservations");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to fetch reservations: ${error.message}`);
      } else {
        toast.error("Failed to fetch reservations");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = useCallback(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status.toLowerCase() === statusFilter
      );
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  useEffect(() => {
    filterReservations();
  }, [filterReservations]);

  const updateReservationStatus = async (
    id: string,
    status: ReservationStatus
  ) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update reservation");
      }

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status } : reservation
        )
      );

      toast.success(`Reservation ${status} successfully`);
    } catch {
      toast.error("Failed to update reservation status");
    }
  };
  const deleteReservation = async (id: string) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete reservation");
      }

      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation deleted successfully");
    } catch {
      toast.error("Failed to delete reservation");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reservations</h1>
        <p className="text-muted-foreground">
          Manage customer reservations and bookings
        </p>
      </div>

      <ReservationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ReservationsList
          reservations={filteredReservations}
          onUpdateStatus={updateReservationStatus}
          onDelete={deleteReservation}
        />
      )}
    </div>
  );
}
