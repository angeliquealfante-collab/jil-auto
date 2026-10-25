import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export interface ToolPageProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  upcoming: string[];
}

export function ToolPage({ icon: Icon, title, tagline, description, upcoming }: ToolPageProps) {
  return (
    <div className="max-w-4xl pb-12">
        <Link
          to="/workspace"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to workspace
        </Link>

        <section className="flex flex-col items-start">
          <div className="glass mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
            <Icon className="h-8 w-8" />
          </div>
          <span className="glass mb-4 rounded-full px-4 py-1 text-xs text-muted-foreground">
            {tagline}
          </span>
          <h1 className="text-gradient text-3xl font-bold leading-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>

          <div className="mt-10 w-full border-t border-border pt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              What it will do
            </p>
            <ul className="space-y-3">
              {upcoming.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Coming soon
            </p>
          </div>
        </section>
    </div>
  );
}
