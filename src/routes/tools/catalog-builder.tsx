import { createFileRoute } from "@tanstack/react-router";
import { CatalogBuilder } from "@/components/catalog-builder";

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
  component: CatalogBuilder,
});
