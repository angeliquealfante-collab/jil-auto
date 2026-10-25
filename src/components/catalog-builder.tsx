import { useState, type FormEvent } from "react";
import { Check, Copy, Download, FileDown, KeyRound, LayoutGrid, LoaderCircle, MapPin, Image, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { catalogInputSchema, catalogToCsv, catalogToMarkdown, gapGroups, generateCatalog, type CatalogInputs, type CatalogResult } from "@/lib/catalog-builder";

const fields = [
  { key: "business", label: "Business Name", placeholder: "Your business name" },
  { key: "category", label: "Primary Business Category", placeholder: "e.g. Plumbing service" },
  { key: "locations", label: "Target Locations / Cities", placeholder: "e.g. Singapore, Tampines" },
  { key: "website", label: "Website URL", placeholder: "https://yourbusiness.com", type: "url" },
  { key: "services", label: "Main Services List", placeholder: "One service per line", multiline: true },
  { key: "products", label: "Main Products or Packages List", placeholder: "One product or package per line", multiline: true },
  { key: "existingServices", label: "Existing GBP Services (Optional)", placeholder: "Services already listed on your profile", multiline: true },
] as const;

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CatalogBuilder() {
  const [inputs, setInputs] = useState<CatalogInputs>({ business: "", category: "", locations: "", website: "", services: "", products: "", existingServices: "" });
  const [result, setResult] = useState<CatalogResult | null>(null);
  const [resultBusiness, setResultBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyOpen, setKeyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("gaps");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const parsed = catalogInputSchema.safeParse(inputs);
    if (!parsed.success) { setError("Complete all required fields and use a valid http or https website URL."); return; }
    let key = "";
    try { key = localStorage.getItem("jil_gemini_api_key")?.trim() ?? ""; }
    catch { setError("Browser storage is unavailable. Enable it to connect your key."); return; }
    if (!key) { setError("Connect your Gemini API key to build a catalog."); setKeyOpen(true); return; }
    setLoading(true); setCopied(false);
    try {
      setResult(await generateCatalog(parsed.data, key)); setResultBusiness(parsed.data.business); setTab("gaps");
      toast.success("Catalog generated");
    } catch (err) {
      setError(err instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(err.name) ? err.message : "Couldn't reach Gemini. Check your connection or try again.");
    } finally { setLoading(false); }
  }

  async function copyAll() {
    if (!result) return;
    try { await navigator.clipboard.writeText(catalogToMarkdown(result, resultBusiness)); setCopied(true); toast.success("Catalog copied"); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error("Copy failed. Download Markdown instead."); }
  }

  return <div className="max-w-6xl min-w-0">
    <p className="mb-3 text-xs uppercase tracking-widest text-primary-glow">Module 03 · Services & products</p>
    <div className="flex items-start gap-3"><LayoutGrid className="mt-1 hidden h-7 w-7 shrink-0 text-primary-glow sm:block" /><h1 className="text-3xl font-semibold">GBP Services & Products Catalog Builder</h1></div>
    <div className="mt-8 grid grid-cols-1 items-start gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
      <form onSubmit={submit} className="min-w-0 space-y-5 border-t border-border pt-5">
        <h2 className="text-lg font-semibold">Business details</h2>
        {fields.map((field) => <div key={field.key}>
          <label htmlFor={`catalog-${field.key}`} className="mb-2 block text-sm font-medium">{field.label}</label>
          {"multiline" in field ? <Textarea id={`catalog-${field.key}`} required={field.key !== "existingServices"} value={inputs[field.key] ?? ""} onChange={(event) => setInputs((prev) => ({ ...prev, [field.key]: event.target.value })) placeholder={field.placeholder} disabled={loading} className="min-h-24 resize-y" /> : <Input id={`catalog-${field.key}`} required type={"type" in field ? field.type : "text"} value={inputs[field.key]} onChange={(event) => setInputs((prev) => ({ ...prev, [field.key]: event.target.value })) placeholder={field.placeholder} disabled={loading} />}
        </div>)}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{loading ? "Building catalog…" : result ? "Regenerate catalog" : "Build catalog"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setKeyOpen(true)}><KeyRound />Gemini API Key</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
      <section aria-label="Generated catalog" aria-busy={loading} className="min-w-0 border-t border-border pt-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{result ? resultBusiness : "Your catalog"}</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled={!result || loading} onClick={() => { if (result) download("\uFEFF" + catalogToCsv(result), "jil-gbp-catalog.csv", "text/csv;charset=utf-8"); }}><FileDown />Export to CSV</Button>
            <Button size="sm" variant="outline" disabled={!result || loading} onClick={() => { if (result) download(catalogToMarkdown(result, resultBusiness), "jil-gbp-catalog.md", "text/markdown;charset=utf-8"); }}><Download />Download Markdown</Button>
            <Button size="sm" variant="outline" disabled={!result || loading} onClick={copyAll}>{copied ? <Check className="text-success" /> : <Copy />}{copied ? "Copied!" : "Copy All"}</Button>
          </div>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="min-w-0">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
            <TabsTrigger value="gaps" className="min-w-0 whitespace-normal">Competitor Gap Analysis</TabsTrigger>
            <TabsTrigger value="services" className="min-w-0 whitespace-normal">Services Catalog{result ? ` (${result.services.length})` : ""}</TabsTrigger>
            <TabsTrigger value="products" className="min-w-0 whitespace-normal">Product Cards{result ? ` (${result.products.length})` : ""}</TabsTrigger>
          </TabsList>
          {!result ? <div className="mt-5 flex min-h-72 flex-col items-center justify-center gap-4 border-y border-dashed border-border text-muted-foreground"><LayoutGrid className="h-8 w-8 text-primary-glow" /><p role="status">{loading ? "Building your catalog…" : "No catalog yet"}</p></div> : <>
            <TabsContent value="gaps" className="space-y-6 pt-3">
              <p className="text-sm text-warning">Suggested opportunities based on your business details, not verified competitor research.</p>
              {gapGroups.map(([key, label]) => <section key={key}>
                <h3 className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">{label}<span className="text-muted-foreground">{result.gaps[key].length}</span></h3>
                {result.gaps[key].length ? <div className="divide-y divide-border border-y border-border">{result.gaps[key].map((item, index) => <div key={index} className="py-4"><h4 className="break-words font-medium">{item.name}</h4><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{item.reason}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No suggested gaps.</p>}
              </section>)}
            </TabsContent>
            <TabsContent value="services" className="space-y-4 pt-3">
              {result.services.map((item, index) => <article key={index} className="rounded-lg border border-border bg-card p-5">
                <h3 className="break-words text-lg font-semibold">{item.name}</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{item.description}</p>
                <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
                  <div><dt className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-primary-glow" />Target Location</dt><dd className="mt-1 break-words text-muted-foreground">{item.location}</dd></div>
                  <div><dt className="flex items-center gap-2 font-medium"><Image className="h-4 w-4 text-primary-glow" />Canva/Photo Type Guidance</dt><dd className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{item.photoGuidance}</dd></div>
                </dl>
              </article>)}
            </TabsContent>
            <TabsContent value="products" className="space-y-4 pt-3">
              {result.products.map((item, index) => <article key={index} className="rounded-lg border border-border bg-card p-5">
                <p className="mb-1 break-words text-xs font-medium uppercase tracking-wide text-primary-glow">{item.category}</p><h3 className="break-words text-lg font-semibold">{item.name}</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{item.description}</p>
                <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
                  <div><dt className="font-medium">Recommended CTA Button</dt><dd className="mt-1 break-words text-muted-foreground">{item.cta}</dd></div>
                  <div><dt className="font-medium">Target Landing Page URL</dt><dd className="mt-1"><a href={item.landingPage} target="_blank" rel="noopener noreferrer" className="break-all text-primary-glow underline underline-offset-4">{item.landingPage}</a></dd></div>
                  <div><dt className="font-medium">Asset Checklist</dt><dd><ul className="mt-2 space-y-2">{item.assets.map((asset, i) => <li key={i} className="flex items-start gap-2 text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span className="break-words">{asset}</span></li>)}</ul></dd></div>
                </dl>
              </article>)}
            </TabsContent>
          </>}
        </Tabs>
      </section>
    </div>
    <ApiKeyDialog open={keyOpen} onOpenChange={setKeyOpen} />
  </div>;
}