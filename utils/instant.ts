import { init, id, i } from "@instantdb/admin";

export function getDB(env: CloudflareBindings) {
    const schema = i.schema({
        entities: {
            articlesStats: i.entity({
                articleId: i.string().indexed(),
                commentCount: i.number(),
                likeCount: i.number(),
                viewCount: i.number(),
                lastCommentAt: i.date(),
                updatedAt: i.date(),
                shareCount: i.number(),
                signals: i.json(),
            }),
            comments: i.entity({
                id: i.string().unique().indexed(),
                articleId: i.string().indexed(),
                creator: i.json(),
                content: i.string(),
                notes: i.number(),
                upvotes: i.json(),
                signals: i.json(),
                created: i.date().indexed(),
                modified: i.date().indexed(),
            }),
            notifications: i.entity({
                id: i.string().unique().indexed(),
                recipientUserId: i.string().indexed(),
                type: i.string().indexed(),
                title: i.string(),
                body: i.string(),
                data: i.json(),
                read: i.boolean().indexed(),
                actorUserId: i.string().optional(),
                articleId: i.string().optional(),
                commentId: i.string().optional(),
                createdAt: i.date().indexed(),
            }),
        }
    })


    return init({
        appId: env.INSTANT_APP_ID,
        adminToken: env.INSTANT_ADMIN_TOKEN,
        schema
    });
}





export { id };