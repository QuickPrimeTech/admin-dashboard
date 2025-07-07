"use client";

import { useState, useEffect, useCallback } from "react";
import { ReservationsFilters } from "@/sections/reservations/reservations-filters";
import { ReservationsList } from "@/sections/reservations/reservations-list";
import { mockAPI } from "@/lib/mock-api";
import { toast } from "sonner";
import { ReservationStatus } from "@/types/mock-api";

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
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await mockAPI.getReservations();
      setReservations(data);
    } catch {
      toast.error("Failed to fetch reservations");
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
      await mockAPI.updateReservationStatus(id, status);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Loading reservations...</p>
        </div>
      </div>
    );
  }

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

      <ReservationsList
        reservations={filteredReservations}
        onUpdateStatus={updateReservationStatus}
      />
    </div>
  );
}
