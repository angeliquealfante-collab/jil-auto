import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ApiKeyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [key, setKey] = useState("");
  useEffect(() => {
    if (open) {
      try { setKey(localStorage.getItem("jil_gemini_api_key") ?? ""); }
      catch { setKey(""); toast.error("Browser storage is unavailable. Your saved key could not be loaded."); }
    }
  }, [open]);
  function save() {
    try {
      if (key.trim()) localStorage.setItem("jil_gemini_api_key", key.trim());
      else localStorage.removeItem("jil_gemini_api_key");
    } catch { toast.error("Couldn't save your key. Enable browser storage and try again."); return; }
    toast.success(key.trim() ? "API key saved" : "API key cleared");
    onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass">
      <DialogHeader><DialogTitle>Gemini API Key</DialogTitle><DialogDescription>Saved in this browser, not encrypted. Sent directly to Google when generating. Use a restricted key on a trusted device.</DialogDescription></DialogHeader>
      <Input aria-label="Gemini API Key" type="password" placeholder="AIza..." value={key} onChange={(event) => setKey(event.target.value)} />
      <DialogFooter><Button onClick={save} className="glow">Save key</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}