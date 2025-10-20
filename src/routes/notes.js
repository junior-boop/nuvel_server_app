import { Hono } from 'hono';
import { Prisma } from "../utils/functions";

const Notes = new Hono()

Notes.get('/', async ({req, res, json, env}) => { 

    const prisma = Prisma(env)
    const data = await prisma.notes.findMany()

	try{
        return json({
            message : 'liste des note en generale',
            data : data
        })
    } catch (error) {
        console.log(error)
    }
});

Notes.get('/user-notes/:userId', async ({env, req, res, json}) => {
    const userId = req.param("userId")
    const prisma = Prisma(env)
    const data = await prisma.notes.findMany({
        where : {
            userId : userId
        }
    })

    try{
        return json({
            message : "liste des note d'un utilisateur ",
            data : data
        })
    } catch (error) {
        console.log(error)
    }
})

Notes.get('/:noteId', async ({env, req, res, json}) => {
    const noteId = req.param('noteId')
    const prisma = Prisma(env)
    const data = await prisma.notes.findUnique({
        where : {
            Id : noteId
        }
    })

    try {
        return json({
            message : `note ${noteId}, selectionne`, 
            data : data
        })
    } catch (error) {
        console.log(error)
    }
})

Notes.post('/user-notes/:userId', async ({env, req, res, json}) => {
    const userId = req.param('userId')
    const prisma = Prisma(env)

    const noteInit = {
        note_content : '', 
        userId : userId, 
        createdBy : userId
    }

    console.log('je suis touche')

    const data = await prisma.notes.create({
        data : noteInit
    })

    return json({
        message : 'note cree avec succes', 
        data : data
    })
})

Notes.put('/:noteId', async ({ env, req, res, json, text}) => {
    const noteId = req.param("noteId")
    const formData = await req.formData()
    const prisma = Prisma(env)

    try {
        const content = formData.get('content')

    const data = await prisma.notes.update({
        where : {
            Id : noteId
        }, 
        data : {
            note_content : content
        }
    })

    // const test = {"Id":"f5521d50-79a0-4d23-8448-621242a3ec15","note_content":"","createdBy":"c52c77f6-a925-44a4-9738-873c030b152f","epingler":false,"createdAt":"2025-03-31T08:38:17.027Z","updatedAt":"2025-03-31T09:26:12.563Z","userId":"c52c77f6-a925-44a4-9738-873c030b152f"}

    return json({
        message : 'note modifié avec succes',
        data : data
    })
    } catch (error) {
        return text(error)
    }
})

Notes.delete('/:noteId', async ({env, req, res, json}) => {
    const noteId = req.param('noteId')
    const prisma = Prisma(env)

    const data = await prisma.notes.delete({
        where : {
            id : noteId
        }
    })

    return json({
        message : "note supprimer avec succes", 
        data : data
    })
})

export default Notes