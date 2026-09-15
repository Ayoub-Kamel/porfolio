import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { Section, SectionTitle } from "@/components/page-header";
import { featuredProjects } from "@/content/projects";
import { roles, skills } from "@/content/experience";
import { intro, metrics, site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
            </span>
            <p className="eyebrow">{site.availability}</p>
          </div>

          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            {site.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                View the work <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">About me</Link>
            </Button>
          </div>

          <dl className="mt-20 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-background px-6 py-7">
                <dt className="eyebrow">{metric.label}</dt>
                <dd className="tnum mt-2 font-serif text-3xl tracking-tight">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Intro */}
      <Section className="border-b">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
          <p className="eyebrow lg:pt-2">Approach</p>
          <div className="max-w-3xl space-y-6">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured work */}
      <Section className="border-b">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight">
              Models, tools, and the decisions behind them
            </h2>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section className="border-b">
        <SectionTitle eyebrow="Capabilities" title="What I work on" />
        <div className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group} className="bg-background p-7">
              <h3 className="font-serif text-xl tracking-tight">{group.group}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="mt-[0.4375rem] size-1 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Recent roles */}
      <Section className="border-b">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight">Where I have worked</h2>
          </div>
          <Link
            href="/experience"
            className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Full background
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="divide-y border-y">
          {roles.map((role) => (
            <li
              key={`${role.company}-${role.period}`}
              className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <p className="tnum font-mono text-xs text-muted-foreground sm:pt-1">
                {role.period}
              </p>
              <div>
                <p className="font-medium">{role.title}</p>
                <p className="text-sm text-muted-foreground">
                  {role.company} · {role.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section>
        <div className="rounded-lg border bg-card px-8 py-14 text-center sm:px-16">
          <p className="eyebrow">Get in touch</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Have a valuation, a risk framework, or a model that needs a second pair of eyes?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start a conversation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.resumeHref}>Download CV</a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
