import { Hono } from 'hono'
import { HistoryTable } from '../../utils/tables';
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from '../middleware/authMiddleware';

const History = new Hono<{ Bindings: CloudflareBindings }>();

// Prévenir le Durable Object de l'utilisateur pour qu'il broadcast aux sessions ouvertes.
// Un échec de broadcast ne doit jamais faire échouer l'écriture en base.
const notifyHistoryDO = async (
    env: CloudflareBindings,
    userid: string,
    payload: { type: 'history_added' | 'history_updated'; entry: unknown }
) => {
    try {
        const id = env.HISTORY_DO.idFromName(userid);
        const stub = env.HISTORY_DO.get(id);

        await stub.fetch('http://dummy/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('[History] Error notifying Durable Object:', err);
    }
};

// WebSocket temps réel : un Durable Object par utilisateur
History.get('/:userid/ws', async (c) => {
    const { userid } = c.req.param();

    try {
        const id = c.env.HISTORY_DO.idFromName(userid);
        const stub = c.env.HISTORY_DO.get(id);

        const url = new URL(c.req.url);
        url.searchParams.set('userId', userid);

        return stub.fetch(url.toString(), c.req.raw);
    } catch (err) {
        console.error('[History] Error connecting to Durable Object:', err);
        return new Response('Error connecting to WebSocket', { status: 500 });
    }
});

History.get('/me', authMiddleware, async ({ env, req, json, status }) => {
    const user = req.get('user')
    const history = HistoryTable(env)
    try {
        const data = await history.findAll({
            where: {
                userid: user.userId,
            },
            orderBy: { column: 'lastReading', direction: 'DESC' },
        })
        return json({
            message: "liste des articles",
            data: data
        })
    } catch (error) {
        console.log(error)
        status(500)
        return json({ message: "Impossible de charger l'historique", error: String(error) })
    }
})


History.post('/:userid/:articleid', async ({ json, env, req, status }) => {

    const history = HistoryTable(env)
    const { userid, articleid } = req.param()
    const { articleImage, articleTitle, articleCreatedAt } = await req.json()
    try {
        const check = await history.findOne({
            where: {
                articleid: articleid,
                userid: userid,
            },
        })
        if (check) {
            // La clé primaire est l'uuid de la ligne, pas l'articleid : passer articleid
            // ici ne mettait jamais lastReading à jour.
            const updated = await history.update(check.id, {
                lastReading: new Date().toISOString(),
            })

            await notifyHistoryDO(env, userid, {
                type: 'history_updated',
                entry: updated ?? { ...check, lastReading: new Date().toISOString() },
            })

            return json({
                message: "article deja dans l'Historique"
            })
        }
        const created = await history.create({
            id: uuidv4(),
            articleid: articleid,
            articleImage: articleImage,
            articleTitle: articleTitle,
            articleCreatedAt: articleCreatedAt,
            userid: userid,
            lastReading: new Date().toISOString()
        })

        await notifyHistoryDO(env, userid, { type: 'history_added', entry: created })

        return json({
            message: "article sauvegardé"
        })
    } catch (error) {
        console.log(error)
        status(500)
        return json({ message: "Impossible d'enregistrer l'article", error: String(error) })
    }


})

export default History;
