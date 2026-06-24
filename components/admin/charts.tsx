"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GiornoSerie, SettimanaSerie } from "@/lib/admin-stats";

/* Grafici Recharts della dashboard. Componenti client che ricevono dati
   già aggregati lato server. Tema oro/crema su fondo scuro. */

const GOLD = "#c9a961";
const GOLD_BRIGHT = "#e0c079";
const BORDEAUX = "#6b1f2c";
const CREAM = "#f2ead9";
const CREAM_MUTED = "#b8ae9b";
const LINE = "#3a312a";
const ELEVATED = "#1a1612";

type TooltipDatum = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

function DarkTooltip(props: {
  active?: boolean;
  label?: string | number;
  payload?: TooltipDatum[];
}) {
  const { active, label, payload } = props;
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: ELEVATED,
        border: `1px solid ${LINE}`,
        padding: "8px 10px",
        fontFamily: "var(--font-bricolage), sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          color: CREAM_MUTED,
          fontSize: 11,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={String(p.dataKey)}
          style={{ margin: "3px 0 0", color: CREAM, fontSize: 12 }}
        >
          {p.name}:{" "}
          <strong style={{ color: p.color ?? GOLD }}>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

const AXIS_TICK = { fill: CREAM_MUTED, fontSize: 10 } as const;
const CURSOR = { fill: "rgba(201,169,97,0.08)" } as const;

/* Andamento settimanale: barre prenotazioni + linea coperti. */
export function TrendChart({ data }: { data: SettimanaSerie[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={LINE} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={AXIS_TICK}
          stroke={LINE}
          interval="preserveStartEnd"
          tickLine={false}
        />
        <YAxis tick={AXIS_TICK} stroke={LINE} allowDecimals={false} tickLine={false} />
        <Tooltip content={<DarkTooltip />} cursor={CURSOR} />
        <Bar
          dataKey="count"
          name="Prenotazioni"
          fill={GOLD}
          radius={[2, 2, 0, 0]}
          maxBarSize={26}
        />
        <Line
          dataKey="coperti"
          name="Coperti"
          stroke={GOLD_BRIGHT}
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* Ripartizione per stato: donut con percentuale di conferma al centro. */
export function StatusDonut({
  confermate,
  inAttesa,
  rifiutate,
  tassoConferma,
}: {
  confermate: number;
  inAttesa: number;
  rifiutate: number;
  tassoConferma: number;
}) {
  const data = [
    { name: "Confermate", value: confermate, fill: GOLD },
    { name: "In attesa", value: inAttesa, fill: CREAM_MUTED },
    { name: "Rifiutate", value: rifiutate, fill: BORDEAUX },
  ];
  const pct = Math.round(tassoConferma * 100);
  const legend = [
    { label: "Confermate", color: GOLD },
    { label: "In attesa", color: CREAM_MUTED },
    { label: "Rifiutate", color: BORDEAUX },
  ];

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip content={<DarkTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke={ELEVATED}
              strokeWidth={2}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-light text-cream">
            {pct}%
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">
            confermate
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-2 text-xs text-cream-muted">
            <span
              className="inline-block size-2.5"
              style={{ background: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Prenotazioni per giorno della settimana. */
export function WeekdayChart({ data }: { data: GiornoSerie[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={LINE} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} stroke={LINE} tickLine={false} />
        <YAxis tick={AXIS_TICK} stroke={LINE} allowDecimals={false} tickLine={false} />
        <Tooltip content={<DarkTooltip />} cursor={CURSOR} />
        <Bar
          dataKey="count"
          name="Prenotazioni"
          fill={GOLD}
          radius={[2, 2, 0, 0]}
          maxBarSize={38}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
