const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const {success} = require('./helper') //const helper = require('./helper') affectation destructuré!
let pokemons = require('./mock-pokemon')

//on instancie app avec express()
const app = express()
const port = 3000

//middleware logger
/*app.use((req,  res, next)=>{
    console.log(`URL : ${req.url}`)
    next()
})*/

app .use(favicon(`favicon.ico`))
    .use(morgan('dev'))

app.get('/', (req, res)=> res.send('Hello, Again Express')) //point de terminaison principale

//point de terminaison secondaire ou router
app.get('/api/pokemons/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    
    const pokemon = pokemons.find(pokemon => pokemon.id === id) //on utilise la liste de pokemons on passant leur id

    //res.send(`Vous avez demandé le pokemon ${pokemon.name}`)
    const message = 'un pokemon a bien été trouvé.'
    
    res.json(success(message, pokemon))//on recupère le json avec json()

})
//exo1 nb total de pokemon

app.get('/api/pokemons/', (req, res)=> {
    //res.send(`Il y a ${pokemons.length} pokemons dans le pokedex`)
    const message = "la liste des pokemons a bien été trouvé."
    res.json(success(message, pokemons))
})

app.listen(port, ()=> console.log(`Notre application va démarer sur: http://localhost:${port}`))