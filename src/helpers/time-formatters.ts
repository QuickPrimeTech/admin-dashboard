import {
  differenceInCalendarDays,
  format,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { useEffect, useState } from "react";

export const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
// Friendly time formatting: "Today 2:30 PM", "Yesterday 2:30 PM", "Wednesday 2:30 PM"
export const formatOrderTime = (date: Date) => {
  const time = format(date, "h:mm a");

  if (isToday(date)) return `Today ${time}`;
  if (isYesterday(date)) return `Yesterday ${time}`;
  if (isTomorrow(date)) return `Tomorrow ${time}`;

  const daysDiff = differenceInCalendarDays(new Date(), date);
  if (daysDiff < 7) {
    return `${format(date, "EEEE")} ${time}`; // "Wednesday 2:30 PM"
  }

  return format(date, "MMM d, h:mm a"); // "Jan 15, 2:30 PM"
};

// Due time formatting for today orders
export const formatDueTime = (date: Date) => {
  return `Due by ${format(date, "h:mm a")}`;
};

// Auto-updating time hook
export function useTimeAgo(date: Date) {
  const [timeString, setTimeString] = useState(() => formatOrderTime(date));

  useEffect(() => {
    // Update immediately and then every minute
    setTimeString(formatOrderTime(date));
    const interval = setInterval(() => {
      setTimeString(formatOrderTime(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return timeString;
}
