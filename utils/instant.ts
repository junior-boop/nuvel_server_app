import { init, id } from "@instantdb/admin";

export function getDB(env: CloudflareBindings) {
    return init({
        appId: env.INSTANT_APP_ID,
        adminToken: env.INSTANT_ADMIN_TOKEN,
    });
}

export { id };