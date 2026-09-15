import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
        This page does not reconcile.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The address you followed does not exist, or the page has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">View the work</Link>
        </Button>
      </div>
    </div>
  );
}
