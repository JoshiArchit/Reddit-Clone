/*
Mutation for creating a post
*/

import { mutation, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { Doc, Id } from "./_generated/dataModel";

type EnrichedPost = Omit<Doc<"post">, "subreddit"> & {
  author: { username: string } | undefined;
  subreddit:
    | {
        _id: Id<"subreddit">;
        name: string;
      }
    | undefined;
  imageUrl?: string;
};

const ERROR_MESSAGES = {
  POST_NOT_FOUND: "Post not found",
  SUBREDDIT_NOT_FOUND: "Subreddit not found",
  UNAUTHORIZED_DELETE: "You are not authorized to delete this post",
} as const;

// Mutation to create post from submission
export const create = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    subreddit: v.id("subreddit"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const postId = await ctx.db.insert("post", {
      subject: args.subject,
      body: args.body,
      authorId: user._id,
      subreddit: args.subreddit,
      image: args.storageId || undefined,
    });

    return postId;
  },
});

// Query to get post with enriched data
async function getEnrichedPost(
  ctx: QueryCtx,
  post: Doc<"post">
): Promise<EnrichedPost> {
  const [author, subreddit] = await Promise.all([
    ctx.db.get(post.authorId),
    ctx.db.get(post.subreddit),
  ]);
  const image = post.image && (await ctx.storage.getUrl(post.image));
  return {
    ...post,
    author: author ? { username: author.username } : undefined,
    subreddit: subreddit
      ? { _id: subreddit._id, name: subreddit.name }
      : undefined,
    imageUrl: image ?? undefined,
  };
}

// Helper function to get enriched posts
async function getEnrichedPosts(
  ctx: QueryCtx,
  posts: Doc<"post">[]
): Promise<EnrichedPost[]> {
  return Promise.all(posts.map((post) => getEnrichedPost(ctx, post)));
}

// Query to get post by id
export const getPost = query({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new ConvexError(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    return getEnrichedPost(ctx, post);
  },
});

// Query to get all posts for subreddit
export const getSubredditPosts = query({
  args: { subredditName: v.string() },
  handler: async (ctx, args): Promise<EnrichedPost[]> => {
    const subreddit = await ctx.db
      .query("subreddit")
      .filter((e) => e.eq(e.field("name"), args.subredditName))
      .unique();

    if (!subreddit) {
      throw new ConvexError(ERROR_MESSAGES.SUBREDDIT_NOT_FOUND);
    }

    const posts = await ctx.db
      .query("post")
      .withIndex("bySubreddit", (e) => e.eq("subreddit", subreddit._id))
      .collect();

    return getEnrichedPosts(ctx, posts);
  },
});

// Query to get post for a user
export const userPosts = query({
  args: { authorUsername: v.string() },
  handler: async (ctx, args): Promise<EnrichedPost[]> => {
    const user = await ctx.db
      .query("users")
      .filter((e) => e.eq(e.field("username"), args.authorUsername))
      .unique();

    if (!user) {
      return [];
    }

    const posts = await ctx.db
      .query("post")
      .withIndex("byAuthor", (e) => e.eq("authorId", user._id))
      .collect();

    return getEnrichedPosts(ctx, posts);
  },
});

// Mutation to delete a post
export const deletePost = mutation({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const post = await ctx.db.get(args.id);

    if (!post) {
      throw new ConvexError(ERROR_MESSAGES.POST_NOT_FOUND);
    }

    // Check if the user is the author of the post
    if (post.authorId !== user._id) {
      throw new ConvexError(ERROR_MESSAGES.UNAUTHORIZED_DELETE);
    }

    await ctx.db.delete(args.id);
  },
});
