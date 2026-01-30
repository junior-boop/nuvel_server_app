import { Hono } from 'hono'
import { HistoryTable } from '../../utils/tables';
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from '../middleware/authMiddleware';

const History = new Hono<{ Bindings: CloudflareBindings }>();

History.get('/me', authMiddleware, async ({ env, req, res, json }) => {
    const user = req.get('user')
    const history = HistoryTable(env)
    try {
        const data = await history.findAll({
            where: {
                userid: user.userId,
            },
        })
        return json({
            message: "liste des articles",
            data: data
        })
    } catch (error) {
        console.log(error)
    }
})


History.post('/:userid/:articleid', async ({ json, env, req }) => {

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
            await history.update(articleid,
                {
                    lastReading: new Date().toISOString(),
                }
            )
            return json({
                message: "article deja dans l'Historique"
            })
        }
        await history.create({
            id: uuidv4(),
            articleid: articleid,
            articleImage: articleImage,
            articleTitle: articleTitle,
            articleCreatedAt: articleCreatedAt,
            userid: userid,
            lastReading: new Date().toISOString()
        })
        return json({
            message: "article sauvegardé"
        })
    } catch (error) {
        console.log(error)
    }


})

export default History;