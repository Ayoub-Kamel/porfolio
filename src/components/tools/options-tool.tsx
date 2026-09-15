"use client";

import * as React from "react";

import { Field, Stat, ToolShell } from "@/components/tools/controls";
import {
  binomial,
  blackScholes,
  impliedVolatility,
  formatCurrency,
  type OptionInputs,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

const defaults: OptionInputs = {
  spot: 100,
  strike: 100,
  time: 0.5,
  rate: 3,
  volatility: 25,
  type: "call",
};

export function OptionsTool() {
  const [input, setInput] = React.useState<OptionInputs>(defaults);
  const [marketPrice, setMarketPrice] = React.useState(8);

  const set = <K extends keyof OptionInputs>(key: K) => (value: OptionInputs[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const bs = React.useMemo(() => blackScholes(input), [input]);
  const european = React.useMemo(() => binomial(input, 300, false), [input]);
  const american = React.useMemo(() => binomial(input, 300, true), [input]);
  const iv = React.useMemo(() => {
    const { volatility: _volatility, ...rest } = input;
    return impliedVolatility(rest, marketPrice);
  }, [input, marketPrice]);

  const moneyness =
    input.spot > input.strike
      ? input.type === "call"
        ? "In the money"
        : "Out of the money"
      : input.spot < input.strike
        ? input.type === "call"
          ? "Out of the money"
          : "In the money"
        : "At the money";

  return (
    <ToolShell
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            {(["call", "put"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type")(t)}
                className={cn(
                  "rounded-md border py-2 text-sm capitalize transition-colors",
                  input.type === t
                    ? "border-foreground/25 bg-secondary font-medium"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <Field label="Spot" value={input.spot} onChange={set("spot")} min={1} max={500} step={1} />
          <Field label="Strike" value={input.strike} onChange={set("strike")} min={1} max={500} step={1} />
          <Field label="Time to expiry" value={input.time} onChange={set("time")} min={0.01} max={3} step={0.01} suffix="y" />
          <Field label="Risk-free rate" value={input.rate} onChange={set("rate")} min={0} max={15} step={0.25} suffix="%" />
          <Field label="Volatility" value={input.volatility} onChange={set("volatility")} min={1} max={150} step={1} suffix="%" />

          <div className="rule" />

          <Field label="Market price" value={marketPrice} onChange={setMarketPrice} min={0.01} max={300} step={0.01} hint="Used to solve for implied volatility" />

          <button
            type="button"
            onClick={() => {
              setInput(defaults);
              setMarketPrice(8);
            }}
            className="w-full rounded-md border py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Reset assumptions
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Option price" value={formatCurrency(bs.price, 3)} emphasis note={moneyness} />
        <Stat label="Intrinsic" value={formatCurrency(bs.intrinsic, 3)} />
        <Stat label="Time value" value={formatCurrency(bs.timeValue, 3)} />
        <Stat
          label="Implied volatility"
          value={iv === null ? "No solution" : `${iv.toFixed(2)}%`}
          note={iv === null ? "Price is outside the no-arbitrage bounds" : "From the market price"}
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <p className="eyebrow">Greeks</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Computed analytically, not by finite difference.
          </p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {(
              [
                ["Delta", bs.delta.toFixed(4), "Change in price per 1.00 move in spot"],
                ["Gamma", bs.gamma.toFixed(4), "Change in delta per 1.00 move in spot"],
                ["Vega", bs.vega.toFixed(4), "Per one percentage point of volatility"],
                ["Theta", bs.theta.toFixed(4), "Per calendar day"],
                ["Rho", bs.rho.toFixed(4), "Per one percentage point of rates"],
              ] as const
            ).map(([label, value, note], i, rows) => (
              <tr key={label} className={cn(i < rows.length - 1 && "border-b")}>
                <td className="px-6 py-3 font-medium whitespace-nowrap">{label}</td>
                <td className="tnum px-4 py-3 text-right font-mono">{value}</td>
                <td className="hidden px-6 py-3 text-right text-xs text-muted-foreground sm:table-cell">
                  {note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <p className="eyebrow">Model cross-check</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A 300-step Cox-Ross-Rubinstein tree against the closed form. The European
            prices should agree; any gap on the American side is the early-exercise premium.
          </p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-3">Black-Scholes (European)</td>
              <td className="tnum px-6 py-3 text-right font-mono">{formatCurrency(bs.price, 4)}</td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">Binomial (European)</td>
              <td className="tnum px-6 py-3 text-right font-mono">{formatCurrency(european, 4)}</td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-3">Binomial (American)</td>
              <td className="tnum px-6 py-3 text-right font-mono">{formatCurrency(american, 4)}</td>
            </tr>
            <tr>
              <td className="px-6 py-3 text-muted-foreground">Early-exercise premium</td>
              <td className="tnum px-6 py-3 text-right font-mono text-muted-foreground">
                {formatCurrency(american - european, 4)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}
