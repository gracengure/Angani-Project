import  {CityWeather } from "@/types/weather";
import { cities } from "@/types/cities";
import { API_BASE, API_KEY } from "@/api/api";
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

  const res = await fetch(`${API_BASE}?${params}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`Failed to fetch weather`);

  const data = await res.json();
  return mapToCityWeather(data, cityId);
}

