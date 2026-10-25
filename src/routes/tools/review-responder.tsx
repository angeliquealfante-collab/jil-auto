import { createFileRoute } from "@tanstack/react-router";
import { ReviewReplyDrafter } from "@/components/review-reply-drafter";

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
  component: ReviewReplyDrafter,
});
