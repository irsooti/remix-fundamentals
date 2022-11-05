import { useLoaderData } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getPosts } from "~/models/posts.server";

export const loader = async (_: DataFunctionArgs) => {
  const data = await getPosts();

  return json(data);
};

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
