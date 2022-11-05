import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPost } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "slug is required");

  const post = await getPost(params.slug);

  invariant(post, "post not found");

  return json({ post: { title: post.title, content: marked(post.markdown) } });
};

const Post = () => {
  const { post } = useLoaderData<typeof loader>();

  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="my-6 text-3xl text-center border-b-2">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
};

export default Post;
