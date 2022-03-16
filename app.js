//importations externes
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')//parser les req
const {Sequelize, DataTypes} = require('sequelize')//corm de connexion avec la bd

//importation internes
const {success, getUniqueId} = require('./helper') //const helper = require('./helper') affectation destructuré!
let pokemons = require('./mock-pokemon')
const PokemonModel = require('./src/models/pokemons')

//on instancie app avec express()
const app = express()
const port = 3000

//instance de sequelize mise en place de connexion avac la bd
const sequelize = new Sequelize(
    'Pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions:{
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('la connexion à la bd a reussi'))
    .catch(error => console.log(`la connexion à la bd a échouée ${error}`))

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true})
    .then(_ => {
        console.log('la bd Pokedex a bien été synchronisé')

        pokemons.map(pokemon => {
            Pokemon.create({
            name: pokemon.name,
            hp: pokemon.hp,
            cp: pokemon.cp,
            picture: pokemon.picture,
            types: pokemon.types.join()
        }).then(pokemons => console.log(pokemons.toJSON()))
        })

    })


//middleware logger
/*app.use((req,  res, next)=>{
    console.log(`URL : ${req.url}`)
    next()
})*/

app .use(favicon(__dirname +'/favicon.ico'))//la favicon
    .use(morgan('dev')) // pour les informations de log dans la console
    .use(bodyParser.json())//parser les requete entrante/sortanante en js

app.get('/', (req, res)=> res.send('Hello, Again Express')) //point de terminaison principale


//point de terminaison secondaire ou router
app.get('/api/pokemons/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    
    const pokemon = pokemons.find(pokemon => pokemon.id === id) //on utilise la liste de pokemons on passant leur id

    //res.send(`Vous avez demandé le pokemon ${pokemon.name}`)
    const message = 'un pokemon a bien été trouvé.'
    
    res.json(success(message, pokemon))//on recupère le json avec json()

})
app.get('/api/pokemons/', (req, res)=> {
    //res.send(`Il y a ${pokemons.length} pokemons dans le pokedex`)
    const message = "la liste des pokemons a bien été trouvé."
    res.json(success(message, pokemons))
    
})
//ajouter un pokemon
app.post('/api/pokemons',(req, res)=>{
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
    console.log(getUniqueId(pokemons))
})

//modifier un pokemon
app.put('/api/pokemons/:id', (req,res)=> {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, ...{id: id, Modified: new Date()}}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })

    const message  = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

//supprimer un pokemon
app.delete('/api/pokemons/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find( pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimer`
    res.json(success(message, pokemonDeleted))
})

app.listen(port, ()=> console.log(`Notre application va démarer sur: http://localhost:${port}`))

