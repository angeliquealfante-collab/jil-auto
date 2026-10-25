import { useState, type FormEvent } from "react";
import { CalendarDays, Check, Copy, FileDown, KeyRound, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { calendarInputSchema, calendarPostSchema, calendarToCsv, calendarToText, ctaOptions, generateCalendar, mondayDates, wordCount, type CalendarInputs, type CalendarRow } from "@/lib/content-calendar";

const fields = [
  { key: "business", label: "Business Name & Industry", placeholder: "Your business, industry" },
  { key: "core", label: "Core Services & Products", placeholder: "Services and products, one per line", multiline: true },
  { key: "primary", label: "Primary Service", placeholder: "Your main service" },
  { key: "secondary", label: "Secondary Services", placeholder: "Supporting services", multiline: true },
  { key: "locations", label: "Target Cities / Regions", placeholder: "Cities or regions you serve" },
  { key: "tone", label: "Brand Tone", placeholder: "e.g. Professional & warm" },
  { key: "website", label: "Website URL", placeholder: "https://yourbusiness.com", url: true },
  { key: "pages", label: "Available Service Pages (Optional)", placeholder: "Service names and their full URLs", multiline: true, optional: true },
  { key: "promotions", label: "Current Promotions or Seasonal Priorities (Optional)", placeholder: "Offers, seasonal priorities, and applicable dates", multiline: true, optional: true },
] as const;

export function ContentCalendar() {
  const [inputs, setInputs] = useState<CalendarInputs>({ business: "", core: "", primary: "", secondary: "", locations: "", tone: "", website: "", pages: "", promotions: "", startDate: "" });
  const [rows, setRows] = useState<CalendarRow[]>([]);
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyOpen, setKeyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  let firstMonday = "";
  try { firstMonday = mondayDates(inputs.startDate)[0] ?? ""; } catch { /* No valid date selected yet. */ }
  const validRows = rows.length === 12 && rows.every((row) => calendarPostSchema.safeParse(row).success);

  function update(index: number, key: "topic" | "targetService" | "copy" | "cta" | "link", value: string) {
    setRows((current) => current.map((row, i) => i === index ? { ...row, [key]: value } as CalendarRow : row)); setCopied(false);
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (loading) return; setError("");
    const parsed = calendarInputSchema.safeParse(inputs);
    if (!parsed.success) { setError("Complete the required fields, a valid website URL, and start date."); return; }
    let key = "";
    try { key = localStorage.getItem("jil_gemini_api_key")?.trim() ?? ""; }
    catch { setError("Browser storage is unavailable. Enable it to connect your key."); return; }
    if (!key) { setError("Connect your Gemini API key to generate a calendar."); setKeyOpen(true); return; }
    setLoading(true); setCopied(false);
    try { setRows(await generateCalendar(parsed.data, key)); setBusiness(parsed.data.business); toast.success("12-week calendar generated"); }
    catch (err) { setError(err instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(err.name) ? err.message : "Couldn't reach Gemini. Check your connection or try again."); }
    finally { setLoading(false); }
  }
  function exportCsv() {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + calendarToCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "jil-gbp-12-week-calendar.csv"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(calendarToText(rows, business)); setCopied(true); toast.success("Full calendar copied"); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error("Copy failed. Export to CSV instead."); }
  }
  return <div className="min-w-0 max-w-7xl">
    <p className="mb-3 text-xs uppercase tracking-widest text-primary-glow">Module 04 · Content planning</p>
    <div className="flex items-start gap-3"><CalendarDays className="mt-1 hidden h-7 w-7 shrink-0 text-primary-glow sm:block" /><h1 className="text-3xl font-semibold">12-Week GBP Content Calendar Generator</h1></div>
    <form onSubmit={submit} className="mt-8 border-t border-border pt-5">
      <h2 className="mb-5 text-lg font-semibold">Business & schedule</h2>
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => <div key={field.key} className="min-w-0"><label htmlFor={`calendar-${field.key}`} className="mb-2 block text-sm font-medium">{field.label}</label>
          {"multiline" in field ? <Textarea id={`calendar-${field.key}`} required={!("optional" in field)} value={inputs[field.key]} onChange={(event) => setInputs((prev) => ({ ...prev, [field.key]: event.target.value }))} placeholder={field.placeholder} disabled={loading} className="min-h-24 resize-y" /> : <Input id={`calendar-${field.key}`} type={"url" in field ? "url" : "text"} required value={inputs[field.key]} onChange={(event) => setInputs((prev) => ({ ...prev, [field.key]: event.target.value }))} placeholder={field.placeholder} disabled={loading} />}
        </div>)}
        <div className="min-w-0"><label htmlFor="calendar-start" className="mb-2 block text-sm font-medium">Start Date</label><Input id="calendar-start" type="date" required value={inputs.startDate} onChange={(event) => setInputs((prev) => ({ ...prev, startDate: event.target.value }))} disabled={loading} />{firstMonday && <p className="mt-2 text-xs text-muted-foreground">First Monday: {firstMonday}</p>}</div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3"><Button type="submit" disabled={loading}>{loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{loading ? "Planning 12 weeks…" : rows.length ? "Regenerate calendar" : "Generate calendar"}</Button><Button type="button" variant="ghost" onClick={() => setKeyOpen(true)}><KeyRound />Gemini API Key</Button></div>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    </form>
    <section aria-label="Content calendar" aria-busy={loading} className="mt-10 min-w-0 border-t border-border pt-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">{rows.length ? business : "Your calendar"}</h2>{rows.length > 0 && <p className="mt-1 text-sm text-muted-foreground">12 posts · {rows[0]?.date} — {rows[11]?.date}</p>}</div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" disabled={!validRows || loading} onClick={exportCsv}><FileDown />Export to CSV</Button><Button variant="outline" size="sm" disabled={!validRows || loading} onClick={copy}>{copied ? <Check className="text-success" /> : <Copy />}{copied ? "Copied!" : "Copy Full Calendar"}</Button></div></div>
      {!rows.length ? <div className="flex min-h-64 flex-col items-center justify-center gap-4 border-y border-dashed border-border text-muted-foreground"><CalendarDays className="h-8 w-8 text-primary-glow" /><p role="status">{loading ? "Planning your calendar…" : "No calendar yet"}</p></div> : <>
        {!validRows && <p role="alert" className="mb-4 text-sm text-warning">Each post needs a topic, target service, valid URL, and 50–120 words before export or copying.</p>}
        <div className="max-w-full overflow-x-auto rounded-lg border border-border" tabIndex={0} aria-label="Calendar table"><table className="w-full min-w-[1500px] table-fixed text-left text-sm">
          <colgroup><col className="w-28" /><col className="w-16" /><col className="w-36" /><col className="w-48" /><col className="w-40" /><col className="w-[460px]" /><col className="w-36" /><col className="w-56" /></colgroup>
          <thead className="bg-muted text-muted-foreground"><tr>{["Date", "Week", "Post Type", "Topic", "Target Service", "Full Post Copy", "CTA Button", "Target Link URL"].map((label) => <th key={label} className="p-3 font-medium">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">{rows.map((row, index) => { const count = wordCount(row.copy); return <tr key={row.week} className="align-top">
            <td className="p-3"><time dateTime={row.date}>{row.date}</time><span className="mt-1 block text-xs text-muted-foreground">Monday</span></td><td className="p-3 font-medium">{row.week.toString().padStart(2, "0")}</td><td className="p-3 text-primary-glow">{row.postType}</td>
            <td className="p-3"><Textarea aria-label={`Week ${row.week} topic`} value={row.topic} onChange={(e) => update(index, "topic", e.target.value)} disabled={loading} className="min-h-24" /></td>
            <td className="p-3"><Textarea aria-label={`Week ${row.week} target service`} value={row.targetService} onChange={(e) => update(index, "targetService", e.target.value)} disabled={loading} className="min-h-24" /></td>
            <td className="p-3"><Textarea aria-label={`Week ${row.week} post copy`} value={row.copy} onChange={(e) => update(index, "copy", e.target.value)} disabled={loading} aria-invalid={count < 50 || count > 120} className="min-h-52 leading-relaxed" /><p className={`mt-2 text-xs ${count >= 50 && count <= 120 ? "text-success" : "text-warning"}`}>{count} / 50–120 words</p></td>
            <td className="p-3"><Select value={row.cta} onValueChange={(value) => update(index, "cta", value)} disabled={loading}><SelectTrigger aria-label={`Week ${row.week} CTA Button`}><SelectValue /></SelectTrigger><SelectContent>{ctaOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></td>
            <td className="p-3"><Textarea aria-label={`Week ${row.week} target link URL`} value={row.link} onChange={(e) => update(index, "link", e.target.value)} disabled={loading} className="min-h-24 break-all" /></td>
          </tr>; })}</tbody>
        </table></div>
      </>}
    </section>
    <ApiKeyDialog open={keyOpen} onOpenChange={setKeyOpen} />
  </div>;
}