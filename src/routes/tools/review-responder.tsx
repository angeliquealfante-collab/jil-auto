import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareReply } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/tools/review-responder")({
  head: () => ({
    meta: [
      { title: "Review Responder — JIL" },
      { name: "description", content: "Draft on-brand replies to every Google review in seconds." },
      { property: "og:title", content: "Review Responder — JIL" },
      { property: "og:description", content: "Draft on-brand replies to every Google review in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ToolPage
      icon={MessageSquareReply}
      title="GBP Review Reply Instant Drafter"
      tagline="Module 02 · Coming soon"
      description="Turn every Google review — glowing or rough — into an on-brand reply your client can post as-is."
      upcoming={[
        "Paste or import reviews and get ready-to-post replies",
        "Tone presets matched to each client's brand voice",
        "Automatic escalation notes for reviews that need a human first",
        "Bulk reply queue for multi-location clients",
      ]}
    />
  ),
});
