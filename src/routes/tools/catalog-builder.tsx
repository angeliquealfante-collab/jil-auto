import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/tools/catalog-builder")({
  head: () => ({
    meta: [
      { title: "Catalog Builder — JIL" },
      { name: "description", content: "Build product and service listings in bulk, formatted for GBP." },
      { property: "og:title", content: "Catalog Builder — JIL" },
      { property: "og:description", content: "Build product and service listings in bulk, formatted for GBP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ToolPage
      icon={LayoutGrid}
      title="GBP Services & Products Catalog Builder"
      tagline="Module 03 · Coming soon"
      description="Build complete product and service catalogs in bulk, structured the way Google Business Profile expects."
      upcoming={[
        "Import a price list or inventory sheet and generate full listings",
        "Descriptions written to GBP field limits, ready to paste",
        "Collection grouping so related services publish together",
        "Export as CSV or direct copy blocks per item",
      ]}
    />
  ),
});
