import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"

export const createEvent = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        date: v.string(),
        location: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('not authenticated')
        }
        return ctx.db.insert('events', {
            name: args.name,
            description: args.description,
            date: args.date,
            location: args.location,
        })
    }
})

export const getEvents = query({
    async handler(ctx) {
        return ctx.db.query('events').collect()
    }
})