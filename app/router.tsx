import { createRouter } from "@tanstack/react-router";
import { RootRoute } from "~/root";
import { LayoutRoute } from "~/routes/layout";
import { NoteRoute } from "~/routes/notes/note";
import SharedNoteRoute from "~/routes/notes/shared";

// Create and export the router configuration
const routeTree = RootRoute.addChildren([
  LayoutRoute.addChildren([NoteRoute, SharedNoteRoute]),
]);

export const router = createRouter({
  routeTree: routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
