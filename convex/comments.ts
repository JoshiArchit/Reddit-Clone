import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

export const create = mutation({
  args: {
    content: v.string(),
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const commentId = await ctx.db.insert("comment", {
      content: args.content,
      postId: args.postId,
      authorId: user._id,
    });

    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comment")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    // Get enriched comments -> include author username
    const authorIds = [...new Set(comments.map((comment) => comment.authorId))];
    const authors = await Promise.all(
        authorIds.map((id) => ctx.db.get(id))
    )
    // Create a map of authorId to author username
    const authorMap = new Map(
        authors.map((author) => [author!._id, author!.username])
    )

    return comments.map((comment) => ({
        ...comment,
        author: {
            username: authorMap.get(comment.authorId) || "deleted",
        }
    }))
  },
});
