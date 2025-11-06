"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Reservation, ReservationStatus } from "@/types/reservations";

interface ReservationsListProps {
  reservations: Reservation[];
  onUpdateStatus: (id: number, status: ReservationStatus) => void;
  onDelete: (id: number) => void;
}

export function ReservationsList({
  reservations,
  onUpdateStatus,
  onDelete,
}: ReservationsListProps) {
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No reservations found
            </h3>
            <p className="text-muted-foreground">
              No reservations have been made yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{reservation.name}</CardTitle>
                  <CardDescription>
                    Reservation for {reservation.guests}{" "}
                    {reservation.guests === 1 ? "guest" : "guests"}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(reservation.status)}>
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(reservation.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reservation.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reservation.phone}</span>
                </div>
              </div>

              {reservation.requests && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Requests:</strong> {reservation.requests}
                  </p>
                </div>
              )}

              {reservation.dining_preference && (
                <p className="text-sm text-muted-foreground">
                  <strong>Dining Preference:</strong>{" "}
                  {reservation.dining_preference}
                </p>
              )}

              {reservation.occasion && (
                <p className="text-sm text-muted-foreground">
                  <strong>Occasion:</strong> {reservation.occasion}
                </p>
              )}

              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  {reservation.status !== "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(reservation.id, "confirmed")
                      }
                    >
                      Confirm
                    </Button>
                  )}
                  {reservation.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onUpdateStatus(reservation.id, "cancelled")
                      }
                    >
                      Cancel
                    </Button>
                  )}
                  {reservation.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(reservation.id, "pending")}
                    >
                      Mark Pending
                    </Button>
                  )}
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setReservationToDelete(reservation)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!reservationToDelete}
        onOpenChange={() => setReservationToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this reservation?</p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setReservationToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (reservationToDelete) {
                  onDelete(reservationToDelete.id);
                  setReservationToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
