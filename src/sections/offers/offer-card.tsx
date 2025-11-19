import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Badge } from "@ui/badge";
import { Clock, Calendar, RefreshCw, Trash2, Pencil } from "lucide-react";
import { Button } from "@ui/button";
import { Offer } from "@/types/offers";
import Image from "next/image";
import { DAYS_OF_WEEK } from "@/constants/offers";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";

export function OfferCard({ offer }: { offer: Offer }) {
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const onEdit = (id: string) => {
    console.log("Edit offer with ID:", id);
  };

  const onDelete = (id: string) => {
    console.log("Delete offer with ID:", id);
  };

  return (
    <Card className="relative py-0 gap-0 group overflow-hidden">
      {/* HEADER TEXT OVER IMAGE */}
      <CardHeader className="px-0 mb-0">
        <div className="relative aspect-3/2 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="px-4 py-4 space-y-2">
          <CardTitle className="drop-shadow-lg">{offer.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {offer.description}
          </CardDescription>
        </div>
      </CardHeader>

      {/* RECURRING BADGE */}
      {offer.is_recurring && (
        <Badge className="absolute top-3 right-3 ">
          <RefreshCw className="size-3" /> Recurring
        </Badge>
      )}

      {/* CONTENT SECTION */}
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* TIME RANGE */}
          <div className="flex gap-2 items-center text-sm">
            <Clock className="size-5" />
            <span className="text-muted-foreground font-medium">
              {formatTime(offer.start_time)} – {formatTime(offer.end_time)}
            </span>
          </div>

          {/* NON-RECURRING DATE RANGE */}
          {!offer.is_recurring && offer.start_date && offer.end_date && (
            <div className="flex gap-2 items-center text-sm">
              <Calendar className="size-5" />
              <span className="text-gray-800">
                {offer.start_date === offer.end_date
                  ? formatDate(offer.start_date)
                  : `${formatDate(offer.start_date)} – ${formatDate(
                      offer.end_date
                    )}`}
              </span>
            </div>
          )}

          {/* RECURRING DAYS */}
          {offer.is_recurring && offer.days_of_week?.length > 0 && (
            <div className="flex gap-2 items-start text-sm">
              <Calendar className="size-5" />
              <div className="flex flex-wrap gap-1">
                {offer.days_of_week.map((day: string, idx: number) => (
                  <Badge key={idx} variant="outline">
                    {DAYS_OF_WEEK[parseInt(day)].label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* <Separator className="mt-4" /> */}
        {/* ACTION BUTTONS */}
        <CardFooter className="flex justify-end bg-muted gap-2 items-center mt-2 p-2 rounded-sm">
          <Button variant="outline" size="sm" aria-label="Edit offer" asChild>
            <Link href={`/offers/edit/${offer.id}`}>
              <Pencil /> Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                size={"sm"}
                aria-label="Delete offer"
              >
                <Trash2 /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Do you want to delete this offer?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will{" "}
                  <strong>permanently</strong> delete this offer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => onDelete(offer.id)}
                >
                  Delete Offer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
