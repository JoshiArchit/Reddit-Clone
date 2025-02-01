/* Mutation for creating a subreddit */
import { mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { v } from "convex/values";

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
