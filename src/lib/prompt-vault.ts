import { z } from "zod";

export const promptTags = ["#GBP", "#SEO", "#Copywriting", "#Reviews", "#Automation"] as const;
export const promptSchema = z.object({ id: z.string().min(1), title: z.string().trim().min(1), content: z.string().trim().min(1), tags: z.array(z.enum(promptTags)).min(1) });
export type AgencyPrompt = z.infer<typeof promptSchema>;
export const vaultStorageKey = "jil_prompt_vault";

// Preserve the user-provided frameworks verbatim rather than substituting AI-written versions.
export const servicesFramework = `#### Module 3: GBP Services & Products Catalog Builder - User Inputs (Form Layout): - Business Name - Primary Business Category - Target Locations / Cities - Website URL - Main Services List - Main Products or Packages List - Existing GBP Services (Optional) - Automation Output (Structured Tabbed View): 1. Competitor Gap Analysis: Categorized into High-Priority Services, Secondary Services, and Services Needing Confirmation. 2. Services Catalog: Tables/Cards with Service Name, SEO Description, Target Location inclusion, and Canva/Photo Type Guidance. 3. Product Cards: Product Name, Category, SEO Description, Recommended CTA Button, Target Landing Page URL, and Asset Checklist. - Features: "Export to CSV", "Download Markdown", and "Copy All" buttons.`;
export const calendarFramework = `#### Module 4: 12-Week GBP Content Calendar Generator - User Inputs: - Business Name & Industry - Core Services & Products - Primary Service & Secondary Services - Target Cities / Regions - Brand Tone - Website URL & Available Service Pages - Current Promotions or Seasonal Priorities - Automation Engine: - Generates a 12-week rotation running a 6-post cycle twice (Week 1: Business Intro, Week 2: Founder/Team Story, Week 3: Primary Service, Week 4: Secondary Service, Week 5: Social Proof, Week 6: CTA/Offer; repeated with new hooks for Weeks 7-12). - Dates automatically populate across sequential Mondays starting from the selected start date. - Output UI: A full interactive grid/table displaying: - Date | Week | Post Type | Topic | Target Service | Full Post Copy (50-120 words with hooks and CTAs) | CTA Button | Target Link URL. - Features: "Export to CSV" (formatted for Google Sheets & ClickUp import) and "Copy Full Calendar".`;
export const standardPrompts: AgencyPrompt[] = [
  { id: "services-framework", title: "Services & Products — Exact Framework", tags: ["#GBP", "#Automation"], content: servicesFramework },
  { id: "calendar-framework", title: "12-Week GBP Posts — Exact Framework", tags: ["#GBP", "#Copywriting", "#Automation"], content: calendarFramework },
  { id: "seo-meta", title: "Yoast SEO Titles & Meta Descriptions", tags: ["#SEO", "#Copywriting"], content: `Create exactly 3 unique high-CTR SEO titles and meta descriptions for:\nPage/Post Title: [TITLE]\nPrimary Focus Keyphrase: [KEYPHRASE]\nBusiness Name / Location: [BUSINESS, LOCATION]\nTitles must be 50–60 characters and descriptions 150–160 characters, including spaces. Include the keyphrase naturally. Vary the angle and CTA, without inventing facts, offers or claims. Return a JSON object with a variations array, each with title and description.` },
  { id: "review-reply", title: "GBP Review Reply", tags: ["#GBP", "#Reviews", "#Copywriting"], content: `Draft one short, polite local SEO review reply (2–4 sentences).\nCustomer Review: [REVIEW]\nStar Rating: [1–5]\nBusiness Name & Main Service Area: [BUSINESS, AREA]\nDesired Tone: [Professional & Warm / Friendly & Casual / Professional Apology for Low Ratings]\nAcknowledge specific review details and use local keywords naturally without repetition. Do not invent services, contact details, promises or compensation. For low ratings, apologize for the experience without unsupported admissions. Return only the reply.` },
  { id: "automation-audit", title: "Agency Workflow Audit", tags: ["#Automation", "#SEO"], content: `Review this local SEO agency workflow: [WORKFLOW]. Identify repetitive tasks, required inputs, approval checkpoints, and quality checks. Return a prioritized table of task, automation opportunity, human review requirement, and expected output. Never invent access to tools or client data.` },
];
export function parseSavedPrompts(value: string | null) { return value ? z.array(promptSchema).parse(JSON.parse(value)) : []; }
export function mergePrompts(saved: AgencyPrompt[]) {
  const replacements = new Map(saved.map((prompt) => [prompt.id, prompt]));
  return [...standardPrompts.map((prompt) => replacements.get(prompt.id) ?? prompt), ...saved.filter((prompt) => !standardPrompts.some((item) => item.id === prompt.id))];
}
export function filterPrompts(prompts: AgencyPrompt[], query: string, tags: string[]) {
  const term = query.trim().toLowerCase();
  return prompts.filter((prompt) => (!term || `${prompt.title}\n${prompt.content}\n${prompt.tags.join(" ")}`.toLowerCase().includes(term)) && tags.every((tag) => prompt.tags.some((item) => item === tag)));
}