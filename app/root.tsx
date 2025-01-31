import { Outlet, createRootRoute } from "@tanstack/react-router";

// Create the root route
export const RootRoute = createRootRoute({
  component: () => <Outlet />,
});
