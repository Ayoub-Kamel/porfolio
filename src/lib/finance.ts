/** Financial maths used by the interactive tools. Pure functions, no UI. */

/* ───────────────────────────── DCF ───────────────────────────── */

export type DcfInputs = {
  /** Last actual revenue, in millions. */
  revenue: number;
  /** Annual revenue growth over the explicit forecast, in percent. */
  growth: number;
  /** EBIT as a percent of revenue. */
  ebitMargin: number;
  /** Effective tax rate, in percent. */
  taxRate: number;
  /** Capital expenditure as a percent of revenue. */
  capexPct: number;
  /** Depreciation & amortisation as a percent of revenue. */
  daPct: number;
  /** Increase in net working capital as a percent of the revenue increase. */
  nwcPct: number;
  /** Length of the explicit forecast, in years. */
  years: number;
  /** Weighted average cost of capital, in percent. */
  wacc: number;
  /** Perpetual growth rate beyond the forecast, in percent. */
  terminalGrowth: number;
  /** Debt less cash, in millions. */
  netDebt: number;
  /** Diluted shares outstanding, in millions. */
  shares: number;
};

export type DcfYear = {
  year: number;
  revenue: number;
  ebit: number;
  nopat: number;
  fcff: number;
  discountFactor: number;
  presentValue: number;
};

export type DcfResult = {
  schedule: DcfYear[];
  pvExplicit: number;
  terminalValue: number;
  pvTerminal: number;
  enterpriseValue: number;
  equityValue: number;
  valuePerShare: number;
  /** Terminal value as a share of enterprise value — the honesty check. */
  terminalShare: number;
  /** Set when the terminal growth rate is not below the discount rate. */
  error?: string;
};

export function runDcf(input: DcfInputs): DcfResult {
  const wacc = input.wacc / 100;
  const g = input.terminalGrowth / 100;
  const growth = input.growth / 100;
  const tax = input.taxRate / 100;

  const schedule: DcfYear[] = [];
  let revenue = input.revenue;
  let pvExplicit = 0;
  let lastFcff = 0;

  for (let t = 1; t <= input.years; t += 1) {
    const previousRevenue = revenue;
    revenue = previousRevenue * (1 + growth);

    const ebit = revenue * (input.ebitMargin / 100);
    const nopat = ebit * (1 - tax);
    const da = revenue * (input.daPct / 100);
    const capex = revenue * (input.capexPct / 100);
    const deltaNwc = (revenue - previousRevenue) * (input.nwcPct / 100);

    const fcff = nopat + da - capex - deltaNwc;
    const discountFactor = 1 / (1 + wacc) ** t;
    const presentValue = fcff * discountFactor;

    pvExplicit += presentValue;
    lastFcff = fcff;

    schedule.push({
      year: t,
      revenue,
      ebit,
      nopat,
      fcff,
      discountFactor,
      presentValue,
    });
  }

  // Gordon growth is undefined once g meets or exceeds the discount rate.
  // Return the explicit-period value rather than a meaningless negative number.
  if (g >= wacc) {
    return {
      schedule,
      pvExplicit,
      terminalValue: 0,
      pvTerminal: 0,
      enterpriseValue: pvExplicit,
      equityValue: pvExplicit - input.netDebt,
      valuePerShare: (pvExplicit - input.netDebt) / input.shares,
      terminalShare: 0,
      error:
        "Terminal growth must be below the WACC — a perpetuity growing at or above its discount rate has no finite value.",
    };
  }

  const terminalValue = (lastFcff * (1 + g)) / (wacc - g);
  const pvTerminal = terminalValue / (1 + wacc) ** input.years;

  const enterpriseValue = pvExplicit + pvTerminal;
  const equityValue = enterpriseValue - input.netDebt;

  return {
    schedule,
    pvExplicit,
    terminalValue,
    pvTerminal,
    enterpriseValue,
    equityValue,
    valuePerShare: equityValue / input.shares,
    terminalShare: pvTerminal / enterpriseValue,
  };
}

/** Value per share across a grid of WACC (rows) and terminal growth (columns). */
export function dcfSensitivity(
  input: DcfInputs,
  waccSteps: number[],
  growthSteps: number[]
) {
  return waccSteps.map((wacc) =>
    growthSteps.map((terminalGrowth) => {
      const result = runDcf({ ...input, wacc, terminalGrowth });
      return result.error ? null : result.valuePerShare;
    })
  );
}

/* ──────────────────────── Options pricing ──────────────────────── */

/** Standard normal PDF. */
function pdf(x: number) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Standard normal CDF via Abramowitz & Stegun 26.2.17 — accurate to ~7.5e-8,
 * which is well inside anything a pricing screen needs.
 */
export function cdf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.SQRT2;

  const t = 1 / (1 + 0.3275911 * z);
  const erf =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-z * z);

  return 0.5 * (1 + sign * erf);
}

export type OptionInputs = {
  /** Spot price. */
  spot: number;
  /** Strike price. */
  strike: number;
  /** Time to expiry, in years. */
  time: number;
  /** Risk-free rate, in percent. */
  rate: number;
  /** Annualised volatility, in percent. */
  volatility: number;
  type: "call" | "put";
};

export type OptionResult = {
  price: number;
  delta: number;
  gamma: number;
  /** Per one percentage point change in volatility. */
  vega: number;
  /** Per calendar day. */
  theta: number;
  /** Per one percentage point change in rates. */
  rho: number;
  d1: number;
  d2: number;
  intrinsic: number;
  timeValue: number;
};

export function blackScholes(input: OptionInputs): OptionResult {
  const { spot: S, strike: K, type } = input;
  const T = Math.max(input.time, 1e-9);
  const r = input.rate / 100;
  const v = Math.max(input.volatility / 100, 1e-9);

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * v * v) * T) / (v * sqrtT);
  const d2 = d1 - v * sqrtT;

  const discount = Math.exp(-r * T);
  const isCall = type === "call";

  const price = isCall
    ? S * cdf(d1) - K * discount * cdf(d2)
    : K * discount * cdf(-d2) - S * cdf(-d1);

  const delta = isCall ? cdf(d1) : cdf(d1) - 1;
  const gamma = pdf(d1) / (S * v * sqrtT);
  const vega = (S * pdf(d1) * sqrtT) / 100;

  const thetaCore = -(S * pdf(d1) * v) / (2 * sqrtT);
  const theta = isCall
    ? (thetaCore - r * K * discount * cdf(d2)) / 365
    : (thetaCore + r * K * discount * cdf(-d2)) / 365;

  const rho = isCall
    ? (K * T * discount * cdf(d2)) / 100
    : (-K * T * discount * cdf(-d2)) / 100;

  const intrinsic = Math.max(isCall ? S - K : K - S, 0);

  return {
    price,
    delta,
    gamma,
    vega,
    theta,
    rho,
    d1,
    d2,
    intrinsic,
    timeValue: price - intrinsic,
  };
}

/**
 * Cox-Ross-Rubinstein binomial price. European prices should converge on
 * Black-Scholes; American puts will sit above it where early exercise pays.
 */
export function binomial(
  input: OptionInputs,
  steps = 200,
  american = false
): number {
  const { spot: S, strike: K, type } = input;
  const T = Math.max(input.time, 1e-9);
  const r = input.rate / 100;
  const v = Math.max(input.volatility / 100, 1e-9);

  const dt = T / steps;
  const u = Math.exp(v * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);
  const discount = Math.exp(-r * dt);
  const isCall = type === "call";

  const values = new Array<number>(steps + 1);
  for (let i = 0; i <= steps; i += 1) {
    const price = S * u ** i * d ** (steps - i);
    values[i] = Math.max(isCall ? price - K : K - price, 0);
  }

  for (let step = steps - 1; step >= 0; step -= 1) {
    for (let i = 0; i <= step; i += 1) {
      values[i] = discount * (p * values[i + 1] + (1 - p) * values[i]);
      if (american) {
        const price = S * u ** i * d ** (step - i);
        values[i] = Math.max(
          values[i],
          Math.max(isCall ? price - K : K - price, 0)
        );
      }
    }
  }

  return values[0];
}

/**
 * Implied volatility by Newton-Raphson on vega, with a bisection fallback for
 * the deep in- and out-of-the-money cases where vega collapses toward zero.
 */
export function impliedVolatility(
  input: Omit<OptionInputs, "volatility">,
  marketPrice: number
): number | null {
  const tolerance = 1e-8;
  let v = 25;

  for (let i = 0; i < 60; i += 1) {
    const result = blackScholes({ ...input, volatility: v });
    const diff = result.price - marketPrice;
    if (Math.abs(diff) < tolerance) return v;

    const vegaPerPoint = result.vega * 100;
    if (!Number.isFinite(vegaPerPoint) || Math.abs(vegaPerPoint) < 1e-8) break;

    const next = v - (diff / vegaPerPoint) * 100;
    if (!Number.isFinite(next) || next <= 0 || next > 1000) break;
    v = next;
  }

  let low = 0.01;
  let high = 1000;
  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    const price = blackScholes({ ...input, volatility: mid }).price;
    if (Math.abs(price - marketPrice) < tolerance) return mid;
    if (price > marketPrice) high = mid;
    else low = mid;
  }

  const final = (low + high) / 2;
  const check = blackScholes({ ...input, volatility: final }).price;
  return Math.abs(check - marketPrice) < 1e-3 ? final : null;
}

/* ──────────────────────────── Formatting ──────────────────────────── */

export function formatCurrency(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercent(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}
