import { describe, expect, it, vi, afterEach } from "vitest";
import { buildReviewPrompt, generateReviewReply, reviewInputSchema, reviewTones } from "@/lib/review-reply";

const inputs = { review: "Friendly staff and quick service", rating: 5, business: "City Plumbing, Singapore", tone: "Professional & Warm" as const };
afterEach(() => vi.unstubAllGlobals());
describe("Review reply rules", () => {
  it("accepts integer ratings 1 through 5 only", () => {
    for (const rating of [1, 2, 3, 4, 5]) expect(reviewInputSchema.safeParse({ ...inputs, rating }).success).toBe(true);
    for (const rating of [0, 6, 1.5]) expect(reviewInputSchema.safeParse({ ...inputs, rating }).success).toBe(false);
  });
  it("accepts exactly the three requested tones", () => {
    expect(reviewTones).toEqual(["Professional & Warm", "Friendly & Casual", "Professional Apology for Low Ratings"]);
    for (const tone of reviewTones) expect(reviewInputSchema.safeParse({ ...inputs, tone }).success).toBe(true);
    expect(reviewInputSchema.safeParse({ ...inputs, tone: "Sarcastic" }).success).toBe(false);
  });
  it("requires a review and business/service area", () => {
    expect(reviewInputSchema.safeParse({ ...inputs, review: " " }).success).toBe(false);
    expect(reviewInputSchema.safeParse({ ...inputs, business: " " }).success).toBe(false);
  });
  it("passes the chosen review, rating, business and tone to Gemini", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "Thank you for choosing City Plumbing in Singapore!" }] } }] })));
    vi.stubGlobal("fetch", fetchMock);
    const lowRating = { ...inputs, rating: 1, tone: reviewTones[2] };
    const reply = await generateReviewReply(lowRating, "test-key-not-real");
    expect(reply).toBe("Thank you for choosing City Plumbing in Singapore!");
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
    expect(request.headers["x-goog-api-key"]).toBe("test-key-not-real");
    const prompt = JSON.parse(request.body).contents[0].parts[0].text;
    expect(prompt).toBe(buildReviewPrompt(lowRating));
    expect(prompt).toContain(JSON.stringify(lowRating));
  });
});