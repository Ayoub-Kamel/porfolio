/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SITE CONTENT — single source of truth.
 *
 * Everything the visitor reads lives in `src/content/*`. Edit these files to
 * update the site; no component needs to be touched.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Ayoub Kamel",
  role: "Finance & Quantitative Analysis",
  /** Shown in the browser tab and as the OG title suffix. */
  shortTitle: "Ayoub Kamel — Finance",
  tagline:
    "I build the models behind capital decisions — valuation, risk, and portfolio construction — and turn them into tools people can actually use.",
  location: "Casablanca, Morocco",
  email: "contact@kamel.ma",
  /** Used for canonical URLs and OG metadata. */
  url: "https://kamel.ma",
  /** Put your PDF in /public and point here, or leave as-is. */
  resumeHref: "/resume.pdf",
  availability: "Open to analyst and advisory engagements",
} as const;

export const socials = [
  { label: "Email", href: `mailto:${site.email}`, handle: site.email },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/", handle: "/in/ayoubkamel" },
  { label: "GitHub", href: "https://github.com/", handle: "@ayoub-kamel" },
] as const;

export const nav = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
] as const;

/** Three figures on the home page. Keep them concrete and defensible. */
export const metrics = [
  { value: "6+", label: "Years in financial analysis" },
  { value: "40+", label: "Valuation & risk models built" },
  { value: "MAD 1.2B", label: "Transaction value analysed" },
] as const;

/** Short pitch used on the home page under the hero. */
export const intro = [
  "I work at the point where financial theory has to survive contact with a real balance sheet. That means discounted cash flow models that hold up under scrutiny, risk frameworks that regulators accept, and portfolio construction that respects the constraints a mandate actually carries.",
  "Most of the work below started as a spreadsheet solving one problem. The ones that mattered got rebuilt as tools — so the next analyst does not start from zero.",
] as const;
