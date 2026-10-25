import { FileText, MessageSquareReply, LayoutGrid, CalendarDays, BookOpen } from "lucide-react";

export const workspaceTools = [
  { number: "01", icon: FileText, label: "SEO Meta Engine", title: "SEO Meta Description & Title Engine", detail: "Yoast Optimized", description: "SEO titles and meta descriptions for your clients’ pages.", to: "/tools/yoast-meta-generator" },
  { number: "02", icon: MessageSquareReply, label: "Review Reply Drafter", title: "GBP Review Reply Instant Drafter", detail: "Reviews & reputation", description: "On-brand replies to Google Business Profile reviews.", to: "/tools/review-responder" },
  { number: "03", icon: LayoutGrid, label: "Services & Products", title: "GBP Services & Products Catalog Builder", detail: "Business listings", description: "Organized service and product listings for local businesses.", to: "/tools/catalog-builder" },
  { number: "04", icon: CalendarDays, label: "12-Week GBP Calendar", title: "12-Week GBP Content Calendar Generator", detail: "Content planning", description: "A quarter of Google Business Profile content, planned together.", to: "/tools/gbp-calendar" },
  { number: "05", icon: BookOpen, label: "Agency Prompt Vault", title: "Custom Agency Prompt Vault & Library", detail: "Agency resources", description: "A dedicated home for reusable agency prompts and templates.", to: "/tools/prompt-vault" },
] as const;