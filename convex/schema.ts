/*
Json strict schema for convex.
Set up webhooks for Clerk to notify Convex of user events - https://docs.convex.dev/auth/database-auth#set-up-webhooks
Convex dashboard for setting env variables, etc. - https://dashboard.convex.dev/
*/

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Attributes connect local schema to Clerk schema
    username: v.string(),
    externalId: v.string(),
  })
    .index("byExternalId", ["externalId"])
    .index("byUsername", ["username"]), // Indexing by externalId
  subreddit: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creatorId: v.id("users"),
  }),
});
