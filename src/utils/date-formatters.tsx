export function formatTime12Hour(dateString: string) {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12; // handle midnight/noon

  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short", // Jan, Feb, Mar...
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options); // en-GB gives day first
}
