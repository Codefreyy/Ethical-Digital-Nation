import { GenericId, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 创建评论
export const createComment = mutation({
    args: {
        eventId: v.id("events"),
        userId: v.id("users"),
        parentId: v.optional(v.id("comments")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const { eventId, userId, parentId, content } = args;
        console.log('creating comment', eventId, userId, parentId, content)
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // 创建评论
        const commentId = await ctx.db.insert("comments", {
            eventId,
            userId,
            parentId,
            content,
            createdAt: Date.now(),
        });

        return commentId;
    },
});

// 获取评论
export const getComments = query({
    args: {
        eventId: v.id("events"),
    },
    handler: async (ctx, args) => {
        const { eventId } = args;

        // 获取顶级评论
        const topLevelComments = await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field("eventId"), eventId))
            .filter((q) => q.or(
                q.eq(q.field("parentId"), null),
                q.eq(q.field("parentId"), undefined)
            ))
            .collect();

        // 获取所有相关用户的信息
        const userIds = topLevelComments.map(comment => comment.userId);
        const users = await Promise.all(userIds.map(userId => ctx.db.get(userId)));

        // 构建用户信息字典
        const userDict: Record<string, typeof users[0]> = users.reduce((dict, user) => {
            if (user !== null) {
                dict[user._id] = user;
            }
            return dict;
        }, {} as Record<string, typeof users[0]>);

        // 递归获取子评论
        const getReplies = async (commentId: GenericId<"comments">): Promise<any> => {
            const replies = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("parentId"), commentId))
                .collect();

            // 获取子评论的用户信息
            const replyUserIds = replies.map(reply => reply.userId);
            const replyUsers = await Promise.all(replyUserIds.map(userId => ctx.db.get(userId)));

            // 构建子评论的用户信息字典
            replyUsers.forEach(user => {
                if (user !== null) {
                    userDict[user._id] = user;
                }
            });

            // 递归查询子评论的子评论
            return await Promise.all(
                replies.map(async (reply) => ({
                    ...reply,
                    user: userDict[reply.userId], // 附加用户信息
                    replies: await getReplies(reply._id),
                }))
            );
        };

        // 组装评论结构，并附加用户信息
        const res = await Promise.all(
            topLevelComments.map(async (comment) => ({
                ...comment,
                user: userDict[comment.userId], // 附加用户信息
                replies: await getReplies(comment._id),
            }))
        );

        console.log('all comments with user data', res);

        return res;
    },
});


export const deleteComment = mutation({
    args: {
        commentId: v.id("comments"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { commentId, userId } = args;

        // 获取评论
        const comment = await ctx.db.get(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }

        // 确认当前用户是评论的创建者
        if (comment.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // 删除评论
        await ctx.db.delete(commentId);

        // 递归删除子评论
        const deleteReplies = async (parentId: GenericId<"comments">) => {
            const replies = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("parentId"), parentId))
                .collect();

            for (const reply of replies) {
                await ctx.db.delete(reply._id);
                await deleteReplies(reply._id);
            }
        };

        await deleteReplies(commentId);
    },
});
