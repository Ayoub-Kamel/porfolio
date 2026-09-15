import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/content/projects";

/**
 * One card in the work index. External projects link straight out; everything
 * else routes to its detail page on this site.
 */
export function ProjectCard({ project }: { project: Project }) {
  const external = project.kind === "external";
  const href = external ? project.externalHref ?? "#" : `/projects/${project.slug}`;

  const kindLabel =
    project.kind === "tool"
      ? "Interactive tool"
      : project.kind === "external"
        ? "External"
        : "Case study";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative flex flex-col justify-between gap-8 rounded-lg border bg-card p-7 transition-all hover:border-foreground/20 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-12px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            {project.discipline}
          </span>
          <span className="tnum font-mono text-[0.625rem] text-muted-foreground">
            {project.year}
          </span>
        </div>

        <h3 className="mt-5 font-serif text-2xl leading-snug tracking-tight">
          {project.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
          {project.stack.length > 3 && (
            <Badge variant="secondary" className="font-normal">
              +{project.stack.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">{kindLabel}</span>
          <span className="flex items-center gap-1.5 text-xs font-medium">
            {external ? "Visit" : "Read"}
            {external ? (
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : (
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
