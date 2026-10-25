import { describe, expect, it } from "vitest";
import { characterStatus, parseMetaResult } from "@/lib/seo-meta";

describe("SEO character targets", () => {
  it("marks titles green only at 50–60 characters", () => {
    expect(characterStatus("a".repeat(49), "title").status).toBe("short");
    for (const count of [50, 55, 60]) expect(characterStatus("a".repeat(count), "title").status).toBe("good");
    expect(characterStatus("a".repeat(61), "title").status).toBe("long");
  });
  it("marks descriptions green only at 150–160 characters", () => {
    expect(characterStatus("a".repeat(149), "description").status).toBe("short");
    for (const count of [150, 155, 160]) expect(characterStatus("a".repeat(count), "description").status).toBe("good");
    expect(characterStatus("a".repeat(161), "description").status).toBe("long");
  });
  it("requires exactly three unique titles and descriptions", () => {
    const variations = [1, 2, 3].map((n) => ({ title: `Title ${n}`, description: `Description ${n}` }));
    expect(parseMetaResult(JSON.stringify({ variations }))).toHaveLength(3);
    expect(() => parseMetaResult(JSON.stringify({ variations: variations.slice(0, 2) }))).toThrow();
    expect(() => parseMetaResult(JSON.stringify({ variations: [variations[0], variations[0], variations[2]] }))).toThrow();
  });
});