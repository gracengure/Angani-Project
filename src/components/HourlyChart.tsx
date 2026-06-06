"use client";

import { useState } from "react";
import type { HourlyForecast } from "@/lib/weather";
import { formatHour, formatTemp, type TempUnit } from "@/lib/utils";

interface HourlyChartProps {
  hourly: HourlyForecast[];
  unit: TempUnit;
}

const PERIODS = [
  { id: "morning", label: "Morning", hours: [6, 7, 8, 9, 10, 11] },
  { id: "daytime", label: "Daytime", hours: [12, 13, 14, 15, 16, 17] },
  { id: "evening", label: "Evening", hours: [18, 19, 20, 21, 22, 23] },
] as const;

export default function HourlyChart({ hourly, unit }: HourlyChartProps) {
  const [page, setPage] = useState(0);
  const period = PERIODS[page];
  const slice = period.hours.map((h) => hourly[h]);

  const temps = slice.map((h) => (unit === "C" ? h.temperature : Math.round((h.temperature * 9) / 5 + 32)));
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;

  const width = 480;
  const height = 160;
  const padX = 24;
  const padTop = 30;
  const chartH = 80;
  const barH = 40;

  const points = slice.map((h, i) => {
    const x = padX + (i / (slice.length - 1)) * (width - padX * 2);
    const temp = unit === "C" ? h.temperature : Math.round((h.temperature * 9) / 5 + 32);
    const y = padTop + chartH - ((temp - minT) / range) * chartH;
    return { x, y, temp, rain: h.rainProbability, hour: h.hour };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Hourly Forecast</h2>
        <div className="flex items-center gap-2">
          {PERIODS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPage(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === page ? "bg-sky-400 scale-125" : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Show ${p.label} forecast`}
            />
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded-lg px-3 py-1 text-sm text-sky-200 transition hover:bg-white/10 disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-sm font-medium text-sky-100">{period.label}</span>
        <button
          onClick={() => setPage((p) => Math.min(PERIODS.length - 1, p + 1))}
          disabled={page === PERIODS.length - 1}
          className="rounded-lg px-3 py-1 text-sm text-sky-200 transition hover:bg-white/10 disabled:opacity-30"
        >
          →
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height + barH}`} className="w-full min-w-[320px]">
          {/* Rain bars */}
          {points.map((p, i) => {
            const barW = (width - padX * 2) / slice.length - 8;
            const barX = p.x - barW / 2;
            const rainH = (p.rain / 100) * barH;
            return (
              <g key={`rain-${i}`}>
                <rect
                  x={barX}
                  y={height + barH - rainH}
                  width={barW}
                  height={rainH}
                  rx={3}
                  className="fill-sky-500/40"
                />
                <text
                  x={p.x}
                  y={height + barH + 14}
                  textAnchor="middle"
                  className="fill-sky-200/70 text-[9px]"
                >
                  {p.rain}%
                </text>
              </g>
            );
          })}

          {/* Temperature line */}
          <path d={linePath} fill="none" stroke="url(#tempGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots and labels */}
          {points.map((p, i) => (
            <g key={`dot-${i}`}>
              <circle cx={p.x} cy={p.y} r={5} className="fill-sky-400 stroke-white stroke-[2]" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-white text-[10px] font-medium">
                {p.temp}°
              </text>
              <text x={p.x} y={padTop - 8} textAnchor="middle" className="fill-sky-200/80 text-[9px]">
                {formatHour(p.hour)}
              </text>
            </g>
          ))}

          <defs>
            <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-2 flex justify-center gap-6 text-xs text-sky-200/60">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-gradient-to-r from-sky-400 to-amber-400" />
          Temperature
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-sky-500/40" />
          Rain %
        </span>
      </div>
    </section>
  );
}
