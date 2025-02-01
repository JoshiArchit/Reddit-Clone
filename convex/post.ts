/*
Mutation for creating a post
*/

import { mutation, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

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
