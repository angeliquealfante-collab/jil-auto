import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/tools/prompt-vault")({
  head: () => ({ meta: [
    { title: "Agency Prompt Vault & Library — JIL" },
    { name: "description", content: "A dedicated library for custom agency prompts and reusable templates." },
    { property: "og:title", content: "Agency Prompt Vault & Library — JIL" },
    { property: "og:description", content: "A dedicated library for custom agency prompts and reusable templates." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ToolPage icon={BookOpen} title="Custom Agency Prompt Vault & Library" tagline="Module 05 · Coming soon" description="Your agency’s reusable prompts and templates, together in one library." upcoming={["Save custom prompts with titles and categories", "Find templates by client or workflow", "Reuse brand voice and local SEO prompt templates", "Copy a prompt for your next client task"]} />,
});