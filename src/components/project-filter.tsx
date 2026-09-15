"use client";

import * as React from "react";

import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/** Work index with client-side filtering by discipline. */
export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState<string>("All");

  const disciplines = React.useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.discipline)))],
    [projects]
  );

  const visible =
    active === "All"
      ? projects
      : projects.filter((p) => p.discipline === active);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {disciplines.map((discipline) => {
          const selected = active === discipline;
          return (
            <button
              key={discipline}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(discipline)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {discipline}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <p className="mt-8 font-mono text-xs text-muted-foreground" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
        {active !== "All" && ` in ${active.toLowerCase()}`}
      </p>
    </>
  );
}
