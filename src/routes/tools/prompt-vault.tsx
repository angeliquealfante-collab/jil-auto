import { createFileRoute } from "@tanstack/react-router";
import { PromptVault } from "@/components/prompt-vault";

export const Route = createFileRoute("/tools/prompt-vault")({
  head: () => ({ meta: [
    { title: "Agency Prompt Vault & Library — JIL" },
    { name: "description", content: "A dedicated library for custom agency prompts and reusable templates." },
    { property: "og:title", content: "Agency Prompt Vault & Library — JIL" },
    { property: "og:description", content: "A dedicated library for custom agency prompts and reusable templates." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PromptVault,
});