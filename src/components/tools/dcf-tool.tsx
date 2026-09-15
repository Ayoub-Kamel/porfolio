"use client";

import * as React from "react";

import { Field, Stat, ToolShell } from "@/components/tools/controls";
import {
  dcfSensitivity,
  formatCurrency,
  formatPercent,
  runDcf,
  type DcfInputs,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

const defaults: DcfInputs = {
  revenue: 500,
  growth: 8,
  ebitMargin: 18,
  taxRate: 31,
  capexPct: 6,
  daPct: 5,
  nwcPct: 12,
  years: 5,
  wacc: 9.5,
  terminalGrowth: 2.5,
  netDebt: 320,
  shares: 45,
};

export function DcfTool() {
  const [input, setInput] = React.useState<DcfInputs>(defaults);

  const set = <K extends keyof DcfInputs>(key: K) => (value: DcfInputs[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = React.useMemo(() => runDcf(input), [input]);

  // Grid centred on the current assumptions, ±100bp on WACC and ±50bp on g.
  const waccSteps = React.useMemo(
    () => [-1, -0.5, 0, 0.5, 1].map((d) => Number((input.wacc + d).toFixed(2))),
    [input.wacc]
  );
  const growthSteps = React.useMemo(
    () =>
      [-0.5, -0.25, 0, 0.25, 0.5].map((d) =>
        Number((input.terminalGrowth + d).toFixed(2))
      ),
    [input.terminalGrowth]
  );
  const grid = React.useMemo(
    () => dcfSensitivity(input, waccSteps, growthSteps),
    [input, waccSteps, growthSteps]
  );

  return (
    <ToolShell
      controls={
        <>
          <Field label="Revenue (base)" value={input.revenue} onChange={set("revenue")} min={10} max={5000} step={10} suffix="M" />
          <Field label="Revenue growth" value={input.growth} onChange={set("growth")} min={-10} max={40} step={0.5} suffix="%" />
          <Field label="EBIT margin" value={input.ebitMargin} onChange={set("ebitMargin")} min={0} max={60} step={0.5} suffix="%" />
          <Field label="Tax rate" value={input.taxRate} onChange={set("taxRate")} min={0} max={50} step={0.5} suffix="%" />
          <Field label="Capex" value={input.capexPct} onChange={set("capexPct")} min={0} max={30} step={0.5} suffix="%" hint="Percent of revenue" />
          <Field label="D&A" value={input.daPct} onChange={set("daPct")} min={0} max={30} step={0.5} suffix="%" hint="Percent of revenue" />
          <Field label="ΔNWC" value={input.nwcPct} onChange={set("nwcPct")} min={0} max={50} step={1} suffix="%" hint="Percent of the revenue increase" />
          <Field label="Forecast years" value={input.years} onChange={set("years")} min={3} max={10} step={1} suffix="y" />

          <div className="rule" />

          <Field label="WACC" value={input.wacc} onChange={set("wacc")} min={4} max={20} step={0.25} suffix="%" />
          <Field label="Terminal growth" value={input.terminalGrowth} onChange={set("terminalGrowth")} min={0} max={6} step={0.25} suffix="%" />

          <div className="rule" />

          <Field label="Net debt" value={input.netDebt} onChange={set("netDebt")} min={-1000} max={3000} step={10} suffix="M" />
          <Field label="Shares" value={input.shares} onChange={set("shares")} min={1} max={500} step={1} suffix="M" />

          <button
            type="button"
            onClick={() => setInput(defaults)}
            className="w-full rounded-md border py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Reset assumptions
          </button>
        </>
      }
    >
      {result.error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {result.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Value per share"
          value={formatCurrency(result.valuePerShare, 2)}
          emphasis
          note="Equity value ÷ diluted shares"
        />
        <Stat label="Enterprise value" value={`${formatCurrency(result.enterpriseValue, 0)}M`} />
        <Stat label="Equity value" value={`${formatCurrency(result.equityValue, 0)}M`} />
        <Stat
          label="Terminal share of EV"
          value={formatPercent(result.terminalShare, 0)}
          note={result.terminalShare > 0.75 ? "Most of the value sits past the forecast" : undefined}
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <p className="eyebrow">Free cash flow to the firm</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All figures in millions.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground">Year</th>
                {result.schedule.map((row) => (
                  <th key={row.year} className="tnum px-4 py-3 text-right font-mono text-xs font-normal text-muted-foreground">
                    Y{row.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Revenue", (r: (typeof result.schedule)[number]) => r.revenue],
                  ["EBIT", (r: (typeof result.schedule)[number]) => r.ebit],
                  ["NOPAT", (r: (typeof result.schedule)[number]) => r.nopat],
                  ["FCFF", (r: (typeof result.schedule)[number]) => r.fcff],
                  ["PV of FCFF", (r: (typeof result.schedule)[number]) => r.presentValue],
                ] as const
              ).map(([label, pick], i, rows) => (
                <tr key={label} className={cn(i < rows.length - 1 && "border-b", label === "FCFF" && "font-medium")}>
                  <td className="px-6 py-3 whitespace-nowrap">{label}</td>
                  {result.schedule.map((row) => (
                    <td key={row.year} className="tnum px-4 py-3 text-right">
                      {formatCurrency(pick(row), 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <p className="eyebrow">Sensitivity — value per share</p>
          <p className="mt-1 text-xs text-muted-foreground">
            WACC down the side, terminal growth across the top. The centre cell is the case above.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left font-mono text-xs font-normal text-muted-foreground">
                  WACC \ g
                </th>
                {growthSteps.map((g) => (
                  <th key={g} className="tnum px-4 py-3 text-right font-mono text-xs font-normal text-muted-foreground">
                    {g.toFixed(2)}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, i) => (
                <tr key={waccSteps[i]} className={cn(i < grid.length - 1 && "border-b")}>
                  <td className="tnum px-6 py-3 font-mono text-xs text-muted-foreground">
                    {waccSteps[i].toFixed(2)}%
                  </td>
                  {row.map((cell, j) => {
                    const centre = i === 2 && j === 2;
                    return (
                      <td
                        key={j}
                        className={cn(
                          "tnum px-4 py-3 text-right",
                          centre && "bg-gold-soft/40 font-medium"
                        )}
                      >
                        {cell === null ? "—" : formatCurrency(cell, 2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolShell>
  );
}
