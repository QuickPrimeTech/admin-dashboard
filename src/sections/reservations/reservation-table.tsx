import { useState } from "react";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { ReservationDetailsSheet } from "./reservation-detail-sheet";
import type { Reservation } from "@/types/reservations";

interface ReservationsTableProps {
  reservations: Reservation[];
}

type SortField = "date" | "time" | "name" | "guests" | "status";
type SortDirection = "asc" | "desc";

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "date":
        comparison =
          a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
        break;
      case "time":
        comparison = a.time.localeCompare(b.time);
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "guests":
        comparison = a.guests - b.guests;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleRowClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("time")}
              >
                <div className="flex items-center gap-1">
                  Time
                  <SortIcon field="time" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Guest
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-center whitespace-nowrap"
                onClick={() => handleSort("guests")}
              >
                <div className="flex items-center justify-center gap-1">
                  Party
                  <SortIcon field="guests" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              sortedReservations.map((reservation, index) => (
                <TableRow
                  key={reservation.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    reservation.status === "cancelled" && "opacity-60",
                  )}
                  onClick={() => handleRowClick(reservation)}
                >
                  <TableCell className="text-center text-muted-foreground font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">
                      {formatDate(reservation.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(reservation.date), "EEEE")}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatTime(reservation.time)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">{reservation.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {reservation.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {reservation.guests}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <StatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="h-8 px-3 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(reservation);
                      }}
                    >
                      Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ReservationDetailsSheet
        reservation={selectedReservation}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
