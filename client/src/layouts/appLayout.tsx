import { createRoute, Outlet, type AnyRoute } from "@tanstack/react-router";
import { useWhoAmI } from "@/hooks/useWhoAmI";

function AppLayoutComponent() {
  const userQuery = useWhoAmI(true);
  return (
    <>
      {!userQuery.isFetching && !userQuery.isLoading && userQuery.data ? (
        <div className="w-full h-full flex">
          <Outlet />
        </div>
      ) : null}
    </>
  );
}

export const AppLayout = (parentRoute: AnyRoute) =>
  createRoute({
    path: "app",
    component: AppLayoutComponent,
    getParentRoute: () => parentRoute,
  });
