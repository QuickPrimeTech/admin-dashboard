"use client";
import { useState, useMemo } from "react";
import {
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  parseISO,
} from "date-fns";
import type { ReservationStatus } from "@/types/reservations";
import { useReservationsQuery } from "@/hooks/use-reservations";
import { useBranch } from "@/components/providers/branch-provider";
import { StatsCards } from "@/sections/reservations/stats-card";
import { FilterBar } from "@/sections/reservations/filter-bar";
import { ReservationsTable } from "@/sections/reservations/reservation-table";

const Index = () => {
  const { branchId } = useBranch();
  const { data: reservations, isPending } = useReservationsQuery(branchId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all",
  );
  const [dateFilter, setDateFilter] = useState("all");

  const filteredReservations = useMemo(() => {
    return reservations
      ? reservations.filter((reservation) => {
          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
              reservation.name.toLowerCase().includes(query) ||
              reservation.email.toLowerCase().includes(query) ||
              reservation.phone.includes(query);
            if (!matchesSearch) return false;
          }

          // Status filter
          if (statusFilter !== "all" && reservation.status !== statusFilter) {
            return false;
          }

          // Date filter
          if (dateFilter !== "all") {
            const reservationDate = parseISO(reservation.date);
            switch (dateFilter) {
              case "today":
                if (!isToday(reservationDate)) return false;
                break;
              case "tomorrow":
                if (!isTomorrow(reservationDate)) return false;
                break;
              case "week":
                if (!isThisWeek(reservationDate)) return false;
                break;
              case "month":
                if (!isThisMonth(reservationDate)) return false;
                break;
            }
          }

          return true;
        })
      : [];
  }, [reservations, searchQuery, statusFilter, dateFilter]);

  if (!reservations) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                Reservations
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Stats */}
        <StatsCards reservations={reservations} />

        {/* Filters */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReservations.length} of {reservations.length}{" "}
            reservations
          </p>
        </div>

        {/* Table */}
        <ReservationsTable reservations={filteredReservations} />
      </main>
    </div>
  );
};

export default Index;
