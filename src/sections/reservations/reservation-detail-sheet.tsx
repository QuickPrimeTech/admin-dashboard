import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  Utensils,
  PartyPopper,
  MessageSquare,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./status-badge";
import type { Reservation } from "@/types/reservations";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReservationDetailsSheetProps {
  reservation: Reservation | null;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const diningLabels: Record<string, string> = {
  indoor: "Indoor Seating",
  outdoor: "Outdoor Terrace",
  private: "Private Room",
  bar: "Bar Seating",
};

const occasionLabels: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  date: "Date Night",
  business: "Business Meal",
  celebration: "Celebration",
  other: "Other",
};

export function ReservationDetailsSheet({
  reservation,
  open,
  onOpenChange,
}: ReservationDetailsSheetProps) {
  if (!reservation) return null;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto px-6 py-8">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-serif">
                {reservation.name}
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Reservation #{reservation.id}
              </p>
            </div>
            <StatusBadge status={reservation.status} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(parseISO(reservation.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">{formatTime(reservation.time)}</p>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Party Size</p>
              <p className="font-medium">
                {reservation.guests}{" "}
                {reservation.guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${reservation.email}`}
                  className="text-sm hover:underline"
                >
                  {reservation.email}
                </a>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{reservation.phone}</p>
                </div>
                <Button
                  variant={"success"}
                  size={"sm"}
                  asChild
                  className="rounded-full"
                >
                  <Link
                    href={`tel:${reservation.phone}`}
                    target="noreferrer noopener"
                  >
                    <Phone />
                    Call Customer
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Preferences
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {reservation.dining_preference && (
                <div className="flex items-center gap-2 text-sm">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {diningLabels[reservation.dining_preference] ||
                      reservation.dining_preference}
                  </span>
                </div>
              )}
              {reservation.occasion && (
                <div className="flex items-center gap-2 text-sm">
                  <PartyPopper className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {occasionLabels[reservation.occasion] ||
                      reservation.occasion}
                  </span>
                </div>
              )}
            </div>
          </div>

          {reservation.requests && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Special Requests
                </h4>
                <p className="text-sm bg-secondary/50 rounded-lg p-3">
                  {reservation.requests}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          {reservation.created_at && (
            <p className="text-xs text-muted-foreground pt-4">
              Created on{" "}
              {format(
                parseISO(reservation.created_at),
                "MMM d, yyyy 'at' h:mm a",
              )}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
