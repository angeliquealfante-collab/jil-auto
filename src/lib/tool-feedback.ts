import { useState } from "react";
import { toast } from "sonner";

export function useToolError() {
  const [error, setError] = useState("");
  function reportError(message: string) {
    setError(message);
    if (message) toast.error(message);
  }
  return [error, reportError] as const;
}