import { createFileRoute } from "@tanstack/react-router";
import { ContentCalendar } from "@/components/content-calendar";

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
  component: ContentCalendar,
});
