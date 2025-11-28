"use client";
import { Badge, BadgeSkeleton } from "@/components/ui/badge";
import { ReservationStatus } from "@/types/reservations";
import { useBranch } from "@/components/providers/branch-provider";
import { useParams } from "next/navigation";
import { useReservationQuery } from "@/hooks/use-reservations";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationPage() {
  const { branchId } = useBranch();
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data: reservation, isPending } = useReservationQuery(id, branchId);

  const getStatusBadge = (status: ReservationStatus) => {
    const statusConfig = {
      confirmed: {
        label: "Confirmed",
        className: "bg-primary/10 text-primary border-primary/20",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {isPending ? (
            <div className="flex gap-3 items-center">
              <Skeleton className="w-full h-8 max-w-xs" />
              <BadgeSkeleton />
            </div>
          ) : (
            reservation && (
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold flex items-center gap-3">
                {reservation.name}
                <Badge>{reservation.status}</Badge>
              </h1>
            )
          )}

          {/*<p className="text-muted-foreground">
            Reservation on {formatDate(reservation.date)} at{" "}
            {formatTime(reservation.time)} • Table for {reservation.guests}
          </p>
        </div>
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Contact Info */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>Guest&apos;s reachable details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.phone}</span>
              </div>
            </CardContent>
          </Card> */}
          {/* Reservation Details */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reservation Details</CardTitle>
              <CardDescription>Timing and party size</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {formatDate(reservation.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <ClockIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">
                    {formatTime(reservation.time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <UsersIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">
                    {reservation.guests}{" "}
                    {reservation.guests === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
        {/* Guest Notes */}

        {/*{(reservation.dining_preference ||
          reservation.occasion ||
          reservation.requests) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Guest Notes</CardTitle>
              <CardDescription>
                Special considerations for this reservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reservation.dining_preference && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Dining Preference</p>
                    <p className="text-muted-foreground">
                      {reservation.dining_preference}
                    </p>
                  </div>
                </div>
              )}

              {reservation.occasion && (
                <div className="flex items-start gap-3">
                  <PartyPopperIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Occasion</p>
                    <p className="text-muted-foreground">
                      {reservation.occasion}
                    </p>
                  </div>
                </div>
              )}

              {reservation.requests && (
                <div className="flex items-start gap-3">
                  <MessageSquareIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Special Requests</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {reservation.requests}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        {/*<Card className="border-dashed">
          <CardContent>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Branch:</span>{" "}
                {reservation.branch_id}
              </div>
              {reservation.created_at && (
                <div>
                  <span className="font-medium">Time they booked:</span>{" "}
                  {new Date(reservation.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>*/}
      </div>
    </div>
  );
}
