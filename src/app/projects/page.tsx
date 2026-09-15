import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/page-header";
import { ProjectFilter } from "@/components/project-filter";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Valuation models, risk frameworks, and interactive financial tools.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Every model here started as a question someone needed answered."
        lead="Some of them stayed spreadsheets. The ones that kept coming back got rebuilt as tools — a few of those run right here in the browser."
      />

      <Section>
        <ProjectFilter projects={projects} />

        <p className="mt-14 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Interactive tools run entirely in your browser — nothing you type is
          sent anywhere. They are teaching and scoping instruments, not
          investment advice.
        </p>
      </Section>
    </>
  );
}
