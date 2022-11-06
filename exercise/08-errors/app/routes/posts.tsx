import { Outlet, useCatch } from "@remix-run/react";

export default function HiddenParentRoute() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>Oh no! {error.message}</div>;
}

export function CatchBoundary() {
  const error = useCatch();
  return <div>Oh no! {error.status}</div>;
}
