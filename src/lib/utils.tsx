export type TempUnit = "C" | "F";

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  const value = unit === "C" ? celsius : celsiusToFahrenheit(celsius);
  return `${value}°${unit}`;
}

export function formatEATTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}
