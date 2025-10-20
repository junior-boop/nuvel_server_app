/**
 * 
 * @param {number} number paramettre de la functon
 * @param {number} sublot Le nombre de chiffre disposer dans un lot
 * @returns {string}
 */

export default function IdGenerator(number, sublot = 0){
    if(typeof number !== 'number'){
        throw new Error('Le paramettre "number" prend Uniquement les numbres')
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let result = ''

    for(let i = 0; i < number; i++){
        const random = Math.floor(Math.random() * (alphabet.length - 1))
        result = result + alphabet[random]
        if( (i + 1)%sublot === 0 ) {
            if(i === 0) result = result + ''
            if(i !== 0 && (i + 1) !== number) result = result + '-'
        }
    }
    return result 
}