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
        }
    })


    return init({
        appId: env.INSTANT_APP_ID,
        adminToken: env.INSTANT_ADMIN_TOKEN,
        schema
    });
}





export { id };