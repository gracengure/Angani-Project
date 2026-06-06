import  {WeatherCondition ,CityWeather } from "@/types/weather"
import { cities } from "@/types/cities";
const conditionMap: Record<string, WeatherCondition> = {
  clear: "sunny",
  sunny: "sunny",
  "partly cloudy": "partly-cloudy",
  cloudy: "cloudy",
  overcast: "cloudy",
  rain: "rainy",
  "light rain": "rainy",
  "heavy rain": "rainy",
  thunderstorm: "stormy",
  storm: "stormy",
};

function mapCondition(apiCondition: string): WeatherCondition {
  const lower = (apiCondition || "").toLowerCase();
  for (const [key, value] of Object.entries(conditionMap)) {
    if (lower.includes(key)) return value;
  }
  return "partly-cloudy";
}

function getEmoji(condition: WeatherCondition): string {
  return {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    stormy: "⛈️",
    "partly-cloudy": "⛅",
  }[condition];
}

export default function mapToCityWeather(data: any, cityId: string): CityWeather {
  const cityMeta = cities.find(c => c.id === cityId)!;
  const current = data.current || data;
  const dailyData = data.daily || [];
  const hourlyData = data.hourly || [];

  const condition = mapCondition(current.condition || "");

  return {
    id: cityId,
    name: cityMeta.name,
    country: cityMeta.country,
    condition,
    temperature: Math.round(current.temp ?? current.temperature ?? 24),
    humidity: Math.round(current.humidity ?? 60),
    windSpeed: Math.round(current.wind_speed ?? current.windSpeed ?? 12),
    uvIndex: Math.round(current.uv_index ?? current.uv ?? 6),
    visibility: Math.round((current.visibility ?? 10000) / 1000),
  
    hourly: hourlyData.slice(0, 24).map((h: any, i: number) => ({
      hour: i,
      temperature: Math.round(h.temp ?? h.temperature ?? 24),
      rainProbability: Math.round(h.rain_probability ?? h.pop ?? 20),
      condition: mapCondition(h.condition || ""),
    })),
    daily: dailyData.slice(0, 7).map((d: any, i: number) => {
      const date = new Date(Date.now() + i * 86400000);
      const cond = mapCondition(d.condition || "");
      return {
        date: date.toISOString().split("T")[0],
        dayName: i === 0 ? "Today" : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()],
        condition: cond,
        high: Math.round(d.high ?? d.temp_max ?? 28),
        low: Math.round(d.low ?? d.temp_min ?? 18),
        rainProbability: Math.round(d.rain_probability ?? d.pop ?? 25),
        emoji: getEmoji(cond),
      };
    }),
  };
}