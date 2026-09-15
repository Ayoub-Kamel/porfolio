/**
 * PROJECTS — the work index.
 *
 * Each project resolves to one of three destinations, set by `kind`:
 *
 *   "case-study" → a detail page on this site, rendered from the fields below
 *                  at /projects/<slug>.
 *   "tool"       → the same detail page, but with an interactive component
 *                  mounted in it. Register the component in
 *                  `src/components/tools/registry.tsx` under `toolKey`.
 *   "external"   → the card links straight out to `externalHref`
 *                  (a live app, a repo, a published note).
 *
 * To add a project: append an entry. Nothing else needs to change.
 */

export type ProjectKind = "case-study" | "tool" | "external";

export type Project = {
  slug: string;
  title: string;
  /** One line on the card. Say what it does, not what it is. */
  summary: string;
  kind: ProjectKind;
  /** Only read when kind === "external". */
  externalHref?: string;
  /** Only read when kind === "tool". Must match a key in the tool registry. */
  toolKey?: string;
  year: string;
  /** Domain label shown on the card, e.g. "Valuation". */
  discipline: string;
  stack: string[];
  /** Pulled to the top of the index page. Keep it to two or three. */
  featured?: boolean;
  status?: "Live" | "In progress" | "Archived";
  /** Detail-page body. Ignored for kind === "external". */
  detail?: {
    context: string;
    approach: string[];
    outcome: string;
    /** Headline numbers on the detail page. */
    results?: { value: string; label: string }[];
    /** Optional secondary links: repo, write-up, live deployment. */
    links?: { label: string; href: string }[];
  };
};

export const projects: Project[] = [
  {
    slug: "dcf-valuation-engine",
    title: "DCF Valuation Engine",
    summary:
      "An interactive discounted cash flow model: set the drivers, watch enterprise value and the sensitivity grid update as you type.",
    kind: "tool",
    toolKey: "dcf",
    year: "2025",
    discipline: "Valuation",
    stack: ["TypeScript", "Financial modelling", "WACC", "Sensitivity analysis"],
    featured: true,
    status: "Live",
    detail: {
      context:
        "Every valuation conversation stalls at the same place: someone asks what happens if the terminal growth rate is fifty basis points lower, and the answer takes twenty minutes and a fresh tab of the spreadsheet. The assumptions are the interesting part, but the spreadsheet makes them expensive to explore.",
      approach: [
        "Model free cash flow to the firm over an explicit forecast horizon, driven by revenue growth, EBIT margin, tax rate, reinvestment, and working capital.",
        "Discount at a WACC assembled from its parts — cost of equity via CAPM, after-tax cost of debt, and the target capital structure — so every input is visible rather than hard-coded.",
        "Terminate with Gordon growth, with a guard that refuses growth rates at or above the discount rate instead of silently returning a negative value.",
        "Render a two-way sensitivity grid across WACC and terminal growth, recomputed on every keystroke, so the range matters more than the point estimate.",
      ],
      outcome:
        "What used to be a twenty-minute detour is now a slider. The output is deliberately a range, not a number — the grid makes the width of the uncertainty the first thing you see.",
      results: [
        { value: "5×5", label: "Live sensitivity grid" },
        { value: "< 1ms", label: "Full revaluation" },
        { value: "0", label: "Hard-coded assumptions" },
      ],
    },
  },
  {
    slug: "portfolio-optimiser",
    title: "Mean-Variance Portfolio Optimiser",
    summary:
      "Markowitz optimisation over a configurable asset set, with an efficient frontier that respects real mandate constraints.",
    kind: "case-study",
    year: "2025",
    discipline: "Portfolio Construction",
    stack: ["Python", "NumPy", "cvxpy", "Modern Portfolio Theory"],
    featured: true,
    status: "In progress",
    detail: {
      context:
        "Textbook mean-variance optimisation produces portfolios no mandate would permit: 80% in one asset, short positions where shorting is prohibited, turnover that eats the alpha it chases. The gap between the theory and an allocation a committee will sign is where the actual work is.",
      approach: [
        "Estimate the covariance matrix with Ledoit-Wolf shrinkage — sample covariance on a short history is noise dressed as precision.",
        "Solve the constrained problem as a convex program: long-only, per-asset caps, sector bounds, and a turnover budget against the existing book.",
        "Trace the efficient frontier under those constraints and compare it against the unconstrained one, so the cost of each restriction is explicit.",
        "Backtest with walk-forward rebalancing and transaction costs, because an optimiser evaluated in-sample is a curve-fitting exercise.",
      ],
      outcome:
        "The deliverable is not the optimal portfolio — it is the picture of what each constraint costs in basis points of expected return. That framing is what makes the conversation with the investment committee productive.",
      results: [
        { value: "Ledoit-Wolf", label: "Covariance estimator" },
        { value: "Walk-forward", label: "Backtest design" },
      ],
    },
  },
  {
    slug: "credit-scorecard",
    title: "SME Credit Risk Scorecard",
    summary:
      "A probability-of-default scorecard for small-business lending, built to be explainable to a credit committee and a regulator.",
    kind: "case-study",
    year: "2024",
    discipline: "Credit Risk",
    stack: ["Python", "Logistic regression", "WOE / IV", "Basel III"],
    featured: true,
    status: "Live",
    detail: {
      context:
        "A lender with a growing SME book was underwriting on relationship judgement alone. That scales badly and defends poorly — when a decision is challenged, 'the manager knew the client' is not a reason anyone can audit.",
      approach: [
        "Bin every candidate variable by weight of evidence and rank by information value, discarding anything that fails a monotonicity check against default rates.",
        "Fit a logistic regression rather than a gradient-boosted ensemble — three points of AUC are not worth a model the credit committee cannot read.",
        "Calibrate scores to a points-to-double-the-odds scale so the output reads as a scorecard, not a probability nobody trusts.",
        "Validate with out-of-time samples, and monitor drift with a population stability index reported quarterly.",
      ],
      outcome:
        "An underwriting decision that takes minutes instead of days, with a documented reason code attached to every rejection — which is what turns a model from a risk into a control.",
      results: [
        { value: "0.78", label: "Out-of-time AUC" },
        { value: "12", label: "Final scorecard variables" },
        { value: "PSI < 0.1", label: "Drift, four quarters running" },
      ],
    },
  },
  {
    slug: "lbo-model",
    title: "Leveraged Buyout Model",
    summary:
      "A full LBO with a debt waterfall, covenant tracking, and returns attribution that separates leverage from operating improvement.",
    kind: "case-study",
    year: "2024",
    discipline: "Corporate Finance",
    stack: ["Excel", "VBA", "Three-statement modelling", "IRR / MOIC"],
    status: "Live",
    detail: {
      context:
        "Sponsors report an IRR. The number rarely says how much of it came from paying down debt, how much from multiple expansion, and how much from actually running the business better. Those three sources have completely different risk profiles.",
      approach: [
        "Build a linked three-statement model with a cash sweep, tranched debt, and PIK toggles.",
        "Track covenant headroom period by period and flag the quarter a breach would occur under each downside case.",
        "Decompose returns into deleveraging, multiple expansion, and EBITDA growth so the underwriting case is legible.",
        "Stress the exit multiple and the entry leverage jointly, since assuming them independently understates the tail.",
      ],
      outcome:
        "A model where the returns bridge is the headline output. If most of the IRR comes from multiple expansion, that is a bet on the market, and the model says so out loud.",
      results: [
        { value: "3-way", label: "Returns attribution" },
        { value: "Quarterly", label: "Covenant headroom" },
      ],
    },
  },
  {
    slug: "options-pricing",
    title: "Options Pricing & Greeks",
    summary:
      "Black-Scholes and binomial pricing side by side, with the full Greek surface and an implied-volatility solver.",
    kind: "tool",
    toolKey: "options",
    year: "2023",
    discipline: "Derivatives",
    stack: ["TypeScript", "Black-Scholes", "Newton-Raphson", "Greeks"],
    status: "Live",
    detail: {
      context:
        "The Greeks are usually taught as formulas to memorise. They are far easier to understand as things that move — watch gamma spike as an option approaches the money near expiry and the hedging problem explains itself.",
      approach: [
        "Implement closed-form Black-Scholes for European calls and puts, with a high-accuracy rational approximation to the normal CDF.",
        "Compute delta, gamma, vega, theta, and rho analytically rather than by finite difference, so the values stay stable at the boundaries.",
        "Solve implied volatility with Newton-Raphson on vega, falling back to bisection where vega collapses deep in or out of the money.",
        "Cross-check every price against a Cox-Ross-Rubinstein binomial tree, which also handles the American early-exercise case.",
      ],
      outcome:
        "A pricing surface you can move through rather than read about — the version of this I wish had existed when I was first learning the material.",
      results: [
        { value: "5", label: "Greeks, analytic" },
        { value: "1e-8", label: "IV solver tolerance" },
      ],
    },
  },
  {
    slug: "masi-market-dashboard",
    title: "MASI Market Dashboard",
    summary:
      "A live view of the Casablanca Stock Exchange — sector breadth, valuation multiples, and rolling correlations.",
    kind: "external",
    externalHref: "https://kamel.ma",
    year: "2023",
    discipline: "Markets",
    stack: ["Python", "Streamlit", "pandas", "Market data"],
    status: "Live",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Projects that render a detail page on this site. */
export const inSiteProjects = projects.filter((p) => p.kind !== "external");
