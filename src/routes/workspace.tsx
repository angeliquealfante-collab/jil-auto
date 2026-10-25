import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Layers, Activity, CalendarDays, BookOpen } from "lucide-react";
import { workspaceTools } from "@/lib/workspace-tools";

export const Route = createFileRoute("/workspace")({
  head: () => ({ meta: [
    { title: "Agency Workspace — JIL" },
    { name: "description", content: "Your JIL agency dashboard for five local SEO workflow modules." },
    { property: "og:title", content: "Agency Workspace — JIL" },
    { property: "og:description", content: "Your JIL agency dashboard for five local SEO workflow modules." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Workspace,
});

function Workspace() {
  return <>
    <p className="mb-2 text-xs uppercase tracking-widest text-primary-glow">Agency command center</p>
    <h1 className="text-3xl font-semibold md:text-4xl">Your workspace</h1>
    <p className="mt-3 text-muted-foreground">Local SEO, all in one place.</p>
    <section aria-label="Quick stats" className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 lg:grid-cols-4">
      {[
        { icon: Layers, label: "Tool modules", value: "5" },
        { icon: Activity, label: "Workflows run", value: "0" },
        { icon: CalendarDays, label: "Calendar horizon", value: "12 weeks" },
        { icon: BookOpen, label: "Saved prompts", value: "0" },
      ].map((stat) => <div key={stat.label} className="px-2"><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><stat.icon className="h-4 w-4 text-primary-glow" />{stat.label}</div><p className="text-2xl font-semibold">{stat.value}</p></div>)}
    </section>
    <div className="mt-10 mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Tool modules</h2><span className="text-xs text-muted-foreground">5 modules</span></div>
    <section className="grid gap-4 lg:grid-cols-2">
      {workspaceTools.map((tool) => <Link to={tool.to} key={tool.to} className="glass group flex min-h-52 flex-col rounded-lg p-6 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary-glow"><tool.icon className="h-5 w-5" /></div><span className="text-xs text-muted-foreground">MODULE {tool.number}</span></div><ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-glow" /></div>
        <h3 className="text-lg font-semibold">{tool.title}</h3><p className="mt-1 text-xs text-primary-glow">{tool.detail}</p><p className="mt-3 text-sm text-muted-foreground">{tool.description}</p><div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs"><span className="text-muted-foreground">Coming soon</span><span className="text-primary-glow">Open module →</span></div>
      </Link>)}
    </section>
  </>;
}