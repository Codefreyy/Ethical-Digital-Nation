import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({ title: v.string(), description: v.optional(v.string()), file: v.id('_storage') }),
    users: defineTable({
        tokenIdentifier: v.string(),
    }),
    events: defineTable({
        name: v.string(),
        description: v.string(),
        date: v.string(),
        location: v.string(),
    }),
});