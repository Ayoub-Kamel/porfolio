# Portfolio — Ayoub Kamel

A multi-page portfolio site for finance work: valuation, risk, and portfolio
construction, with interactive models that run in the browser.

Built with **Next.js 15** (App Router), **Tailwind CSS v4**, and **shadcn/ui**.
Every page is statically generated — the whole site deploys as static output.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Pages

| Route                | What it is                                                     |
| -------------------- | -------------------------------------------------------------- |
| `/`                  | Hero, approach, featured work, capabilities, roles, CTA         |
| `/projects`          | Work index, filterable by discipline                            |
| `/projects/[slug]`   | Project detail — case study, and an interactive tool if it has one |
| `/about`             | Background, working principles, full toolkit                    |
| `/experience`        | Roles, education, certifications, CV download                   |
| `/contact`           | Engagement types, contact details, disclaimer                   |

## Editing the content

All copy lives in `src/content/`. No component needs to be touched to change
what the site says.

- **`site.ts`** — name, role, tagline, email, location, CV link, nav, socials,
  home-page metrics and intro copy.
- **`projects.ts`** — the work index (see below).
- **`experience.ts`** — roles, education, certifications, skill groups, languages.

Some copy is page-specific and lives at the top of its own page file:
`src/app/about/page.tsx` (the `story` and `principles` arrays) and
`src/app/contact/page.tsx` (the `engagements` array).

### Adding a project

Append an entry to `projects` in `src/content/projects.ts`. Each project has a
`kind` that decides where its card goes:

- **`"case-study"`** — renders a detail page at `/projects/<slug>` from the
  `detail` block (problem, approach, outcome, headline results, optional links).
- **`"tool"`** — the same detail page, with an interactive component mounted
  above the write-up.
- **`"external"`** — the card links straight out to `externalHref`. No detail
  page is generated.

Set `featured: true` to pull a project onto the home page.

### Adding an interactive tool

1. Build the component under `src/components/tools/`. Keep the maths in
   `src/lib/finance.ts` as pure functions so it can be reasoned about and
   tested separately from the UI.
2. Register it in `src/components/tools/registry.tsx`:

   ```tsx
   export const toolRegistry: Record<string, React.ComponentType> = {
     dcf: DcfTool,
     options: OptionsTool,
     yourKey: YourTool,
   };
   ```

3. Set `kind: "tool"` and `toolKey: "yourKey"` on the project.

`src/components/tools/controls.tsx` provides `Field` (slider + number input),
`Stat`, and `ToolShell` (sticky assumptions panel beside the output), so a new
tool is mostly maths plus layout.

Two tools ship with the site:

- **DCF Valuation Engine** (`/projects/dcf-valuation-engine`) — FCFF forecast,
  Gordon-growth terminal value, and a live 5×5 WACC × terminal-growth
  sensitivity grid.
- **Options Pricing & Greeks** (`/projects/options-pricing`) — Black-Scholes
  with analytic Greeks, a binomial cross-check including American early
  exercise, and a Newton-Raphson implied-volatility solver.

Both are pure client-side computation. Nothing a visitor types leaves the browser.

## Design system

Tokens are defined once in `src/app/globals.css` as CSS custom properties, with
a dark-mode block under `.dark`:

- `--background` / `--foreground` — warm paper and ink navy
- `--primary` — the institutional navy used for buttons and emphasis
- `--gold` / `--gold-soft` — the single accent, used sparingly
- `--font-serif` (Fraunces) for display, `--font-sans` (Inter) for body,
  `--font-mono` (JetBrains Mono) for labels and figures

Utilities worth knowing: `.eyebrow` (small-caps section label), `.tnum`
(tabular figures — use it on any rendered number), `.rule` (hairline divider),
`.grid-field` (the faint blueprint grid behind the hero).

Theme switching is handled by `next-themes`; the toggle lives in the header.

## Things to replace before going live

- `site.email`, `site.url`, and the LinkedIn / GitHub URLs in `src/content/site.ts`
- `public/resume.pdf` — the CV download links point at it
- The `externalHref` on the MASI dashboard project
- Any figure in `metrics` or in a project's `results` you would not want to be
  asked about
