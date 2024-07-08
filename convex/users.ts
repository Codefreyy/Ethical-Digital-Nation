import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert('users', {
            tokenIdentifier: args.tokenIdentifier,
            name: args.name,
            image: args.image,
        })
    }
})

export const getCurrentUser = query({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db.query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
            .first();

        return user;
    }
})
