import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, Check, Copy, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExportControls } from "@/components/export-controls";
import { filterPrompts, mergePrompts, parseSavedPrompts, promptSchema, promptTags, vaultStorageKey, type AgencyPrompt } from "@/lib/prompt-vault";

export function PromptVault() {
  const [saved, setSaved] = useState<AgencyPrompt[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [editing, setEditing] = useState<AgencyPrompt | null>(null);
  const [copied, setCopied] = useState("");
  const [storageError, setStorageError] = useState("");
  const [formError, setFormError] = useState("");
  useEffect(() => {
    try { setSaved(parseSavedPrompts(localStorage.getItem(vaultStorageKey))); setReady(true); }
    catch { setStorageError("Saved prompts could not be loaded. Browser saving is unavailable; existing data has not been changed."); toast.error("Couldn't load saved prompts."); }
  }, []);
  const prompts = filterPrompts(mergePrompts(saved), query, tags);
  function save(event: FormEvent) {
    event.preventDefault();
    const parsed = promptSchema.safeParse(editing);
    if (!parsed.success) { setFormError("Add a title, prompt text, and at least one tag."); return; }
    const next = [...saved.filter((item) => item.id !== parsed.data.id), parsed.data];
    try { localStorage.setItem(vaultStorageKey, JSON.stringify(next)); setSaved(next); setEditing(null); toast.success("Prompt saved in this browser"); }
    catch { setFormError("Couldn't save the prompt in this browser. Your changes are still here."); toast.error("Prompt saving failed."); }
  }
  async function copy(prompt: AgencyPrompt) {
    try { await navigator.clipboard.writeText(prompt.content); setCopied(prompt.id); toast.success("Prompt copied"); setTimeout(() => setCopied(""), 2000); }
    catch { toast.error("Copy failed. Please select and copy the prompt text."); }
  }
  return <div className="max-w-6xl min-w-0">
    <p className="mb-3 text-xs uppercase tracking-widest text-primary-glow">Module 05 · Agency library</p>
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><BookOpen className="mt-1 hidden h-7 w-7 shrink-0 text-primary-glow sm:block" /><h1 className="text-3xl font-semibold">Custom Agency Prompt Vault & Library</h1></div><Button disabled={!ready} onClick={() => { setFormError(""); setEditing({ id: crypto.randomUUID(), title: "", content: "", tags: [] }); }}><Plus />Add Prompt</Button></div>
    <div className="mt-8 border-t border-border pt-5">
      <div className="relative max-w-xl"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search prompts" placeholder="Search prompts…" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" /></div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by tag">{promptTags.map((tag) => <Button key={tag} variant={tags.includes(tag) ? "default" : "outline"} size="sm" aria-pressed={tags.includes(tag)} onClick={() => setTags((prev) => prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag])}>{tag}</Button>)}</div>
      <div className="my-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{prompts.length} prompts · Saved in this browser</p><ExportControls data={prompts} text={prompts.map((prompt) => `${prompt.title}\n${prompt.tags.join(" ")}\n\n${prompt.content}`).join("\n\n---\n\n")} rows={prompts.map((prompt) => ({ Title: prompt.title, Tags: prompt.tags.join(" "), Prompt: prompt.content }))} filename="jil-prompt-library" disabled={!prompts.length} /></div>
      {storageError && <p role="alert" className="mb-4 text-sm text-destructive">{storageError}</p>}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">{prompts.map((prompt) => <article key={prompt.id} className="min-w-0 rounded-lg border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3"><h2 className="break-words text-lg font-semibold">{prompt.title}</h2><Button variant="ghost" size="icon" disabled={!ready} aria-label={`Edit ${prompt.title}`} title="Edit prompt" onClick={() => { setFormError(""); setEditing({ ...prompt, tags: [...prompt.tags] }); }}><Pencil /></Button></div>
        <p className="mt-2 text-xs text-primary-glow">{prompt.tags.join("  ")}</p>
        <Textarea aria-label={`${prompt.title} prompt text`} readOnly value={prompt.content} className="my-4 min-h-52 resize-y text-sm leading-relaxed" />
        <Button variant="outline" size="sm" onClick={() => copy(prompt)}>{copied === prompt.id ? <Check className="text-success" /> : <Copy />}{copied === prompt.id ? "Copied!" : "Quick Copy"}</Button>
      </article>)}</div>
      {!prompts.length && <p role="status" className="py-16 text-center text-muted-foreground">No matching prompts.</p>}
    </div>
    <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>{saved.some((item) => item.id === editing?.id) || editing?.id.includes("framework") ? "Edit Prompt" : "Save Prompt"}</DialogTitle><DialogDescription>Saved in this browser only.</DialogDescription></DialogHeader>{editing && <form onSubmit={save} className="space-y-5">
      <div><label htmlFor="prompt-title" className="mb-2 block text-sm font-medium">Title</label><Input id="prompt-title" required value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></div>
      <div><label htmlFor="prompt-content" className="mb-2 block text-sm font-medium">Prompt Text</label><Textarea id="prompt-content" required value={editing.content} onChange={(event) => setEditing({ ...editing, content: event.target.value })} className="min-h-60" /></div>
      <fieldset><legend className="mb-3 text-sm font-medium">Tags</legend><div className="flex flex-wrap gap-4">{promptTags.map((tag) => <label key={tag} className="flex items-center gap-2 text-sm"><Checkbox checked={editing.tags.includes(tag)} onCheckedChange={(checked) => setEditing({ ...editing, tags: checked ? [...editing.tags, tag] : editing.tags.filter((item) => item !== tag) })} />{tag}</label>)}</div></fieldset>
      {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
      <Button type="submit" className="w-full">Save Prompt</Button>
    </form>}</DialogContent></Dialog>
  </div>;
}