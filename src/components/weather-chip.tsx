"use client";

import { useEffect, useState } from "react";

export default function WeatherChip({ lat, lon, city }: { lat: number; lon: number; city: string }) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => controller.abort(), 4000);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const cur = d?.current;
        if (!cur) return;
        setLine(`${Math.round(cur.temperature_2m)}°C · ${cur.relative_humidity_2m}% RH in ${city} — good recovery weather`);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(t));
    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, [lat, lon, city]);

  if (!line) return <span className="text-[11px] text-slate">Weather for your dates — checked at booking</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-forest">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-amber" fill="currentColor" aria-hidden><path d="M8 1a5 5 0 0 0-4.9 4A4.5 4.5 0 1 0 8 14.5 4.5 4.5 0 0 0 12.4 9 5 5 0 0 0 8 1Z" opacity="0.9"/></svg>
      {line}
    </span>
  );
}
