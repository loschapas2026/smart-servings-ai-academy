import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  rootRouteId,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/SiteHeader";
import { routeTree } from "@/routeTree.gen";
import { Route as IndexRoute } from "@/routes/index";
import { Route as VendasRoute } from "@/routes/vendas";

// The presentation page is shown to prospects by its own address. The app itself
// must stay independent from it: / is a real landing page, the presentation keeps
// its own address, and the shared site header never points at it.
async function renderHeader() {
  const root = createRootRoute({ component: () => <SiteHeader /> });
  const home = createRoute({ getParentRoute: () => root, path: "/" });
  const router = createRouter({
    routeTree: root.addChildren([home]),
    history: createMemoryHistory(),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Presentation page isolation", () => {
  it("keeps / as a real landing page instead of a bounce to the presentation", () => {
    expect(typeof IndexRoute.options.component).toBe("function");
    expect(IndexRoute.options.beforeLoad).toBeUndefined();
  });

  it("keeps the presentation at its own address", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/vendas");
    const last = matches.at(-1);

    expect(last?.routeId).not.toBe(rootRouteId);
    expect(last?.routeId).toBe("/vendas");
    expect(typeof VendasRoute.options.component).toBe("function");
  });

  it("does not offer the presentation from the shared site header", async () => {
    const { container } = await renderHeader();
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));

    expect(hrefs).not.toContain("/vendas");
    expect(hrefs).toContain("/planos");
  });
});
