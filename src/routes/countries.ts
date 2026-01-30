import { Hono } from 'hono'
import { CountryTable } from '../../utils/tables';
import { v4 as uuidv4 } from "uuid";
import { PAYS } from '../../list_contries';

const Countries = new Hono<{ Bindings: CloudflareBindings }>();

Countries.get('/all-country', async ({ env, req, res, json }) => {
    const countries = CountryTable(env)
    const data = await countries.findAll()
    return json({
        message: 'liste des Pays',
        data: data
    })
})


Countries.get('/save-countries', async ({ json, env }) => {

    const countries = CountryTable(env)

    PAYS.forEach(async element => {
        await countries.create({
            id: uuidv4(),
            name: element.name,
            code_2: element.alpha2Code,
            code_3: element.alpha3Code,
            phoneCode: element.callingCodes[0]
        })
    })

    return json({
        message: 'pays sauvegardé'
    })
})

export default Countries;