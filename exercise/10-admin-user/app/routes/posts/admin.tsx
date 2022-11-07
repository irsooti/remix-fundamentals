import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPostListItems } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

// 🐨 get the request from the loader
export async function loader({ request }: LoaderArgs) {
  // 🐨 call requireAdminUser from session.server with the request
  requireAdminUser(request);
  return json({ posts: await getPostListItems() });
}

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="my-6 mb-2 text-3xl text-center border-b-2">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.slug}
                  className="text-blue-600 underline"
                  prefetch="intent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="new"
                className="text-blue-600 underline"
                prefetch="intent"
              >
                ➕ Create New Post
              </Link>
            </li>
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
