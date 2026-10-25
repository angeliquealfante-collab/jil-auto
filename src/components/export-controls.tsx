import { useState } from "react";
import { Check, Copy, FileDown, Braces } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { recordsToCsv, type ExportRow } from "@/lib/export-data";

export function ExportControls({ data, text, rows, filename, disabled = false }: { data: unknown; text?: string; rows?: ExportRow[]; filename: string; disabled?: boolean }) {
  const [copied, setCopied] = useState("");
  async function copy(kind: "text" | "json") {
    try { await navigator.clipboard.writeText(kind === "json" ? JSON.stringify(data, null, 2) : text ?? ""); setCopied(kind); toast.success(kind === "json" ? "JSON copied" : "Text copied"); setTimeout(() => setCopied(""), 2000); }
    catch { toast.error("Copy failed. Please try again."); }
  }
  function download() {
    if (!rows) return;
    const url = URL.createObjectURL(new Blob(["\uFEFF" + recordsToCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${filename}.csv`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="flex flex-wrap gap-2">
    {text !== undefined && <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => copy("text")}>{copied === "text" ? <Check className="text-success" /> : <Copy />}{copied === "text" ? "Copied!" : "Copy Raw Text"}</Button>}
    <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => copy("json")}>{copied === "json" ? <Check className="text-success" /> : <Braces />}{copied === "json" ? "Copied!" : "Copy JSON"}</Button>
    {rows && <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={download}><FileDown />Export to CSV</Button>}
  </div>;
}