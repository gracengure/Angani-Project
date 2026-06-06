"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CurrentConditions from "@/components/CurrentConditions";
import HourlyChart from "@/components/HourlyChart";
import SevenDayForecast from "@/components/SevenDayForecast";
import Footer from "@/components/Footer";
import { getCityWeather } from "@/lib/weather";
import type { CityWeather } from "@/types/weather";
import type { TempUnit } from "@/lib/utils";

export default function AnganiApp() {
  const [cityId, setCityId] = useState("nairobi");
  const [unit, setUnit] = useState<TempUnit>("C");
  const [eatTime, setEatTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCityWeather(id, unit);
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(cityId);
  }, [cityId, unit]);

  useEffect(() => {
    const timer = setInterval(() => setEatTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleCityChange(id: string) {
    setCityId(id);
  }

  function handleUnitToggle() {
    setUnit((u) => (u === "C" ? "F" : "C"));
  }

  if (error) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">Error: {error}</div>;
  }

  if (loading || !weather) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center text-white">Loading weather...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          cityId={cityId}
          unit={unit}
          eatTime={eatTime}
          lastUpdated={lastUpdated}
          onCityChange={handleCityChange}
          onUnitToggle={handleUnitToggle}
        />

        <main className="mt-8 space-y-6">
          <CurrentConditions weather={weather} unit={unit} />
          <HourlyChart hourly={weather.hourly} unit={unit} />
          <SevenDayForecast daily={weather.daily} unit={unit} />
        </main>

        <Footer />
      </div>
    </div>
  );
}