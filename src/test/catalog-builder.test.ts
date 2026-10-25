import { afterEach, describe, expect, it, vi } from "vitest";
import { catalogInputSchema, catalogResultSchema, catalogToCsv, catalogToMarkdown, csvCell, generateCatalog, type CatalogResult } from "@/lib/catalog-builder";

const inputs = { business: "City Plumbing", category: "Plumber", locations: "Singapore", website: "https://example.com", services: "Leak repair", products: "Maintenance package" };
export const catalog: CatalogResult = {
  gaps: { highPriority: [{ name: "Leak repair", reason: "Not in the existing services" }], secondary: [], needsConfirmation: [{ name: "Drain inspection", reason: "Confirm availability" }] },
  services: [{ name: "Leak repair", description: "Leak repairs in Singapore.", location: "Singapore", photoGuidance: "A real repair photo" }],
  products: [{ name: "Maintenance package", category: "Maintenance", description: "Plumbing maintenance in Singapore.", cta: "Learn more", landingPage: "https://example.com", assets: ["Package photo", "Business logo"] }],
};
afterEach(() => vi.unstubAllGlobals());
describe("Catalog builder", () => {
  it("requires the six core inputs while existing GBP services are optional", () => {
    expect(catalogInputSchema.safeParse(inputs).success).toBe(true);
    for (const key of ["business", "category", "locations", "website", "services", "products"]) expect(catalogInputSchema.safeParse({ ...inputs, [key]: " " }).success).toBe(false);
    expect(catalogInputSchema.parse(inputs).existingServices).toBe("");
  });
  it("accepts only http/https website and landing page URLs", () => {
    expect(catalogInputSchema.safeParse({ ...inputs, website: "javascript:alert(1)" }).success).toBe(false);
    expect(catalogResultSchema.safeParse({ ...catalog, products: [{ ...catalog.products[0], landingPage: "javascript:alert(1)" }] }).success).toBe(false);
  });
  it("requires all three gap categories and every service and product output field", () => {
    expect(catalogResultSchema.safeParse(catalog).success).toBe(true);
    expect(catalogResultSchema.safeParse({ ...catalog, gaps: { highPriority: [] } }).success).toBe(false);
    for (const key of ["name", "description", "location", "photoGuidance"]) expect(catalogResultSchema.safeParse({ ...catalog, services: [{ ...catalog.services[0], [key]: undefined }] }).success).toBe(false);
    for (const key of ["name", "category", "description", "cta", "landingPage", "assets"]) expect(catalogResultSchema.safeParse({ ...catalog, products: [{ ...catalog.products[0], [key]: undefined }] }).success).toBe(false);
  });
  it("exports all gap, service and product records in CSV and Markdown", () => {
    const csv = catalogToCsv(catalog);
    expect(csv.split("\r\n")).toHaveLength(5);
    for (const value of ["High-Priority Services", "Services Needing Confirmation", "Leak repair", "Singapore", "A real repair photo", "Maintenance package", "Learn more", "https://example.com", "Package photo; Business logo"]) expect(csv).toContain(value);
    const markdown = catalogToMarkdown(catalog, inputs.business);
    for (const value of ["City Plumbing", "Secondary Services", "Drain inspection", "A real repair photo", "Maintenance package", "Business logo"]) expect(markdown).toContain(value);
  });
  it("quotes CSV punctuation and neutralizes spreadsheet formulas", () => {
    expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"');
    expect(csvCell("=HYPERLINK(1)")).toBe('"\'=HYPERLINK(1)"');
  });
  it("sends business data through the shared Google helper and validates results", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(catalog) }] } }] })));
    vi.stubGlobal("fetch", fetchMock);
    expect(await generateCatalog(inputs, "test-key-not-real")).toEqual(catalog);
    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("Expected a request");
    expect(call[1].headers["x-goog-api-key"]).toBe("test-key-not-real");
    const body = JSON.parse(call[1].body);
    expect(body.generationConfig.responseMimeType).toBe("application/json");
    expect(body.contents[0].parts[0].text).toContain(JSON.stringify(catalogInputSchema.parse(inputs)));
  });
  it("rejects malformed Gemini output with a safe error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }] }))));
    await expect(generateCatalog(inputs, "test-key-not-real")).rejects.toThrow("Gemini returned an incomplete catalog");
  });
});