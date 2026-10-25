import { afterEach, describe, expect, it, vi } from "vitest";
import { calendarInputSchema, calendarPostSchema, calendarToCsv, calendarToText, generateCalendar, mondayDates, parseCalendar, postCycle } from "@/lib/content-calendar";
const inputs = { business: "City Plumbing, Plumbing", core: "Repairs", primary: "Leak repair", secondary: "Maintenance", locations: "Singapore", tone: "Warm", website: "https://example.com", pages: "", promotions: "", startDate: "2026-10-25" };
const posts = Array.from({ length: 12 }, (_, i) => ({ topic: `Topic ${i}`, targetService: "Leak repair", copy: `Hook${i} ` + Array(54).fill("word").join(" "), cta: "Learn more", link: "https://example.com" }));
afterEach(() => vi.unstubAllGlobals());
describe("Content calendar rules", () => {
  it("produces 12 consecutive Mondays on or after the selected start date", () => {
    const dates = mondayDates("2026-10-25");
    expect(dates).toHaveLength(12); expect(dates[0]).toBe("2026-10-26"); expect(dates[11]).toBe("2027-01-11");
    expect(mondayDates("2026-10-26")[0]).toBe("2026-10-26");
    expect(mondayDates("2026-10-27")[0]).toBe("2026-11-02");
    for (const date of dates) expect(new Date(`${date}T00:00:00Z`).getUTCDay()).toBe(1);
    expect(() => mondayDates("2026-02-30")).toThrow();
  });
  it("repeats the specified six-post cycle exactly twice", () => {
    const rows = parseCalendar(JSON.stringify({ posts }), inputs.startDate);
    expect(rows.map((row) => row.postType)).toEqual([...postCycle, ...postCycle]);
    expect(postCycle).toEqual(["Business Intro", "Founder/Team Story", "Primary Service", "Secondary Service", "Social Proof", "CTA/Offer"]);
    expect(rows.map((row) => row.week)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });
  it("requires 50–120 words inclusive", () => {
    for (const count of [50, 120]) expect(calendarPostSchema.safeParse({ ...posts[0], copy: Array(count).fill("word").join(" ") }).success).toBe(true);
    for (const count of [49, 121]) expect(calendarPostSchema.safeParse({ ...posts[0], copy: Array(count).fill("word").join(" ") }).success).toBe(false);
  });
  it("rejects repeated hooks in the second cycle and non-twelve results", () => {
    expect(() => parseCalendar(JSON.stringify({ posts: posts.slice(0, 6) }), inputs.startDate)).toThrow();
    expect(() => parseCalendar(JSON.stringify({ posts: posts.map((post, i) => i === 6 ? { ...post, copy: posts[0]?.copy } : post) }), inputs.startDate)).toThrow();
  });
  it("validates required inputs and disallows unsafe links", () => {
    expect(calendarInputSchema.safeParse(inputs).success).toBe(true);
    for (const key of ["business", "core", "primary", "secondary", "locations", "tone", "website", "startDate"]) expect(calendarInputSchema.safeParse({ ...inputs, [key]: "" }).success).toBe(false);
    expect(calendarPostSchema.safeParse({ ...posts[0], link: "javascript:alert(1)" }).success).toBe(false);
  });
  it("exports all twelve posts with ClickUp-mappable name and due date columns", () => {
    const rows = parseCalendar(JSON.stringify({ posts }), inputs.startDate);
    const csv = calendarToCsv(rows);
    expect(csv.split("\r\n")).toHaveLength(13); expect(csv).toContain('"Name","Due Date","Date","Week"');
    expect(csv).toContain('"2027-01-11"'); expect(csv).toContain('"Topic 11"');
    const copied = calendarToText(rows, inputs.business);
    expect(copied).toContain("Week 12 | 2027-01-11 | CTA/Offer"); expect(copied).toContain(posts[11]?.copy);
  });
  it("uses the connected Google key and validates structured responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ posts }) }] } }] })));
    vi.stubGlobal("fetch", fetchMock);
    expect(await generateCalendar(inputs, "test-key-not-real")).toHaveLength(12);
    const call = fetchMock.mock.calls[0]; if (!call) throw new Error("Expected request");
    expect(call[1].headers["x-goog-api-key"]).toBe("test-key-not-real");
    expect(JSON.parse(call[1].body).contents[0].parts[0].text).toContain(JSON.stringify(inputs));
  });
});