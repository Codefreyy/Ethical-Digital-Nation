import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

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
            creatorId: identity.tokenIdentifier,
        })
    }
})

export const getEvents = query({
    async handler(ctx) {
        return ctx.db.query('events').collect()
    }
})

export const getEventDetails = query({
    args: {
        eventId: v.id("events"),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        console.log('identity12312', identity)
        if (!identity) {
            return { error: "not_authenticated" };
        }

        // 确认 tokenIdentifier 包含正确的前缀
        const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
            ? identity.tokenIdentifier
            : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`;

        console.log('identity', tokenIdentifier, identity.tokenIdentifier)
        const user = await ctx.db.query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
            .first();


        if (!user) {
            return { error: "user_not_found" };
        }

        const event = await ctx.db.get(args.eventId);
        if (!event) {
            return { error: "event_not_found" };
        }

        const participants = await ctx.db.query("event_participants")
            .filter(q => q.eq(q.field("eventId"), args.eventId))
            .collect();

        const isCreator = event.creatorId.split("|")[1] === user.tokenIdentifier.split("|")[1];
        console.log(event.creatorId.split("|")[1], user.tokenIdentifier.split("|")[1], 123123213213123213)
        const hasJoined = participants.some((participant: any) => {
            return participant.userId === user._id
        });

        return {
            event,
            isCreator,
            hasJoined,
        };
    }
});

export const joinEvent = mutation({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated");
        }


        // 确认 tokenIdentifier 包含正确的前缀
        const tokenIdentifier = identity.tokenIdentifier.startsWith("https://undefined|")
            ? identity.tokenIdentifier
            : `https://undefined|${identity.tokenIdentifier.split("|")[1]}`;


        const user = await ctx.db
            .query("users")
            .filter(q => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // 确认用户未参加过这个活动
        const existingParticipant = await ctx.db
            .query("event_participants")
            .filter(q => q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("eventId"), args.eventId)))
            .first();

        if (existingParticipant) {
            throw new Error("User already joined event");
        }

        return ctx.db.insert("event_participants", {
            userId: user._id,
            eventId: args.eventId,
        });
    },
});

export const getEventParticipants = query({
    args: {
        eventId: v.id("events"),
    },
    async handler(ctx, args) {
        const participants = await ctx.db.query("event_participants")
            .filter(q => q.eq(q.field("eventId"), args.eventId))
            .collect();

        if (participants.length === 0) {
            return { participants: [] };
        }

        const userIds = participants.map(p => p.userId);

        const users = await Promise.all(userIds.map(userId => ctx.db.get(userId)));

        return { participants: users };
    }
});