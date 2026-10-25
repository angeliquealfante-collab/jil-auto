import { useState, type FormEvent } from "react";
import { Check, Copy, FileText, KeyRound, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { characterStatus, generateMeta, type MetaVariation } from "@/lib/seo-meta";
import { toast } from "sonner";

function LengthIndicator({ text, kind }: { text: string; kind: "title" | "description" }) {
  const { count, min, max, status } = characterStatus(text, kind);
  const color = status === "good" ? "text-success" : status === "short" ? "text-warning" : "text-destructive";
  return <div className={`mt-2 ${color}`}>
    <div className="flex flex-wrap justify-between gap-1 text-xs"><span>{count} characters · {status === "good" ? "On target" : status === "short" ? "Too short" : "Too long"}</span><span>Target {min}–{max}</span></div>
    <progress aria-label={`${kind} character count`} value={Math.min(count, max)} max={max} className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-current [&::-moz-progress-bar]:bg-current" />
  </div>;
}

export function SeoMetaEngine() {
  const [pageTitle, setPageTitle] = useState("");
  const [keyphrase, setKeyphrase] = useState("");
  const [business, setBusiness] = useState("");
  const [variations, setVariations] = useState<MetaVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyOpen, setKeyOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");
    let key = "";
    try { key = localStorage.getItem("jil_gemini_api_key")?.trim() ?? ""; } catch { setError("Browser storage is unavailable. Enable it to connect your key."); return; }
    if (!key) { setError("Connect your Gemini API key to generate variations."); setKeyOpen(true); return; }
    setLoading(true);
    try {
      const result = await generateMeta({ pageTitle: pageTitle.trim(), keyphrase: keyphrase.trim(), business: business.trim() }, key);
      setVariations(result); setCopied(null);
      toast.success("Three variations generated");
    } catch (err) {
      setError(err instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(err.name) ? err.message : "Couldn't reach Gemini. Check your connection or try again.");
    } finally { setLoading(false); }
  }

  function edit(index: number, field: keyof MetaVariation, text: string) {
    setVariations((current) => current.map((item, i) => i === index ? { ...item, [field]: text } : item));
    setCopied(null);
  }
  async function copy(index: number, field: keyof MetaVariation) {
    const value = variations[index]?.[field];
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      const id = `${index}-${field}`;
      setCopied(id);
      setTimeout(() => setCopied((current) => current === id ? null : current), 2000);
    } catch { toast.error("Copy failed. Please select and copy the text manually."); }
  }

  return <div className="max-w-5xl">
    <p className="mb-3 text-xs uppercase tracking-widest text-primary-glow">Module 01 · Yoast Optimized</p>
    <div className="flex items-start gap-3"><FileText className="mt-1 hidden h-7 w-7 shrink-0 text-primary-glow sm:block" /><h1 className="text-3xl font-semibold">SEO Meta Description & Title Engine</h1></div>
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <form onSubmit={submit} className="space-y-5 border-t border-border pt-5">
        <h2 className="text-lg font-semibold">Page details</h2>
        <div><label htmlFor="page-title" className="mb-2 block text-sm font-medium">Page/Post Title</label><Input id="page-title" required maxLength={300} value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Emergency Plumbing Services" disabled={loading} /></div>
        <div><label htmlFor="focus-keyphrase" className="mb-2 block text-sm font-medium">Primary Focus Keyphrase</label><Input id="focus-keyphrase" required maxLength={200} value={keyphrase} onChange={(e) => setKeyphrase(e.target.value)} placeholder="emergency plumber Singapore" disabled={loading} /></div>
        <div><label htmlFor="business-location" className="mb-2 block text-sm font-medium">Business Name / Location</label><Input id="business-location" required maxLength={300} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Your business, Singapore" disabled={loading} /></div>
        <Button type="submit" className="w-full" disabled={loading || !pageTitle.trim() || !keyphrase.trim() || !business.trim()}>{loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{loading ? "Generating…" : variations.length ? "Regenerate variations" : "Generate 3 variations"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setKeyOpen(true)}><KeyRound />Gemini API Key</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
      <section aria-label="Generated variations" aria-busy={loading}>
        <div className="mb-5 flex items-center justify-between border-t border-border pt-5"><h2 className="text-lg font-semibold">SEO variations</h2><span className="text-xs text-muted-foreground">{variations.length} / 3</span></div>
        {variations.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center border-y border-dashed border-border py-10 text-center text-muted-foreground"><FileText className="mb-4 h-8 w-8 text-primary-glow" /><p>{loading ? "Drafting three variations…" : "No variations yet"}</p></div> : <div className="space-y-5">{variations.map((variation, index) => <article key={index} className="glass rounded-lg p-5">
          <h3 className="mb-4 text-sm font-semibold text-primary-glow">Variation {String(index + 1).padStart(2, "0")}</h3>
          <label htmlFor={`seo-title-${index}`} className="mb-2 block text-sm font-medium">SEO Title</label>
          <Textarea id={`seo-title-${index}`} value={variation.title} onChange={(e) => edit(index, "title", e.target.value)} disabled={loading} className="min-h-16 resize-y" />
          <LengthIndicator text={variation.title} kind="title" />
          <Button type="button" variant="outline" size="sm" className="mt-3" disabled={!variation.title || loading} onClick={() => copy(index, "title")}>{copied === `${index}-title` ? <Check className="text-success" /> : <Copy />}{copied === `${index}-title` ? "Copied!" : "Copy SEO Title"}</Button>
          <label htmlFor={`meta-description-${index}`} className="mt-5 mb-2 block text-sm font-medium">Meta Description</label>
          <Textarea id={`meta-description-${index}`} value={variation.description} onChange={(e) => edit(index, "description", e.target.value)} disabled={loading} className="min-h-24 resize-y" />
          <LengthIndicator text={variation.description} kind="description" />
          <Button type="button" variant="outline" size="sm" className="mt-3" disabled={!variation.description || loading} onClick={() => copy(index, "description")}>{copied === `${index}-description` ? <Check className="text-success" /> : <Copy />}{copied === `${index}-description` ? "Copied!" : "Copy Meta Description"}</Button>
        </article>)}</div>}
      </section>
    </div>
    <ApiKeyDialog open={keyOpen} onOpenChange={setKeyOpen} />
  </div>;
}