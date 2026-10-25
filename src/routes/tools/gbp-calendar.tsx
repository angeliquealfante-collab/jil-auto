import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/tools/gbp-calendar")({
  head: () => ({
    meta: [
      { title: "12-Week GBP Calendar — JIL" },
      { name: "description", content: "A full quarter of Google Business Profile posts, planned in minutes." },
      { property: "og:title", content: "12-Week GBP Calendar — JIL" },
      { property: "og:description", content: "A full quarter of Google Business Profile posts, planned in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ToolPage
      icon={CalendarDays}
      title="12-Week GBP Content Calendar Generator"
      tagline="Module 04 · Coming soon"
      description="Plan a full quarter of Google Business Profile posts from one input — no blank-page Monday mornings."
      upcoming={[
        "Generate a 12-week posting schedule from the client's services and offers",
        "Weekly post drafts with categories, CTAs, and local keywords",
        "Rotation logic so offers, updates, and events stay balanced",
        "Export the whole quarter as a shareable content calendar",
      ]}
    />
  ),
});
