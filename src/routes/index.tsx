import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, FileText, MessageSquareReply, LayoutGrid, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIL — Automate Your Agency's Local SEO" },
      { name: "description", content: "Turn repetitive, manual local SEO tasks into single-click AI workflows." },
      { property: "og:title", content: "JIL — Automate Your Agency's Local SEO" },
      { property: "og:description", content: "Turn repetitive, manual local SEO tasks into single-click AI workflows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "jil_gemini_api_key";

const features = [
  { icon: FileText, title: "Yoast Meta Generator", desc: "SEO titles and meta descriptions, ready to paste.", to: "/tools/yoast-meta-generator" },
  { icon: MessageSquareReply, title: "Review Responder", desc: "On-brand replies to every Google review.", to: "/tools/review-responder" },
  { icon: LayoutGrid, title: "Catalog Builder", desc: "Product and service listings in bulk.", to: "/tools/catalog-builder" },
  { icon: CalendarDays, title: "12-Week GBP Calendar", desc: "A quarter of Business Profile posts, planned.", to: "/tools/gbp-calendar" },
];

function ApiKeyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [key, setKey] = useState("");
  useEffect(() => {
    if (open) setKey(localStorage.getItem(STORAGE_KEY) ?? "");
  }, [open]);
  const save = () => {
    if (key.trim()) localStorage.setItem(STORAGE_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY);
    toast.success(key.trim() ? "API key saved" : "API key cleared");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Gemini API Key</DialogTitle>
          <DialogDescription>Stored only in this browser's local storage.</DialogDescription>
        </DialogHeader>
        <Input type="password" placeholder="AIza..." value={key} onChange={(e) => setKey(e.target.value)} />
        <DialogFooter>
          <Button onClick={save} className="glow">Save key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-aurora">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight">
          JIL<span className="text-primary">.</span>
        </span>
        <Button variant="outline" size="sm" className="glass" onClick={() => setOpen(true)}>
          <KeyRound /> API Key
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="flex flex-col items-center pt-24 pb-20 text-center">
          <span className="glass mb-6 rounded-full px-4 py-1 text-xs text-muted-foreground">
            AI workflows for local SEO agencies
          </span>
          <h1 className="text-gradient max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Automate Your Agency's Local SEO Operations
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Turn repetitive, manual tasks into single-click AI workflows.
          </p>
          <Button asChild size="lg" className="glow mt-10 h-12 rounded-full px-8 text-base transition-transform hover:scale-105">
            <Link to="/workspace">Launch Workspace <ArrowRight /></Link>
          </Button>
        </section>

        <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc, to }) => (
            <Link key={title} to={to} className="glass group rounded-2xl p-6 transition-colors hover:border-primary/50">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Soon</span>
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </section>
      </main>
      <ApiKeyDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
