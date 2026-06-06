"use client";

import type { DailyForecast } from "@/lib/weather";
import { formatTemp, type TempUnit } from "@/lib/utils";

interface SevenDayForecastProps {
  daily: DailyForecast[];
  unit: TempUnit;
}

export default function SevenDayForecast({ daily, unit }: SevenDayForecastProps) {
  const allHighs = daily.map((d) => d.high);
  const allLows = daily.map((d) => d.low);
  const globalMin = Math.min(...allLows) - 1;
  const globalMax = Math.max(...allHighs) + 1;
  const globalRange = globalMax - globalMin || 1;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">7-Day Forecast</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {daily.map((day, i) => {
          const isToday = i === 0;
          const lowPct = ((day.low - globalMin) / globalRange) * 100;
          const highPct = ((day.high - globalMin) / globalRange) * 100;

          return (
            <div
              key={day.date}
              className={`flex flex-col rounded-2xl border p-4 transition ${
                isToday
                  ? "border-sky-400/50 bg-sky-500/15 shadow-[0_0_24px_rgba(56,189,248,0.25)]"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <p className={`text-sm font-medium ${isToday ? "text-sky-200" : "text-sky-200/70"}`}>
                {day.dayName}
              </p>
              <p className="mt-2 text-3xl" aria-hidden>
                {day.emoji}
              </p>
              <div className="mt-3 flex items-baseline justify-between text-sm">
                <span className="font-semibold text-white">{formatTemp(day.high, unit)}</span>
                <span className="text-sky-200/60">{formatTemp(day.low, unit)}</span>
              </div>

              {/* Thermometer strip */}
              <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-500 to-amber-400"
                  style={{
                    left: `${lowPct}%`,
                    width: `${Math.max(highPct - lowPct, 8)}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-sky-200/60">
                💧 {day.rainProbability}% rain
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
