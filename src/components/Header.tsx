"use client";

import { cities } from "@/types/cities";
import { formatEATTime, formatLastUpdated, type TempUnit } from "@/lib/utils";

interface HeaderProps {
  cityId: string;
  unit: TempUnit;
  eatTime: Date;
  lastUpdated: Date;
  onCityChange: (id: string) => void;
  onUnitToggle: () => void;
}

export default function Header({
  cityId,
  unit,
  eatTime,
  lastUpdated,
  onCityChange,
  onUnitToggle,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Angani
        </h1>
        <p className="mt-1 text-sm text-sky-200/80">Kenya's weather,at a glance</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur-md">
          <span aria-hidden>📍</span>
          <select
            value={cityId}
            onChange={(e) => onCityChange(e.target.value)}
            className="cursor-pointer bg-transparent text-white outline-none"
            aria-label="Select city"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id} className="bg-slate-900 text-white">
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={onUnitToggle}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          aria-label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
        >
          °{unit === "C" ? "C" : "F"} / °{unit === "C" ? "F" : "C"}
        </button>

        <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-sm text-sky-100 backdrop-blur-md">
          <span className="text-sky-300/70">EAT</span>{" "}
          <span className="tabular-nums">{formatEATTime(eatTime)}</span>
        </div>

        <p className="w-full text-xs text-sky-200/60 sm:w-auto">
          Updated {formatLastUpdated(lastUpdated)}
        </p>
      </div>
    </header>
  );
}
