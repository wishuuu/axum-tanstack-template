import { createRoute, Outlet, type AnyRoute } from "@tanstack/react-router";

function AuthLayoutComponent() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}

export const AuthLayout = (parentRoute: AnyRoute) =>
  createRoute({
    path: "auth",
    component: AuthLayoutComponent,
    getParentRoute: () => parentRoute,
  });
