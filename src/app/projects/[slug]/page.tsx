import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/page-header";
import { getTool } from "@/components/tools/registry";
import { getProject, inSiteProjects, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return inSiteProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  // External projects live elsewhere; they have no detail page here.
  if (!project || project.kind === "external") notFound();

  const Tool = getTool(project.toolKey);
  const detail = project.detail;

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.slice(index + 1).find((p) => p.kind !== "external");

  return (
    <>
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {project.discipline}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="tnum font-mono text-[0.625rem] text-muted-foreground">
              {project.year}
            </span>
            {project.status && (
              <Badge variant="outline" className="font-mono text-[0.625rem] uppercase tracking-[0.12em]">
                {project.status}
              </Badge>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
          </div>

          {detail?.links && detail.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {detail.links.map((link) => (
                <Button key={link.href} asChild variant="outline" size="sm">
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <ArrowUpRight />
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>

      {Tool && (
        <section className="border-b bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="mb-10">
              <p className="eyebrow">Try it</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight">
                Move the assumptions
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Everything recomputes as you type, in your browser. Nothing is
                sent anywhere, and nothing here is investment advice.
              </p>
            </div>
            <Tool />
          </div>
        </section>
      )}

      {detail && (
        <Section>
          <div className="grid gap-12 lg:grid-cols-[14rem_1fr]">
            <div className="space-y-10 lg:sticky lg:top-24 lg:h-fit">
              {detail.results && (
                <dl className="space-y-6">
                  {detail.results.map((result) => (
                    <div key={result.label}>
                      <dd className="tnum font-serif text-3xl tracking-tight">
                        {result.value}
                      </dd>
                      <dt className="mt-1 text-xs text-muted-foreground">
                        {result.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="max-w-2xl space-y-14">
              <div>
                <p className="eyebrow">The problem</p>
                <p className="mt-4 text-lg leading-relaxed">{detail.context}</p>
              </div>

              <div>
                <p className="eyebrow">How it works</p>
                <ol className="mt-6 space-y-6">
                  {detail.approach.map((step, i) => (
                    <li key={step.slice(0, 24)} className="flex gap-5">
                      <span className="tnum mt-0.5 shrink-0 font-mono text-xs text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="leading-relaxed text-muted-foreground">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-l-2 border-gold pl-6">
                <p className="eyebrow">What came of it</p>
                <p className="mt-4 text-lg leading-relaxed">{detail.outcome}</p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {next && (
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <Link href={`/projects/${next.slug}`} className="group block">
              <p className="eyebrow">Next project</p>
              <p className="mt-3 font-serif text-2xl tracking-tight transition-colors group-hover:text-gold">
                {next.title}
              </p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
