/** CV content: roles, education, credentials, and skill groups. */

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
};

export const roles: Role[] = [
  {
    company: "Independent",
    title: "Financial Analyst & Modelling Consultant",
    period: "2023 — Present",
    location: "Casablanca",
    summary:
      "Valuation, risk, and capital-structure work for mid-market companies and the funds that look at them.",
    highlights: [
      "Built valuation models for acquisition and fundraising processes across industrials, retail, and financial services.",
      "Designed a credit scorecard now used in live SME underwriting, replacing a fully discretionary process.",
      "Turned recurring analyses into reusable internal tools, cutting model build time on new mandates substantially.",
    ],
  },
  {
    company: "Investment Firm",
    title: "Financial Analyst",
    period: "2021 — 2023",
    location: "Casablanca",
    summary:
      "Equity research and portfolio analytics across listed Moroccan and regional names.",
    highlights: [
      "Maintained coverage models for a portfolio of listed equities, including quarterly earnings updates and thesis reviews.",
      "Ran portfolio-level risk reporting: exposure, concentration, and drawdown attribution for the investment committee.",
      "Introduced scenario analysis to the investment memo format, replacing single-point price targets with explicit ranges.",
    ],
  },
  {
    company: "Corporate Finance",
    title: "Analyst",
    period: "2019 — 2021",
    location: "Casablanca",
    summary:
      "Transaction support: financial due diligence, three-statement modelling, and deal documentation.",
    highlights: [
      "Supported buy-side and sell-side processes from teaser through to closing.",
      "Built and maintained integrated three-statement models used in negotiation.",
      "Prepared the financial sections of information memoranda and management presentations.",
    ],
  },
];

export type Credential = {
  title: string;
  issuer: string;
  period: string;
  note?: string;
};

export const education: Credential[] = [
  {
    title: "Master's, Finance",
    issuer: "University Hassan II, Casablanca",
    period: "2017 — 2019",
    note: "Corporate finance, financial markets, quantitative methods.",
  },
  {
    title: "Bachelor's, Economics & Management",
    issuer: "University Hassan II, Casablanca",
    period: "2014 — 2017",
  },
];

export const certifications: Credential[] = [
  { title: "CFA Program", issuer: "CFA Institute", period: "Candidate" },
  { title: "Financial Modelling & Valuation", issuer: "Professional certification", period: "2022" },
  { title: "Python for Finance", issuer: "Professional certification", period: "2022" },
];

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    group: "Valuation & Corporate Finance",
    items: [
      "Discounted cash flow",
      "Comparable companies & precedents",
      "LBO modelling",
      "Three-statement modelling",
      "Capital structure & WACC",
      "M&A accretion / dilution",
    ],
  },
  {
    group: "Risk & Quantitative",
    items: [
      "Credit scoring (PD / LGD / EAD)",
      "Value at Risk & expected shortfall",
      "Monte Carlo simulation",
      "Time series & volatility modelling",
      "Stress testing & scenario design",
      "Basel III framework",
    ],
  },
  {
    group: "Markets & Portfolio",
    items: [
      "Mean-variance optimisation",
      "Performance & risk attribution",
      "Fixed income analytics",
      "Options pricing & Greeks",
      "FX and rate hedging",
    ],
  },
  {
    group: "Tooling",
    items: [
      "Excel / VBA",
      "Python (pandas, NumPy, statsmodels)",
      "SQL",
      "Power BI",
      "TypeScript & React",
      "Bloomberg / Refinitiv",
    ],
  },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Fluent" },
  { name: "English", level: "Professional" },
] as const;
