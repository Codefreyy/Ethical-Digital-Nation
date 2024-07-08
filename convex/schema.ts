import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({ title: v.string(), description: v.optional(v.string()), file: v.id('_storage') }),
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.any()),
    }),
    events: defineTable({
        _id: v.id('events'),
        name: v.string(),
        description: v.string(),
        date: v.string(),
        location: v.string(),
        creatorId: v.string(),
    }),
    event_participants: defineTable({
        eventId: v.id('events'),
        userId: v.id('users'),
    }),
});