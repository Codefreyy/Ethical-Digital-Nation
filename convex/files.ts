import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createFile = mutation({
    args: {
        name: v.string()
    },
    async handler(ctx, args) {
        try {
            const identity = await ctx.auth.getUserIdentity()
            if (!identity) {
                throw new Error('not authenticated')
            }
            await ctx.db.insert('files', {
                name: args.name
            })
        } catch (err) {
            throw new Error('failed to create file: ' + (err as Error).message)
        }

    }
})

export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            return []
        }
        return ctx.db.query('files').collect()
    }
})