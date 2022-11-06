import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

// 🐨 you'll need to import `deletePost` and `updatePost` here as well.
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "slug not found");
  if (params.slug === "new") {
    return json({ post: null });
  }

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);
  return json({ post });
}

// 🐨 you'll need the `params` in the action
export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  // 🐨 grab the "intent" from the form data
  const intent = formData.get("intent");
  const slug = formData.get("slug");
  invariant(params.slug, "slug not found");

  console.log({ intent, slug });

  if (intent === "delete") {
    // 🐨 call `deletePost` here
    deletePost(params.slug);
    return redirect("/posts/admin");
  }

  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors: any = {
    title: title ? null : "Title is required",
    markdown: markdown ? null : "Markdown is required",
  };

  if (intent === "create") {
    errors.slug = slug ? null : "Slug is required";
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  // 🐨 if the params.slug is "new" then create a new post
  // otherwise update the post.

  if (intent === "create") {
    invariant(typeof slug === "string", "slug must be a string");

    await createPost({
      title,
      slug,
      markdown,
    });
  } else {
    await updatePost({
      title,
      slug: params.slug,
      markdown,
    });
  }

  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function PostAdmin() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const transition = useTransition();
  // 🐨 now that there can be multiple transitions on this page
  // we'll need to disambiguate between them. You can do that with
  // the "intent" in the form data.
  // 💰 transition.submission?.formData.get("intent")
  const isCreating = Boolean(
    transition.submission?.formData.get("intent") === "create",
  );
  const isDeleting = Boolean(
    transition.submission?.formData.get("intent") === "delete",
  );
  const isUpdating = Boolean(
    transition.submission?.formData.get("intent") === "update",
  );
  // 🐨 create an isUpdating and isDeleting variable based on the transition
  // 🐨 create an isNewPost variable based on whether there's a post on `data`.
  const isNewPost = !data.post;

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={`${inputClassName} disabled:opacity-60`}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.slug}
            disabled={Boolean(data.post)}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
          key={data?.post?.slug ?? "new"}
          defaultValue={data?.post?.markdown}
        />
      </p>
      <button
        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
        name="intent"
        value="delete"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {/* 🐨 It should say "Deleting..." when a submission with the intent "delete" is ongoing, and "Delete" otherwise. */}
      <p className="text-right">
        <button
          type="submit"
          // 🐨 add a name of "intent" and a value of "create" if this is a new post or "update" if it's an existing post
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          // 🐨 this should be disabled if we're creating *or* updating
          disabled={isCreating}
        >
          {!isNewPost
            ? isUpdating
              ? "Updating..."
              : "Update"
            : isCreating
            ? "Creating..."
            : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
