import { Outlet } from "@remix-run/react";

export default function HiddenParentRoute() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>Oh no! {error.message}</div>;
}
