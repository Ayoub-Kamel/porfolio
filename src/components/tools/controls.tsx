"use client";

import { cn } from "@/lib/utils";

/** Labelled slider + numeric entry. The two stay in sync. */
export function Field({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  hint,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: string;
  className?: string;
}) {
  const id = `field-${label.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-muted-foreground">
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            id={id}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) onChange(next);
            }}
            className="tnum w-20 rounded-md border bg-background px-2 py-1 text-right text-sm tabular-nums focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          {suffix && (
            <span className="w-4 font-mono text-xs text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <input
        type="range"
        aria-label={`${label} slider`}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--gold)]"
      />

      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

/** A single headline figure. */
export function Stat({
  label,
  value,
  emphasis,
  note,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  note?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        emphasis && "border-gold/40 bg-gold-soft/25"
      )}
    >
      <p className="eyebrow">{label}</p>
      <p
        className={cn(
          "tnum mt-2 font-serif tracking-tight",
          emphasis ? "text-3xl" : "text-2xl"
        )}
      >
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function ToolShell({
  controls,
  children,
}: {
  controls: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
      <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-24">
        <p className="eyebrow">Assumptions</p>
        <div className="mt-6 space-y-6">{controls}</div>
      </aside>
      <div className="min-w-0 space-y-8">{children}</div>
    </div>
  );
}
