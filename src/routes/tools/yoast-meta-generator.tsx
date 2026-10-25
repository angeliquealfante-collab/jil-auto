import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/tools/yoast-meta-generator")({
  head: () => ({
    meta: [
      { title: "Yoast Meta Generator — JIL" },
      { name: "description", content: "Generate SEO titles and meta descriptions, ready to paste into Yoast." },
      { property: "og:title", content: "Yoast Meta Generator — JIL" },
      { property: "og:description", content: "Generate SEO titles and meta descriptions, ready to paste into Yoast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ToolPage
      icon={FileText}
      title="SEO Meta Description & Title Engine"
      tagline="Module 01 · Yoast Optimized · Coming soon"
      description="Generate SEO titles and meta descriptions that fit Yoast's length limits, page by page or in bulk."
      upcoming={[
        "Paste a page URL or content and get title + description drafts instantly",
        "Live character counts matching Yoast's SERP preview limits",
        "Bulk mode: generate metas for an entire sitemap at once",
        "One-click copy, formatted for direct paste into Yoast fields",
      ]}
    />
  ),
});
