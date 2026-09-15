import type { Metadata } from "next";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionTitle } from "@/components/page-header";
import { certifications, education, roles } from "@/content/experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description: `Professional background, education, and credentials for ${site.name}.`,
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Transaction support, equity research, and the models underneath both."
        lead={`Roles, education, and credentials. A PDF version is available if you need it in a file.`}
      />

      <Section className="border-b">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <SectionTitle eyebrow="Roles" title="Professional background" className="mb-0" />
          <Button asChild variant="outline">
            <a href={site.resumeHref} download>
              <Download /> Download CV
            </a>
          </Button>
        </div>

        <ol className="space-y-0">
          {roles.map((role) => (
            <li
              key={`${role.company}-${role.period}`}
              className="grid gap-4 border-t py-10 sm:grid-cols-[11rem_1fr] sm:gap-10"
            >
              <div className="sm:pt-1">
                <p className="tnum font-mono text-xs text-muted-foreground">
                  {role.period}
                </p>
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {role.location}
                </p>
              </div>

              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl tracking-tight">{role.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{role.company}</p>
                <p className="mt-4 leading-relaxed">{role.summary}</p>

                <ul className="mt-6 space-y-3">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight.slice(0, 24)}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-[0.4375rem] size-1 shrink-0 rounded-full bg-gold" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Education" title="Academic background" />
            <ul className="divide-y border-y">
              {education.map((item) => (
                <li key={item.title} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="tnum font-mono text-xs text-muted-foreground">
                      {item.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.issuer}</p>
                  {item.note && (
                    <p className="mt-2 text-sm text-muted-foreground/80">{item.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle eyebrow="Credentials" title="Certifications" />
            <ul className="divide-y border-y">
              {certifications.map((item) => (
                <li key={item.title} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="tnum font-mono text-xs text-muted-foreground">
                      {item.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
