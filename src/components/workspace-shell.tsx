import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, KeyRound, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { workspaceTools } from "@/lib/workspace-tools";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = workspaceTools.find((tool) => tool.to === pathname);
  return <div className="flex min-h-screen w-full bg-background">
    <aside className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] motion-reduce:transition-none ${collapsed ? "w-16" : "w-16 md:w-64"}`}>
      <Link to="/" aria-label="JIL home" className="flex h-20 shrink-0 items-center justify-center border-b border-sidebar-border text-2xl font-bold md:justify-start md:px-5">JIL<span className="text-primary-glow">.</span></Link>
      <div className={`border-b border-sidebar-border px-5 py-5 ${collapsed ? "hidden" : "hidden md:block"}`}>
        <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Quick stats</p>
        <div className="flex items-end justify-between"><div><p className="text-2xl font-semibold">5</p><p className="text-xs text-muted-foreground">Tool modules</p></div><div className="text-right"><p className="text-2xl font-semibold">0</p><p className="text-xs text-muted-foreground">Workflows run</p></div></div>
      </div>
      <nav aria-label="Workspace navigation" className="flex-1 space-y-2 overflow-y-auto px-2 py-5">
        <Button asChild variant="ghost" className="h-11 w-full justify-start px-3" ><Link to="/workspace" activeProps={{ className: "bg-sidebar-accent text-primary-glow" }} activeOptions={{ exact: true }} title="Dashboard"><LayoutDashboard className="shrink-0" /><span className={collapsed ? "hidden" : "hidden md:inline"}>Dashboard</span></Link></Button>
        {!collapsed && <p className="hidden px-3 pt-5 pb-2 text-xs uppercase tracking-widest text-muted-foreground md:block">Tool modules</p>}
        {workspaceTools.map((tool) => <Button key={tool.to} asChild variant="ghost" className="h-12 w-full justify-start px-3"><Link to={tool.to} activeProps={{ className: "bg-sidebar-accent text-primary-glow" }} title={tool.title}><tool.icon className="shrink-0" /><span className={collapsed ? "hidden" : "hidden md:inline"}>{tool.label}</span></Link></Button>)}
      </nav>
      <Button asChild variant="ghost" className="mx-2 mb-5 justify-start px-3"><Link to="/" title="Back to home"><ArrowLeft /><span className={collapsed ? "hidden" : "hidden md:inline"}>Back to home</span></Link></Button>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="flex min-h-20 items-center justify-between gap-3 border-b border-border px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button><span className="truncate text-sm text-muted-foreground">Workspace <span className="mx-2">/</span><span className="text-foreground">{current?.label ?? "Overview"}</span></span></div>
        <Button variant="outline" size="sm" onClick={() => setKeyOpen(true)}><KeyRound /> <span className="hidden sm:inline">API Key</span></Button>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">{children}</main>
      <footer className="flex items-center gap-2 px-5 pb-6 text-xs text-muted-foreground md:px-10"><Sparkles className="h-3 w-3 text-primary-glow" /> JIL Agency Workspace</footer>
    </div>
    <ApiKeyDialog open={keyOpen} onOpenChange={setKeyOpen} />
  </div>;
}