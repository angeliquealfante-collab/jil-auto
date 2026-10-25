import { useState, type FormEvent } from "react";
import { Check, Copy, KeyRound, LoaderCircle, MessageSquareReply, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKeyDialog } from "@/components/api-key-dialog";
import { generateReviewReply, reviewTones, type ReviewInputs } from "@/lib/review-reply";

export function ReviewReplyDrafter() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("5");
  const [business, setBusiness] = useState("");
  const [tone, setTone] = useState<ReviewInputs["tone"]>("Professional & Warm");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyOpen, setKeyOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError("");
    let key = "";
    try { key = localStorage.getItem("jil_gemini_api_key")?.trim() ?? ""; }
    catch { setError("Browser storage is unavailable. Enable it to connect your key."); return; }
    if (!key) { setError("Connect your Gemini API key to draft a reply."); setKeyOpen(true); return; }
    setLoading(true); setCopied(false);
    try {
      setReply(await generateReviewReply({ review, rating: Number(rating), business, tone }, key));
      toast.success("Review reply drafted");
    } catch (err) {
      setError(err instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(err.name) ? err.message : "Couldn't reach Gemini. Check your connection or try again.");
    } finally { setLoading(false); }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      toast.success("Reply copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Copy failed. Please select and copy the reply manually."); }
  }

  return <div className="max-w-5xl">
    <p className="mb-3 text-xs uppercase tracking-widest text-primary-glow">Module 02 · Reviews & reputation</p>
    <div className="flex items-start gap-3"><MessageSquareReply className="mt-1 hidden h-7 w-7 shrink-0 text-primary-glow sm:block" /><h1 className="text-3xl font-semibold">GBP Review Reply Instant Drafter</h1></div>
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-5 border-t border-border pt-5">
        <h2 className="text-lg font-semibold">Review details</h2>
        <div><label htmlFor="customer-review" className="mb-2 block text-sm font-medium">Customer Review Text</label><Textarea id="customer-review" required value={review} onChange={(e) => setReview(e.target.value)} placeholder="Paste the customer’s review…" disabled={loading} className="min-h-36 resize-y" /></div>
        <div><label htmlFor="star-rating" className="mb-2 block text-sm font-medium">Star Rating</label><Select value={rating} onValueChange={setRating} disabled={loading}><SelectTrigger id="star-rating"><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5].map((value) => <SelectItem key={value} value={String(value)}><span className="flex items-center gap-2"><Star className="h-4 w-4 text-warning" />{value} {value === 1 ? "Star" : "Stars"}</span></SelectItem>)}</SelectContent></Select></div>
        <div><label htmlFor="review-business" className="mb-2 block text-sm font-medium">Business Name & Main Service Area</label><Input id="review-business" required value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Your business, Singapore" disabled={loading} /></div>
        <div><label htmlFor="desired-tone" className="mb-2 block text-sm font-medium">Desired Tone</label><Select value={tone} onValueChange={(value) => { const selected = reviewTones.find((item) => item === value); if (selected) setTone(selected); }} disabled={loading}><SelectTrigger id="desired-tone"><SelectValue /></SelectTrigger><SelectContent className="max-w-[calc(100vw-2rem)]">{reviewTones.map((value) => <SelectItem key={value} value={value} className="whitespace-normal">{value}</SelectItem>)}</SelectContent></Select></div>
        <Button type="submit" className="w-full" disabled={loading || !review.trim() || !business.trim()}>{loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Sparkles />}{loading ? "Drafting…" : reply ? "Regenerate reply" : "Draft reply"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setKeyOpen(true)}><KeyRound />Gemini API Key</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>
      <section aria-label="Drafted reply" aria-busy={loading} className="border-t border-border pt-5">
        <h2 className="mb-5 text-lg font-semibold">Your reply</h2>
        {reply ? <><Textarea aria-label="Review reply" value={reply} onChange={(e) => { setReply(e.target.value); setCopied(false); }} className="min-h-64 resize-y leading-relaxed" disabled={loading} /><Button type="button" variant="outline" className="mt-4 h-auto min-h-9 w-full whitespace-normal py-2 sm:w-auto" onClick={copy} disabled={loading || !reply.trim()}>{copied ? <Check className="text-success" /> : <Copy />}{copied ? "Copied!" : "Copy Reply to Clipboard"}</Button></> : <div className="flex min-h-64 flex-col items-center justify-center gap-4 border-y border-dashed border-border text-muted-foreground"><MessageSquareReply className="h-8 w-8 text-primary-glow" /><p role="status">{loading ? "Drafting your reply…" : "No reply yet"}</p></div>}
      </section>
    </div>
    <ApiKeyDialog open={keyOpen} onOpenChange={setKeyOpen} />
  </div>;
}