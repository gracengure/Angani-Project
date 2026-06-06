import  {CityWeather } from "@/types/weather";
import { cities } from "@/types/cities";
import mapToCityWeather from "@/lib/weatherMapping";

export async function getCityWeather(cityId: string, unit: "C" | "F" = "C"): Promise<CityWeather> {
  const city = cities.find(c => c.id === cityId);
  if (!city) throw new Error("City not found");

  const params = new URLSearchParams({
    lat: city.lat.toString(),
    lon: city.lon.toString(),
    days: "7",
    units: unit === "F" ? "imperial" : "metric",
    ai: "true",
  });

  // Call our own proxy instead of the external API directly
  const res = await fetch(`/api/weather?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 900 }, // 15 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.status}`);
  }

  const data = await res.json();
  return mapToCityWeather(data, cityId);
}