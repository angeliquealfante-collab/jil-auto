import { createFileRoute } from "@tanstack/react-router";
import { SeoMetaEngine } from "@/components/seo-meta-engine";

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
  component: SeoMetaEngine,
});
