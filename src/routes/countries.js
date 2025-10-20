import { Hono } from 'hono'
import { Prisma } from "../utils/functions";

import {PAYS} from '../../AllCountry'

const Countries = new Hono()

Countries.get('/all-country', async({ env, req, res, json}) => {
    const prisma = Prisma(env)
    const data = await prisma.country.findMany()
    return json({
        message : 'liste des Pays',
        data : data
    })
})


Countries.get('/save-countries', async({json, env}) => {

    const prisma = Prisma(env)

    PAYS.forEach(async element => {
        await prisma.country.create({
            data : {
                name : element.name,
                countryCalledIndex : element.callingCodes[0], 
                alpha2code : element.alpha2Code
            }
        })
    })

    return json({
        message : 'pays sauvegardé'
    })
})


// Countries.get('/save-cities', async ({json, env}) => {
//     const prisma = Prisma(env)
//     Cities.forEach( async element => {
//         await prisma.city.create({
//             data : {
//                 name : element.name, 
//                 countryAlpha : element.country
//             }
//         })
//     });
    

//     return json({
//         message : 'ville sauvegardé'
//     })
// })
export default Countries

