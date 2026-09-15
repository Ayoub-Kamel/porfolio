import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionTitle } from "@/components/page-header";
import { languages, skills } from "@/content/experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.role}. ${site.tagline}`,
};

const story = [
  "I came to finance through the numbers rather than the narrative. What held my attention was not the story a company tells about itself but the one its cash flows tell, and how often the two disagree.",
  "Most of my work is valuation and risk: what a business is worth under a stated set of assumptions, what happens to that answer when the assumptions move, and how much of the result is a genuine view versus an artefact of the model. The second and third questions are where the value is. A point estimate without a sensitivity range is a guess wearing a suit.",
  "The tooling side came out of frustration. The same analyses kept getting rebuilt from scratch, each time with a fresh chance to break a formula nobody would notice. So I started rebuilding the recurring ones properly — as functions with tests, then as interfaces people who are not analysts can actually operate.",
  "I work in Arabic, French, and English, largely with companies and funds in Morocco and the wider region, where public data is thinner and judgement has to carry more of the weight.",
];

const principles = [
  {
    title: "Assumptions belong in the open",
    body: "Every input visible and adjustable. A model whose drivers are buried in a cell reference is a model nobody can challenge — and one nobody can challenge is one nobody should trust.",
  },
  {
    title: "A range beats a point",
    body: "The single number is the least interesting output of any valuation. How wide the plausible range is, and what makes it wide, is the actual finding.",
  },
  {
    title: "Explainable over marginally accurate",
    body: "A logistic regression a credit committee can read beats an ensemble that scores three points better and cannot be defended when a decision is challenged.",
  },
  {
    title: "Build it twice, then automate it",
    body: "The third time an analysis comes back is the signal to stop rebuilding and start engineering.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Finance is mostly the discipline of being honest about what you do not know."
        lead={`${site.role} based in ${site.location}.`}
      />

      <Section className="border-b">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <p className="eyebrow lg:pt-2">Background</p>
          <div className="max-w-2xl space-y-6">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-b">
        <SectionTitle eyebrow="Principles" title="How I work" />
        <div className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
          {principles.map((principle, i) => (
            <div key={principle.title} className="bg-background p-8">
              <span className="tnum font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl tracking-tight">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-b">
        <SectionTitle eyebrow="Toolkit" title="Methods and tools" />
        <div className="space-y-10">
          {skills.map((group) => (
            <div key={group.group} className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <h3 className="font-medium">{group.group}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border px-2.5 py-1 text-sm text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:gap-8">
            <h3 className="font-medium">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <span
                  key={language.name}
                  className="rounded-md border px-2.5 py-1 text-sm text-muted-foreground"
                >
                  {language.name}
                  <span className="text-muted-foreground/60"> · {language.level}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border bg-card px-8 py-10">
          <div>
            <p className="font-serif text-2xl tracking-tight">
              The full background, role by role.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Experience, education, and credentials.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/experience">View experience</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
