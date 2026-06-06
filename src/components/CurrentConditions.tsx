"use client";

import type { CityWeather } from "@/types/weather";
import { backgroundGradients } from "@/types/gradient";
import { formatTemp, type TempUnit } from "@/lib/utils";

interface CurrentConditionsProps {
  weather: CityWeather;
  unit: TempUnit;
}

const conditionLabels: Record<CityWeather["condition"], string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  stormy: "Stormy",
  "partly-cloudy": "Partly Cloudy",
};

export default function CurrentConditions({ weather, unit }: CurrentConditionsProps) {
  const gradient = backgroundGradients[weather.condition];

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} p-6 shadow-2xl backdrop-blur-xl sm:p-8`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-sky-200/70">
            {conditionLabels[weather.condition]} · {weather.name}
          </p>
          <div className="mt-2 flex items-start gap-2">
            <span className="text-7xl font-light tabular-nums text-white sm:text-8xl">
              {formatTemp(weather.temperature, unit).replace(`°${unit}`, "")}
            </span>
            <span className="mt-4 text-3xl text-sky-200">°{unit}</span>
          </div>
          
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          {[
            { label: "Humidity", value: `${weather.humidity}%` },
            { label: "Wind", value: `${weather.windSpeed} km/h` },
            { label: "UV Index", value: `${weather.uvIndex}` },
            { label: "Visibility", value: `${weather.visibility} km` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-wide text-sky-200/60">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

     
    </section>
  );
}
