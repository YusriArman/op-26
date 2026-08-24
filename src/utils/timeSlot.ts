function formatTime(time: string | null): string | null {
  if (!time) return null;

  // time comes back as "HH:MM:SS" from Postgres
  const [hoursStr, minutesStr] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ?? "00";

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${minutes} ${period}`;
}

export function buildTimeSlotLabel(
  startTime: string | null,
  endTime: string | null
): string | null {
  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (!start || !end) return null;

  return `${start} – ${end}`;
}