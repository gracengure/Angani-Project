export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy" | "partly-cloudy";

export interface CityWeather {
  id: string;
  name: string;
  country: string;
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  hour: number;
  temperature: number;
  rainProbability: number;
  condition: WeatherCondition;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainProbability: number;
  emoji: string;
}




