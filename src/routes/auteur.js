import { Hono } from 'hono'
import { Prisma } from '../utils/functions';

const Auteur = new Hono()

Auteur.get('/', async ({req, res, json, env}) => { 
	
    const prisma = Prisma(env)

    try {
        const data = await prisma.auteur.findMany()

        console.log(data)
        return json({
            message : 'liste des auteurs enregistés', 
            data : data
        })
    } catch(e) {
        console.log(e)
        return json({
            message : 'il ya une erreur dans le serveur'
        })
    }
});


Auteur.post('/', async({ req, res, json, env}) => {
    const prisma = Prisma(env)

    const data = await req.formData()
    const name = data.get('name')
    const surname = data.get('surname')
    const email = data.get('email')
    const tel = data.get('tel')
    const socialNetwork = data.get('socialNetwork')

    
    const saving = async () => {
        await prisma.auteur.create({
            data : {name, surname, email, tel, socialNetwork}
        })
    }

    saving()
        .then(async () => await prisma.$disconnect())
        .catch( async e => {
            console.log(e)
            await prisma.$disconnect()
            process.exit(1)
        })

    return json({
        message : 'auteur enregistre'
    })
} )


Auteur.delete('/:auteurID', async ({ json, env,  req}) => {
    const auteurID = req.param('auteurID')
    const prisma = Prisma(env)

    try {

        await prisma.auteur.delete({
            where : {
                ID : auteurID
            }
        })

        return json({ message : `auteur width ${auteurID} is succesfull delete`}, 200)
    } catch(e) {
        console.log(e)
        return json({ error : e}, 500)
    }
})

export default Auteur