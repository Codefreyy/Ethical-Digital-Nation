import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({ title: v.string(), description: v.optional(v.string()), file: v.id('_storage') }),
    users: defineTable({
        _id: v.id('users'),
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.any()),
        username: v.optional(v.string()),
        role: v.optional(v.string()),
        organization: v.optional(v.string()),
        bio: v.optional(v.string()),
        researchInterests: v.optional(v.string()),
        email: v.optional(v.string()),
    }),
    events: defineTable({
        _id: v.id('events'),
        name: v.string(),
        description: v.string(),
        date: v.optional(v.string()),
        location: v.optional(v.string()),
        creatorId: v.string(),
        link: v.optional(v.string()),
        isContactPublic: v.boolean(),
    }),
    event_participants: defineTable({
        eventId: v.id('events'),
        userId: v.id('users'),
    }),
});