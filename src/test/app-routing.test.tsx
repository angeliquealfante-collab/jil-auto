import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { workspaceTools } from "@/lib/workspace-tools";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches the workspace dashboard", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/workspace").at(-1)?.routeId).toBe("/workspace");
  });

  it("provides all five dedicated workspace modules", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(workspaceTools).toHaveLength(5);
    expect(workspaceTools.map((tool) => tool.to)).toEqual([
      "/tools/yoast-meta-generator", "/tools/review-responder", "/tools/catalog-builder", "/tools/gbp-calendar", "/tools/prompt-vault",
    ]);
    for (const tool of workspaceTools) {
      expect(router.matchRoutes(tool.to).at(-1)?.routeId).toBe(tool.to);
    }
  });

  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
