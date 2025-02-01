/* 
Mutation to generate an image url for posts
*/

import { mutation, query, QueryCtx } from "./_generated/server";

export const generateUploadUrl = mutation( async (ctx) => {
    const url = await ctx.storage.generateUploadUrl();
    return url; 
});