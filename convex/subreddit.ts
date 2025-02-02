/* Mutation for creating a subreddit */
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { v, ConvexError } from "convex/values";
import { getEnrichedPosts } from "./post";

// Mutation to create subreddit from submission
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const subreddit = await ctx.db.query("subreddit").collect();

    if (subreddit.some((s) => s.name === args.name)) {
      throw new Error("Subreddit already exists");
    }

    await ctx.db.insert("subreddit", {
      name: args.name,
      description: args.description,
      creatorId: user._id,
    });
  },
});

// Mutation to retrive subreddits
export const get = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const subreddit = await ctx.db
      .query("subreddit")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();

    if (!subreddit) {
      return null;
    }

    const post = await ctx.db
      .query("post")
      .withIndex("bySubreddit", (q) => q.eq("subreddit", subreddit._id))
      .collect();

    const enrichedPosts = await getEnrichedPosts(ctx, post);

    return {...subreddit, posts: enrichedPosts};
  },
});
