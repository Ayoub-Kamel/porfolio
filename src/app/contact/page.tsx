import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/page-header";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

const engagements = [
  {
    title: "Valuation & transaction support",
    body: "DCF, comparables, and LBO work for acquisitions, fundraising, and internal review — including second opinions on models built elsewhere.",
  },
  {
    title: "Risk frameworks",
    body: "Credit scorecards, stress testing, and portfolio risk reporting, built to be documented and defended rather than just delivered.",
  },
  {
    title: "Model engineering",
    body: "Turning a recurring spreadsheet analysis into a tested, versioned tool your team can operate without you.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell me what you are trying to value, hedge, or decide."
        lead="Email is the most reliable way to reach me. A short description of the problem and the timeline is enough to start."
      />

      <Section className="border-b">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-2xl">
            <p className="eyebrow">Typical engagements</p>
            <ul className="mt-8 space-y-8">
              {engagements.map((item, i) => (
                <li key={item.title} className="flex gap-5">
                  <span className="tnum mt-1 shrink-0 font-mono text-xs text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl tracking-tight">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Button asChild size="lg">
                <a href={`mailto:${site.email}`}>
                  <Mail /> {site.email}
                </a>
              </Button>
            </div>
          </div>

          <aside className="h-fit rounded-lg border bg-card p-7">
            <p className="eyebrow">Details</p>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${site.email}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="mt-1 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {site.location}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Availability</dt>
                <dd className="mt-1">{site.availability}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t pt-6">
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-4 space-y-3 text-sm">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>{social.label}</span>
                      <span className="flex items-center gap-1 font-mono text-xs">
                        {social.handle}
                        <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Nothing on this site constitutes investment advice or a recommendation
          to buy or sell any security. The interactive tools are illustrative:
          they run in your browser on the assumptions you enter, and they use no
          live market data.
        </p>
      </Section>
    </>
  );
}
